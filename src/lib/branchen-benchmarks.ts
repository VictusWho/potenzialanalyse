// Branchen-spezifische Annahmen für ROI-Schätzung im internen Briefing.
// Werte sind grobe Marktdurchschnitte — Ludovico validiert im Erstgespräch.

export interface BranchenBenchmark {
  name: string;
  matchKeywords: string[];
  stundenSatzMin: number;
  stundenSatzMax: number;
  kundenwertProJahrMin: number;
  kundenwertProJahrMax: number;
  crossSellPotenzialPct: number;
  typischeHebel: string[];
}

export const BENCHMARKS: BranchenBenchmark[] = [
  {
    name: "Finanzberatung / Versicherungsmakler",
    matchKeywords: ["finanz", "versicherung", "makler", "vorsorge"],
    stundenSatzMin: 80,
    stundenSatzMax: 150,
    kundenwertProJahrMin: 800,
    kundenwertProJahrMax: 3000,
    crossSellPotenzialPct: 8,
    typischeHebel: [
      "Bestandskunden-Lifecycle (Vertragsjubiläen, BU-Ausläufe, runde Geburtstage)",
      "Automatisierte Follow-ups nach Erstberatung",
      "Mahnwesen und Beitragspflege",
      "Schadens-Tickets mit KI-Vorqualifizierung",
    ],
  },
  {
    name: "Hausverwaltung",
    matchKeywords: ["hausverwaltung", "immobilien", "verwaltung", "vermietung"],
    stundenSatzMin: 50,
    stundenSatzMax: 100,
    kundenwertProJahrMin: 240,
    kundenwertProJahrMax: 600,
    crossSellPotenzialPct: 5,
    typischeHebel: [
      "Mahnwesen automatisieren",
      "Schadensmeldung mit Handwerker-Routing",
      "Nebenkostenabrechnung",
      "Mieter-Kommunikation",
    ],
  },
  {
    name: "Gastronomie",
    matchKeywords: ["gastro", "restaurant", "café", "cafe", "bistro", "imbiss"],
    stundenSatzMin: 25,
    stundenSatzMax: 60,
    kundenwertProJahrMin: 50,
    kundenwertProJahrMax: 300,
    crossSellPotenzialPct: 3,
    typischeHebel: [
      "Bestellannahme & Reservierungen",
      "Lieferanten-Bestellungen automatisieren",
      "Marketing-Posts vorgenerieren",
      "Schicht- und Personalplanung",
    ],
  },
  {
    name: "Handwerk / Bau",
    matchKeywords: ["handwerk", "bau", "elektro", "sanitär", "tischler", "maler"],
    stundenSatzMin: 60,
    stundenSatzMax: 120,
    kundenwertProJahrMin: 500,
    kundenwertProJahrMax: 5000,
    crossSellPotenzialPct: 10,
    typischeHebel: [
      "Angebotserstellung aus Anfrage",
      "Termin- und Tour-Planung",
      "Rechnung & Zahlungserinnerungen",
      "Material-Bestellung optimieren",
    ],
  },
  {
    name: "Steuerberatung / Buchhaltung",
    matchKeywords: ["steuer", "buchhalt", "lohn", "wirtschaftsprüf"],
    stundenSatzMin: 90,
    stundenSatzMax: 180,
    kundenwertProJahrMin: 1500,
    kundenwertProJahrMax: 8000,
    crossSellPotenzialPct: 6,
    typischeHebel: [
      "Beleg-Onboarding und OCR",
      "Mandanten-Kommunikation strukturieren",
      "Wiedervorlagen für Fristen",
      "Reports / Auswertungen automatisieren",
    ],
  },
  {
    name: "Agentur / Beratung",
    matchKeywords: ["agentur", "beratung", "consulting", "marketing", "coach"],
    stundenSatzMin: 80,
    stundenSatzMax: 200,
    kundenwertProJahrMin: 3000,
    kundenwertProJahrMax: 30000,
    crossSellPotenzialPct: 12,
    typischeHebel: [
      "Lead-Qualifizierung und CRM-Pflege",
      "Reporting automatisieren",
      "Onboarding neuer Kunden",
      "Content-Pipeline",
    ],
  },
  {
    name: "E-Commerce / Online-Handel",
    matchKeywords: ["e-commerce", "ecommerce", "online-shop", "shop", "handel", "vertrieb"],
    stundenSatzMin: 40,
    stundenSatzMax: 100,
    kundenwertProJahrMin: 50,
    kundenwertProJahrMax: 500,
    crossSellPotenzialPct: 15,
    typischeHebel: [
      "Bestell- und Fulfillment-Workflows",
      "Kunden-Service mit AI-Vorqualifikation",
      "Re-Marketing-Sequenzen",
      "Lager- und Bestandsmanagement",
    ],
  },
  {
    name: "Gesundheit / Medizin",
    matchKeywords: ["arzt", "praxis", "medizin", "gesundheit", "physio", "therapie"],
    stundenSatzMin: 70,
    stundenSatzMax: 200,
    kundenwertProJahrMin: 200,
    kundenwertProJahrMax: 2000,
    crossSellPotenzialPct: 6,
    typischeHebel: [
      "Termin-Erinnerungen automatisieren",
      "Wiedervorlagen für Vorsorge",
      "Patientenkommunikation",
      "Abrechnungsworkflows",
    ],
  },
  {
    name: "Default (nicht zugeordnet)",
    matchKeywords: [],
    stundenSatzMin: 50,
    stundenSatzMax: 100,
    kundenwertProJahrMin: 500,
    kundenwertProJahrMax: 3000,
    crossSellPotenzialPct: 7,
    typischeHebel: [
      "Wiederkehrende Kommunikation automatisieren",
      "Datenpflege und Reporting",
      "Lead-Qualifizierung",
      "Routine-Follow-ups",
    ],
  },
];

