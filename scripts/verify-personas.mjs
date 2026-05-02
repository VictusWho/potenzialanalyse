// Standalone verification: re-implements calculateScore identically to page.tsx
// and runs the 3 test personas through it + the branchen-benchmark ROI engine.
//
// Run: node scripts/verify-personas.mjs

import {
  findBenchmark,
  calculateRoi,
  techStackHint,
  pitchFrame,
  matchesPainKeyword,
} from "../src/lib/branchen-benchmarks.ts";

// MIRROR of calculateScore from page.tsx
function calculateScore(a) {
  const q6Map = { 1: 15, 2: 12, 3: 9, 4: 5, 5: 2 };
  const q6Points = q6Map[a.q6_zufriedenheit] ?? 0;

  const realTools = a.q4_tools.filter((t) => t !== "Keine / Weiß nicht");
  const hasKeine = a.q4_tools.includes("Keine / Weiß nicht");
  const onlyExcel =
    realTools.length === 1 && realTools[0] === "Excel/Google Sheets";
  let q9Points;
  if (hasKeine || realTools.length === 0) q9Points = 15;
  else if (onlyExcel) q9Points = 13;
  else if (realTools.length <= 2) q9Points = 12;
  else if (realTools.length <= 4) q9Points = 8;
  else q9Points = 4;

  const realTasks = a.q7_aufgaben.filter((t) => t !== "Keine der obigen");
  const q7q8MultMap = {
    "Unter 5h": 0.5,
    "5–10h": 1.0,
    "10–20h": 1.3,
    "Über 20h": 1.5,
    "Keine Ahnung": 1.0,
  };
  const q7q8Mult = q7q8MultMap[a.q8_stunden] ?? 1.0;
  const q7Points = Math.min(Math.round(realTasks.length * 4 * q7q8Mult), 25);

  const q8Map = {
    "Unter 5h": 5,
    "5–10h": 13,
    "10–20h": 20,
    "Über 20h": 25,
    "Keine Ahnung": 10,
  };
  const q8Points = q8Map[a.q8_stunden] ?? 0;

  const q10Map = {
    "Ja, systematisch": 0,
    "Manchmal, wenn ich dran denke": 7,
    Nein: 15,
    "Was ist Follow-up?": 15,
  };
  const q10Points = q10Map[a.q10_followup] ?? 0;

  const painText = (a.q3_nerv ?? "").trim();
  let painBonus;
  if (painText.length < 15) painBonus = 0;
  else if (matchesPainKeyword(painText)) painBonus = 5;
  else painBonus = 2;

  const normalized =
    q6Points + q9Points + q7Points + q8Points + q10Points + painBonus;

  let category;
  if (normalized < 35) category = "Niedrig";
  else if (normalized < 70) category = "Mittel";
  else category = "Hoch";

  return {
    q6Points,
    q9Points,
    q7Points,
    q8Points,
    q10Points,
    painBonus,
    normalized,
    category,
    realTasksCount: realTasks.length,
  };
}

const personas = [
  {
    label: "Persona 1 — Solo mit viel Pain",
    answers: {
      q1_branche: "Selbstständiger Coach",
      q2_mitarbeiter: "Nur ich",
      q3_nerv:
        "ich verbringe jeden Tag Stunden mit manueller Terminkoordination und vergesse ständig Follow-ups",
      q4_tools: ["Keine / Weiß nicht"],
      q4_tools_detail: {},
      q5_website: "",
      q5_url: "",
      q6_zufriedenheit: 1,
      q7_aufgaben: [
        "E-Mails beantworten",
        "Termine koordinieren",
        "Kundendaten pflegen",
        "Reports erstellen",
      ],
      q8_stunden: "Über 20h",
      q9_kundengewinnung: [],
      q10_followup: "Nein",
      q11_bestandskunden: "Unter 50",
      q12_wert: "",
      q13_geschwindigkeit: "Sofort",
      q14_zeitnutzung: "Persönliche Zeit / weniger Stress",
    },
    expectScoreMin: 75,
  },
  {
    label: "Persona 2 — Etabliert mit System",
    answers: {
      q1_branche: "Steuerberatung",
      q2_mitarbeiter: "16–50",
      q3_nerv: "",
      q4_tools: [
        "CRM-System",
        "Buchhaltungssoftware",
        "Projektmanagement",
        "Branchensoftware",
        "E-Mail Marketing",
      ],
      q4_tools_detail: {},
      q5_website: "",
      q5_url: "",
      q6_zufriedenheit: 4,
      q7_aufgaben: ["Reports erstellen", "Daten copy-pasten"],
      q8_stunden: "Unter 5h",
      q9_kundengewinnung: [],
      q10_followup: "Ja, systematisch",
      q11_bestandskunden: "Über 200",
      q12_wert: "",
      q13_geschwindigkeit: "Irgendwann",
      q14_zeitnutzung: "Strategie / Konzeption",
    },
    expectScoreMax: 35,
  },
  {
    label: "Persona 3 — Simon (Finanzberater)",
    answers: {
      q1_branche: "Unabhängige Finanzberatung",
      q2_mitarbeiter: "2–5",
      q3_nerv:
        "Bestandskunden manuell pflegen — Vertragsjubiläen, Geburtstage und auslaufende Verträge gehen unter, Cross-Selling-Chancen werden verpasst",
      q4_tools: ["CRM-System", "Branchensoftware"],
      q4_tools_detail: {},
      q5_website: "",
      q5_url: "",
      q6_zufriedenheit: 2,
      q7_aufgaben: [
        "E-Mails beantworten",
        "Kundendaten pflegen",
        "Angebote & Dokumente erstellen",
        "Kundenanfragen",
      ],
      q8_stunden: "10–20h",
      q9_kundengewinnung: [],
      q10_followup: "Manchmal, wenn ich dran denke",
      q11_bestandskunden: "Über 200",
      q12_wert: "",
      q13_geschwindigkeit: "Nächste 4 Wochen",
      q14_zeitnutzung: "Bestandskunden besser pflegen",
    },
    expectScoreRange: [60, 80],
  },
];

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;

