# ingizer — Brief de contexto completo (handoff para otra IA)

> Documento de traspaso. Resume TODO lo trabajado en el ecosistema ingizer hasta
> el **2026-08-07**. Está escrito para que una IA sin historial pueda continuar
> el trabajo sin volver a preguntar lo básico.
> **No contiene contraseñas, API keys ni tokens** — pedirlos al usuario cuando
> hagan falta.

---

## 1. Qué es ingizer

**ingizer** (siempre en minúscula) es una empresa colombiana — razón social
**Ingizer SAS**, Bogotá — de **consultoría financiera y de crecimiento potenciada
por IA** para pymes. Cuenta principal: `admin@ingizer.com`.

**Tagline:** `#EmpowerYourBusiness` (un solo hashtag, PascalCase, uso escaso).

La empresa es la **matriz**; debajo cuelgan varios productos:

| Producto | Qué es | Dónde vive | Estado |
|---|---|---|---|
| **Landing corporativa** | Sitio web de la empresa | `ingizer.com` (Netlify) | ✅ En producción |
| **gizer** | Asistente de IA que hace el diagnóstico financiero | `app.ingizer.com` (Bubble) | 🟡 Vivo, en mejora + migración planeada |
| **igeogo** | Marketing promocional de proximidad por WhatsApp (NO financiero) | `igeogo.ingizer.com` (Railway) | 🟡 MVP funcionando, camino a producción de WhatsApp |
| **PosBank** | Radar de flujo de caja para pymes (fintech) | `posbank.ingizer.com` + `app.posbank.ingizer.com` (Railway) | ✅ MVP completo y desplegado |
| **Cube Canvas®** | Metodología propia de diagnóstico | Servicio (no software) | Se ofrece en la landing |
| **Power Apps + IA** | 18 herramientas financieras con IA | Servicio | Se ofrece en la landing |
| **BizzOpp** | Red social de oportunidades de negocio | `bizzopp.com` | Externo, solo enlazado |

---

## 2. Marca (reglas duras — están en `CLAUDE.md` del repo)

### Arquitectura de marca
- **gizer** = el asistente de IA (el personaje). Su símbolo es el **reloj-medidor**
  con espectro rojo→verde (alerta a la izquierda, gestión a la derecha).
  Logos definitivos: opción **9a** (mark) y **9c** (ícono de app).
- **ingizer** = la compañía/producto. Wordmark en **Comfortaa** + el ícono de gizer
  (tile navy) como firma a la derecha. Opción definitiva: **J1**.

### Nombre
- Siempre minúsculas: `ingizer`, `gizer`. Nunca "Ingizer" ni "INGIZER" (excepto la
  razón social "Ingizer SAS").
- Idioma de producto: inglés en UI; el contenido de marketing actual está en español.

### Color
- **Brand navy `#081C2A`** — texto, CTA primario, fondo oscuro.
- **Espectro del medidor:** `#FF2E27` → `#FF8F1B` → `#FCD006` → `#9FDA20` → `#04C537`.
  Es acento y **estado** (danger→success). **Nunca** como fondo genérico.
- **Verde `#04C537`** — CTA de acción/éxito. Hover `#06B033`.
- Neutros fríos: fondo `#F7F9FB`, superficie `#FFFFFF`, borde `#E1E7ED`,
  texto secundario `#5A6B7A`.

### Tipografía
- **Comfortaa** (400–700): wordmark y titulares de marca (peso 600, tracking -0.01em).
- **Poppins** (300–700): UI y cuerpo.
- **JetBrains Mono**: código y cifras que deben alinear.
- Si algún día llegan las fuentes **Altone** licenciadas → reemplazan a Comfortaa.

### Reglas de logo y UI
- No inclinar, deformar ni recolorear el wordmark; no ponerlo sobre fondo de espectro.
- Ícono de app sobre navy; a ≤48px el medidor se simplifica a **2 arcos** (rojo/verde).
- Clearspace del lockup = altura de la "i".
- Tarjetas: blanco, borde 1px `#E1E7ED` **o** sombra suave (no ambos), radio 14px, padding 24px.
- Botones/inputs radio 10px; pills 999px; modales 20px. Sombras teñidas de navy.
  Foco: halo verde `0 0 0 3px rgba(4,197,55,0.35)`. Motion 220ms ease-out.
