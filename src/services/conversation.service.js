'use strict';

const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Campaign = require('../models/Campaign');
const config = require('../config');
const logger = require('../utils/logger');
const wa = require('./whatsapp.service');
const matching = require('./matching.service');
const { generateRedemptionCode } = require('../utils/code');
const { reverseGeocode } = require('../utils/geo');

/**
 * Máquina de estados del bot de igeogo.
 *
 * Estados:
 *   new / awaiting_optin   -> saludo + aceptar términos
 *   awaiting_categories    -> elegir categorías de interés
 *   awaiting_location      -> compartir ubicación
 *   choosing_previous      -> elegir una ubicación del historial
 *   active                 -> menú principal (buscar por ubic. actual/anterior)
 *
 * @param {Object} msg  Mensaje normalizado por el webhook.
 *   { waId, profileName, type, text, buttonId, location: { lat, lng } }
 */
async function handleIncomingMessage(msg) {
  const { waId, profileName } = msg;

  let user = await User.findOne({ waId });
  if (!user) {
    // Cada número nuevo que escribe queda registrado como usuario.
    user = await User.create({ waId, profileName, state: 'new' });
    logger.info(`Nuevo usuario registrado: ${waId} (${profileName || 'sin nombre'})`);
  } else if (profileName && user.profileName !== profileName) {
    user.profileName = profileName;
  }

  // Si comparte una ubicación (tras el opt-in), la registramos y buscamos.
  if (msg.location && user.state !== 'new' && user.state !== 'awaiting_optin') {
    return handleLocation(user, msg.location);
  }

  switch (user.state) {
    case 'new':
      return greet(user);
    case 'awaiting_optin':
      return handleOptIn(user, msg);
    case 'awaiting_categories':
      return handleCategories(user, msg);
    case 'awaiting_location':
      if (msg.location) return handleLocation(user, msg.location);
      return wa.sendText(
        waId,
        '📍 Comparte tu ubicación con el clip 📎 → *Ubicación* → *Enviar tu ubicación actual*.'
      );
    case 'choosing_previous':
      return handleChoosingPrevious(user, msg);
    case 'active':
      return handleActive(user, msg);
    default:
      return greet(user);
  }
}

/** Botones de categorías (reutilizado en varios puntos). */
function categoryButtons() {
  return [
    { id: 'cat_comida', title: '🍔 Comida' },
    { id: 'cat_ropa', title: '👕 Ropa' },
    { id: 'cat_servicios', title: '🛠️ Servicios' },
  ];
}

/** Saludo inicial + solicitud de opt-in. */
async function greet(user) {
  user.state = 'awaiting_optin';
  await user.save();

  return wa.sendButtons(
    user.waId,
    '👋 ¡Hola! Soy *igeogo*, tu buscador de ofertas cercanas.\n\n' +
      'Te enviaré cupones de descuento de comercios cerca de ti según tus intereses.\n\n' +
      '¿Aceptas los términos y el uso de tu ubicación para mostrarte ofertas?',
    [
      { id: 'optin_yes', title: 'Acepto ✅' },
      { id: 'optin_no', title: 'No, gracias' },
    ]
  );
}

/** Procesa la aceptación de términos. */
async function handleOptIn(user, msg) {
  const said = (msg.buttonId || msg.text || '').toLowerCase().trim();
  const accepted =
    said.includes('optin_yes') || said.includes('acept') || said === 'si' || said === 'sí';
  const rejected =
    said.includes('optin_no') || said === 'no' || said.includes('no gracias') || said.includes('no, gracias');

  if (rejected) {
    return wa.sendText(
      user.waId,
      'Sin problema 🙂. Cuando quieras empezar a recibir ofertas, escríbeme *Hola* de nuevo.'
    );
  }

  if (!accepted) {
    // El usuario escribió algo distinto (ej. "Hola") en vez de pulsar el botón:
    // reenviamos el saludo con los botones de opt-in.
    return greet(user);
  }

  user.state = 'awaiting_categories';
  user.optInAt = new Date();
  await user.save();

  return wa.sendButtons(
    user.waId,
    '¡Genial! 🎉 ¿Qué tipo de ofertas te interesan? Elige una para empezar (luego puedes cambiarlas):',
    categoryButtons()
  );
}

