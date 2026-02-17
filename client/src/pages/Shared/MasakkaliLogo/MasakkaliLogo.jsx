import { Link } from "react-router";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";

const MasakkaliLogo = () => {
  return (
    <Link 
      to="/" 
      className="group flex items-center gap-3 select-none outline-none"
    >
      {/* 1. THE ICON ENGINE */}
      <div className="relative flex items-center justify-center">
        {/* Soft Shadow/Glow that works in both themes */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-500" />
        
        <motion.div
          whileHover={{ y: -2, rotate: [-5, 5, -5, 0] }}
          className="relative z-10 w-9 h-9 sm:w-11 sm:h-11"
        >
          <img 
            className="w-full h-full object-contain filter drop-shadow-sm brightness-110" 
            src={logo} 
            alt="Masakkali Logo" 
          />
        </motion.div>

        {/* System Alive Indicator */}
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
      </div>

      {/* 2. THE TYPOGRAPHY (The Fix for Light/Dark) */}
      <div className="flex flex-col -space-y-1.5">
        <div className="flex items-baseline">
          <p className="text-xl sm:text-2xl font-black tracking-tighter transition-colors duration-300  group-hover:text-primary dark:group-hover:text-primary"
          >
            MASAKKALI
          </p>
          <motion.span 
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-primary italic font-black ml-0.5"
          >
            .
          </motion.span>
        </div>
        
        {/* Adaptive Sub-label */}
        <span className="text-[9px] font-extrabold uppercase tracking-[0.4em] 
          text-slate-400 dark:text-slate-500 transition-colors duration-300"
        >
          Express Logistics
        </span>
      </div>
    </Link>
  );
};

export default MasakkaliLogo;