- **Sin emoji** en la UI de marca. El espectro del medidor es el recurso de estado.
- **Nunca redibujar un logo a mano** — copiar el SVG de `brand-kit/brand/logos.html`.

> Inconsistencia conocida del brand kit: `CLAUDE.md`/logos usan navy `#081C2A` +
> Comfortaa, mientras `_ds/colors_and_type.css` usa `#17222E` + Manrope/Altone.
> **Se sigue CLAUDE.md/logos.**

> Las marcas hermanas tienen identidad propia y **no se mezclan**: igeogo
> (azul `#12A9E0` / amarillo `#FBC02D` / rojo `#E5392B`, tagline `#SAVE ANYWHERE`)
> y PosBank (Poppins + wordmark degradado con brújula, "Un banco en el punto de pago").

---

## 3. Infraestructura y dominios (mapa DNS — **NO tocar a ciegas**)

DNS de `ingizer.com` administrado en **Squarespace** (viene de Google Domains).

| Registro | Destino | Para qué |
|---|---|---|
| `A @` → `75.2.60.5` | **Netlify** | Landing corporativa |
| `CNAME www` → `adorable-gumption-54950e.netlify.app` | Netlify | Landing (www) |
| `app.ingizer.com` → 4 registros A (Cloudflare/Bubble) | **Bubble** | Asistente gizer |
| `CNAME igeogo` → `gtbztpk4.up.railway.app` (+ TXT `_railway-verify.igeogo`) | **Railway** | igeogo |
| `CNAME posbank` → `3qu9l9kd.up.railway.app` (+ TXT `_railway-verify.posbank`) | Railway | Landing PosBank |
| `CNAME app.posbank` | Railway (antes Netlify) | App PosBank |
| `MX` → Google | Google Workspace | Correo |

**Regla:** todo dominio nuevo se agrega como registro **aditivo**; nunca se borran
los MX, los TXT de verificación ni los CNAME de los vecinos.

### Cuentas y herramientas en uso
- **Netlify** — landing de ingizer (repo GitHub `1ngizer/ingizer-landing` → auto-deploy).
  ⚠️ Netlify cobra **15 créditos por deploy** (free = 300/mes = ~20 deploys) →
  por eso PosBank se migró a Railway.
- **Railway** — workspace "1ngizer's Projects": proyectos `igeogo` y `posbank`
  (este último con 3 servicios: `posbank` landing, `posbank-api`, `posbank-app`).
  El plan free limita **proyectos**, no servicios → agrupar servicios.
- **Bubble** — app del asistente gizer (se va a apagar, ver §5).
- **Make.com** (pago 1 año) — el "cerebro" de gizer: escenarios y agentes de IA.
- **Anthropic** — Claude Sonnet 5 para los agentes de gizer; Claude Haiku 4.5 para
  copy de campañas en igeogo. ⚠️ La cuenta está en **Tier 1** (USD 5) → errores 429.
- **Supabase** — base de datos de PosBank (proyecto `zbxpkssioqmghvznouyg`).
- **MongoDB Atlas** — base de datos de igeogo.
- **Meta / WhatsApp Cloud API** — tres portfolios **separados a propósito**:
  `1ngizer` (igeogo), `Ingizer SAS` (gizer), `PosBank`. **Nunca cruzarlos.**
- **Wompi** — pasarela de pagos (cuenta producción de Ingizer SAS).
- **Google Cloud** (org ingizer.com, project `autonomous-gist-469117-s5`) — OAuth
  de gizer y de PosBank.
- **Squarespace** — registro y DNS de ingizer.com.

---

## 4. Landing corporativa (`ingizer.com`) — ✅ en producción

- **Código:** `public/ingizer/index.html`, HTML estático autocontenido, con su
  propio repo git aislado (rama `main`) → GitHub `1ngizer/ingizer-landing` → Netlify
  auto-deploy en cada push. Trae `netlify.toml`, `robots.txt`, `sitemap.xml`,
  `manifest.webmanifest`, `privacy.html`.
