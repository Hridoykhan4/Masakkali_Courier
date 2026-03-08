import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Link } from "react-router";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaRoute,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  MdElectricBolt,
  MdVerified,
  MdOutlineSpeed,
  MdOutlinePendingActions,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbPackage, TbCoinFilled } from "react-icons/tb";
import { RiMotorbikeFill } from "react-icons/ri";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { motion as Motion, useInView } from "framer-motion";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import useAuthValue from "../../../../hooks/useAuthValue";

// ─────────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────────
const ACC   = "#fbbf24"; // amber  — rider brand
const CASH  = "#10b981"; // green  — settled money
const PEND  = "#38bdf8"; // sky    — pending
const INTER = "#a78bfa"; // violet — inter district

const normalizeStats = (raw) => ({
  totalDeliveries:    Number(raw?.totalDeliveries    ?? 0),
  totalEarned:        Number(raw?.totalEarned        ?? 0),
  cashedOut:          Number(raw?.cashedOut          ?? 0),
  pendingCashout:     Number(raw?.pendingCashout      ?? 0),
  todayDeliveries:    Number(raw?.todayDeliveries    ?? 0),
  todayEarned:        Number(raw?.todayEarned        ?? 0),
  weeklyDeliveries:   Number(raw?.weeklyDeliveries   ?? 0),
  weeklyEarned:       Number(raw?.weeklyEarned       ?? 0),
  monthlyDeliveries:  Number(raw?.monthlyDeliveries  ?? 0),
  monthlyEarned:      Number(raw?.monthlyEarned      ?? 0),
  interDistrictCount: Number(raw?.interDistrictCount ?? 0),
  sameDistrictCount:  Number(raw?.sameDistrictCount  ?? 0),
  assignedCount:      Number(raw?.assignedCount      ?? 0),
  inTransitCount:     Number(raw?.inTransitCount     ?? 0),
  activeTotal:        Number(raw?.activeTotal        ?? 0),
});

// ─────────────────────────────────────────────────
//  ATOMS
// ─────────────────────────────────────────────────
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

