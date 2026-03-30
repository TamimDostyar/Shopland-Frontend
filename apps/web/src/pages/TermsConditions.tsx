import type { TranslationKey } from "@amazebid/shared";
import MainLayout from "../components/layout/MainLayout";
import { useLanguage } from "../context/LanguageContext";

const TERMS_SECTIONS: { title: TranslationKey; paragraphs: TranslationKey[] }[] = [
  { title: "legal.terms_s1_title", paragraphs: ["legal.terms_s1_p1"] },
  {
    title: "legal.terms_s2_title",
    paragraphs: ["legal.terms_s2_p1", "legal.terms_s2_p2"],
  },
  {
    title: "legal.terms_s3_title",
    paragraphs: ["legal.terms_s3_p1", "legal.terms_s3_p2"],
  },
  {
    title: "legal.terms_s4_title",
    paragraphs: ["legal.terms_s4_p1", "legal.terms_s4_p2"],
  },
  {
    title: "legal.terms_s5_title",
    paragraphs: ["legal.terms_s5_p1", "legal.terms_s5_p2"],
  },
  {
    title: "legal.terms_s6_title",
    paragraphs: ["legal.terms_s6_p1", "legal.terms_s6_p2"],
  },
  { title: "legal.terms_s7_title", paragraphs: ["legal.terms_s7_p1"] },
  {
    title: "legal.terms_s8_title",
    paragraphs: ["legal.terms_s8_p1", "legal.terms_s8_p2"],
  },
];

export default function TermsConditions() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_24px_64px_rgba(23,32,51,0.08)] sm:p-8">
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#edf7ff,#fff2e7)] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
              {t("legal.label")}
            </div>
            <h1
              className="mt-2 text-3xl font-bold text-[color:var(--text-h)] sm:text-4xl"
              style={{ fontFamily: "var(--heading)" }}
            >
              {t("legal.terms_title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--text-soft)] sm:text-base">
              {t("legal.terms_subtitle")}
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {TERMS_SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-[color:var(--text-h)]">{t(section.title)}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[color:var(--text)] sm:text-[15px]">
                  {section.paragraphs.map((key) => (
                    <p key={key}>{t(key)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
