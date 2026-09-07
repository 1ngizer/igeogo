# ingizer — Contexto para continuar con Claude en otro equipo

> La memoria de la sesión de trabajo vive solo en el PC donde se generó (no viaja con OneDrive).
> Este archivo sí viaja, porque está en la raíz del proyecto. Léelo al empezar una sesión nueva de
> Claude en cualquier otro equipo para retomar el trabajo sin perder contexto.
>
> Última actualización: 4 de septiembre de 2026.

## Quién eres y qué es ingizer

Eres **John** (Admin@ingizer.com), dueño de **ingizer**: consultoría financiera con IA para pymes,
con sede en Colombia. **gizer** es el asistente de IA (el personaje); **ingizer** es la empresa/producto.
El objetivo del negocio: un diagnóstico financiero automático que abre la puerta a vender
**dirección financiera como servicio** (CFO-as-a-service), con **PosBank** como posible solución dentro
de esa propuesta cuando el diagnóstico lo sugiere.

Las reglas de marca completas (colores, tipografía, logos) están en `CLAUDE.md`, en la raíz de este
mismo proyecto — se cargan automáticamente en cada sesión de Claude Code aquí, no hace falta repetirlas.

## Productos

| Producto | Qué es | Dónde vive |
|---|---|---|
| **ingizer.com** | Landing de la empresa. Todos los CTA apuntan a app.ingizer.com/login. | Netlify — `public/ingizer/` en este repo |
| **app.ingizer.com** | El asistente: login (Google OAuth), chat (`ai_chat`), dashboard. Plan vence dic. 2026. | Bubble |
| **posbank.ingizer.com** | Producto hermano: radar de flujo de caja para pymes. | Backend propio — Railway + Supabase |
| **igeogo.ingizer.com** | Producto hermano: marketing de proximidad por WhatsApp. | Backend propio — Railway + MongoDB + Meta Cloud API |

## Arquitectura del diagnóstico (resumen)

Cliente → landing → login Bubble → chat con gizer → **Make.com** orquesta (`Message_incoming`,
`save_form_data_bubble`, `save_analysis`) → **Claude Sonnet 5** vía Make AI Agents genera preguntas
y diagnóstico en el mismo hilo de conversación → Bubble guarda el Analisis Financiero → correo al
equipo Y al cliente → cliente ve el diagnóstico en un popup con 5 pestañas → botón para agendar en
Calendly y botón para descargar el PDF.

Diagrama completo en el PDF **"Mapa de arquitectura y flujo de usuarios"** (revisión 4 sep 2026).

## Estructura del diagnóstico

Módulo 1 general (11 preguntas, las responde todo el mundo) + una de tres ramas según el tipo de
empresa:
- **Rama A** — estoy arrancando (10 preguntas)
- **Rama B** — negocio andando (11 preguntas)
- **Rama C** — creciendo rápido / startup (9 preguntas)

Sector, número de empleados y descripción de la empresa se capturan en el registro y **ya se pasan al
prompt de diagnóstico** (hueco cerrado en ago-2026). Todo alimenta 5 análisis: Clasificación, Modelo de
negocio, Situación financiera (con semáforos), Riesgos y decisiones, Dirección financiera (la propuesta
comercial que incluye PosBank cuando aplica).

Detalle pregunta por pregunta, con opciones y conexiones, en el PDF
**"Estructura propuesta del diagnóstico"**.

## Reglas y decisiones que no son obvias desde el código

Cosas que costó descubrir la primera vez — para no volver a perder tiempo en ellas.

- **Los Thread ID de Make AI Agents son por agente, no globales.** Si el agente de diagnóstico es
  distinto al que hizo las preguntas, aunque se use el mismo Thread ID abre un hilo vacío nuevo.
  El diagnóstico corre sobre el **mismo agente** que hizo las preguntas (una copia duplicada de él,
  no uno nuevo), con la instrucción de diagnóstico en el Message 1 y un cambio de rol explícito.
- **Existen 4 objetos "Ingizer Agent\*" en Make — solo uno es real.** `Ingizer Agent
  (copy_1784370957200)` es el único en producción (usado por `Message_incoming`, módulos [2] y [7]).
  Los otros 3 — "Ingizer Agent" base (conexión OpenAI rota), "Ingizer Agent (Claude)" (duplicado de una
  investigación), e "Ingizer Diagnóstico" (respaldo sin uso) — son huérfanos, candidatos a borrar pero
  sin confirmar todavía.
- **Make no autoguarda.** `Ctrl+S` después de cada cambio en un escenario. Si se pierde, aparece un
  diálogo "Recover unsaved changes?" — elegir siempre Recover, nunca Discard.
- **Bubble SÍ autoguarda en el editor de diseño**, a diferencia de Make. Pero **cortar y pegar un
  elemento en el árbol le borra los workflows** — hay que reconstruirlos manualmente después de mover
  algo así.
