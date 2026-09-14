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
- **Hardening de Ciberseguridad:**
  - `helmet` (cabeceras seguras) y `cors` estricto configurados.
  - Rate limiting multinivel en API global, login OTP, formulario de leads, webhook de Wompi y canjes.
  - Comparaciones de firma y tokens en tiempo constante (`crypto.timingSafeEqual`).
  - Mitigación de fuerza bruta en OTP (bloqueo automático tras 5 intentos fallidos).
  - Sanitización de logs en producción (ocultamiento de credenciales temporales).
- **SEO & Rich Results:** Metatags OpenGraph, Twitter Cards, Sitemap, Robots.txt y datos estructurados Schema.org JSON-LD en todas las landings.

---

## Bloqueos Activos

- **Soporte Wompi:** Restricción activa de monto mínimo ($150.000 COP por transacción) que afecta los planes más económicos.

---

## Tareas en Progreso

- [ ] Configurar `WHATSAPP_APP_SECRET` en variables de Railway para validación estricta de firma del webhook de Meta.
- [ ] Cargar comercios y cupones reales desde el panel de administración.
- [ ] Confirmar estado de plantilla `oferta_cercana` en WhatsApp Manager.
- [ ] Evaluar registro de dominio propio `igeogo.co`.
