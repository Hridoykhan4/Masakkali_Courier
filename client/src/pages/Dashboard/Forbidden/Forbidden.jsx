import { Link, useLocation, useNavigate } from "react-router";
import { motion as Motion } from "framer-motion";
import {
  FaUserShield,
  FaMotorcycle,
  FaUser,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { HiOutlineLockClosed } from "react-icons/hi";
import useUserRole from "../../../hooks/useUserRole";


// ─────────────────────────────────────────────────────────
//  ROLE CONFIG
// ─────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    color: "#38bdf8",
    label: "Admin",
    icon: <FaUserShield />,
    home: "/dashboard",
    homeLabel: "Command Center",
  },
  rider: {
    color: "#fbbf24",
    label: "Rider",
    icon: <FaMotorcycle />,
    home: "/dashboard",
    homeLabel: "Rider Panel",
  },
  user: {
    color: "#10b981",
    label: "Customer",
    icon: <FaUser />,
    home: "/dashboard/myParcels",
    homeLabel: "My Parcels",
  },
};

// ─────────────────────────────────────────────────────────
//  INFER REQUIRED ROLE FROM BLOCKED PATH
// ─────────────────────────────────────────────────────────
const inferRequired = (path = "") => {
  const p = path.toLowerCase();
  if (
    p.includes("admin") ||
    p.includes("overview") ||
    p.includes("make-admin") ||
    p.includes("pending-riders") ||
    p.includes("active-riders") ||
    p.includes("assign")
  )
    return "admin";
  if (
    p.includes("tasks") ||
    p.includes("earnings") ||
    p.includes("completed-deliveries") ||
    p.includes("rider")
  )
    return "rider";
  if (
    p.includes("my-parcels") ||
    p.includes("payment") ||
    p.includes("send-parcel") ||
    p.includes("track")
  )
    return "user";
  return null;
};

// ─────────────────────────────────────────────────────────
//  CONTEXT-AWARE COPY
// ─────────────────────────────────────────────────────────
const getCopy = (yourRole, requiredRole) => {
  const map = {
    "admin→rider": {
      headline: "Field Operative Zone",
      body: "This panel is reserved for active delivery riders managing tasks in the field. Your operations hub is the Command Center.",
      tip: "Manage your rider fleet from Admin → Active Riders instead.",
    },
    "admin→user": {
      headline: "Customer Portal",
      body: "This section lets customers track and manage their own parcels. Admin accounts have full system visibility from the dashboard.",
      tip: "Use Admin → All Parcels to view any customer's shipments.",
    },
    "rider→admin": {
      headline: "Command Center",
      body: "Admin clearance is required to access system controls, user management, and fleet analytics. Rider accounts are scoped to field operations.",
      tip: "Contact your admin if you believe your role needs to be updated.",
    },
    "rider→user": {
      headline: "Customer Portal",
      body: "This area is for customers tracking their personal parcels. Your Rider Panel covers all your delivery assignments and earnings.",
      tip: "Head back to your Rider Panel to manage your active deliveries.",
    },
    "user→admin": {
      headline: "Admin Only Zone",
      body: "System administration requires elevated clearance. This area controls users, riders, parcels, and revenue across the platform.",
      tip: "If your role was recently changed, sign out and back in to refresh.",
    },
    "user→rider": {
      headline: "Rider Operative Zone",
      body: "This panel is restricted to verified Masakkali delivery riders. Submit a rider application to join the fleet.",
      tip: "Interested in becoming a rider? Apply from your Customer Dashboard.",
    },
  };
  const key = yourRole && requiredRole ? `${yourRole}→${requiredRole}` : null;
  return (
    map[key] ?? {
      headline: "Restricted Area",
      body: "You don't have the required access level for this page. Contact your administrator if you believe this is a mistake.",
      tip: "If you recently changed roles, try signing out and back in.",
    }
  );
};

