# igeogo · #SAVE ANYWHERE

Plataforma de marketing de proximidad geográfica. Los comercios crean campañas de descuento con IA e **igeogo** las entrega por WhatsApp a usuarios cercanos según su ubicación e intereses.

## Stack Tecnológico

- **Backend:** Node.js + Express (Alojado en Railway 24/7)
- **Base de Datos:** MongoDB Atlas + Mongoose (índices `2dsphere` para geolocalización)
- **Frontend:** HTML5 / CSS3 / Vanilla JS (sin frameworks pesados), PWA móvil y Panel Admin SPA
- **Hosting / Dominio:** `igeogo.ingizer.com` (DNS en Squarespace) / Railway
- **Integraciones:**
  - **Meta WhatsApp Cloud API:** Bot conversacional interactivo (modo Live, número dedicado `+57 300 2391085`)
  - **Geolocalización:** Mapbox API + Nominatim (OpenStreetMap reverse geocoding)
  - **Inteligencia Artificial:** Anthropic Claude API (redacción persuasiva, moderación e insights de campaña)
  - **Pasarela de Pagos:** Wompi Colombia (tarjetas, PSE, Nequi)
  - **Analítica:** Google Analytics 4 (`G-9Q6DNKDM7S`)

---

## Módulos Completados

- **Bot de WhatsApp:** Flujo interactivo completo (opt-in, categorías, ubicación GPS, tarjetas de cupones con fotos, botón "INTERESADO" y ampliación de radio).
- **App Móvil (PWA):** Login con WhatsApp OTP, doble rol (usuario/comercio), mapa interactivo Mapbox, creador de campañas asistido por IA y checkout de pagos.
- **Panel Administrativo:** Gestión de comercios, usuarios, cupones, leads, analítica de conversión y simulador de matching geoespacial.
- **Canje con Código Único:** Modelo `Redemption` y endpoint `/canjear/` para validación física en comercios con control de un solo uso y expiración de cupones.
- **Analítica Integrada:** Seguimiento GA4 en landings y métricas de rendimiento por campaña (`sentCount` vs `interestedCount`).
- **Asistente de IA Avanzado:** Redacción de copy con Claude, moderación preventiva de contenido engañoso e insights de optimización post-despacho.
- **Hardening de Ciberseguridad y Arquitectura (Auditoría Octubre 2026):**
  - `trust proxy` activado en Express para resolución fidedigna de IPs reales de clientes bajo el proxy de Railway.
  - Cierre de Fail-Open en webhook de Meta con validación estricta y obligatoria de cabecera `x-hub-signature-256`.
  - Mecanismo de Opt-Out inmediato ("STOP", "BAJA", "SALIR") en WhatsApp con exclusión automática en campañas salientes.
  - Implementación de `sendTemplate` y migración del despacho masivo a plantilla de marketing (`WHATSAPP_TEMPLATE_NAME`/`WHATSAPP_TEMPLATE_LANG`, sin texto libre) con bloqueo atómico (`enviando`). La plantilla debe estar aprobada en la misma cuenta de WhatsApp (WABA) del número.
  - Restauración del embudo de conversión conectando los CTAs de `/usuarios/` directamente a WhatsApp (`wa.me`).
  - Validación y canje atómico en `/canjear/` (`findOneAndUpdate`) eliminando condición de carrera (TOCTOU).
  - Almacenamiento de códigos OTP hasheados con SHA-256 en base de datos.
  - Exigencia estricta de `APP_SECRET` sin fallback inseguro en producción.
  - Protección de integridad y replay en webhook de Wompi con `crypto.timingSafeEqual`, validación de monto y timestamp.
  - Eliminación de archivo expuesto `ingizer-deploy.zip` del árbol público.
  - Sanitización de respuestas de error 500 para evitar fuga de detalles internos del servidor o base de datos.
  - Modelo de IA configurable con `ANTHROPIC_MODEL` (por defecto `claude-haiku-4-5`).
  - Feedback visual y validación del piso mínimo de $1.500 COP en la calculadora de la PWA.
- **SEO & Rich Results:** Metatags OpenGraph, Twitter Cards, Sitemap, Robots.txt y datos estructurados Schema.org JSON-LD en todas las landings.

---

## Despliegue y pruebas

- **Pruebas:** `npm test` (56 pruebas con el runner nativo de Node; los modelos y WhatsApp se simulan, no tocan servicios reales).
- **Despliegue:** manual con `railway up` (proyecto `igeogo`, servicio `igeogo`, entorno `production`). Railway **no** está conectado a GitHub: un push al repositorio no despliega. Salud: `GET /health`; `railway.json` pide a Railway comprobar `/health` antes de dar por bueno un despliegue.
- **Variables obligatorias en producción:** `NODE_ENV=production`, `APP_SECRET` y `WHATSAPP_APP_SECRET` (sin ellas la app no arranca o el webhook rechaza todo). La lista completa de nombres está en `.env.example`.
- **Estado (2026-10-13):** la remediación de la auditoría de octubre está en producción (despliegue del 2026-10-13) y `main` coincide con GitHub.

---

## Bloqueos Activos

- **Método de pago de WhatsApp:** WhatsApp Manager muestra "Missing valid payment method"; sin él no se pueden enviar plantillas de marketing. Es un paso manual del dueño del negocio (datos de tarjeta).
- **Sin probar en producción:** la baja con "STOP" y el despacho por plantilla (`oferta_cercana`, aprobada y Active desde 2026-10-10) todavía no se han probado con mensajes reales.
- **Wompi (resuelto):** el "mínimo de $150.000" era una malinterpretación; el mínimo real es $1.500 COP (150.000 centavos) y el backend valida ese piso.

---

## Tareas en Progreso

La lista oficial y vigente está en el monitor interno de ingizer (proyecto igeogo). Resumen:

- [ ] Asociar el método de pago en WhatsApp Manager.
- [ ] Probar el bot de punta a punta ("Hola" → "STOP" → "Hola").
- [ ] Cargar los primeros comercios y cupones reales desde el panel de administración.
- [ ] Cambiar el webhook de Meta al dominio propio.
- [ ] Después del lanzamiento: CSP en Helmet, recuperación del estado `enviando`, pruebas del OTP, iconos PNG de la PWA y conectar Railway a GitHub.
- [ ] Evaluar registro del dominio propio `igeogo.co`.
