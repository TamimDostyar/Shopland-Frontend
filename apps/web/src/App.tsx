import { useState } from "react";
import type { FormEvent } from "react";
import type { Locale } from "@shopland/shared";
import {
  APP_NAME,
  COMING_SOON,
  DEFAULT_LOCALE,
  LOCALES,
  joinWaitlist,
} from "@shopland/shared";
import "./App.css";

type SubmitState = "idle" | "loading" | "success" | "duplicate" | "error";

export default function App() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const content = COMING_SOON[locale];
  const dir = LOCALES[locale].dir;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    void submitWaitlist(event);
  }

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setSubmitState("loading");

    try {
      const data = await joinWaitlist(trimmed);
      setSubmitState(data.already_joined ? "duplicate" : "success");
      setEmail("");
    } catch {
      setSubmitState("error");
    }
  }

  const feedback =
    submitState === "success"
      ? content.successMessage
      : submitState === "duplicate"
        ? content.duplicateMessage
        : submitState === "error"
          ? content.errorMessage
          : null;

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

          <nav className="lang-switcher" aria-label="Language">
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

          <form className="waitlist" onSubmit={handleSubmit}>
            <p className="waitlist-title">{content.formTitle}</p>

            <div className="input-row">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitState !== "idle") setSubmitState("idle");
                }}
                placeholder={content.emailPlaceholder}
                autoComplete="email"
                required
                disabled={submitState === "loading"}
              />
              <button
                type="submit"
                className="cta"
                disabled={submitState === "loading"}
              >
                {submitState === "loading" ? "..." : content.ctaLabel}
              </button>
            </div>

            <p className="note">{content.privacyNote}</p>

            {feedback && (
              <p
                className={
                  submitState === "error" ? "feedback err" : "feedback ok"
                }
                role="status"
              >
                {feedback}
              </p>
            )}
          </form>
        </main>

        <footer className="bottom">
          <a href={`mailto:${content.footerEmail}`}>{content.footerEmail}</a>
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
        </footer>
      </div>
    </div>
  );
}
