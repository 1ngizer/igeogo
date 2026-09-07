# igeogo — Guía técnica de instalación y desarrollo

> Esto es documentación técnica de puesta en marcha. Para el estado del proyecto,
> bloqueos y prioridades, ver [`README.md`](./README.md) en la raíz.

Plataforma de **marketing de proximidad**. MVP construido como **Bot de WhatsApp** usando la **Meta WhatsApp Cloud API**.

El usuario comparte su ubicación y preferencias por WhatsApp, y el bot le devuelve cupones de descuento de comercios cercanos (matching geoespacial con MongoDB `$near`).

---

## Stack

- **Backend:** Node.js + Express
- **WhatsApp:** Meta WhatsApp Cloud API (Graph API)
- **Base de datos:** MongoDB + Mongoose (índices `2dsphere`)
- **Hosting sugerido:** Railway / Render

## Estructura del proyecto

```
igeogo/
├── package.json
├── .env.example          # plantilla de variables de entorno
├── .gitignore
├── README.md             # tablero del ecosistema (ingizer + PosBank + igeogo)
├── SETUP.md              # este archivo
├── sync.js               # sincroniza el tablero con Notion
└── src/
    ├── server.js                 # arranque (conecta DB + levanta Express)
    ├── app.js                    # configuración de Express y rutas
    ├── config/
    │   ├── index.js              # carga de variables de entorno
    │   └── db.js                 # conexión a MongoDB
    ├── models/
    │   ├── User.js               # usuario del bot + estado conversacional
    │   ├── Merchant.js           # comercio (GeoJSON Point)
    │   └── Coupon.js             # cupón (GeoJSON Point + categoría)
    ├── routes/
    │   ├── webhook.routes.js     # GET (verificación) + POST (mensajes)
    │   └── admin.routes.js       # alta de comercios y cupones
    ├── controllers/
    │   ├── webhook.controller.js # verificación + normalización de mensajes
    │   └── admin.controller.js
    ├── services/
    │   ├── whatsapp.service.js   # envío de mensajes (Cloud API)
    │   ├── conversation.service.js # máquina de estados del bot
    │   └── matching.service.js   # consulta geoespacial $near
    ├── middleware/
    │   └── adminAuth.js          # protección por API key
    ├── utils/
    │   ├── logger.js
    │   └── code.js               # generación de códigos de canje
    └── scripts/
        └── seed.js               # datos de prueba (comercios + cupones)
```

## Flujo del bot (máquina de estados)

`new` → saludo + opt-in → `awaiting_categories` → elegir intereses → `awaiting_location` → compartir ubicación → `active` (recibe cupones; `buscar` para repetir).

---

## Puesta en marcha

### 1. Requisitos previos

- **Node.js 18+**
- **MongoDB** — local (https://www.mongodb.com/try/download/community) o una cuenta gratuita en **MongoDB Atlas**.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env   # en Windows: copy .env.example .env
```

Rellena los valores en `.env` (ver sección **Credenciales** abajo).

### 4. Cargar datos de prueba (opcional)

```bash
npm run seed
```

### 5. Arrancar el servidor

```bash
npm run dev      # con recarga automática (nodemon)
# o
npm start
```

Healthcheck: http://localhost:3000/health

---

## Configurar el webhook de WhatsApp

Meta necesita una **URL pública HTTPS**. En desarrollo local usa un túnel:

```bash
npx ngrok http 3000
```

En el panel de Meta (WhatsApp → Configuración → Webhooks):

- **Callback URL:** `https://TU-DOMINIO/webhook`
- **Verify token:** el mismo valor de `WHATSAPP_VERIFY_TOKEN` en tu `.env`
- Suscríbete al campo **messages**.

Meta hará un `GET /webhook` con `hub.challenge`; el servidor lo responde si el token coincide.

---

## Endpoints de administración

Todos requieren la cabecera `x-admin-key: <ADMIN_API_KEY>`.

```bash
# Crear comercio
curl -X POST http://localhost:3000/admin/merchants \
  -H "x-admin-key: TU_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Bar La Esquina","category":"comida","address":"Calle Mayor 10","lat":40.4168,"lng":-3.7038}'

# Crear cupón (hereda ubicación/categoría del comercio)
curl -X POST http://localhost:3000/admin/coupons \
  -H "x-admin-key: TU_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"merchantId":"<ID>","title":"2x1 en cañas","description":"Lunes a jueves"}'
```

> ⚠️ Las coordenadas en GeoJSON van como `[longitud, latitud]` (lng primero).

---

## Credenciales que necesitas (rellenar en `.env`)

| Variable | De dónde sale |
| --- | --- |
| `WHATSAPP_VERIFY_TOKEN` | Lo inventas tú; debe coincidir con el del panel de Meta. |
| `WHATSAPP_ACCESS_TOKEN` | Meta for Developers → tu App → WhatsApp → API Setup (token temporal) o un System User token permanente. |
| `WHATSAPP_PHONE_NUMBER_ID` | Mismo panel API Setup (Phone Number ID, **no** el número). |
| `MONGODB_URI` | Tu MongoDB local o la connection string de Atlas. |
| `ADMIN_API_KEY` | La inventas tú para proteger `/admin`. |
| `NOTION_TOKEN` / `NOTION_DATABASE_ID` | Ver el encabezado de `sync.js` — solo necesarios para sincronizar el tablero de proyectos con Notion. |

---

## Próximos pasos (post-MVP)

- Persistir códigos de canje en un modelo `Redemption` y validar canjes.
- Generar **QR** como imagen (dependencia `qrcode` ya incluida) y enviarlo con `sendImage`.
- Validar la firma `X-Hub-Signature-256` de Meta (ya se conserva el `rawBody`).
- Listas interactivas para categorías múltiples.
- Panel de administración web.
