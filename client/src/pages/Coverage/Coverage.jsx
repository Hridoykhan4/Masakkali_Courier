import { useLoaderData } from "react-router";
import CoverageMap from "./CoverageMap";

const Coverage = () => {
    const coverageData = useLoaderData();
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Nationwide Coverage</h1>
        <p className="text-base-content/70 mt-2">
          We currently deliver parcels across all 64 districts of Bangladesh
        </p>
      </div>

      {/* Search box (logic later) */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search your district..."
          className="input input-bordered w-full"
        />
      </div>

      {/* Map */}
      <CoverageMap  coverageData={coverageData} />
    </section>
  );
};

export default Coverage;
