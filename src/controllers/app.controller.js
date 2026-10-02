'use strict';

const crypto = require('crypto');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');
const config = require('../config');
const logger = require('../utils/logger');
const wa = require('../services/whatsapp.service');
const matching = require('../services/matching.service');
const { reverseGeocode } = require('../utils/geo');
const { sign } = require('../utils/token');
const { getPricing } = require('../models/Pricing');
const ai = require('../services/ai.service');
const wompi = require('../services/wompi.service');

const EARTH_M = 6378100; // radio terrestre en metros (para $centerSphere)

// Wompi rechaza bases < 150000 centavos (= $1.500 COP); su API reporta el error en centavos, sin unidad.
const WOMPI_MIN_COP = 1500;

/** Cuenta usuarios que hacen match (categoría + dentro del radio). Solo el número. */
async function countReach({ lng, lat, category, radius, excludeWaId }) {
  const query = {
    role: { $ne: 'cliente' },
    lastLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius / EARTH_M] },
    },
  };
  if (category) query.categories = category;
  if (excludeWaId) query.waId = { $ne: excludeWaId };
  return User.countDocuments(query);
}

/** Normaliza un teléfono a solo dígitos (formato waId de WhatsApp). */
function normalizePhone(raw) {
  return String(raw || '').replace(/\D/g, '');
}

/**
 * POST /app/api/auth/request-otp  { phone }
 * Genera un código de 6 dígitos y lo envía por WhatsApp.
 */
async function requestOtp(req, res) {
  try {
    const phone = normalizePhone(req.body.phone);
    if (phone.length < 8) return res.status(400).json({ error: 'Teléfono inválido' });

    const code = String(crypto.randomInt(100000, 1000000)); // 6 dígitos
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    let user = await User.findOne({ waId: phone });
    if (!user) user = new User({ waId: phone, state: 'active' });
    user.otpCode = hashedCode;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    user.usesApp = true;
    await user.save();

    if (config.env !== 'production') {
      logger.info(`OTP para ${phone}: ${code}`); // visible solo en desarrollo
    } else {
      logger.info(`OTP generado y enviado para ${phone}`);
    }
    await wa
      .sendText(phone, `🔐 Tu código de acceso a igeogo es: *${code}*\nVence en 10 minutos.`)
      .catch((e) => logger.warn('No se pudo enviar OTP por WhatsApp:', e.message));

    const out = { ok: true };
    if (config.env !== 'production') out.devCode = code; // ayuda en desarrollo
    return res.json(out);
  } catch (err) {
    logger.error('requestOtp:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno. Intenta más tarde.' });
  }
}

/**
 * POST /app/api/auth/verify-otp  { phone, code }
 * Verifica el código y devuelve un token de sesión.
 */
async function verifyOtp(req, res) {
  try {
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || '').trim();
    const user = await User.findOne({ waId: phone });
    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(400).json({ error: 'Solicita un código primero' });
    }
    if (user.otpExpires < new Date()) return res.status(400).json({ error: 'Código expirado' });

    if ((user.otpAttempts || 0) >= 5) {
      user.otpCode = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(429).json({ error: 'Demasiados intentos fallidos. Solicita un nuevo código.' });
    }

    let match = false;
    try {
      const stored = String(user.otpCode || '');
      let givenHash = code;
      if (stored.length === 64) {
        // Almacenado como hash SHA-256
        givenHash = crypto.createHash('sha256').update(code).digest('hex');
      }
      const bufExpected = Buffer.from(stored);
      const bufGiven = Buffer.from(givenHash);
      if (bufExpected.length === bufGiven.length && crypto.timingSafeEqual(bufExpected, bufGiven)) {
        match = true;
      }
    } catch (e) {
      match = false;
    }

    if (!match) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();
      const remaining = 5 - user.otpAttempts;
      return res.status(400).json({
        error: remaining > 0 ? `Código incorrecto (${remaining} intento${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'})` : 'Demasiados intentos fallidos. Solicita un nuevo código.',
      });
    }

    user.otpCode = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    if (user.optInAt == null) user.optInAt = new Date();
    await user.save();

    const token = sign(user.waId);
    return res.json({ token, profile: publicProfile(user) });
  } catch (err) {
    logger.error('verifyOtp:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno. Intenta más tarde.' });
  }
}

