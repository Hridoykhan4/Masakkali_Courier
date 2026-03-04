import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaMoneyBillWave,
  FaMotorcycle,
  FaPlus,
  FaArrowRight,
  FaReceipt,
  FaFileAlt,
} from "react-icons/fa";
import { MdElectricBolt, MdLocalShipping, MdVerified } from "react-icons/md";
import { HiOutlineLocationMarker, HiSparkles } from "react-icons/hi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuthValue";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

// ─────────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────────
const ACC = "#10b981"; // emerald — customer brand colour

const S = {
  delivered: { color: "#10b981", label: "Delivered", short: "Done" },
  "in-transit": { color: "#a78bfa", label: "In Transit", short: "Moving" },
  assigned: { color: "#38bdf8", label: "Assigned", short: "Assigned" },
  pending: { color: "#fbbf24", label: "Pending", short: "Pending" },
  "not-collected": {
    color: "#f87171",
    label: "Not Collected",
    short: "Missed",
  },
};
const sc = (k) => S[k]?.color ?? "#64748b";
const sl = (k) => S[k]?.label ?? k;
const ssh = (k) => S[k]?.short ?? k;

// ─────────────────────────────────────────────────
//  ATOMS
// ─────────────────────────────────────────────────
const Chip = ({ status, small = false }) => {
  const color = sc(status);
  const pulse = ["assigned", "in-transit", "pending"].includes(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-black uppercase tracking-wider
        rounded-full whitespace-nowrap shrink-0
        ${small ? "text-[8px] px-2 py-1" : "text-[9px] px-2.5 py-1.5"}`}
      style={{ background: `${color}18`, color }}
    >
      <Motion.span
        animate={pulse ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {small ? ssh(status) : sl(status)}
    </span>
  );
};

const SectionLabel = ({ children }) => (
  <Motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 mb-5"
  >
    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 whitespace-nowrap">
      {children}
    </span>
    <div className="flex-1 h-px bg-base-content/5" />
  </Motion.div>
);

// ─────────────────────────────────────────────────
//  KPI STAT CARD
// ─────────────────────────────────────────────────
const StatCard = ({
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  label,
  value,
  color,
  prefix = "",
  sub,
  delay = 0,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-3 p-5 rounded-2xl border border-base-content/5
        bg-base-100 overflow-hidden"
    >
      {/* Permanent ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}22, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background: `${color}18`, color }}
        >
          <Icon />
        </div>
        <Motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: color }}
        />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-1.5">
          {label}
        </p>
        <p
          className="text-2xl md:text-3xl font-black tabular-nums leading-none"
          style={{ color }}
        >
          {prefix}
          {value ?? 0}
        </p>
        {sub && <p className="text-[9px] font-bold mt-1.5 opacity-30">{sub}</p>}
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  CARD SHELL
// ─────────────────────────────────────────────────
const Card = ({ children, className = "", accent, delay = 0 }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`relative rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden ${className}`}
  >
    {accent && (
      <div
        className="absolute top-0 inset-x-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}60, ${accent}60, transparent)`,
        }}
      />
    )}
    {children}
  </Motion.div>
);

// eslint-disable-next-line no-unused-vars
const CardHead = ({ icon: Icon, title, color = ACC, right }) => (
  <div
    className="flex items-center justify-between px-5 py-4 border-b border-base-content/5.5"
    style={{ background: `${color}07` }}
  >
    <div className="flex items-center gap-2">
      <Icon className="text-sm shrink-0" style={{ color }} />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
        {title}
      </span>
    </div>
    {right}
  </div>
);

// ─────────────────────────────────────────────────
//  ACTIVE PARCEL TRACKER
// ─────────────────────────────────────────────────
const STEPS = ["Created", "Paid", "Assigned", "Moving", "Delivered"];
const stepIndex = {
  "not-collected": 0,
  pending: 1,
  assigned: 2,
  "in-transit": 3,
  delivered: 4,
};

