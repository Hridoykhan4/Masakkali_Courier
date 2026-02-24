import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useMyParcels from "../hooks/useMyParcels";
import MasakkaliLogo from "../pages/Shared/MasakkaliLogo/MasakkaliLogo";
import usePaymentHistory from "../hooks/usePaymentHistory";
import useUserRole from "../hooks/useUserRole";
import useAuthValue from "../hooks/useAuthValue";
import ErrorLoadingState from "../components/ErrorLoadingState";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaHome,
  FaMotorcycle,
  FaTasks,
  FaUserShield,
  FaWallet,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import {
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineViewGrid,
  HiOutlineCreditCard,
} from "react-icons/hi";
import { MdElectricBolt } from "react-icons/md";

// ── ROLE META ──────────────────────────────────
const ROLE_META = {
  admin: { color: "#38bdf8", label: "Admin Control" },
  user: { color: "#10b981", label: "Customer" },
  rider: { color: "#fbbf24", label: "Rider Panel" },
};

// ── NAV SECTION LABEL ──────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-black uppercase tracking-[0.28em] opacity-25 px-3 pt-4 pb-1.5 select-none">
    {children}
  </p>
);

// ── SINGLE NAV ITEM ────────────────────────────
const NavItem = ({ to, icon, label, badge, end, color, onNavigate }) => (
  <li>
    <NavLink
      end={end}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-250 overflow-hidden",
          isActive
            ? "text-[#020617] shadow-lg"
            : "text-base-content/50 hover:text-base-content hover:bg-base-content/5",
        ].join(" ")
      }
      style={({ isActive }) =>
        isActive
          ? { background: color, boxShadow: `0 4px 20px ${color}40` }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left accent (non-active hover state) */}
          {!isActive && (
            <span
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-250"
              style={{ backgroundColor: color }}
            />
          )}
          <span
            className={`text-base shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
          >
            {icon}
          </span>
          <span className="truncate flex-1">{label}</span>
          {badge != null && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0"
              style={
                isActive
                  ? { background: "rgba(0,0,0,0.2)", color: "#020617" }
                  : { background: `${color}20`, color }
              }
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  </li>
);

// ── SIDEBAR INNER ──────────────────────────────
const SidebarContent = ({ role, meta, myParcels, payments, onNavigate }) => {
  const { user } = useAuthValue?.() ?? {};

  return (
    <div className="flex flex-col h-full">
      {/* ── BRAND HEADER ── */}
      <div className="relative px-5 pt-6 pb-5 shrink-0">
        {/* Ambient glow behind logo */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${meta.color}12 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
        <div className="relative">
          <MasakkaliLogo />
          <div className="flex items-center gap-2 mt-3">
            <Motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: meta.color }}
            />
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em]"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── USER CARD ── */}
      {user && (
        <div className="mx-3 mb-3 px-4 py-3.5 rounded-2xl border border-base-content/5 bg-base-200/50 flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            style={{ background: `${meta.color}20`, color: meta.color }}
          >
            {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate leading-tight">
              {user.displayName ?? "User"}
            </p>
            <p className="text-[9px] opacity-30 font-medium truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* Top hairline */}
      <div className="mx-4 h-px bg-base-content/5 shrink-0 mb-1" />

      {/* ── NAV LINKS ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
        <ul className="space-y-0.5">
          {/* General */}
          <SectionLabel>General</SectionLabel>
          <NavItem
            end
            to="/dashboard"
            icon={<FaHome />}
            label="Dashboard"
            color={meta.color}
            onNavigate={onNavigate}
          />
          <NavItem
            to="/dashboard/profile"
            icon={<HiOutlineUserCircle />}
            label="My Profile"
            color={meta.color}
            onNavigate={onNavigate}
          />

          {/* ── USER LINKS ── */}
          {role === "user" && (
            <>
              <SectionLabel>Parcels</SectionLabel>
              <NavItem
                to="/dashboard/myParcels"
                icon={<FaBoxOpen />}
                label="My Parcels"
                badge={myParcels?.length ?? 0}
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/track"
                icon={<HiOutlineLocationMarker />}
                label="Live Tracking"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/paymentHistory"
                icon={<HiOutlineCreditCard />}
                label="Payments"
                badge={payments?.length ?? 0}
                color={meta.color}
                onNavigate={onNavigate}
              />
            </>
          )}

          {/* ── RIDER LINKS ── */}
          {role === "rider" && (
            <>
              <SectionLabel>Deliveries</SectionLabel>
              <NavItem
                to="/dashboard/pendingDeliveries"
                icon={<FaTasks />}
                label="Task Board"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/completedDeliveries"
                icon={<FaCheckCircle />}
                label="History"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/myEarnings"
                icon={<FaWallet />}
                label="My Wallet"
                color={meta.color}
                onNavigate={onNavigate}
              />
            </>
          )}

          {/* ── ADMIN LINKS ── */}
          {role === "admin" && (
            <>
              <SectionLabel>Fleet</SectionLabel>
              <NavItem
                to="/dashboard/activeRiders"
                icon={<HiOutlineBadgeCheck />}
                label="Active Riders"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/pendingRiders"
                icon={<HiOutlineClock />}
                label="Pending Riders"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <SectionLabel>Logistics</SectionLabel>
              <NavItem
                to="/dashboard/assign-rider"
                icon={<FaMotorcycle />}
                label="Assign Parcels"
                color={meta.color}
                onNavigate={onNavigate}
              />
              <NavItem
                to="/dashboard/makeAdmin"
                icon={<FaUserShield />}
                label="Admin Controls"
                color={meta.color}
                onNavigate={onNavigate}
              />
            </>
          )}
        </ul>
      </nav>

      {/* ── FOOTER ── */}
      <div className="shrink-0 p-3 border-t border-base-content/5">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-base-content/40 hover:text-base-content hover:bg-base-content/5 transition-all duration-200 group"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Site
          <HiOutlineViewGrid className="ml-auto opacity-50" />
        </NavLink>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────────────
const DashboardLayout = () => {
  const { role, loading } = useUserRole();
  const { myParcels } = useMyParcels();
  const { data: payments = [] } = usePaymentHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (loading) return <ErrorLoadingState isPending={loading} />;

  const meta = ROLE_META[role] ?? ROLE_META.user;

  const closeDrawer = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-base-200/40 font-urbanist">
      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR 
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-base-100 border-r border-base-content/5 sticky top-0 h-screen overflow-hidden">
        <SidebarContent
          role={role}
          meta={meta}
          myParcels={myParcels}
          payments={payments}
          onNavigate={undefined} 
        />
      </aside>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <Motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <Motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-base-100 border-r border-base-content/5 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Close button */}
              <Motion.button
                whileTap={{ scale: 0.92 }}
                onClick={closeDrawer}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl bg-base-content/8 flex items-center justify-center text-base-content/50 hover:bg-base-content/15 hover:text-base-content transition-all duration-200"
              >
                <FaTimes className="text-xs" />
              </Motion.button>

              <SidebarContent
                role={role}
                meta={meta}
                myParcels={myParcels}
                payments={payments}
                onNavigate={closeDrawer}
              />
            </Motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* ── TOPBAR ── */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-5 py-4 bg-base-100/80 backdrop-blur-xl border-b border-base-content/5">
          {/* Mobile hamburger */}
          <Motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-base-content/5 hover:bg-base-content/10 flex items-center justify-center text-base-content/60 hover:text-base-content transition-all duration-200 shrink-0"
          >
            <FaBars className="text-sm" />
          </Motion.button>

          {/* Page context pill (mobile: shows logo) */}
          <div className="lg:hidden flex-1 flex items-center gap-2 overflow-hidden">
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em] truncate"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>

          {/* Desktop: breadcrumb-style role label */}
          <div className="hidden lg:flex items-center gap-2">
            <Motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: meta.color }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: live indicator */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest"
            style={{
              borderColor: `${meta.color}30`,
              background: `${meta.color}10`,
              color: meta.color,
            }}
          >
            <Motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: meta.color }}
            />
            Live
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <Motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </Motion.div>
          </AnimatePresence>
        </main>

        {/* ── BOTTOM FOOTER BAR ── */}
        <footer className="px-6 py-4 border-t border-base-content/5 bg-base-100/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-20">
              © {new Date().getFullYear()} Masakkali Courier Ltd.
            </p>
            <div
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
              style={{ color: meta.color, opacity: 0.5 }}
            >
              <MdElectricBolt />
              <span>System Online</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
