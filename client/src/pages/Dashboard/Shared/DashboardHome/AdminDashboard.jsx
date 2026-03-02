import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import {
  FaUsers, FaMotorcycle, FaBox, FaCheckCircle, FaMoneyBillWave,
} from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import { HiOutlineTrendingUp } from "react-icons/hi";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion as Motion, useInView } from "framer-motion";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

// ── STATUS PALETTE ────────────────────────
const STATUS_COLORS = {
  delivered:   "#10b981",
  pending:     "#fbbf24",
  assigned:    "#38bdf8",
  "in-transit":"#a78bfa",
  cancelled:   "#f87171",
  default:     "#64748b",
};

// ── STAT CARD META ────────────────────────
const STATS_META = [
  { key: "totalUsers",     label: "Total Users",      icon: FaUsers,        color: "#38bdf8" },
  { key: "totalRiders",    label: "Active Riders",    icon: FaMotorcycle,   color: "#fbbf24" },
  { key: "totalParcels",   label: "Total Parcels",    icon: FaBox,          color: "#a78bfa" },
  { key: "deliveredToday", label: "Delivered Today",  icon: FaCheckCircle,  color: "#10b981" },
  { key: "revenueToday",   label: "Revenue Today",    icon: FaMoneyBillWave,color: "#34d399", prefix: "৳ " },
];

// ── CUSTOM TOOLTIP ─────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const color = payload[0]?.fill ?? "var(--color-primary)";
  return (
    <div
      className="px-4 py-3 rounded-2xl border border-base-content/8 shadow-2xl backdrop-blur-sm text-sm"
      style={{ background: "var(--color-base-100)" }}
    >
      <p className="text-[9px] font-black uppercase tracking-widest opacity-35 mb-1">{label}</p>
      <p className="font-black" style={{ color }}>
        {payload[0].value} <span className="text-[10px] opacity-40 font-medium">parcels</span>
      </p>
    </div>
  );
};

// ── STAT CARD ──────────────────────────────
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, color, prefix = "", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden transition-all duration-400 hover:border-base-content/10 hover:shadow-xl"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${color}12, transparent 65%)` }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}18`, color }}
        >
          <Icon />
        </div>
        {/* Live pulse */}
        <div className="flex items-center gap-1.5">
          <Motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[8px] font-black uppercase tracking-widest opacity-25">Live</span>
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl md:text-3xl font-black tabular-nums leading-none" style={{ color }}>
          {prefix}{value ?? 0}
        </p>
        <p className="text-[9px] font-black uppercase tracking-widest opacity-25 mt-1.5">{label}</p>
      </div>
    </Motion.div>
  );
};

// ── STATUS MINI CARD ──────────────────────
const StatusMini = ({ status, count, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const color = STATUS_COLORS[status] ?? STATUS_COLORS.default;
  const label = status.replace("-", " ");

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden transition-all duration-300 hover:border-base-content/10"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 100%, ${color}10, transparent 70%)` }}
      />
      {/* Bottom accent bar */}
      <Motion.div
        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.15, ease: "easeOut" }}
      />
      <p
        className="text-[9px] font-black uppercase tracking-[0.25em] "
        style={{ color }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-black tabular-nums leading-none">{count}</p>
        <span className="text-[9px] font-bold opacity-25 uppercase tracking-widest mb-0.5">units</span>
      </div>
    </Motion.div>
  );
};

// ── CHARTS SECTION ─────────────────────────
const DeliveryCharts = ({ data }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const formatted = data.map((d) => ({
    name: d.status.charAt(0).toUpperCase() + d.status.slice(1).replace("-", " "),
    value: d.count,
    color: STATUS_COLORS[d.status] ?? STATUS_COLORS.default,
  }));

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-5">

      {/* BAR CHART */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-base-content/5"
          style={{ background: "color-mix(in srgb, var(--color-primary) 4%, transparent)" }}
        >
          <div className="flex items-center gap-2">
            <HiOutlineTrendingUp className="text-primary text-base" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Delivery Volume</span>
          </div>
          <span
            className="text-[9px] font-black px-2 py-1 rounded-full"
            style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
          >
            By Status
          </span>
        </div>

        <div className="p-4 md:p-6" style={{ minHeight: 280 }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.4, fontWeight: 700 }}
              />
              <YAxis
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.3, fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={40}>
                {formatted.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Motion.div>

      {/* DONUT CHART */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5 rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-base-content/5"
          style={{ background: "color-mix(in srgb, var(--color-primary) 4%, transparent)" }}
        >
          <div className="flex items-center gap-2">
            <MdElectricBolt className="text-primary text-base" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Distribution</span>
          </div>
        </div>
        
        <div className="p-4 md:p-6" style={{ minHeight: 280 }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={formatted}
                dataKey="value"
                nameKey="name"
                innerRadius="52%"
                outerRadius="72%"
                paddingAngle={4}
                stroke="none"
              >
                {formatted.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", fontWeight: 700, paddingTop: 16, opacity: 0.6 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Motion.div>
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────
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
    queryFn: async () => (await axiosSecure.get("/parcels/delivery/status-count")).data,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="space-y-8 font-urbanist">

      {/* ── HEADER ── */}
      <div ref={headerRef}>
        <Motion.div
          // initial={{ opacity: 0, x: -14 }}
          // animate={headerInView ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-2.5 mb-4"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary shrink-0"
          />
          <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
            System Analytics
          </span>
        </Motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Motion.div
            // initial={{ opacity: 0, y: 22 }}
            // animate={headerInView ? { opacity: 1, y: 0 } : {}}
            // transition={{ delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
              COMMAND
              <br />
              <span style={{ WebkitTextStroke: "2px var(--color-primary)", color: "transparent" }}>
                CENTER.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-40 mt-3">
              Real-time monitoring of all delivery operations.
            </p>
          </Motion.div>

          {/* Date + time chip */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-start sm:items-end gap-0.5 shrink-0"
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-25">{dateStr}</p>
            <p className="text-2xl font-black tabular-nums text-primary leading-none">{timeStr}</p>
          </Motion.div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {STATS_META.map((s, i) => (
          <StatCard
            key={s.key}
            icon={s.icon}
            label={s.label}
            value={overview?.[s.key]}
            color={s.color}
            prefix={s.prefix ?? ""}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div>
        <Motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            Logistics Performance
          </span>
          <div className="flex-1 h-px bg-base-content/5" />
        </Motion.div>

        <DeliveryCharts data={statusCount} />
      </div>

      {/* ── STATUS MINI CARDS ── */}
      <div>
        <Motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            Status Breakdown
          </span>
          <div className="flex-1 h-px bg-base-content/5" />
        </Motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {statusCount.map((item, i) => (
            <StatusMini
              key={item.status}
              status={item.status}
              count={item.count}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;