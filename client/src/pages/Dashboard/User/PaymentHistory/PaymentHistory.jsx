import { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import {
  FaReceipt,
  FaCheckCircle,
  FaCreditCard,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import usePaymentHistory from "../../../../hooks/usePaymentHistory";

// ── FORMAT HELPERS ─────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const maskTxn = (id) => (id ? `${id.slice(0, 6)}…${id.slice(-4)}` : "—");

// ── STAT CARD ──────────────────────────────
const StatCard = ({ icon, label, value, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative group flex flex-col gap-2 p-5 rounded-2xl border border-base-content/5 bg-base-200/50 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}14, transparent 65%)`,
        }}
      />
      <span className="text-lg" style={{ color }}>
        {icon}
      </span>
      <p className="text-xl font-black tabular-nums">{value}</p>
      <p className="text-[9px] uppercase font-black tracking-widest opacity-25">
        {label}
      </p>
    </Motion.div>
  );
};

// ── EMPTY STATE ────────────────────────────
const EmptyState = () => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-24 gap-4 opacity-30"
  >
    <FaReceipt className="text-4xl" />
    <p className="font-black text-sm uppercase tracking-widest">
      No payments yet
    </p>
    <p className="text-xs opacity-60">Your transactions will appear here</p>
  </Motion.div>
);

// ── MAIN COMPONENT ─────────────────────────
const PaymentHistory = () => {
  const {
    data: payments = [],
    isPending,
    isError,
    error,
  } = usePaymentHistory();

  if (isPending || isError)
    return (
      <ErrorLoadingState
        error={error}
        isError={isError}
        isPending={isPending}
      />
    );

  const totalSpent = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="font-urbanist space-y-6">
      {/* ── HEADER ── */}
      <div ref={headerRef}>
        <Motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-2.5 mb-3"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Financial Records
          </span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.07 }}
          className="text-3xl md:text-4xl font-black tracking-tighter leading-tight"
        >
          Payment
          <span
            className="ml-3"
            style={{
              WebkitTextStroke: "1.5px var(--color-primary)",
              color: "transparent",
            }}
          >
            History
          </span>
        </Motion.h1>
      </div>

      {/* ── SUMMARY STATS ── */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            icon={<FaReceipt />}
            label="Total Transactions"
            value={payments.length}
            color="var(--color-primary)"
            delay={0.05}
          />
          <StatCard
            icon={<MdElectricBolt />}
            label="Total Spent"
            value={`৳ ${totalSpent.toLocaleString()}`}
            color="#10b981"
            delay={0.1}
          />
          <StatCard
            icon={<FaCheckCircle />}
            label="All Successful"
            value="100%"
            color="#fbbf24"
            delay={0.15}
          />
        </div>
      )}

      {/* ── TABLE CARD ── */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-base-content/5 overflow-hidden"
        style={{ background: "var(--color-base-200)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/5">
          <div className="flex items-center gap-2.5">
            <FaReceipt className="text-primary text-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              All Transactions
            </span>
          </div>
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-full"
            style={{
              color: "var(--color-primary)",
              background:
                "color-mix(in srgb, var(--color-primary) 15%, transparent)",
            }}
          >
            {payments.length} Records
          </span>
        </div>

        {payments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── MOBILE CARD LIST (< md) ── */}
            <div className="md:hidden divide-y divide-base-content/5">
              {payments.map((payment, i) => (
                <Motion.div
                  key={payment._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.04 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-base-100/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[10px] opacity-30" />
                      <span className="text-xs font-bold">
                        {formatDate(payment.paidAt)}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] opacity-30">
                      {maskTxn(payment.transactionId)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-black text-sm text-primary">
                      ৳ {payment.amount}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black text-success/80 bg-success/8 px-2 py-0.5 rounded-full">
                      <FaCheckCircle className="text-[8px]" /> Paid
                    </span>
                  </div>
                </Motion.div>
              ))}
            </div>

            {/* ── DESKTOP TABLE (≥ md) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-base-content/5">
                    {[
                      { icon: <FaHashtag />, label: "#" },
                      { icon: <FaCalendarAlt />, label: "Date" },
                      { icon: null, label: "Parcel ID" },
                      { icon: null, label: "Amount" },
                      { icon: <FaCreditCard />, label: "Method" },
                      { icon: null, label: "Transaction" },
                      { icon: null, label: "Status" },
                    ].map(({ icon, label }) => (
                      <th
                        key={label}
                        className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1.5">
                          {icon && <span>{icon}</span>}
                          {label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, i) => (
                    <Motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 10) * 0.035 }}
                      className="group border-b border-base-content/[0.04] last:border-0 hover:bg-base-100/50 transition-colors duration-200"
                    >
                      <td className="px-5 py-4 text-[11px] font-black opacity-25 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold whitespace-nowrap">
                        {formatDate(payment.paidAt)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[10px] opacity-40 max-w-[120px] truncate">
                        {payment.parcelId}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-black text-primary">
                          ৳ {payment.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold capitalize opacity-50">
                        {payment.paymentMethod?.[0] ?? "Card"}
                      </td>
                      <td className="px-5 py-4 font-mono text-[10px] opacity-35">
                        {maskTxn(payment.transactionId)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 w-fit text-[9px] font-black text-success/80 bg-success/10 px-2.5 py-1 rounded-full">
                          <FaCheckCircle className="text-[8px]" />
                          Paid
                        </span>
                      </td>
                    </Motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Motion.div>
    </section>
  );
};

export default PaymentHistory;