export function findBenchmark(branche: string): BranchenBenchmark {
  const lower = (branche ?? "").toLowerCase();
  for (const bm of BENCHMARKS) {
    if (bm.matchKeywords.length > 0 && bm.matchKeywords.some((kw) => lower.includes(kw))) {
      return bm;
    }
  }
  return BENCHMARKS[BENCHMARKS.length - 1];
}

// Mid-Values für ROI-Schätzung (transparent gemachte Annahmen)
export const STUNDEN_MID: Record<string, number> = {
  "Unter 5h": 3,
  "5–10h": 7.5,
  "10–20h": 15,
  "Über 20h": 25,
  "Keine Ahnung": 10,
};

export const KUNDEN_MID: Record<string, number> = {
  "Unter 50": 25,
  "50–200": 125,
  "Über 200": 350,
};

export interface RoiEstimate {
  stundenMid: number;
  stundenSatzMid: number;
  kundenMid: number;
  kundenwertMid: number;
  manuelleLastEurMonat: number;
  manuelleLastEurJahr: number;
  bestandsumsatzEurJahr: number;
  crossSellEurJahr: number;
  ersparnisMinEurJahr: number;
  ersparnisMaxEurJahr: number;
  gesamthebelMinEurJahr: number;
  gesamthebelMaxEurJahr: number;
}

export function calculateRoi(
  bm: BranchenBenchmark,
  q8Stunden: string,
  q11Bestandskunden: string,
): RoiEstimate {
  const stundenMid = STUNDEN_MID[q8Stunden] ?? 10;
  const kundenMid = KUNDEN_MID[q11Bestandskunden] ?? 100;
  const stundenSatzMid = (bm.stundenSatzMin + bm.stundenSatzMax) / 2;
  const kundenwertMid = (bm.kundenwertProJahrMin + bm.kundenwertProJahrMax) / 2;

  const manuelleLastEurMonat = stundenMid * stundenSatzMid * 4;
  const manuelleLastEurJahr = manuelleLastEurMonat * 12;
  const bestandsumsatzEurJahr = kundenMid * kundenwertMid;
  const crossSellEurJahr = bestandsumsatzEurJahr * (bm.crossSellPotenzialPct / 100);
  const ersparnisMinEurJahr = manuelleLastEurJahr * 0.3;
  const ersparnisMaxEurJahr = manuelleLastEurJahr * 0.5;
  const gesamthebelMinEurJahr = ersparnisMinEurJahr + crossSellEurJahr;
  const gesamthebelMaxEurJahr = ersparnisMaxEurJahr + crossSellEurJahr;

  return {
    stundenMid,
    stundenSatzMid,
    kundenMid,
    kundenwertMid,
    manuelleLastEurMonat,
    manuelleLastEurJahr,
    bestandsumsatzEurJahr,
    crossSellEurJahr,
    ersparnisMinEurJahr,
    ersparnisMaxEurJahr,
    gesamthebelMinEurJahr,
    gesamthebelMaxEurJahr,
  };
}

// Tech-Stack-Empfehlung basierend auf den angegebenen Tools
export function techStackHint(tools: string[]): string {
  const realTools = tools.filter((t) => t !== "Keine / Weiß nicht");
  const onlyExcel =
    realTools.length === 1 && realTools[0] === "Excel/Google Sheets";

  if (realTools.length === 0 || onlyExcel) {
    return "Greenfield. Saubere Datenbasis von Grund auf aufbauen, Backend leichtgewichtig, minimalistisches Dashboard. Initiale Migration aus Excel/Sheets falls vorhanden.";
  }
  if (realTools.includes("Branchensoftware")) {
    return "Komplementär aufbauen: Branchensoftware bleibt Source of Truth. Lücken zwischen Modulen mit Automation-Schicht (Webhooks, Daten-Pipelines, Reporting) füllen.";
  }
  if (realTools.includes("CRM-System")) {
    return "Andocken statt ersetzen. Bestehendes CRM bleibt zentral, Workflows drumherum bauen (Lead-Routing, Follow-ups, Reporting) — typischerweise via API-Integration oder n8n-Schicht.";
  }
  return "Hybrid: bestehende Tools per API koppeln, dünne Automation-Schicht für die Workflow-Klebung. Keine harte Abhängigkeit von einem einzelnen Anbieter.";
}

