import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaLinkedinIn,
  FaArrowUp,
  FaPaperPlane,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-base-200 text-base-content border-t border-base-content/5 font-urbanist overflow-hidden">
      {/* 1. TOP UTILITY BAR (The "Hero Strip" replacement) */}
      <div className="bg-primary/3 border-b border-base-content/5">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
              Operational in 64 Districts
            </p>
          </div>
          <div className="flex gap-6">
            {["Tracking", "Support", "API"].map((item) => (
              <span
                key={item}
                className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-6">
            <div className="scale-90 origin-left">
              <MasakkaliLogo />
            </div>
            <p className="text-sm opacity-50 max-w-xs leading-relaxed">
              Automated logistics for the modern age. Speed, security, and
              precision in every delivery.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn].map(
                (Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-all duration-300"
                  >
                    <Icon size={12} />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-5 md:ml-auto w-full max-w-md">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">
              Newsletter
            </h4>
            <form className="relative flex items-center">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-base-100 border border-base-content/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary transition-all"
              />
              <button className="absolute right-2 p-2 bg-primary text-primary-content rounded-lg hover:scale-105 active:scale-95 transition-all">
                <FaPaperPlane size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* 3. BOTTOM */}
        <div className="mt-12 pt-6 border-t border-base-content/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
            © {currentYear} Masakkali. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-[9px] font-black opacity-30 uppercase tracking-tighter">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              Top{" "}
              <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* GIANT WATERMARK */}
      <div className="absolute -bottom-4 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.02] dark:opacity-[0.03]">
        <p className="text-[15vw] font-black text-center tracking-tighter leading-none">
          MASAKKALI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
