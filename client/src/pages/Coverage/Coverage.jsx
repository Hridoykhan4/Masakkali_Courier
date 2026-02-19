import { useState, useMemo, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaSearch,
  FaMapMarkedAlt,
  FaGlobeAmericas,
  FaHashtag,
  FaCheckCircle,
  FaRoute,
  FaBoxOpen,
  FaClock,
  FaSignal,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import CoverageMap from "./CoverageMap";
import coverageData from "../../utils/coverageData";
import useScrollTo from "../../hooks/useScrollTo";
import useAuthValue from "../../hooks/useAuthValue";

// ─── CONFIG ──────────────────────────────────
const ACCENT = { admin: "#38bdf8", user: "#10b981", rider: "#fbbf24" };
const ITEMS_PER_PAGE = 12;

// ─── HELPERS ─────────────────────────────────
const Dot = ({ color, pulse }) => (
  <Motion.span
    animate={pulse ? { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] } : {}}
    transition={{ duration: 2, repeat: Infinity }}
    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
    style={{ backgroundColor: color }}
  />
);

const LivePill = ({ color }) => (
  <span
    className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full"
    style={{ color, background: `${color}18` }}
  >
    <Dot color={color} pulse />
    LIVE
  </span>
);

// ─── STAT CARD ───────────────────────────────
const StatCard = ({ value, label, icon, color, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group flex flex-col items-center text-center p-4 md:p-5 rounded-2xl border border-base-content/5 bg-base-200/50 overflow-hidden transition-all duration-400 hover:bg-base-200/80"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}14, transparent 65%)`,
        }}
      />
      <span className="text-base mb-2" style={{ color }}>
        {icon}
      </span>
      <span className="text-xl md:text-2xl font-black tabular-nums">
        {value}
      </span>
      <span className="text-[9px] uppercase font-black tracking-widest opacity-25 mt-0.5">
        {label}
      </span>
    </Motion.div>
  );
};

// ─────────────────────────────────────────────
// PANEL: CUSTOMER — paginated zone list
// ─────────────────────────────────────────────
const CustomerPanel = ({ data, color }) => {
  const [page, setPage] = useState(1);
  const paged = data.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paged.length < data.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-35">
          Delivery Zones
        </span>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ color, background: `${color}18` }}
        >
          {data.length} Areas
        </span>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {data.length === 0 ? (
          <Motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-14 gap-3 opacity-30"
          >
            <FaMapMarkedAlt className="text-2xl" />
            <p className="text-xs font-semibold italic">No zones found.</p>
          </Motion.div>
        ) : (
          paged.map((item, i) => (
            <Motion.div
              layout
              key={item.district}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, delay: Math.min(i, 5) * 0.03 }}
              className="group flex items-center justify-between px-4 py-3 rounded-xl border border-transparent hover:border-base-content/8 hover:bg-base-100/50 transition-all duration-200 cursor-default"
            >
              <div className="flex items-center gap-3">
                <Dot color={color} />
                <div>
                  <p className="font-bold text-sm leading-tight">
                    {item.district}
                  </p>
                  <p className="text-[9px] font-bold uppercase opacity-25 mt-0.5">
                    {item.region}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg"
                  style={{ color, background: `${color}12` }}
                >
                  <FaCheckCircle className="text-[8px]" />
                  Active
                </span>
                <FaChevronRight className="text-[9px] opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            </Motion.div>
          ))
        )}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-2 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border border-base-content/8 hover:border-base-content/20 opacity-40 hover:opacity-80 transition-all duration-200"
        >
          Show more · {data.length - paged.length} remaining
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PANEL: ADMIN — regional coverage bars
// ─────────────────────────────────────────────
const AdminPanel = ({ data, color }) => {
  const regions = useMemo(
    () => [...new Set(coverageData.map((d) => d.region))],
    [],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <span
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color }}
        >
          Regional Breakdown
        </span>
        <span className="text-[10px] opacity-30 font-bold">
          {regions.length} regions
        </span>
      </div>

      {regions.map((region, i) => {
        const visible = data.filter((d) => d.region === region).length;
        const total = coverageData.filter((d) => d.region === region).length;
        const pct = total > 0 ? Math.round((visible / total) * 100) : 0;
        return (
          <Motion.div
            key={region}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.38 }}
            className="bg-base-100/40 rounded-xl px-4 py-3.5 border border-base-content/5"
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <FaGlobeAmericas className="text-[10px] opacity-25" />
                <span className="text-xs font-black">{region}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color }}
                >
                  {visible}
                </span>
                <span className="text-[10px] opacity-20 font-medium">
                  / {total}
                </span>
              </div>
            </div>
            <div className="relative h-1 w-full bg-base-content/8 rounded-full overflow-hidden">
              <Motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.04 + 0.1,
                  ease: "easeOut",
                }}
              />
            </div>
            <p className="text-[9px] opacity-20 font-bold mt-1.5 text-right">
              {pct}% visible
            </p>
          </Motion.div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// PANEL: RIDER — ops metrics + compact zones
