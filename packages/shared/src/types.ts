export type Platform = "web" | "desktop" | "ios" | "android";

export type Locale = "en" | "fa" | "ps";

export type LocaleMeta = {
  label: string;
  dir: "ltr" | "rtl";
};

export type GoalItem = {
  title: string;
  detail: string;
};

export type ComingSoonContent = {
  badge: string;
  title: string;
  subtitle: string;
  goals: GoalItem[];
  formTitle: string;
  namePlaceholder: string;
  usernamePlaceholder: string;
  ctaLabel: string;
  privacyNote: string;
  successMessage: string;
  duplicateMessage: string;
  errorMessage: string;
  footerEmail: string;
};

export type WaitlistResponse = {
  detail: string;
  already_joined: boolean;
};
