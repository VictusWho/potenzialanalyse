import { NextResponse } from "next/server";
import { isDisposableEmail } from "../../disposable-emails";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const { name, email, message, website } = body;

    if (website && website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Ungültige E-Mail-Adresse." },
        { status: 400 }
      );
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Wegwerf-E-Mail-Adressen sind nicht erlaubt." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Nachricht zu lang." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️  RESEND_API_KEY not set — contact form submission:", {
        name,
        email,
        message,
      });
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from =
      process.env.FROM_EMAIL ?? "Potenzialanalyse <onboarding@resend.dev>";

    const html = `<!DOCTYPE html>
<html lang="de"><body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#080D18;padding:24px 32px;color:#fff;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#F5A623;">Kontaktformular</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px;">${escapeHtml(name)}</div>
    </div>
    <div style="padding:24px 32px;color:#111827;">
      <p style="margin:0 0 12px;"><strong>E-Mail:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2563EB;">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 8px;"><strong>Nachricht:</strong></p>
      <div style="background:#F9FAFB;border-left:3px solid #8B5CF6;padding:12px 16px;white-space:pre-wrap;color:#374151;">${escapeHtml(message)}</div>
    </div>
  </div>
</body></html>`;

    const { error } = await resend.emails.send({
      from,
      to: ["moreno.who@gmail.com"],
      reply_to: email,
      subject: `Kontaktanfrage: ${name}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: "Versand fehlgeschlagen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
