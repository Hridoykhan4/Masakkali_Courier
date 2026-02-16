import { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkedAlt,
  FaGlobeAmericas,
  FaHashtag,
  FaCheckCircle,
} from "react-icons/fa";
import CoverageMap from "./CoverageMap";
import coverageData from "../../utils/coverageData";
import useScrollTo from "../../hooks/useScrollTo";

const Coverage = () => {
  useScrollTo();
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const search = query.toLowerCase().trim();
    return coverageData.filter(
      (item) =>
        item.district.toLowerCase().includes(search) ||
        item.region.toLowerCase().includes(search),
    );
  }, [query]);

  const stats = useMemo(
    () => ({
      districts: [...new Set(coverageData.map((d) => d.district))].length,
      regions: [...new Set(coverageData.map((d) => d.region))].length,
      hubs: coverageData.length,
    }),
    [],
  );

  return (
    <Motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-page section-spacing"
    >
      {/* --- 01. HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
        <div className="max-w-xl">
          <Motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black tracking-widest text-xs uppercase"
          >
            Operational Network
          </Motion.span>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mt-2">
            NATIONWIDE <span className="text-outline">REACH.</span>
          </h1>
        </div>

        {/* Stats: Hidden on very small screens, visible as a row on others */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          {[
            { label: "Districts", val: stats.districts, icon: <FaHashtag /> },
            { label: "Regions", val: stats.regions, icon: <FaGlobeAmericas /> },
            { label: "Hubs", val: stats.hubs, icon: <FaMapMarkedAlt /> },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-base-200/50 p-3 md:p-4 rounded-2xl border border-base-content/5 flex flex-col items-center text-center"
            >
              <span className="text-primary text-xs md:text-sm mb-1">
                {s.icon}
              </span>
              <span className="text-lg md:text-xl font-black">{s.val}</span>
              <span className="text-[8px] uppercase font-bold opacity-40 leading-none">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- 02. THE DUAL-VIEW INTERFACE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* SIDEBAR: Search & Results */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-125 lg:h-162.5">
          {/* Enhanced Search Input */}
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
            <input
              type="text"
              placeholder="Where do we deliver?"
              className="input w-full h-14 pl-12 rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary/20 transition-all font-semibold placeholder:opacity-50"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Results List */}
          <div className="flex-1 bg-base-200/20 rounded-4xl border border-base-content/5 overflow-hidden flex flex-col backdrop-blur-sm">
            <div className="px-5 py-4 border-b border-base-content/5 flex justify-between items-center bg-base-200/30">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Verified Hubs
              </span>
              <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                {filteredData.length} Areas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <Motion.div
                      layout
                      key={item.district}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-base-100/50 p-4 rounded-xl border border-transparent hover:border-primary/20 transition-all flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-black text-sm">{item.district}</h3>
                        <p className="text-[9px] font-bold uppercase opacity-40">
                          {item.region} Region
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-success/70 bg-success/5 px-2 py-1 rounded-lg">
                        <FaCheckCircle />
                        <span>ACTIVE</span>
                      </div>
                    </Motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs py-20 text-center px-6">
                    No delivery hubs found for "{query}"
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MAP VIEW: Optimized for Mobile Aspect Ratio */}
        <div className="lg:col-span-8 h-87.5 lg:h-auto order-first lg:order-last">
          <div className="w-full h-full bg-base-200 rounded-4xl lg:rounded-[3rem] overflow-hidden border border-base-content/5 shadow-inner relative">
            {/* Map Container */}
            <div className="absolute inset-0 z-0 opacity-90">
              <CoverageMap coverageData={filteredData} />
            </div>

            {/* Soft Overlay for Eye-Soothing UI */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.05)]" />

            {/* Mobile Tag */}
            <div className="absolute top-4 right-4 lg:top-8 lg:left-8 z-10">
              <span className="bg-base-100/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border border-white/10">
                Interactive Network Map
              </span>
            </div>
          </div>
        </div>
      </div>
    </Motion.section>
  );
};

export default Coverage;
