import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaUserShield,
  FaIdBadge,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaCheckCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import RiderReviewModal from "../../../../components/RiderReviewModal";

// ── ACCENT FOR ADMIN ──────────────────────
const COLOR = "#38bdf8";

// ── STAT CARD ─────────────────────────────
const StatCard = ({ icon, label, value, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative group flex flex-col gap-2 p-5 rounded-2xl border border-base-content/5 bg-base-200/50 overflow-hidden transition-all duration-400 hover:bg-base-200/80"
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
      <p className="text-2xl font-black tabular-nums leading-none">{value}</p>
      <p className="text-[9px] uppercase font-black tracking-widest opacity-25">
        {label}
      </p>
    </Motion.div>
  );
};

// ── RIDER ROW ─────────────────────────────
const RiderRow = ({ rider, index, onReview }) => (
  <Motion.tr
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: 24, scale: 0.97 }}
    transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
    className="group border-b border-base-content/4 last:border-0 hover:bg-base-200/40 transition-colors duration-200"
  >
    {/* Applicant */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm shrink-0 transition-all duration-300 group-hover:scale-105"
          style={{ background: `${COLOR}15`, color: COLOR }}
        >
          <FaIdBadge />
        </div>
        <div>
          <p className="font-black text-sm leading-tight">{rider.name}</p>
          <p className="text-[10px] opacity-30 font-medium mt-0.5">
            {rider.phone}
          </p>
        </div>
      </div>
    </td>

    {/* Zone */}
    <td className="px-4 py-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-xs font-black">
          <FaMapMarkerAlt
            className="text-[10px] shrink-0"
            style={{ color: COLOR }}
          />
          {rider.district}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 ml-4">
          {rider.region}
        </span>
      </div>
    </td>

    {/* Demographics */}
    <td className="px-4 py-4">
      <p className="text-xs font-black">{rider.age} yrs</p>
      <p className="text-[9px] opacity-25 font-bold mt-0.5">
        {new Date(rider.appliedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </td>

    {/* Vehicle */}
    <td className="px-4 py-4">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-base-content/8"
        style={{ background: `${COLOR}08`, color: COLOR }}
      >
        <FaMotorcycle className="text-[10px]" />
        {rider.bikeBrand}
      </div>
    </td>

    {/* Action */}
    <td className="px-6 py-4 text-right">
      <button
        onClick={() => onReview(rider)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-base-content/8 hover:border-transparent transition-all duration-250 hover:scale-[1.03] hover:shadow-lg ml-auto"
        style={{
          background: "transparent",
          transition: "background 0.25s, color 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLOR;
          e.currentTarget.style.color = "#020617";
          e.currentTarget.style.borderColor = COLOR;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "";
          e.currentTarget.style.borderColor = "";
        }}
      >
        <MdVerified className="text-sm" />
        Review
      </button>
    </td>
  </Motion.tr>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [query, setQuery] = useState("");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  const filtered = query.trim()
    ? riders.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.district.toLowerCase().includes(query.toLowerCase()) ||
          r.region.toLowerCase().includes(query.toLowerCase()),
      )
    : riders;

  // derive stat
  const regions = [...new Set(riders.map((r) => r.region))].length;

  return (
    <div className="space-y-6 font-urbanist">
      {/* ── HEADER ── */}
      <div ref={headerRef}>
        <Motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-2.5 mb-4"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: COLOR }}
          />
          <span
            className="text-[11px] font-black tracking-[0.3em] uppercase"
            style={{ color: COLOR }}
          >
            Fleet Management
          </span>
        </Motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
              PENDING
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${COLOR}`,
                  color: "transparent",
                }}
              >
                RECRUITS.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-40 mt-3 max-w-sm">
              Review, verify, and onboard rider applicants to the active fleet.
            </p>
          </Motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:min-w-70">
            <StatCard
              icon={<FaUserShield />}
              label="Backlog"
              value={riders.length}
              color={COLOR}
              delay={0.1}
            />
            <StatCard
              icon={<FaMapMarkerAlt />}
              label="Regions"
              value={regions}
              color="#10b981"
              delay={0.15}
            />
            <StatCard
              icon={<MdElectricBolt />}
              label="Today"
              value={
                riders.filter((r) => {
                  const d = new Date(r.appliedAt);
                  const now = new Date();
                  return d.toDateString() === now.toDateString();
                }).length
              }
              color="#fbbf24"
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* ── SEARCH + TABLE CARD ── */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-base-content/5 overflow-hidden"
        style={{ background: "var(--color-base-100)" }}
      >
        {/* Card header: search + count */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 px-6 py-4 border-b border-base-content/5"
          style={{ background: `${COLOR}06` }}
        >
          {/* Search */}
          <div className="relative flex-1 w-full">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-30"
              style={{ color: COLOR }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, district or region…"
              className="w-full h-10 pl-10 pr-9 rounded-xl text-sm font-semibold placeholder:opacity-30 outline-none border transition-all duration-250"
              style={{
                background: "var(--color-base-200)",
                borderColor: query ? `${COLOR}45` : "transparent",
              }}
            />
            <AnimatePresence>
              {query && (
                <Motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-35 hover:opacity-70 transition-opacity"
                >
                  <FaTimes className="text-xs" />
                </Motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Count + live pill */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ color: COLOR, background: `${COLOR}18` }}
            >
              {filtered.length} applicants
            </span>
            <div
              className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full"
              style={{ color: COLOR, background: `${COLOR}18` }}
            >
              <Motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: COLOR }}
              />
              LIVE
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-content/5">
                  {[
                    "Applicant",
                    "Zone",
                    "Demographics",
                    "Vehicle",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest opacity-25 ${h === "Action" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((rider, i) => (
                    <RiderRow
                      key={rider._id}
                      rider={rider}
                      index={i}
                      onReview={setSelectedRider}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            {riders.length === 0 ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: `${COLOR}15`, color: COLOR }}
                >
                  <FaCheckCircle />
                </div>
                <p className="font-black text-lg opacity-20 uppercase tracking-widest">
                  Clear Queue
                </p>
                <p className="text-xs opacity-20 font-bold uppercase tracking-widest">
                  All agents verified
                </p>
              </>
            ) : (
              <>
                <HiOutlineClock className="text-3xl opacity-20" />
                <p className="text-xs opacity-30 font-bold italic">
                  No results for "{query}"
                </p>
              </>
            )}
          </Motion.div>
        )}
      </Motion.div>

      {/* ── MODAL ── */}
      {selectedRider && (
        <RiderReviewModal
          rider={selectedRider}
          refetch={refetch}
          onClose={() => setSelectedRider(null)}
        />
      )}
    </div>
  );
};

export default PendingRiders;