// ─────────────────────────────────────────────
const OPS = [
  { label: "Active Routes", val: "24", icon: <FaRoute />, change: "+3" },
  { label: "Avg. ETA", val: "38m", icon: <FaClock />, change: "Good" },
  { label: "Open Parcels", val: "142", icon: <FaBoxOpen />, change: "+12" },
  { label: "Network Load", val: "72%", icon: <FaSignal />, change: "Norm" },
];

const RiderPanel = ({ data, color }) => (
  <div className="flex flex-col gap-3">
    <span
      className="text-[10px] font-black uppercase tracking-widest px-1 mb-0.5"
      style={{ color }}
    >
      Live Operations
    </span>

    <div className="grid grid-cols-2 gap-2">
      {OPS.map((m, i) => (
        <Motion.div
          key={m.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-base-100/40 rounded-xl p-3 border border-base-content/5"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="opacity-25 text-xs mt-0.5">{m.icon}</span>
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
              style={{ color, background: `${color}15` }}
            >
              {m.change}
            </span>
          </div>
          <p className="text-xl font-black leading-none" style={{ color }}>
            {m.val}
          </p>
          <p className="text-[9px] uppercase font-bold opacity-25 mt-1">
            {m.label}
          </p>
        </Motion.div>
      ))}
    </div>

    <div className="mt-1">
      <span className="text-[9px] font-black uppercase tracking-widest opacity-25 px-1 block mb-2">
        Assigned Zones · {data.length}
      </span>
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {data.slice(0, 10).map((item, i) => (
            <Motion.div
              layout
              key={item.district}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.025 }}
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-base-100/30 border border-base-content/5"
            >
              <div className="flex items-center gap-2">
                <MdElectricBolt
                  style={{ color }}
                  className="text-xs flex-shrink-0"
                />
                <span className="text-xs font-bold">{item.district}</span>
              </div>
              <span className="text-[9px] opacity-25 font-medium">
                {item.region}
              </span>
            </Motion.div>
          ))}
        </AnimatePresence>
        {data.length > 10 && (
          <p className="text-center text-[9px] opacity-25 font-bold pt-1">
            +{data.length - 10} more zones
          </p>
        )}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MAIN COVERAGE COMPONENT
