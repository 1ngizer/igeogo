# igeogo

Plataforma de marketing de proximidad geográfica. Los comercios crean campañas de descuento e igeogo las entrega por WhatsApp a usuarios cercanos.

## Stack Tecnológico

- **Backend:** Node.js + Express (Railway 24/7)
- **BD:** MongoDB Atlas + Mongoose (índices 2dsphere geocoding)
- **Frontend:** HTML/CSS/JS vanilla, PWA, Panel Admin
- **Dominio:** igeogo.ingizer.com (DNS Squarespace) / Railway
- **Integraciones:** Meta Cloud API, Mapbox + Nominatim, Claude API, Wompi

## Módulos Completados

- Bot WhatsApp completo (opt-in, categorías, ubicación, cupones, botón INTERESADO)
- App PWA (login WhatsApp OTP, roles, mapa ofertas, creación campañas IA, pagos)
- Panel Admin (gestión comercios, usuarios, cupones, campañas masivas, simulador match)
- Webhooks Wompi validados, rotación secretos completada
- SEO (sitemap, JSON-LD, imagen social)
- Limpieza datos prueba: eliminados 8 comercios siembra y 6 campañas demo
- Número dedicado obtenido: +573002391085
- Causa raíz identificada: Bot vive bajo Meta Business "1ngizer" (separada de "Ingizer SAS")

## Camino a Producción

- [ ] Esperar aprobación verificación "1ngizer" (~2 días hábiles desde 2026-09-07)
- [ ] Agregar número +573002391085 en WhatsApp Manager
- [ ] Verificar por SMS/llamada, actualizar WHATSAPP_PHONE_NUMBER_ID en Railway
- [ ] Agregar método pago WhatsApp, publicar app Meta en modo Live
- [ ] Verificar perfil Google Business
- [ ] Cargar comercios y cupones reales
- [ ] Evaluar dominio propio (igeogo.co)
- [ ] Agregar analítica al panel
- [ ] Validar canjes con código único

## Bloqueos Activos

- **Wompi:** Restricción activa ($150.000 COP mínimo por transacción) sin respuesta
- **Meta/WhatsApp:** Verificación "1ngizer" en revisión; aprobación plantilla "oferta_cercana" pendiente

## Estrategia Comercial

- **Modelo:** Comercios crean campañas descuentos → igeogo entrega por WhatsApp a usuarios cercanos
- **Privacidad:** Comercio ve alcance, no identidades; usuario comparte ubicación segura para match
