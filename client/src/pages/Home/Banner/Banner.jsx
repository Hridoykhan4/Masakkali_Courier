import { useState, useEffect, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ActionPortal from "../../../components/shared/ActionPortal";

const slides = [
  {
    title: "Fast &\nReliable",
    eyebrow: "Express Courier",
    subtitle: "Safe and on-time delivery across the country.",
    color: "#38bdf8",
    tag: "01",
    label: "Express",
    stat: "2M+",
    statLabel: "Parcels Delivered",
  },
  {
    title: "Smart\nLogistics",
    eyebrow: "Business Solutions",
    subtitle: "Grow your shop with our easy delivery solutions.",
    color: "#10b981",
    tag: "02",
    label: "Business",
    stat: "98%",
    statLabel: "On-Time Rate",
  },
  {
    title: "Doorstep\nIn 24hrs",
    eyebrow: "Ultra Fast",
    subtitle: "We value your time. We deliver your dreams.",
    color: "#fbbf24",
    tag: "03",
    label: "Ultra",
    stat: "50+",
    statLabel: "Cities Covered",
  },
];

// Reusable animated number badge
const StatBadge = ({ stat, statLabel, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-sm"
    style={{
      background: `${color}12`,
      borderColor: `${color}30`,
    }}
  >
    <span
      className="text-2xl font-black tabular-nums leading-none"
      style={{ color }}
    >
      {stat}
    </span>
    <span className="text-xs font-semibold uppercase tracking-widest  leading-tight max-w-20">
      {statLabel}
    </span>
  </motion.div>
);

// Animated grid lines
const GridLines = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Vertical lines */}
    {[20, 40, 60, 80].map((x) => (
      <div
        key={x}
        className="absolute top-0 bottom-0 w-px"
        style={{ left: `${x}%`, background: "rgba(255,255,255,0.03)" }}
      />
    ))}
    {/* Horizontal lines */}
    {[25, 50, 75].map((y) => (
      <div
        key={y}
        className="absolute left-0 right-0 h-px"
        style={{ top: `${y}%`, background: "rgba(255,255,255,0.03)" }}
      />
    ))}
  </div>
);

// Floating orb that shifts with slide
const DynamicOrb = ({ color, index }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.6, x: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.4, x: -80 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute pointer-events-none"
      style={{
        top: "-10%",
        right: "-5%",
        width: "55vw",
        height: "55vw",
        maxWidth: 700,
        maxHeight: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, ${color}08 45%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  </AnimatePresence>
);

// Bottom accent orb
const BottomOrb = ({ color, index }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.8 }}
      className="absolute pointer-events-none"
      style={{
        bottom: "-20%",
        left: "5%",
        width: "40vw",
        height: "40vw",
        maxWidth: 500,
        maxHeight: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  </AnimatePresence>
);

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  const current = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden font-urbanist"
      style={{ minHeight: "90vh" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── BASE LAYER: theme-aware background ─── */}
      <div className="absolute inset-0 bg-base-100 z-0" />

      {/* ─── GRID LINES ─── */}
      <GridLines />

      {/* ─── DYNAMIC ORBS ─── */}
      <DynamicOrb color={current.color} index={index} />
      <BottomOrb color={current.color} index={index} />

      {/* ─── NOISE GRAIN OVERLAY ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* ─── SLIDE NUMBER WATERMARK ─── */}
      <div className="absolute top-0 right-0 z-10 overflow-hidden pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.04, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="block text-[20vw] font-black text-base-content leading-none pr-6"
            style={{ lineHeight: 0.85 }}
          >
            {current.tag}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="relative z-10 container-page flex flex-col justify-between h-full min-h-[90vh] py-16 md:py-20">
        {/* TOP ROW: eyebrow + live indicator */}
        <div className="flex items-center justify-between w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index + "eyebrow"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {/* Animated accent dot */}
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: current.color }}
              />
              <span
                className="text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: current.color }}
              >
                {current.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Slide counter */}
          <div className="flex items-center gap-2 opacity-30">
            <span className="text-xs font-bold text-base-content tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="w-8 h-px bg-base-content/40" />
            <span className="text-xs font-bold text-base-content tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* MIDDLE ROW: headline + stat + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-0 my-auto">
          {/* ─── HEADLINE ─── */}
          <div className="flex-1 space-y-8">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={index + "title"}
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: "0%" }}
                  exit={{ opacity: 0, y: "-60%" }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[13vw] sm:text-[10vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw] font-black leading-[0.88] tracking-tighter text-base-content whitespace-pre-line"
                >
                  {current.title}
                </motion.h1>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={index + "sub"}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 0.5, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-base md:text-lg font-medium text-base-content max-w-md leading-relaxed pl-5 border-l-2"
                style={{ borderColor: `${current.color}50` }}
              >
                {current.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="relative z-50">
                <ActionPortal variant="banner" />
              </div>

              {/* Animated stat badge */}
              <AnimatePresence mode="wait">
                <StatBadge
                  key={index + "stat"}
                  stat={current.stat}
                  statLabel={current.statLabel}
                  color={current.color}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* ─── DESKTOP SLIDE NAV (vertical pills) ─── */}
          <div className="hidden lg:flex flex-col gap-4 lg:pl-16 lg:pb-2">
            {slides.map((item, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group flex items-center gap-4 text-left transition-all duration-300"
              >
                {/* Progress track */}
                <div className="relative w-1 h-12 rounded-full overflow-hidden bg-base-content/10">
                  <motion.div
                    className="absolute inset-x-0 bottom-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    animate={{ height: index === i ? "100%" : "0%" }}
                    transition={{
                      duration: index === i ? 6 : 0.4,
                      ease: index === i ? "linear" : "easeOut",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300"
                    style={{
                      color:
                        index === i
                          ? item.color
                          : "var(--color-base-content, #fff)",
                      opacity: index === i ? 1 : 0.25,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[10px] font-medium transition-opacity duration-300"
                    style={{
                      color: "var(--color-base-content)",
                      opacity: index === i ? 0.4 : 0.15,
                    }}
                  >
                    {item.stat} {item.statLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW: mobile dots + scroll hint */}
        <div className="flex items-center justify-between w-full">
          {/* Mobile dots */}
          <div className="flex lg:hidden items-center gap-3">
            {slides.map((item, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="relative h-1 rounded-full transition-all duration-500 overflow-hidden"
                style={{
                  width: index === i ? 32 : 12,
                  background:
                    index === i
                      ? item.color
                      : "var(--color-base-content, #fff)",
                  opacity: index === i ? 1 : 0.2,
                }}
              >
                {/* Auto-progress bar inside active dot */}
                {index === i && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="hidden md:flex items-center gap-2 opacity-20 ml-auto">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-4 h-7 rounded-full border-2 border-base-content flex items-start justify-center pt-1.5"
            >
              <div className="w-0.5 h-1.5 rounded-full bg-base-content" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content">
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* ─── ACCENT LINE (bottom edge) ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index + "line"}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left z-20"
          style={{
            background: `linear-gradient(to right, ${current.color}, transparent)`,
          }}
        />
      </AnimatePresence>
    </section>
  );
};

export default Banner;
