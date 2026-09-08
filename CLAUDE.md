# Contexto del Proyecto — igeogo

## Qué es
Plataforma de marketing de proximidad geográfica. Comercios crean campañas de descuento e igeogo las entrega por WhatsApp a usuarios cercanos.

## Stack
- Backend: Node.js + Express (Railway 24/7)
- BD: MongoDB Atlas + Mongoose (índices 2dsphere)
- Frontend: HTML/CSS/JS vanilla, PWA
- Integraciones: Meta Cloud API, Mapbox + Nominatim, Claude API, Wompi

## Prioridades actuales
1. Esperar/completar verificación Meta Business "1ngizer"
2. Registrar número +573002391085 en WhatsApp Manager y actualizar PHONE_NUMBER_ID en Railway
3. Resolver restricción Wompi ($150.000 COP mínimo)
4. Agregar analítica al panel admin
5. Validar canjes con código único

## Variables de entorno clave (Railway)
- WHATSAPP_PHONE_NUMBER_ID — se debe actualizar al verificar nuevo número
- Variables de Wompi para webhooks de pagos

## Convenciones
- Backend Node.js con Express, código en inglés
- Frontend vanilla (sin frameworks)
- Panel de tareas centralizado: https://claude.ai/code/artifact/096d4e8a-4a2b-449b-be95-6597f62dd70f
