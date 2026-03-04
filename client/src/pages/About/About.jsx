import { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import {
  FaUserCircle,
  FaUserShield,
  FaMotorcycle,
  FaCheckCircle,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  MdElectricBolt,
  MdVerified,
  MdLocalShipping,
  MdOutlineTrackChanges,
  MdSecurity,
} from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { TbPackage, TbCoinFilled, TbRoute } from "react-icons/tb";
import useScrollTo from "../../hooks/useScrollTo";
import ActionPortal from "../../components/shared/ActionPortal";

// ─────────────────────────────────────────────────
//  TOKENS
// ─────────────────────────────────────────────────
const P = "var(--color-primary)";

// ─────────────────────────────────────────────────
//  REUSABLE MOTION WRAPPER
// ─────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 24, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────
//  SECTION EYEBROW
// ─────────────────────────────────────────────────
const Eyebrow = ({ children, color = P }) => (
  <div className="flex items-center gap-2 mb-4">
    <Motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
    <span
      className="text-[11px] font-black uppercase tracking-[0.32em]"
      style={{ color }}
    >
      {children}
    </span>
  </div>
);

// ─────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────
const About = () => {
  useScrollTo();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="font-urbanist overflow-x-hidden">
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative section-spacing container-page overflow-hidden">
        {/* Ambient orbs */}
        <div
          className="absolute -top-32 -right-32 w-150 h-150 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 65%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-100 h-100 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 65%)`,
            filter: "blur(60px)",
          }}
        />

        <div ref={heroRef} className="relative max-w-4xl">
          {/* Eyebrow */}
          <Motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Eyebrow>About Masakkali</Eyebrow>
          </Motion.div>

          {/* Main headline */}
          <Motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.07,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.88] mb-6"
          >
            Bangladesh's
            <br />
            <span
              style={{
                WebkitTextStroke: "2px var(--color-primary)",
                color: "transparent",
              }}
            >
              Smartest
            </span>
            <br />
            Parcel Network.
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-base md:text-lg font-medium opacity-45 max-w-2xl leading-relaxed mb-10"
          >
            Masakkali is a home & office pickup parcel delivery platform built
            for speed, transparency, and reliability — connecting senders,
            riders, and businesses across all 64 districts of Bangladesh.
          </Motion.p>

          {/* Stat pills */}
          <Motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { value: "64", label: "Districts" },
              { value: "3", label: "User Roles" },
              { value: "৳60", label: "From" },
              { value: "Live", label: "Tracking" },
            ].map((s, i) => (
              <Motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-base-content/8"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-primary) 6%, transparent)",
                }}
              >
                <span className="font-black text-base" style={{ color: P }}>
                  {s.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-35">
                  {s.label}
                </span>
              </Motion.div>
            ))}
          </Motion.div>
        </div>

        {/* Decorative diagonal rule */}
        <Motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="mt-16 h-px origin-left"
          style={{
            background:
              "linear-gradient(to right, var(--color-primary), transparent)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════
          WHAT WE DO — 3 PILLARS
      ══════════════════════════════════════════ */}
      <section className="section-spacing container-page">
        <Reveal>
          <Eyebrow>What We Do</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-12 max-w-lg">
            End-to-end logistics,{" "}
            <span
              style={{
                WebkitTextStroke: "1.5px var(--color-primary)",
                color: "transparent",
              }}
            >
              simplified.
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: MdLocalShipping,
              label: "01",
              title: "Pickup & Delivery",
              body: "Home and office pickup across all districts. From documents to heavy goods — we handle every parcel type with care and speed.",
              color: "var(--color-primary)",
            },
            {
              icon: MdOutlineTrackChanges,
              label: "02",
              title: "Live Tracking",
              body: "Real-time status updates from booking to doorstep. Every parcel gets a unique tracking ID — full transparency, no surprises.",
              color: "#a78bfa",
            },
            {
              icon: MdSecurity,
              label: "03",
              title: "Digital Proof",
              body: "OTP-based secure delivery confirmation. Digitally verified handoffs mean every delivery is accountable and tamper-proof.",
              color: "#10b981",
            },
          ].map((card, i) => (
            <Reveal key={card.label} delay={i * 0.1}>
              <div className="relative flex flex-col gap-5 p-6 rounded-2xl border border-base-content/5 bg-base-100 h-full overflow-hidden group">
                {/* Hover glow */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${card.color}25, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${card.color}18`, color: card.color }}
                >
                  <card.icon />
                </div>
                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.3em] mb-2"
                    style={{ color: card.color, opacity: 0.6 }}
                  >
                    {card.label}
                  </p>
                  <h3 className="text-lg font-black tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm font-medium opacity-40 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          USER ROLES
      ══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container-page">
          <Reveal>
            <Eyebrow>The System</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-3 max-w-lg">
              Three roles.{" "}
              <span
                style={{
                  WebkitTextStroke: "1.5px var(--color-primary)",
                  color: "transparent",
                }}
              >
                One network.
              </span>
            </h2>
            <p className="text-sm font-medium opacity-35 mb-12 max-w-xl">
              Masakkali is built around three coordinated roles that together
              power a seamless end-to-end logistics experience across
              Bangladesh.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: FaUserCircle,
                role: "Customer",
                color: "#10b981",
                desc: "Book parcels, pay charges, track shipments in real-time, and review service quality.",
                perks: [
                  "Real-time tracking",
                  "Flexible pricing",
                  "Service feedback",
                  "Order history",
                ],
              },
              {
                icon: FaUserShield,
                role: "Admin",
                color: "#38bdf8",
                desc: "Assign riders, manage routing, oversee warehouses, and monitor all platform operations.",
                perks: [
                  "Full system control",
                  "Rider management",
                  "Route optimisation",
                  "Revenue oversight",
                ],
                featured: true,
              },
              {
                icon: FaMotorcycle,
                role: "Rider",
                color: "#fbbf24",
                desc: "Collect parcels, update delivery status, confirm via OTP, and handle warehouse handoffs.",
                perks: [
                  "80% same-city rate",
                  "30% inter-district",
                  "Live task queue",
                  "Cashout wallet",
                ],
              },
            ].map((r, i) => (
              <Reveal key={r.role} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col gap-5 p-6 rounded-2xl border h-full overflow-hidden
                    ${r.featured ? "border-base-content/10" : "border-base-content/5 bg-base-100"}`}
                  style={
                    r.featured
                      ? {
                          background: `color-mix(in srgb, ${r.color} 5%, var(--color-base-100))`,
                          borderColor: `${r.color}30`,
                        }
                      : {}
                  }
                >
                  {r.featured && (
                    <div
                      className="absolute top-0 inset-x-0 h-0.5"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${r.color}80, ${r.color}, ${r.color}80, transparent)`,
                      }}
                    />
                  )}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${r.color}18`, color: r.color }}
                    >
                      <r.icon />
                    </div>
                    {r.featured && (
                      <span
                        className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ background: `${r.color}18`, color: r.color }}
                      >
                        Core
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-30">
                      Role
                    </p>
                    <h3
                      className="text-xl font-black tracking-tight mb-2"
                      style={{ color: r.color }}
                    >
                      {r.role}
                    </h3>
                    <p className="text-sm font-medium opacity-40 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2 mt-auto">
                    {r.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 text-xs font-bold"
                      >
                        <FaCheckCircle
                          className="shrink-0 text-[10px]"
                          style={{ color: r.color }}
                        />
                        <span className="opacity-55">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING TABLE
      ══════════════════════════════════════════ */}
      <section className="section-spacing container-page">
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-3 max-w-lg">
            Transparent rates.{" "}
            <span
              style={{
                WebkitTextStroke: "1.5px var(--color-primary)",
                color: "transparent",
              }}
            >
              No surprises.
            </span>
          </h2>
          <p className="text-sm font-medium opacity-35 mb-12 max-w-xl">
            Flat rates for documents, weight-based for goods. Always calculated
            at booking — no hidden fees.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {/* Documents */}
          <Reveal delay={0.05}>
            <div className="relative rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden">
              <div
                className="px-6 py-5 border-b border-base-content/5"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-primary) 5%, transparent)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <TbPackage className="text-lg" style={{ color: P }} />
                  <h3 className="font-black text-base tracking-tight">
                    Document
                  </h3>
                </div>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                  Any weight
                </p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {[
                  { label: "Within City / Same District", price: "৳60" },
                  { label: "Outside City / Inter District", price: "৳80" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between py-3 border-b border-base-content/5 last:border-0"
                  >
                    <span className="text-xs font-bold opacity-40">
                      {r.label}
                    </span>
                    <span className="font-black text-base" style={{ color: P }}>
                      {r.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Non-document */}
          <Reveal delay={0.1}>
            <div className="relative rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden">
              <div
                className="px-6 py-5 border-b border-base-content/5"
                style={{
                  background: "color-mix(in srgb, #fbbf24 5%, transparent)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <TbRoute className="text-lg" style={{ color: "#fbbf24" }} />
                  <h3 className="font-black text-base tracking-tight">
                    Non-Document
                  </h3>
                </div>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                  Weight-based
                </p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {[
                  { label: "Base (up to 3 kg) — Same District", price: "৳110" },
                  {
                    label: "Base (up to 3 kg) — Inter District",
                    price: "৳150",
                  },
                  {
                    label: "Extra weight charge (per kg above 3 kg)",
                    price: "+৳40/kg",
                  },
                  { label: "Inter District surcharge", price: "+৳40" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start justify-between py-2.5 border-b border-base-content/5 last:border-0 gap-3"
                  >
                    <span className="text-xs font-bold opacity-40 leading-relaxed">
                      {r.label}
                    </span>
                    <span
                      className="font-black text-base shrink-0"
                      style={{ color: "#fbbf24" }}
                    >
                      {r.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section className="section-spacing container-page">
        <Reveal>
          <Eyebrow>Features</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-12 max-w-lg">
            Built for the{" "}
            <span
              style={{
                WebkitTextStroke: "1.5px var(--color-primary)",
                color: "transparent",
              }}
            >
              long haul.
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: MdElectricBolt,
              label: "Automated Pricing",
              color: "var(--color-primary)",
              desc: "Instant cost calc at booking",
            },
            {
              icon: MdOutlineTrackChanges,
              label: "Live Tracking",
              color: "#a78bfa",
              desc: "End-to-end parcel visibility",
            },
            {
              icon: FaUserShield,
              label: "Role-based Access",
              color: "#38bdf8",
              desc: "Secure, scoped workflows",
            },
            {
              icon: MdSecurity,
              label: "OTP Delivery",
              color: "#10b981",
              desc: "Tamper-proof handoff",
            },
            {
              icon: FaMapMarkerAlt,
              label: "64 Districts",
              color: "#fbbf24",
              desc: "Nationwide BD coverage",
            },
            {
              icon: TbCoinFilled,
              label: "Commission Structure",
              color: "var(--color-primary)",
              desc: "Transparent rider earnings",
            },
            {
              icon: HiSparkles,
              label: "Digital Proof",
              color: "#a78bfa",
              desc: "Verified delivery receipts",
            },
            {
              icon: MdVerified,
              label: "Stripe Payments",
              color: "#10b981",
              desc: "Secure card processing",
            },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 0.04}>
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-base-content/5 bg-base-100 h-full group hover:border-base-content/10 transition-colors duration-200">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  <f.icon />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight mb-1">
                    {f.label}
                  </p>
                  <p className="text-[9px] font-bold opacity-28 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TECH STACK STRIP
      ══════════════════════════════════════════ */}
      <section className="section-spacing container-page">
        <Reveal>
          <Eyebrow>Tech Stack</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-10 max-w-lg">
            Modern stack.{" "}
            <span
              style={{
                WebkitTextStroke: "1.5px var(--color-primary)",
                color: "transparent",
              }}
            >
              Production-grade.
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              side: "Frontend",
              color: "var(--color-primary)",
              items: [
                { name: "React 19", role: "UI framework" },
                { name: "React Router 7", role: "Navigation" },
                { name: "TanStack Query", role: "Server state" },
                { name: "Framer Motion", role: "Animations" },
                { name: "Recharts", role: "Data visualisation" },
                { name: "Tailwind + DaisyUI", role: "Styling system" },
                { name: "Stripe.js", role: "Payment processing" },
                { name: "Firebase", role: "Auth" },
              ],
            },
            {
              side: "Backend",
              color: "#fbbf24",
              items: [
                { name: "Express 5", role: "API server" },
                { name: "MongoDB", role: "Primary database" },
                { name: "Firebase Admin", role: "Token verification" },
                { name: "Stripe", role: "Payment intents" },
                { name: "Node.js", role: "Runtime" },
                { name: "CORS + dotenv", role: "Config & security" },
              ],
            },
          ].map((stack, si) => (
            <Reveal key={stack.side} delay={si * 0.08}>
              <div className="rounded-2xl border border-base-content/5 bg-base-100 overflow-hidden h-full">
                <div
                  className="flex items-center gap-2 px-6 py-4 border-b border-base-content/5"
                  style={{
                    background: `color-mix(in srgb, ${stack.color} 5%, transparent)`,
                  }}
                >
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.28em]"
                    style={{ color: stack.color }}
                  >
                    {stack.side}
                  </span>
                </div>
                <div className="divide-y divide-base-content/4.5">
                  {stack.items.map((item, i) => (
                    <Motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <span className="text-xs font-black">{item.name}</span>
                      <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                        {item.role}
                      </span>
                    </Motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="section-spacing container-page">
        <Reveal>
          <div className="relative rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden px-8 md:px-14 py-14 flex flex-col items-center text-center">
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%)",
              }}
            />
            {/* Top accent */}
            <div
              className="absolute top-0 inset-x-0 h-0.75"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <HiSparkles className="text-sm" style={{ color: P }} />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ color: P }}
                >
                  Get Started
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-4">
                Ready to ship
                <br />
                <span
                  style={{
                    WebkitTextStroke: "2px var(--color-primary)",
                    color: "transparent",
                  }}
                >
                  anything?
                </span>
              </h2>
              <p className="text-sm font-medium opacity-35 max-w-xs mb-8 mx-auto">
                Join thousands of senders and riders on the Masakkali network.
              </p>

              <div className="relative z-50">
                <ActionPortal variant="banner" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default About;
