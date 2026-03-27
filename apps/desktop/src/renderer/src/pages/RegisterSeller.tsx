import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller, ApiError, type SellerRegistrationData } from "@shopland/shared";
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
  national_id: string;
  national_id_photo: File | null;
  profile_photo: File | null;
  shop_name: string;
  shop_category: string;
  business_description: string;
  business_phone: string;
  business_license_no: string;
  business_license_photo: File | null;
  shop_address_street: string;
  shop_address_district: string;
  shop_address_city: string;
  shop_address_province: string;
};

const INITIAL: FormState = {
  email: "", password: "", confirm_password: "",
  first_name: "", last_name: "", father_name: "",
  phone_number: "", date_of_birth: "",
  national_id: "", national_id_photo: null, profile_photo: null,
  shop_name: "", shop_category: "", business_description: "",
  business_phone: "", business_license_no: "", business_license_photo: null,
  shop_address_street: "", shop_address_district: "",
  shop_address_city: "", shop_address_province: "",
};

export default function RegisterSeller() {
  const { t, locale } = useLanguage();
  const steps = useMemo(
    () => [
      t("reg.step_personal"),
      t("reg.step_identity"),
      t("reg.step_shop_info"),
      t("reg.step_shop_address"),
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
      if (!form.national_id) e.national_id = t("reg.error_required");
      if (!form.national_id_photo) e.national_id_photo = t("reg.error_required");
      if (!form.profile_photo) e.profile_photo = t("reg.error_required");
    }
    if (step === 2) {
      if (!form.shop_name) e.shop_name = t("reg.error_required");
      if (!form.shop_category) e.shop_category = t("reg.error_required");
      if (!form.business_phone) e.business_phone = t("reg.error_required");
      if (!form.business_license_no) e.business_license_no = t("reg.error_required");
      if (!form.business_license_photo) e.business_license_photo = t("reg.error_required");
    }
    if (step === 3) {
      if (!form.shop_address_street) e.shop_address_street = t("reg.error_required");
      if (!form.shop_address_district) e.shop_address_district = t("reg.error_required");
      if (!form.shop_address_city) e.shop_address_city = t("reg.error_required");
      if (!form.shop_address_province) e.shop_address_province = t("reg.error_required");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep()) setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!form.national_id_photo || !form.profile_photo || !form.business_license_photo) return;
    setApiError("");
    setSubmitting(true);
    try {
      const data = form as SellerRegistrationData;
      const res = await registerSeller(data);
      await setTokensAndUser(res.access, res.refresh, res.user);
      navigate("/verify-phone", { state: { phone_number: form.phone_number } });
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : t("reg.error_failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title={t("reg.seller_title")} subtitle={t("reg.seller_subtitle")}>
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
            <Input label={t("reg.national_id_number")} value={form.national_id} onChange={(e) => set("national_id", e.target.value)} error={errors.national_id} required />
            <ImageUpload label={t("reg.national_id_photo_label")} onChange={(f) => set("national_id_photo", f)} error={errors.national_id_photo} />
            <ImageUpload label={t("reg.profile_photo")} onChange={(f) => set("profile_photo", f)} error={errors.profile_photo} />
          </>
        )}

        {step === 2 && (
          <>
            <Input label={t("reg.shop_name")} value={form.shop_name} onChange={(e) => set("shop_name", e.target.value)} error={errors.shop_name} required />
            <Input label={t("reg.shop_category_required")} value={form.shop_category} onChange={(e) => set("shop_category", e.target.value)} error={errors.shop_category} required />
            <Input label={t("reg.shop_desc")} value={form.business_description} onChange={(e) => set("business_description", e.target.value)} />
            <Input label={t("reg.business_phone")} type="tel" value={form.business_phone} onChange={(e) => set("business_phone", e.target.value)} error={errors.business_phone} required />
            <Input label={t("reg.business_license_number")} value={form.business_license_no} onChange={(e) => set("business_license_no", e.target.value)} error={errors.business_license_no} required />
            <ImageUpload label={t("reg.business_license_photo")} onChange={(f) => set("business_license_photo", f)} error={errors.business_license_photo} />
          </>
        )}

        {step === 3 && (
          <>
            <Input label={t("reg.street")} value={form.shop_address_street} onChange={(e) => set("shop_address_street", e.target.value)} error={errors.shop_address_street} required />
            <Input label={t("reg.district")} value={form.shop_address_district} onChange={(e) => set("shop_address_district", e.target.value)} error={errors.shop_address_district} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label={t("reg.city")} value={form.shop_address_city} onChange={(e) => set("shop_address_city", e.target.value)} error={errors.shop_address_city} required />
              <Input label={t("reg.province")} value={form.shop_address_province} onChange={(e) => set("shop_address_province", e.target.value)} error={errors.shop_address_province} required />
            </div>
          </>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-2 text-sm text-text">
            <p className="text-muted mb-2">{t("reg.review_prompt_seller")}</p>
            <div className="bg-surface rounded-xl p-4 flex flex-col gap-1.5 border border-border">
              <Row label={t("reg.review_name")} value={`${form.first_name} ${form.last_name}`} />
              <Row label={t("reg.review_email")} value={form.email} />
              <Row label={t("reg.review_phone")} value={form.phone_number} />
              <Row label={t("reg.review_shop")} value={form.shop_name} />
              <Row label={t("reg.review_category")} value={form.shop_category} />
              <Row label={t("reg.review_city")} value={form.shop_address_city} />
            </div>
            <Alert kind="info" className="mt-2">
              {t("reg.review_seller_note")}
            </Alert>
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