- **Desplegada el 2026-07-17** reemplazando la app de Bubble que estaba en la raíz.
  SSL Let's Encrypt válido.
- **Estructura:** hero (H1 "Impulsamos el crecimiento de tu empresa" / H2 "Usa
  nuestro motor financiero + IA como tu director financiero", con panel dentro de
  un **marco de tablet iOS** que muestra el diagnóstico animado + feed de alertas
  estilo WhatsApp) → banner "Hola, mi nombre es gizer / Seré tu Director Financiero"
  → motor financiero con IA → **5 tarjetas de producto** (Cube Canvas, Power Apps + IA,
  PosBank, BizzOpp, igeogo) → **3 planes** → CTA → FAQ (`<details>`) → footer.
- **Planes:** Free $0 · **Consultor de crecimiento +AI $99/mes** (destacado) ·
  Director financiero CFO+AI $199/mes. Los ~11 CTA apuntan a `https://app.ingizer.com`.
- **SEO completo:** OG + Twitter Card + hreflang + 2 bloques JSON-LD
  (Organization/WebSite/OfferCatalog y WebPage/Services/FAQPage, este último 1:1
  con el FAQ visible). Banner OG real 1200×630 en `assets/og-banner.jpg`.
- **Auditoría 2026-08-14:** los 3 pendientes que tenía esta sección ya están
  **resueltos** (SEO alineado con el H1/H2, copy real de Cube Canvas y BizzOpp,
  Instagram `@1ngizer` en el `sameAs`). Verificado en vivo: 11 CTA correctos,
  0 imágenes rotas, 0 anclas rotas, las 3 fuentes de marca cargan.
- **Corregido el 2026-08-14** (commit `b802db0`, falta `git push`): el
  `manifest.webmanifest` se servía como `application/octet-stream` (con el
  `nosniff` global la PWA no quedaba instalable) → header
  `application/manifest+json` en `netlify.toml`; y el `sitemap.xml` no listaba
  `privacy.html`.
- ⚠️ **Gotcha:** el redirect catch-all `/*` → `app.ingizer.com` (301, `force=false`)
  hace que **cualquier archivo inexistente devuelva 301 a Bubble en vez de 404**.
  Al depurar un asset, mirar el content-type, no solo el status.
- **División de trabajo acordada:** la IA edita y hace `git commit`; el usuario
  hace `git push` (login de GitHub es suyo).

---

## 5. gizer — el asistente de diagnóstico financiero (**proyecto activo #1**)

`https://app.ingizer.com` — bot conversacional que hace un diagnóstico financiero
y cierra la venta de la consultoría.

### Stack actual
- **Front/app:** Bubble (dominio propio, login "Sign in with Google" — cliente
  OAuth "Account Signup.Login" en Google Cloud).
  ⚠️ Gotcha: mover el dominio exige agregar la nueva redirect URI o el login
  revienta con `Error 400: redirect_uri_mismatch`.
- **Cerebro:** **Make.com**, escenario `Message_incoming`.
  Modelo: **Claude Sonnet 5** (migrado desde GPT-4.1 mini el 2026-07-18 porque
  OpenAI daba 429 por cuota). Max output tokens 8000.
  ⚠️ Gotcha de Make: usar la app **"Make AI Agents"** (plural) → "Run an agent";
  la app "Make AI Agent" (singular) no sirve.

### Agentes
1. **`Ingizer Agent (copy_1784370957200)`** — hace **21 preguntas** (banco de 30:
   14 generales + 7 rama A emprendimiento + 9 rama B empresa establecida) y guarda
   con `save_form_data_bubble`. Mejorado el 2026-08-03 con:
   - **Repregunta inteligente**: si una respuesta clave es vaga, repregunta UNA vez
     con ejemplos concretos; si sigue vaga registra `sin_dato` y avanza (nunca
     insiste dos veces; no altera el contador "Avance: X/Y").
   - Bloque **"Quién es quién"**: tú eres ingizer (la consultora), el usuario es
     empresario de **cualquier** sector (bug real: rechazó "arreglar zapatos").
   - Cierre: "Dame un momento mientras analizo tu información y preparo tu diagnóstico".
