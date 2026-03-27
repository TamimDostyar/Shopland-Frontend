import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  getSellerProducts,
  uploadProductImage,
  type Category,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { CameraIcon, CategoryIcon } from "../../components/ui/icons";

const CONDITIONS = ["new", "used", "refurbished"] as const;

export default function AddEditProduct() {
  const { t } = useLanguage();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    condition: "new" as (typeof CONDITIONS)[number],
    category: "",
    brand: "",
    city: "",
    province: "",
    stock_quantity: "0",
  });

  // Two-step category selection state
  const [selectedParentSlug, setSelectedParentSlug] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  // The API returns a tree via CategoryTreeSerializer — each top-level item already has children[]
  const categoryTree = useMemo(() => {
    const apiCats: Category[] = categories ?? [];
    if (apiCats.length === 0) return [];
    return apiCats.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      children: p.children ?? [],
    }));
  }, [categories]);

  // true while the query is in-flight OR the DB has no categories yet
  const categoriesReady = !categoriesLoading && categoryTree.length > 0;

  // Sub-categories for the currently selected parent
  const subCategories = useMemo(() => {
    if (!selectedParentSlug) return [];
    return categoryTree.find((p) => p.slug === selectedParentSlug)?.children ?? [];
  }, [categoryTree, selectedParentSlug]);

  // When editing, pre-select the right parent slot
  useEffect(() => {
    if (form.category && categoryTree.length > 0) {
      const parent = categoryTree.find((p) =>
        p.children.some((c) => c.id === form.category || c.slug === form.category),
      );
      if (parent) setSelectedParentSlug(parent.slug);
    }
  }, [form.category, categoryTree]);

  const { data: productsData } = useQuery({
    queryKey: ["seller-products", "all"],
    queryFn: () => getSellerProducts(accessToken!),
    enabled: !!accessToken && isEdit,
  });

  useEffect(() => {
    if (isEdit && productsData) {
      const p = productsData.results.find((x) => x.id === id);
      if (p) {
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          discount_price: p.discount_price ?? "",
          condition: p.condition,
          category: p.category.id,
          brand: p.brand?.id ?? "",
          city: p.city,
          province: p.province,
          stock_quantity: String((p as unknown as { stock_quantity?: number }).stock_quantity ?? 0),
        });
      }
    }
  }, [isEdit, productsData, id]);

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => createProduct(accessToken!, data),
  });
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateProduct(accessToken!, id!, data),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        price: form.price,
        condition: form.condition,
        category: form.category,
        city: form.city,
        province: form.province,
        stock_quantity: Math.max(0, parseInt(form.stock_quantity || "0", 10) || 0),
      };
      if (form.discount_price) payload.discount_price = form.discount_price;
      if (form.brand) payload.brand = form.brand;

      let productId: string;
      if (isEdit) {
        const p = await updateMutation.mutateAsync(payload);
        productId = p.id;
      } else {
        const p = await createMutation.mutateAsync(payload);
        productId = p.id;
      }

      // Upload images
      for (const file of images) {
        const fd = new FormData();
        fd.append("image", file);
        await uploadProductImage(accessToken!, productId, fd);
      }

      toast.success(isEdit ? t("seller.toast_product_updated") : t("seller.toast_product_submitted"));
      navigate("/seller/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("seller.toast_save_failed"));
    } finally {
      setSubmitting(false);
    }
  }

  function f(key: keyof typeof form, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <SellerLayout>
      <div className="max-w-2xl">
        <BackButton to="/seller/products" label={t("seller.back_to_products")} className="mb-5" />

        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {isEdit ? t("seller.edit_product") : t("seller.add_new_product")}
        </h1>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
          {/* Basic Info */}
          <section
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-6 space-y-4 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
          >
            <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>{t("seller.product_details")}</h2>

            <Input
              label={t("seller.product_name_label")}
              value={form.name}
              onChange={(e) => f("name", e.target.value)}
              required
            />
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-soft)" }}>
                {t("seller.description")}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => f("description", e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("seller.price_afn")}
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => f("price", e.target.value)}
                required
              />
              <Input
                label={t("seller.discount_price_opt")}
                type="number"
                min="0"
                value={form.discount_price}
                onChange={(e) => f("discount_price", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-soft)" }}>
                {t("seller.condition")}
              </label>
              <div className="flex gap-3">
                {CONDITIONS.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-sm capitalize"
                    style={{
                      border: `1px solid ${form.condition === c ? "var(--accent)" : "var(--border)"}`,
                      background: form.condition === c ? "rgba(255,125,72,0.06)" : "transparent",
                      color: form.condition === c ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={c}
                      checked={form.condition === c}
                      onChange={() => f("condition", c)}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Category — two-step hierarchical picker */}
            <div>
              <label className="block text-sm mb-2" style={{ color: "var(--text-soft)" }}>
                {t("seller.category_label")} <span style={{ color: "var(--accent)" }}>*</span>
              </label>

              {/* State: loading */}
              {categoriesLoading && (
                <div className="flex items-center gap-2 py-3 text-sm" style={{ color: "var(--text-soft)" }}>
                  <div className="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  {t("seller.loading_categories")}
                </div>
              )}

              {/* State: DB empty — not seeded yet */}
              {!categoriesLoading && !categoriesReady && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(255,193,7,0.06)",
                    border: "1px solid rgba(255,193,7,0.25)",
                    color: "#ffc107",
                  }}
                >
                  {t("seller.no_categories")}
                  <code
                    className="block mt-1.5 px-3 py-2 rounded-lg text-xs font-mono"
                    style={{ background: "rgba(0,0,0,0.3)", color: "#e0e0e0" }}
                  >
                    python manage.py seed_categories
                  </code>
                </div>
              )}

              {/* State: ready — show two-step picker */}
              {categoriesReady && (
                <>
                  {/* Step 1: department grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                    {categoryTree.map((parent) => {
                      const isSelected = selectedParentSlug === parent.slug;
                      return (
                        <button
                          key={parent.slug}
                          type="button"
                          onClick={() => {
                            setSelectedParentSlug(parent.slug);
                            f("category", "");
                          }}
                          className="text-left px-3 py-2 rounded-xl text-xs font-medium transition-all truncate"
                          style={{
                            background: isSelected
                              ? "rgba(255,125,72,0.12)"
                              : "rgba(255,255,255,0.03)",
                            border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                            color: isSelected ? "var(--accent)" : "var(--text-soft)",
                          }}
                        >
                          <span className="inline-flex items-center gap-2">
                            <CategoryIcon slug={parent.slug} size={14} />
                            {parent.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step 2: sub-category dropdown */}
                  {selectedParentSlug ? (
                    <select
                      value={form.category}
                      onChange={(e) => f("category", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${form.category ? "var(--accent)" : "var(--border)"}`,
                        color: form.category ? "var(--text)" : "var(--text-soft)",
                      }}
                    >
                      <option value="">
                        {categoryTree.find((p) => p.slug === selectedParentSlug)?.name}…
                      </option>
                      {subCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                      {t("seller.pick_department")}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-soft)" }}>
                {t("seller.brand_optional")}
              </label>
              <select
                value={form.brand}
                onChange={(e) => f("brand", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value="">{t("seller.no_brand")}</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("seller.city")}
                value={form.city}
                onChange={(e) => f("city", e.target.value)}
                required
              />
              <Input
                label={t("seller.province")}
                value={form.province}
                onChange={(e) => f("province", e.target.value)}
                required
              />
            </div>

            <Input
              label={isEdit ? t("seller.stock_qty_edit") : t("seller.stock_qty_initial")}
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => f("stock_quantity", e.target.value)}
            />
          </section>

          {/* Images */}
          <section
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-6 space-y-4 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
          >
            <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>{t("seller.product_images")}</h2>
            <div>
              <label
                className="flex flex-col items-center justify-center gap-3 rounded-xl p-8 cursor-pointer transition-all hover:border-accent"
                style={{ border: "2px dashed var(--border)" }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) setImages(Array.from(e.target.files));
                  }}
                  className="hidden"
                />
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                  <CameraIcon size={24} />
                </span>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {t("seller.upload_images_hint")}
                </span>
              </label>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((f, i) => (
                    <div
                      key={i}
                      className="size-16 rounded-xl overflow-hidden"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="flex gap-3">
            <Button type="submit" loading={submitting} disabled={!categoriesReady} className="flex-1">
              {isEdit ? t("seller.save_changes") : t("seller.submit_review")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/seller/products")}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
