import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "#E9E5F5", background: "#FAFAFE" }}
    >
      <div className="max-w-2xl mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span style={{ color: "#A1A1AA" }}>
          © {new Date().getFullYear()} Potenzialanalyse
        </span>
        <nav className="flex gap-5">
          <Link
            href="/kontakt"
            className="hover:underline"
            style={{ color: "#52525B" }}
          >
            Kontakt
          </Link>
          <Link
            href="/impressum"
            className="hover:underline"
            style={{ color: "#52525B" }}
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="hover:underline"
            style={{ color: "#52525B" }}
          >
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