/** Procesa la selección de categorías. */
async function handleCategories(user, msg) {
  const raw = (msg.buttonId || msg.text || '').toLowerCase();
  const selected = config.business.categories.filter((c) => raw.includes(c));

  if (selected.length === 0) {
    return wa.sendButtons(user.waId, 'No reconocí esa categoría. Elige una de estas:', categoryButtons());
  }

  user.categories = selected;
  user.state = 'awaiting_location';
  await user.save();

  return wa.sendText(
    user.waId,
    `Perfecto, buscaré ofertas de: *${selected.join(', ')}*.\n\n` +
      '📍 Ahora comparte tu ubicación actual para buscar ofertas cerca de ti:\n' +
      'Toca el clip 📎 → *Ubicación* → *Enviar tu ubicación actual*.'
  );
}

/**
 * Registra una ubicación compartida en el historial y entrega cupones.
 */
async function handleLocation(user, location) {
  const label = await reverseGeocode(location.lat, location.lng);

  if (!Array.isArray(user.locations)) user.locations = [];
  user.locations.push({
    type: 'Point',
    coordinates: [location.lng, location.lat],
    label,
    at: new Date(),
  });
  user.lastLocation = { type: 'Point', coordinates: [location.lng, location.lat] };
  user.lastLocationAt = new Date();
  user.state = 'active';
  await user.save();

  return searchAndDeliver(user, location.lng, location.lat, label);
}

/**
 * Busca cupones dentro de `radius` (metros) y los envía como tarjetas.
 * Si no hay resultados, ofrece ampliar el radio o buscar en toda la ciudad.
 */
async function searchAndDeliver(user, lng, lat, label, radius) {
  const r = radius || user.maxDistanceMeters || config.business.searchRadiusMeters;
  const coupons = await matching.findNearbyCoupons({
    lng,
    lat,
    categories: user.categories,
    radius: r,
    limit: 5,
  });

  if (coupons.length === 0) {
    await wa.sendText(
      user.waId,
      `😔 No hay ofertas${label ? ` cerca de *${label}*` : ' cerca'} para tus intereses ` +
        `(radio ${(r / 1000).toFixed(1)} km).`
    );
    // Ofrecer ampliar la búsqueda si aún no es muy amplia.
    if (r < 50000) {
      return wa.sendButtons(user.waId, '¿Quieres ampliar la búsqueda? 🔎', [
        { id: 'expand_wide', title: '🔍 Buscar más lejos' },
        { id: 'expand_city', title: '🏙️ Toda la ciudad' },
      ]);
    }
    return sendMainMenu(user);
  }

  const scope = radius ? ` (a ${(r / 1000).toFixed(0)} km)` : '';
  await wa.sendText(user.waId, `🎁 ¡Encontré ${coupons.length} oferta(s)${scope}!`);

  for (const coupon of coupons) {
    await sendCouponCard(user, coupon);
  }

  return sendMainMenu(user);
}

/** Amplía la búsqueda a un radio mayor usando la última ubicación del usuario. */
async function expandSearch(user, radius) {
  if (!user.lastLocation || !Array.isArray(user.lastLocation.coordinates)) {
    user.state = 'awaiting_location';
    await user.save();
    return wa.sendText(user.waId, '📍 Comparte tu ubicación para ampliar la búsqueda.');
  }
  const [lng, lat] = user.lastLocation.coordinates;
  await wa.sendText(user.waId, `🔎 Ampliando la búsqueda a ${(radius / 1000).toFixed(0)} km…`);
  return searchAndDeliver(user, lng, lat, null, radius);
}

/**
 * Envía una tarjeta enriquecida (estilo Groupon) de un cupón:
 * foto del local + oferta + calificación + dirección + código, con botones
 * "📞 Llamar" y "📍 Ubicación".
 */
async function sendCouponCard(user, coupon) {
  const m = coupon.merchant || {};
  const code = generateRedemptionCode();
  const stars =
    m.rating > 0
      ? '⭐'.repeat(Math.max(1, Math.round(m.rating))) +
        ` ${Number(m.rating).toFixed(1)}` +
        (m.reviews ? ` (${m.reviews} reseñas)` : '')
      : '';
  const body =
    `*${coupon.title}*` +
    (coupon.discountPercent ? ` · ${coupon.discountPercent}% dcto` : '') +
    '\n' +
    (coupon.description ? `${coupon.description}\n` : '') +
    `🏪 ${m.name || 'Comercio'}\n` +
    (stars ? `${stars}\n` : '') +
    (coupon.address ? `📍 ${coupon.address}\n` : '') +
    `\n🎟️ Código: *${code}*\nMuéstralo en el local para canjearlo.`;

  const buttons = [];
  if (m.phone) buttons.push({ id: `call_${coupon._id}`, title: '📞 Llamar' });
  if (m.location && Array.isArray(m.location.coordinates)) {
    buttons.push({ id: `loc_${coupon._id}`, title: '📍 Ubicación' });
  }

  if (buttons.length > 0) {
    return wa.sendCard(user.waId, { imageUrl: m.photoUrl || '', body, buttons });
  }
  if (m.photoUrl) return wa.sendImage(user.waId, m.photoUrl, body);
  return wa.sendText(user.waId, body);
}