/** Perfil público (lo que la app puede ver). */
function publicProfile(u) {
  return {
    waId: u.waId,
    name: u.profileName || '',
    role: u.role || 'usuario',
    plan: u.plan || null,
    categories: u.categories || [],
    maxDistanceMeters: u.maxDistanceMeters || 2000,
    consentLocation: !!u.consentLocation,
    lastLocation: u.lastLocation && u.lastLocation.coordinates ? u.lastLocation.coordinates : null,
    locations: (u.locations || []).map((l) => ({
      lat: l.coordinates[1],
      lng: l.coordinates[0],
      label: l.label || '',
      at: l.at,
    })),
  };
}

/** GET /app/api/me */
async function getMe(req, res) {
  const user = await User.findOne({ waId: req.waId });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  return res.json({ profile: publicProfile(user) });
}

/**
 * PUT /app/api/me
 * Body: { name, categories, maxDistanceMeters, consentLocation, lat, lng }
 * Actualiza preferencias y (si viene) la ubicación, guardándola en el historial.
 */
async function updateMe(req, res) {
  try {
    const user = await User.findOne({ waId: req.waId });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { name, categories, maxDistanceMeters, consentLocation, lat, lng, role } = req.body;
    if (typeof name === 'string' && name.trim()) user.profileName = name.trim();
    if (role === 'usuario' || role === 'cliente') user.role = role;
    if (Array.isArray(categories)) user.categories = categories.map((c) => String(c).toLowerCase());
    if (maxDistanceMeters != null) user.maxDistanceMeters = Number(maxDistanceMeters);
    if (consentLocation != null) user.consentLocation = !!consentLocation;

    if (lat != null && lng != null) {
      const label = await reverseGeocode(Number(lat), Number(lng));
      if (!Array.isArray(user.locations)) user.locations = [];
      user.locations = user.locations.slice(-9).concat({
        type: 'Point',
        coordinates: [Number(lng), Number(lat)],
        label,
        at: new Date(),
      });
      user.lastLocation = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
      user.lastLocationAt = new Date();
    }

    await user.save();
    return res.json({ profile: publicProfile(user) });
  } catch (err) {
    logger.error('updateMe:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno. Intenta más tarde.' });
  }
}

/**
 * GET /app/api/coupons?lat=&lng=&radius=&categories=comida,hoteles
 * Devuelve cupones cercanos para el mapa. Si no pasan categorías, usa las del usuario.
 */
async function getCoupons(req, res) {
  try {
    const user = await User.findOne({ waId: req.waId });
    let lat = req.query.lat != null ? Number(req.query.lat) : null;
    let lng = req.query.lng != null ? Number(req.query.lng) : null;
    if ((lat == null || lng == null) && user && user.lastLocation && user.lastLocation.coordinates) {
      [lng, lat] = user.lastLocation.coordinates;
    }
    if (lat == null || lng == null) {
      return res.status(400).json({ error: 'Falta ubicación (lat/lng)' });
    }

    const radius = req.query.radius
      ? Number(req.query.radius)
      : (user && user.maxDistanceMeters) || config.business.searchRadiusMeters;

    let categories;
    if (req.query.categories) categories = req.query.categories.split(',').filter(Boolean);
    else if (user) categories = user.categories;

    const coupons = await matching.findNearbyCoupons({ lng, lat, categories, radius, limit: 100 });
    const items = coupons.map((c) => ({
      id: c._id,
      title: c.title,
      description: c.description,
      category: c.category,
      address: c.address,
      merchant: c.merchant ? c.merchant.name : '',
      lat: c.location.coordinates[1],
      lng: c.location.coordinates[0],
    }));
    return res.json({ center: { lat, lng }, radius, coupons: items });
  } catch (err) {
    logger.error('getCoupons:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno al consultar cupones.' });
  }
}

