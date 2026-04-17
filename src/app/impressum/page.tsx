import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "Impressum — Potenzialanalyse",
  robots: "noindex, nofollow",
};

export default function ImpressumPage() {
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
            Impressum
          </h1>

          <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "#52525B" }}>
            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                Ludovico Moreno Ferrara
                <br />
                Metzstr. 18
                <br />
                44793 Bochum
                <br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Kontakt
              </h2>
              <p>
                E-Mail:{" "}
                <a href="mailto:moreno.who@gmail.com" style={{ color: "#8B5CF6" }} className="hover:underline">
                  moreno.who@gmail.com
                </a>
                <br />
                Kontaktformular:{" "}
                <Link href="/kontakt" style={{ color: "#8B5CF6" }} className="hover:underline">
                  /kontakt
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Umsatzsteuer
              </h2>
              <p>
                Kleinunternehmer gemäß § 19 UStG — keine Umsatzsteuer-Identifikationsnummer vorhanden.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Redaktionell verantwortlich
              </h2>
              <p>
                Ludovico Moreno Ferrara
                <br />
                Anschrift wie oben
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                EU-Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#8B5CF6" }}
                  className="hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                .
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
                vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#1A1A2E" }}>
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
                auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
                §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
                überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>

            <p className="text-xs pt-4 border-t" style={{ color: "#A1A1AA", borderColor: "#E9E5F5" }}>
              Dies ist eine Vorlage. Bitte alle Platzhalter in eckigen Klammern
              durch Ihre tatsächlichen Angaben ersetzen. Für die Rechtssicherheit
              empfiehlt sich eine Prüfung durch einen Rechtsanwalt.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