// ROI-Pitch-Frame anhand der Zeitnutzungs-Antwort
export interface PitchFrame {
  kind: "quantitativ" | "qualitativ" | "neutral";
  label: string;
}

export function pitchFrame(zeitnutzung: string): PitchFrame {
  if (
    zeitnutzung === "Mehr Kunden bedienen / Wachstum" ||
    zeitnutzung === "Bestandskunden besser pflegen"
  ) {
    return { kind: "quantitativ", label: "Wachstum / Cross-Sell" };
  }
  if (zeitnutzung === "Strategie / Konzeption") {
    return { kind: "quantitativ", label: "Strategischer Hebel / Skalierung" };
  }
  if (zeitnutzung === "Persönliche Zeit / weniger Stress") {
    return { kind: "qualitativ", label: "Lebensqualität / Entlastung" };
  }
  return { kind: "neutral", label: "Im Erstgespräch klären" };
}

// Pain-Bonus-Keywords (case-insensitive, mit \b-Wortgrenzen verwenden)
export const PAIN_KEYWORDS: string[] = [
  "manuell", "manuelle", "manuelles", "manueller",
  "händisch", "von hand", "per hand", "selbst eintragen",
  "selbst eingeben", "selbst eintippen", "alles selber",
  "abtippen", "eintippen", "übertragen", "kopieren",
  "copy paste", "copy-paste", "einpflegen",

  "jeden tag", "täglich", "jeden morgen", "ständig",
  "immer wieder", "immer noch", "jede woche", "wöchentlich",
  "jeden monat", "monatlich", "wieder und wieder",
  "andauernd", "dauernd", "permanent", "regelmäßig",
  "mehrmals pro woche", "wiederholt", "wiederholen",

  "stunden", "stundenlang", "stunden lang", "ewig",
  "ewigkeiten", "den ganzen tag", "den halben tag",
  "halber tag", "frisst zeit", "zeitfresser", "zu viel zeit",
  "viel zeit", "kostet zeit", "zeitintensiv",

  "nervt", "stört", "ätzend", "lästig", "frustriert",
  "frustrierend", "mühsam", "anstrengend", "aufwendig",
  "zeitraubend", "zermürbend", "hasse", "keine lust",
  "blöd", "umständlich",

  "doppelt", "mehrfach", "redundant", "vergesse",
  "vergessen", "vergisst", "übersehe", "übersehen",
  "verpasse", "verpasst", "geht unter", "geht verloren",
  "fällt durch", "fehleranfällig", "fehler",
  "kein überblick", "übersicht verloren", "chaos",
  "durcheinander", "unstrukturiert", "inkonsistent",
  "nicht nachvollziehbar",

  "excel", "google sheets", "google-sheets", "tabelle",
  "tabellen", "kein system", "ohne system", "kein crm",
  "kein tool", "klebezettel", "post-it", "post it",
  "zettel", "alles in word", "alles im kopf",
  "wir haben kein", "wir haben keine", "wir haben nichts",
  "papier", "papierbasiert", "ausgedruckt",

  "keine zeit", "kaum zeit", "fehlt zeit",
  "keine kapazität", "überlastet", "überlastung",
  "komme nicht hinterher", "schaffe nicht", "am limit",
  "bin hinterher", "bleibt liegen", "liegt liegen",

  "nachhaken", "nachfassen", "hinterhertelefonieren",
  "eintragen", "abgleichen", "prüfen müssen",
  "kontrollieren müssen", "durchsehen", "rauskramen",
  "raussuchen",

  "kunden verlieren", "kunden gehen", "chance verpasst",
  "lead verpasst", "absprung", "abbruch", "weg zur konkurrenz",

  "ineffizient", "unpraktisch", "veraltet", "antiquiert",
  "analog", "nicht digital", "nicht digitalisiert",
];

// Escapes regex-Sonderzeichen in einem Keyword (z.B. - in "copy-paste")
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchesPainKeyword(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return PAIN_KEYWORDS.some((kw) => {
    const pattern = new RegExp(`\\b${escapeRegex(kw.toLowerCase())}\\b`);
    return pattern.test(t);
  });
}