for (const p of personas) {
  console.log("=".repeat(72));
  console.log(p.label);
  console.log("=".repeat(72));
  const s = calculateScore(p.answers);
  console.log(
    `Branche: "${p.answers.q1_branche}" → Benchmark: ${findBenchmark(p.answers.q1_branche).name}`,
  );
  console.log("");
  console.log("SCORE BREAKDOWN:");
  console.log(`  Tool-Zufriedenheit (q6):    ${s.q6Points}/15`);
  console.log(`  Bestehende Automation (q4): ${s.q9Points}/15`);
  console.log(
    `  Wiederholende Aufgaben:     ${s.q7Points}/25 (${s.realTasksCount} Aufgaben × ${p.answers.q8_stunden})`,
  );
  console.log(`  Zeitaufwand (q8):           ${s.q8Points}/25`);
  console.log(`  Follow-up (q10):            ${s.q10Points}/15`);
  console.log(`  Pain-Bonus (q3):            ${s.painBonus}/5`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  TOTAL:                      ${s.normalized}/100  →  ${s.category}`);
  console.log("");

  const bm = findBenchmark(p.answers.q1_branche);
  const roi = calculateRoi(bm, p.answers.q8_stunden, p.answers.q11_bestandskunden);
  const frame = pitchFrame(p.answers.q14_zeitnutzung);
  const stack = techStackHint(p.answers.q4_tools);

  console.log("ROI-SCHÄTZUNG:");
  console.log(
    `  ~${roi.kundenMid} Kunden × ${eur(roi.kundenwertMid)}/Jahr = ${eur(roi.bestandsumsatzEurJahr)} Bestandsumsatz`,
  );
  console.log(
    `  ${roi.stundenMid}h/Wo × ${eur(roi.stundenSatzMid)}/h × 4 = ${eur(roi.manuelleLastEurMonat)}/Monat manuelle Last`,
  );
  console.log(`  Manuelle Last p.a.:    ${eur(roi.manuelleLastEurJahr)}`);
  console.log(
    `  Cross-Sell (~${bm.crossSellPotenzialPct}%): ${eur(roi.crossSellEurJahr)}/Jahr`,
  );
  console.log(
    `  Ersparnis 30–50%:      ${eur(roi.ersparnisMinEurJahr)} – ${eur(roi.ersparnisMaxEurJahr)}`,
  );
  console.log(
    `  GESAMTHEBEL:           ${eur(roi.gesamthebelMinEurJahr)} – ${eur(roi.gesamthebelMaxEurJahr)} /Jahr`,
  );
  console.log("");
  console.log(`PITCH-FRAME: ${frame.kind} (${frame.label})`);
  console.log(`TECH-STACK:  ${stack}`);
  console.log("");

  // Acceptance check
  let pass = true;
  let why = "";
  if (p.expectScoreMin !== undefined && s.normalized < p.expectScoreMin) {
    pass = false;
    why = `Score ${s.normalized} unter Erwartung ≥${p.expectScoreMin}`;
  }
  if (p.expectScoreMax !== undefined && s.normalized > p.expectScoreMax) {
    pass = false;
    why = `Score ${s.normalized} über Erwartung ≤${p.expectScoreMax}`;
  }
  if (
    p.expectScoreRange &&
    (s.normalized < p.expectScoreRange[0] || s.normalized > p.expectScoreRange[1])
  ) {
    pass = false;
    why = `Score ${s.normalized} außerhalb Erwartung ${p.expectScoreRange.join("-")}`;
  }
  console.log(pass ? `✓ ACCEPTANCE PASS` : `✗ ACCEPTANCE FAIL: ${why}`);
  console.log("");
}
