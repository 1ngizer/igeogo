'use strict';

const mongoose = require('mongoose');

/**
 * Sub-schema para un punto GeoJSON. Se embebe como subdocumento OPCIONAL:
 * mientras no se asigne, el campo queda ausente y el índice 2dsphere lo ignora
 * (un objeto vacío o un Point sin coordenadas rompería el índice al guardar).
 */
const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitud, latitud]
  },
  { _id: false }
);

/**
 * Entrada del historial de ubicaciones: cada vez que el usuario comparte una
 * ubicación se guarda aquí (con etiqueta legible y fecha), para poder ofrecerle
 * "buscar con una ubicación anterior" y verlas todas en el panel.
 */
const locationHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitud, latitud]
    label: { type: String, default: '' }, // dirección aproximada (reverse geocoding)
    at: { type: Date, default: Date.now },
  },
  { _id: true }
);

/**
 * Usuario del bot de WhatsApp.
 * Se identifica por su número de teléfono (wa_id que devuelve la Cloud API).
 * `state` controla la máquina de estados del flujo conversacional.
 */
const userSchema = new mongoose.Schema(
  {
    waId: { type: String, required: true, unique: true, index: true },
    profileName: { type: String, default: '' },

    // Máquina de estados del bot.
    state: {
      type: String,
      enum: [
        'new',
        'awaiting_optin',
        'awaiting_categories',
        'awaiting_location',
        'choosing_previous',
        'active',
      ],
      default: 'new',
    },

    optInAt: { type: Date, default: null },
    categories: [{ type: String }],

    // Última ubicación compartida. Ausente hasta el primer "compartir ubicación".
    lastLocation: { type: pointSchema, default: undefined },
    lastLocationAt: { type: Date, default: null },

    // Historial completo de ubicaciones registradas (más reciente al final).
    locations: { type: [locationHistorySchema], default: [] },

    // --- Campos para la app móvil (PWA) ---
    // Rol: 'usuario' recibe promociones; 'cliente' crea campañas (paga).
    role: { type: String, enum: ['usuario', 'cliente'], default: 'usuario' },
    plan: { type: String, default: null }, // plan comercial activo del cliente
    otpCode: { type: String, default: null }, // código de acceso temporal
    otpExpires: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 }, // control de intentos fallidos
    maxDistanceMeters: { type: Number, default: 2000 }, // radio preferido del usuario
    consentLocation: { type: Boolean, default: false }, // permiso de ubicación otorgado
    usesApp: { type: Boolean, default: false }, // ha entrado por la app

    // Última campaña que se le envió: si responde "INTERESADO", se le muestra
    // la tarjeta de ESA campaña (no una oferta cercana genérica).
    pendingCampaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  },
  { timestamps: true }
);

userSchema.index({ lastLocation: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
