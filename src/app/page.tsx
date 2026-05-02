"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CaretLeft,
  Clock,
  Check,
  CircleNotch,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { isDisposableEmail } from "./disposable-emails";
import Footer from "./components/Footer";
import { PulseBeams } from "@/components/ui/pulse-beams";
import {
  findBenchmark,
  calculateRoi,
  matchesPainKeyword,
} from "@/lib/branchen-benchmarks";

// ─────────────────────────────────────────────
// CTA PULSE BEAMS CONFIG
// ─────────────────────────────────────────────

const CTA_BEAMS = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientDirection: { x1: 1, y1: 0, x2: 0, y2: 1 },
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 0,
        delay: 0,
      },
    },
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientDirection: { x1: 0, y1: 1, x2: 1, y2: 0 },
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 0,
        delay: 0.6,
      },
    },
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientDirection: { x1: 1, y1: 0, x2: 0, y2: 1 },
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 0,
        delay: 1.2,
      },
    },
  },
  {
    path: "M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427",
    gradientDirection: { x1: 0, y1: 0, x2: 1, y2: 1 },
    gradientConfig: {
      initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" },
      animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 0,
        delay: 1.8,
      },
    },
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientDirection: { x1: 0, y1: 1, x2: 1, y2: 0 },
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 0,
        delay: 2.4,
      },
    },
  },
];

