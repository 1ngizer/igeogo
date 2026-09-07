# ingizer — Reglas de marca (handoff)

Este proyecto define la identidad de **ingizer**, plataforma de consultoría
financiera con IA. Úsalo como fuente de verdad al construir páginas, landings o
UI. Los logos definitivos y las reglas están abajo; los SVGs copy-paste están en
`brand/logos.html` y los tokens en `brand/tokens.md`.

## Arquitectura de marca
- **gizer** = el asistente de IA (el personaje). Su símbolo es el reloj-medidor
  con espectro rojo→verde (alerta a la izquierda, gestión a la derecha).
  Logos definitivos: opción **9a** (mark) y **9c** (ícono de app), en
  `Logo Gizer 9a-9c.dc.html`.
- **ingizer** = la compañía/producto. Wordmark en **Comfortaa** con el ícono de
  gizer (tile navy) como firma a la derecha. Opción definitiva: **J1**
  (wordmark + ícono), en `Logo ingizer marca.dc.html`. No usar la variante de
  paréntesis.

## Nombre
- Siempre en minúsculas: `ingizer`, `gizer`. Nunca "Ingizer" ni "INGIZER".
- Tagline: `#EmpowerYourBusiness` — un solo hashtag PascalCase, uso escaso
  (footers, hero, social). Nunca como cuerpo de texto.
- Idioma de producto: inglés. Cifras tabulares en tablas/KPIs.

## Color (ver brand/tokens.md)
- **Brand navy `#081C2A`** — texto, CTA primario, fondo oscuro.
- **Espectro del medidor** — `#FF2E27` → `#FF8F1B` → `#FCD006` → `#9FDA20` →
  `#04C537`. Es acento y estado (danger→success). **Nunca** como fondo genérico.
- **Verde `#04C537`** — CTA de acción/éxito y acento de marca. Hover `#06B033`.
- Neutros fríos: fondo `#F7F9FB`, superficie `#FFFFFF`, borde `#E1E7ED`,
  texto secundario `#5A6B7A`.

## Tipografía
- **Comfortaa** (400–700): wordmark y titulares de marca. Peso 600, tracking
  -0.01em para el wordmark.
- **Poppins** (300–700): UI y cuerpo.
- **JetBrains Mono**: código y cifras que deben alinearse.

## Reglas de logo
- No inclinar, deformar, recolorear el wordmark ni ponerlo sobre fondo de
  espectro. El mark multicolor va sobre navy o blanco.
- El ícono de app va sobre navy; a ≤48px el medidor se simplifica a 2 arcos
  (rojo/verde). Usa la variante de 2 arcos de `brand/logos.html`.
- Clearspace del lockup: separación mínima = altura de la "i".

## Estilo de UI
- Tarjetas: fondo blanco, borde 1px `#E1E7ED` **o** sombra suave (no ambos),
  radio 14px, padding 24px.
- Botones/inputs radio 10px; pills radio 999px; modales 20px.
- Sombras teñidas de navy, no negro puro. Foco: halo verde
  `0 0 0 3px rgba(4,197,55,0.35)`.
- Motion sobrio (220ms, ease-out). Sin animación ambiental en producto; el arco
  del medidor puede pulsar en superficies de marketing.
- Sin emoji. El espectro del medidor es el recurso visual de estado.

## Al construir un logo en código
No lo redibujes a mano — copia el SVG correspondiente de `brand/logos.html`.
El design system está bindeado en
`_ds/ingizer-design-system-019dda95-89f4-701d-9049-3a2874a281e3/`; carga
`colors_and_type.css` y `_ds_bundle.js` en cada Design Component.
