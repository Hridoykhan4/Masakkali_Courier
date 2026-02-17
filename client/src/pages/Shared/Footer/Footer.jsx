import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaPaperPlane,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-neutral text-neutral-content overflow-hidden">
      {/* 🟢 THE PRE-FOOTER GLOW: Makes it feel premium */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-page pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          {/* 1. BRAND IDENTITY & MISSION */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-2 grayscale brightness-200">
              <MasakkaliLogo />
            </div>
            <p className="text-neutral-content/50 max-w-xs leading-relaxed font-medium">
              Redefining global logistics through automated precision.
              Delivering trust and speed to every doorstep across the nation.
            </p>

            {/* SOCIAL ECOSYSTEM */}
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn].map(
                (Icon, idx) => (
                  <motion.a
                    key={idx}
                    whileHover={{
                      y: -5,
                      backgroundColor: "var(--color-primary)",
                    }}
                    className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-neutral-content/60 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    <Icon size={16} />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          {/* 2. NAVIGATION GRIDS */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="space-y-6">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-50">
                Network
              </h4>
              <ul className="space-y-3 text-neutral-content/40 text-sm font-bold uppercase tracking-wider">
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  About Us
                </li>
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  Coverage
                </li>
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  API Docs
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-50">
                Support
              </h4>
              <ul className="space-y-3 text-neutral-content/40 text-sm font-bold uppercase tracking-wider">
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  Help Desk
                </li>
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  Tracking
                </li>
                <li className="hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all" />
                  Contact
                </li>
              </ul>
            </div>
          </div>

          {/* 3. THE NEWSLETTER COMMAND */}
          <div className="lg:col-span-4 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />

            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">
              Join the Fleet
            </h4>
            <p className="text-neutral-content/50 text-xs mb-6 leading-relaxed italic">
              Subscribe to get real-time logistics updates and merchant insights
              directly.
            </p>

            <form className="relative flex flex-col gap-3">
              <input
                type="email"
                placeholder="fleet@masakkali.com"
                className="w-full bg-neutral border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm font-medium"
              />
              <button
                type="submit"
                className="btn-main w-full flex items-center justify-center gap-2 py-4"
              >
                Subscribe <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>
        </div>

        {/* 4. FOOTER BOTTOM: THE LEGAL & SCROLL */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/30">
              © {currentYear} Masakkali Courier Ltd.
            </p>
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-neutral-content/20">
              <span className="hover:text-primary cursor-pointer transition-colors">
                Terms
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                Privacy
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                Safety
              </span>
            </div>
          </div>

          {/* TOP BUTTON */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
