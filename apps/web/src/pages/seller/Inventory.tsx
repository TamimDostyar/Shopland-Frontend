import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getSellerStock,
  restockProduct,
  adjustStock,
  type StockInfo,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";

export default function Inventory() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [restockModal, setRestockModal] = useState<StockInfo | null>(null);
  const [adjustModal, setAdjustModal] = useState<StockInfo | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [showLowOnly, setShowLowOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", "all"],
    queryFn: () => getSellerStock(accessToken!),
    enabled: !!accessToken,
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      restockProduct(accessToken!, id, qty),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Stock updated");
      setRestockModal(null);
      setRestockQty("");
    },
    onError: () => toast.error("Failed to update stock"),
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      adjustStock(accessToken!, id, qty, adjustReason || undefined),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Stock adjusted");
      setAdjustModal(null);
      setAdjustQty("");
      setAdjustReason("");
    },
    onError: () => toast.error("Failed to adjust stock"),
  });

  const all: StockInfo[] = data?.results ?? [];
  const items = showLowOnly ? all.filter((s) => s.is_low_stock) : all;

  function getStockColor(s: StockInfo) {
    if (s.available === 0) return { bg: "rgba(248,113,113,0.12)", text: "#f87171" };
    if (s.is_low_stock) return { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" };
    return { bg: "rgba(74,222,128,0.12)", text: "#4ade80" };
  }

  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <BackButton to="/seller" label="Dashboard" className="mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Inventory
          </h1>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowOnly}
              onChange={(e) => setShowLowOnly(e.target.checked)}
              style={{ accentColor: "var(--accent)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-soft)" }}>
              Low stock only
            </span>
          </label>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">📦</p>
            <p style={{ color: "var(--text-soft)" }}>
              {showLowOnly ? "No low stock products." : "No stock data yet."}
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["Product", "Total", "Reserved", "Available", "Threshold", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-xs"
                      style={{ color: "var(--text-soft)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((s, i) => {
                  const color = getStockColor(s);
                  return (
                    <tr
                      key={s.product_id}
                      style={{
                        background: i % 2 === 0 ? "var(--surface)" : "rgba(11,15,31,0.5)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text-h)" }}>
                        {s.product_name}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text)" }}>{s.quantity}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text)" }}>{s.reserved}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: color.text }}>
                        {s.available}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-soft)" }}>
                        {s.low_stock_threshold}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {s.available === 0 ? "Out of Stock" : s.is_low_stock ? "Low" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setRestockModal(s);
                              setRestockQty("");
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs transition-all hover:opacity-90"
                            style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => {
                              setAdjustModal(s);
                              setAdjustQty(String(s.quantity));
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs transition-all hover:bg-white/5"
                            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                          >
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {restockModal && (
        <Modal
          title={`Restock: ${restockModal.product_name}`}
          onClose={() => setRestockModal(null)}
        >
          <p className="text-sm mb-3" style={{ color: "var(--text-soft)" }}>
            Current: {restockModal.available} available
          </p>
          <input
            type="number"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            placeholder="Quantity to add"
            min="1"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => restockMutation.mutate({ id: restockModal.product_id, qty: parseInt(restockQty) })}
              disabled={!restockQty || restockMutation.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Add Stock
            </button>
            <button
              onClick={() => setRestockModal(null)}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Adjust Modal */}
      {adjustModal && (
        <Modal
          title={`Adjust Stock: ${adjustModal.product_name}`}
          onClose={() => setAdjustModal(null)}
        >
          <p className="text-sm mb-3" style={{ color: "var(--text-soft)" }}>
            Set exact stock quantity.
          </p>
          <input
            type="number"
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
            placeholder="New stock quantity"
            min="0"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
          <input
            type="text"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder="Reason (optional)"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => adjustMutation.mutate({ id: adjustModal.product_id, qty: parseInt(adjustQty) })}
              disabled={adjustQty === "" || adjustMutation.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Set Stock
            </button>
            <button
              onClick={() => setAdjustModal(null)}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </SellerLayout>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(6,8,22,0.8)" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#0b0f1f", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold" style={{ color: "var(--text-h)" }}>{title}</h3>
          <button onClick={onClose} className="text-lg" style={{ color: "var(--text-soft)" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
