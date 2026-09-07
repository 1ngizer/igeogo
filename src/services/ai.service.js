'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

// El cliente lee ANTHROPIC_API_KEY del entorno automáticamente.
let client = null;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

/**
 * Genera un mensaje promocional de WhatsApp para una campaña, con IA (Claude).
 * Devuelve solo el texto listo para enviar.
 */
async function generateCampaignCopy({ producto, category, discountPercent }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('IA no configurada (falta ANTHROPIC_API_KEY)');
  }

  const prompt =
    'Eres experto en marketing de proximidad. Escribe UNA PLANTILLA de mensaje de WhatsApp para ' +
    'promocionar esta oferta. La plantilla se enviará de forma masiva (de 1 a 1000 personas), por lo tanto:\n' +
    '- NO uses nombres de personas ni nombres propios de comercios.\n' +
    '- NO uses saludos personalizados con el nombre del destinatario.\n' +
    '- Debe ser genérica y reutilizable para cualquier destinatario.\n\n' +
    `Producto o servicio: ${producto}\n` +
    `Categoría: ${category}\n` +
    `Descuento: hasta ${discountPercent}%\n` +
    '\nReglas: máximo 3 líneas, tono cercano y persuasivo, usa 1-2 emojis, menciona el descuento. ' +
    'NO incluyas enlaces, URLs ni marcadores tipo [enlace]. ' +
    'Termina invitando a la persona a RESPONDER para recibir el cupón y los detalles ' +
    '(ej. "Responde INTERESADO y te enviamos el cupón"). ' +
    'Si te refieres al negocio, hazlo de forma genérica ("nuestra tienda", "este comercio"), nunca con un nombre propio. ' +
    'Responde SOLO con el mensaje, sin comillas ni explicaciones.';

  const msg = await getClient().messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  if (msg.stop_reason === 'refusal') {
    throw new Error('La IA no pudo generar el mensaje para este contenido');
  }

  const text = (msg.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  if (!text) throw new Error('La IA devolvió una respuesta vacía');
  logger.info(`IA generó copy de campaña (${text.length} chars)`);
  return text;
}

module.exports = { generateCampaignCopy };