const DeliveryTypeBadge = ({ type }) => {
  const inter = type === "Inter District";
  return (
    <span
      className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap"
      style={{
        background: inter ? `${INTER}18` : `${CASH}18`,
        color:      inter ? INTER : CASH,
      }}
    >
      {inter ? "Inter" : "Same"}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const colorMap = { assigned: ACC, "in-transit": INTER };
  const color = colorMap[status] ?? "#64748b";
  return (
    <span className="flex items-center gap-1.5">
      <Motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-[8px] font-black uppercase tracking-widest"
        style={{ color }}
      >
        {status === "in-transit" ? "Moving" : "Assigned"}
      </span>
    </span>
  );
};

// ─────────────────────────────────────────────────
//  RECHARTS TOOLTIP
// ─────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-2xl border border-base-content/8 shadow-2xl"
      style={{ background: "var(--color-base-100)", minWidth: 100 }}
    >
      {label && (
        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">
          {label}
        </p>
      )}
      <p className="font-black text-sm" style={{ color: ACC }}>
        {payload[0].value}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────
//  KPI STAT CARD
// ─────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, color, sub, delay = 0 }) => {
  const ref    = useRef(null);
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
          {value}
        </p>
        {sub && (
          <p className="text-[9px] font-bold mt-1.5 opacity-30">{sub}</p>
        )}
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  EARNINGS HERO  — 3-panel card
// ─────────────────────────────────────────────────
const EarningsHero = ({ stats }) => {
  const cashPct =
    stats.totalEarned > 0
      ? Math.round((stats.cashedOut / stats.totalEarned) * 100)
      : 0;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden"
    >
      {/* Amber top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-0.75"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACC}70, ${ACC}, ${ACC}70, transparent)`,
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ACC}10, transparent 65%)`,
          filter: "blur(50px)",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-base-content/6">

        {/* ── Panel 1 : Lifetime ── */}
        <div className="p-7 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <TbCoinFilled className="text-base shrink-0" style={{ color: ACC }} />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] opacity-30">
              Lifetime Earned
            </span>
          </div>
          <p
            className="text-4xl font-black tabular-nums leading-none"
            style={{ color: ACC }}
          >
            ৳{stats.totalEarned.toLocaleString()}
          </p>
          <p className="text-[9px] font-bold opacity-25 mt-1">
            From {stats.totalDeliveries} completed deliveries
          </p>
          {/* Settlement progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
                Settled
              </span>
              <span className="text-[9px] font-black" style={{ color: CASH }}>
                {cashPct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-base-content/8 overflow-hidden">
              <Motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: CASH }}
                initial={{ width: 0 }}
                animate={{ width: `${cashPct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* ── Panel 2 : Cashed / Pending ── */}
        <div className="p-7 flex flex-col gap-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.28em] opacity-30 mb-2">
              Settled
            </p>
            <p
              className="text-2xl font-black tabular-nums leading-none"
              style={{ color: CASH }}
            >
              ৳{stats.cashedOut.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MdVerified className="text-xs shrink-0" style={{ color: CASH }} />
              <span className="text-[9px] font-bold opacity-30">Cashed out</span>
            </div>
          </div>
          <div className="h-px bg-base-content/5" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.28em] opacity-30 mb-2">
              Pending
            </p>
            <p
              className="text-2xl font-black tabular-nums leading-none"
              style={{ color: PEND }}
            >
              ৳{stats.pendingCashout.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MdOutlinePendingActions className="text-xs shrink-0" style={{ color: PEND }} />
              <span className="text-[9px] font-bold opacity-30">Awaiting cashout</span>
            </div>
          </div>
        </div>

        {/* ── Panel 3 : Velocity ── */}
        <div className="p-7 flex flex-col gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.28em] opacity-30 mb-1">
            Performance
          </p>
          {[
            { label: "Today", deliveries: stats.todayDeliveries,   earned: stats.todayEarned   },
            { label: "Week",  deliveries: stats.weeklyDeliveries,  earned: stats.weeklyEarned  },
            { label: "Month", deliveries: stats.monthlyDeliveries, earned: stats.monthlyEarned },
          ].map(({ label, deliveries, earned }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
                  {label}
                </span>
                <p className="text-xs font-black tabular-nums mt-0.5">
                  {deliveries} deliver{deliveries !== 1 ? "ies" : "y"}
                </p>
              </div>
              <span
                className="font-black text-sm tabular-nums"
                style={{ color: ACC }}
              >
                ৳{earned}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  ACTIVE TASK CARD
// ─────────────────────────────────────────────────
const ActiveTaskCard = ({ parcel, index }) => {
  const isMoving = parcel.delivery_status === "in-transit";
  const color    = isMoving ? INTER : ACC;

  return (
    <Motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-stretch rounded-2xl border border-base-content/5
        bg-base-100 overflow-hidden"
    >
      {/* Left colour stripe */}
      <div className="w-1 shrink-0" style={{ backgroundColor: color }} />

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-black truncate">{parcel.title}</p>
            <p className="text-[9px] font-mono opacity-25 font-bold tracking-wider mt-0.5">
              {parcel.trackingId}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusDot status={parcel.delivery_status} />
            {parcel.delivery_type && (
              <DeliveryTypeBadge type={parcel.delivery_type} />
            )}
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 text-[9px] font-bold opacity-30">
          <HiOutlineLocationMarker className="shrink-0" />
          <span className="truncate">
            {parcel.senderServiceCenter} → {parcel.receiverServiceCenter}
          </span>
        </div>

        {/* Earning estimate */}
        <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
            Est. Earning
          </span>
          <span className="font-black text-sm" style={{ color: ACC }}>
            ৳{
              parcel.earning ??
              Math.round((Number(parcel.cost) || 0) * (Number(parcel.earning_rate) || 0.3))
            }
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  COMPLETED DELIVERY ROW
// ─────────────────────────────────────────────────
const DeliveryRow = ({ parcel, index }) => {
  const cashed = parcel.cashout_status === "cashed_out";
  return (
    <Motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 py-3.5 border-b border-base-content/4.5 last:border-0"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: `${CASH}15`, color: CASH }}
      >
        <FaCheckCircle />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black leading-tight truncate">{parcel.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <HiOutlineLocationMarker className="text-[9px] opacity-20 shrink-0" />
          <p className="text-[9px] opacity-25 font-medium truncate">
            → {parcel.receiverServiceCenter}, {parcel.receiverRegion}
          </p>
          {parcel.delivery_type && (
            <DeliveryTypeBadge type={parcel.delivery_type} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
        <span className="font-black text-sm" style={{ color: ACC }}>
          ৳{parcel.earning ?? 0}
        </span>
        <span
          className="text-[8px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{
            background: cashed ? `${CASH}15` : `${PEND}15`,
            color:      cashed ? CASH : PEND,
          }}
        >
          {cashed ? "Cashed" : "Pending"}
        </span>
      </div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  DELIVERY TYPE CHART
//  Uses Cell instead of Motion.rect — Motion.rect
//  is not a valid Recharts child and throws in prod
// ─────────────────────────────────────────────────
const DeliveryTypeChart = ({ stats }) => {
  const total = stats.interDistrictCount + stats.sameDistrictCount;
  if (total === 0) return null;

  const data = [
    { name: "Inter District", count: stats.interDistrictCount, fill: INTER },
    { name: "Same District",  count: stats.sameDistrictCount,  fill: CASH  },
  ];

  return (
    <div className="p-5 flex flex-col gap-4">
      <p className="text-[9px] font-black uppercase tracking-[0.28em] opacity-30">
        Delivery Type Split
      </p>

      {/* Animated progress bars */}
      {data.map((d) => {
        const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
        return (
          <div key={d.name} className="flex items-center gap-3">
            <span
              className="text-[9px] font-black uppercase tracking-wide w-16 shrink-0"
              style={{ color: d.fill }}
            >
              {d.name === "Inter District" ? "Inter" : "Same"}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-base-content/8 overflow-hidden">
              <Motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.fill }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-black tabular-nums w-7 text-right shrink-0 opacity-50">
              {d.count}
            </span>
          </div>
        );
      })}

      {/* Recharts horizontal bar — Cell for colouring, NOT Motion.rect */}
      <div style={{ minHeight: 80 }}>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              fontSize={9}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", opacity: 0.3, fontWeight: 700 }}
              width={60}
            />
            <Tooltip
              content={<ChartTip />}
              cursor={{ fill: "currentColor", opacity: 0.04 }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────
//  PROFILE CARD
// ─────────────────────────────────────────────────
const ProfileCard = ({ profile, stats }) => {
  const initial = profile?.name?.charAt(0).toUpperCase() ?? "R";
  const bikeText =
    profile?.bikeBrand && profile?.bikeRegistration
      ? `${profile.bikeBrand} · ${profile.bikeRegistration}`
      : profile?.bikeBrand ?? "—";

  return (
    <div className="flex flex-col">
      {/* Avatar row */}
      <div
        className="flex items-center gap-4 p-5 border-b border-base-content/5.5"
        style={{ background: `${ACC}06` }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center
            text-xl font-black shrink-0"
          style={{ background: `${ACC}25`, color: ACC }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm truncate">{profile?.name ?? "—"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: CASH }}
            />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">
              Active Operative
            </span>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      {[
        { label: "District", value: profile?.district ?? "—" },
        { label: "Region",   value: profile?.region   ?? "—" },
        { label: "Bike",     value: bikeText               },
        { label: "Phone",    value: profile?.phone    ?? "—" },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between px-5 py-3
            border-b border-base-content/4.6 last:border-0"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-25 shrink-0">
            {label}
          </span>
          <span className="text-xs font-bold text-right ml-4 truncate max-w-40 opacity-70">
            {value}
          </span>
        </div>
      ))}

      {/* Quick KPIs */}
      <div className="grid grid-cols-2 border-t border-base-content/5.5">
        <div className="flex flex-col gap-1 p-4 border-r border-base-content/4.5">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
            Total Runs
          </span>
          <span className="text-xl font-black tabular-nums" style={{ color: ACC }}>
            {stats.totalDeliveries}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
            Active Now
          </span>
          <span className="text-xl font-black tabular-nums" style={{ color: INTER }}>
            {stats.activeTotal}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────
//  CARD SHELL + HEAD
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
    className="flex items-center justify-between px-5 py-4
      border-b border-base-content/5.5"
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
//  MAIN COMPONENT
// ─────────────────────────────────────────────────
const RiderDashboard = () => {
  const axiosSecure  = useAxiosSecure();
  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const {user, loading} = useAuthValue()
  const { data, isLoading } = useQuery({
    queryKey:        ["rider-dashboard"],
    queryFn:         async () =>
      (await axiosSecure.get("/rider/dashboard")).data,
    staleTime:       60_000,
    refetchInterval: 30_000,
    enabled: !loading && !!user
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  // ── Safe defaults — never undefined, never crashes ──
  const profile          = data?.profile          ?? {};
  const stats            = normalizeStats(data?.stats);
  const activeParcels    = data?.activeParcels    ?? [];
  const recentDeliveries = data?.recentDeliveries ?? [];

  const firstName = profile?.name?.split(" ")[0] ?? "Rider";

  return (
    <div className="space-y-8 font-urbanist pb-12">

      {/* ══ HEADER ══════════════════════════════════ */}
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
            Field Operative
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
              READY,
              <br />
              <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>
                {firstName.toUpperCase()}.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-35 mt-3 max-w-sm">
              {stats.activeTotal > 0
                ? `${stats.activeTotal} active task${stats.activeTotal > 1 ? "s" : ""} · ৳${stats.pendingCashout.toLocaleString()} pending cashout`
                : `${stats.totalDeliveries} total deliveries · ৳${stats.totalEarned.toLocaleString()} earned`
              }
            </p>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.22 }}
            className="flex gap-2 shrink-0"
          >
            {stats.activeTotal > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border
                  font-black text-xs uppercase tracking-wider"
                style={{
                  borderColor: `${ACC}35`,
                  background:  `${ACC}10`,
                  color: ACC,
                }}
              >
                <Motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ACC }}
                />
                {stats.activeTotal} Active
              </div>
            )}
            <Link
              to="/dashboard/pendingDeliveries"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs
                uppercase tracking-wider transition-all
                hover:scale-[1.03] hover:shadow-xl active:scale-95"
              style={{
                background: ACC,
                color: "#020617",
                boxShadow: `0 6px 24px ${ACC}35`,
              }}
            >
              <RiMotorbikeFill className="text-sm" /> My Tasks
            </Link>
          </Motion.div>
        </div>
      </div>

      {/* ══ KPI GRID ════════════════════════════════ */}
      <section>
        <SectionLabel>Performance</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={FaCheckCircle}
            label="Total Deliveries"
            value={stats.totalDeliveries}
            color={CASH}
            delay={0}
          />
          <StatCard
            icon={FaMoneyBillWave}
            label="Total Earned"
            value={`৳${stats.totalEarned.toLocaleString()}`}
            color={ACC}
            delay={0.06}
            sub={`৳${stats.cashedOut.toLocaleString()} cashed out`}
          />
          <StatCard
            icon={MdOutlineSpeed}
            label="This Week"
            value={stats.weeklyDeliveries}
            color={INTER}
            delay={0.12}
            sub={`৳${stats.weeklyEarned} earned`}
          />
          <StatCard
            icon={TbPackage}
            label="Active Tasks"
            value={stats.activeTotal}
            color={stats.activeTotal > 0 ? ACC : "#64748b"}
            delay={0.18}
            sub={`${stats.assignedCount} assigned · ${stats.inTransitCount} moving`}
          />
        </div>
      </section>

      {/* ══ EARNINGS HERO ═══════════════════════════ */}
      <section>
        <SectionLabel>Earnings Overview</SectionLabel>
        <EarningsHero stats={stats} />
      </section>

      {/* ══ ACTIVE QUEUE + PROFILE ══════════════════ */}
      <section>
        <SectionLabel>Active Queue</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Task list */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {activeParcels.length > 0 ? (
              <>
                {activeParcels.map((p, i) => (
                  <ActiveTaskCard key={p._id} parcel={p} index={i} />
                ))}
                {stats.activeTotal > activeParcels.length && (
                  <Link
                    to="/dashboard/pendingDeliveries"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl
                      text-[10px] font-black uppercase tracking-wider border
                      border-base-content/8 hover:border-base-content/20
                      transition-all opacity-50 hover:opacity-80"
                  >
                    View All {stats.activeTotal} Tasks{" "}
                    <FaArrowRight className="text-[9px]" />
                  </Link>
                )}
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-14
                  rounded-2xl border border-base-content/5 bg-base-100 gap-4"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${ACC}12`, color: ACC }}
                >
                  <FaRoute />
                </div>
                <div className="text-center">
                  <p className="font-black text-sm opacity-40">No active tasks</p>
                  <p className="text-[10px] opacity-20 font-bold mt-1">
                    New assignments will appear here
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile card */}
          <Card className="lg:col-span-5" accent={ACC} delay={0.08}>
            <CardHead icon={RiMotorbikeFill} title="Your Profile" />
            <ProfileCard profile={profile} stats={stats} />
          </Card>
        </div>
      </section>

      {/* ══ RECENT DELIVERIES + CHART ═══════════════ */}
      <section>
        <SectionLabel>Recent Deliveries</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Delivery feed */}
          <Card className="lg:col-span-7" accent={CASH}>
            <CardHead
              icon={FaCheckCircle}
              title="Completed Runs"
              color={CASH}
              right={
                <Link
                  to="/dashboard/completed-deliveries"
                  className="text-[9px] font-black uppercase tracking-widest
                    flex items-center gap-1"
                  style={{ color: CASH, opacity: 0.65 }}
                >
                  All <FaArrowRight className="text-[8px]" />
                </Link>
              }
            />
            <div className="px-5 divide-y divide-base-content/4">
              {recentDeliveries.length > 0 ? (
                recentDeliveries.map((p, i) => (
                  <DeliveryRow key={p._id} parcel={p} index={i} />
                ))
              ) : (
                <p className="text-xs opacity-20 font-bold py-8 text-center">
                  No completed deliveries yet
                </p>
              )}
            </div>
          </Card>

          {/* Right column */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Route analysis chart */}
            <Card accent={INTER} delay={0.08}>
              <CardHead
                icon={FaMapMarkerAlt}
                title="Route Analysis"
                color={INTER}
              />
              <DeliveryTypeChart stats={stats} />
              <div
                className="px-5 py-3.5 border-t border-base-content/5 flex gap-3"
                style={{ background: "var(--color-base-200)" }}
              >
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-1">
                    Same District
                  </p>
                  <p className="font-black" style={{ color: CASH }}>80% rate</p>
                </div>
                <div className="w-px bg-base-content/5" />
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mb-1">
                    Inter District
                  </p>
                  <p className="font-black" style={{ color: INTER }}>30% rate</p>
                </div>
              </div>
            </Card>

            {/* Cashout nudge — only renders when pending > 0 */}
            {stats.pendingCashout > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-base-content/5
                  bg-base-100 overflow-hidden p-5"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 100%, ${ACC}12, transparent 60%)`,
                  }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <TbCoinFilled className="shrink-0" style={{ color: ACC }} />
                  <span
                    className="text-[9px] font-black uppercase tracking-widest opacity-70"
                    style={{ color: ACC }}
                  >
                    Cashout Ready
                  </span>
                </div>
                <p
                  className="text-2xl font-black tabular-nums"
                  style={{ color: ACC }}
                >
                  ৳{stats.pendingCashout.toLocaleString()}
                </p>
                <p className="text-[10px] opacity-30 font-medium mt-1 mb-4">
                  Pending from{" "}
                  {recentDeliveries.filter(
                    (d) => d.cashout_status !== "cashed_out"
                  ).length}{" "}
                  recent deliveries. Head to earnings to withdraw.
                </p>
                <Link
                  to="/dashboard/myEarnings"
                  className="flex items-center gap-1.5 text-[10px] font-black
                    uppercase tracking-wider"
                  style={{ color: ACC }}
                >
                  Go to Earnings <FaArrowRight className="text-[8px]" />
                </Link>
              </Motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════ */}
      <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-15">
          Masakkali Courier — Field Operative Panel
        </p>
        <p
          className="text-[9px] font-black uppercase tracking-widest
            flex items-center gap-1.5 opacity-25"
          style={{ color: ACC }}
        >
          <MdElectricBolt /> Live · 30s
        </p>
      </div>

    </div>
  );
};

export default RiderDashboard;