import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getCart, listAddresses, checkout } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import BackButton from "../components/ui/BackButton";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import {
  CartIcon,
  CheckCircleIcon,
  ImageIcon,
  LocationIcon,
  NoteIcon,
  PhoneIcon,
  ShieldIcon,
  TruckIcon,
} from "../components/ui/icons";

export default function Checkout() {
  const { accessToken, user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [notes, setNotes] = useState("");

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(accessToken!),
    enabled: !!accessToken,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const data = await listAddresses(accessToken!);
      if (!selectedAddressId) {
        const def = data.find((a) => a.is_default) ?? data[0];
        if (def) {
          setSelectedAddressId(def.id);
          setDeliveryPhone(def.phone_number);
        }
      }
      return data;
    },
    enabled: !!accessToken,
  });

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkout(accessToken!, {
        delivery_address_id: selectedAddressId,
        delivery_phone: deliveryPhone,
        buyer_notes: notes || undefined,
      }),
    onSuccess: async (order) => {
      await refreshCart();
      navigate(`/order-confirmed/${order.order_number}`);
    },
    onError: (err: Error) => toast.error(err.message || "Checkout failed"),
  });

  if (!user) return null;

  const items = cart?.items ?? [];
  const vs = user.verification_status;
  const isVerified = vs.phone && vs.email && vs.id;

  if (!isVerified) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <ShieldIcon size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-h)" }}>
            Verification Required
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-soft)" }}>
            You need to verify your phone, email, and ID before placing an order.
          </p>
          <div className="space-y-2 text-sm mb-6">
            {[
              { label: "Phone", ok: vs.phone },
              { label: "Email", ok: vs.email },
              { label: "ID", ok: vs.id },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-2 justify-center">
                {ok ? (
                  <CheckCircleIcon size={16} style={{ color: "#169b65" }} />
                ) : (
                  <ShieldIcon size={16} style={{ color: "#d94b4b" }} />
                )}
                <span style={{ color: "var(--text)" }}>{label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl font-medium text-sm inline-block"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Go to Profile
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <CartIcon size={28} />
          </div>
          <p className="font-medium mb-4" style={{ color: "var(--text-h)" }}>Your cart is empty</p>
          <Link to="/" className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Browse Products</Link>
        </div>
      </MainLayout>
    );
  }

  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton to="/cart" label="Back to Cart" className="mb-5" />

        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          Checkout
        </h1>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold mb-4 inline-flex items-center gap-2" style={{ color: "var(--text-h)" }}>
                <LocationIcon size={18} className="text-[color:var(--accent)]" />
                Delivery Address
              </h2>
              {!addresses || addresses.length === 0 ? (
                <div>
                  <p className="text-sm mb-3" style={{ color: "var(--text-soft)" }}>
                    No saved addresses.
                  </p>
                  <Link
                    to="/profile/addresses"
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    Add an address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className="flex items-start gap-3 cursor-pointer rounded-[1.5rem] p-4 transition-all"
                      style={{
                        border: `1px solid ${selectedAddressId === addr.id ? "var(--accent)" : "var(--border)"}`,
                        background:
                          selectedAddressId === addr.id
                            ? "rgba(255,125,72,0.05)"
                            : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => {
                          setSelectedAddressId(addr.id);
                          setDeliveryPhone(addr.phone_number);
                        }}
                        className="mt-0.5"
                        style={{ accentColor: "var(--accent)" }}
                      />
                      <div className="text-sm">
                        <p className="font-medium" style={{ color: "var(--text-h)" }}>
                          {addr.label} {addr.is_default && <span style={{ color: "var(--accent)" }}>• Default</span>}
                        </p>
                        <p style={{ color: "var(--text-soft)" }}>
                          {addr.full_name} — {addr.phone_number}
                        </p>
                        <p style={{ color: "var(--text-soft)" }}>
                          {addr.street_address}, {addr.district}, {addr.city}, {addr.province}
                        </p>
                      </div>
                    </label>
                  ))}
                  <Link
                    to="/profile/addresses"
                    className="text-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    + Add new address
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold mb-4 inline-flex items-center gap-2" style={{ color: "var(--text-h)" }}>
                <PhoneIcon size={18} className="text-[color:var(--accent)]" />
                Delivery Phone
              </h2>
              <input
                type="tel"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder="+93XXXXXXXXX"
                className="w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm outline-none"
                style={{
                  color: "var(--text)",
                }}
              />
            </section>

            <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold mb-4 inline-flex items-center gap-2" style={{ color: "var(--text-h)" }}>
                <TruckIcon size={18} className="text-[color:var(--accent)]" />
                Payment Method
              </h2>
              <div
                className="rounded-[1.5rem] p-4 flex items-center gap-3"
                style={{ background: "var(--success-soft)", border: "1px solid rgba(22,155,101,0.16)" }}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-[color:var(--success)]">
                  <TruckIcon size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: "var(--text-h)" }}>
                    Cash on Delivery
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                    You will pay ؋{parseFloat(cart?.total ?? "0").toLocaleString()} in cash when your order is delivered.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold mb-4 inline-flex items-center gap-2" style={{ color: "var(--text-h)" }}>
                <NoteIcon size={18} className="text-[color:var(--accent)]" />
                Buyer Notes (optional)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for the seller or driver?"
                rows={3}
                className="w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm outline-none resize-none"
                style={{
                  color: "var(--text)",
                }}
              />
            </section>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 sticky top-24 space-y-4 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>
                Order Summary
              </h2>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div
                      className="size-10 rounded-lg shrink-0 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[color:var(--text-soft)]"><ImageIcon size={16} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs line-clamp-1" style={{ color: "var(--text)" }}>
                        {item.product.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-medium shrink-0" style={{ color: "var(--text-h)" }}>
                      ؋{parseFloat(item.item_total).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-soft)" }}>Subtotal</span>
                  <span>؋{parseFloat(cart?.subtotal ?? "0").toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-soft)" }}>Delivery</span>
                  <span style={{ color: "var(--text-soft)" }}>TBD</span>
                </div>
                <div
                  className="flex justify-between font-semibold border-t pt-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--text-h)" }}>Total</span>
                  <span style={{ color: "var(--accent)" }}>
                    ؋{parseFloat(cart?.total ?? "0").toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => checkoutMutation.mutate()}
                disabled={!selectedAddressId || !deliveryPhone || checkoutMutation.isPending}
                className="w-full py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2 bg-[var(--accent)] text-white shadow-[0_14px_30px_rgba(255,106,61,0.22)]"
              >
                {checkoutMutation.isPending && (
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Place Order
              </button>

              <p className="text-xs text-center" style={{ color: "var(--text-soft)" }}>
                By placing this order you agree to our Terms of Service
              </p>

              {selectedAddress && (
                <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                  Delivering to: {selectedAddress.city}, {selectedAddress.province}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
