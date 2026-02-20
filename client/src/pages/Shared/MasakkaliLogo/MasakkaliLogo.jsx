import { Link } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";

const MasakkaliLogo = () => {
  return (
    <Link
      to="/"
      className="group relative flex items-center gap-4 select-none outline-none"
    >
      {/* 1. THE LOGISTICS HUD (Background Layer) */}
      <div className="absolute -inset-x-4 -inset-y-2 bg-primary/0 group-hover:bg-primary/3 rounded-2xl transition-colors duration-500 -z-10" />

      {/* 2. THE ASSET ENGINE */}
      <div className="relative flex items-center justify-center">
        {/* Radar Pulse Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.15, 0],
              scale: [0.8, 1.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
            className="absolute inset-0 border border-primary rounded-full"
          />
        ))}

        {/* The Scanning Line (Hover Effect) */}
        <motion.div
          initial={{ top: "-10%" }}
          whileHover={{ top: "110%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-0.5 bg-primary/40 blur-[1px] z-20 hidden group-hover:block"
        />

        {/* Logo Container */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
        >
          <img
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(var(--color-primary),0.3)] group-hover:brightness-125 transition-all duration-300"
            src={logo}
            alt="Masakkali Logo"
          />
        </motion.div>

        {/* Status Indicator (High Precision) */}
        <div className="absolute -right-1 -top-1 z-30">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-base-100 shadow-sm"></span>
          </span>
        </div>
      </div>

      {/* 3. THE TYPOGRAPHY SYSTEM */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          {/* Main Brand with "Glitch" entrance */}
          <motion.p className="text-2xl sm:text-3xl font-black tracking-tighter text-base-content group-hover:text-primary transition-colors duration-500">
            MASAKKALI
          </motion.p>

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-primary mt-3"
          />
        </div>

        {/* The Logistics Sub-Data */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-base-content/40 group-hover:text-primary/60 transition-colors duration-300">
            Express Logistics
          </span>

          {/* Real-time Tracking Simulation */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden group-hover:flex items-center gap-1"
            >
              <div className="h-px w-4 bg-primary/30" />
              <span className="text-[8px] font-mono font-bold text-primary animate-pulse">
                LIVE_GS_V2
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. THE FLOW PARTICLES (Extreme Polish) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-20, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-0 w-8 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
      </div>
    </Link>
  );
};

export default MasakkaliLogo;
