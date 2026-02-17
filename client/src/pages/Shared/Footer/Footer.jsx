import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaPaperPlane,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// ── NAV ITEMS (static, no hrefs — navbar handles routing) ──
const NAV = {
  Network: ["About Us", "Coverage", "API Docs", "Careers"],
  Support: ["Help Desk", "Tracking", "Contact", "Status"],
};

// ── TRUST BADGES ──
const TRUST = [
  { icon: <MdVerified />, label: "ISO Certified" },
  { icon: <MdElectricBolt />, label: "99.9% Uptime" },
  { icon: <MdVerified />, label: "Secure Payments" },
];

// ── SOCIAL (static, no hrefs) ──
const SOCIALS = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaTwitter, label: "Twitter" },
  { Icon: FaYoutube, label: "YouTube" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <footer className="relative bg-neutral text-neutral-content overflow-hidden font-urbanist">
      {/* ── DECORATIVE BG ELEMENTS ── */}
      {/* Top hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Large dim orb top-right */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      {/* Bottom-left orb */}
      <div
        className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Faint grid lines */}
      {[25, 50, 75].map((x) => (
        <div
          key={x}
          className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{ left: `${x}%`, background: "rgba(255,255,255,0.02)" }}
        />
      ))}

      {/* ── GIANT WATERMARK TEXT ── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <p
          className="text-[22vw] font-black leading-none text-white/[0.02] tracking-tighter text-center"
          style={{ lineHeight: 0.85 }}
        >
          MASAKKALI
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          HERO STRIP — the "dead footer" killer
      ══════════════════════════════════════════════ */}
      <div className="border-b border-white/5">
        <div className="container-page py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">
              Delivering nationwide
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] text-white">
              Every Parcel.
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(56,189,248,0.7)",
                  color: "transparent",
                }}
              >
                Every District.
              </span>
            </h2>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/8 bg-white/[0.03]"
              >
                <span className="text-primary text-sm">{t.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN FOOTER BODY
      ══════════════════════════════════════════════ */}
      <div ref={ref} className="container-page pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-start">
          {/* ── 1. BRAND ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-7"
          >
            <div className="grayscale brightness-200">
              <MasakkaliLogo />
            </div>

            <p className="text-neutral-content/40 max-w-xs leading-relaxed text-sm font-medium">
              Redefining logistics through automated precision. Delivering trust
              and speed to every doorstep across the nation.
            </p>

            {/* Social — static, no hrefs, visually rich */}
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                Find us on
              </p>
              <div className="flex gap-2.5">
                {SOCIALS.map(({ Icon, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{
                      y: -4,
                      backgroundColor: "var(--color-primary)",
                    }}
                    title={label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-neutral-content/50 hover:text-neutral cursor-pointer transition-colors duration-300"
                  >
                    <Icon size={14} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── 2. NAV LINKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-2 gap-6"
          >
            {Object.entries(NAV).map(([group, items]) => (
              <div key={group} className="space-y-5">
                <h4 className="text-white font-black text-[9px] uppercase tracking-[0.3em] opacity-40">
                  {group}
                </h4>
                <ul className="space-y-3.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="group flex items-center gap-2 text-neutral-content/35 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* ── 3. NEWSLETTER ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative p-7 rounded-[2rem] bg-white/[0.04] border border-white/8 overflow-hidden"
          >
            {/* Inner glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/8 blur-3xl rounded-full pointer-events-none" />

            {/* Corner accent line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="flex items-start justify-between mb-5">
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-1.5">
                  Join the Fleet
                </h4>
                <p className="text-neutral-content/35 text-xs leading-relaxed max-w-[220px]">
                  Real-time updates, merchant insights, and exclusive offers —
                  straight to your inbox.
                </p>
              </div>
              <span className="text-primary text-xl opacity-60 flex-shrink-0 mt-1">
                <MdElectricBolt />
              </span>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-neutral/60 border border-white/8 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium placeholder:opacity-30"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 hover:brightness-110 hover:shadow-xl"
                  style={{
                    background: "var(--color-primary)",
                    color: "#020617",
                    boxShadow: "0 6px 24px rgba(56,189,248,0.25)",
                  }}
                >
                  Subscribe <FaPaperPlane className="text-xs" />
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-3 py-6 text-center"
              >
                <span className="text-3xl text-primary">
                  <MdVerified />
                </span>
                <p className="text-white font-black text-sm">
                  You're in the fleet!
                </p>
                <p className="text-neutral-content/35 text-xs">
                  Expect updates at{" "}
                  <span className="text-primary">{email}</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════
            BOTTOM BAR
        ══════════════════════════════════════════════ */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-10">
            {/* Copyright */}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/25">
              © {currentYear} Masakkali Courier Ltd.
            </p>
            {/* Legal links — static */}
            <div className="flex gap-5 text-[9px] font-black uppercase tracking-widest text-neutral-content/15">
              {["Terms", "Privacy", "Safety"].map((l) => (
                <span
                  key={l}
                  className="hover:text-primary cursor-pointer transition-colors duration-200"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Right: made with love + scroll to top */}
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-content/15">
              Crafted with precision
            </span>

            <motion.button
              whileHover={{
                scale: 1.12,
                backgroundColor: "var(--color-primary)",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:text-neutral transition-all duration-300"
            >
              <FaArrowUp className="text-xs" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
