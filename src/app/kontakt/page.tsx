"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() && email.trim() && message.trim() && consent && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Etwas ist schiefgelaufen.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Netzwerkfehler. Bitte später erneut versuchen.");
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #E9E5F5",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: "#1A1A2E",
    width: "100%",
    outline: "none",
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#FAFAFE" }}>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 py-12">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ color: "#8B5CF6" }}
          >
            ← Zurück
          </Link>

          <h1
            className="mt-6 text-3xl font-bold"
            style={{ color: "#1A1A2E", fontFamily: "var(--font-heading)" }}
          >
            Kontakt
          </h1>
          <p className="mt-3 text-sm" style={{ color: "#52525B" }}>
            Fragen, Feedback oder Projektanfrage? Schreib mir über das Formular —
            ich melde mich zurück.
          </p>

          {sent ? (
            <div
              className="mt-8 p-6 rounded-lg"
              style={{
                background: "rgba(139,92,246,0.05)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <div className="text-base font-semibold" style={{ color: "#1A1A2E" }}>
                Nachricht gesendet.
              </div>
              <div className="mt-2 text-sm" style={{ color: "#52525B" }}>
                Danke für deine Anfrage. Ich melde mich so schnell wie möglich
                per E-Mail.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#52525B" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#52525B" }}
                >
                  E-Mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#52525B" }}
                >
                  Nachricht
                </label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </div>

              {/* Honeypot — Bots füllen das aus, Menschen sehen es nicht */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <label
                className="flex items-start gap-2.5 text-xs cursor-pointer"
                style={{ color: "#52525B" }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5"
                  style={{ accentColor: "#8B5CF6" }}
                />
                <span>
                  Ich willige ein, dass meine Angaben zur Bearbeitung meiner
                  Anfrage verarbeitet werden. Hinweise zum Umgang mit meinen
                  Daten finde ich in der{" "}
                  <Link
                    href="/datenschutz"
                    className="hover:underline"
                    style={{ color: "#8B5CF6" }}
                  >
                    Datenschutzerklärung
                  </Link>
                  .
                </span>
              </label>

              {error && (
                <div
                  className="text-xs p-3 rounded-md"
                  style={{ background: "#FEF2F2", color: "#991B1B" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg px-5 py-3 text-sm font-semibold transition"
                style={{
                  background: canSubmit ? "#8B5CF6" : "#C4B5FD",
                  color: "#fff",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Wird gesendet…" : "Nachricht senden"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
