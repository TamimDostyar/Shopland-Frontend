import type { ComingSoonContent, Locale } from "../types";

const en: ComingSoonContent = {
  badge: "Coming soon",
  title: "Afghanistan's online marketplace.",
  subtitle:
    "Amazebid connects local sellers with buyers across the country — with cash on delivery, fast shipping, and easy returns.",
  goals: [
    { title: "Empower local sellers", detail: "Give every shop a nationwide storefront." },
    { title: "Cash on delivery", detail: "Pay the driver when your order arrives." },
    { title: "Quick returns", detail: "Simple, fast returns if something isn't right." },
  ],
  formTitle: "Get notified when we launch",
  namePlaceholder: "Your name",
  usernamePlaceholder: "Your email",
  ctaLabel: "Join waitlist",
  privacyNote: "No spam. Only launch updates.",
  successMessage: "You're added on the list. We'll let you know when Amazebid goes live.",
  duplicateMessage: "You're already on the list — we'll keep you posted.",
  errorMessage: "Something went wrong. Please try again.",
  footerEmail: "a.tamimdostyar@gmail.com",
};

const fa: ComingSoonContent = {
  badge: "به زودی",
  title: "بازار آنلاین افغانستان.",
  subtitle:
    "شاپلند فروشندگان محلی را با خریداران در سراسر کشور وصل می‌کند — با پرداخت نقدی هنگام تحویل، ارسال سریع و بازگشت آسان.",
  goals: [
    { title: "توانمندسازی فروشندگان محلی", detail: "به هر دکان یک ویترین سراسری بدهید." },
    { title: "پرداخت نقدی هنگام تحویل", detail: "وقتی سفارش تان رسید، به راننده پرداخت کنید." },
    { title: "بازگشت سریع", detail: "اگر مشکلی بود، بازگشت ساده و سریع." },
  ],
  formTitle: "وقتی شروع کنیم خبرتان می‌کنیم",
  namePlaceholder: "نام شما",
  usernamePlaceholder: "ایمیل شما",
  ctaLabel: "عضویت در لیست انتظار",
  privacyNote: "بدون اسپم. فقط اخبار راه‌اندازی.",
  successMessage: "شما در لیست اضافه شدید. وقتی شاپلند فعال شد خبرتان می‌کنیم.",
  duplicateMessage: "شما قبلاً در لیست هستید — در جریان نگه‌تان می‌داریم.",
  errorMessage: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  footerEmail: "a.tamimdostyar@gmail.com",
};

const ps: ComingSoonContent = {
  badge: "ډیر ژر",
  title: "د افغانستان آنلاین بازار.",
  subtitle:
    "شاپلند محلي پلورونکي د ټول هیواد پیرودونکو سره نښلوي — د نغدو پیسو سره تحویلي، ګړندی لیږل او اسانه بیرته ورکول.",
  goals: [
    { title: "محلي پلورونکي پیاوړي کړئ", detail: "هرې دوکان ته ټول هیواد ته ویترین ورکړئ." },
    { title: "د تحویلي پر مهال تادیه", detail: "کله چې سپارښت تاسو ته ورسیږي، ډرایور ته تادیه وکړئ." },
    { title: "ګړندی بیرته ورکول", detail: "که ستونزه وي، ساده او ګړندی بیرته ورکول." },
  ],
  formTitle: "کله چې پیل وکړو تاسو ته خبر ورکوو",
  namePlaceholder: "ستاسو نوم",
  usernamePlaceholder: "ستاسو ایمیل",
  ctaLabel: "د انتظار لیست کې ګډون",
  privacyNote: "سپم نشته. یوازې د پیل خبرونه.",
  successMessage: "تاسو لیست ته اضافه شوئ. کله چې شاپلند فعال شي، موږ به خبر درکړو.",
  duplicateMessage: "تاسو مخکې له مخکې په لیست کې یاست — مو خبروو.",
  errorMessage: "یوه ستونزه رامنځته شوه. مهرباني وکړئ بیا هڅه وکړئ.",
  footerEmail: "a.tamimdostyar@gmail.com",
};

export const COMING_SOON: Record<Locale, ComingSoonContent> = { en, fa, ps };

export const COMING_SOON_FALLBACK: ComingSoonContent = en;
