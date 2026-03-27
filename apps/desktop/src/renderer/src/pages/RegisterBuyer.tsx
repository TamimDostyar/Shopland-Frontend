import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerBuyer, ApiError, type BuyerRegistrationData } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import StepForm from "../components/forms/StepForm";
import Input from "../components/ui/Input";
import ImageUpload from "../components/forms/ImageUpload";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

type FormState = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  father_name: string;
  phone_number: string;
  date_of_birth: string;
  profile_photo: File | null;
  address_label: string;
  address_full_name: string;
  address_phone_number: string;
  address_street: string;
  address_district: string;
  address_city: string;
  address_province: string;
  address_nearby_landmark: string;
};

const INITIAL: FormState = {
  email: "", password: "", confirm_password: "",
  first_name: "", last_name: "", father_name: "",
  phone_number: "", date_of_birth: "",
  profile_photo: null,
  address_label: "Home", address_full_name: "", address_phone_number: "",
  address_street: "", address_district: "", address_city: "", address_province: "",
  address_nearby_landmark: "",
};

export default function RegisterBuyer() {
  const { t, locale } = useLanguage();
  const steps = useMemo(
    () => [
      t("reg.step_personal"),
      t("reg.step_identity"),
      t("reg.step_address"),
      t("reg.step_review"),
    ],
    [locale, t],
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setTokensAndUser } = useAuth();
  const navigate = useNavigate();

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (step === 0) {
      if (!form.first_name) e.first_name = t("reg.error_required");
      if (!form.last_name) e.last_name = t("reg.error_required");
      if (!form.father_name) e.father_name = t("reg.error_required");
      if (!form.email) e.email = t("reg.error_required");
      if (!form.phone_number) e.phone_number = t("reg.error_required");
      if (!form.date_of_birth) e.date_of_birth = t("reg.error_required");
      if (!form.password) e.password = t("reg.error_required");
      if (form.password !== form.confirm_password)
        e.confirm_password = t("reg.error_password_match");
    }
    if (step === 1) {
      if (!form.profile_photo) e.profile_photo = t("reg.error_required");
    }
    if (step === 2) {
      if (!form.address_label) e.address_label = t("reg.error_required");
      if (!form.address_full_name) e.address_full_name = t("reg.error_required");
      if (!form.address_phone_number) e.address_phone_number = t("reg.error_required");
      if (!form.address_street) e.address_street = t("reg.error_required");
      if (!form.address_district) e.address_district = t("reg.error_required");
      if (!form.address_city) e.address_city = t("reg.error_required");
      if (!form.address_province) e.address_province = t("reg.error_required");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep()) setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!form.profile_photo) return;
    setApiError("");
    setSubmitting(true);
    try {
      const data = form as BuyerRegistrationData;
      const res = await registerBuyer(data);
      await setTokensAndUser(res.access, res.refresh, res.user);
      navigate("/verify-phone", { state: { phone_number: form.phone_number } });
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : t("reg.error_failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title={t("reg.buyer_title")} subtitle={t("reg.buyer_subtitle")}>
      <StepForm
        steps={steps}
        currentStep={step}
        onNext={handleNext}
        onBack={() => setStep((s) => s - 1)}
        onSubmit={() => { void handleSubmit(); }}
        submitting={submitting}
      >
        {apiError && <Alert kind="error">{apiError}</Alert>}

        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t("reg.first_name")} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} error={errors.first_name} required />
              <Input label={t("reg.last_name")} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} error={errors.last_name} required />
            </div>
            <Input label={t("profile.fathers_name")} value={form.father_name} onChange={(e) => set("father_name", e.target.value)} error={errors.father_name} required />
            <Input label={t("reg.email")} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" required />
            <Input label={t("reg.phone")} type="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} error={errors.phone_number} required />
            <Input label={t("reg.dob")} type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} error={errors.date_of_birth} required />
            <Input label={t("reg.password")} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} autoComplete="new-password" required />
            <Input label={t("reg.confirm_password")} type="password" value={form.confirm_password} onChange={(e) => set("confirm_password", e.target.value)} error={errors.confirm_password} autoComplete="new-password" required />
          </>
        )}

        {step === 1 && (
          <>
            <ImageUpload label={t("reg.profile_photo")} onChange={(f) => set("profile_photo", f)} error={errors.profile_photo} />
          </>
        )}

        {step === 2 && (
          <>
            <Input label={t("reg.address_label")} value={form.address_label} onChange={(e) => set("address_label", e.target.value)} error={errors.address_label} required />
            <Input label={t("reg.full_name_address")} value={form.address_full_name} onChange={(e) => set("address_full_name", e.target.value)} error={errors.address_full_name} required />
            <Input label={t("reg.phone_address")} value={form.address_phone_number} onChange={(e) => set("address_phone_number", e.target.value)} error={errors.address_phone_number} required />
            <Input label={t("reg.street")} value={form.address_street} onChange={(e) => set("address_street", e.target.value)} error={errors.address_street} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label={t("reg.district")} value={form.address_district} onChange={(e) => set("address_district", e.target.value)} error={errors.address_district} required />
              <Input label={t("reg.city")} value={form.address_city} onChange={(e) => set("address_city", e.target.value)} error={errors.address_city} required />
            </div>
            <Input label={t("reg.province")} value={form.address_province} onChange={(e) => set("address_province", e.target.value)} error={errors.address_province} required />
            <Input label={t("reg.landmark")} value={form.address_nearby_landmark} onChange={(e) => set("address_nearby_landmark", e.target.value)} />
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-2 text-sm text-text">
            <p className="text-muted mb-2">{t("reg.review_prompt_buyer")}</p>
            <div className="bg-surface rounded-xl p-4 flex flex-col gap-1.5 border border-border">
              <Row label={t("reg.review_name")} value={`${form.first_name} ${form.last_name}`} />
              <Row label={t("reg.review_email")} value={form.email} />
              <Row label={t("reg.review_phone")} value={form.phone_number} />
              <Row label={t("reg.review_address")} value={`${form.address_city}, ${form.address_province}`} />
            </div>
          </div>
        )}
      </StepForm>
    </AuthLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="text-heading font-medium text-right">{value}</span>
    </div>
  );
}
