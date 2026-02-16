import { useState, useEffect } from "react";
import { Link } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaBoxOpen,
  FaMotorcycle,
  FaChartLine,
  FaUserPlus,
} from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import useUserRole from "../../../hooks/useUserRole";

// Images
import img1 from "../../../assets/banner/banner1.webp";
import img2 from "../../../assets/banner/banner2.webp";
import img3 from "../../../assets/banner/banner3.webp";

const slides = [
  {
    image: img1,
    title: "Fast & Reliable \n Courier Service",
    subtitle: "Delivering trust, speed, and safety across the country.",
    accent: "Masakkali Express",
  },
  {
    image: img2,
    title: "Smart Logistics \n For Your Business",
    subtitle:
      "Empowering merchants with real-time tracking and seamless delivery.",
    accent: "Merchant Pro",
  },
  {
    image: img3,
    title: "Doorstep Delivery \n Within 24 Hours",
    subtitle:
      "Your packages are in safe hands. We value your time like our own.",
    accent: "Urban Swift",
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);
  const { user } = useAuthValue();
  const { role } = useUserRole();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // 🚀 Logic to decide which "Boom" buttons to show
  const renderActions = () => {
    if (!user) {
      return (
        <>
          <Link
            to="/login"
            className="btn btn-primary btn-lg px-8 rounded-2xl gap-3 shadow-xl shadow-primary/20"
          >
            Get Started <FaArrowRight />
          </Link>
          <Link
            to="/register"
            className="btn btn-outline btn-lg px-8 rounded-2xl border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-md"
          >
            Join Masakkali <FaUserPlus />
          </Link>
        </>
      );
    }

    if (role === "admin") {
      return (
        <Link
          to="/dashboard"
          className="btn btn-error btn-lg px-10 rounded-2xl gap-3 text-white shadow-xl shadow-error/20"
        >
          Admin Console <FaChartLine />
        </Link>
      );
    }

    if (role === "rider") {
      return (
        <Link
          to="/dashboard"
          className="btn btn-info btn-lg px-10 rounded-2xl gap-3 text-white shadow-xl shadow-info/20"
        >
          Current Deliveries <FaMotorcycle />
        </Link>
      );
    }

    return (
      <Link
        to="/sendParcel"
        className="btn btn-primary btn-lg px-10 rounded-2xl gap-3 shadow-xl shadow-primary/20"
      >
        Send a Parcel <FaBoxOpen />
      </Link>
    );
  };

  return (
    <section className="relative w-full h-[80vh] md:h-[95vh] overflow-hidden bg-neutral">
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slides[index].image}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. DYNAMIC CONTENT LAYER */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-page w-full">
          <div className="max-w-4xl space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-primary text-[11px] font-black uppercase tracking-[0.5em] backdrop-blur-xl">
                  {slides[index].accent}
                </span>

                <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tight whitespace-pre-line">
                  {slides[index].title}
                </h1>

                <p className="text-lg md:text-2xl text-white/60 max-w-xl font-light leading-relaxed">
                  {slides[index].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* PERSISTENT ACTION PORTAL (Outside Text AnimatePresence for stability) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              {renderActions()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. NEXT-GEN PROGRESS NAV */}
      <div className="absolute bottom-12 left-0 right-0 z-20">
        <div className="container-page flex items-center justify-between">
          <div className="flex items-center gap-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group flex flex-col gap-3"
              >
                <div className="relative w-16 h-1 bg-white/10 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: index === i ? "100%" : "0%" }}
                    transition={{
                      duration: index === i ? 8 : 0.5,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-primary shadow-[0_0_15px_rgba(var(--p),0.5)]"
                  />
                </div>
                <span
                  className={`text-[10px] font-black tracking-widest transition-all duration-300 ${index === i ? "text-primary" : "text-white/20"}`}
                >
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Social / Scroll indicator */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="h-px w-20 bg-white/20" />
            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
              Moving Fast Since 2024
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
