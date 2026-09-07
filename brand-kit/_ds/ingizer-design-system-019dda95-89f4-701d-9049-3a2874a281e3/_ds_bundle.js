/* @ds-bundle: {"format":3,"namespace":"IngizerDesignSystem_019dda","components":[],"sourceHashes":{"logo-explorations/LogoProposals2.jsx":"82ce5b2b96f1","logo-explorations/LogoVariants.jsx":"3a7d5e445dbf","logo-explorations/design-canvas.jsx":"5d0e39003628"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IngizerDesignSystem_019dda = window.IngizerDesignSystem_019dda || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// logo-explorations/LogoProposals2.jsx
try { (() => {
// LogoProposals2.jsx — Round 2: 8 fresh logo proposals for ingizer
// Brand colors: navy #081C2A · meter (red→orange→yellow→lime→green)
// Goal: explore directions NOT covered in Round 1. More daring, more varied.

const NAVY = "#081C2A";
const RED = "#FF2E27",
  ORANGE = "#FF8F1B",
  YELLOW = "#FCD006",
  LIME = "#9FDA20",
  GREEN = "#04C537";
function MeterDefs({
  id
}) {
  return /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: id,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: RED
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "28%",
    stopColor: ORANGE
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "52%",
    stopColor: YELLOW
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "76%",
    stopColor: LIME
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: GREEN
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: id + "-v",
    x1: "0%",
    y1: "100%",
    x2: "0%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: RED
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "28%",
    stopColor: ORANGE
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "52%",
    stopColor: YELLOW
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "76%",
    stopColor: LIME
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: GREEN
  })));
}
const arc = (cx, cy, r, a1, a2) => {
  const t = a => a * Math.PI / 180;
  const x1 = cx + r * Math.cos(t(a1)),
    y1 = cy + r * Math.sin(t(a1));
  const x2 = cx + r * Math.cos(t(a2)),
    y2 = cy + r * Math.sin(t(a2));
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

/* ─────────────────────────────────────────────────────────────────
   P1 — STACKED BARS RISING (chart-as-monogram)
   Five vertical bars in the meter spectrum, ascending — reads as
   bar chart + as the letter 'i' (the tallest bar). Pure data-viz.
   ───────────────────────────────────────────────────────────────── */
function P1Bars() {
  const bars = [{
    x: 30,
    h: 60,
    c: RED
  }, {
    x: 64,
    h: 90,
    c: ORANGE
  }, {
    x: 98,
    h: 110,
    c: YELLOW
  }, {
    x: 132,
    h: 140,
    c: LIME
  }, {
    x: 166,
    h: 170,
    c: GREEN
  }];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: b.x - 12,
    y: 190 - b.h,
    width: "24",
    height: b.h,
    rx: "4",
    fill: b.c
  })));
}

/* ─────────────────────────────────────────────────────────────────
   P2 — INFINITY / FLOW (the loop of intelligence)
   A continuous figure-8 stroke that flows through the spectrum —
   AI as a self-improving loop. Sophisticated, abstract.
   ───────────────────────────────────────────────────────────────── */
function P2Infinity() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p2g"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100 100 C 100 60, 60 60, 50 100 C 40 140, 100 140, 100 100 C 100 60, 160 60, 150 100 C 140 140, 100 140, 100 100 Z",
    fill: "none",
    stroke: "url(#p2g)",
    strokeWidth: "14",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P3 — UPWARD ARROW IN A CIRCLE (most enterprise, most fintech)
   Bold navy circle, gradient arrow piercing upward through it.
   Confident, direct — Stripe / Mercury energy.
   ───────────────────────────────────────────────────────────────── */
function P3Arrow() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p3g"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100 50 L 100 150 M 70 80 L 100 50 L 130 80",
    stroke: `url(#p3g-v)`,
    strokeWidth: "16",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P4 — CIRCUIT 'i' (AI native, electric)
   The 'i' as a circuit trace — node, line, terminal node. Reads
   as 'intelligence + energy' literally. Tech-forward.
   ───────────────────────────────────────────────────────────────── */