/** GET /app/api/categories — catálogo de categorías disponibles. */
function getCategories(req, res) {
  return res.json({ categories: config.business.appCategories });
}

/** GET /app/api/pricing — planes y precio por mensaje (para la calculadora). */
async function getPricingPublic(req, res) {
  const p = await getPricing();
  return res.json({ currency: p.currency, pricePerMessage: p.pricePerMessage, plans: p.plans });
}

/**
 * GET /app/api/reach?lat=&lng=&radius=&category=
 * Devuelve SOLO el número de usuarios potenciales (nunca quiénes).
 */
async function getReach(req, res) {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius) || 2000;
    const category = req.query.category || null;
    if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: 'Falta lat/lng' });
    const reach = await countReach({ lng, lat, category, radius, excludeWaId: req.waId });
    return res.json({ reach });
  } catch (err) {
    logger.error('getReach:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno al calcular alcance.' });
  }
}

/**
 * POST /app/api/campaigns  (rol cliente)
 * Body: { producto, category, description, discountPercent, lat, lng, radius, plan, messages }
 * Calcula alcance y presupuesto en el servidor y guarda la campaña como propuesta.
 */
async function createCampaign(req, res) {
  try {
    const user = await User.findOne({ waId: req.waId });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.role !== 'cliente') return res.status(403).json({ error: 'Solo clientes pueden crear campañas' });

    const b = req.body || {};
    const lat = Number(b.lat);
    const lng = Number(b.lng);
    if (!b.producto || !b.category || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Faltan producto, categoría o ubicación' });
    }
    const radius = Number(b.radius) || user.maxDistanceMeters || 2000;

    const moderation = await ai.moderateCampaignCopy({
      producto: b.producto,
      description: b.description,
      discountPercent: Number(b.discountPercent) || 0,
    });
    if (!moderation.ok) {
      return res.status(422).json({ error: moderation.reason });
    }

    const reach = await countReach({ lng, lat, category: b.category, radius, excludeWaId: req.waId });

    const pricing = await getPricing();
    let plan = 'por_mensaje';
    let messages = Math.min(Number(b.messages) || reach, reach);
    let budget = messages * pricing.pricePerMessage;
    const norm = (s) =>
      String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const chosen = pricing.plans.find((p) => norm(p.name) === norm(b.plan));
    if (chosen) {
      plan = chosen.name;
      messages = Math.min(reach, chosen.messages);
      budget = chosen.price; // el plan cubre hasta chosen.messages
    }

    if (budget < WOMPI_MIN_COP) {
      const minMessages = Math.ceil(WOMPI_MIN_COP / pricing.pricePerMessage);
      return res.status(400).json({
        error: `El presupuesto mínimo por campaña es de $1.500 COP (mínimo ${minMessages} mensajes). Tu campaña alcanza ${messages}: amplía el radio o elige un plan.`,
      });
    }

    const campaign = await Campaign.create({
      cliente: user.waId,
      clienteName: user.profileName || '',
      producto: b.producto,
      category: String(b.category).toLowerCase(),
      description: b.description || '',
      discountPercent: Number(b.discountPercent) || 0,
      location: { type: 'Point', coordinates: [lng, lat] },
      radius,
      estimatedReach: reach,
      plan,
      messages,
      budget,
      status: 'propuesta',
    });
    return res.status(201).json({ campaign });
  } catch (err) {
    logger.error('createCampaign:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno al crear la campaña.' });
  }
}

/** GET /app/api/campaigns — campañas del cliente autenticado. */
async function listMyCampaigns(req, res) {
  const list = await Campaign.find({ cliente: req.waId }).sort({ createdAt: -1 }).lean();
  return res.json({ campaigns: list });
}

/**
 * POST /app/api/campaigns/:id/insight  (rol cliente)
 * Genera con IA una recomendación breve a partir de los resultados reales
 * de una campaña ya despachada (sentCount/interestedCount).
 */
