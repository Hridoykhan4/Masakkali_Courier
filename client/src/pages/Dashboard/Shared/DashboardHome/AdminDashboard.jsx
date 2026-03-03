import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  FaUsers,
  FaMotorcycle,
  FaBox,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaTruck,
  FaBan,
} from "react-icons/fa";
import { MdElectricBolt, MdLocalShipping } from "react-icons/md";
import { HiOutlineTrendingUp, HiOutlineLocationMarker } from "react-icons/hi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

// ── PALETTE ───────────────────────────────────────────────────
const S = {
  delivered: { color: "#10b981", label: "Delivered" },
  pending: { color: "#fbbf24", label: "Pending" },
  assigned: { color: "#38bdf8", label: "Assigned" },
  "in-transit": { color: "#a78bfa", label: "In Transit" },
  cancelled: { color: "#f87171", label: "Cancelled" },
};
const sc = (key) => S[key]?.color ?? "#64748b";
const sl = (key) => S[key]?.label ?? key;

// ── RECHARTS TOOLTIP ─────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const color =
    payload[0]?.fill ?? payload[0]?.stroke ?? "var(--color-primary)";
  return (
    <div
      className="px-4 py-3 rounded-2xl border border-base-content/8 shadow-2xl text-sm"
      style={{ background: "var(--color-base-100)", minWidth: 120 }}
    >
      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">
        {label}
      </p>
      <p className="font-black" style={{ color }}>
        {payload[0].value}
        <span className="text-[10px] opacity-35 font-medium ml-1">
          {payload[0].name === "count" ? "parcels" : ""}
        </span>
      </p>
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────
// Values ALWAYS visible — no hover required
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
      className="relative flex flex-col justify-between gap-4 p-5 rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden"
    >
      {/* Permanent ambient glow — visible on mobile too */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}20, transparent 70%)`,
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
        <div className="flex items-center gap-1.5">
          <Motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[8px] font-black uppercase tracking-widest opacity-25">
            Live
          </span>
        </div>
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
        {sub && (
          <p
            className="text-[9px] font-bold mt-2 flex items-center gap-1"
            style={{ color, opacity: 0.5 }}
          >
            <MdElectricBolt />
            {sub}
          </p>
        )}
      </div>
    </Motion.div>
  );
};

// ── STATUS CARD — always shows progress bar + % ───────────────
const StatusCard = ({ status, count, total, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const color = sc(status);
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="relative flex flex-col gap-3 p-5 rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden"
    >
      {/* Top color bar */}
      <Motion.div
        className="absolute top-0 left-0 right-0 h-0.75"
        style={{ backgroundColor: color, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
      />
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] font-black uppercase tracking-[0.22em]"
          style={{ color }}
        >
          {sl(status)}
        </span>
        <span
          className="text-[9px] font-black tabular-nums px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}
        >
          {pct}%
        </span>
      </div>
      <p className="text-3xl font-black tabular-nums leading-none">{count}</p>
      <div className="h-1 rounded-full bg-base-content/5 overflow-hidden">
        <Motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.9, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
    </Motion.div>
  );
};

// ── REVENUE SWITCHER PANEL ───────────────────────────────────
const WINDOWS = [
  { key: "revenueToday", label: "Today", sub: "Since midnight" },
  { key: "revenue7d", label: "7 Days", sub: "Rolling window" },
  { key: "revenue30d", label: "30 Days", sub: "Rolling window" },
];
const RevenuePanel = ({ overview }) => {
  const [active, setActive] = useState(0);
  const color = "#10b981";
  const values = WINDOWS.map((w) => overview?.[w.key] ?? 0);
  const max = Math.max(...values, 1);
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-base-content/5 bg-base-100 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-sm" style={{ color }} />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-35">
            Revenue
          </span>
        </div>
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "var(--color-base-200)" }}
        >
          {WINDOWS.map((w, i) => (
            <button
              key={w.key}
              onClick={() => setActive(i)}
              className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200"
              style={
                active === i
                  ? { background: color, color: "#020617" }
                  : { opacity: 0.3 }
              }
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <Motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <p
            className="text-3xl font-black tabular-nums leading-none"
            style={{ color }}
          >
            ৳ {values[active].toLocaleString()}
          </p>
          <p className="text-[9px] opacity-30 font-bold uppercase tracking-widest mt-1.5">
            {WINDOWS[active].sub}
          </p>
        </Motion.div>
      </AnimatePresence>
      {/* Mini comparison bars */}
      <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-base-content/5">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-10 rounded-xl bg-base-content/5 flex items-end overflow-hidden">
              <Motion.div
                className="w-full rounded-xl transition-all duration-300"
                style={{ backgroundColor: active === i ? color : `${color}35` }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, (v / max) * 100)}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
            <p className="text-[8px] font-black opacity-20 uppercase tracking-widest text-center">
              {WINDOWS[i].label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ACTIVITY ITEM ────────────────────────────────────────────
const ActivityItem = ({ item, index }) => {
  const color = sc(item.status);
  const name = item.senderName || "Unknown sender";
  const dest = item.receiverDistrict || item.receiverAddress || "Unknown";
  return (
    <Motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 py-3.5 border-b border-base-content/4 last:border-0"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0"
        style={{ background: `${color}15`, color }}
      >
        <MdLocalShipping />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-black leading-tight truncate">{name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <HiOutlineLocationMarker className="text-[9px] opacity-25 shrink-0" />
          <p className="text-[9px] opacity-25 font-medium truncate">{dest}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className="text-[8px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: `${color}15`, color }}
        >
          {sl(item.status)}
        </span>
        <span className="text-[9px] font-bold opacity-20">৳{item.cost}</span>
      </div>
    </Motion.div>
  );
};

// ── DISTRICT BAR ──────────────────────────────────────────────
const DistrictBar = ({ district, count, max, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const colors = ["#38bdf8", "#10b981", "#fbbf24", "#a78bfa", "#f87171"];
  const color = colors[index] ?? "#64748b";
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div ref={ref} className="flex items-center gap-3 py-2.5">
      <p
        className="text-[9px] font-black uppercase tracking-wider w-20 shrink-0 truncate"
        style={{ color }}
      >
        {district}
      </p>
      <div className="flex-1 h-1.5 rounded-full bg-base-content/5 overflow-hidden">
        <Motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.7, delay: index * 0.07, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-black tabular-nums w-7 text-right shrink-0 opacity-60">
        {count}
      </span>
    </div>
  );
};

// ── SECTION DIVIDER ──────────────────────────────────────────
const Divider = ({ children }) => (
  <Motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-3 mb-4"
  >
    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 whitespace-nowrap">
      {children}
    </span>
    <div className="flex-1 h-px bg-base-content/5" />
  </Motion.div>
);

// ── CHART CARD WRAPPER ───────────────────────────────────────
const ChartCard = ({ title, chip, children, delay = 0, className = "" }) => (
  <Motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden ${className}`}
  >
    <div
      className="flex items-center justify-between px-5 py-4 border-b border-base-content/5"
      style={{
        background: "color-mix(in srgb, var(--color-primary) 4%, transparent)",
      }}
    >
      <span className="text-[10px] font-black uppercase tracking-widest opacity-35">
        {title}
      </span>
      {chip && (
        <span
          className="text-[9px] font-black px-2.5 py-1 rounded-full"
          style={{
            color: "var(--color-primary)",
            background:
              "color-mix(in srgb, var(--color-primary) 12%, transparent)",
          }}
        >
          {chip}
        </span>
      )}
    </div>
    {children}
  </Motion.div>
);