2. **`Ingizer Diagnóstico`** — **un solo agente que devuelve JSON** con 6 claves:
   `clasificacion`, `lean_canvas`, `crecimiento`, `financiera`, `propuesta`,
   `resumen_equipo` (ficha interna con semáforos y **temperatura del lead**).
   Se eligió esto sobre 5 agentes encadenados. ~70 s, ~1 crédito de Make.

### Metodología del diagnóstico (del Excel `01. Plantilla Diagnostico.xlsx`)
5 análisis encadenados:
1. **Clasificación** en 4 tipos: 🦬 Búfalo (producto/industrial), 🐜 Hormiga
   (servicios), 🦅 Águila (tech/SaaS escalable), 🐦 Colibrí (impacto).
2. **Lean Canvas** — califica cada bloque 1-5.
3. **Estrategia de crecimiento**.
4. **Situación financiera** — **radar cualitativo con semáforos** 🟢🟡🔴 inferido
   de respuestas categóricas + margen y tendencia reales de ventas/utilidad.
   **Decisión: NO se piden estados financieros** (fricción). El radar exacto
   (razón corriente, prueba ácida, ROA/ROE, rotaciones) queda como entregable del
   **servicio pago** → gancho de conversión.
   **Regla de oro:** si algún día se calculan indicadores exactos, la aritmética va
   en código/Make con fórmulas exactas (reusar el CashEngine de PosBank), **nunca**
   dejando que el LLM haga la cuenta.
5. **Propuesta / ruta de trabajo** → cierre comercial. CTA = **Sesión de Estrategia
   gratuita de 30 min** vía Calendly (`calendly.com/admin-ingizer/30min`). El plan
   $99/mes se vende en la llamada, no en checkout.

### Flujo montado en Make (`Message_incoming`)
`[1] Webhook` → `[2] Agente 21 preguntas` (Thread ID = session_id) →
`[3] Webhook response` (responde al instante, no espera los ~70 s) →
🔽 **filtro** (`2.response` contains "preparo tu diagnóstico") →
`[7] Ingizer Diagnóstico` → `[10] Parse JSON` →
`[11] HTTP POST` a Bubble `.../wf/save_analysis` → `[9] Gmail` a admin@ingizer.com.

En Bubble se creó el backend workflow **`save_analysis`** (público, POST, sin auth,
6 parámetros) que crea un registro `Analisis financiero` mapeando los 5 campos;
el `chat_id` que envía Make es el **unique id de Bubble del registro `Chats`**.

### 🐛 Bug abierto (prioridad) — el diagnóstico sale vacío
En la primera prueba end-to-end (2026-08-05) la fontanería funcionó (llegó el
correo, se llenaron los 5 campos en Bubble) **pero el agente respondió
"No se recibieron respuestas específicas del formulario"** y puso `sin_dato` en todo.

**Causa raíz:** los **Thread ID de Make AI Agents son POR AGENTE** — pasar
`Thread ID = 1.session_id` al módulo [7] NO hereda la conversación del agente de
las 21 preguntas, abre un thread vacío propio. **No es problema del prompt.**

- **Fix a probar:** pasar las respuestas explícitamente en el Message del módulo [7]
  con `{{2.executionSteps[].toolCalls[].arguments}}` (los argumentos de la llamada
  a `save_form_data_bubble` contienen todas las respuestas).
- **Plan B:** usar el propio `Ingizer Agent (copy_...)` en el módulo [7] (sí tiene
  la conversación) y darle las instrucciones del diagnóstico en el Message.
- **Extra:** `save_analysis` no actualiza el badge de estado → el dashboard sigue
  mostrando "Pendiente de Análisis" en rojo.

### ⬜ Ajustes pendientes al prompt de las 21 preguntas (detectados en prueba real)
1. **Años desactualizados** — pide 2023/2024 + proyección 2025/2026, pero estamos en
   ago-2026. Cambiar a `y2024`/`y2025` reales + `p2026` proyección (y `B2_utilidad_neta`
   igual). *Ojo: en enero 2027 hay que correr los años otra vez.*
2. **Falta adaptación al contexto** — agregar bloque `###Adaptación al contexto`:
   no pedir datos imposibles (empresa nueva → solo el año en curso), no repreguntar
   lo ya respondido, marcar `no_aplica` cuando no aplique (inventario en servicios).