async function campaignInsight(req, res) {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, cliente: req.waId }).lean();
    if (!campaign) return res.status(404).json({ error: 'Campaña no encontrada' });
    if (campaign.status !== 'enviada') {
      return res.status(400).json({ error: 'Esta campaña todavía no se ha enviado.' });
    }
    const insight = await ai.generateCampaignInsight({
      producto: campaign.producto,
      category: campaign.category,
      discountPercent: campaign.discountPercent,
      sentCount: campaign.sentCount || 0,
      interestedCount: campaign.interestedCount || 0,
    });
    return res.json({ insight });
  } catch (err) {
    logger.error('campaignInsight:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno al generar el análisis.' });
  }
}

/**
 * POST /app/api/campaigns/ai-copy  (rol cliente)
 * Body: { producto, category, discountPercent }
 * Genera con IA un mensaje promocional para la campaña.
 */
async function aiCopy(req, res) {
  try {
    const user = await User.findOne({ waId: req.waId });
    if (!user || user.role !== 'cliente') {
      return res.status(403).json({ error: 'Solo clientes pueden usar la IA' });
    }
    const { producto, category, discountPercent } = req.body || {};
    if (!producto) return res.status(400).json({ error: 'Falta el producto o servicio' });
    const text = await ai.generateCampaignCopy({
      producto,
      category: category || '',
      discountPercent: Number(discountPercent) || 0,
    });
    return res.json({ text });
  } catch (err) {
    logger.error('aiCopy:', err.message);
    return res.status(500).json({ error: 'Ocurrió un error interno al generar el copy.' });
  }
}

/**
 * POST /app/api/campaigns/:id/pay  (rol cliente)
 * Genera un link de pago de Wompi por el presupuesto de la campaña.
 */
async function payCampaign(req, res) {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, cliente: req.waId });
    if (!campaign) return res.status(404).json({ error: 'Campaña no encontrada' });
    if (campaign.status === 'pagada') return res.status(400).json({ error: 'Esta campaña ya está pagada' });
    if (!campaign.budget || campaign.budget < WOMPI_MIN_COP) {
      return res.status(400).json({ error: 'El presupuesto mínimo por campaña es de $1.500 COP' });
    }

    const link = await wompi.createPaymentLink({
      name: `igeogo · ${campaign.producto}`.slice(0, 60),
      description: `Campaña ${campaign.producto} (${campaign.plan})`,
      amountCop: campaign.budget,
      redirectUrl: 'https://igeogo.ingizer.com/app/',
    });
    campaign.wompiLinkId = link.id;
    await campaign.save();
    return res.json({ checkoutUrl: link.url });
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    logger.error('payCampaign:', detail);
    return res.status(500).json({ error: 'No se pudo generar el link de pago. Intenta más tarde.' });
  }
}

/**
 * POST /app/api/lead  (público)
 * Recibe un lead de comercio desde la landing page.
 * Body: { business, name, phone, city, message }
 */
async function createLead(req, res) {
  try {
    const b = req.body || {};
    const business = String(b.business || '').trim();
    const phone = normalizePhone(b.phone);
    if (!business || phone.length < 7) {
      return res.status(400).json({ error: 'Faltan el nombre del comercio y un WhatsApp válido' });
    }
    const lead = await Lead.create({
      business: business.slice(0, 120),
      name: String(b.name || '').trim().slice(0, 80),
      phone,
      city: String(b.city || '').trim().slice(0, 80),
      message: String(b.message || '').trim().slice(0, 500),
      source: 'landing',
    });
    logger.info(`Nuevo lead de comercio: ${lead.business} (${lead.phone})`);
    return res.status(201).json({ ok: true });
  } catch (err) {
    logger.error('createLead:', err.message);
    return res.status(500).json({ error: 'No se pudo registrar. Intenta de nuevo.' });
  }
}

module.exports = {
  requestOtp,
  verifyOtp,
  createLead,
  getMe,
  updateMe,
  getCoupons,
  getCategories,
  getPricingPublic,
  getReach,
  createCampaign,
  listMyCampaigns,
  campaignInsight,
  aiCopy,
  payCampaign,
};
