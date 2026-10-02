'use strict';

const crypto = require('crypto');
const config = require('../config');
const logger = require('../utils/logger');
const conversation = require('../services/conversation.service');

/**
 * GET /webhook
 * Verificación del webhook que exige Meta al configurar la suscripción.
 * Meta envía hub.mode, hub.verify_token y hub.challenge.
 * Debemos responder con el challenge en texto plano si el token coincide.
 */
function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    logger.info('Webhook verificado correctamente por Meta.');
    return res.status(200).send(challenge);
  }

  logger.warn('Fallo en la verificación del webhook (token no coincide o modo inválido).');
  return res.sendStatus(403);
}

/**
 * POST /webhook
 * Recibe los eventos entrantes de WhatsApp (mensajes, estados, etc.).
 *
 * IMPORTANTE: respondemos 200 de inmediato para que Meta no reintente,
 * y procesamos el mensaje de forma asíncrona.
 */
async function receive(req, res) {
  if (!config.whatsapp.appSecret && !config.devLike) {
    logger.error('WHATSAPP_APP_SECRET no está configurado: webhook de Meta rechazado (fail-closed).');
    return res.sendStatus(403);
  }

  // Validación estricta de la firma X-Hub-Signature-256 (prevención de fail-open)
  if (config.whatsapp.appSecret) {
    const signature = req.get('x-hub-signature-256');
    if (!signature || !req.rawBody) {
      logger.warn('Petición a webhook de Meta rechazada: falta cabecera x-hub-signature-256 o cuerpo crudo.');
      return res.sendStatus(403);
    }

    const expectedSignature =
      'sha256=' +
      crypto
        .createHmac('sha256', config.whatsapp.appSecret)
        .update(req.rawBody)
        .digest('hex');

    let isValid = false;
    try {
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);
      if (sigBuffer.length === expectedBuffer.length) {
        isValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
      }
    } catch (e) {
      isValid = false;
    }

    if (!isValid) {
      logger.warn('Firma de webhook de Meta inválida.');
      return res.sendStatus(403);
    }
  }

  res.sendStatus(200); // ACK inmediato a Meta

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const messages = value.messages || [];

        // Nombre de perfil (viene en contacts).
        const profileName =
          value.contacts && value.contacts[0] && value.contacts[0].profile
            ? value.contacts[0].profile.name
            : '';

        for (const message of messages) {
          const normalized = normalizeMessage(message, profileName);
          logger.debug('Mensaje entrante:', JSON.stringify(normalized));

          if (!normalized) continue;
          // Procesamiento del flujo conversacional.
          await conversation.handleIncomingMessage(normalized).catch((err) => {
            logger.error('Error procesando mensaje:', err.message);
          });
        }
      }
    }
  } catch (err) {
    logger.error('Error en webhook receive:', err.message);
  }
}

/**
 * Normaliza un mensaje crudo de la Cloud API a una forma simple:
 *   { waId, profileName, type, text, buttonId, location: { lat, lng } }
 */
function normalizeMessage(message, profileName) {
  const base = {
    waId: message.from,
    profileName,
    type: message.type,
    text: null,
    buttonId: null,
    location: null,
  };

  switch (message.type) {
    case 'text':
      base.text = message.text && message.text.body;
      break;

    case 'interactive': {
      const inter = message.interactive || {};
      if (inter.type === 'button_reply') {
        base.buttonId = inter.button_reply.id;
        base.text = inter.button_reply.title;
      } else if (inter.type === 'list_reply') {
        base.buttonId = inter.list_reply.id;
        base.text = inter.list_reply.title;
      }
      break;
    }

    // Botones de plantilla (formato antiguo).
    case 'button':
      base.text = message.button && message.button.text;
      base.buttonId = message.button && message.button.payload;
      break;

    case 'location':
      base.location = {
        lat: message.location.latitude,
        lng: message.location.longitude,
      };
      break;

    default:
      // Tipos no soportados (imagen, audio, etc.): los ignoramos por ahora.
      base.text = '';
      break;
  }

  return base;
}

module.exports = { verify, receive };
