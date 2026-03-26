import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller, ApiError, type SellerRegistrationData } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import StepForm from "../components/forms/StepForm";
import Input from "../components/ui/Input";
import ImageUpload from "../components/forms/ImageUpload";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

const STEPS = ["Personal", "Identity", "Shop Info", "Shop Address", "Review"];

type FormState = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  national_id: string;
  national_id_photo: File | null;
  profile_photo: File | null;
  shop_name: string;
  shop_category: string;
  business_description: string;
  business_phone: string;
  shop_address_street: string;
  shop_address_district: string;
  shop_address_city: string;
  shop_address_province: string;
};

const INITIAL: FormState = {
  email: "", password: "", confirm_password: "",
  first_name: "", last_name: "",
  phone_number: "", date_of_birth: "",
  national_id: "", national_id_photo: null, profile_photo: null,
  shop_name: "", shop_category: "", business_description: "",
  business_phone: "",
  shop_address_street: "", shop_address_district: "",
  shop_address_city: "", shop_address_province: "",
};

export default function RegisterSeller() {
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
      if (!form.first_name) e.first_name = "Required";
      if (!form.last_name) e.last_name = "Required";
      if (!form.email) e.email = "Required";
      if (!form.phone_number) e.phone_number = "Required";
      if (!form.date_of_birth) e.date_of_birth = "Required";
      if (!form.password) e.password = "Required";
      if (form.password !== form.confirm_password)
        e.confirm_password = "Passwords do not match";
    }
    if (step === 1) {
      if (!form.national_id) e.national_id = "Required";
      if (!form.national_id_photo) e.national_id_photo = "Required";
      if (!form.profile_photo) e.profile_photo = "Required";
    }
    if (step === 2) {
      if (!form.shop_name) e.shop_name = "Required";
      if (!form.business_phone) e.business_phone = "Required";
    }
    if (step === 3) {
      if (!form.shop_address_street) e.shop_address_street = "Required";
      if (!form.shop_address_district) e.shop_address_district = "Required";
      if (!form.shop_address_city) e.shop_address_city = "Required";
      if (!form.shop_address_province) e.shop_address_province = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep()) setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!form.national_id_photo || !form.profile_photo) return;
    setApiError("");
    setSubmitting(true);
    try {
      const data = form as SellerRegistrationData;
      const res = await registerSeller(data);
      await setTokensAndUser(res.access, res.refresh, res.user);
      navigate("/verify-telegram", { state: { phone_number: form.phone_number } });
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Seller Registration" subtitle="Open your shop on Shopland" backTo="/login" backLabel="Back to Login">
      <StepForm
        steps={STEPS}
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
              <Input label="First name" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} error={errors.first_name} required />
              <Input label="Last name" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} error={errors.last_name} required />
            </div>
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" required />
            <Input label="Phone number" type="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} error={errors.phone_number} required />
            <Input label="Date of birth" type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} error={errors.date_of_birth} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} autoComplete="new-password" required />
            <Input label="Confirm password" type="password" value={form.confirm_password} onChange={(e) => set("confirm_password", e.target.value)} error={errors.confirm_password} autoComplete="new-password" required />
          </>
        )}

        {step === 1 && (
          <>
            <Input label="National ID number" value={form.national_id} onChange={(e) => set("national_id", e.target.value)} error={errors.national_id} required />
            <ImageUpload label="National ID photo" onChange={(f) => set("national_id_photo", f)} error={errors.national_id_photo} />
            <ImageUpload label="Profile photo (selfie)" onChange={(f) => set("profile_photo", f)} error={errors.profile_photo} />
          </>
        )}

        {step === 2 && (
          <>
            <Input label="Shop name" value={form.shop_name} onChange={(e) => set("shop_name", e.target.value)} error={errors.shop_name} required />
            <Input label="Shop category (optional)" value={form.shop_category} onChange={(e) => set("shop_category", e.target.value)} error={errors.shop_category} placeholder="Any" />
            <Input label="Business description (optional)" value={form.business_description} onChange={(e) => set("business_description", e.target.value)} />
            <Input label="Business phone" type="tel" value={form.business_phone} onChange={(e) => set("business_phone", e.target.value)} error={errors.business_phone} required />
          </>
        )}

        {step === 3 && (
          <>
            <Input label="Street address" value={form.shop_address_street} onChange={(e) => set("shop_address_street", e.target.value)} error={errors.shop_address_street} required />
            <Input label="District" value={form.shop_address_district} onChange={(e) => set("shop_address_district", e.target.value)} error={errors.shop_address_district} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={form.shop_address_city} onChange={(e) => set("shop_address_city", e.target.value)} error={errors.shop_address_city} required />
              <Input label="Province" value={form.shop_address_province} onChange={(e) => set("shop_address_province", e.target.value)} error={errors.shop_address_province} required />
            </div>
          </>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-2 text-sm text-text">
            <p className="text-muted mb-2">Review your information before submitting.</p>
            <div className="bg-surface rounded-xl p-4 flex flex-col gap-1.5 border border-border">
              <Row label="Name" value={`${form.first_name} ${form.last_name}`} />
              <Row label="Email" value={form.email} />
              <Row label="Phone" value={form.phone_number} />
              <Row label="Shop" value={form.shop_name} />
              <Row label="Category" value={form.shop_category || "Any"} />
              <Row label="City" value={form.shop_address_city} />
            </div>
            <Alert kind="info" className="mt-2">
              Your seller account will be reviewed by our team before it is approved.
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
