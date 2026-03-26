import MainLayout from "../components/layout/MainLayout";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect the information you provide when you create an account, place an order, open a seller profile, contact support, or complete verification steps. This may include your name, email address, phone number, delivery address, shop details, payment-related references, and identity records required for platform safety.",
      "We also collect technical and usage information such as device details, browser data, IP address, session activity, and marketplace interactions so we can operate, secure, and improve Shopland.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use personal data to create and manage accounts, authenticate logins, process orders, support deliveries, communicate about purchases, review seller applications, prevent fraud, enforce marketplace rules, and comply with legal obligations.",
      "Where safety, fraud prevention, or emergency response requires it, we may use account and verification data to confirm who you are, protect users, investigate harmful activity, or assist lawful authorities when legally required.",
    ],
  },
  {
    title: "Emergency and Safety Use",
    body: [
      "If we reasonably believe there is an emergency involving risk of harm, fraud, abuse, or a serious safety issue, Shopland may use the identity and contact information connected to your account to verify your identity, contact you, or support protective action.",
      "This emergency and safety use is limited to protecting people, the platform, and lawful investigations. It is not a permission to use your data for unrelated commercial profiling.",
    ],
  },
  {
    title: "What We Do Not Do",
    body: [
      "We do not sell your personal data to third parties.",
      "We do not use your personal data, identity documents, or account content to train general-purpose artificial intelligence models or unrelated software-training systems.",
    ],
  },
  {
    title: "Sharing of Information",
    body: [
      "We share information only when needed to run the marketplace, such as with payment, delivery, hosting, verification, analytics, or customer-support providers acting on our instructions, or with buyers and sellers as needed to complete a transaction.",
      "We may also disclose information when required by law, court order, lawful request, or when necessary to protect rights, safety, and marketplace integrity.",
    ],
  },
  {
    title: "Data Retention and Security",
    body: [
      "We keep personal data only for as long as reasonably necessary to provide services, maintain records, resolve disputes, enforce agreements, meet legal requirements, and investigate security or fraud issues.",
      "We use reasonable administrative, technical, and organizational safeguards, but no method of storage or transmission is completely secure.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may request updates or corrections to inaccurate account information. You may also contact Shopland regarding account closure or privacy questions, subject to any recordkeeping or legal obligations that require us to retain certain information.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_24px_64px_rgba(23,32,51,0.08)] sm:p-8">
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fff4ec,#eef5ff)] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Legal
            </div>
            <h1
              className="mt-2 text-3xl font-bold text-[color:var(--text-h)] sm:text-4xl"
              style={{ fontFamily: "var(--heading)" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--text-soft)] sm:text-base">
              This policy explains how Shopland collects, uses, shares, and protects personal information across account registration, login, buying, selling, verification, and customer support.
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