- **El grid de datos de Bubble (App data) es un Handsontable.** Un clic normal sobre una celda tipo
  `file` no abre nada. El botón real para editar una fila es `div.modify-btn`, muy pequeño, dentro del
  primer `<td>` de la fila — si el clic por coordenadas falla, ubicar la celda por su texto vía
  `document.querySelectorAll('td')` y leer `getBoundingClientRect()` del `.modify-btn`. Recordar también
  el toggle **Development / Live** arriba a la izquierda — verificar siempre en cuál base se está.
- **Un agente de navegador no puede completar diálogos nativos del sistema operativo.** Subir un
  archivo real a un campo tipo `file` requiere un clic humano en el diálogo "Elegir archivo" — eso no
  se puede automatizar.
- **Las API keys van solo en su destino final** (Make, Bubble, etc.), nunca en el chat, correo o
  capturas de pantalla sin difuminar. Ya hubo un incidente real: se expuso una key de Anthropic en el
  chat; se revocó y se recreó de inmediato. Esta regla queda en firme para siempre.
- **"Make AI Agents" (plural) vs "Make AI Agent" (singular).** El módulo correcto para el flujo de
  preguntas/diagnóstico es **"Make AI Agents"** (plural) → "Run an agent". El singular es un agente
  inline nuevo y no es el que se está usando.
- **Vocabulario: sencillo en la pregunta, técnico en el diagnóstico.** El cuestionario usa lenguaje
  llano ("plata", "cuánto te queda") para no sonar a examen contable. El diagnóstico entregado sí usa
  vocabulario de director financiero (liquidez, ciclo de caja, EBITDA) pero lo explica en la misma
  línea — regla **"nombrar y explicar"**.
- **Los semáforos nunca salen los 4 del mismo color.** 🔴 solo con evidencia directa de un problema.
  🟡 cuando falta información — no se asume lo peor. Siempre debe incluir una línea "Lo más urgente:".
  Antes de esta regla, los 4 salían en rojo siempre y el radar perdió credibilidad.

## Estado actual (4 sep 2026)

Desde el 14 de agosto se cerraron ocho pendientes:
- [x] Datos de registro (sector/empleados/descripción) ya llegan al diagnóstico
- [x] Markdown roto en el chat, corregido
- [x] Verificación de negocio de Meta resuelta + método de pago agregado
- [x] Correo de notificación al cliente, construido
- [x] Años de B1/B2 confirmados correctos (2026/2027/2028)
- [x] Badge del dashboard corregido (orden de fecha en el color del estado)
- [x] CTA de descarga de PDF, destrabado (ya estaba construido, solo escondido)
- [x] Botón de WhatsApp encontrado y reubicado (ahora visible)

### Bloqueado esperando al usuario

El registro de prueba usado para verificar la descarga de PDF (usuario `ingizergo@gmail.com`) tiene
cargado un documento personal del dueño en vez de un diagnóstico. Se identificó el registro exacto y se
envió un PDF de prueba genérico — falta que el usuario haga el reemplazo (un diálogo nativo de archivo
que no se puede automatizar) y se vuelva a confirmar la descarga.

### Pendiente por decidir

Conviven dos CTAs de WhatsApp en el popup del cliente: el ícono chico de siempre y un botón grande
"Ponte en contacto con nosotros" que apareció al destrabar el CTA de PDF (estaba oculto en el mismo
grupo). Falta decidir cuál se queda.

### Pendiente sin empezar / sin verificar

- [ ] Formato HTML del correo al cliente — nunca visto renderizado en una bandeja real
- [ ] Rama A (emprendimiento temprano) — nunca corrida de punta a punta en producción
- [ ] Rama C (startup) — nunca corrida de punta a punta en producción
- [ ] Link condicional a PosBank en el popup — sin construir
- [ ] 3 agentes huérfanos en Make por limpiar — pedir confirmación antes de borrar

**Con fecha:**
- [ ] Recargar ~USD 40 en Anthropic (Tier 2) — **venció el 12 ago 2026, lleva más de tres semanas sin confirmar**
- [ ] Actualizar años hardcodeados en preguntas B1/B2 — próximo corte enero 2028 (no urgente)

**En pausa:**
- [ ] Migrar de Bubble a Railway + Supabase — antes de diciembre 2026 (vence el plan de Bubble)
- [ ] Canal de WhatsApp para el asistente (nivel B)
- [ ] Asistentes de voz ElevenLabs

Detalle completo en el PDF **"Listado de pendientes"**.

## Accesos y contactos (sin credenciales)

| Qué | Dónde |
|---|---|
| Dominio / DNS | Squarespace — apex + www apuntando a Netlify |
| Landing | Netlify — repo con `public/ingizer/` |
| App / base de datos | Bubble — plan actual vence diciembre 2026 |
| Automatización | Make.com — escenario `Message_incoming`; agente real `Ingizer Agent (copy_1784370957200)` |
| IA | Cuenta Anthropic (conexión en Make) — Tier 1, recarga de saldo pendiente de confirmar |
| Agenda | calendly.com/admin-ingizer/30min |
| Correo | Google Workspace — admin@ingizer.com, no tocado por el cutover de DNS |
