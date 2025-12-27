import { useLoaderData } from "react-router";
import CoverageMap from "./CoverageMap";

const Coverage = () => {
  const coverageData = useLoaderData();
  return (
    <section className="max-w-7xl mx-auto px-4 py-5">
      <div className="text-center mb-3">
        <h1 className="text-3xl sm:text-4xl font-bold">Nationwide Coverage</h1>
        <p className="text-base-content/70 mt-2">
          We currently deliver parcels across all 64 districts of Bangladesh
        </p>
      </div>

      <CoverageMap coverageData={coverageData} />
    </section>
  );
};

export default Coverage;
