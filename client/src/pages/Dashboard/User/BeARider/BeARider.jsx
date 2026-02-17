import { useMemo, useState, memo, useRef } from "react";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaIdCard,
  FaPhoneAlt,
  FaUserEdit,
  FaCheckCircle,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import lottieLight from "lottie-web/build/player/lottie_light";

import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useScrollTo from "../../../../hooks/useScrollTo";
import coverageData from "../../../../utils/coverageData";

// ── LOTTIE (memoized, stable engine) ──────
const RiderAnimation = memo(() => (
  <Lottie
    path="/animations/rider.json"
    lottieObj={lottieLight}
    loop
    className="w-full h-auto drop-shadow-xl"
  />
));
RiderAnimation.displayName = "RiderAnimation";

// ── PERKS ──────────────────────────────────
const PERKS = [
  {
    icon: <IoSpeedometer />,
    label: "Flexible Shifts",
    desc: "Work on your own schedule",
  },
  {
    icon: <MdElectricBolt />,
    label: "Transparent Pay",
    desc: "Earnings per delivery, live",
  },
  {
    icon: <MdVerified />,
    label: "24/7 Support",
    desc: "Dedicated rider helpdesk",
  },
];

// ── STEPS CONFIG ───────────────────────────
const STEPS = ["Personal", "Location", "Vehicle"];

// ── FIELD WRAPPER ──────────────────────────
const Field = ({ label, icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-35 ml-1">
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

// ── STEP INDICATOR ─────────────────────────
const StepIndicator = ({ current, color }) => (
  <div className="flex items-center gap-2 mb-8">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-400 border"
            style={
              i < current
                ? { background: color, borderColor: color, color: "#020617" }
                : i === current
                  ? { borderColor: color, color, background: `${color}18` }
                  : {
                      borderColor: "var(--color-base-content)",
                      borderOpacity: 0.1,
                      opacity: 0.2,
                      background: "transparent",
                      color: "var(--color-base-content)",
                    }
            }
          >
            {i < current ? <FaCheckCircle className="text-[10px]" /> : i + 1}
          </div>
          <span
            className="text-[8px] font-black uppercase tracking-widest transition-colors duration-300"
            style={{
              color: i === current ? color : undefined,
              opacity: i === current ? 1 : 0.25,
            }}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className="flex-1 h-px w-8 mb-4 transition-colors duration-400"
            style={{
              background: i < current ? color : "var(--color-base-content)",
              opacity: i < current ? 0.6 : 0.1,
            }}
          />
        )}
      </div>
    ))}
  </div>
);

// ── INPUT STYLE ────────────────────────────
const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-base-content/8 bg-base-200/60 font-semibold text-sm focus:outline-none focus:border-primary/50 focus:bg-base-100 transition-all duration-250 placeholder:opacity-30";