3. **Jerga contable** — `B5_cxc` ("cuentas por cobrar", opciones etiquetadas
   Bajo/Moderado/Relevante) → reescribir a "¿Cómo te pagan tus clientes?" con
   lenguaje natural; `B7_capex` ("CAPEX") → "¿Has invertido en maquinaria, equipos,
   vehículos o local?". **Manteniendo los mismos `value`** para no romper el análisis.
   **Regla general: las etiquetas de clasificación interna nunca se muestran al usuario.**
4. **Redundancia G14 vs B8** — se conservan ambas (G14 = financiamiento actual;
   B8 = apetito de inversión, señal de lead caliente), pero B8 debe **reconocer lo
   ya dicho** ("Ya me contaste que te financias con X, solo para completar...").
5. **Pregunta de ambición sesgada** — "¿Qué tan ambiciosa es tu visión?" empuja a
   mentir. Reformular a **"¿Hacia dónde quieres llevar tu negocio?"** con las 3
   opciones redactadas para que todas suenen válidas (mismos `value`).

### 🔍 Auditoría del banco de preguntas (2026-08-05)
32 conexiones, 21 preguntas conectadas, **8 huérfanas + 1 redundante**.
- **Huérfanas** (se preguntan, se guardan, no llegan a ningún análisis): `G5`
  (ventaja injusta del Lean Canvas), `A1` (riesgo), `A3` (aspiración tecnológica —
  justo lo que separa 🦅 de 🦬), `A4` (talento/activos), `A5` (motivaciones — señal
  de 🐦), `A6` (formalización), `A7` (etapa de validación), `B3` (equipo).
- **Redundante:** `B4` (canales) repite `G6`.
- **Conclusión:** la rama A **sí pregunta** lo necesario; el problema es que ningún
  prompt recoge esas respuestas. El arreglo es **conectar las existentes**, no
  agregar preguntas. Asimetría clave: el análisis financiero recibe 8 insumos en
  rama B pero solo 2 en rama A → por eso el radar sale vacío con emprendimientos.

### 🔔 Recordatorio — saldo de Anthropic
La cuenta está en **Tier 1** (USD 5) y la prueba del 2026-08-05 falló en la
pregunta 13 con `429 overloaded`. **Semana del 12 de agosto de 2026:** cargar
~USD 40 en console.anthropic.com → Billing (sube a Tier 2) y activar auto-reload.
Mitigación ya aplicada: error handlers "Retry" (5 intentos, 1 min) en los módulos
[2] y [7] + "Store incomplete executions = Yes" en el escenario.

### Decisión de plataforma: salir de Bubble
**Destino: Railway + Supabase** (mismo stack que PosBank; Supabase Auth con Google
reemplaza el OAuth de Bubble; frontend propio con la marca oficial).
**Secuencia acordada:** *Fase 1* = mejorar los asistentes (automatizar el
diagnóstico) → *Fase 2* = migrar y rediseñar **antes de diciembre de 2026**, sin
esperar a que venza Bubble. El cerebro (Make + Claude) ya está desacoplado → la
migración solo reconstruye "la cara" (~2-3 semanas).
**Regla mientras tanto: toda la lógica nueva va en Make/Claude, NUNCA en lógica
interna de Bubble.**

### ⬜ Proyecto pendiente: canal WhatsApp (Nivel B — continuidad web→WhatsApp)
Tras el login, el usuario elige "seguir en web" o "seguir en WhatsApp" y retoma el
diagnóstico **donde iba**. Clave técnica: el agente ya guarda historial por
**Thread ID (= session_id)**, así que la continuidad = usar el mismo session_id en
ambos canales. Flujo: código de enlace en Bubble → `wa.me/<número>?text=Continuar
INGZ-<código>` → escenario nuevo `WhatsApp_incoming` en Make. Decidido: **número
dedicado a ingizer** (no reusar el de igeogo; un número = un webhook).

---

## 6. igeogo — marketing de proximidad por WhatsApp

MVP en `C:\Users\Johno\OneDrive\New Backup\Desktop\igeogo` (este workspace).
El usuario comparte ubicación + preferencias y el bot devuelve cupones cercanos.

