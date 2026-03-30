import { useCallback, useEffect, useState } from "react";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  ApiError,
  type Address,
  type TranslationKey,
} from "@amazebid/shared";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

type FormState = Omit<Address, "id" | "is_default">;

const EMPTY_FORM: FormState = {
  label: "",
  full_name: "",
  phone_number: "",
  street_address: "",
  district: "",
  city: "",
  province: "",
  country: "Afghanistan",
  nearby_landmark: "",
};

export default function Addresses() {
  const { t } = useLanguage();
  const { accessToken } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // address id or "new"
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await listAddresses(accessToken);
      setAddresses(data);
    } catch {
      setError(t("addresses.error_load"));
    } finally {
      setLoading(false);
    }
  }, [accessToken, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    setForm(EMPTY_FORM);
    setEditing("new");
    setFormError("");
  }

  function startEdit(addr: Address) {
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      phone_number: addr.phone_number,
      street_address: addr.street_address,
      district: addr.district,
      city: addr.city,
      province: addr.province,
      country: addr.country,
      nearby_landmark: addr.nearby_landmark,
    });
    setEditing(addr.id);
    setFormError("");
  }

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!accessToken) return;
    if (!form.label || !form.full_name || !form.street_address || !form.city || !form.province) {
      setFormError(t("addresses.error_required"));
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editing === "new") {
        const addr = await createAddress(accessToken, form);
        setAddresses((prev) => [...prev, addr]);
      } else if (editing) {
        const addr = await updateAddress(accessToken, editing, form);
        setAddresses((prev) => prev.map((a) => (a.id === editing ? addr : a)));
      }
      setEditing(null);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("addresses.error_save"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(id: string) {
    if (!accessToken) return;
    try {
      const addr = await updateAddress(accessToken, id, { is_default: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: a.id === id ? addr.is_default : false })),
      );
    } catch {
      setError(t("addresses.error_default"));
    }
  }

  async function handleDelete(id: string) {
    if (!accessToken) return;
    if (!confirm(t("addresses.delete_confirm"))) return;
    try {
      await deleteAddress(accessToken, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError(t("addresses.error_delete"));
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BackButton to="/profile" label={t("addresses.back")} className="mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}>
            {t("addresses.title")}
          </h1>
          <Button onClick={startNew} size="sm">
            {t("addresses.add")}
          </Button>
        </div>

        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.length === 0 && !editing && (
              <p className="text-muted text-sm">{t("addresses.empty")}</p>
            )}

            {addresses.map((addr) =>
              editing === addr.id ? (
                <AddressForm
                  key={addr.id}
                  form={form}
                  set={set}
                  onSave={() => { void handleSave(); }}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                  error={formError}
                  t={t}
                />
              ) : (
                <div
                  key={addr.id}
                  className="bg-surface border border-border rounded-xl p-4 flex justify-between items-start gap-4"
                >
                  <div className="flex flex-col gap-0.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-heading">{addr.label}</span>
                      {addr.is_default && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                          {t("addresses.default_badge")}
                        </span>
                      )}
                    </div>
                    <span className="text-text">{addr.full_name}</span>
                    <span className="text-muted">{addr.street_address}</span>
                    <span className="text-muted">
                      {addr.district}, {addr.city}, {addr.province}
                    </span>
                    <span className="text-muted">{addr.phone_number}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(addr)}>
                      {t("addresses.edit")}
                    </Button>
                    {!addr.is_default && (
                      <Button size="sm" variant="ghost" onClick={() => { void handleSetDefault(addr.id); }}>
                        {t("addresses.set_default")}
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => { void handleDelete(addr.id); }}>
                      {t("addresses.delete")}
                    </Button>
                  </div>
                </div>
              ),
            )}

            {editing === "new" && (
              <AddressForm
                form={form}
                set={set}
                onSave={() => { void handleSave(); }}
                onCancel={() => setEditing(null)}
                saving={saving}
                error={formError}
                t={t}
              />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function AddressForm({
  form,
  set,
  onSave,
  onCancel,
  saving,
  error,
  t,
}: {
  form: FormState;
  set: (key: keyof FormState, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div className="bg-surface border border-accent/30 rounded-xl p-4 flex flex-col gap-3">
      {error && <Alert kind="error">{error}</Alert>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t("addresses.label")}
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder={t("addresses.label_placeholder")}
          required
        />
        <Input
          label={t("addresses.full_name")}
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          required
        />
      </div>
      <Input
        label={t("addresses.phone")}
        value={form.phone_number}
        onChange={(e) => set("phone_number", e.target.value)}
        type="tel"
        required
      />
      <Input
        label={t("addresses.street")}
        value={form.street_address}
        onChange={(e) => set("street_address", e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label={t("addresses.district")} value={form.district} onChange={(e) => set("district", e.target.value)} required />
        <Input label={t("addresses.city")} value={form.city} onChange={(e) => set("city", e.target.value)} required />
      </div>
      <Input label={t("addresses.province")} value={form.province} onChange={(e) => set("province", e.target.value)} required />
      <Input
        label={t("addresses.landmark")}
        value={form.nearby_landmark}
        onChange={(e) => set("nearby_landmark", e.target.value)}
      />
      <div className="flex gap-2 pt-1">
        <Button onClick={onSave} loading={saving} size="sm">
          {t("addresses.save")}
        </Button>
        <Button onClick={onCancel} variant="ghost" size="sm">
          {t("addresses.cancel")}
        </Button>
      </div>
    </div>
  );
}
