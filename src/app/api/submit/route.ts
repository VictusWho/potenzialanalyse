import { NextResponse } from "next/server";
import { isDisposableEmail } from "../../disposable-emails";
import {
  findBenchmark,
  calculateRoi,
  techStackHint,
  pitchFrame,
} from "@/lib/branchen-benchmarks";

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
  breakdown?: ScoreBreakdownItem[];
}

function chip(text: string) {
  return `<span style="display:inline-block;background:#EEF2FF;color:#3730A3;padding:3px 10px;border-radius:999px;font-size:12px;margin:2px 2px 2px 0;font-family:Arial,sans-serif;">${text}</span>`;
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top;font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-family:Arial,sans-serif;">${value || "—"}</td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <div style="margin-top:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px;font-family:Arial,sans-serif;">${title}</div>
      <table style="width:100%;border-collapse:collapse;">${content}</table>
    </div>`;
}

function buildEmailHTML(answers: Answers, score: ScoreResult): string {
  const scoreColor =
    score.normalized >= 61 ? "#DC2626" : score.normalized >= 31 ? "#D97706" : "#16A34A";

  const toolsList = answers.q4_tools.length
    ? answers.q4_tools
        .map((t) => {
          const detail = answers.q4_tools_detail[t];
          return chip(detail ? `${t}: ${detail}` : t);
        })
        .join(" ")
    : "—";

  const ratingLabel: Record<number, string> = {
    1: "1 — Frustriert",
    2: "2 — Eher unzufrieden",
    3: "3 — Geht so",
    4: "4 — Ganz gut",
    5: "5 — Läuft perfekt",
  };

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#080D18;padding:28px 32px;">
      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#F5A623;margin-bottom:6px;">Neue Potenzialanalyse</div>
      <div style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;">${answers.q14_name}</div>
      <div style="font-family:Arial,sans-serif;font-size:15px;color:#94A3B8;margin-top:2px;">${answers.q14_unternehmen}</div>
    </div>

    <!-- Score Box -->
    <div style="background:#0F1628;padding:24px 32px;display:flex;align-items:center;gap:24px;">
      <div style="text-align:center;min-width:80px;">
        <div style="font-family:Arial,sans-serif;font-size:48px;font-weight:800;color:${scoreColor};line-height:1;">${score.normalized}</div>
        <div style="font-family:Arial,sans-serif;font-size:12px;color:#64748B;">/100</div>
      </div>
      <div>
        <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;margin-bottom:4px;">${score.category}</div>
        <div style="font-family:Arial,sans-serif;font-size:13px;color:#94A3B8;margin-bottom:8px;">${score.description}</div>
        <div style="font-family:Arial,sans-serif;font-size:13px;color:#F5A623;">⏱ Geschätzte Zeitersparnis: ${score.timeSaving}</div>
      </div>
    </div>

    <div style="padding:24px 32px 32px;">

      <!-- Contact -->
      <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:8px;padding:16px;margin-bottom:8px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("E-Mail", `<a href="mailto:${answers.q14_email}" style="color:#2563EB;">${answers.q14_email}</a>`)}
          ${answers.q14_telefon ? row("Telefon", `<a href="tel:${answers.q14_telefon}" style="color:#2563EB;">${answers.q14_telefon}</a>`) : ""}
        </table>
      </div>

      <!-- Phase 1 -->
      ${section(
        "Phase 1 — Wer sind Sie?",
        row("Branche", answers.q1_branche) +
          row("Mitarbeiter", answers.q2_mitarbeiter) +
          row("Größte Frustration", answers.q3_nerv
            ? `<em style="color:#374151;">"${answers.q3_nerv}"</em>`
            : "—")
      )}

      <!-- Phase 2 -->
      ${section(
        "Phase 2 — Womit arbeiten Sie?",
        row("Tools", toolsList) +
          row("Website", answers.q5_website + (answers.q5_url ? ` — <a href="${answers.q5_url}" style="color:#2563EB;">${answers.q5_url}</a>` : "")) +
          row("Tool-Zufriedenheit", ratingLabel[answers.q6_zufriedenheit] || "—")
      )}

      <!-- Phase 3 -->
      ${section(
        "Phase 3 — Wo liegt das Potenzial?",
        row("Wiederholende Aufgaben", answers.q7_aufgaben.length ? answers.q7_aufgaben.map(chip).join(" ") : "—") +
          row("Stunden/Woche dafür", answers.q8_stunden) +
          row("Kundengewinnung", answers.q9_kundengewinnung.length ? answers.q9_kundengewinnung.map(chip).join(" ") : "—") +
          row("Follow-up System", answers.q10_followup) +
          row("Zeit-Wertschätzung", answers.q14_zeitnutzung) +
          row("Bestandskunden", answers.q11_bestandskunden)
      )}

      <!-- Phase 4 -->
      ${section(
        "Phase 4 — Nächster Schritt",
        row("Investitionsbereitschaft", answers.q12_wert) +
          row("Dringlichkeit", answers.q13_geschwindigkeit)
      )}

      <!-- Footer -->
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #E5E7EB;font-family:Arial,sans-serif;font-size:12px;color:#9CA3AF;text-align:center;">
        Automatisch generiert via Potenzialanalyse-Tool
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function syncToNotion(answers: Answers, score: ScoreResult) {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.log("ℹ️  Notion nicht konfiguriert — überspringe Sync.");
    return;
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID;

  const sel = (v: string) =>
    v ? { select: { name: v } } : { select: null };
  const multi = (arr: string[]) => ({
    multi_select: arr.map((name) => ({ name })),
  });
  const rich = (v: string) => ({
    rich_text: v ? [{ text: { content: v.slice(0, 2000) } }] : [],
  });

  // Properties für Create UND Update (beim Update kein Status überschreiben —
  // sonst würde ein manuell auf "Kontaktiert" gesetzter Lead zurück auf "Neu")
  const baseProperties = {
    "Name": {
      title: [{ text: { content: answers.q14_name || "(ohne Name)" } }],
    },
    "Unternehmen": rich(answers.q14_unternehmen),
    "E-Mail": { email: answers.q14_email || null },
    "Telefon": { phone_number: answers.q14_telefon || null },
    "Score": { number: score.normalized },
    "Kategorie": sel(score.category),
    "Branche": rich(answers.q1_branche),
    "Mitarbeiter": sel(answers.q2_mitarbeiter),
    "Stunden/Woche": sel(answers.q8_stunden),
    "Dringlichkeit": sel(answers.q13_geschwindigkeit),
    "Zahlungsbereitschaft": sel(answers.q12_wert),
    "Zeitersparnis": rich(score.timeSaving),
    "Frustration": rich(answers.q3_nerv),
    "Tools": multi(answers.q4_tools),
    "Aufgaben": multi(answers.q7_aufgaben),
  };

  // Dedupe per E-Mail: wenn Lead existiert → Update, sonst → Create
  if (answers.q14_email) {
    const existing = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "E-Mail",
        email: { equals: answers.q14_email },
      },
      page_size: 1,
    });

    if (existing.results.length > 0) {
      await notion.pages.update({
        page_id: existing.results[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties: baseProperties as any,
      });
      console.log("🔁 Notion-Lead aktualisiert:", answers.q14_email);
      return;
    }
  }

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      ...baseProperties,
      "Status": { select: { name: "Neu" } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
  console.log("🆕 Notion-Lead angelegt:", answers.q14_email);
}

function fmtEur(n: number): string {
  return `${Math.round(n).toLocaleString("de-DE")} €`;
}

function buildBriefingMarkdown(answers: Answers, score: ScoreResult): string {
  const bm = findBenchmark(answers.q1_branche);
  const roi = calculateRoi(bm, answers.q8_stunden, answers.q11_bestandskunden);
  const frame = pitchFrame(answers.q14_zeitnutzung);
  const stack = techStackHint(answers.q4_tools);

  const ratingLabel: Record<number, string> = {
    1: "Frustriert (1/5)",
    2: "Unzufrieden (2/5)",
    3: "Okay (3/5)",
    4: "Zufrieden (4/5)",
    5: "Sehr zufrieden (5/5)",
  };

  const toolsLabel = (() => {
    const items = answers.q4_tools.map((t) => {
      const detail = answers.q4_tools_detail?.[t];
      return detail ? `${t} (${detail})` : t;
    });
    return items.length ? items.join(", ") : "Keine angegeben";
  })();

  const akquise = answers.q9_kundengewinnung.length
    ? answers.q9_kundengewinnung.join(", ")
    : "Keine angegeben";

  const aufgaben = answers.q7_aufgaben.filter((t) => t !== "Keine der obigen");

  // Pitch-Hinweis je nach Frame
  const pitchHint =
    frame.kind === "qualitativ"
      ? "qualitativ framen (Lebensqualität, weniger Stress, Fokuszeit). Quantitative ROI-Zahlen unterstützend, nicht im Mittelpunkt."
      : frame.kind === "quantitativ"
        ? `quantitativ framen (${frame.label}). Konkrete Euro-/Stunden-Zahlen in den Mittelpunkt stellen.`
        : "Framing offen. Im Erstgespräch klären, ob Pitch quantitativ oder qualitativ landet.";

  // Amortisation bei 3.500 € Projekt-Pricing
  const projektPreis = 3500;
  const monatlicherHebelMin = roi.gesamthebelMinEurJahr / 12;
  const paybackMonate =
    monatlicherHebelMin > 0 ? projektPreis / monatlicherHebelMin : Infinity;
  const paybackText =
    paybackMonate === Infinity
      ? "n/a"
      : paybackMonate < 1
        ? "< 1 Monat"
        : `~${paybackMonate.toFixed(1)} Monate`;

  // ROI-Pitch-Satz
  const pitchSatz =
    frame.kind === "qualitativ"
      ? `Manuelle Last halbieren = ca. ${(roi.stundenMid * 0.4).toFixed(1)} h/Woche zurück. Lebensqualität als Kern-Argument.`
      : frame.kind === "quantitativ"
        ? `${fmtEur(roi.gesamthebelMinEurJahr)}–${fmtEur(roi.gesamthebelMaxEurJahr)}/Jahr realistisch freisetzbar — Payback bei 3.500 € Projekt-Pricing: ${paybackText}.`
        : `Hebel ${fmtEur(roi.gesamthebelMinEurJahr)}–${fmtEur(roi.gesamthebelMaxEurJahr)}/Jahr — Pitch-Framing im Gespräch klären.`;

  // Hebel-Liste mit optionaler Pain-Markierung
  const painLower = (answers.q3_nerv ?? "").toLowerCase();
  const hebelKeywordHints: Array<[string, RegExp]> = [
    ["follow", /follow|nachfass|nachhak/],
    ["termin", /termin|kalend/],
    ["rechnung|mahn", /rechnung|mahn|zahlung/],
    ["bestand|cross", /bestand|cross|kund/],
  ];
  const hebelLines = bm.typischeHebel
    .map((h, i) => {
      const hLower = h.toLowerCase();
      const matched = hebelKeywordHints.some(
        ([key, re]) =>
          new RegExp(key).test(hLower) && re.test(painLower),
      );
      const marker = matched ? " ★ deckt Pain-Aussage" : "";
      return `${i + 1}. ${h}${marker}`;
    })
    .join("\n");

  // Direkter nächster Schritt
  const nextStep = (() => {
    switch (answers.q13_geschwindigkeit) {
      case "Sofort":
        return "Erstgespräch innerhalb 48h anbieten.";
      case "Nächste 4 Wochen":
        return "Termin-Vorschlag in den nächsten 14 Tagen.";
      case "Nächste 3 Monate":
        return "Soft Touch in 1–2 Wochen, danach Termin-Vorschlag.";
      case "Irgendwann":
        return "Soft Touch in 2–4 Wochen, kein Druck.";
      default:
        return "Im Erstgespräch klären.";
    }
  })();

  const breakdownLines = (score.breakdown ?? [])
    .map((b) => `- ${b.label}: ${b.points}/${b.max} (${b.value})`)
    .join("\n");

  const timestamp = new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `# Discovery-Briefing: ${answers.q14_unternehmen || "(ohne Firma)"}

**Eingang:** ${timestamp}
**Lead:** ${answers.q14_name} <${answers.q14_email}>
**Telefon:** ${answers.q14_telefon || "—"}

## Persona-Profil
- Branche: ${answers.q1_branche || "—"} (${bm.name})
- Größe: ${answers.q2_mitarbeiter || "—"} Mitarbeiter, ca. ${answers.q11_bestandskunden || "—"} Bestandskunden
- Hat Website: ${answers.q5_website || "—"}${answers.q5_url ? ` (${answers.q5_url})` : ""}
- Bestehende Tools: ${toolsLabel}
- Aktuelle Tool-Zufriedenheit: ${ratingLabel[answers.q6_zufriedenheit] ?? "—"}
- Akquise-Kanäle: ${akquise}
- Follow-up-Reife: ${answers.q10_followup || "—"}
- Zeit-Wertschätzung: "${answers.q14_zeitnutzung || "—"}"
  → Pitch sollte ${pitchHint}

## Pain laut User
> ${answers.q3_nerv ? `"${answers.q3_nerv}"` : "Kein Freitext gegeben."}

## Score-Diagnose
**Gesamt-Score:** ${score.normalized}/100 (${score.category})

Breakdown:
${breakdownLines}

## ROI-Schätzung (basierend auf Branchen-Benchmarks)

**Annahmen (transparent gemacht — im Gespräch validieren):**
- ~${roi.kundenMid} Bestandskunden (Mid-Value von "${answers.q11_bestandskunden || "—"}")
- ~${roi.stundenMid} h/Woche manuelle Arbeit (Mid-Value von "${answers.q8_stunden || "—"}")
- Stundensatz: ${bm.stundenSatzMin}–${bm.stundenSatzMax} € (Branche ${bm.name}, Mid: ${roi.stundenSatzMid} €)
- Kundenwert/Jahr: ${bm.kundenwertProJahrMin}–${bm.kundenwertProJahrMax} € (Mid: ${roi.kundenwertMid} €)
- Cross-Sell-Potenzial: ~${bm.crossSellPotenzialPct}% bei besserem Follow-up

**Manuelle Last (aktuell):**
- ${roi.stundenMid} h/Woche × ${roi.stundenSatzMid} €/h × 4 = ${fmtEur(roi.manuelleLastEurMonat)}/Monat
- ≈ ${fmtEur(roi.manuelleLastEurJahr)}/Jahr

**Bestandsumsatz:**
- ${roi.kundenMid} Kunden × ${roi.kundenwertMid} €/Jahr ≈ ${fmtEur(roi.bestandsumsatzEurJahr)}/Jahr

**Cross-Sell-Hebel bei besserem Follow-up:**
- ~${bm.crossSellPotenzialPct}% von ${fmtEur(roi.bestandsumsatzEurJahr)} ≈ ${fmtEur(roi.crossSellEurJahr)}/Jahr zusätzlich realistisch

**Realistische Ersparnis durch Automation:**
- 30–50% der manuellen Last automatisierbar = ${fmtEur(roi.ersparnisMinEurJahr)}–${fmtEur(roi.ersparnisMaxEurJahr)}/Jahr
- Plus Cross-Sell-Hebel: Gesamthebel **${fmtEur(roi.gesamthebelMinEurJahr)}–${fmtEur(roi.gesamthebelMaxEurJahr)}/Jahr**

**Projekt-Amortisation:**
- Bei Projekt-Pricing 3.500 €: Payback ${paybackText} (gerechnet vs. konservativem Hebel-Min)
- Empfohlener Pitch: "${pitchSatz}"

## Vermutliche Hebel (Branchen-spezifisch)
${hebelLines}

${aufgaben.length > 0 ? `Vom User explizit als wiederholend genannt: ${aufgaben.join(", ")}.` : ""}

## Tech-Stack-Empfehlung (initial)
${stack}

## Offene Fragen für Erstgespräch
1. Welcher der genannten Hebel hat aktuell den höchsten Schmerz?
2. Wer trifft die Entscheidung über solche Investitionen?
3. Welche Datenquellen würden für die Automation angezapft? (Welches CRM? Excel-Listen? Mail-Postfach?)
4. Gibt es DSGVO-/Compliance-spezifische Constraints?
5. Realistische Timeline und Budget-Erwartung?

## Direkter nächster Schritt
${nextStep}

---
*Automatisch generiertes Briefing. Annahmen basieren auf Branchen-Benchmarks und sind im Erstgespräch zu validieren. Investitionsbereitschaft laut User: ${answers.q12_wert || "—"}.*
`;
}

async function sendInternalBriefing(answers: Answers, score: ScoreResult) {
  const markdown = buildBriefingMarkdown(answers, score);
  const subject = `[Briefing] ${answers.q14_unternehmen || answers.q14_name || "Lead"} — Score ${score.normalized}/100`;

  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️  RESEND_API_KEY not set — skipping internal briefing.");
    console.log("Subject:", subject);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.FROM_EMAIL ?? "Potenzialanalyse <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: ["moreno.who@gmail.com"],
    subject,
    text: markdown,
  });

  if (error) throw new Error(`Resend (briefing): ${error.message}`);
}

async function sendEmail(answers: Answers, score: ScoreResult) {
  const html = buildEmailHTML(answers, score);
  const subject = `Potenzialanalyse: ${answers.q14_name} (${answers.q14_unternehmen}) — Score ${score.normalized}/100`;

  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️  RESEND_API_KEY not set — logging to console instead.");
    console.log("Subject:", subject);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.FROM_EMAIL ?? "Potenzialanalyse <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: ["moreno.who@gmail.com"],
    reply_to: answers.q14_email,
    subject,
    html,
  });

  if (error) throw new Error(`Resend: ${error.message}`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, score } = body as { answers: Answers; score: ScoreResult };

    if (answers.q14_email && isDisposableEmail(answers.q14_email)) {
      return NextResponse.json(
        { success: false, error: "Wegwerf-E-Mail-Adressen sind nicht erlaubt." },
        { status: 400 }
      );
    }

    // Alle drei parallel — Fehlschlag eines blockiert die anderen nicht
    const [emailResult, notionResult, briefingResult] = await Promise.allSettled([
      sendEmail(answers, score),
      syncToNotion(answers, score),
      sendInternalBriefing(answers, score),
    ]);

    if (emailResult.status === "rejected") {
      console.error("E-Mail fehlgeschlagen:", emailResult.reason);
    }
    if (notionResult.status === "rejected") {
      console.error("Notion-Sync fehlgeschlagen:", notionResult.reason);
    }
    if (briefingResult.status === "rejected") {
      console.error("Internes Briefing fehlgeschlagen:", briefingResult.reason);
    }

    // Erfolg, solange mindestens eines der Lead-Kanäle (Mail/Notion) klappt
    const anySuccess =
      emailResult.status === "fulfilled" || notionResult.status === "fulfilled";

    if (!anySuccess) {
      return NextResponse.json(
        { success: false, error: "Beide Kanäle fehlgeschlagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email: emailResult.status,
      notion: notionResult.status,
      briefing: briefingResult.status,
    });
  } catch (err) {
    console.error("Submit route error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