- **Stack:** Node.js + Express, MongoDB Atlas + Mongoose (índices `2dsphere`,
  `$near`), Meta WhatsApp Cloud API. Desplegado en **Railway**
  (`https://igeogo-production.up.railway.app` → `igeogo.ingizer.com`).
- **Piezas construidas:** bot de WhatsApp end-to-end (tarjetas enriquecidas estilo
  Groupon con foto/rating/botones Llamar y Ubicación, flujo "INTERESADO"),
  **panel admin** en `/panel/` (comercios con mapa, cupones, usuarios, precios,
  campañas), **PWA** en `/app/` (login por OTP vía WhatsApp, onboarding, mapa Mapbox
  con filtros), **plataforma de dos lados** (rol usuario / rol cliente-comercio con
  planes), **IA para redactar campañas** (`@anthropic-ai/sdk`, `claude-haiku-4-5`),
  **pasarela Wompi** (payment links + webhook), **despacho de campañas** por lotes,
  y **3 landings** en `public/landing/` con SEO y Search Console.
- **⚠️ Hallazgo crítico de negocio (2026-08-02):** Wompi rechaza con
  *"La base de la transacción debe ser igual o mayor a 150000"* → **mínimo
  $150.000 COP por transacción**. Esto **rompe los planes actuales** (pago por
  mensaje $100, Básico $50.000, Pro $99.900 quedan por debajo; solo Premium
  $199.000 pasa). El usuario escribió a soporte de Wompi — **respuesta pendiente**.
  No es un bug del código.
- **Camino a producción de WhatsApp (en curso):** verificación de negocio enviada a
  Meta ("In review", tipo Private company, RUT DIAN); plantilla de marketing
  `oferta_cercana` enviada a revisión; falta **un número nuevo** (una SIM que nunca
  haya tenido WhatsApp — se descartó migrar `+573213737341` para no perder chats),
  método de pago en WhatsApp Manager y publicar la app en modo Live.
- **Google Business Profile** creado (Marketing agency, Bogotá) — en verificación.
- **Gotchas:** `lastLocation` debe ser sub-schema opcional o rompe el índice
  2dsphere; en Windows hay que hacer `dns.setServers` para `mongodb+srv://` (solo
  win32, en Linux rompe); los procesos en background lanzados desde la sesión de la
  IA mueren → usar `iniciar-igeogo.bat`.
- **Seguridad:** todos los secretos que aparecieron en chat fueron **rotados**
  (Anthropic, Wompi, MongoDB, Mapbox restringido por URL, ADMIN_API_KEY nueva con
  `timingSafeEqual`).

---

## 7. PosBank — radar de flujo de caja para pymes

