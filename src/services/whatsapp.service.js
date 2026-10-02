'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Cliente para la WhatsApp Cloud API (Graph API de Meta).
 * Envía mensajes salientes al usuario.
 */
const baseUrl = () =>
  `https://graph.facebook.com/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

async function post(payload) {
  if (!config.whatsapp.accessToken || !config.whatsapp.phoneNumberId) {
    logger.warn(
      'WhatsApp no configurado (falta ACCESS_TOKEN o PHONE_NUMBER_ID). Mensaje NO enviado:',
      JSON.stringify(payload)
    );
    return null;
  }

  try {
    const { data } = await axios.post(baseUrl(), payload, {
      headers: {
        Authorization: `Bearer ${config.whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    logger.error('Error enviando mensaje a WhatsApp:', detail);
    throw err;
  }
}

/** Envía un mensaje de texto simple. */
async function sendText(to, text) {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  });
}

/**
 * Envía botones de respuesta rápida (interactive reply buttons).
 * `buttons` = [{ id, title }] (máx. 3 según la API).
 */
async function sendButtons(to, bodyText, buttons) {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title.slice(0, 20) },
        })),
      },
    },
  });
}

/**
 * Envía un mensaje de lista interactiva (hasta 10 filas).
 * `rows` = [{ id, title, description }].
 */
async function sendList(to, bodyText, buttonLabel, rows) {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: {
        button: buttonLabel.slice(0, 20),
        sections: [
          {
            title: 'Opciones',
            rows: rows.slice(0, 10).map((r) => ({
              id: r.id,
              title: r.title.slice(0, 24),
              description: (r.description || '').slice(0, 72),
            })),
          },
        ],
      },
    },
  });
}

/**
 * Envía una "tarjeta" (mensaje interactivo con imagen de cabecera + botones de respuesta).
 * `imageUrl` opcional; `buttons` = [{ id, title }] (máx. 3).
 */
async function sendCard(to, { imageUrl, body, buttons }) {
  const interactive = {
    type: 'button',
    body: { text: body },
    action: {
      buttons: (buttons || []).slice(0, 3).map((b) => ({
        type: 'reply',
        reply: { id: b.id, title: b.title.slice(0, 20) },
      })),
    },
  };
  if (imageUrl) interactive.header = { type: 'image', image: { link: imageUrl } };
  return post({ messaging_product: 'whatsapp', to, type: 'interactive', interactive });
}

/** Envía un mensaje de ubicación (abre el mapa en WhatsApp). */
async function sendLocation(to, lat, lng, name, address) {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'location',
    location: { latitude: lat, longitude: lng, name: name || '', address: address || '' },
  });
}

/** Envía una imagen alojada en una URL pública (p. ej. un código QR). */
async function sendImage(to, imageUrl, caption = '') {
  return post({
    messaging_product: 'whatsapp',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

/**
 * Envía un mensaje basado en plantilla aprobada (obligatorio para despachos fuera de ventana 24h).
 * @param {string} to  Número de destino (ej. 573001234567).
 * @param {string} templateName Nombre de la plantilla registrada en Meta (ej. 'oferta_cercana').
 * @param {string} [languageCode='es'] Código de idioma.
 * @param {Array} [components=[]] Parámetros de la plantilla (cuerpo, cabecera, botones).
 */
async function sendTemplate(to, templateName, languageCode = 'es', components = []) {
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
    },
  };
  if (Array.isArray(components) && components.length > 0) {
    payload.template.components = components;
  }
  return post(payload);
}

module.exports = { sendText, sendButtons, sendList, sendCard, sendLocation, sendImage, sendTemplate };
