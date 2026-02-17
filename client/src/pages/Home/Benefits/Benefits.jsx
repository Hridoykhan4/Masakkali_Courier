import { motion as Motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { FaShieldAlt, FaHeadset, FaSatellite } from "react-icons/fa";

import benefit1 from "../../../assets/live-tracking.png";
import benefit2 from "../../../assets/safe-delivery.png";
import benefit3 from "../../../assets/tiny-deliveryman.png";

const benefits = [
  {
    id: "01",
    title: "100% Safe Delivery",
    tagline: "Zero damage guarantee",
    description:
      "Secure handling of every parcel with proper packaging, careful transportation, and verified delivery processes at every step.",
    image: benefit2,
    icon: <FaShieldAlt />,
    color: "#10b981",
    stat: { val: "0%", label: "Damage Rate" },
  },
  {
    id: "02",
    title: "24/7 Call Center",
    tagline: "Always available",
    description:
      "Our dedicated support team is available around the clock to assist with tracking, delivery updates, and instant issue resolution.",
    image: benefit1,
    icon: <FaHeadset />,
    color: "#38bdf8",
    stat: { val: "< 2m", label: "Response Time" },
  },
  {
    id: "03",
    title: "Real-Time Tracking",
    tagline: "Full transparency",
    description:
      "Track your parcels in real-time with full transparency from pickup to final delivery — complete peace of mind, always.",
    image: benefit3,
    icon: <FaSatellite />,
    color: "#fbbf24",
    stat: { val: "Live", label: "GPS Updates" },
  },
];

const BenefitRow = ({ benefit, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 !== 0; // alternates image side on desktop

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-1 md:grid-cols-12 gap-0 rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden hover:border-base-content/10 hover:shadow-2xl transition-all duration-400"
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${isEven ? "80%" : "20%"} 50%, ${benefit.color}07, transparent 60%)`,
        }}
      />

      {/* ── IMAGE PANEL ── */}
      <div
        className={`relative md:col-span-4 flex items-center justify-center p-10 ${isEven ? "md:order-last" : ""}`}
        style={{ background: `${benefit.color}08` }}
      >
        {/* Number watermark */}
        <span
          className="absolute top-2 left-4 text-[5rem] font-black leading-none select-none pointer-events-none"
          style={{ color: benefit.color, opacity: 0.08 }}
        >
          {benefit.id}
        </span>

        <Motion.img
          src={benefit.image}
          alt={benefit.title}
          className="relative z-10 w-40 h-36 md:w-48 md:h-44 object-contain drop-shadow-lg"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* ── DIVIDER ── */}
      <div
        className="hidden md:block md:col-span-1 w-px self-stretch mx-auto"
        style={{
          background: `linear-gradient(to bottom, transparent, ${benefit.color}25, transparent)`,
        }}
      />

      {/* ── CONTENT ── */}
      <div className="md:col-span-7 flex flex-col justify-center px-8 md:px-10 py-8 md:py-10">
        {/* Top row: tag + stat */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: `${benefit.color}18`, color: benefit.color }}
            >
              {benefit.icon}
            </div>
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em]"
              style={{ color: benefit.color }}
            >
              {benefit.tagline}
            </span>
          </div>

          {/* Stat badge */}
          <div
            className="flex flex-col items-end px-3 py-2 rounded-xl border"
            style={{
              borderColor: `${benefit.color}25`,
              background: `${benefit.color}08`,
            }}
          >
            <span
              className="font-black text-lg leading-none tabular-nums"
              style={{ color: benefit.color }}
            >
              {benefit.stat.val}
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-0.5">
              {benefit.stat.label}
            </span>
          </div>
        </div>

        <h3 className="font-black text-2xl md:text-3xl tracking-tight leading-tight mb-3">
          {benefit.title}
        </h3>
        <p className="text-sm md:text-base text-base-content/45 font-medium leading-relaxed max-w-lg">
          {benefit.description}
        </p>

        {/* Verified pill */}
        <div className="flex items-center gap-1.5 mt-6">
          <MdVerified className="text-sm" style={{ color: benefit.color }} />
          <span
            className="text-[9px] font-black uppercase tracking-widest opacity-50"
            style={{ color: benefit.color }}
          >
            Masakkali Guaranteed
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

const Benefits = () => {
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
            Why Choose Us
          </span>
        </Motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <Motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]"
          >
            BUILT FOR
            <br />
            <span
              style={{
                WebkitTextStroke: "2px var(--color-primary)",
                color: "transparent",
              }}
            >
              TRUST.
            </span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 0.45 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base font-medium max-w-sm text-base-content leading-relaxed md:text-right"
          >
            Reliability, transparency, and customer satisfaction — the three
            pillars behind every delivery we make.
          </Motion.p>
        </div>
      </div>

      {/* ── BENEFIT ROWS ── */}
      <div className="space-y-4">
        {benefits.map((benefit, i) => (
          <BenefitRow key={benefit.id} benefit={benefit} index={i} />
        ))}
      </div>

      {/* ── BOTTOM TRUST BAR ── */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4 py-6 px-6 rounded-2xl border border-base-content/5 bg-base-200/40"
      >
        {[
          {
            icon: <MdVerified />,
            text: "ISO Certified Operations",
            color: "#10b981",
          },
          {
            icon: <MdElectricBolt />,
            text: "99.9% Network Uptime",
            color: "#38bdf8",
          },
          {
            icon: <MdVerified />,
            text: "Secure Payment Gateway",
            color: "#fbbf24",
          },
        ].map((t) => (
          <div key={t.text} className="flex items-center gap-2">
            <span className="text-sm" style={{ color: t.color }}>
              {t.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              {t.text}
            </span>
            <span className="text-base-content/10 last:hidden">·</span>
          </div>
        ))}
      </Motion.div>
    </section>
  );
};

export default Benefits;