function P4Circuit() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p4g"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "50",
    r: "16",
    fill: "url(#p4g)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "50",
    r: "6",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100 70 L 100 130 L 60 130 L 60 160",
    stroke: NAVY,
    strokeWidth: "8",
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100 130 L 140 130 L 140 160",
    stroke: NAVY,
    strokeWidth: "8",
    fill: "none",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "160",
    r: "9",
    fill: GREEN
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "160",
    r: "9",
    fill: GREEN
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P5 — PRISM / SPECTRUM SPLIT (Pink Floyd vibes, but for finance)
   Navy triangle "splits" white light into the meter spectrum on
   exit — a metaphor for AI revealing the components inside data.
   Striking, distinctive.
   ───────────────────────────────────────────────────────────────── */
function P5Prism() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "20",
    y: "96",
    width: "50",
    height: "8",
    rx: "3",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 70 60 L 130 100 L 70 140 Z",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("line", {
    x1: "130",
    y1: "100",
    x2: "180",
    y2: "60",
    stroke: RED,
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "130",
    y1: "100",
    x2: "184",
    y2: "80",
    stroke: ORANGE,
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "130",
    y1: "100",
    x2: "186",
    y2: "100",
    stroke: YELLOW,
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "130",
    y1: "100",
    x2: "184",
    y2: "120",
    stroke: LIME,
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "130",
    y1: "100",
    x2: "180",
    y2: "140",
    stroke: GREEN,
    strokeWidth: "6",
    strokeLinecap: "round"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P6 — 'IG' MONOGRAM, INTERLOCKED
   The 'i' and 'g' (in + gizer) interlocked. The bowl of the 'g'
   is the gauge. Most sophisticated wordmark-as-mark.
   ───────────────────────────────────────────────────────────────── */
function P6IG() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p6g"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "44",
    y: "80",
    width: "20",
    height: "80",
    rx: "4",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "54",
    cy: "58",
    r: "14",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(54, 60, 8, 200, 340),
    stroke: "url(#p6g)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "120",
    cy: "100",
    r: "36",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "14"
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(120, 100, 36, 200, 340),
    stroke: "url(#p6g)",
    strokeWidth: "14",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "146",
    y: "78",
    width: "14",
    height: "76",
    rx: "4",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 146 154 Q 120 174, 96 154",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "14",
    strokeLinecap: "round"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P7 — PULSE / HEARTBEAT LINE (alive, real-time)
   A heartbeat / EKG line in the spectrum, contained in a soft
   navy capsule. "Your business has a pulse, ingizer reads it."
   ───────────────────────────────────────────────────────────────── */
function P7Pulse() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p7g"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "68",
    width: "172",
    height: "64",
    rx: "32",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 30 100 L 60 100 L 75 70 L 95 130 L 115 60 L 135 100 L 170 100",
    stroke: "url(#p7g)",
    strokeWidth: "6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   P8 — THE 'I' AS A LIGHTNING BOLT
   Pure typography play: the 'i' of ingizer is a literal bolt.
   Could be used as both standalone mark AND as a custom letter
   inside the wordmark. Bold, ownable, instantly readable.
   ───────────────────────────────────────────────────────────────── */
function P8BoltI() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterDefs, {
    id: "p8g"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "40",
    r: "14",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 110 70 L 75 115 L 100 120 L 88 170 L 130 115 L 105 110 Z",
    fill: "url(#p8g-v)"
  }));
}

/* ─────────────────────────────────────────────────────────────────
   Display chrome
   ───────────────────────────────────────────────────────────────── */