/** Envía la tarjeta de la mejor oferta cercana (respuesta a "INTERESADO"). */
async function sendBestOfferCard(user) {
  if (!user.lastLocation || !user.lastLocation.coordinates) {
    user.state = 'awaiting_location';
    await user.save();
    return wa.sendText(user.waId, '📍 Comparte tu ubicación para enviarte la oferta más cercana.');
  }
  const [lng, lat] = user.lastLocation.coordinates;
  const coupons = await matching.findNearbyCoupons({ lng, lat, categories: user.categories, limit: 1 });
  if (!coupons.length) {
    return wa.sendText(user.waId, '😔 No hay ofertas cercanas para tus intereses en este momento.');
  }
  await wa.sendText(user.waId, '¡Genial! 🎉 Aquí tienes los detalles de la oferta:');
  await sendCouponCard(user, coupons[0]);
  return sendMainMenu(user);
}

/** Envía la tarjeta de una campaña (respuesta a "INTERESADO" tras un despacho). */
async function sendCampaignCard(user, campaign) {
  const off = campaign.discountPercent ? `\n🏷️ *${campaign.discountPercent}% de descuento*` : '';
  const by = campaign.clienteName ? `\nOfrecido por ${campaign.clienteName}` : '';
  const desc = campaign.description ? `\n\n${String(campaign.description).slice(0, 500)}` : '';
  const body = `🎉 *${campaign.producto}*${off}${by}${desc}`;

  const buttons = [];
  if (campaign.cliente) buttons.push({ id: `campcall_${campaign._id}`, title: '📞 Contactar' });
  if (campaign.location && Array.isArray(campaign.location.coordinates)) {
    buttons.push({ id: `camploc_${campaign._id}`, title: '📍 Ubicación' });
  }

  if (buttons.length) return wa.sendCard(user.waId, { body, buttons });
  return wa.sendText(user.waId, body);
}

/** Botón "📞 Contactar" de una campaña: envía el WhatsApp del comercio/cliente. */
async function handleCampaignCall(user, campaignId) {
  const c = await Campaign.findById(campaignId).lean().catch(() => null);
  if (!c || !c.cliente) return wa.sendText(user.waId, 'No hay contacto disponible para esta promoción.');
  const name = c.clienteName || c.producto;
  return wa.sendText(user.waId, `📞 Contacta a *${name}*:\nhttps://wa.me/${c.cliente}`);
}

/** Botón "📍 Ubicación" de una campaña: envía la ubicación del comercio. */
async function handleCampaignLocation(user, campaignId) {
  const c = await Campaign.findById(campaignId).lean().catch(() => null);
  if (!c || !c.location || !Array.isArray(c.location.coordinates)) {
    return wa.sendText(user.waId, 'No hay ubicación disponible para esta promoción.');
  }
  const [lng, lat] = c.location.coordinates;
  return wa.sendLocation(user.waId, lat, lng, c.clienteName || c.producto, '');
}

/** Botón "📞 Llamar": envía el teléfono del comercio. */
async function handleCardCall(user, couponId) {
  const coupon = await Coupon.findById(couponId).populate('merchant').lean().catch(() => null);
  const m = coupon && coupon.merchant;
  if (!m || !m.phone) return wa.sendText(user.waId, 'No hay teléfono disponible para este comercio.');
  return wa.sendText(user.waId, `📞 Llama a *${m.name}*:\n${m.phone}`);
}

/** Botón "📍 Ubicación": envía la ubicación del comercio (abre el mapa). */
async function handleCardLocation(user, couponId) {
  const coupon = await Coupon.findById(couponId).populate('merchant').lean().catch(() => null);
  const m = coupon && coupon.merchant;
  if (!m || !m.location || !Array.isArray(m.location.coordinates)) {
    return wa.sendText(user.waId, 'No hay ubicación disponible para este comercio.');
  }
  const [lng, lat] = m.location.coordinates;
  return wa.sendLocation(user.waId, lat, lng, m.name, coupon.address || m.address || '');
}

/** Menú principal para un usuario activo. */
async function sendMainMenu(user) {
  const buttons = [{ id: 'loc_current', title: '📍 Ubicación actual' }];
  if (Array.isArray(user.locations) && user.locations.length > 0) {
    buttons.push({ id: 'loc_previous', title: '🕘 Ubic. anterior' });
  }
  buttons.push({ id: 'cat_change', title: '🎯 Mis intereses' });

  return wa.sendButtons(user.waId, '¿Qué quieres hacer? 🔎', buttons);
}

