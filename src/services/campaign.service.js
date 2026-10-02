'use strict';

const User = require('../models/User');
const Campaign = require('../models/Campaign');
const wa = require('./whatsapp.service');
const config = require('../config');
const logger = require('../utils/logger');

const EARTH_M = 6378100; // radio terrestre en metros (para $centerSphere)

// Meta rechaza variables vacías o con saltos de línea/tabs/espacios repetidos.
function tplParam(value, fallback) {
  const s = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, 60);
  return s || fallback;
}

/**
 * Resuelve los waId de la audiencia de una campaña: usuarios (no clientes),
 * dentro del radio y con la categoría entre sus intereses.
 * USO INTERNO: los destinatarios NUNCA se exponen al cliente (modelo de negocio).
 */
async function resolveAudienceWaIds(campaign, limit) {
  const [lng, lat] = campaign.location.coordinates;
  const query = {
    role: { $ne: 'cliente' },
    state: { $nin: ['opted_out', 'new', 'awaiting_optin'] }, // solo usuarios activos y con opt-in
    waId: { $ne: campaign.cliente }, // no enviarse a sí mismo
    lastLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], campaign.radius / EARTH_M] },
    },
  };
  if (campaign.category) query.categories = campaign.category;
  const users = await User.find(query).select('waId').limit(limit).lean();
  return users.map((u) => u.waId);
}

/** Compone el texto del mensaje de campaña (plantilla del cliente + CTA). */
function buildMessage(campaign) {
  let body = String(campaign.description || '').trim();
  if (!body) {
    const off = campaign.discountPercent ? ` con *${campaign.discountPercent}% de descuento*` : '';
    body = `🎉 ¡Nueva promoción en ${campaign.producto}${off}!`;
  }
  // Añadir el llamado a la acción si la plantilla no lo trae ya.
  if (!/interesad/i.test(body)) {
    body += '\n\n👉 Responde *INTERESADO* para recibir los detalles y el contacto.';
  }
  return body;
}

/**
 * Despacha una campaña a su audiencia por WhatsApp.
 *  - Exige estado 'pagada'.
 *  - Bloqueo atómico a 'enviando' para evitar despachos duplicados concurrentes.
 *  - Envía solo mediante la plantilla aprobada en Meta (sin texto libre: fuera de la ventana de 24 h no está permitido).
 *  - Respeta el tope de mensajes del plan (campaign.messages).
 *  - Envía en lotes con pausa para no exceder los límites de Meta.
 *  - Marca a cada destinatario con pendingCampaign para el flujo INTERESADO.
 * Devuelve { attempted, sent, failed }.
 */
async function dispatchCampaign(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error('Campaña no encontrada');
  if (campaign.status === 'enviada') throw new Error('La campaña ya fue enviada');
  if (campaign.status === 'enviando') throw new Error('La campaña ya se está despachando actualmente');
  if (campaign.status === 'rechazada') throw new Error('La campaña está rechazada');
  if (campaign.status !== 'pagada') throw new Error('La campaña no puede despacharse porque no ha sido pagada');

  // Bloqueo atómico de despacho
  const locked = await Campaign.findOneAndUpdate(
    { _id: campaignId, status: 'pagada' },
    { $set: { status: 'enviando' } },
    { new: true }
  );
  if (!locked) {
    throw new Error('No se pudo iniciar el despacho: la campaña cambió de estado o ya está en proceso');
  }

  const cap = locked.messages || locked.estimatedReach || 0;
  const audience = await resolveAudienceWaIds(locked, cap > 0 ? cap : 1000);
  const { templateName, templateLang } = config.whatsapp;

  let sent = 0;
  let failed = 0;
  const BATCH = 10;
  for (let i = 0; i < audience.length; i += BATCH) {
    const slice = audience.slice(i, i + BATCH);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      slice.map(async (waId) => {
        try {
          const discountText = locked.discountPercent ? `${locked.discountPercent}% de descuento` : 'descuento especial';
          const components = [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: tplParam(locked.producto, 'Oferta local') },
                { type: 'text', text: discountText },
              ],
            },
          ];

          await wa.sendTemplate(waId, templateName, templateLang, components);
          await User.updateOne({ waId }, { pendingCampaign: locked._id });
          sent += 1;
        } catch (e) {
          failed += 1;
          logger.warn(`Campaña ${locked._id}: fallo a ${waId}: ${e.message}`);
        }
      })
    );
    // Pausa entre lotes para respetar los límites de la Cloud API.
    if (i + BATCH < audience.length) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  locked.sentCount = sent;
  locked.sentAt = new Date();
  locked.status = 'enviada';
  await locked.save();

  logger.info(
    `Campaña ${locked._id} despachada: ${sent} enviados, ${failed} fallidos (audiencia ${audience.length})`
  );
  return { attempted: audience.length, sent, failed };
}

module.exports = { dispatchCampaign, resolveAudienceWaIds, buildMessage };
