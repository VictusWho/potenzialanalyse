import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "Datenschutzerklärung — Potenzialanalyse",
  robots: "noindex, nofollow",
};

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>

          <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "#52525B" }}>
            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                1. Verantwortlicher
              </h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne
                der DSGVO ist:
                <br />
                Ludovico Moreno Ferrara
                <br />
                Metzstr. 18
                <br />
                44793 Bochum, Deutschland
                <br />
                E-Mail: moreno.who@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                2. Allgemeines zur Datenverarbeitung
              </h2>
              <p>
                Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich
                nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
                sowie unserer Inhalte und Leistungen erforderlich ist. Die
                Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach
                Einwilligung des Nutzers (Art. 6 Abs. 1 lit. a DSGVO) oder zur
                Erfüllung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                3. Daten der Potenzialanalyse
              </h2>
              <p className="mb-2">
                Wenn Sie das Formular zur Potenzialanalyse ausfüllen, verarbeiten
                wir folgende Daten:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, Unternehmen, E-Mail-Adresse, optional Telefonnummer</li>
                <li>
                  Angaben zu Ihrem Unternehmen (Branche, Mitarbeiterzahl, genutzte
                  Tools, Aufgaben, Kundengewinnung u. a.)
                </li>
                <li>
                  Ergebnis der Analyse (Score, Kategorie, geschätzte Zeitersparnis)
                </li>
              </ul>
              <p className="mt-2">
                <strong>Zweck:</strong> Durchführung der Potenzialanalyse,
                Zusendung des Ergebnisses, Kontaktaufnahme zur Terminvereinbarung.
                <br />
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
                (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
                Maßnahmen).
                <br />
                <strong>Speicherdauer:</strong> Bis zum Widerruf bzw. maximal [X]
                Monate nach Abschluss der Analyse.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                4. Auftragsverarbeiter
              </h2>
              <p className="mb-2">
                Zur Verarbeitung Ihrer Daten setzen wir folgende Dienstleister ein,
                mit denen jeweils ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO)
                besteht:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Resend</strong> (Resend, Inc., USA) — Versand der
                  Analyse-E-Mail.
                </li>
                <li>
                  <strong>Notion</strong> (Notion Labs, Inc., USA) — Speicherung der
                  Lead-Daten.
                </li>
                <li>
                  <strong>Vercel</strong> (Vercel Inc., USA) — Hosting der Website.
                </li>
                <li>
                  <strong>Calendly</strong> (Calendly LLC, USA) — Terminbuchung nach
                  der Analyse (nur bei Klick auf den entsprechenden Button).
                </li>
              </ul>
              <p className="mt-2">
                Die Übermittlung in Drittländer (USA) erfolgt auf Grundlage der
                EU-Standardvertragsklauseln bzw. des EU-US Data Privacy Framework.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                5. Ihre Rechte
              </h2>
              <p className="mb-2">
                Ihnen stehen gegenüber uns folgende Rechte hinsichtlich Ihrer
                personenbezogenen Daten zu:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
                <li>
                  Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3
                  DSGVO)
                </li>
                <li>
                  Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)
                </li>
              </ul>
              <p className="mt-2">
                Zur Ausübung Ihrer Rechte wenden Sie sich an die im Impressum
                genannte E-Mail-Adresse.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                6. Server-Logs
              </h2>
              <p>
                Beim Aufruf der Website werden durch den Hosting-Provider technisch
                notwendige Daten (u. a. IP-Adresse, Zeitpunkt, User-Agent) in
                Server-Logs verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
                DSGVO (berechtigtes Interesse an Betrieb und Sicherheit der
                Website).
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                7. Keine Weitergabe an Dritte
              </h2>
              <p>
                Eine Weitergabe Ihrer Daten an Dritte außerhalb der oben genannten
                Auftragsverarbeiter erfolgt nicht, es sei denn, Sie haben
                ausdrücklich eingewilligt oder wir sind gesetzlich dazu
                verpflichtet.
              </p>
            </section>

            <p className="text-xs pt-4 border-t" style={{ color: "#A1A1AA", borderColor: "#E9E5F5" }}>
              Dies ist eine Vorlage. Bitte alle Platzhalter in eckigen Klammern
              durch Ihre tatsächlichen Angaben ersetzen. Für die
              Rechtssicherheit empfiehlt sich eine Prüfung durch einen
              Rechtsanwalt oder Datenschutzbeauftragten.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