function Card({
  Mark,
  name,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      padding: 28,
      borderRadius: 14,
      border: "1px solid #E1E7ED",
      boxShadow: "0 2px 4px rgba(8,28,42,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      width: 460,
      height: 420,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "#6B7884"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Mark, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      color: NAVY
    }
  }, "ingizer")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: "#6B7884"
    }
  }, note));
}
function CardDark({
  Mark,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: NAVY,
      padding: 28,
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      width: 460,
      height: 280,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "rgba(255,255,255,0.55)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Mark, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      color: "#FFFFFF"
    }
  }, "ingizer")));
}
function Scale({
  Mark,
  name
}) {
  const wrap = size => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${size / 200})`,
      transformOrigin: "0 0",
      width: 200,
      height: 200
    }
  }, /*#__PURE__*/React.createElement(Mark, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#6B7884",
      fontFamily: "Poppins"
    }
  }, size, "px"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      padding: 24,
      borderRadius: 14,
      border: "1px solid #E1E7ED",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      width: 360,
      height: 200,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "#6B7884"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 24,
      justifyContent: "center"
    }
  }, wrap(16), " ", wrap(32), " ", wrap(64), " ", wrap(96)));
}
const PROPOSALS = [{
  id: "p1",
  Mark: P1Bars,
  name: "P1 · Stacked bars rising",
  note: "Five bars in the spectrum, ascending. Reads as bar chart + as the letter 'i' (the tallest bar). Pure data-viz."
}, {
  id: "p2",
  Mark: P2Infinity,
  name: "P2 · Infinity / flow loop",
  note: "Continuous figure-8 through the spectrum. AI as a self-improving loop — sophisticated and abstract."
}, {
  id: "p3",
  Mark: P3Arrow,
  name: "P3 · Upward arrow in disc",
  note: "Bold navy disc, gradient arrow piercing upward. The most enterprise / Stripe-Mercury direction."
}, {
  id: "p4",
  Mark: P4Circuit,
  name: "P4 · Circuit 'i'",
  note: "The 'i' as a circuit trace with gradient orb + green terminals. Literally 'intelligence + energy'."
}, {
  id: "p5",
  Mark: P5Prism,
  name: "P5 · Prism / spectrum split",
  note: "Navy triangle splits white into the spectrum. Metaphor: AI revealing what's inside the data. Striking."
}, {
  id: "p6",
  Mark: P6IG,
  name: "P6 · 'ig' interlocked monogram",
  note: "The i + g of in-gizer. The bowl of the 'g' is the meter. Most sophisticated typographic play."
}, {
  id: "p7",
  Mark: P7Pulse,
  name: "P7 · Pulse / heartbeat",
  note: "EKG line through a navy capsule. 'Your business has a pulse — ingizer reads it.' Alive, real-time."
}, {
  id: "p8",
  Mark: P8BoltI,
  name: "P8 · Lightning 'i'",
  note: "The 'i' becomes a literal bolt. Works standalone AND as a custom letter inside the wordmark. Most ownable."
}];
function App() {
  return /*#__PURE__*/React.createElement(DesignCanvas, {
    title: "ingizer \xB7 8 new logo proposals",
    subtitle: "Round 2. Daring directions: charts, infinity, arrow, circuit, prism, monogram, pulse, bolt-i. All SVG, fully editable."
  }, /*#__PURE__*/React.createElement(DCSection, {
    id: "lockups",
    title: "Full lockup \u2014 mark + wordmark"
  }, PROPOSALS.map(p => /*#__PURE__*/React.createElement(DCArtboard, {
    key: p.id,
    id: "l-" + p.id,
    label: p.name,
    width: 460,
    height: 420
  }, /*#__PURE__*/React.createElement(Card, {
    Mark: p.Mark,
    name: p.name,
    note: p.note
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "dark",
    title: "On dark \u2014 does the brand survive at night?"
  }, PROPOSALS.map(p => /*#__PURE__*/React.createElement(DCArtboard, {
    key: p.id,
    id: "d-" + p.id,
    label: p.name + " · dark",
    width: 460,
    height: 280
  }, /*#__PURE__*/React.createElement(CardDark, {
    Mark: p.Mark,
    name: p.name
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "scale",
    title: "Scale test \u2014 favicon survival"
  }, PROPOSALS.map(p => /*#__PURE__*/React.createElement(DCArtboard, {
    key: p.id,
    id: "s-" + p.id,
    label: p.name,
    width: 360,
    height: 200
  }, /*#__PURE__*/React.createElement(Scale, {
    Mark: p.Mark,
    name: p.name
  })))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "logo-explorations/LogoProposals2.jsx", error: String((e && e.message) || e) }); }

// logo-explorations/LogoVariants.jsx
try { (() => {
// LogoVariants.jsx — 6 SVG explorations of the ingizer mark
// Brand colors:
//   navy   #081C2A
//   red    #FF2E27   orange #FF8F1B   yellow #FCD006
//   lime   #9FDA20   green  #04C537

const NAVY = "#081C2A";
const STOPS = [{
  o: "0%",
  c: "#FF2E27"
}, {
  o: "28%",
  c: "#FF8F1B"
}, {
  o: "52%",
  c: "#FCD006"
}, {
  o: "76%",
  c: "#9FDA20"
}, {
  o: "100%",
  c: "#04C537"
}];

// Shared gradient defs — give each variant a unique id to avoid collisions
function MeterGradient({
  id
}) {
  return /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: id,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, STOPS.map((s, i) => /*#__PURE__*/React.createElement("stop", {
    key: i,
    offset: s.o,
    stopColor: s.c
  }))));
}

// Helper: arc from angle a1 to a2 (degrees, 0 = 3 o'clock, going clockwise),
// returns SVG path d for an arc on circle (cx, cy, r).
function arcPath(cx, cy, r, a1, a2) {
  const toRad = a => a * Math.PI / 180;
  const x1 = cx + r * Math.cos(toRad(a1));
  const y1 = cy + r * Math.sin(toRad(a1));
  const x2 = cx + r * Math.cos(toRad(a2));
  const y2 = cy + r * Math.sin(toRad(a2));
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
}

/* ──────────────────────────────────────────────────────────────────────
   V1 — REFINED ORIGINAL
   Same concept, fixed: no more "robot face" (single slot, not two eyes),
   reconnected the prong, cleaner arc, balanced negative space.
   ────────────────────────────────────────────────────────────────────── */
function V1Refined() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 100, 70, 200, 340),
    stroke: "url(#g1)",
    strokeWidth: "14",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "68",
    y: "88",
    width: "64",
    height: "44",
    rx: "8",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "82",
    y: "106",
    width: "36",
    height: "8",
    rx: "3",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("rect", {
    x: "96",
    y: "132",
    width: "8",
    height: "22",
    rx: "2",
    fill: NAVY
  }));
}

/* ──────────────────────────────────────────────────────────────────────
   V2 — METER WITH NEEDLE (the brand's strongest metaphor)
   Drops the plug, leans fully into "performance gauge". A real needle
   pointing into the green zone makes the meaning unambiguous.
   ────────────────────────────────────────────────────────────────────── */
function V2Needle() {
  // needle pointing at ~325° (in the green region of a 200°→340° arc)
  const cx = 100,
    cy = 110,
    len = 56;
  const a = 320 * Math.PI / 180;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(cx, cy, 60, 200, 340),
    stroke: "url(#g2)",
    strokeWidth: "16",
    strokeLinecap: "round",
    fill: "none"
  }), [200, 235, 270, 305, 340].map((deg, i) => {
    const r1 = 76,
      r2 = 84;
    const rad = deg * Math.PI / 180;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx + r1 * Math.cos(rad),
      y1: cy + r1 * Math.sin(rad),
      x2: cx + r2 * Math.cos(rad),
      y2: cy + r2 * Math.sin(rad),
      stroke: NAVY,
      strokeWidth: "2.5",
      strokeLinecap: "round"
    });
  }), /*#__PURE__*/React.createElement("line", {
    x1: cx,
    y1: cy,
    x2: cx + len * Math.cos(a),
    y2: cy + len * Math.sin(a),
    stroke: NAVY,
    strokeWidth: "5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "7",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "2.5",
    fill: "white"
  }));
}

/* ──────────────────────────────────────────────────────────────────────
   V3 — ABSTRACT PLUG / LIGHTNING (premium fintech)
   Strips the "robot face" entirely. The plug becomes an abstract
   energy mark — a stylized 'i' (intelligence) shaped like a plug + bolt.
   Cleanest, most enterprise-ready.
   ────────────────────────────────────────────────────────────────────── */
function V3AbstractPlug() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 100, 72, 200, 340),
    stroke: "url(#g3)",
    strokeWidth: "10",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "76",
    r: "8",
    fill: "white"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100 90 L 100 138",
    stroke: "white",
    strokeWidth: "14",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "92",
    y: "100",
    width: "3",
    height: "14",
    rx: "1.5",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("rect", {
    x: "105",
    y: "100",
    width: "3",
    height: "14",
    rx: "1.5",
    fill: NAVY
  }));
}

/* ──────────────────────────────────────────────────────────────────────
   V4 — MONOGRAM 'i' WITH METER
   The dot of the 'i' is the meter. Most reductive — works perfectly
   at favicon size. Quietly elegant.
   ────────────────────────────────────────────────────────────────────── */
function V4Monogram() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "86",
    y: "92",
    width: "28",
    height: "80",
    rx: "6",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "58",
    r: "28",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 60, 18, 200, 340),
    stroke: "url(#g4)",
    strokeWidth: "6",
    strokeLinecap: "round",
    fill: "none"
  }));
}

/* ──────────────────────────────────────────────────────────────────────
   V5 — UPWARD CHART + ENERGY
   The financial story: a chart line rising into a bolt. No plug. Pure
   "energy applied to numbers". Reads as fintech instantly.
   ────────────────────────────────────────────────────────────────────── */
function V5ChartBolt() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: "none",
    stroke: NAVY,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 50 140 L 80 120 L 105 130 L 130 90",
    stroke: "url(#g5)",
    strokeWidth: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 130 60 L 118 90 L 130 92 L 122 120 L 148 86 L 134 84 Z",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "140",
    r: "4",
    fill: NAVY
  }));
}

/* ──────────────────────────────────────────────────────────────────────
   V6 — CONCENTRIC METER (most data-viz)
   Three concentric arcs at different radii, like a multi-metric dashboard
   ring (think Apple Activity rings, but ingizer's spectrum). Most
   "AI / analytics platform" in feel.
   ────────────────────────────────────────────────────────────────────── */
function V6Concentric() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "200",
    height: "200"
  }, /*#__PURE__*/React.createElement(MeterGradient, {
    id: "g6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "90",
    fill: NAVY
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 100, 72, 200, 340),
    stroke: "url(#g6)",
    strokeWidth: "8",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 100, 58, 200, 320),
    stroke: "url(#g6)",
    strokeWidth: "8",
    strokeLinecap: "round",
    fill: "none",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: arcPath(100, 100, 44, 200, 295),
    stroke: "url(#g6)",
    strokeWidth: "8",
    strokeLinecap: "round",
    fill: "none",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "9",
    fill: "white"
  }));
}

// ────────────────────────────────────────────────────────────────────────
// Lockup helper — show mark + wordmark + variant label
// ────────────────────────────────────────────────────────────────────────
function Lockup({
  Mark,
  name,
  note,
  dark = false
}) {
  const bg = dark ? NAVY : "#FFFFFF";
  const fg = dark ? "#FFFFFF" : NAVY;
  const sub = dark ? "rgba(255,255,255,0.55)" : "#6B7884";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      color: fg,
      padding: 32,
      borderRadius: 14,
      display: "flex",
      flexDirection: "column",
      gap: 24,
      border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E1E7ED",
      width: 480,
      minHeight: 360,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: sub
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Mark, null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      color: fg
    }
  }, "ingizer")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: sub
    }
  }, note));
}
function MarkOnly({
  Mark,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      padding: 28,
      borderRadius: 14,
      border: "1px solid #E1E7ED",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      width: 240,
      height: 320,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement(Mark, null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "#6B7884",
      textAlign: "center"
    }
  }, label));
}

// Favicon-size preview (16, 32, 64)
function ScaleTest({
  Mark,
  label
}) {
  const wrap = size => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${size / 200})`,
      transformOrigin: "0 0",
      width: 200,
      height: 200
    }
  }, /*#__PURE__*/React.createElement(Mark, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#6B7884",
      fontFamily: "Poppins"
    }
  }, size, "px"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      padding: 24,
      borderRadius: 14,
      border: "1px solid #E1E7ED",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      width: 360,
      fontFamily: "Poppins, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "#6B7884"
    }
  }, label, " \xB7 scale test"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 24,
      justifyContent: "center"
    }
  }, wrap(16), " ", wrap(32), " ", wrap(64), " ", wrap(120)));
}
const VARIANTS = [{
  id: "v1",
  Mark: V1Refined,
  name: "V1 · Refined original",
  note: "Same concept, fixed: single slot (not two eyes → no robot face), reconnected prong, cleaner arc geometry. The safest evolution."
}, {
  id: "v2",
  Mark: V2Needle,
  name: "V2 · Gauge with needle",
  note: "Drops the plug, leans into the meter. A real needle pointing at the green zone makes 'performance gauge' unambiguous. Most fintech."
}, {
  id: "v3",
  Mark: V3AbstractPlug,
  name: "V3 · Abstract plug + bolt",
  note: "Stripped 'face', flat navy disc with a stylized i / bolt / plug hybrid. Most premium — feels enterprise-ready."
}, {
  id: "v4",
  Mark: V4Monogram,
  name: "V4 · Monogram 'i' + meter",
  note: "The dot of the 'i' is the gauge. Most reductive — functions perfectly at 16×16. Quiet and elegant."
}, {
  id: "v5",
  Mark: V5ChartBolt,
  name: "V5 · Chart line + bolt",
  note: "Rising line into a lightning bolt. No plug, no face — pure 'energy applied to numbers'. Reads as fintech instantly."
}, {
  id: "v6",
  Mark: V6Concentric,
  name: "V6 · Concentric rings",
  note: "Three nested gauge arcs of varying length, like Apple Activity rings. Most 'AI analytics platform' in feel."
}];
function App() {
  return /*#__PURE__*/React.createElement(DesignCanvas, {
    title: "ingizer \xB7 logo explorations",
    subtitle: "Six directions, side by side. All assume keep concept (energy + meter) and refine. SVG, fully editable."
  }, /*#__PURE__*/React.createElement(DCSection, {
    id: "originals",
    title: "Starting point"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "original",
    label: "Current logo (provided)",
    width: 520,
    height: 360
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      padding: 32,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/INGIZER_LOGOS-RGB_5.png",
    style: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain"
    }
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "lockups",
    title: "Variants \u2014 full lockup"
  }, VARIANTS.map(v => /*#__PURE__*/React.createElement(DCArtboard, {
    key: v.id,
    id: "lockup-" + v.id,
    label: v.name,
    width: 480,
    height: 360
  }, /*#__PURE__*/React.createElement(Lockup, {
    Mark: v.Mark,
    name: v.name,
    note: v.note
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "dark",
    title: "Variants \u2014 on dark"
  }, VARIANTS.map(v => /*#__PURE__*/React.createElement(DCArtboard, {
    key: v.id,
    id: "dark-" + v.id,
    label: v.name + " · dark",
    width: 480,
    height: 360
  }, /*#__PURE__*/React.createElement(Lockup, {
    Mark: v.Mark,
    name: v.name,
    note: "",
    dark: true
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "scale",
    title: "Scale test \u2014 does it survive at favicon size?"
  }, VARIANTS.map(v => /*#__PURE__*/React.createElement(DCArtboard, {
    key: v.id,
    id: "scale-" + v.id,
    label: v.name,
    width: 360,
    height: 200
  }, /*#__PURE__*/React.createElement(ScaleTest, {
    Mark: v.Mark,
    label: v.name
  })))), /*#__PURE__*/React.createElement(DCSection, {
    id: "marks",
    title: "Mark only \u2014 pure symbol"
  }, VARIANTS.map(v => /*#__PURE__*/React.createElement(DCArtboard, {
    key: v.id,
    id: "mark-" + v.id,
    label: v.name,
    width: 240,
    height: 320
  }, /*#__PURE__*/React.createElement(MarkOnly, {
    Mark: v.Mark,
    label: v.name
  })))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "logo-explorations/LogoVariants.jsx", error: String((e && e.message) || e) }); }

// logo-explorations/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), labels/titles are inline-editable,
// and any artboard can be opened in a fullscreen focus overlay (←/→/Esc).
// State persists to a .design-canvas.state.json sidecar via the host
// bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}', '.dc-card{transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px}', '.dc-grip{cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{cursor:pointer;border-radius:4px;padding:3px 6px;display:flex;align-items:center;transition:background .12s}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-expand{position:absolute;bottom:100%;right:0;margin-bottom:5px;z-index:2;opacity:0;transition:opacity .12s,background .12s;', '  width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center}', '.dc-expand:hover{background:rgba(0,0,0,.06);color:#2a251f}', '[data-dc-slot]:hover .dc-expand{opacity:1}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, focused
// artboard). Order/titles/labels persist to a .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const srcIds = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (!aid) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const srcOrder = artboards.map(a => a.props.id ?? a.props.label);
  const sec = ctx && sid && ctx.section(sid) || {};
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 80,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px 56px'
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow",
    style: {
      position: 'absolute',
      bottom: '100%',
      left: -4,
      marginBottom: 4,
      color: DC.label
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    onPointerDown: e => e.stopPropagation(),
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    const ns = sectionOrder[(secIdx + d + sectionOrder.length) % sectionOrder.length];
    const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
    if (first) ctx.setFocus(`${ns}/${first}`);
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "logo-explorations/design-canvas.jsx", error: String((e && e.message) || e) }); }

})();
