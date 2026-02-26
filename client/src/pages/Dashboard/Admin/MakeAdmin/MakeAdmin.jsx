import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaUserShield,
  FaUserTimes,
  FaSearch,
  FaTimes,
  FaFingerprint,
  FaCheckCircle,
  FaTimesCircle,
  FaMotorcycle,
} from "react-icons/fa";
import { MdVerified, MdElectricBolt } from "react-icons/md";
import { HiOutlineShieldCheck } from "react-icons/hi";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const COLOR = "#38bdf8";

// ── ROLE CHIP ──────────────────────────────
const RoleChip = ({ role }) => {
  const cfg = {
    admin: { label: "Admin", bg: "#38bdf818", color: "#38bdf8" },
    rider: { label: "Rider", bg: "#fbbf2418", color: "#fbbf24" },
    user: { label: "User", bg: "#10b98112", color: "#10b981" },
  }[role] ?? { label: role, bg: "#94a3b815", color: "#94a3b8" };

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {role === "admin" && <FaUserShield className="text-[8px]" />}
      {role === "rider" && <FaMotorcycle className="text-[8px]" />}
      {role === "user" && <MdVerified className="text-[9px]" />}
      {cfg.label}
    </span>
  );
};

// ── INLINE CONFIRM ROW ────────────────────
// Replaces the toast-inside-toast anti-pattern.
// Expands in place, no modal, no focus trap needed.
const UserRow = ({ user, onRoleChange, isUpdating }) => {
  const [confirming, setConfirming] = useState(false);
  const isAdmin = user.role === "admin";
  const isRider = user.role === "rider";
  const newRole = isAdmin ? "user" : "admin";
  const actionColor = isAdmin ? "#f87171" : "#10b981";

  const handleConfirm = () => {
    onRoleChange(user._id, newRole);
    setConfirming(false);
  };

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group border-b border-base-content/4 last:border-0"
    >
      {/* ── MAIN ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-base-200/30 transition-colors duration-200">
        {/* Avatar + identity */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{
              background: isAdmin ? `${COLOR}20` : "var(--color-base-200)",
              color: isAdmin ? COLOR : "var(--color-base-content)",
              opacity: isAdmin ? 1 : 0.4,
            }}
          >
            {(user.name?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-sm leading-tight truncate">
              {user.name}
            </p>
            <p className="text-[10px] opacity-30 font-medium truncate mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Role + Date */}
        <div className="flex items-center gap-4 shrink-0">
          <RoleChip role={user.role ?? "user"} />
          <p className="text-[10px] font-bold opacity-25 hidden md:block">
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action */}
        <div className="shrink-0">
          {isRider ? (
            <span className="text-[9px] font-black uppercase tracking-widest opacity-20 px-3 py-2 rounded-xl border border-base-content/8">
              Restricted
            </span>
          ) : confirming ? (
            // Cancel when already confirming
            <button
              onClick={() => setConfirming(false)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl border border-base-content/10 opacity-50 hover:opacity-80 transition-all"
            >
              <FaTimes className="text-[9px]" />
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-250 hover:scale-[1.03] active:scale-95 disabled:opacity-30"
              style={
                isAdmin
                  ? {
                      borderColor: "#f8717130",
                      background: "#f8717110",
                      color: "#f87171",
                    }
                  : {
                      borderColor: `${COLOR}30`,
                      background: `${COLOR}10`,
                      color: COLOR,
                    }
              }
            >
              {isUpdating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : isAdmin ? (
                <>
                  <FaUserTimes className="text-xs" /> Revoke
                </>
              ) : (
                <>
                  <FaUserShield className="text-xs" /> Promote
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── INLINE CONFIRM EXPANSION ── */}
      <AnimatePresence>
        {confirming && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 px-5 py-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                borderColor: `${actionColor}25`,
                background: `${actionColor}08`,
              }}
            >
              <div>
                <p
                  className="font-black text-sm"
                  style={{ color: actionColor }}
                >
                  {isAdmin ? "Revoke admin access?" : "Grant admin access?"}
                </p>
                <p className="text-[10px] opacity-50 font-medium mt-0.5 max-w-xs">
                  {isAdmin
                    ? `${user.name} will lose all admin privileges immediately.`
                    : `${user.name} will gain full admin control over the platform.`}
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setConfirming(false)}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-base-content/10 opacity-50 hover:opacity-80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-[1.03] hover:shadow-lg active:scale-95"
                  style={{
                    background: actionColor,
                    color: "#020617",
                    boxShadow: `0 4px 16px ${actionColor}40`,
                  }}
                >
                  {isAdmin ? (
                    <>
                      <FaTimesCircle className="text-xs" /> Confirm Revoke
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-xs" /> Confirm Promote
                    </>
                  )}
                </button>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const {
    data: users = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["usersSearch"],
    queryFn: async () => {
      const res = await axiosSecure(`/users/search?searchQuery=${query}`);
      return res.data;
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    setHasSearched(true);
    refetch();
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    queryClient.setQueryData(["usersSearch"], []);
  };

  const mutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
      toast.success("Access level updated.");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message ?? "Update failed."),
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  const admins = users.filter((u) => u.role === "admin").length;

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
            Authority Management
          </span>
        </Motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <Motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
              ADMIN
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${COLOR}`,
                  color: "transparent",
                }}
              >
                CONTROLS.
              </span>
            </h1>
            <p className="text-sm font-medium opacity-40 mt-3 max-w-sm">
              Search operatives by name or email. Promote to admin or revoke
              access with a single confirmation.
            </p>
          </Motion.div>

          {/* Stats */}
          {hasSearched && users.length > 0 && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3"
            >
              {[
                {
                  icon: <HiOutlineShieldCheck />,
                  label: "Results",
                  val: users.length,
                  color: COLOR,
                },
                {
                  icon: <FaUserShield />,
                  label: "Admins",
                  val: admins,
                  color: "#10b981",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-base-content/5 bg-base-200/50"
                >
                  <span className="text-sm" style={{ color: s.color }}>
                    {s.icon}
                  </span>
                  <div>
                    <p
                      className="font-black text-lg leading-none tabular-nums"
                      style={{ color: s.color }}
                    >
                      {s.val}
                    </p>
                    <p className="text-[9px] uppercase font-black tracking-widest opacity-25 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </Motion.div>
          )}
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3"
      >
        <div className="relative flex-1 group">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-30 group-focus-within:opacity-75 transition-opacity"
            style={{ color: COLOR }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or email…"
            className="w-full h-12 pl-11 pr-10 rounded-2xl text-sm font-semibold placeholder:opacity-30 outline-none border transition-all duration-250"
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
                onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-70 transition-opacity"
              >
                <FaTimes className="text-xs" />
              </Motion.button>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleSearch}
          disabled={!query.trim() || isFetching}
          className="flex items-center gap-2 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-250 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
          style={{
            background: "var(--color-primary)",
            color: "#020617",
            boxShadow: `0 6px 24px color-mix(in srgb, var(--color-primary) 30%, transparent)`,
          }}
        >
          {isFetching ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <>
              <MdElectricBolt />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </Motion.div>

      {/* ── RESULTS CARD ── */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-base-content/5 overflow-hidden"
        style={{ background: "var(--color-base-100)" }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-base-content/5"
          style={{ background: `${COLOR}06` }}
        >
          <div className="flex items-center gap-2.5">
            <FaFingerprint className="text-sm opacity-40" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              {hasSearched ? "Search Results" : "Operative Registry"}
            </span>
          </div>
          {hasSearched && (
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ color: COLOR, background: `${COLOR}18` }}
            >
              {users.length} found
            </span>
          )}
        </div>

        {/* ── TABLE HEADER (desktop) ── */}
        {users.length > 0 && (
          <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-base-content/5">
            {["Operative", "Clearance", "Enrolled", "Action"].map((h, i) => (
              <p
                key={h}
                className={`text-[9px] font-black uppercase tracking-widest opacity-25 ${i === 3 ? "text-right" : ""}`}
              >
                {h}
              </p>
            ))}
          </div>
        )}

        {/* ── ROWS ── */}
        <AnimatePresence mode="popLayout">
          {users.map((u) => (
            <UserRow
              key={u._id}
              user={u}
              isUpdating={
                mutation.variables?.id === u._id && mutation.isPending
              }
              onRoleChange={(id, role) => mutation.mutate({ id, role })}
            />
          ))}
        </AnimatePresence>

        {/* ── EMPTY / INITIAL STATE ── */}
        {users.length === 0 && !isFetching && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: `${COLOR}10`,
                color: COLOR,
                opacity: hasSearched ? 1 : 0.4,
              }}
            >
              <FaFingerprint />
            </div>
            <p className="font-black text-sm opacity-25 uppercase tracking-widest">
              {hasSearched
                ? "No operatives found"
                : "Enter a name or email to search"}
            </p>
            {hasSearched && (
              <p className="text-xs opacity-20 font-medium">
                Try a different search term
              </p>
            )}
          </Motion.div>
        )}

        {/* ── LOADING STATE ── */}
        {isFetching && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <FaFingerprint className="text-2xl" style={{ color: COLOR }} />
              </Motion.div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                Scanning registry…
              </p>
            </div>
          </div>
        )}
      </Motion.div>
    </div>
  );
};

export default MakeAdmin;
