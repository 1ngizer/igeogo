'use strict';

const User = require('../models/User');
const Campaign = require('../models/Campaign');
const wa = require('./whatsapp.service');
const logger = require('../utils/logger');

const EARTH_M = 6378100; // radio terrestre en metros (para $centerSphere)

/**
 * Resuelve los waId de la audiencia de una campaña: usuarios (no clientes),
 * dentro del radio y con la categoría entre sus intereses.
 * USO INTERNO: los destinatarios NUNCA se exponen al cliente (modelo de negocio).
 */
async function resolveAudienceWaIds(campaign, limit) {
  const [lng, lat] = campaign.location.coordinates;
  const query = {
    role: { $ne: 'cliente' },
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
 *  - Respeta el tope de mensajes del plan (campaign.messages).
 *  - Envía en lotes con pausa para no exceder los límites de Meta.
 *  - Marca a cada destinatario con pendingCampaign para el flujo INTERESADO.
 * Devuelve { attempted, sent, failed }.
 */
async function dispatchCampaign(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error('Campaña no encontrada');
  if (campaign.status === 'enviada') throw new Error('La campaña ya fue enviada');
  if (campaign.status === 'rechazada') throw new Error('La campaña está rechazada');

  const cap = campaign.messages || campaign.estimatedReach || 0;
  const audience = await resolveAudienceWaIds(campaign, cap > 0 ? cap : 1000);
  const message = buildMessage(campaign);

  let sent = 0;
  let failed = 0;
  const BATCH = 10;
  for (let i = 0; i < audience.length; i += BATCH) {
    const slice = audience.slice(i, i + BATCH);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      slice.map(async (waId) => {
        try {
          await wa.sendText(waId, message);
          await User.updateOne({ waId }, { pendingCampaign: campaign._id });
          sent += 1;
        } catch (e) {
          failed += 1;
          logger.warn(`Campaña ${campaign._id}: fallo a ${waId}: ${e.message}`);
        }
      })
    );
    // Pausa entre lotes para respetar los límites de la Cloud API.
    if (i + BATCH < audience.length) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  campaign.sentCount = sent;
  campaign.sentAt = new Date();
  campaign.status = 'enviada';
  await campaign.save();

  logger.info(
    `Campaña ${campaign._id} despachada: ${sent} enviados, ${failed} fallidos (audiencia ${audience.length})`
  );
  return { attempted: audience.length, sent, failed };
}

module.exports = { dispatchCampaign, resolveAudienceWaIds, buildMessage };
