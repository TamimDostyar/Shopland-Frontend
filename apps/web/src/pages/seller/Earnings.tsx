import { useQuery } from "@tanstack/react-query";
import {
  getEarnings,
  getEarningsSummary,
  getSettlements,
  type SellerEarning,
  type Settlement,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";

const EARNING_STATUS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  settled: { bg: "rgba(74,222,128,0.12)", text: "#4ade80" },
  disputed: { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
};

export default function Earnings() {
  const { accessToken } = useAuth();

  const { data: summary } = useQuery({
    queryKey: ["earnings", "summary"],
    queryFn: () => getEarningsSummary(accessToken!),
    enabled: !!accessToken,
  });

  const { data: earnings } = useQuery({
    queryKey: ["earnings", "list"],
    queryFn: () => getEarnings(accessToken!),
    enabled: !!accessToken,
  });

  const { data: settlements } = useQuery({
    queryKey: ["settlements"],
    queryFn: () => getSettlements(accessToken!),
    enabled: !!accessToken,
  });

  const earningsList: SellerEarning[] = earnings?.results ?? [];
  const settlementsList: Settlement[] = settlements?.results ?? [];

  return (
    <SellerLayout>
      <div className="max-w-5xl">
        <BackButton to="/seller" label="Dashboard" className="mb-5" />

        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          Earnings & Settlements
        </h1>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {[
              { label: "Total Gross", value: summary.total_gross, icon: "💰" },
              { label: "Total Commission", value: summary.total_commission, icon: "📊" },
              { label: "Net Earnings", value: summary.total_net, icon: "✅", accent: true },
              { label: "Pending Settlement", value: summary.total_pending, icon: "⏳" },
              { label: "Total Settled", value: summary.total_settled, icon: "🏦" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${s.accent ? "rgba(255,125,72,0.25)" : "var(--border)"}`,
                }}
              >
                <span className="text-2xl">{s.icon}</span>
                <p
                  className="text-xl font-bold mt-2"
                  style={{ color: s.accent ? "var(--accent)" : "var(--text-h)", fontFamily: "var(--heading)" }}
                >
                  ؋{parseFloat(s.value).toLocaleString()}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Earnings table */}
        <section className="mb-10">
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>
            Earning History
          </h2>
          {earningsList.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-4xl mb-3">💸</p>
              <p style={{ color: "var(--text-soft)" }}>No earnings yet.</p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                    {["Order", "Product", "Gross", "Commission", "Net", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium"
                        style={{ color: "var(--text-soft)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {earningsList.map((e, i) => {
                    const s = EARNING_STATUS[e.status] ?? EARNING_STATUS.pending;
                    return (
                      <tr
                        key={e.id}
                        style={{
                          background: i % 2 === 0 ? "var(--surface)" : "rgba(11,15,31,0.5)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <td className="px-4 py-3 font-medium text-xs" style={{ color: "var(--accent)" }}>
                          {e.order_number}
                        </td>
                        <td className="px-4 py-3 max-w-[150px] truncate" style={{ color: "var(--text)" }}>
                          {e.product_name}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                          ؋{parseFloat(e.gross_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#f87171" }}>
                          -{e.commission_rate}% (؋{parseFloat(e.commission_amount).toLocaleString()})
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: "#4ade80" }}>
                          ؋{parseFloat(e.net_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                            style={{ background: s.bg, color: s.text }}
                          >
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Settlements */}
        <section>
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>
            Settlement History
          </h2>
          {settlementsList.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-4xl mb-3">🏦</p>
              <p style={{ color: "var(--text-soft)" }}>No settlements yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlementsList.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: "var(--text-h)" }}>
                      ؋{parseFloat(s.total_amount).toLocaleString()}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                      {new Date(s.period_start).toLocaleDateString()} — {new Date(s.period_end).toLocaleDateString()} · {s.earnings_count} orders · {s.method.replace("_", " ")}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                    style={
                      s.status === "completed"
                        ? { background: "rgba(74,222,128,0.12)", color: "#4ade80" }
                        : s.status === "failed"
                        ? { background: "rgba(248,113,113,0.12)", color: "#f87171" }
                        : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                    }
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </SellerLayout>
  );
}
