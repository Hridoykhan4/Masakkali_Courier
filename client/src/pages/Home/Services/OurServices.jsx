import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaBoxes,
  FaMoneyBillWave,
  FaBuilding,
  FaUndoAlt,
} from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import { motion as Motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "Express & Standard Delivery",
    short: "24–72hr delivery",
    description:
      "Deliver parcels within 24–72 hours across Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery within 4–6 hours in Dhaka.",
    icon: <FaShippingFast />,
    color: "#38bdf8",
    badge: "Most Popular",
  },
  {
    title: "Nationwide Delivery",
    short: "Every district",
    description:
      "Home delivery in every district across Bangladesh. Your products reach customers within 48–72 hours, no matter where they are.",
    icon: <FaMapMarkedAlt />,
    color: "#10b981",
    badge: null,
  },
  {
    title: "Fulfillment Solution",
    short: "End-to-end ops",
    description:
      "Inventory management, online order processing, packaging, and after-sales support — all under one roof.",
    icon: <FaBoxes />,
    color: "#fbbf24",
    badge: null,
  },
  {
    title: "Cash on Delivery",
    short: "100% guaranteed",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed product safety and secure remittance.",
    icon: <FaMoneyBillWave />,
    color: "#10b981",
    badge: "Guaranteed",
  },
  {
    title: "Corporate & Contract",
    short: "Dedicated account",
    description:
      "Custom corporate services including warehouse and inventory management support with a dedicated account manager.",
    icon: <FaBuilding />,
    color: "#a78bfa",
    badge: null,
  },
  {
    title: "Parcel Return",
    short: "Reverse logistics",
    description:
      "Reverse logistics facility lets customers return or exchange products with online merchants — seamless and fast.",
    icon: <FaUndoAlt />,
    color: "#fb7185",
    badge: null,
  },
];

const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative flex flex-col p-7 rounded-3xl border border-base-content/5 bg-base-100 overflow-hidden cursor-default transition-all duration-350 hover:border-base-content/10 hover:shadow-2xl"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 0%, ${service.color}10, transparent 60%)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute top-6 bottom-6 left-0 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-400"
        style={{ backgroundColor: service.color }}
      />

      {/* Badge */}
      {service.badge && (
        <span
          className="absolute top-5 right-5 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
          style={{ color: service.color, background: `${service.color}18` }}
        >
          {service.badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-base mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${service.color}16`, color: service.color }}
      >
        {service.icon}
      </div>

      {/* Short label */}
      <p
        className="text-[9px] font-black uppercase tracking-widest mb-2"
        style={{ color: service.color }}
      >
        {service.short}
      </p>

      <h3 className="font-black text-base tracking-tight leading-tight mb-3">
        {service.title}
      </h3>
      <p className="text-sm text-base-content/45 font-medium leading-relaxed flex-1">
        {service.description}
      </p>

      {/* CTA line */}
      <div
        className="flex items-center gap-1.5 mt-5 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity duration-300"
        style={{ color: service.color }}
      >
        <MdElectricBolt />
        <span>Learn more</span>
      </div>
    </Motion.div>
  );
};

const OurServices = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="section-spacing bg-base-200/40 overflow-hidden font-urbanist">
      <div className="container-page">
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
              className="w-2 h-2 rounded-full bg-primary shrink-0"
            />
            <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
              What We Offer
            </span>
          </Motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <Motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]"
            >
              OUR
              <br />
              <span
                style={{
                  WebkitTextStroke: "2px var(--color-primary)",
                  color: "transparent",
                }}
              >
                SERVICES.
              </span>
            </Motion.h2>
            <Motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 0.45 } : {}}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base font-medium max-w-sm text-base-content leading-relaxed md:text-right"
            >
              Fast, reliable delivery with real-time tracking — built for
              businesses and individuals alike.
            </Motion.p>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default OurServices;
