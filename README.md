# Ecosistema Ingizer — Tablero de proyectos

> **Fuente de la verdad** del ecosistema (ingizer, PosBank, igeogo). Se sincroniza con
> Notion vía [`sync.js`](./sync.js) — ver ese archivo para las instrucciones de setup.
> Documentación técnica de instalación de igeogo (el código que vive en este repo):
> ver [`SETUP.md`](./SETUP.md).
>
> Última actualización: 7 de septiembre de 2026.

## 🎯 Prioridad de hoy

**Decidir cuál CTA de WhatsApp se queda en el popup de diagnóstico de ingizer**
(Bubble → página `ai_chat` → Popup analisis) — hoy conviven el ícono chico de
siempre y el botón grande "Ponte en contacto con nosotros". Es una decisión rápida
+ un ajuste visual, y limpia lo último que se ve desordenado en la pantalla que ya
están viendo clientes reales.

---

## ingizer

Consultoría financiera con IA para pymes. Landing (`ingizer.com`) + asistente de
diagnóstico (`app.ingizer.com`, Bubble + Make.com + Claude).

| Campo | Valor |
|---|---|
| **Avance** | 90% |
| **Estado** | En curso |
| **Prioridad** | Media |
| **Bloqueos** | Ninguno |
| **Próxima tarea** | Decidir cuál CTA de WhatsApp se queda (ícono vs botón grande) |

**Backlog:**
- [ ] Decidir cuál CTA de WhatsApp se queda (ícono vs botón grande)
- [ ] Verificar el formato HTML del correo al cliente en una bandeja real
- [ ] Correr las ramas A (emprendimiento) y C (startup) de punta a punta en producción
- [ ] Construir el link condicional a PosBank en el popup de diagnóstico
- [ ] Limpiar los 3 agentes huérfanos en Make (pedir confirmación antes de borrar)

**Completado recientemente:** CTA de descarga de PDF verificado 100% de punta a
punta (archivo de prueba reemplazado y reconfirmado como cliente real), recarga de
USD 40 en Anthropic confirmada (nivel Build, recarga automática activada — cierra
el riesgo de error 429 en el diagnóstico), landing en Netlify con SSL, login con
Google OAuth, diagnóstico automatizado de 3 ramas (44 preguntas → 5 análisis),
datos de registro integrados al prompt, corrección de markdown en el chat,
verificación de negocio de Meta, correo de notificación al cliente, badge del
dashboard, botón de Calendly.

---

## PosBank

Radar de flujo de caja inteligente para pymes. App web (React + PWA) sobre
Express/Supabase, con módulos de inventario, POS, escaneo de facturas por IA,
skill de Alexa y panel admin de plataforma.

| Campo | Valor |
|---|---|
| **Avance** | 92% |
| **Estado** | En curso |
| **Prioridad** | Media |
| **Bloqueos** | Ninguno de nuestro lado — WhatsApp esperando el resultado de una verificación de organización enviada a Meta (externo, ~48h). |
| **Próxima tarea** | Cuando Meta responda "Verified": conectar la app del Developer Console al portfolio y activar el producto WhatsApp. |

**Backlog:**
- [ ] Conectar WhatsApp cuando Meta confirme la verificación de organización (ID 2466523423840491, estado "In review")
- [ ] Plan B si Meta rechaza de nuevo: crear la WABA dentro del portfolio "Ingizer SAS" (sin tocar el WhatsApp de prueba de gizer)
- [ ] Confirmar en un Echo físico que la invocación "pos bank" (dos palabras) se reconoce bien por voz
- [ ] Decidir si se busca certificación pública del skill de Alexa (hoy en Beta Test, testers hasta 15 nov 2026)
- [ ] Fases 2 y 3 del roadmap (hoy solo estructura, sin construir)

**Completado recientemente:** Fase 1 MVP completa (14 tablas + RLS, CashEngine,
AlertEngine), landing/app/backend en Railway (plan Hobby), login con Google,
inventario y POS probados end-to-end, panel admin con gráficas, escaneo de
facturas por foto (Claude), y **skill de Alexa completo**: informe hablado,
alertas, consultas de caja/runway/cartera/inventario, registro de ingresos y
gastos por voz, cuentas por pagar/cobrar con diálogo guiado, vinculación de
cuenta por código de 6 dígitos, y **facturación de un producto por voz**
(busca el nombre dictado en el inventario real y solo factura si hay una
coincidencia clara — nunca adivina con plata real de por medio). Bug de
timeout de Alexa (10.9s, por queries no paralelizadas) diagnosticado con logs
reales y corregido. Skill en Beta Test activo.

---

## igeogo

Marketing de proximidad vía bot de WhatsApp — cupones geolocalizados de comercios
cercanos, con panel admin y monetización vía campañas pagadas (Wompi).

| Campo | Valor |
|---|---|
| **Avance** | 60% |
| **Estado** | 🔴 Bloqueado |
| **Prioridad** | Alta |
| **Bloqueos** | Wompi rechaza transacciones bajo $150.000 COP — rompe 3 de los 4 planes de precio actuales. Escalado a soporte de Wompi, sin respuesta. |
| **Próxima tarea** | Seguimiento a soporte de Wompi + rediseñar los planes para superar el mínimo |

**Backlog:**
- [ ] Resolver o mitigar el mínimo de transacción de Wompi ($150.000 COP)
- [ ] Esperar resultado de la Verificación de Negocio de Meta (en revisión)
- [ ] Conseguir el número nuevo dedicado al bot (no reusar +573213737341)
- [ ] Configurar método de pago en WhatsApp Manager y publicar la app en modo Live
- [ ] Actualizar el despacho de campañas para usar la plantilla aprobada "oferta_cercana"
- [ ] Verificación del Google Business Profile (en curso, ~5 días)

**Completado recientemente:** bot end-to-end en WhatsApp real, panel admin, tarjetas
enriquecidas de cupones, integración de pagos Wompi (código listo, bloqueado por el
mínimo de transacción), IA para redactar campañas (Claude Haiku), dominio propio,
despacho de campañas probado en producción.

---

## Cómo se actualiza este tablero

1. Al cerrar una sesión de trabajo, Claude actualiza la sección del proyecto
   correspondiente en este archivo y te entrega el fragmento de JavaScript para
   pegar en `sync.js`.
2. Corres:
   ```bash
   node sync.js
   git add -A && git commit -m "..."
   git push
   ```
3. El tablero de Notion queda al día.