/** Ofrece la lista de ubicaciones anteriores para elegir. */
async function handlePreviousLocations(user) {
  const locs = Array.isArray(user.locations) ? user.locations : [];
  if (locs.length === 0) {
    user.state = 'awaiting_location';
    await user.save();
    return wa.sendText(
      user.waId,
      'Aún no tienes ubicaciones guardadas. Comparte tu ubicación actual 📍.'
    );
  }

  // Más recientes primero (máx. 9), conservando el índice real en el historial.
  const rows = locs
    .map((l, i) => ({ l, i }))
    .reverse()
    .slice(0, 9)
    .map(({ l, i }) => ({
      id: `prevloc_${i}`,
      title: l.label || `${l.coordinates[1].toFixed(3)}, ${l.coordinates[0].toFixed(3)}`,
      description: new Date(l.at).toLocaleString('es-CO'),
    }));

  user.state = 'choosing_previous';
  await user.save();

  return wa.sendList(
    user.waId,
    'Elige una de tus ubicaciones anteriores para buscar ofertas:',
    'Ver ubicaciones',
    rows
  );
}

/** Procesa la selección de una ubicación anterior. */
async function handleChoosingPrevious(user, msg) {
  const id = msg.buttonId || '';
  const match = /^prevloc_(\d+)$/.exec(id);
  if (!match) {
    // No eligió de la lista; reofrecer opciones.
    return handlePreviousLocations(user);
  }

  const idx = parseInt(match[1], 10);
  const loc = (user.locations || [])[idx];
  if (!loc) {
    user.state = 'active';
    await user.save();
    return wa.sendText(user.waId, 'No encontré esa ubicación. Escribe *menú* para volver a intentar.');
  }

  const [lng, lat] = loc.coordinates;
  user.lastLocation = { type: 'Point', coordinates: [lng, lat] };
  user.lastLocationAt = new Date();
  user.state = 'active';
  await user.save();

  await wa.sendText(
    user.waId,
    `📍 Buscando ofertas cerca de: *${loc.label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}*`
  );
  return searchAndDeliver(user, lng, lat, loc.label);
}

/** Usuario activo: menú principal, tarjetas y comandos. */
async function handleActive(user, msg) {
  const id = msg.buttonId || '';
  const text = (msg.text || '').toLowerCase().trim();

  // Botones de la tarjeta de campaña (deben ir antes que call_/loc_).
  if (id.indexOf('campcall_') === 0) return handleCampaignCall(user, id.slice(9));
  if (id.indexOf('camploc_') === 0) return handleCampaignLocation(user, id.slice(8));

  // Botón "📞 Llamar" de la tarjeta.
  if (id.indexOf('call_') === 0) return handleCardCall(user, id.slice(5));

  // Ampliar la búsqueda a un radio mayor / toda la ciudad.
  if (id === 'expand_wide') return expandSearch(user, 15000);
  if (id === 'expand_city') return expandSearch(user, 60000);

  if (id === 'loc_current' || text.includes('actual')) {
    user.state = 'awaiting_location';
    await user.save();
    return wa.sendText(
      user.waId,
      '📍 Comparte tu ubicación actual: clip 📎 → *Ubicación* → *Enviar tu ubicación actual*.'
    );
  }

  if (id === 'loc_previous' || text.includes('anterior')) {
    return handlePreviousLocations(user);
  }

  // Botón "📍 Ubicación" de la tarjeta (después de loc_current / loc_previous).
  if (id.indexOf('loc_') === 0) return handleCardLocation(user, id.slice(4));

  // "INTERESADO" -> tarjeta de la campaña recibida; si no hay, la mejor oferta cercana.
  if (text.includes('interesad') || text.includes('me interesa')) {
    if (user.pendingCampaign) {
      const camp = await Campaign.findById(user.pendingCampaign).catch(() => null);
      user.pendingCampaign = null;
      await user.save();
      if (camp) {
        await Campaign.updateOne({ _id: camp._id }, { $inc: { interestedCount: 1 } }).catch(() => null);
        await sendCampaignCard(user, camp);
        return sendMainMenu(user);
      }
    }
    return sendBestOfferCard(user);
  }

  if (id === 'cat_change' || text.includes('categor') || text.includes('mis interes')) {
    user.state = 'awaiting_categories';
    await user.save();
    return wa.sendButtons(user.waId, '¿Qué categoría te interesa ahora?', categoryButtons());
  }

  // Cualquier otra cosa (incluye "hola", "menú", "buscar") -> menú principal.
  return sendMainMenu(user);
}

module.exports = { handleIncomingMessage };
