'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

// El cliente lee ANTHROPIC_API_KEY del entorno automáticamente.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';
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
    model: MODEL,
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

/**
 * Revisa si el texto de una campaña es engañoso, ofensivo o incumple las
 * políticas básicas de contenido comercial de WhatsApp Business, antes de
 * permitir que se publique. No bloquea si la IA no está configurada o falla
 * (fail-open): es una capa de ayuda, no debe tumbar la creación de campañas.
 */
async function moderateCampaignCopy({ producto, description, discountPercent }) {
  if (!process.env.ANTHROPIC_API_KEY) return { ok: true };

  const prompt =
    'Eres un moderador de contenido para una plataforma de cupones de WhatsApp Business. ' +
    'Revisa si esta oferta es engañosa, usa lenguaje ofensivo/ilegal, o promete algo imposible ' +
    '(ej. "100% gratis" sin serlo, descuentos superiores a 100%, contenido para adultos, armas, drogas). ' +
    `Producto/servicio: ${producto}\n` +
    `Descripción: ${description || '(sin descripción)'}\n` +
    `Descuento declarado: ${discountPercent}%\n\n` +
    'Responde EXCLUSIVAMENTE con un JSON válido, sin texto adicional, con esta forma exacta: ' +
    '{"ok": true} si la oferta es aceptable, o {"ok": false, "reason": "motivo breve en español"} si no lo es.';

  try {
    const msg = await getClient().messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = (msg.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: true };
    const parsed = JSON.parse(match[0]);
    if (parsed.ok === false) {
      return { ok: false, reason: parsed.reason || 'Contenido no permitido.' };
    }
    return { ok: true };
  } catch (err) {
    logger.error('moderateCampaignCopy falló, se deja pasar (fail-open):', err.message);
    return { ok: true };
  }
}

/**
 * Genera una recomendación breve en lenguaje natural para el comercio, a
 * partir de los resultados reales de una campaña ya despachada.
 */
async function generateCampaignInsight({ producto, category, discountPercent, sentCount, interestedCount }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('IA no configurada (falta ANTHROPIC_API_KEY)');
  }
  const rate = sentCount > 0 ? ((interestedCount / sentCount) * 100).toFixed(1) : '0';

  const prompt =
    'Eres un analista de marketing de proximidad. Con estos resultados reales de una campaña de ' +
    'WhatsApp, escribe UNA recomendación breve y accionable para el dueño del negocio (no un resumen, ' +
    'una sugerencia concreta de qué hacer en la próxima campaña).\n\n' +
    `Producto: ${producto}\n` +
    `Categoría: ${category}\n` +
    `Descuento ofrecido: ${discountPercent}%\n` +
    `Mensajes enviados: ${sentCount}\n` +
    `Personas interesadas: ${interestedCount}\n` +
    `Tasa de conversión: ${rate}%\n\n` +
    'Máximo 2 líneas, tono directo y útil, sin relleno. Responde SOLO con la recomendación, sin comillas.';

  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (msg.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  if (!text) throw new Error('La IA devolvió una respuesta vacía');
  return text;
}

module.exports = { generateCampaignCopy, moderateCampaignCopy, generateCampaignInsight };