// ─────────────────────────────────────────────────────────
//  ROLE BADGE
// ─────────────────────────────────────────────────────────
const RoleBadge = ({ roleKey, label, dim = false }) => {
  const meta = ROLES[roleKey];
  if (!meta) return null;
  return (
    <div className="flex items-center justify-between py-4 border-b border-base-content/5.5 last:border-0">
      <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-22">
        {label}
      </span>
      <div
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black"
        style={{
          background: dim ? `${meta.color}0a` : `${meta.color}18`,
          color: dim ? `${meta.color}88` : meta.color,
          border: `1px solid ${meta.color}${dim ? "18" : "28"}`,
        }}
      >
        <span className="text-sm">{meta.icon}</span>
        {meta.label}
        {!dim && <MdVerified className="text-sm ml-0.5" />}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const Forbidden = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname ?? "";
  const { role } = useUserRole();

  const requiredRole = inferRequired(from);
  const myMeta = ROLES[role] ?? ROLES.user;
  const copy = getCopy(role, requiredRole);

  const ERR = "#f87171";
  const ACC = myMeta.color;

  return (
    <section
      className="relative  flex items-center justify-center font-urbanist overflow-hidden"
      // style={{ background: "var(--color-base-200)" }}
    >
      {/* ── ORBS ── */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute -top-40 -right-40 w-160 h-160 rounded-full"
          style={{
            background: `radial-gradient(circle, ${ERR}07, transparent 65%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-140 h-140 rounded-full"
          style={{
            background: `radial-gradient(circle, ${ACC}07, transparent 65%)`,
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* ── CARD ── */}
        <Motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-base-content/5 overflow-hidden"
          style={{
            background: "var(--color-base-100)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.1)",
          }}
        >
          {/* Error accent bar */}
          <div
            className="absolute top-0 inset-x-0 h-0.75"
            style={{
              background: `linear-gradient(90deg, transparent, ${ERR}70, ${ERR}, ${ERR}70, transparent)`,
            }}
          />

          {/* ── HERO ── */}
          <div className="relative flex flex-col items-center text-center px-8 pt-12 pb-8 overflow-hidden">
            {/* Giant "403" watermark */}
            <span
              className="absolute -top-3 right-3 text-[8rem] font-black leading-none select-none pointer-events-none"
              style={{ color: ERR, opacity: 0.045 }}
            >
              403
            </span>

            {/* Lock icon + ripples */}
            <Motion.div
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 270,
                damping: 22,
                delay: 0.1,
              }}
              className="relative mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${ERR}15`, color: ERR }}
              >
                <HiOutlineLockClosed />
              </div>
              {[0, 0.45, 0.9].map((d, i) => (
                <Motion.div
                  key={i}
                  className="absolute inset-0 rounded-2xl border"
                  style={{ borderColor: ERR }}
                  animate={{ scale: [1, 1.55 + i * 0.25], opacity: [0.55, 0] }}
                  transition={{
                    duration: 2.2,
                    delay: d,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </Motion.div>

            {/* Eyebrow */}
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="flex items-center gap-2 mb-3"
            >
              <Motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.7, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: ERR }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: ERR }}
              >
                Access Blocked
              </span>
            </Motion.div>

            {/* Headline */}
            <Motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl font-black tracking-tighter leading-[0.9] mb-3">
                {copy.headline}
                <br />
                <span
                  style={{
                    WebkitTextStroke: `1.5px ${ERR}`,
                    color: "transparent",
                  }}
                >
                  Denied.
                </span>
              </h1>
              <p className="text-sm font-medium opacity-35 leading-relaxed max-w-67.5 mx-auto">
                {copy.body}
              </p>
            </Motion.div>
          </div>

          {/* ── DETAIL ROWS ── */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="px-8 pb-5"
          >
            <RoleBadge roleKey={role ?? "user"} label="Your Access Level" />
            {requiredRole && (
              <RoleBadge roleKey={requiredRole} label="Required Level" dim />
            )}

            {/* Blocked path */}
            {from && (
              <div className="flex items-center justify-between py-4 border-b border-base-content/5.5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-22 shrink-0">
                  Blocked Route
                </span>
                <code
                  className="text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-xl ml-4 truncate max-w-45"
                  style={{ background: `${ERR}10`, color: ERR }}
                >
                  {from}
                </code>
              </div>
            )}
          </Motion.div>

          {/* ── ACTIONS ── */}
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.43 }}
            className="px-8 pb-8 flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border border-base-content/8 hover:border-base-content/20 transition-all duration-200 opacity-50 hover:opacity-80"
            >
              <FaArrowLeft className="text-[10px]" />
              Go Back
            </button>

            <Link
              to={myMeta.home}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-250 hover:scale-[1.03] hover:shadow-xl active:scale-95"
              style={{
                background: ACC,
                color: "#020617",
                boxShadow: `0 8px 28px ${ACC}38`,
              }}
            >
              <FaHome />
              {myMeta.homeLabel}
            </Link>
          </Motion.div>

          {/* ── TIP STRIP ── */}
          <div
            className="px-8 py-4 border-t border-base-content/5 flex items-start gap-2.5"
            style={{ background: "var(--color-base-200)" }}
          >
            <MdElectricBolt
              className="text-base shrink-0 mt-px"
              style={{ color: ACC }}
            />
            <p className="text-[10px] font-bold opacity-35 leading-relaxed">
              {copy.tip}
            </p>
          </div>
        </Motion.div>

        {/* ── OUTSIDE FOOTNOTE ── */}
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[9px] font-black uppercase tracking-[0.35em] opacity-15 mt-5"
        >
          HTTP 403 · Masakkali Courier System
        </Motion.p>
      </div>
    </section>
  );
};

export default Forbidden;
