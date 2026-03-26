import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerBuyer, ApiError, type BuyerRegistrationData } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import StepForm from "../components/forms/StepForm";
import Input from "../components/ui/Input";
import ImageUpload from "../components/forms/ImageUpload";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

const STEPS = ["Personal", "Identity", "Address", "Review"];

type FormState = {
  // Step 1
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  father_name: string;
  phone_number: string;
  date_of_birth: string;
  // Step 2
  national_id: string;
  national_id_photo: File | null;
  profile_photo: File | null;
  // Step 3 — names match backend serializer
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
  national_id: "", national_id_photo: null, profile_photo: null,
  address_label: "Home", address_full_name: "", address_phone_number: "",
  address_street: "", address_district: "", address_city: "", address_province: "",
  address_nearby_landmark: "",
};

export default function RegisterBuyer() {
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
      if (!form.father_name) e.father_name = "Required";
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
      if (!form.address_label) e.address_label = "Required";
      if (!form.address_full_name) e.address_full_name = "Required";
      if (!form.address_phone_number) e.address_phone_number = "Required";
      if (!form.address_street) e.address_street = "Required";
      if (!form.address_district) e.address_district = "Required";
      if (!form.address_city) e.address_city = "Required";
      if (!form.address_province) e.address_province = "Required";
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
      const data = form as BuyerRegistrationData;
      const res = await registerBuyer(data);
      await setTokensAndUser(res.access, res.refresh, res.user);
      navigate("/verify-phone", { state: { phone_number: form.phone_number } });
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Buyer Registration" subtitle="Step by step — takes about 2 minutes" backTo="/login" backLabel="Back to Login">
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
            <Input label="Father's name" value={form.father_name} onChange={(e) => set("father_name", e.target.value)} error={errors.father_name} required />
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
            <Input label="Address label (e.g. Home)" value={form.address_label} onChange={(e) => set("address_label", e.target.value)} error={errors.address_label} required />
            <Input label="Full name on address" value={form.address_full_name} onChange={(e) => set("address_full_name", e.target.value)} error={errors.address_full_name} required />
            <Input label="Phone number for address" value={form.address_phone_number} onChange={(e) => set("address_phone_number", e.target.value)} error={errors.address_phone_number} required />
            <Input label="Street address" value={form.address_street} onChange={(e) => set("address_street", e.target.value)} error={errors.address_street} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="District" value={form.address_district} onChange={(e) => set("address_district", e.target.value)} error={errors.address_district} required />
              <Input label="City" value={form.address_city} onChange={(e) => set("address_city", e.target.value)} error={errors.address_city} required />
            </div>
            <Input label="Province" value={form.address_province} onChange={(e) => set("address_province", e.target.value)} error={errors.address_province} required />
            <Input label="Nearby landmark (optional)" value={form.address_nearby_landmark} onChange={(e) => set("address_nearby_landmark", e.target.value)} />
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-2 text-sm text-text">
            <p className="text-muted mb-2">Please review your information before submitting.</p>
            <div className="bg-surface rounded-xl p-4 flex flex-col gap-1.5 border border-border">
              <Row label="Name" value={`${form.first_name} ${form.last_name}`} />
              <Row label="Email" value={form.email} />
              <Row label="Phone" value={form.phone_number} />
              <Row label="National ID" value={form.national_id} />
              <Row label="Address" value={`${form.address_city}, ${form.address_province}`} />
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