const selectCls =
  "w-full h-12 px-4 rounded-2xl border border-base-content/8 bg-base-200/60 font-semibold text-sm focus:outline-none focus:border-primary/50 transition-all duration-250 cursor-pointer";

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const BeARider = () => {
  useScrollTo();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthValue();

  const [step, setStep] = useState(0);
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({});

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const color = "var(--color-primary)"; // respects light/dark theme

  const regions = useMemo(
    () => [...new Set(coverageData.map((d) => d.region))],
    [],
  );
  const districts = useMemo(
    () =>
      region
        ? coverageData.filter((d) => d.region === region).map((d) => d.district)
        : [],
    [region],
  );

  // ── Collect data per step ──
  const handleNext = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget.closest("form") ?? e.currentTarget);
    const raw = Object.fromEntries(fd);

    if (step === 0) {
      const bdPhone = /^01[3-9]\d{8}$/;
      if (!bdPhone.test(raw.phone)) {
        toast.error("Enter a valid BD phone number (01XXXXXXXXX)");
        return;
      }
    }

    setFormData((prev) => ({ ...prev, ...raw }));
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = { ...formData, ...Object.fromEntries(fd) };

    const payload = {
      ...raw,
      age: parseInt(raw.age),
      nid: raw.nid?.toString(),
      status: "pending",
      appliedAt: new Date().toISOString(),
      role: "rider_applicant",
      userEmail: user?.email,
    };

    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/riders", payload);
      if (data?.insertedId) {
        setDone(true);
        toast.success("Application submitted! Track status in your dashboard.");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warning("You already have a pending application.");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page section-spacing font-urbanist">
      {/* ── HEADER ── */}
      <div ref={headerRef} className="mb-14">
        <Motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-2.5 mb-5"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
          />
          <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
            Carrier Opportunity
          </span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.88]"
        >
          RIDE &amp;
          <br />
          <span
            style={{
              WebkitTextStroke: "2px var(--color-primary)",
              color: "transparent",
            }}
          >
            EARN.
          </span>
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 0.45 } : {}}
          transition={{ delay: 0.22 }}
          className="text-sm md:text-base font-medium mt-4 max-w-lg text-base-content"
        >
          Join Bangladesh's fastest-growing delivery fleet. Fill out your
          profile and our team will review your application within 24 hours.
        </Motion.p>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ── LEFT: ANIMATION + PERKS (sticky) ── */}
        <Motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 hidden lg:flex flex-col gap-5 sticky top-28"
        >
          {/* Animation card */}
          <div className="relative rounded-3xl overflow-hidden border border-base-content/5 bg-base-200/50 p-6">
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--color-primary, #38bdf8)12, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <RiderAnimation />
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {PERKS.map((p, i) => (
              <Motion.div
                key={p.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-base-content/5 bg-base-200/40 hover:bg-base-200/70 transition-all duration-300"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider">
                    {p.label}
                  </p>
                  <p className="text-[10px] opacity-35 font-medium mt-0.5">
                    {p.desc}
                  </p>
                </div>
                <FaCheckCircle className="ml-auto text-primary text-xs opacity-60" />
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* ── RIGHT: MULTI-STEP FORM ── */}
        <Motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <AnimatePresence mode="wait">
            {/* ── SUCCESS STATE ── */}
            {done ? (
              <Motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-6 py-24 text-center rounded-3xl border border-base-content/5 bg-base-200/50"
              >
                <Motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  <MdVerified />
                </Motion.div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter">
                    Application Received!
                  </h2>
                  <p className="text-sm opacity-40 font-medium mt-2 max-w-xs mx-auto">
                    Our team will review your application within 24 hours. Track
                    the status in your dashboard.
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  <FaCheckCircle /> Under Review
                </div>
              </Motion.div>
            ) : (
              /* ── FORM CARD ── */
              <Motion.div
                key="form"
                className="rounded-3xl border border-base-content/5 overflow-hidden"
                style={{ background: "var(--color-base-100)" }}
              >
                {/* Card top bar */}
                <div
                  className="flex items-center gap-3 px-8 py-5 border-b border-base-content/5"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 6%, transparent)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--color-primary)",
                      color: "#020617",
                    }}
                  >
                    <FaUserEdit className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight">
                      Rider Profile
                    </h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-35">
                      Step {step + 1} of {STEPS.length} — {STEPS[step]}
                    </p>
                  </div>
                </div>

                <div className="px-8 pt-8 pb-10">
                  {/* Step indicator */}
                  <StepIndicator current={step} color="var(--color-primary)" />

                  <form
                    onSubmit={
                      step < STEPS.length - 1 ? handleNext : handleSubmit
                    }
                  >
                    <fieldset disabled={loading} className="space-y-5">
                      {/* ── STEP 0: PERSONAL ── */}
                      <AnimatePresence mode="wait">
                        {step === 0 && (
                          <Motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <Field label="Full Name">
                                <input
                                  name="name"
                                  defaultValue={user?.displayName}
                                  readOnly
                                  className={`${inputCls} opacity-50 cursor-not-allowed`}
                                />
                              </Field>
                              <Field label="Email">
                                <input
                                  name="email"
                                  defaultValue={user?.email}
                                  readOnly
                                  className={`${inputCls} opacity-50 cursor-not-allowed`}
                                />
                              </Field>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <Field label="Mobile" icon={<FaPhoneAlt />}>
                                <input
                                  type="tel"
                                  name="phone"
                                  required
                                  placeholder="017XXXXXXXX"
                                  maxLength={11}
                                  className={inputCls}
                                />
                              </Field>
                              <Field label="Age" icon={<FaIdCard />}>
                                <input
                                  type="number"
                                  name="age"
                                  required
                                  min={18}
                                  max={60}
                                  placeholder="Minimum 18"
                                  className={inputCls}
                                />
                              </Field>
                            </div>
                            <Field label="National ID (NID)">
                              <input
                                type="text"
                                name="nid"
                                required
                                placeholder="Enter your NID number"
                                className={inputCls}
                              />
                            </Field>
                          </Motion.div>
                        )}

                        {/* ── STEP 1: LOCATION ── */}
                        {step === 1 && (
                          <Motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <Field
                              label="Operating Region"
                              icon={<FaMapMarkerAlt />}
                            >
                              <select
                                name="region"
                                required
                                className={selectCls}
                                defaultValue={region}
                                onChange={(e) => setRegion(e.target.value)}
                              >
                                <option value="">Select your region</option>
                                {regions.map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            </Field>
                            <Field label="District">
                              <select
                                name="district"
                                required
                                disabled={!region}
                                className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                <option value="">
                                  {region
                                    ? "Select district"
                                    : "Select region first"}
                                </option>
                                {districts.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </Field>
                            {/* Coverage hint */}
                            {region && (
                              <Motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-base-content/5"
                                style={{
                                  background:
                                    "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                                }}
                              >
                                <MdElectricBolt className="text-primary flex-shrink-0" />
                                <p className="text-[10px] font-bold opacity-50">
                                  <span className="text-primary opacity-100">
                                    {districts.length} districts
                                  </span>{" "}
                                  available in {region} region
                                </p>
                              </Motion.div>
                            )}
                          </Motion.div>
                        )}

                        {/* ── STEP 2: VEHICLE ── */}
                        {step === 2 && (
                          <Motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <Field
                              label="Bike Brand / Model"
                              icon={<FaMotorcycle />}
                            >
                              <input
                                type="text"
                                name="bikeBrand"
                                required
                                placeholder="e.g. Yamaha FZS"
                                className={inputCls}
                              />
                            </Field>
                            <Field label="Registration Number">
                              <input
                                type="text"
                                name="bikeRegistration"
                                required
                                placeholder="e.g. DHA-12-3456"
                                className={inputCls}
                              />
                            </Field>
                            {/* Summary before submit */}
                            <div
                              className="mt-2 p-4 rounded-2xl border border-base-content/5 space-y-2"
                              style={{ background: "var(--color-base-200)" }}
                            >
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-3">
                                Application Summary
                              </p>
                              {[
                                ["Name", formData.name || user?.displayName],
                                ["Phone", formData.phone],
                                ["Region", formData.region],
                                ["District", formData.district],
                              ].map(
                                ([k, v]) =>
                                  v && (
                                    <div
                                      key={k}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <span className="opacity-35 font-bold uppercase tracking-wider">
                                        {k}
                                      </span>
                                      <span className="font-black">{v}</span>
                                    </div>
                                  ),
                              )}
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </fieldset>

                    {/* ── NAVIGATION BUTTONS ── */}
                    <div
                      className={`flex gap-3 mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}
                    >
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => setStep((s) => s - 1)}
                          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider border border-base-content/10 hover:border-base-content/25 transition-all duration-200 opacity-60 hover:opacity-90"
                        >
                          <FaChevronLeft className="text-xs" />
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading || (step === 1 && !region)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-250 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          background: "var(--color-primary)",
                          color: "#020617",
                          boxShadow:
                            "0 6px 24px color-mix(in srgb, var(--color-primary) 35%, transparent)",
                        }}
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : step < STEPS.length - 1 ? (
                          <>
                            <span>Next — {STEPS[step + 1]}</span>
                            <FaChevronRight className="text-xs" />
                          </>
                        ) : (
                          <>
                            <MdVerified />
                            <span>Submit Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      </div>
    </section>
  );
};

export default BeARider;
