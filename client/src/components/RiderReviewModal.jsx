import { useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaIdBadge,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaIdCard,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";

const COLOR = "#38bdf8";

// ── DETAIL ROW ───────────────────────────
const DetailRow = ({ icon, label, value, mono }) => (
  <div className="flex items-center justify-between py-3 border-b border-base-content/5 last:border-0">
    <div className="flex items-center gap-2.5 text-base-content/35">
      <span className="text-xs shrink-0">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span
      className={`text-xs font-black max-w-40 truncate text-right ${
        mono ? "font-mono tracking-wider text-[11px]" : ""
      }`}
    >
      {value ?? "—"}
    </span>
  </div>
);

// ── CONFIRM OVERLAY ──────────────────────
const ConfirmOverlay = ({ action, onConfirm, onCancel, loading }) => {
  const isApprove = action === "approved";
  const accentColor = isApprove ? "#10b981" : "#f87171";

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
      style={{
        background:
          "color-mix(in srgb, var(--color-base-100) 92%, transparent)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="flex flex-col items-center text-center px-8 max-w-xs"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-5"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {isApprove ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>

        <p className="font-black text-lg tracking-tight mb-1">
          {isApprove ? "Approve Rider?" : "Reject Application?"}
        </p>
        <p className="text-xs opacity-40 font-medium mb-7 leading-relaxed">
          {isApprove
            ? "This rider will be added to the active fleet and can start accepting deliveries."
            : "This application will be permanently rejected and the applicant notified."}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-base-content/10 hover:border-base-content/25 opacity-60 hover:opacity-90 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-250 hover:scale-[1.03] hover:shadow-xl active:scale-95 disabled:opacity-40"
            style={{
              background: accentColor,
              color: "#020617",
              boxShadow: `0 6px 20px ${accentColor}35`,
            }}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : isApprove ? (
              "Confirm Approve"
            ) : (
              "Confirm Reject"
            )}
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

// ─────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────
const RiderReviewModal = ({ rider, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [pendingAction, setPendingAction] = useState(null); 
  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false);

  const handleConfirm = async () => {
    if (isProcessing.current || !pendingAction) return;
    isProcessing.current = true;
    setLoading(true);

    try {
      await axiosSecure.patch(`/riders/${rider._id}`, {
        status: pendingAction,
      });
      toast.success(
        pendingAction === "approved"
          ? `${rider.name} approved and added to fleet.`
          : `${rider.name}'s application rejected.`,
      );
      refetch();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Action failed. Try again.");
      isProcessing.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* ── BACKDROP ── */}
      <Motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => !pendingAction && onClose()}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* ── MODAL PANEL ── */}
      <Motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-lg rounded-3xl border border-base-content/5 overflow-hidden shadow-2xl pointer-events-auto"
          style={{ background: "var(--color-base-100)" }}
        >
          {/* ── CONFIRM OVERLAY ── */}
          <AnimatePresence>
            {pendingAction && (
              <ConfirmOverlay
                action={pendingAction}
                onConfirm={handleConfirm}
                onCancel={() => setPendingAction(null)}
                loading={loading}
              />
            )}
          </AnimatePresence>

          {/* ── MODAL HEADER ── */}
          <div
            className="relative flex items-center justify-between px-7 py-5 border-b border-base-content/5"
            style={{ background: `${COLOR}08` }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-10 right-10 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${COLOR}40, transparent)`,
              }}
            />

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
                style={{ background: `${COLOR}20`, color: COLOR }}
              >
                <FaIdBadge />
              </div>
              <div>
                <h3 className="font-black text-base tracking-tight leading-tight">
                  Rider Review
                </h3>
                <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-0.5">
                  Application ID · {rider._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-base-content/5 hover:bg-base-content/12 flex items-center justify-center text-base-content/40 hover:text-base-content transition-all duration-200"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* ── APPLICANT CARD ── */}
          <div className="px-7 pt-6 pb-4">
            <div
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-base-content/5 mb-5"
              style={{ background: "var(--color-base-200)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 font-black"
                style={{ background: `${COLOR}20`, color: COLOR }}
              >
                {rider.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black text-base leading-tight truncate">
                  {rider.name}
                </p>
                <p className="text-[10px] opacity-30 font-medium mt-0.5 truncate">
                  {rider.email}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1.5 rounded-full shrink-0"
                style={{ background: "#fbbf2418", color: "#fbbf24" }}
              >
                <Motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#fbbf24" }}
                />
                PENDING
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 divide-y divide-base-content/5">
              <DetailRow
                icon={<FaPhoneAlt />}
                label="Mobile"
                value={rider.phone}
              />
              <DetailRow
                icon={<FaMapMarkerAlt />}
                label="District"
                value={`${rider.district}, ${rider.region}`}
              />
              <DetailRow
                icon={<FaIdCard />}
                label="Age"
                value={`${rider.age} years`}
              />
              <DetailRow
                icon={<FaShieldAlt />}
                label="NID"
                value={`****${rider.nid?.slice(-4)}`}
                mono
              />
              <DetailRow
                icon={<FaMotorcycle />}
                label="Bike"
                value={rider.bikeBrand}
              />
              <DetailRow
                icon={<MdElectricBolt />}
                label="Reg. Number"
                value={rider.bikeRegistration}
                mono
              />
            </div>

            {/* Applied date */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-content/5">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-25">
                Applied
              </span>
              <span className="text-[10px] font-black opacity-40">
                {new Date(rider.appliedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex gap-3 px-7 pb-7 pt-1">
            <button
              onClick={() => setPendingAction("rejected")}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-250 hover:scale-[1.02] active:scale-95 border"
              style={{
                borderColor: "#f8717130",
                background: "#f8717110",
                color: "#f87171",
              }}
            >
              <FaTimesCircle />
              Reject
            </button>
            <button
              onClick={() => setPendingAction("approved")}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-250 hover:scale-[1.02] hover:shadow-xl active:scale-95"
              style={{
                background: "#10b981",
                color: "#020617",
                boxShadow: "0 6px 24px #10b98135",
              }}
            >
              <MdVerified className="text-sm" />
              Approve
            </button>
          </div>
        </div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default RiderReviewModal;
