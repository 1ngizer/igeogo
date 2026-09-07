#!/usr/bin/env node
// Sincroniza el objeto `projects` de abajo con una base de datos de Notion.
//
// Setup (una sola vez):
//   1. npm install
//   2. En notion.so/my-integrations crea (o reusa) una integración interna,
//      copia su "Internal Integration Secret" a NOTION_TOKEN en .env.
//   3. Crea (o reusa) una base de datos en Notion con estas propiedades:
//        Name              → title
//        Avance            → number (formato porcentaje o entero 0-100)
//        Bloqueos          → text
//        Próxima Tarea     → text
//        Estado del proyecto → select (En curso / Bloqueado / Listo)
//        Prioridad         → select (Alta / Media / Baja)
//        Backlog           → text (una subtarea por línea)
//   4. Abre esa base → "..." (arriba a la derecha) → Connections → conecta tu integración.
//   5. Copia el ID de la base desde su URL a NOTION_DATABASE_ID en .env
//      (notion.so/<workspace>/<ESTE_ID>?v=...).
//
// Uso normal: al final de cada sesión, reemplaza el objeto `projects` con el
// fragmento que te entrego y corre `node sync.js` (o `npm run sync`).

require('dotenv').config();
const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// ─────────────────────────────────────────────────────────────────────────
// MÉTRICAS DEL ECOSISTEMA — se reemplaza este objeto completo al cierre de
// cada sesión de trabajo (ver Fase 3 del protocolo de PM).
// ─────────────────────────────────────────────────────────────────────────
const projects = {
  "ingizer": {
    "Avance": 90,
    "Bloqueos": "Ninguno",
    "Próxima Tarea": "Decidir cuál CTA de WhatsApp se queda en el popup de diagnóstico (ícono vs botón grande).",
    "Estado del proyecto": "En curso",
    "Prioridad": "Media",
    "Backlog": [
      "Decidir cuál CTA de WhatsApp se queda (ícono vs botón grande)",
      "Verificar el formato HTML del correo al cliente en una bandeja real",
      "Correr las ramas A (emprendimiento) y C (startup) de punta a punta en producción",
      "Construir el link condicional a PosBank en el popup de diagnóstico",
      "Limpiar los 3 agentes huérfanos en Make (pedir confirmación antes de borrar)"
    ]
  },
  "PosBank": {
    "Avance": 92,
    "Bloqueos": "Ninguno de nuestro lado — verificación de organización de Ingizer SAS enviada a Meta (ID 2466523423840491), estado \"In review\", ~48h de espera externa.",
    "Próxima Tarea": "Cuando Meta confirme \"Verified\": conectar la app del Developer Console al portfolio PosBank y activar el producto WhatsApp.",
    "Estado del proyecto": "En curso",
    "Prioridad": "Media",
    "Backlog": [
      "Conectar WhatsApp cuando Meta confirme la verificación de organización",
      "Plan B si Meta rechaza de nuevo: WABA dentro del portfolio Ingizer SAS, sin tocar el WhatsApp de gizer",
      "Confirmar en un Echo físico que \"pos bank\" se reconoce bien por voz",
      "Decidir si se busca certificación pública del skill de Alexa (hoy en Beta Test)",
      "Fase 2 y 3 del roadmap (hoy solo estructura, sin construir)"
    ]
  },
  "igeogo": {
    "Avance": 60,
    "Bloqueos": "Wompi rechaza transacciones bajo $150.000 COP — rompe 3 de los 4 planes de precio actuales (pago por mensaje, Básico, Pro). Escalado a soporte de Wompi, sin respuesta aún.",
    "Próxima Tarea": "Dar seguimiento a soporte de Wompi sobre el mínimo de transacción, y mientras tanto rediseñar los planes para que todos superen $150.000 COP.",
    "Estado del proyecto": "Bloqueado",
    "Prioridad": "Alta",
    "Backlog": [
      "Resolver o mitigar el mínimo de transacción de Wompi ($150.000 COP)",
      "Esperar resultado de la Verificación de Negocio de Meta (en revisión)",
      "Conseguir el número nuevo dedicado al bot (no reusar +573213737341)",
      "Configurar método de pago en WhatsApp Manager y publicar la app en modo Live",
      "Actualizar el código de despacho de campañas para usar la plantilla aprobada 'oferta_cercana'",
      "Verificación del Google Business Profile (en curso, ~5 días)"
    ]
  }
};

function toRichText(text) {
  return { rich_text: [{ text: { content: String(text).slice(0, 2000) } }] };
}

function projectToProperties(data) {
  return {
    "Avance": { number: data["Avance"] },
    "Bloqueos": toRichText(data["Bloqueos"]),
    "Próxima Tarea": toRichText(data["Próxima Tarea"]),
    "Estado del proyecto": { select: { name: data["Estado del proyecto"] } },
    "Prioridad": { select: { name: data["Prioridad"] } },
    "Backlog": toRichText(data["Backlog"].map(item => `• ${item}`).join('\n')),
  };
}

async function findPageByName(notion, name) {
  const res = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: 'Name', title: { equals: name } },
  });
  return res.results[0] || null;
}

async function upsertProject(notion, name, data) {
  const properties = projectToProperties(data);
  const existing = await findPageByName(notion, name);

  if (existing) {
    await notion.pages.update({ page_id: existing.id, properties });
    console.log(`  ↻ actualizado: ${name}`);
  } else {
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: { Name: { title: [{ text: { content: name } }] }, ...properties },
    });
    console.log(`  + creado: ${name}`);
  }
}

async function main() {
  if (!NOTION_TOKEN || !DATABASE_ID) {
    console.error('Faltan NOTION_TOKEN y/o NOTION_DATABASE_ID en .env — ver las instrucciones al inicio de este archivo.');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  console.log(`Sincronizando ${Object.keys(projects).length} proyectos con Notion...`);
  for (const [name, data] of Object.entries(projects)) {
    try {
      await upsertProject(notion, name, data);
    } catch (err) {
      console.error(`  ✗ error en ${name}:`, err.body || err.message);
    }
  }
  console.log('Listo.');
}

main();