const ActiveParcel = ({ parcel }) => {
  const color = sc(parcel.delivery_status);
  const step = stepIndex[parcel.delivery_status] ?? 1;
  const pct = (step / (STEPS.length - 1)) * 100;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden"
    >
      {/* Coloured top bar */}
      <div
        className="absolute top-0 inset-x-0 h-0.75"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}70, ${color}, ${color}70, transparent)`,
        }}
      />

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-5 border-b border-base-content/6"
        style={{ background: `${color}07` }}
      >
        <div className="flex items-center gap-3">
          <Motion.div
            animate={{
              rotate:
                parcel.delivery_status === "in-transit" ? [0, 4, -4, 0] : 0,
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${color}20`, color }}
          >
            <MdLocalShipping />
          </Motion.div>
          <div className="min-w-0">
            <p className="font-black text-sm leading-tight truncate">
              {parcel.title}
            </p>
            <p className="text-[9px] font-bold opacity-30 mt-0.5 font-mono tracking-wider">
              {parcel.trackingId}
            </p>
          </div>
        </div>
        <Chip status={parcel.delivery_status} />
      </div>

      {/* ── Progress stepper ── */}
      <div className="px-6 py-6 border-b border-base-content/6">
        <div className="relative flex items-center justify-between">
          {/* Track base */}
          <div className="absolute inset-x-6 top-3.5 h-0.5 bg-base-content/8 z-0" />
          {/* Track fill */}
          <Motion.div
            className="absolute left-6 top-3.5 h-0.5 z-0 origin-left"
            style={{
              backgroundColor: color,
              width: `calc((100% - 3rem) * ${pct / 100})`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.35 }}
          />
          {STEPS.map((s, i) => {
            const done = i <= step;
            const current = i === step;
            return (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                <Motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{
                    background: done ? color : "var(--color-base-200)",
                    color: done ? "#020617" : "var(--color-base-content)",
                    opacity: done ? 1 : 0.3,
                    boxShadow: current ? `0 0 0 4px ${color}28` : "none",
                  }}
                  animate={current ? { scale: [1, 1.14, 1] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  {done ? "✓" : i + 1}
                </Motion.div>
                <p className="text-[7px] font-black uppercase tracking-wide opacity-35 hidden sm:block">
                  {s}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Route + Rider ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-base-content/6">
        <div className="px-6 py-5">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-3">
            Route
          </p>
          <div className="flex gap-3 items-stretch">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full border-2"
                style={{ borderColor: "#10b981", background: "#10b98128" }}
              />
              <div className="w-px flex-1 min-h-5.5 bg-base-content/10 my-1" />
              <div
                className="w-2.5 h-2.5 rounded-full border-2"
                style={{ borderColor: color, background: `${color}28` }}
              />
            </div>
            <div className="flex flex-col justify-between gap-3 min-w-0 flex-1">
              <div>
                <p className="text-xs font-black truncate">
                  {parcel.senderServiceCenter}
                </p>
                <p className="text-[9px] opacity-30 font-medium">
                  {parcel.senderRegion}
                </p>
              </div>
              <div>
                <p className="text-xs font-black truncate">
                  {parcel.receiverServiceCenter}
                </p>
                <p className="text-[9px] opacity-30 font-medium">
                  {parcel.receiverRegion}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-3">
            Rider
          </p>
          {parcel.rider_name ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{ background: "#fbbf2418", color: "#fbbf24" }}
              >
                <FaMotorcycle />
              </div>
              <div>
                <p className="text-xs font-black">{parcel.rider_name}</p>
                <p className="text-[9px] opacity-30 font-medium mt-0.5">
                  {parcel.rider_phone}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold opacity-20">Awaiting assignment</p>
          )}
        </div>
      </div>

      {/* ── Tracking log ── */}
      {parcel.trackingHistory?.length > 0 && (
        <div className="px-6 py-5 border-t border-base-content/6">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-3">
            Event Log
          </p>
          <div className="space-y-3">
            {[...parcel.trackingHistory]
              .reverse()
              .slice(0, 3)
              .map((t, i) => (
                <Motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                    style={{
                      backgroundColor: i === 0 ? color : "#64748b",
                      opacity: i === 0 ? 1 : 0.3,
                    }}
                  />
                  <div>
                    <p
                      className="text-xs font-black leading-tight"
                      style={{ color: i === 0 ? color : undefined }}
                    >
                      {t.message}
                    </p>
                    <p className="text-[9px] opacity-25 font-medium mt-0.5">
                      {t.location} ·{" "}
                      {new Date(t.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </Motion.div>
              ))}
          </div>
        </div>
      )}

      {/* ── Footer cost ── */}
      <div
        className="px-6 py-3.5 flex items-center justify-between border-t border-base-content/6"
        style={{ background: "var(--color-base-200)" }}
      >
        <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
          Shipment Cost
        </span>
        <span className="font-black text-base" style={{ color }}>
          ৳ {parcel.cost}
        </span>
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  PARCEL ACTIVITY ROW
// ─────────────────────────────────────────────────
const ParcelRow = ({ parcel, index }) => {
  const color = sc(parcel.delivery_status);
  return (
    <Motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.045 }}
      className="flex items-center gap-3 py-3.5 border-b border-base-content/4.5 last:border-0"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: `${color}15`, color }}
      >
        {parcel.parcelType === "document" ? <FaFileAlt /> : <FaBox />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black leading-tight truncate">
          {parcel.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <HiOutlineLocationMarker className="text-[9px] opacity-20 shrink-0" />
          <p className="text-[9px] opacity-25 font-medium truncate">
            {parcel.senderRegion} → {parcel.receiverRegion}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
        <Chip status={parcel.delivery_status} small />
        <span className="text-[9px] font-black tabular-nums opacity-30">
          ৳{parcel.cost}
        </span>
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  RECHARTS: INTERACTIVE DONUT
// ─────────────────────────────────────────────────
const DonutChart = ({ statusBreakdown, totalParcels }) => {
  const [activeIdx, setActiveIdx] = useState(null);

  const data = statusBreakdown
    .filter((d) => d.count > 0 && d.status)
    .map((d) => ({
      name: sl(d.status),
      value: d.count,
      color: sc(d.status),
      status: d.status,
    }));

  if (!data.length) return null;

  const focused = activeIdx != null ? data[activeIdx] : null;

  return (
    <Card accent={ACC}>
      <CardHead icon={FaBox} title="Status Distribution" />
      <div className="p-5 flex flex-col gap-4">
        {/* Donut */}
        <div className="relative" style={{ minHeight: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="78%"
                paddingAngle={3}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {data.map((e, i) => (
                  <Cell
                    key={i}
                    fill={e.color}
                    opacity={activeIdx === null || activeIdx === i ? 1 : 0.25}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centre label — swaps on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <Motion.div
                key={focused?.name ?? "total"}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.14 }}
                className="text-center"
              >
                <p
                  className="text-3xl font-black tabular-nums leading-none"
                  style={{ color: focused?.color ?? ACC }}
                >
                  {focused?.value ?? totalParcels}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mt-1">
                  {focused?.name ?? "Total"}
                </p>
              </Motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive legend */}
        <div className="grid grid-cols-2 gap-1.5">
          {data.map((d, i) => (
            <div
              key={d.status}
              className="flex items-center gap-2 py-2 px-2.5 rounded-xl cursor-pointer transition-all duration-150"
              style={{
                background: activeIdx === i ? `${d.color}14` : "transparent",
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span
                className="text-[9px] font-black uppercase tracking-wide truncate"
                style={{ color: d.color }}
              >
                {ssh(d.status)}
              </span>
              <span className="text-[9px] font-black ml-auto tabular-nums opacity-50">
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────
//  RECHARTS: SPEND BAR CHART
// ─────────────────────────────────────────────────
const SpendChart = ({ recentParcels }) => {
  // Build monthly spend from recentParcels (creation_date is ISO string)
  const monthly = {};
  recentParcels.forEach((p) => {
    if (!p.creation_date || !p.cost) return;
    const month = new Date(p.creation_date).toLocaleDateString("en-US", {
      month: "short",
    });
    monthly[month] = (monthly[month] ?? 0) + p.cost;
  });
  const data = Object.entries(monthly).map(([month, spent]) => ({
    month,
    spent,
  }));

  // Need at least 2 data points to be meaningful
  if (data.length < 2) return null;

  return (
    <Card accent="#fbbf24" delay={0.08}>
      <CardHead icon={FaMoneyBillWave} title="Spend by Month" color="#fbbf24" />
      <div className="p-4" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height={148}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.05}
            />
            <XAxis
              dataKey="month"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", opacity: 0.35, fontWeight: 700 }}
            />
            <YAxis
              fontSize={10}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", opacity: 0.28, fontWeight: 700 }}
            />
            <Tooltip
              cursor={{ fill: "currentColor", opacity: 0.04 }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div
                    className="px-3 py-2 rounded-xl border border-base-content/8 shadow-xl"
                    style={{ background: "var(--color-base-100)" }}
                  >
                    <p className="text-[9px] font-black uppercase opacity-30">
                      {label}
                    </p>
                    <p
                      className="font-black text-sm"
                      style={{ color: "#fbbf24" }}
                    >
                      ৳{payload[0].value}
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="spent"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              fill="#fbbf24"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────
//  EMPTY STATE
// ─────────────────────────────────────────────────
const EmptyState = ({ firstName }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className="relative rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden"
  >
    <div
      className="absolute top-0 inset-x-0 h-0.75"
      style={{
        background: `linear-gradient(90deg, transparent, ${ACC}80, ${ACC}, ${ACC}80, transparent)`,
      }}
    />
    <div
      className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${ACC}10, transparent 65%)`,
        filter: "blur(60px)",
      }}
    />
    <div className="relative flex flex-col items-center text-center px-8 py-16">
      <Motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-8"
        style={{ background: `${ACC}18`, color: ACC }}
      >
        <MdLocalShipping />
      </Motion.div>

      <div className="flex items-center gap-2 mb-3">
        <HiSparkles className="text-sm" style={{ color: ACC }} />
        <span
          className="text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ color: ACC }}
        >
          Ready to Ship
        </span>
      </div>

      <h2 className="text-3xl font-black tracking-tighter leading-[0.92] mb-3">
        Hey {firstName},
        <br />
        <span
          style={{ WebkitTextStroke: `1.5px ${ACC}`, color: "transparent" }}
        >
          Ship Something.
        </span>
      </h2>
      <p className="text-sm font-medium opacity-35 max-w-xs leading-relaxed mb-8">
        Masakkali delivers across all 50+ districts of Bangladesh — fast,
        tracked, and guaranteed from just ৳60.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
        {[
          { label: "4hr Express", sub: "Same city", color: "#38bdf8" },
          { label: "50+ Districts", sub: "All BD", color: ACC },
          { label: "Live Tracking", sub: "Real-time", color: "#a78bfa" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex flex-col gap-1 p-3 rounded-2xl border border-base-content/5"
            style={{ background: `${f.color}09` }}
          >
            <p className="text-xs font-black" style={{ color: f.color }}>
              {f.label}
            </p>
            <p className="text-[9px] font-bold opacity-30">{f.sub}</p>
          </div>
        ))}
      </div>

      <Link
        to="/sendParcel"
        className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm uppercase
          tracking-wider transition-all hover:scale-[1.04] hover:shadow-2xl active:scale-95"
        style={{
          background: ACC,
          color: "#020617",
          boxShadow: `0 12px 36px ${ACC}40`,
        }}
      >
        <FaPlus /> Send a Parcel Now <FaArrowRight className="text-xs" />
      </Link>
      <p className="text-[9px] font-bold opacity-20 mt-4 uppercase tracking-widest">
        No setup · Pay only when you ship
      </p>
    </div>
  </Motion.div>
);

// ─────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────
const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const email = user?.email;
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const { data, isLoading } = useQuery({
    queryKey: ["user-dashboard", email],
    queryFn: async () =>
      (
        await axiosSecure.get(
          `/users/dashboard?email=${encodeURIComponent(email)}`,
        )
      ).data,
    enabled: !!email && !loading,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  const {
    stats = {},
    activeParcel,
    recentParcels = [],
    recentPayments = [],
    statusBreakdown = [],
  } = data ?? {};

  const hasAnyParcel = stats.totalParcels > 0;
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8 font-urbanist pb-12">
      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <div ref={headerRef}>
        <div
          className="flex items-center gap-2.5 mb-4"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: ACC }}
          />
          <span
            className="text-[11px] font-black tracking-[0.3em] uppercase"
            style={{ color: ACC }}
          >
            Customer Dashboard
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
              HEY,
              <br />
              <span
                style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}
              >
                {firstName.toUpperCase()}.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-35 mt-3 max-w-sm">
              {hasAnyParcel
                ? `${stats.totalParcels} parcel${stats.totalParcels > 1 ? "s" : ""} shipped · ${stats.deliveredCount} delivered · ${stats.successRate}% success rate`
                : "Welcome to Masakkali. Ready to send your first parcel?"}
            </p>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <Link
              to="/sendParcel"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs
                uppercase tracking-wider transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
              style={{
                background: ACC,
                color: "#020617",
                boxShadow: `0 6px 24px ${ACC}35`,
              }}
            >
              <FaPlus /> Send Parcel
            </Link>
          </Motion.div>
        </div>
      </div>

      {/* ══════════════════════════════
          EMPTY STATE
      ══════════════════════════════ */}
      {!hasAnyParcel && <EmptyState firstName={firstName} />}

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      {hasAnyParcel && (
        <>
          {/* KPI CARDS */}
          <section>
            <SectionLabel>Your Stats</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={FaBox}
                label="Total Parcels"
                value={stats.totalParcels}
                color="#38bdf8"
                delay={0}
              />
              <StatCard
                icon={FaCheckCircle}
                label="Delivered"
                value={stats.deliveredCount}
                color={ACC}
                delay={0.06}
                sub={`${stats.successRate}% success rate`}
              />
              <StatCard
                icon={FaTruck}
                label="Active"
                value={(stats.inTransitCount ?? 0) + (stats.assignedCount ?? 0)}
                color="#a78bfa"
                delay={0.12}
              />
              <StatCard
                icon={FaMoneyBillWave}
                label="Total Spent"
                value={stats.totalSpent}
                color="#fbbf24"
                delay={0.18}
                prefix="৳"
                sub={`${stats.totalTransactions} payments`}
              />
            </div>
          </section>

          {/* ACTIVE SHIPMENT */}
          {activeParcel && (
            <section>
              <SectionLabel>Active Shipment</SectionLabel>
              <ActiveParcel parcel={activeParcel} />
            </section>
          )}

          {/* RECHARTS ANALYTICS */}
          <section>
            <SectionLabel>Analytics</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DonutChart
                statusBreakdown={statusBreakdown}
                totalParcels={stats.totalParcels}
              />
              <SpendChart recentParcels={recentParcels} />
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section>
            <SectionLabel>Recent Activity</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Parcel list */}
              <Card className="lg:col-span-7" accent={ACC}>
                <CardHead
                  icon={FaBox}
                  title="Recent Parcels"
                  right={
                    <Link
                      to="/dashboard/my-parcels"
                      className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                      style={{ color: ACC, opacity: 0.65 }}
                    >
                      All <FaArrowRight className="text-[8px]" />
                    </Link>
                  }
                />
                <div className="px-5 divide-y divide-base-content/4">
                  {recentParcels.slice(0, 5).map((p, i) => (
                    <ParcelRow key={p._id} parcel={p} index={i} />
                  ))}
                </div>
                <div
                  className="px-5 py-4 border-t border-base-content/5.5"
                  style={{ background: "var(--color-base-200)" }}
                >
                  <Link
                    to="/sendParcel"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                      text-[10px] font-black uppercase tracking-wider border border-base-content/8
                      hover:border-base-content/20 transition-all opacity-50 hover:opacity-80"
                  >
                    <FaPlus className="text-[9px]" /> Send Another
                  </Link>
                </div>
              </Card>

              {/* Payments + tip */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card accent="#fbbf24" delay={0.08}>
                  <CardHead
                    icon={FaReceipt}
                    title="Recent Payments"
                    color="#fbbf24"
                  />
                  <div className="px-5 py-1 divide-y divide-base-content/4">
                    {recentPayments.length > 0 ? (
                      recentPayments.map((p, i) => (
                        <Motion.div
                          key={p._id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center justify-between py-3.5"
                        >
                          <div className="min-w-0">
                            <p className="text-[10px] font-mono font-bold opacity-25 truncate max-w-32.5">
                              ···{p.transactionId?.slice(-10)}
                            </p>
                            <p className="text-[9px] opacity-20 font-medium mt-0.5">
                              {new Date(p.paidAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <span
                            className="font-black text-sm shrink-0 ml-3"
                            style={{ color: ACC }}
                          >
                            ৳{p.amount}
                          </span>
                        </Motion.div>
                      ))
                    ) : (
                      <p className="text-xs opacity-20 font-bold py-6 text-center">
                        No payments yet
                      </p>
                    )}
                  </div>
                </Card>

                {/* Tip card */}
                <Card accent={ACC} delay={0.14}>
                  <div className="relative p-5 overflow-hidden">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 100% 0%, ${ACC}10, transparent 60%)`,
                      }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <MdVerified style={{ color: ACC }} />
                      <span
                        className="text-[9px] font-black uppercase tracking-widest opacity-70"
                        style={{ color: ACC }}
                      >
                        Pro Tip
                      </span>
                    </div>
                    <p className="text-sm font-black tracking-tight leading-tight mb-1">
                      Documents from ৳60
                    </p>
                    <p className="text-[10px] opacity-30 font-medium leading-relaxed">
                      Send certificates, contracts and letters fast across all
                      districts.
                    </p>
                    <Link
                      to="/sendParcel"
                      className="flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-wider"
                      style={{ color: ACC }}
                    >
                      Send now <FaArrowRight className="text-[8px]" />
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* PROMO STRIP */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden
              px-7 py-7 flex flex-col md:flex-row items-center justify-between gap-5"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${ACC}08, transparent 55%)`,
              }}
            />
            <div className="text-center md:text-left">
              <p
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70"
                style={{ color: ACC }}
              >
                Fast & Reliable
              </p>
              <h3 className="text-xl font-black tracking-tight">
                Ship anywhere in Bangladesh.
              </h3>
              <p className="text-sm opacity-30 mt-1">
                50+ districts · Starting ৳60 · Live tracking
              </p>
            </div>
            <Link
              to="/sendParcel"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm
                uppercase tracking-wider transition-all hover:scale-[1.03] hover:shadow-xl
                active:scale-95 shrink-0"
              style={{
                background: ACC,
                color: "#020617",
                boxShadow: `0 8px 28px ${ACC}35`,
              }}
            >
              <FaPlus /> Send a Parcel
            </Link>
          </Motion.div>
        </>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-15">
          Masakkali Courier — Customer Portal
        </p>
        <p
          className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-25"
          style={{ color: ACC }}
        >
          <MdElectricBolt /> Live
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
