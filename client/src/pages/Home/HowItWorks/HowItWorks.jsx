import {
  FaShippingFast,
  FaMoneyBillWave,
  FaWarehouse,
  FaBuilding,
} from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import { motion as Motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    id: "01",
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — easy booking, on-time delivery, every time.",
    icon: <FaShippingFast />,
    color: "#38bdf8",
  },
  {
    id: "02",
    title: "Cash On Delivery",
    description:
      "We collect payment securely from customers and ensure hassle-free cash settlement.",
    icon: <FaMoneyBillWave />,
    color: "#10b981",
  },
  {
    id: "03",
    title: "Delivery Hub",
    description:
      "Parcels sorted and processed at our network hubs for fast, accurate last-mile delivery.",
    icon: <FaWarehouse />,
    color: "#fbbf24",
  },
  {
    id: "04",
    title: "SME & Corporate",
    description:
      "Custom logistics solutions for SMEs and corporates with dedicated account support.",
    icon: <FaBuilding />,
    color: "#a78bfa",
  },
];

// Connector line between cards (desktop only)
const Connector = ({ color }) => (
  <div className="hidden lg:flex items-center flex-shrink-0 w-8 mt-10">
    <div className="relative w-full h-px" style={{ background: `${color}30` }}>
      <Motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </div>
);

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative flex-1 flex flex-col p-7 rounded-3xl border border-base-content/5 bg-base-200/50 overflow-hidden cursor-default transition-all duration-400 hover:border-base-content/12 hover:bg-base-200/80 hover:shadow-xl"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 0%, ${step.color}12, transparent 65%)`,
        }}
      />

      {/* Step number watermark */}
      <span
        className="absolute -top-2 -right-1 text-[5rem] font-black leading-none pointer-events-none select-none transition-opacity duration-400 opacity-[0.04] group-hover:opacity-[0.07]"
        style={{ color: step.color }}
      >
        {step.id}
      </span>

      {/* Icon */}
      <div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-lg mb-6 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
        style={{ background: `${step.color}18`, color: step.color }}
      >
        {step.icon}
        {/* Step dot */}
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-base-200 flex items-center justify-center text-[7px] font-black"
          style={{ background: step.color, color: "#020617" }}
        >
          {step.id.replace("0", "")}
        </span>
      </div>

      <h3 className="font-black text-base tracking-tight leading-tight mb-2.5">
        {step.title}
      </h3>
      <p className="text-sm text-base-content/45 font-medium leading-relaxed flex-1">
        {step.description}
      </p>

      {/* Bottom accent line */}
      <Motion.div
        className="absolute bottom-0 left-6 right-6 h-px rounded-full"
        style={{ backgroundColor: step.color }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 0.4, opacity: 0.4 } : {}}
        whileHover={{ scaleX: 1, opacity: 0.7 }}
        transition={{ duration: 0.5 }}
      />
    </Motion.div>
  );
};

const HowItWorks = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="section-spacing container-page font-urbanist">
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
            Simple Process
          </span>
        </Motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <Motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]"
          >
            HOW IT
            <br />
            <span
              style={{
                WebkitTextStroke: "2px var(--color-primary)",
                color: "transparent",
              }}
            >
              WORKS.
            </span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 0.45 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base font-medium max-w-sm text-base-content leading-relaxed md:text-right"
          >
            A simple, reliable process that keeps your deliveries fast, secure,
            and stress-free.
          </Motion.p>
        </div>
      </div>

      {/* ── STEPS ── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-stretch">
        {steps.map((step, i) => (
          <div key={step.id} className="contents">
            <StepCard step={step} index={i} />
            {i < steps.length - 1 && <Connector color={steps[i + 1].color} />}
          </div>
        ))}
      </div>

      {/* ── BOTTOM STAT STRIP ── */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { val: "4hrs", label: "Express Delivery", color: "#38bdf8" },
          { val: "98%", label: "On-Time Rate", color: "#10b981" },
          { val: "50+", label: "Districts", color: "#fbbf24" },
          { val: "24/7", label: "Support", color: "#a78bfa" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-base-content/5 bg-base-200/40"
          >
            <MdElectricBolt
              className="flex-shrink-0 text-sm"
              style={{ color: s.color }}
            />
            <div>
              <p
                className="font-black text-lg leading-none tabular-nums"
                style={{ color: s.color }}
              >
                {s.val}
              </p>
              <p className="text-[9px] uppercase font-black tracking-widest opacity-30 mt-0.5">
                {s.label}
              </p>
            </div>
          </div>
      ))}
      </Motion.div>
    </section>
  );
};

export default HowItWorks;
