import { Link } from "react-router-dom";
import { APP_NAME, COMING_SOON, LOCALES } from "@amazebid/shared";
import type { Locale } from "@amazebid/shared";
import "../App.css";
import { useLanguage } from "../context/LanguageContext";

export default function Landing() {
  const { locale, setLocale, t, dir } = useLanguage();
  const content = COMING_SOON[locale];
  const localeKeys = Object.keys(LOCALES) as Locale[];

  return (
    <div className="shell">
      <div className="glow glow-1" aria-hidden="true" />
      <div className="glow glow-2" aria-hidden="true" />

      <div className="page" dir={dir}>
        <header className="topbar">
          <div className="topbar-left">
            <span className="logo">{APP_NAME}</span>
            <span className="pill">{content.badge}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              {t("landing.sign_in")}
            </Link>
            <nav className="lang-switcher" aria-label={t("landing.lang_aria")}>
              {localeKeys.map((key) => (
                <button
                  key={key}
                  className={`lang-btn${key === locale ? " active" : ""}`}
                  onClick={() => setLocale(key)}
                  aria-current={key === locale ? "true" : undefined}
                >
                  {LOCALES[key].label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="hero">
          <h1>{content.title}</h1>
          <p className="subtitle">{content.subtitle}</p>

          <ul className="goals">
            {content.goals.map((g) => (
              <li key={g.title}>
                <strong>{g.title}</strong>
                <span className="goal-sep" aria-hidden="true" />
                <span>{g.detail}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mt-8 flex-wrap">
            <Link to="/register" className="cta" style={{ textDecoration: "none", display: "inline-block" }}>
              {t("landing.get_started")}
            </Link>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "0.65rem 1.4rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text)",
                fontSize: "0.9rem",
                fontWeight: 600,
                transition: "border-color 0.2s",
              }}
            >
              {t("landing.sign_in")}
            </Link>
          </div>
        </main>

        <footer className="bottom">
          <a href={`mailto:${content.footerEmail}`}>{content.footerEmail}</a>
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
        </footer>
      </div>
    </div>
  );
}