// ─────────────────────────────────────────────
const Coverage = () => {
  useScrollTo();

  // Read role from your auth context.
  // Expects user.role to be "admin" | "user" | "rider".
  // Falls back to "user" for unauthenticated visitors.
  const { user } = useAuthValue?.() ?? {};
  const role = user?.role ?? "user";
  const color = ACCENT[role] ?? ACCENT.user;

  const [query, setQuery] = useState("");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return coverageData;
    return coverageData.filter(
      (d) =>
        d.district.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q),
    );
  }, [query]);

  const stats = useMemo(
    () => ({
      districts: [...new Set(coverageData.map((d) => d.district))].length,
      regions: [...new Set(coverageData.map((d) => d.region))].length,
      hubs: coverageData.length,
    }),
    [],
  );

  const clearQuery = useCallback(() => setQuery(""), []);

  // Role-specific copy and CTA
  const copy = {
    admin: {
      eyebrow: "Network Control",
      desc: "Monitor and manage every district, region, and hub across the national delivery network.",
      panelLabel: "Region Overview",
      cta: "Export Report",
      ctaIcon: <MdVerified />,
    },
    user: {
      eyebrow: "Delivery Coverage",
      desc: "Find out if we deliver to your area. Search any district or region below.",
      panelLabel: "Available Zones",
      cta: "Request My Area",
      ctaIcon: <MdElectricBolt />,
    },
    rider: {
      eyebrow: "Operational Network",
      desc: "Check your assigned zones, active routes, and real-time network load.",
      panelLabel: "Ops Dashboard",
      cta: "View Full Routes",
      ctaIcon: <IoSpeedometer />,
    },
  }[role];

  return (
    <section className="relative container-page section-spacing overflow-hidden font-urbanist">
      {/* ── STATIC AMBIENT GLOWS (no AnimatePresence = lighter) ── */}
      <div
        className="absolute -top-48 -right-40 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute -bottom-28 -left-20 w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}07 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      {/* ── HEADER ── */}
      <div ref={headerRef} className="relative mb-12">
        <Motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 mb-5"
        >
          <Dot color={color} pulse />
          <span
            className="text-[11px] font-black tracking-[0.3em] uppercase"
            style={{ color }}
          >
            {copy.eyebrow}
          </span>
        </Motion.div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="max-w-xl">
            <Motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.88]"
            >
              NATIONWIDE
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${color}`,
                  color: "transparent",
                  display: "inline-block",
                }}
              >
                REACH.
              </span>
            </Motion.h1>
            <Motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 0.45 } : {}}
              transition={{ delay: 0.25 }}
              className="text-sm md:text-base font-medium mt-4 leading-relaxed text-base-content"
            >
              {copy.desc}
            </Motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 w-full lg:w-auto lg:min-w-[270px]">
            <StatCard
              value={stats.districts}
              label="Districts"
              icon={<FaHashtag />}
              color={color}
              delay={0.15}
            />
            <StatCard
              value={stats.regions}
              label="Regions"
              icon={<FaGlobeAmericas />}
              color={color}
              delay={0.22}
            />
            <StatCard
              value={stats.hubs}
              label="Hubs"
              icon={<FaMapMarkedAlt />}
              color={color}
              delay={0.29}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SIDEBAR */}
        <div
          className="lg:col-span-4 flex flex-col gap-4"
          style={{ minHeight: 520 }}
        >
          {/* Search */}
          <div className="relative group">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-30 group-focus-within:opacity-75 transition-opacity"
              style={{ color }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search district or region…"
              className="w-full h-12 pl-11 pr-10 rounded-2xl text-sm font-semibold placeholder:opacity-35 outline-none border transition-all duration-250"
              style={{
                background: "var(--color-base-200)",
                borderColor: query ? `${color}45` : "transparent",
              }}
            />
            <AnimatePresence>
              {query && (
                <Motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearQuery}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-65 transition-opacity"
                >
                  <FaTimes className="text-xs" />
                </Motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Panel */}
          <div
            className="flex-1 rounded-3xl border border-base-content/5 overflow-hidden flex flex-col"
            style={{ background: "var(--color-base-200)" }}
          >
            {/* Panel header */}
            <div
              className="px-5 py-3.5 flex items-center justify-between border-b border-base-content/5 flex-shrink-0"
              style={{ background: `${color}08` }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {copy.panelLabel}
              </span>
              <LivePill color={color} />
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {role === "admin" && (
                <AdminPanel data={filteredData} color={color} />
              )}
              {role === "user" && (
                <CustomerPanel data={filteredData} color={color} />
              )}
              {role === "rider" && (
                <RiderPanel data={filteredData} color={color} />
              )}
            </div>
          </div>
        </div>

        {/* MAP */}
        <div
          className="lg:col-span-8 order-first lg:order-last"
          style={{ minHeight: 440 }}
        >
          <div
            className="relative w-full h-full rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-base-content/5"
            style={{ minHeight: 440 }}
          >
            <div className="absolute inset-0 z-0">
              <CoverageMap coverageData={filteredData} />
            </div>

            {/* Premium edge fades */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-base-200/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-base-200/50 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-base-200/40 to-transparent" />
              <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-base-200/40 to-transparent" />
            </div>

           
            {/* Top-right: zone count — updates with search */}
            <AnimatePresence mode="wait">
              <Motion.div
                key={filteredData.length}
                initial={{ opacity: 0, y: -8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.92 }}
                transition={{ duration: 0.28 }}
                className="absolute top-3 right-8 z-20"
              >
                <div
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-md border font-black text-[11px]"
                  style={{
                    background: `${color}20`,
                    borderColor: `${color}35`,
                    color,
                  }}
                >
                  <FaMapMarkedAlt className="text-xs" />
                  {filteredData.length}{" "}
                  {filteredData.length === 1 ? "Zone" : "Zones"}
                </div>
              </Motion.div>
            </AnimatePresence>

            {/* Bottom-left: country */}
            <div className="absolute bottom-4 left-4 z-20">
              <div
                className="px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-base-100) 80%, transparent)",
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
                  Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coverage;
