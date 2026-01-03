import CoverageMap from "./CoverageMap";
import coverageData from "../../utils/coverageData";
import { motion as Motion } from "framer-motion";
import useScrollTo from "../../hooks/useScrollTo";
const Coverage = () => {
  useScrollTo()
  const coverage = coverageData;
  return (
    <Motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, ease: "easeInOut", duration: 0.9 }}
      className="max-w-7xl overflow-hidden mx-auto px-4 py-5"
    >
      <Motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, ease: "easeInOut", duration: 0.9 }}
        className="text-center mb-3"
      >
        <h1 className="text-3xl sm:text-4xl font-bold">Nationwide Coverage</h1>
        <p className="text-base-content/70 mt-2">
          We currently deliver parcels across all 64 districts of Bangladesh
        </p>
      </Motion.div>

      <CoverageMap coverageData={coverage} />
    </Motion.section>
  );
};

export default Coverage;