const CTA_GRADIENT_COLORS = {
  start: "#DDD6FE",
  middle: "#8B5CF6",
  end: "#6D28D9",
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Phase =
  | "intro"
  | "phase1"
  | "phase2"
  | "phase3"
  | "phase4"
  | "analyzing"
  | "result";

interface Answers {
  q1_branche: string;
  q2_mitarbeiter: string;
  q3_nerv: string;
  q4_tools: string[];
  q4_tools_detail: Record<string, string>;
  q5_website: string;
  q5_url: string;
  q6_zufriedenheit: number;
  q7_aufgaben: string[];
  q8_stunden: string;
  q9_kundengewinnung: string[];
  q10_followup: string;
  q11_bestandskunden: string;
  q12_wert: string;
  q13_geschwindigkeit: string;
  q14_zeitnutzung: string;
  q14_name: string;
  q14_unternehmen: string;
  q14_email: string;
  q14_telefon: string;
  consent: boolean;
}

interface ScoreBreakdownItem {
  label: string;
  points: number;
  max: number;
  value: string;
}

interface ScoreResult {
  normalized: number;
  timeSaving: string;
  category: string;
  description: string;
  breakdown: ScoreBreakdownItem[];
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────

const C = {
  bg: "#FAFAFE",
  surface: "#FFFFFF",
  surfaceHover: "#F5F3FF",
  border: "#E9E5F5",
  borderHover: "rgba(139,92,246,0.3)",
  borderActive: "rgba(139,92,246,0.5)",
  text: "#1A1A2E",
  textSecondary: "#52525B",
  textMuted: "#A1A1AA",
  accent: "#8B5CF6",
  accentHover: "#7C3AED",
  accentSubtle: "rgba(139,92,246,0.05)",
  accentBorder: "rgba(139,92,246,0.15)",
  onAccent: "#FFFFFF",
  track: "#EDE9FE",
} as const;

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const MITARBEITER = ["Nur ich", "2–5", "6–15", "16–50", "Über 50"];

const TOOLS = [
  "CRM-System",
  "Buchhaltungssoftware",
  "E-Mail Marketing",
  "Projektmanagement",
  "Terminbuchung",
  "Social Media Tools",
  "Excel/Google Sheets",
  "Branchensoftware",
  "Sonstiges",
  "Keine / Weiß nicht",
];

const TOOL_PLACEHOLDERS: Record<string, string> = {
  "CRM-System": "z.B. HubSpot, Salesforce",
  "Buchhaltungssoftware": "z.B. Lexoffice, DATEV",
  "E-Mail Marketing": "z.B. Mailchimp, Brevo",
  "Projektmanagement": "z.B. Asana, Trello",
  "Terminbuchung": "z.B. Calendly, Acuity",
  "Social Media Tools": "z.B. Hootsuite, Buffer",
  "Branchensoftware": "Name der Software",
  "Sonstiges": "Name des Tools",
};

const AUFGABEN = [
  "E-Mails beantworten",
  "Rechnungen & Buchhaltung",
  "Kundendaten pflegen",
  "Termine koordinieren",
  "Angebote & Dokumente erstellen",
  "Social Media",
  "Reports erstellen",
  "Mahnungen",
  "Kundenanfragen",
  "Daten copy-pasten",
  "Keine der obigen",
];

const KUNDENGEWINNUNG = [
  "Empfehlungen",
  "Website",
  "Social Media",
  "Telefon",
  "Messen & Events",
  "Kooperationspartner",
  "Bezahlte Werbung",
];

const BESTANDSKUNDEN = ["Unter 50", "50–200", "Über 200"];

const FOLLOWUP = [
  "Ja, systematisch",
  "Manchmal, wenn ich dran denke",
  "Nein",
  "Was ist Follow-up?",
];

const WERT = [
  "Unter 1.000€",
  "1.000–3.000€",
  "3.000–5.000€",
  "5.000–10.000€",
  "Kommt auf den ROI an",
];

const GESCHWINDIGKEIT = [
  "Sofort",
  "Nächste 4 Wochen",
  "Nächste 3 Monate",
  "Irgendwann",
];

const STUNDEN = ["Unter 5h", "5–10h", "10–20h", "Über 20h", "Keine Ahnung"];

const ZEITNUTZUNG = [
  "Mehr Kunden bedienen / Wachstum",
  "Bestandskunden besser pflegen",
  "Strategie / Konzeption",
  "Persönliche Zeit / weniger Stress",
  "Weiß noch nicht",
];

const ANALYZING_STEPS = [
  "Branche & Unternehmensgröße wird analysiert…",
  "Prozesse werden identifiziert…",
  "Zeitersparnis wird kalkuliert…",
  "Ergebnis wird erstellt…",
];

// ─────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────

function getCoupledTimeSaving(score: number, stunden: string): string {
  // Konservativ kalibriert (40–60 % Automatisierungsgrad statt 75 %+)
  const matrix: Record<string, [string, string, string]> = {
    "Unter 5h":   ["1 Std./Woche",       "1–2 Std./Woche",    "2–3 Std./Woche"],
    "5–10h":      ["1–2 Std./Woche",     "2–4 Std./Woche",    "3–5 Std./Woche"],
    "10–20h":     ["2–4 Std./Woche",     "4–8 Std./Woche",    "7–11 Std./Woche"],
    "Über 20h":   ["3–5 Std./Woche",     "5–10 Std./Woche",   "10–15 Std./Woche"],
    "Keine Ahnung":["1–2 Std./Woche",    "3–5 Std./Woche",    "4–7 Std./Woche"],
  };
  const tier = score <= 30 ? 0 : score <= 60 ? 1 : 2;
  return matrix[stunden]?.[tier] ?? "3–5 Std./Woche";
}

function calculateScore(a: Answers): ScoreResult {
  // q6 Tool-Zufriedenheit (max 15)
  const q6Map: Record<number, number> = { 1: 15, 2: 12, 3: 9, 4: 5, 5: 2 };
  const q6Points = q6Map[a.q6_zufriedenheit] ?? 0;

  // q4_tools Bestehende Automation (max 15)
  const realTools = a.q4_tools.filter((t) => t !== "Keine / Weiß nicht");
  const hasKeine = a.q4_tools.includes("Keine / Weiß nicht");
  const onlyExcel =
    realTools.length === 1 && realTools[0] === "Excel/Google Sheets";
  let q9Points: number;
  if (hasKeine || realTools.length === 0) {
    q9Points = 15;
  } else if (onlyExcel) {
    q9Points = 13;
  } else if (realTools.length <= 2) {
    q9Points = 12;
  } else if (realTools.length <= 4) {
    q9Points = 8;
  } else {
    q9Points = 4;
  }

  // q7 × q8 Wiederholende Aufgaben (max 25)
  const realTasks = a.q7_aufgaben.filter((t) => t !== "Keine der obigen");
  const q7q8MultMap: Record<string, number> = {
    "Unter 5h": 0.5,
    "5–10h": 1.0,
    "10–20h": 1.3,
    "Über 20h": 1.5,
    "Keine Ahnung": 1.0,
  };
  const q7q8Mult = q7q8MultMap[a.q8_stunden] ?? 1.0;
  const q7Points = Math.min(Math.round(realTasks.length * 4 * q7q8Mult), 25);

  // q8 Zeitaufwand (max 25)
  const q8Map: Record<string, number> = {
    "Unter 5h": 5,
    "5–10h": 13,
    "10–20h": 20,
    "Über 20h": 25,
    "Keine Ahnung": 10,
  };
  const q8Points = q8Map[a.q8_stunden] ?? 0;

  // q10 Follow-up (max 15)
  const q10Map: Record<string, number> = {
    "Ja, systematisch": 0,
    "Manchmal, wenn ich dran denke": 7,
    "Nein": 15,
    "Was ist Follow-up?": 15,
  };
  const q10Points = q10Map[a.q10_followup] ?? 0;

  // q3_nerv Pain-Bonus (max 5)
  const painText = (a.q3_nerv ?? "").trim();
  let painBonus: number;
  if (painText.length < 15) {
    painBonus = 0;
  } else if (matchesPainKeyword(painText)) {
    painBonus = 5;
  } else {
    painBonus = 2;
  }

  const normalized =
    q6Points + q9Points + q7Points + q8Points + q10Points + painBonus;
  const timeSaving = getCoupledTimeSaving(normalized, a.q8_stunden);

  // Category & description (Lead-Sicht: show-what, hide-how)
  const PAIN_QUOTE_MAX = 120;
  const painQuote =
    painText.length >= 15
      ? painText.length > PAIN_QUOTE_MAX
        ? painText.slice(0, PAIN_QUOTE_MAX - 1).trimEnd() + "…"
        : painText
      : "";

  let category: string;
  let description: string;

  if (normalized < 35) {
    category = "Niedrig";
    description = "Solide Strukturen erkennbar, punktuelle Optimierung möglich.";
  } else if (normalized < 70) {
    category = "Mittel";
    description = painQuote
      ? `Sie haben "${painQuote}" als Hauptproblem genannt — das ist genau der Hebel mit dem höchsten ROI in Unternehmen Ihrer Größe.`
      : `Erkennbares Potenzial mit klaren Hebeln. Geschätzte Ersparnis: ca. ${timeSaving}.*`;
  } else {
    category = "Hoch";
    description = painQuote
      ? `Sie haben "${painQuote}" als Hauptproblem genannt — das ist genau der Hebel mit dem höchsten ROI in Unternehmen Ihrer Größe.`
      : "Erhebliches Potenzial erkennbar.";
  }

  const ratingLabel: Record<number, string> = {
    1: "Frustriert (1/5)",
    2: "Unzufrieden (2/5)",
    3: "Okay (3/5)",
    4: "Zufrieden (4/5)",
    5: "Sehr zufrieden (5/5)",
  };

  const toolsValue = hasKeine
    ? "Keine / Weiß nicht"
    : realTools.length === 0
      ? "—"
      : `${realTools.length} Tool${realTools.length === 1 ? "" : "s"} im Einsatz`;

  const breakdown: ScoreBreakdownItem[] = [
    {
      label: "Tool-Zufriedenheit",
      points: q6Points,
      max: 15,
      value: ratingLabel[a.q6_zufriedenheit] ?? "—",
    },
    {
      label: "Bestehende Automation",
      points: q9Points,
      max: 15,
      value: toolsValue,
    },
    {
      label: "Wiederholende Aufgaben",
      points: q7Points,
      max: 25,
      value:
        realTasks.length > 0
          ? `${realTasks.length} identifiziert`
          : "Keine",
    },
    {
      label: "Zeitaufwand",
      points: q8Points,
      max: 25,
      value: a.q8_stunden || "—",
    },
    {
      label: "Follow-up System",
      points: q10Points,
      max: 15,
      value: a.q10_followup || "—",
    },
    {
      label: "Pain-Bonus",
      points: painBonus,
      max: 5,
      value:
        painBonus === 5
          ? "Konkreter Pain genannt"
          : painBonus === 2
            ? "Kontext angegeben"
            : "Nicht ausgefüllt",
    },
  ];

  return { normalized, timeSaving, category, description, breakdown };
}

// ─────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: EASE },
};

const STAGGER_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────

const PHASES_META = [
  { key: "phase1", label: "Unternehmen" },
  { key: "phase2", label: "Tools" },
  { key: "phase3", label: "Potenzial" },
  { key: "phase4", label: "Abschluss" },
];

const PHASE_PCT: Record<string, number> = {
  intro: 0, phase1: 25, phase2: 50, phase3: 75, phase4: 100,
  analyzing: 100, result: 100,
};

function ProgressBar({ phase }: { phase: Phase }) {
  if (phase === "intro") return null;
  const pct = PHASE_PCT[phase] ?? 0;
  const phaseIndex = ["phase1", "phase2", "phase3", "phase4"].indexOf(phase);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Thin gold line */}
      <div className="h-[2px]" style={{ background: C.track }}>
        <motion.div
          className="h-full"
          style={{ background: C.accent }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>

      {/* Navigation */}
      <div
        className="backdrop-blur-md border-b"
        style={{ background: "rgba(250,250,254,0.92)", borderColor: C.border }}
      >
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {PHASES_META.map((p, i) => {
              const done = phaseIndex > i;
              const active = phaseIndex === i;
              return (
                <div key={p.key} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      background: done || active ? C.accent : C.track,
                      transform: active ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <span
                    className="text-[11px] tracking-wide transition-all duration-500 hidden sm:block"
                    style={{
                      color: active ? C.accent : done ? C.textMuted : C.track,
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
          <span
            className="text-[11px] tabular-nums tracking-wider"
            style={{ color: C.textMuted }}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────

function ChoiceBtn({
  selected,
  onClick,
  children,
  fullWidth = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-3 rounded-lg border text-sm transition-all duration-300 text-left flex items-center gap-2.5 ${fullWidth ? "w-full" : ""}`}
      style={{
        background: selected ? C.surface : "transparent",
        borderColor: selected ? C.accent : C.border,
        color: selected ? C.text : C.textSecondary,
      }}
    >
      <span
        className="w-[18px] h-[18px] rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-300"
        style={{
          borderColor: selected ? C.accent : "rgba(255,255,255,0.1)",
          background: selected ? C.accent : "transparent",
        }}
      >
        {selected && <Check size={10} weight="bold" style={{ color: C.bg }} />}
      </span>
      <span style={{ fontWeight: selected ? 500 : 400 }}>{children}</span>
    </motion.button>
  );
}

function MultiChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="px-3.5 py-2 rounded-lg border text-[13px] transition-all duration-300 flex items-center gap-1.5"
      style={{
        background: selected ? C.accentSubtle : "transparent",
        borderColor: selected ? C.accentBorder : C.border,
        color: selected ? C.accent : C.textSecondary,
        fontWeight: selected ? 500 : 400,
      }}
    >
      {selected && <Check size={11} weight="bold" style={{ color: C.accent }} className="flex-shrink-0" />}
      {children}
    </motion.button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-4 py-3 text-sm transition-all duration-300 focus:outline-none"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        color: C.text,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = C.borderActive;
        e.target.style.background = C.surfaceHover;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.border;
        e.target.style.background = C.surface;
      }}
    />
  );
}

function RatingScale({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-12 rounded-lg border text-sm transition-all duration-300"
            style={{
              background: value === n ? C.accentSubtle : "transparent",
              borderColor: value === n ? C.accent : C.border,
              color: value === n ? C.accent : C.textMuted,
              fontWeight: value === n ? 600 : 400,
            }}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between mt-2.5 px-1">
        <span className="text-[11px]" style={{ color: C.textMuted }}>Frustriert</span>
        <span className="text-[11px]" style={{ color: C.textMuted }}>Läuft perfekt</span>
      </div>
    </div>
  );
}

function QuestionBlock({
  num,
  label,
  hint,
  children,
}: {
  num: number;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={STAGGER_ITEM} className="mb-10">
      <div className="flex items-start gap-3.5 mb-4">
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] tabular-nums mt-0.5"
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.accentBorder}`,
            color: C.accent,
            fontWeight: 500,
          }}
        >
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium leading-snug balance" style={{ color: C.text }}>
            {label}
          </p>
          {hint && (
            <p className="mt-1 text-xs italic" style={{ color: C.textMuted }}>{hint}</p>
          )}
        </div>
      </div>
      <div className="pl-[2.65rem]">{children}</div>
    </motion.div>
  );
}

function PhaseHeader({ num, title }: { num: number; title: string }) {
  return (
    <motion.div variants={STAGGER_ITEM} className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ color: C.accent, fontWeight: 500 }}
        >
          Schritt {num} / 4
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${C.accentBorder}, transparent)` }} />
      </div>
      <h2
        className="text-[2.2rem] md:text-[3rem] leading-[1.05] tracking-tight balance"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", color: C.text }}
      >
        {title}
      </h2>
    </motion.div>
  );
}

function NavButtons({
  onNext,
  onBack,
  canProceed,
}: {
  onNext: () => void;
  onBack?: () => void;
  canProceed: boolean;
}) {
  return (
    <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-3 mt-12">
      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.005 } : {}}
        whileTap={canProceed ? { scale: 0.99 } : {}}
        className="w-full py-3.5 rounded-lg flex items-center justify-center gap-2 text-[15px] transition-all duration-300"
        style={{
          background: canProceed ? C.accent : C.surface,
          color: canProceed ? C.bg : C.textMuted,
          fontWeight: 500,
          opacity: canProceed ? 1 : 0.4,
          cursor: canProceed ? "pointer" : "not-allowed",
        }}
      >
        Weiter
        <ArrowRight size={16} weight="bold" />
      </motion.button>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-sm py-2 transition-all duration-300"
          style={{ color: C.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.textSecondary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          <CaretLeft size={14} weight="bold" />
          Zurück
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// INTRO SCREEN
// ─────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[100dvh] flex items-center px-4 py-16">
      <div className="max-w-4xl md:max-w-6xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[12px] uppercase tracking-[0.3em] mb-8"
            style={{ color: C.accent }}
          >
            Kostenlose Potenzialanalyse
          </motion.p>

          {/* Massive headline */}
          <h1
            className="text-[clamp(2.15rem,5.2vw,4rem)] leading-[1.1] tracking-tight mb-8 mx-auto max-w-4xl md:max-w-6xl"
            style={{ fontFamily: "var(--font-heading), Georgia, serif", color: C.text }}
          >
            <span className="md:whitespace-nowrap">Welche manuellen Workflows</span>
            <br />
            <span style={{ color: C.accent }}>blockieren</span>
            <br />
            <span className="md:whitespace-nowrap">Ihre Kapazitäten?</span>
          </h1>

          <p
            className="text-lg leading-relaxed mb-4 max-w-[56ch] mx-auto"
            style={{ color: C.textSecondary }}
          >
            Jede Stunde in ineffizienten Prozessen fehlt dort, wo Ihr Unternehmen
            wächst. Identifizieren Sie Ihr Automatisierungs-Potenzial.
            <br />
            <span style={{ color: C.text, fontWeight: 500 }}>In unter 5 Minuten.</span>
          </p>

          {/* CTA with pulse beams */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <PulseBeams
              beams={CTA_BEAMS}
              gradientColors={CTA_GRADIENT_COLORS}
              baseColor="#E5E0F5"
              accentColor="#8B5CF6"
              className="h-auto min-h-[240px] bg-transparent"
            >
              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-block h-[72px] min-w-[300px] cursor-pointer rounded-2xl p-[1.5px] text-base shadow-[0_12px_40px_-12px_rgba(139,92,246,0.35)] transition-[box-shadow] duration-500 hover:shadow-[0_18px_50px_-10px_rgba(139,92,246,0.6)]"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #DDD6FE 35%, #C4B5FD 50%, #DDD6FE 65%, #FFFFFF 100%)",
                }}
              >
                {/* Hover: vivid white→purple gradient outline overlay */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #A78BFA 30%, #8B5CF6 50%, #A78BFA 70%, #FFFFFF 100%)",
                  }}
                />
                {/* Inner purple pill */}
                <span
                  className="relative z-10 flex h-full w-full items-center justify-center gap-3 overflow-hidden rounded-[calc(1rem-1.5px)] px-10"
                  style={{ background: C.accent, fontWeight: 600 }}
                >
                  {/* Hover: inner radial glow from top (white sheen) */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1.5px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(75% 100% at 50% 0%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 75%)",
                    }}
                  />
                  <span
                    className="relative flex items-center gap-3 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #F5F3FF 0%, #FFFFFF 50%, #F5F3FF 100%)",
                    }}
                  >
                    Potenzial berechnen
                  </span>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="relative text-white"
                  />
                </span>
              </motion.button>
            </PulseBeams>
          </motion.div>

          {/* Trust */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {["14 kurze Fragen", "Sofort Ergebnis", "100% kostenlos"].map((label, i) => (
              <div key={label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-3" style={{ background: C.border }} />}
                <span className="text-[13px]" style={{ color: C.textMuted }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PHASE 1
// ─────────────────────────────────────────────

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-4 py-3 text-sm transition-all duration-300 focus:outline-none resize-none"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        color: C.text,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = C.borderActive;
        e.target.style.background = C.surfaceHover;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.border;
        e.target.style.background = C.surface;
      }}
    />
  );
}

function Phase1({
  answers,
  update,
  onNext,
}: {
  answers: Answers;
  update: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  onNext: () => void;
}) {
  const canProceed = answers.q1_branche.trim().length > 0 && answers.q2_mitarbeiter !== "";

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show">
      <PhaseHeader num={1} title="Über Ihr Unternehmen" />

      <QuestionBlock num={1} label="In welcher Branche sind Sie tätig?">
        <TextInput
          value={answers.q1_branche}
          onChange={(v) => update("q1_branche", v)}
          placeholder="z.B. Steuerberatung, E-Commerce, Handwerk…"
        />
      </QuestionBlock>

      <QuestionBlock num={2} label="Wie viele Mitarbeiter hat Ihr Unternehmen?">
        <div className="flex flex-wrap gap-2">
          {MITARBEITER.map((m) => (
            <ChoiceBtn
              key={m}
              selected={answers.q2_mitarbeiter === m}
              onClick={() => update("q2_mitarbeiter", m)}
            >
              {m}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock
        num={3}
        label="Was nervt Sie im Tagesgeschäft am meisten?"
        hint="Welche Aufgabe kostet Sie die meiste Zeit oder Nerven?"
      >
        <Textarea
          value={answers.q3_nerv}
          onChange={(v) => update("q3_nerv", v)}
          placeholder="z.B. Ständig die gleichen E-Mails beantworten, Rechnungen manuell erstellen…"
          rows={3}
        />
      </QuestionBlock>

      <NavButtons onNext={onNext} canProceed={canProceed} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHASE 2
// ─────────────────────────────────────────────

function Phase2({
  answers,
  update,
  onNext,
  onBack,
}: {
  answers: Answers;
  update: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggleTool = (tool: string) => {
    const current = answers.q4_tools;
    const next = current.includes(tool)
      ? current.filter((t) => t !== tool)
      : [...current, tool];
    update("q4_tools", next);
    if (current.includes(tool)) {
      const d = { ...answers.q4_tools_detail };
      delete d[tool];
      update("q4_tools_detail", d);
    }
  };

  const canProceed = answers.q5_website !== "" && answers.q6_zufriedenheit > 0;

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show">
      <PhaseHeader num={2} title="Womit arbeiten Sie heute?" />

      <QuestionBlock num={3} label="Welche Tools nutzen Sie aktuell?">
        <div className="flex flex-wrap gap-2 mb-3">
          {TOOLS.map((t) => (
            <MultiChip
              key={t}
              selected={answers.q4_tools.includes(t)}
              onClick={() => toggleTool(t)}
            >
              {t}
            </MultiChip>
          ))}
        </div>
        {answers.q4_tools
          .filter((t) => TOOL_PLACEHOLDERS[t])
          .map((tool) => (
            <div key={tool} className="mt-2">
              <label className="text-[11px] mb-1.5 block" style={{ color: C.textMuted }}>
                {tool}: Welches System?
              </label>
              <TextInput
                value={answers.q4_tools_detail[tool] ?? ""}
                onChange={(v) =>
                  update("q4_tools_detail", { ...answers.q4_tools_detail, [tool]: v })
                }
                placeholder={TOOL_PLACEHOLDERS[tool]}
              />
            </div>
          ))}
      </QuestionBlock>

      <QuestionBlock num={4} label="Haben Sie eine Website?">
        <div className="flex gap-2 mb-3">
          {["Ja", "Nein"].map((opt) => (
            <ChoiceBtn
              key={opt}
              selected={answers.q5_website === opt}
              onClick={() => update("q5_website", opt)}
            >
              {opt}
            </ChoiceBtn>
          ))}
        </div>
        {answers.q5_website === "Ja" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <TextInput
              value={answers.q5_url}
              onChange={(v) => update("q5_url", v)}
              placeholder="https://ihrewebsite.de"
              type="url"
            />
          </motion.div>
        )}
      </QuestionBlock>

      <QuestionBlock
        num={5}
        label="Wie zufrieden sind Sie mit Ihren aktuellen Tools insgesamt?"
      >
        <RatingScale
          value={answers.q6_zufriedenheit}
          onChange={(v) => update("q6_zufriedenheit", v)}
        />
      </QuestionBlock>

      <NavButtons onNext={onNext} onBack={onBack} canProceed={canProceed} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHASE 3
// ─────────────────────────────────────────────

function Phase3({
  answers,
  update,
  onNext,
  onBack,
}: {
  answers: Answers;
  update: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (field: "q7_aufgaben" | "q9_kundengewinnung", val: string) => {
    const cur = answers[field] as string[];
    update(field, cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]);
  };

  const canProceed =
    answers.q7_aufgaben.length > 0 &&
    answers.q8_stunden !== "" &&
    answers.q10_followup !== "" &&
    answers.q14_zeitnutzung !== "" &&
    answers.q11_bestandskunden !== "";

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show">
      <PhaseHeader num={3} title="Wo liegt Ihr Potenzial?" />

      <QuestionBlock num={6} label="Welche Aufgaben wiederholen sich bei Ihnen regelmäßig?">
        <div className="flex flex-wrap gap-2">
          {AUFGABEN.map((a) => (
            <MultiChip
              key={a}
              selected={answers.q7_aufgaben.includes(a)}
              onClick={() => toggle("q7_aufgaben", a)}
            >
              {a}
            </MultiChip>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock num={7} label="Wie viele Stunden pro Woche fließen in diese Aufgaben?">
        <div className="flex flex-wrap gap-2">
          {STUNDEN.map((s) => (
            <ChoiceBtn
              key={s}
              selected={answers.q8_stunden === s}
              onClick={() => update("q8_stunden", s)}
            >
              {s}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock num={8} label="Wie gewinnen Sie aktuell neue Kunden?">
        <div className="flex flex-wrap gap-2">
          {KUNDENGEWINNUNG.map((k) => (
            <MultiChip
              key={k}
              selected={answers.q9_kundengewinnung.includes(k)}
              onClick={() => toggle("q9_kundengewinnung", k)}
            >
              {k}
            </MultiChip>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock
        num={9}
        label="Haben Sie ein System, das nach Erstgesprächen automatisch nachfasst?"
      >
        <div className="flex flex-col gap-2">
          {FOLLOWUP.map((f) => (
            <ChoiceBtn
              key={f}
              selected={answers.q10_followup === f}
              onClick={() => update("q10_followup", f)}
              fullWidth
            >
              {f}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock
        num={10}
        label="Wenn die nervigsten manuellen Aufgaben weg wären — was würden Sie mit der gewonnenen Zeit machen?"
      >
        <div className="flex flex-col gap-2">
          {ZEITNUTZUNG.map((z) => (
            <ChoiceBtn
              key={z}
              selected={answers.q14_zeitnutzung === z}
              onClick={() => update("q14_zeitnutzung", z)}
              fullWidth
            >
              {z}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock num={11} label="Wie viele Bestandskunden haben Sie ungefähr?">
        <div className="flex flex-wrap gap-2">
          {BESTANDSKUNDEN.map((b) => (
            <ChoiceBtn
              key={b}
              selected={answers.q11_bestandskunden === b}
              onClick={() => update("q11_bestandskunden", b)}
            >
              {b}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <NavButtons onNext={onNext} onBack={onBack} canProceed={canProceed} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHASE 4
// ─────────────────────────────────────────────

function Phase4({
  answers,
  update,
  onSubmit,
  onBack,
  error,
  submitting,
}: {
  answers: Answers;
  update: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string;
  submitting: boolean;
}) {
  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show">
      <PhaseHeader num={4} title="Fast geschafft" />

      <QuestionBlock
        num={12}
        label="Welches Budget wäre Ihnen eine Automatisierungslösung wert, die Ihre wiederkehrenden Aufgaben spürbar reduziert?"
      >
        <div className="flex flex-col gap-2">
          {WERT.map((w) => (
            <ChoiceBtn
              key={w}
              selected={answers.q12_wert === w}
              onClick={() => update("q12_wert", w)}
              fullWidth
            >
              {w}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock num={13} label="Wie schnell brauchen Sie eine Lösung?">
        <div className="flex flex-wrap gap-2">
          {GESCHWINDIGKEIT.map((g) => (
            <ChoiceBtn
              key={g}
              selected={answers.q13_geschwindigkeit === g}
              onClick={() => update("q13_geschwindigkeit", g)}
            >
              {g}
            </ChoiceBtn>
          ))}
        </div>
      </QuestionBlock>

      {/* Contact */}
      <motion.div variants={STAGGER_ITEM} className="mb-10">
        <div className="flex items-start gap-3.5 mb-4">
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] tabular-nums mt-0.5"
            style={{
              background: C.accentSubtle,
              border: `1px solid ${C.accentBorder}`,
              color: C.accent,
              fontWeight: 500,
            }}
          >
            14
          </span>
          <p className="text-[15px] font-medium" style={{ color: C.text }}>
            Wohin dürfen wir Ihr Ergebnis senden?
          </p>
        </div>

        <div className="pl-[2.65rem] space-y-3">
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: C.textMuted }}>
              Name <span style={{ color: C.accent }}>*</span>
            </label>
            <TextInput
              value={answers.q14_name}
              onChange={(v) => update("q14_name", v)}
              placeholder="Vorname Nachname"
            />
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: C.textMuted }}>
              Unternehmen <span style={{ color: C.accent }}>*</span>
            </label>
            <TextInput
              value={answers.q14_unternehmen}
              onChange={(v) => update("q14_unternehmen", v)}
              placeholder="Ihr Unternehmensname"
            />
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: C.textMuted }}>
              E-Mail <span style={{ color: C.accent }}>*</span>
            </label>
            <TextInput
              value={answers.q14_email}
              onChange={(v) => update("q14_email", v)}
              placeholder="ihre@email.de"
              type="email"
            />
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: C.textMuted }}>
              Telefon <span style={{ color: C.textMuted }}>(optional)</span>
            </label>
            <TextInput
              value={answers.q14_telefon}
              onChange={(v) => update("q14_telefon", v)}
              placeholder="+49 …"
              type="tel"
            />
          </div>
        </div>
      </motion.div>

      {/* Transparenz-Hinweis */}
      <motion.div variants={STAGGER_ITEM} className="mb-5">
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: C.textSecondary }}
        >
          Mit dem Absenden sehen Sie Ihr Ergebnis sofort. Zusätzlich werden
          Ihre Angaben an Ludovico Ferrara übermittelt, der sich für ein
          persönliches Gespräch bei Ihnen meldet.
        </p>
      </motion.div>

      {/* Consent */}
      <motion.div variants={STAGGER_ITEM} className="mb-6">
        <label
          className="flex items-start gap-3 cursor-pointer group"
          style={{ color: C.textSecondary }}
        >
          <input
            type="checkbox"
            checked={answers.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded cursor-pointer flex-shrink-0 accent-[#8B5CF6]"
          />
          <span className="text-[13px] leading-relaxed">
            Ich habe die{" "}
            <a
              href="/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              style={{ color: C.accent }}
            >
              Datenschutzerklärung
            </a>{" "}
            gelesen und willige ein, dass meine Angaben zur Bearbeitung meiner
            Anfrage gespeichert und verarbeitet werden.
          </span>
        </label>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{
              background: "rgba(139,92,246,0.06)",
              border: `1px solid ${C.accentBorder}`,
              color: C.accent,
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-3">
        <motion.button
          onClick={onSubmit}
          disabled={submitting || !answers.consent}
          whileHover={!submitting && answers.consent ? { scale: 1.005 } : {}}
          whileTap={!submitting && answers.consent ? { scale: 0.99 } : {}}
          className="w-full py-3.5 rounded-lg flex items-center justify-center gap-2.5 text-[15px] transition-all duration-300"
          style={{
            background: answers.consent ? C.accent : C.surface,
            color: answers.consent ? C.onAccent : C.textMuted,
            fontWeight: 500,
            opacity: submitting ? 0.5 : answers.consent ? 1 : 0.5,
            cursor: submitting || !answers.consent ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" />
              Wird ausgewertet…
            </>
          ) : (
            <>
              Analyse abschließen
              <ArrowRight size={16} weight="bold" />
            </>
          )}
        </motion.button>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-sm py-2 transition-all duration-300"
          style={{ color: C.textMuted }}
        >
          <CaretLeft size={14} weight="bold" />
          Zurück
        </button>
      </motion.div>

      <p className="mt-5 text-center text-[12px]" style={{ color: C.textMuted }}>
        Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// ANALYZING SCREEN
// ─────────────────────────────────────────────

function AnalyzingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = ANALYZING_STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * 650)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xs">
        {/* Elegant spinner */}
        <div className="relative w-16 h-16 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${C.border}` }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: `1.5px solid transparent`,
              borderTopColor: C.accent,
              borderRadius: "50%",
            }}
          />
        </div>

        <p
          className="text-lg mb-3 tracking-tight"
          style={{ fontFamily: "var(--font-heading), Georgia, serif", color: C.text }}
        >
          Ihre Analyse wird erstellt
        </p>

        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm min-h-[1.25rem]"
            style={{ color: C.textSecondary }}
          >
            {ANALYZING_STEPS[step]}
          </motion.p>
        </AnimatePresence>

        {/* Minimal progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {ANALYZING_STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              animate={{
                background: i <= step ? C.accent : C.track,
                scale: i === step ? 1.4 : 1,
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COUNT-UP HOOK
// ─────────────────────────────────────────────

function useCountUp(target: number, duration = 1400, delay = 500): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return count;
}

// ─────────────────────────────────────────────
// DONUT SCORE
// ─────────────────────────────────────────────

function DonutScore({ score }: { score: number }) {
  const R = 70;
  const circumference = 2 * Math.PI * R;
  const targetOffset = circumference - (score / 100) * circumference;
  const displayScore = useCountUp(score, 1400, 500);

  return (
    <div className="relative" style={{ width: 180, height: 180 }}>
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle
          cx="90"
          cy="90"
          r={R}
          fill="none"
          stroke={C.track}
          strokeWidth="12"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={R}
          fill="none"
          stroke="url(#donutGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[10px] uppercase tracking-[0.28em] mb-1"
          style={{ color: C.textMuted }}
        >
          Score
        </span>
        <div className="flex items-baseline gap-0.5">
          <span
            className="text-[2.8rem] tabular-nums leading-none"
            style={{
              color: C.accent,
              fontFamily: "var(--font-heading), Georgia, serif",
            }}
          >
            {displayScore}
          </span>
          <span className="text-xs" style={{ color: C.textMuted }}>
            /100
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPACT BREAKDOWN LIST
// ─────────────────────────────────────────────

function CompactBreakdown({ breakdown }: { breakdown: ScoreBreakdownItem[] }) {
  return (
    <div className="space-y-3">
      {breakdown.map((item, i) => {
        const pct = item.max > 0 ? Math.round((item.points / item.max) * 100) : 0;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-[3px] h-10 rounded-full flex-shrink-0 relative overflow-hidden"
              style={{ background: C.track }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 rounded-full"
                style={{ background: C.accent }}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: 0.75 + i * 0.07, duration: 0.7, ease: EASE }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.15em] mb-0.5 truncate"
                style={{ color: C.textMuted }}
              >
                {item.label}
              </p>
              <p
                className="text-[13px] leading-tight truncate"
                style={{ color: C.text, fontWeight: 500 }}
              >
                {item.value}
              </p>
            </div>
            <span
              className="text-[11px] tabular-nums flex-shrink-0"
              style={{ color: C.accent, fontWeight: 500 }}
            >
              {item.points}/{item.max}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────────

function formatEurRounded(n: number): string {
  if (n < 5000) {
    const r = Math.round(n / 500) * 500;
    return `${r.toLocaleString("de-DE")} €`;
  }
  const r = Math.round(n / 1000) * 1000;
  return `${r.toLocaleString("de-DE")} €`;
}

function ResultScreen({
  answers,
  score,
  onReset,
}: {
  answers: Answers;
  score: ScoreResult;
  onReset: () => void;
}) {
  const benchmark = findBenchmark(answers.q1_branche);
  const roi = calculateRoi(
    benchmark,
    answers.q8_stunden,
    answers.q11_bestandskunden,
  );
  const topHebel = benchmark.typischeHebel.slice(0, 3);
  const showHebelSection = score.category !== "Niedrig";

  return (
    <div className="min-h-[100dvh] py-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p
            className="text-[11px] uppercase tracking-[0.3em] mb-4"
            style={{ color: C.accent }}
          >
            Ihr persönliches Ergebnis
          </p>
          <h2
            className="text-[2.2rem] md:text-[3rem] tracking-tight mb-2"
            style={{ fontFamily: "var(--font-heading), Georgia, serif", color: C.text }}
          >
            Geschätztes<br />
            <span style={{ color: C.accent }}>Automatisierungspotenzial</span>
          </h2>
          <p className="text-sm" style={{ color: C.textMuted }}>
            {answers.q14_name} · {answers.q14_unternehmen}
          </p>
        </motion.div>

        {/* Combined Score + Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl p-6 md:p-8 mb-4"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          {/* Category badge */}
          <div className="text-center mb-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[12px] tracking-wide"
              style={{
                color: C.accent,
                background: C.accentSubtle,
                border: `1px solid ${C.accentBorder}`,
                fontWeight: 500,
              }}
            >
              {score.category}
            </span>
          </div>

          {/* Donut + Compact breakdown */}
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
            <div className="flex justify-center">
              <DonutScore score={score.normalized} />
            </div>
            <CompactBreakdown breakdown={score.breakdown} />
          </div>

          {/* Description + stats */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-7 pt-6 border-t text-center"
            style={{ borderColor: C.border }}
          >
            <p
              className="text-sm leading-relaxed max-w-[44ch] mx-auto balance mb-4"
              style={{ color: C.textSecondary }}
            >
              {score.description}
            </p>
            <div className="flex items-center justify-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock size={14} weight="regular" style={{ color: C.accent }} />
                <span className="text-[12px]" style={{ color: C.textMuted }}>
                  Potenzielle Ersparnis
                </span>
                <span
                  className="text-[13px] tabular-nums"
                  style={{ color: C.text, fontWeight: 500 }}
                >
                  ca. {score.timeSaving}*
                </span>
              </div>
              <div className="w-px h-3" style={{ background: C.border }} />
              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: C.textMuted }}>
                  Aufgaben
                </span>
                <span
                  className="text-[13px] tabular-nums"
                  style={{ color: C.text, fontWeight: 500 }}
                >
                  {answers.q7_aufgaben.filter((t) => t !== "Keine der obigen").length} identifiziert
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hebel + ROI-Range — show-what, hide-how */}
        {showHebelSection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="rounded-2xl p-6 md:p-8 mb-4"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.28em] mb-4"
              style={{ color: C.accent, fontWeight: 500 }}
            >
              Wo Ihr Hebel liegt
            </p>
            <ul className="space-y-3 mb-6">
              {topHebel.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.15 + i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: C.accent }}
                  />
                  <span
                    className="text-[14px] leading-relaxed"
                    style={{ color: C.text }}
                  >
                    {h}
                  </span>
                </motion.li>
              ))}
            </ul>
            <div
              className="pt-5 border-t"
              style={{ borderColor: C.border }}
            >
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: C.textSecondary }}
              >
                Bei Unternehmen Ihrer Größe und Branche sehen wir
                realistisch zwischen{" "}
                <span style={{ color: C.text, fontWeight: 600 }}>
                  {formatEurRounded(roi.gesamthebelMinEurJahr)}
                </span>{" "}
                und{" "}
                <span style={{ color: C.text, fontWeight: 600 }}>
                  {formatEurRounded(roi.gesamthebelMaxEurJahr)}
                </span>
                /Jahr ungenutztes Potenzial.*
              </p>
              <p
                className="text-[14px] leading-relaxed mt-4"
                style={{ color: C.textSecondary }}
              >
                Wie genau diese Hebel bei Ihnen aussehen würden —
                inklusive konkreter Aufwand, Tools und Preis — besprechen
                wir am besten in einem 30-Minuten-Erstgespräch.
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA block — category-dependent headline + subtext */}
        {(() => {
          const ctaCopy =
            score.category === "Hoch"
              ? {
                  headlineA: "In 15 Minuten zeige ich Ihnen,",
                  headlineB: "welche Prozesse wir automatisieren.",
                  subtext:
                    "Bei Ihrem Profil ist das Potenzial deutlich. Unternehmen in Ihrer Situation gewinnen am meisten, wenn sie jetzt strukturieren — bevor die manuellen Prozesse noch komplexer werden und der Aufräum-Aufwand wächst.",
                }
              : score.category === "Mittel"
              ? {
                  headlineA: "In 15 Minuten zeige ich Ihnen,",
                  headlineB: "wo Ihre größten Hebel liegen.",
                  subtext:
                    "Es gibt erkennbares Potenzial. Viele Unternehmen in Ihrer Größe automatisieren erst, wenn die manuelle Last überhand nimmt — ein Blick jetzt zeigt, wo Sie früh ansetzen können.",
                }
              : {
                  headlineA: "In 15 Minuten klären wir,",
                  headlineB: "ob sich ein Schritt jetzt lohnt.",
                  subtext:
                    "Auch wenn das Potenzial aktuell überschaubar ist — wer früh Strukturen schafft, verhindert spätere Wachstumsschmerzen. Das Erstgespräch klärt, ob ein Schritt jetzt schon sinnvoll ist oder besser später.",
                };

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="rounded-2xl p-8 mb-5 text-center"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <h3
                className="text-[1.3rem] md:text-[1.6rem] mb-4 tracking-tight balance"
                style={{ fontFamily: "var(--font-heading), Georgia, serif", color: C.text }}
              >
                {ctaCopy.headlineA}
                <br />
                <span style={{ color: C.accent }}>{ctaCopy.headlineB}</span>
              </h3>

              <p
                className="text-sm leading-relaxed max-w-[46ch] mx-auto mb-6"
                style={{ color: C.textSecondary }}
              >
                {ctaCopy.subtext}
              </p>

              <motion.a
                href="https://calendly.com/moreno-who/30min"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-[15px] transition-all duration-300 shadow-[0_8px_32px_-8px_rgba(139,92,246,0.3)]"
                style={{
                  background: C.accent,
                  color: C.onAccent,
                  fontWeight: 500,
                }}
              >
                Kostenloses Erstgespräch buchen
                <ArrowSquareOut size={16} weight="bold" />
              </motion.a>

              <p
                className="text-sm max-w-[42ch] mx-auto mt-6"
                style={{ color: C.textSecondary }}
              >
                Kein Verkaufsgespräch — nur eine ehrliche Einschätzung,
                was in Ihrem Fall möglich ist und was nicht.
              </p>

              <p className="mt-3 text-[12px]" style={{ color: C.textMuted }}>
                Keine Verpflichtung. Keine versteckten Kosten.
              </p>
            </motion.div>
          );
        })()}

        {/* Disclaimer — rechtlich erforderlich gem. § 5 UWG */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="rounded-xl p-5 mb-5"
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.accentBorder}`,
          }}
        >
          <p
            className="text-[13px] font-medium mb-2"
            style={{ color: "#555555" }}
          >
            * Hinweis zur Einschätzung
          </p>
          <p
            className="text-[13px] leading-relaxed mb-2"
            style={{ color: "#555555" }}
          >
            Die dargestellten Werte sind eine unverbindliche Orientierung auf
            Basis Ihrer Angaben und Erfahrungswerten aus vergleichbaren
            Automatisierungsprojekten. Sie stellen kein verbindliches
            Versprechen dar.
          </p>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "#555555" }}
          >
            Die tatsächlich erzielbare Zeitersparnis hängt von Ihrer Branche,
            dem Reifegrad Ihrer Prozesse, eingesetzter Software und dem Umfang
            der Automatisierung ab. Eine belastbare Einschätzung erfolgt im
            persönlichen Erstgespräch nach individueller Prozessanalyse.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-[12px]"
          style={{ color: C.textMuted }}
        >
          Zusammenfassung an{" "}
          <span style={{ color: C.textSecondary }}>{answers.q14_email}</span> gesendet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 text-center"
        >
          <button
            onClick={onReset}
            className="text-[12px] underline-offset-2 hover:underline transition-colors"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.textSecondary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            Neue Analyse starten
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DEFAULT ANSWERS
// ─────────────────────────────────────────────

const DEFAULT_ANSWERS: Answers = {
  q1_branche: "", q2_mitarbeiter: "", q3_nerv: "",
  q4_tools: [], q4_tools_detail: {},
  q5_website: "", q5_url: "",
  q6_zufriedenheit: 0,
  q7_aufgaben: [], q8_stunden: "", q9_kundengewinnung: [],
  q10_followup: "", q11_bestandskunden: "",
  q12_wert: "", q13_geschwindigkeit: "",
  q14_zeitnutzung: "",
  q14_name: "", q14_unternehmen: "", q14_email: "", q14_telefon: "",
  consent: false,
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const STORAGE_KEY = "potenzialanalyse_result_v1";
const STORAGE_TTL_DAYS = 30;

export default function PotenzialanalysePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Wiederherstellen: wenn bereits eingereicht, direkt zum Result
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        answers: Answers;
        score: ScoreResult;
        timestamp: number;
      };
      const ageDays = (Date.now() - saved.timestamp) / (1000 * 60 * 60 * 24);
      if (ageDays > STORAGE_TTL_DAYS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      setAnswers(saved.answers);
      setScore(saved.score);
      setPhase("result");
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const update = useCallback(
    (key: keyof Answers, value: Answers[keyof Answers]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setValidationError("");
    },
    []
  );

  const goTo = (p: Phase) => {
    setValidationError("");
    setPhase(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!answers.q14_name.trim()) {
      setValidationError("Bitte geben Sie Ihren Namen ein.");
      return;
    }
    if (!answers.q14_unternehmen.trim()) {
      setValidationError("Bitte geben Sie Ihren Unternehmensnamen ein.");
      return;
    }
    if (!answers.q14_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.q14_email)) {
      setValidationError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (isDisposableEmail(answers.q14_email)) {
      setValidationError("Bitte verwenden Sie Ihre geschäftliche E-Mail-Adresse.");
      return;
    }
    if (!answers.consent) {
      setValidationError("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }

    setSubmitting(true);
    goTo("analyzing");

    const computed = calculateScore(answers);
    setScore(computed);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, score: computed, timestamp: Date.now() })
      );
    } catch {
      /* localStorage kann disabled sein (Inkognito) — egal */
    }

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, score: computed }),
    }).catch((err) => {
      console.error("Submit failed:", err);
    });

    setTimeout(() => {
      setSubmitting(false);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2800);
  };

  const resetAnalysis = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setAnswers(DEFAULT_ANSWERS);
    setScore(null);
    setValidationError("");
    setPhase("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showProgressBar =
    phase !== "intro" && phase !== "analyzing" && phase !== "result";

  return (
    <div className="min-h-[100dvh]" style={{ background: C.bg }}>
      {showProgressBar && <ProgressBar phase={phase} />}
      {showProgressBar && <div className="h-[56px]" />}

      <div className={phase === "intro" ? "relative" : "relative max-w-2xl mx-auto px-5 py-8 pb-24"}>
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" {...PAGE_TRANSITION}>
              <IntroScreen onStart={() => goTo("phase1")} />
            </motion.div>
          )}

          {phase === "phase1" && (
            <motion.div key="phase1" {...PAGE_TRANSITION}>
              <Phase1 answers={answers} update={update} onNext={() => goTo("phase2")} />
            </motion.div>
          )}

          {phase === "phase2" && (
            <motion.div key="phase2" {...PAGE_TRANSITION}>
              <Phase2
                answers={answers}
                update={update}
                onNext={() => goTo("phase3")}
                onBack={() => goTo("phase1")}
              />
            </motion.div>
          )}

          {phase === "phase3" && (
            <motion.div key="phase3" {...PAGE_TRANSITION}>
              <Phase3
                answers={answers}
                update={update}
                onNext={() => goTo("phase4")}
                onBack={() => goTo("phase2")}
              />
            </motion.div>
          )}

          {phase === "phase4" && (
            <motion.div key="phase4" {...PAGE_TRANSITION}>
              <Phase4
                answers={answers}
                update={update}
                onSubmit={handleSubmit}
                onBack={() => goTo("phase3")}
                error={validationError}
                submitting={submitting}
              />
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div key="analyzing" {...PAGE_TRANSITION}>
              <AnalyzingScreen />
            </motion.div>
          )}

          {phase === "result" && score && (
            <motion.div key="result" {...PAGE_TRANSITION}>
              <ResultScreen answers={answers} score={score} onReset={resetAnalysis} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
