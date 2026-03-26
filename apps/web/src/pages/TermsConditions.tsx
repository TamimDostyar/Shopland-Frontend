import MainLayout from "../components/layout/MainLayout";

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing, registering for, or using Shopland, you agree to these Terms & Conditions and the Shopland Privacy Policy. If you do not agree, you must not use the platform.",
    ],
  },
  {
    title: "Eligibility and Account Accuracy",
    body: [
      "You must provide accurate, current, and complete information when creating or maintaining an account. You are responsible for protecting your login credentials and for activity carried out through your account.",
      "Shopland may request verification information where reasonably necessary to confirm identity, reduce fraud, protect users, or satisfy legal and marketplace requirements.",
    ],
  },
  {
    title: "Marketplace Use",
    body: [
      "Buyers may use the platform to browse, order, and communicate regarding products and deliveries. Sellers may list and sell products only if those listings are lawful, accurate, and consistent with marketplace standards.",
      "You must not use Shopland for fraud, impersonation, unlawful trade, abusive conduct, interference with the platform, or any activity that harms users, Shopland, or third parties.",
    ],
  },
  {
    title: "Orders, Pricing, and Fulfillment",
    body: [
      "Product availability, pricing, and fulfillment are subject to seller inventory, operational limits, and marketplace review. Shopland may cancel, suspend, or investigate transactions that appear inaccurate, fraudulent, unsafe, or unlawful.",
      "Delivery times, seller performance, and third-party service availability may vary. Shopland may facilitate orders and support, but marketplace transactions can involve independent seller responsibility.",
    ],
  },
  {
    title: "Emergency, Safety, and Verification",
    body: [
      "Where Shopland reasonably believes an account, transaction, or user activity creates a safety issue, emergency risk, fraud concern, or serious policy violation, we may use account and verification data to identify the person involved, contact affected users, restrict access, or support lawful protective action.",
      "You agree that Shopland may take proportionate action to protect people, property, platform integrity, and legal compliance.",
    ],
  },
  {
    title: "Data Use Restriction",
    body: [
      "Shopland uses personal information to operate the marketplace, verify identities, process transactions, provide support, enforce these terms, and meet legal obligations.",
      "Shopland does not sell your personal data and does not use your personal data for unrelated software-training purposes or to train general-purpose AI systems.",
    ],
  },
  {
    title: "Suspension and Termination",
    body: [
      "Shopland may suspend, limit, or terminate access to any account or listing that violates these terms, creates risk, fails verification, or exposes the marketplace or its users to legal or operational harm.",
    ],
  },
  {
    title: "Disclaimers and Liability",
    body: [
      "The platform is provided on an as-available basis. To the maximum extent permitted by applicable law, Shopland disclaims implied warranties and is not liable for indirect, incidental, special, or consequential damages arising from platform use, third-party services, or seller conduct.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded under applicable law.",
    ],
  },
];

export default function TermsConditions() {
  return (
    <MainLayout>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_24px_64px_rgba(23,32,51,0.08)] sm:p-8">
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#edf7ff,#fff2e7)] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Legal
            </div>
            <h1
              className="mt-2 text-3xl font-bold text-[color:var(--text-h)] sm:text-4xl"
              style={{ fontFamily: "var(--heading)" }}
            >
              Terms &amp; Conditions
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--text-soft)] sm:text-base">
              These terms govern the use of Shopland for account registration, login, marketplace participation, buying, selling, and related support services.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-[color:var(--text-h)]">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[color:var(--text)] sm:text-[15px]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
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