// ─────────────────────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const { data: overview, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await axiosSecure.get("/admin/overview")).data,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  const { data: statusCount = [] } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () =>
      (await axiosSecure.get("/parcels/delivery/status-count")).data,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  const totalParcels = statusCount.reduce((s, i) => s + i.count, 0);

  const chartData = statusCount.map((d) => ({
    name: sl(d.status),
    value: d.count,
    color: sc(d.status),
  }));

  const lineData = (overview?.dailyVolume ?? []).map((d) => ({
    date: d.date?.slice(5) ?? "", // "MM-DD"
    count: d.count,
  }));

  const now = new Date();

  return (
    <div className="space-y-8 font-urbanist pb-10">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div ref={headerRef}>
        <Motion.div
          className="flex items-center gap-2.5 mb-4"
        >
          <Motion.span
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary shrink-0"
          />
          <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
            System Analytics
          </span>
        </Motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <Motion.div
            transition={{ delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.88]">
              COMMAND
              <br />
              <span
                style={{
                  WebkitTextStroke: "2px var(--color-primary)",
                  color: "transparent",
                }}
              >
                CENTER.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-30 mt-3 max-w-xs">
              Real-time monitoring of all Masakkali delivery operations.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.22 }}
            className="flex flex-col items-start sm:items-end gap-1 shrink-0"
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">
              {now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className="text-3xl font-black tabular-nums text-primary leading-none">
              {now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
              />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
                Refreshes every 30s
              </span>
            </div>
          </Motion.div>
        </div>
      </div>

      {/* ── KPI GRID ─────────────────────────────────────── */}
      <section>
        <Divider>Key Metrics</Divider>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            icon={FaUsers}
            label="Total Users"
            value={overview?.totalUsers}
            color="#38bdf8"
            sub={`+${overview?.newUsersToday ?? 0} today`}
            delay={0}
          />
          <StatCard
            icon={FaMotorcycle}
            label="Active Riders"
            value={overview?.totalRiders}
            color="#fbbf24"
            delay={0.05}
          />
          <StatCard
            icon={FaBox}
            label="Total Parcels"
            value={overview?.totalParcels}
            color="#a78bfa"
            delay={0.1}
          />
          <StatCard
            icon={FaCheckCircle}
            label="Delivered Today"
            value={overview?.deliveredToday}
            color="#10b981"
            delay={0.15}
          />
          <StatCard
            icon={FaClock}
            label="Pending Now"
            value={overview?.pendingCount}
            color="#fbbf24"
            sub="Awaiting pickup"
            delay={0.2}
          />
        </div>
      </section>

      {/* ── STATUS BREAKDOWN ──────────────────────────────── */}
      <section>
        <Divider>Status Breakdown</Divider>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statusCount.map((item, i) => (
            <StatusCard
              key={item.status}
              status={item.status}
              count={item.count}
              total={totalParcels}
              delay={i * 0.06}
            />
          ))}
          {statusCount.length === 0 && (
            <div className="col-span-full py-10 text-center opacity-20 text-sm font-bold">
              No parcel data yet
            </div>
          )}
        </div>
      </section>

      {/* ── REVENUE + SPARKLINE ───────────────────────────── */}
      <section>
        <Divider>Revenue & Volume</Divider>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <RevenuePanel overview={overview} />
          </div>
          <ChartCard
            title="7-Day Parcel Volume"
            chip="Trend"
            delay={0.08}
            className="lg:col-span-8"
          >
            <div className="p-4 md:p-5" style={{ minHeight: 200 }}>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart
                    data={lineData}
                    margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      strokeOpacity={0.05}
                    />
                    <XAxis
                      dataKey="date"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "currentColor",
                        opacity: 0.35,
                        fontWeight: 700,
                      }}
                    />
                    <YAxis
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "currentColor",
                        opacity: 0.28,
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip content={<Tip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="count"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      dot={{
                        fill: "var(--color-primary)",
                        r: 4,
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 text-sm font-bold">
                  No volume data in last 7 days
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ── CHARTS ───────────────────────────────────────── */}
      <section>
        <Divider>Logistics Performance</Divider>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <ChartCard title="Volume by Status" className="lg:col-span-7">
            <div className="p-4" style={{ minHeight: 260 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "currentColor",
                        opacity: 0.38,
                        fontWeight: 700,
                      }}
                    />
                    <YAxis
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "currentColor",
                        opacity: 0.28,
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip
                      content={<Tip />}
                      cursor={{ fill: "currentColor", opacity: 0.04 }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
                      {chartData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 text-sm font-bold py-16">
                  No data
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Distribution"
            className="lg:col-span-5"
            delay={0.08}
          >
            <div className="p-4" style={{ minHeight: 260 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="50%"
                      outerRadius="72%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {chartData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<Tip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{
                        fontSize: "10px",
                        fontWeight: 700,
                        paddingTop: 14,
                        opacity: 0.5,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 text-sm font-bold py-16">
                  No data
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ── BOTTOM INSIGHTS ──────────────────────────────── */}
      <section>
        <Divider>Insights</Divider>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Top Districts */}
          <ChartCard title="Top Districts" className="lg:col-span-5">
            <div className="px-5 py-2 pb-4">
              {(overview?.topDistricts ?? []).length > 0 ? (
                overview.topDistricts.map((d, i) => (
                  <DistrictBar
                    key={d.district}
                    district={d.district}
                    count={d.count}
                    max={overview.topDistricts[0].count}
                    index={i}
                  />
                ))
              ) : (
                <p className="text-xs opacity-20 font-bold py-8 text-center">
                  No district data yet
                </p>
              )}
            </div>
          </ChartCard>

          {/* Recent Activity */}
          <ChartCard
            title="Recent Activity"
            chip={
              <span className="flex items-center gap-1.5">
                <Motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
                />
                Live
              </span>
            }
            className="lg:col-span-7"
            delay={0.08}
          >
            <div className="px-5">
              {(overview?.recentActivity ?? []).length > 0 ? (
                overview.recentActivity.map((item, i) => (
                  <ActivityItem key={item._id} item={item} index={i} />
                ))
              ) : (
                <p className="text-xs opacity-20 font-bold py-10 text-center">
                  No recent activity
                </p>
              )}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ── EXTRA KPIs STRIP ─────────────────────────────── */}
      <section>
        <Divider>Network Health</Divider>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: FaTruck,
              label: "In Transit",
              value: overview?.inTransitCount,
              color: "#a78bfa",
            },
            {
              icon: FaBan,
              label: "Cancelled",
              value: overview?.cancelledCount,
              color: "#f87171",
            },
            {
              icon: FaUsers,
              label: "New Users 7d",
              value: overview?.newUsers7d,
              color: "#38bdf8",
            },
            {
              icon: FaMoneyBillWave,
              label: "Revenue 30d",
              value: `৳${(overview?.revenue30d ?? 0).toLocaleString()}`,
              color: "#10b981",
            },
          ].map((s, i) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
              color={s.color}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-15">
          Masakkali Courier — Command Center
        </p>
        <p className="text-[9px] font-black uppercase tracking-widest opacity-25 flex items-center gap-1.5 text-primary">
          <MdElectricBolt />
          System Online
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
