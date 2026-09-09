'use strict';

const Merchant = require('../models/Merchant');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');
const Redemption = require('../models/Redemption');
const { Pricing, getPricing } = require('../models/Pricing');
const matching = require('../services/matching.service');
const campaigns = require('../services/campaign.service');
const logger = require('../utils/logger');

/**
 * POST /admin/merchants
 * Crea un comercio.
 * Body: { name, category, address, phone, lat, lng }
 */
async function createMerchant(req, res) {
  try {
    const { name, category, address, city, country, phone, lat, lng, photoUrl, rating, reviews, website } = req.body;
    if (!name || !category || lat == null || lng == null) {
      return res
        .status(400)
        .json({ error: 'Campos requeridos: name, category, lat, lng' });
    }

    const merchant = await Merchant.create({
      name,
      category: String(category).toLowerCase(),
      address: address || '',
      city: city || '',
      country: country || 'Colombia',
      phone: phone || '',
      photoUrl: photoUrl || '',
      rating: Number(rating) || 0,
      reviews: Number(reviews) || 0,
      website: website || '',
      location: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
    });

    return res.status(201).json(merchant);
  } catch (err) {
    logger.error('createMerchant:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/merchants */
async function listMerchants(req, res) {
  const merchants = await Merchant.find().sort({ createdAt: -1 }).lean();
  return res.json(merchants);
}

/** PUT /admin/merchants/:id — actualiza campos del comercio. */
async function updateMerchant(req, res) {
  try {
    const allowed = ['name', 'category', 'address', 'city', 'country', 'phone', 'photoUrl', 'rating', 'reviews', 'website'];
    const update = {};
    for (const k of allowed) if (req.body[k] != null) update[k] = req.body[k];
    if (update.category) update.category = String(update.category).toLowerCase();
    if (req.body.lat != null && req.body.lng != null) {
      update.location = { type: 'Point', coordinates: [Number(req.body.lng), Number(req.body.lat)] };
    }
    const m = await Merchant.findByIdAndUpdate(req.params.id, update, { new: true });
    // Propagar ubicación/categoría a los cupones del comercio si cambió.
    if (update.location || update.category) {
      const patch = {};
      if (update.location) patch.location = update.location;
      if (update.category) patch.category = update.category;
      await Coupon.updateMany({ merchant: m._id }, patch);
    }
    return res.json(m);
  } catch (err) {
    logger.error('updateMerchant:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * POST /admin/coupons
 * Crea un cupón asociado a un comercio (copia ubicación/categoría del comercio).
 * Body: { merchantId, title, description, expiresAt, redemptionLimit }
 */
async function createCoupon(req, res) {
  try {
    const { merchantId, title, description, expiresAt, redemptionLimit } = req.body;
    if (!merchantId || !title) {
      return res.status(400).json({ error: 'Campos requeridos: merchantId, title' });
    }

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    const coupon = await Coupon.create({
      merchant: merchant._id,
      title,
      description: description || '',
      category: merchant.category,
      location: merchant.location,
      address: merchant.address,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      redemptionLimit: redemptionLimit || 0,
    });

    return res.status(201).json(coupon);
  } catch (err) {
    logger.error('createCoupon:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/coupons */
async function listCoupons(req, res) {
  const coupons = await Coupon.find().populate('merchant').sort({ createdAt: -1 }).lean();
  return res.json(coupons);
}

/** DELETE /admin/merchants/:id  (borra el comercio y sus cupones) */
async function deleteMerchant(req, res) {
  try {
    await Coupon.deleteMany({ merchant: req.params.id });
    await Merchant.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/** DELETE /admin/coupons/:id */
async function deleteCoupon(req, res) {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /admin/users
 * Lista los usuarios del bot para seguimiento. Para los que tienen ubicación,
 * calcula cuántos cupones activos coinciden cerca (según sus categorías):
 * si es 0, es "demanda no cubierta" (buscaron ofertas donde no hay).
 */
async function listUsers(req, res) {
  try {
    const users = await User.find().sort({ updatedAt: -1 }).lean();
    const enriched = await Promise.all(
      users.map(async (u) => {
        let nearbyCoupons = null;
        if (u.lastLocation && Array.isArray(u.lastLocation.coordinates)) {
          const [lng, lat] = u.lastLocation.coordinates;
          const c = await matching.findNearbyCoupons({
            lng,
            lat,
            categories: u.categories,
            limit: 100,
          });
          nearbyCoupons = c.length;
        }
        return { ...u, nearbyCoupons };
      })
    );
    return res.json(enriched);
  } catch (err) {
    logger.error('listUsers:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/pricing */
async function getPricingAdmin(req, res) {
  const p = await getPricing();
  return res.json(p);
}

/** PUT /admin/pricing  Body: { pricePerMessage, plans:[{name,price,messages,campaigns}] } */
async function updatePricing(req, res) {
  try {
    const { pricePerMessage, plans, currency } = req.body;
    const p = await getPricing();
    if (pricePerMessage != null) p.pricePerMessage = Number(pricePerMessage);
    if (currency) p.currency = currency;
    if (Array.isArray(plans)) {
      p.plans = plans.map((x) => ({
        name: x.name,
        price: Number(x.price),
        messages: Number(x.messages),
        campaigns: Number(x.campaigns),
      }));
    }
    await p.save();
    return res.json(p);
  } catch (err) {
    logger.error('updatePricing:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/campaigns — todas las campañas (para gestión). */
async function listCampaigns(req, res) {
  const list = await Campaign.find().sort({ createdAt: -1 }).lean();
  return res.json(list);
}

/**
 * POST /admin/campaigns/:id/dispatch
 * Despacha la campaña a su audiencia por WhatsApp (envío masivo del template).
 * Marca la campaña como "enviada" y devuelve el resumen de envíos.
 */
async function dispatchCampaign(req, res) {
  try {
    const result = await campaigns.dispatchCampaign(req.params.id);
    const c = await Campaign.findById(req.params.id).lean();
    return res.json({ ok: true, result, campaign: c });
  } catch (err) {
    logger.error('dispatchCampaign:', err.message);
    return res.status(400).json({ error: err.message });
  }
}

/** DELETE /admin/campaigns/:id */
async function deleteCampaign(req, res) {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/** PUT /admin/campaigns/:id/status  Body: { status } */
async function setCampaignStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['propuesta', 'pagada', 'enviada', 'rechazada'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const c = await Campaign.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/leads — leads de comercios captados en la landing. */
async function listLeads(req, res) {
  const list = await Lead.find().sort({ createdAt: -1 }).lean();
  return res.json(list);
}

/** PUT /admin/leads/:id/status  Body: { status } */
async function setLeadStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['nuevo', 'contactado', 'ganado', 'perdido'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const l = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json(l);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/** GET /admin/redemptions — historial de canjes de cupones. */
async function listRedemptions(req, res) {
  const list = await Redemption.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('coupon', 'title')
    .populate('merchant', 'name')
    .lean();
  return res.json(list);
}

module.exports = {
  createMerchant,
  listMerchants,
  listLeads,
  setLeadStatus,
  updateMerchant,
  createCoupon,
  listCoupons,
  deleteMerchant,
  deleteCoupon,
  listUsers,
  getPricingAdmin,
  updatePricing,
  listCampaigns,
  dispatchCampaign,
  deleteCampaign,
  setCampaignStatus,
  listRedemptions,
};