Código en `C:\Users\Johno\OneDrive\New Backup\Desktop\posbank\` (carpeta aparte).
No es contabilidad: es un **radar de decisiones**. Tagline: *"Un banco en el punto
de pago"* (se descartó "Después del banco, la inteligencia").

- **Backend:** Express + TypeScript + **Supabase** (PostgreSQL con RLS multi-tenant),
  moneda COP. 14 tablas, **CashEngine** (lógica pura), **AlertEngine** (dedupe 24h),
  dashboard, integración WhatsApp, skill de Alexa, cron jobs. 31 tests pasan.
  Desplegado: `posbank-api-production.up.railway.app`.
- **Frontend:** React + Vite + TypeScript, PWA, Supabase Realtime, login con Google.
  Pantallas: Dashboard/radar, Movimientos, Por cobrar, Por pagar, **Inventario**,
  **POS** (factura con IVA por producto → descuenta stock → crea ingreso en caja),
  Presupuesto/Políticas/Compromisos. Probado end-to-end en producción.
- **Panel admin de plataforma** para que ingizer monitoree a todos los clientes
  (allowlist por correo en `PLATFORM_ADMIN_EMAILS`), con gráficas SVG propias y
  export CSV.
- **Gotchas:** `@supabase/supabase-js` requiere **Node 22+** en Railway
  (`NIXPACKS_NODE_VERSION=22`); el `.railwayignore` de la raíz aplica también a los
  subdirectorios (hay que anclar rutas con `/`); insertar acentos vía curl en Git
  Bash corrompe el UTF-8 (usar node fetch).
- **Pendiente:** configurar WhatsApp en Meta (el código está listo; necesita número
  y WABA **propios**, no reusar el de igeogo).

---

## 8. Estado actual y prioridades (auditado el 2026-08-14)

### Infraestructura: todo en verde ✅
| Servicio | URL | Estado |
|---|---|---|
| Landing ingizer | ingizer.com + www | 200, SSL OK |
| gizer (Bubble) | app.ingizer.com + /login | 200, SSL OK |
| igeogo | igeogo.ingizer.com (+ `/`, `/usuarios/`, `/negocios/`, `/app/`, `/panel/`) | 200, `/health` OK |
| PosBank landing | posbank.ingizer.com | 200 |
| PosBank app | app.posbank.ingizer.com | 200, ruteo SPA OK |
| PosBank API | posbank-api-production.up.railway.app | `/health` OK |

Ningún servicio caído, ningún certificado vencido, ningún enlace externo roto
(bizzopp, calendly, instagram). Los 2 defectos encontrados ya están corregidos.

### Pendientes reales

**🔴 Bloqueantes — el diagnóstico de gizer no sirve hoy:**
1. **Bug del Thread ID** — el agente de diagnóstico no ve las respuestas del
   formulario (los threads son por agente). Fix: pasar
   `{{2.executionSteps[].toolCalls[].arguments}}` en el Message del módulo [7].
2. **Probar end-to-end real** desde app.ingizer.com tras el fix.
3. **Saldo de Anthropic** — Tier 1 con USD 5 da 429 en la pregunta ~13. Cargar
   ~USD 40 (ya pasó la fecha: era la semana del 12-ago-2026) + auto-reload.

**🟠 Calidad del diagnóstico:**
4. Los **5 ajustes al prompt** de las 21 preguntas (años 2024/2025/2026, adaptación
   al contexto, quitar jerga contable, B8 que reconozca lo dicho, pregunta de
   ambición sin sesgo).
5. Conectar las **8 preguntas huérfanas** a los análisis (sobre todo A3/A5 → análisis 01).
6. `save_analysis` debe actualizar el badge de estado a "Creado" en Bubble.

**🟠 Negocio bloqueado:**
7. **Wompi**: respuesta sobre el mínimo de $150.000 COP — bloquea 3 de los 4 planes
   de igeogo. Sin esto, el modelo de cobro de igeogo no es viable como está.
8. **igeogo → producción de WhatsApp**: conseguir la SIM nueva, verificación de
   negocio en Meta, aprobación de la plantilla `oferta_cercana`, método de pago y
   publicar la app en modo Live.

**🟡 Mantenimiento y siguiente fase:**
9. `git push` del commit `b802db0` de la landing (lo hace el usuario).
10. **Fase 2 de gizer**: migrar de Bubble a Railway + Supabase antes de diciembre 2026.
11. Canal WhatsApp de gizer (continuidad web→WhatsApp, Nivel B).
12. PosBank: configurar WhatsApp en Meta (código listo, falta número + WABA propios).

---

## 9. Reglas que no se deben romper

1. **Marca:** minúsculas, sin emoji en UI, colores y tipografías exactos, logos
   copiados del brand kit (nunca redibujados).
2. **DNS:** siempre registros aditivos; nunca tocar MX ni los TXT de verificación
   ni los CNAME de los vecinos.
3. **Meta:** tres portfolios separados (`1ngizer`, `Ingizer SAS`, `PosBank`); nunca
   cruzar números ni WABAs entre productos.
4. **Secretos:** nunca en el código ni en el chat; siempre variables de entorno.
   Todo secreto que aparezca en una conversación se rota.
5. **gizer:** la lógica nueva va en Make/Claude, no en Bubble (que se va a apagar).
6. **Cálculos financieros:** aritmética exacta en código, nunca en el LLM.
7. **Diagnóstico:** honestidad con los datos faltantes (`sin_dato`) — **nunca
   inventar cifras**; las respuestas reales de los usuarios suelen ser cortas y pobres.
8. **Netlify:** cuidado con los deploys (15 créditos c/u); preferir Railway para
   proyectos con desarrollo activo.
