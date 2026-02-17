import { useMemo, useState, memo } from "react";
import { motion } from "framer-motion";
import {
  FaIdCard,
  FaPhoneAlt,
  FaUserEdit,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Lottie from "lottie-react";

// IMPORTANT: Use the light version to stop the 'Activity' undefined error
import lottieLight from "lottie-web/build/player/lottie_light";

import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useScrollTo from "../../../../hooks/useScrollTo";
import coverageData from "../../../../utils/coverageData";

// Memoized Animation Component to prevent crashes on re-render
const RiderAnimation = memo(() => (
  <Lottie
    path="/animations/rider.json"
    lottieObj={lottieLight} // This forces the stable, light engine
    loop={true}
    className="w-full h-auto drop-shadow-2xl"
  />
));
RiderAnimation.displayName = "RiderAnimation";

const BeARider = () => {
  const axiosSecure = useAxiosSecure();
  useScrollTo();
  const { user } = useAuthValue();
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  // Optimization: Extract regions once
  const regions = useMemo(
    () => [...new Set(coverageData.map((s) => s.region))],
    [],
  );

  // Optimization: Filter districts only when region changes
  const districts = useMemo(() => {
    if (!region) return [];
    return coverageData
      .filter((i) => i.region === region)
      .map((s) => s.district);
  }, [region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rawData = Object.fromEntries(formData);

    // Validation
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(rawData.phone)) {
      return toast.error("Invalid phone number format.");
    }

    const riderPayload = {
      ...rawData,
      age: parseInt(rawData.age),
      nid: rawData.nid.toString(),
      status: "pending",
      appliedAt: new Date().toISOString(),
      role: "rider_applicant",
      userEmail: user?.email,
    };

    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/riders", riderPayload);
      if (data?.insertedId) {
        toast.success("Application Sent! Check dashboard status.");
        e.target.reset();
        setRegion("");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warning("You already have a pending application.");
      } else {
        toast.error("Submission failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page section-spacing min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="badge badge-primary font-black tracking-widest uppercase mb-4 py-4 px-8 bg-primary/10 border-primary text-primary">
          Carrier Opportunity
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-6">
          RIDE & <span className="text-outline text-transparent">EARN</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Animation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 hidden lg:block sticky top-32"
        >
          <div className="bg-base-200/50 rounded-[3rem] p-6 border border-base-content/5 overflow-hidden">
            <RiderAnimation />
            <div className="mt-6 space-y-3">
              {["Flexible Shifts", "Transparent Pay", "24/7 Support"].map(
                (text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-base-100/80 p-4 rounded-2xl border border-white/5"
                  >
                    <FaCheckCircle className="text-primary" />
                    <span className="text-xs font-bold uppercase">{text}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-base-100 shadow-2xl rounded-[2.5rem] p-8 md:p-12 border border-base-content/5"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-primary rounded-2xl text-white">
                <FaUserEdit size={24} />
              </div>
              <h3 className="text-2xl font-black italic uppercase">
                Rider Profile
              </h3>
            </div>

            <fieldset disabled={loading} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">
                    Full Name
                  </label>
                  <input
                    name="name"
                    defaultValue={user?.displayName}
                    readOnly
                    className="input input-bordered w-full rounded-2xl bg-base-200 font-bold opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">
                    Email
                  </label>
                  <input
                    name="email"
                    defaultValue={user?.email}
                    readOnly
                    className="input input-bordered w-full rounded-2xl bg-base-200 font-bold opacity-70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">
                    Mobile
                  </label>
                  <FaPhoneAlt className="absolute left-5 top-11 opacity-20 text-xs" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="017XXXXXXXX"
                    maxLength={11}
                    className="input input-bordered w-full pl-12 rounded-2xl font-semibold"
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">
                    Age
                  </label>
                  <FaIdCard className="absolute left-5 top-11 opacity-20 text-xs" />
                  <input
                    type="number"
                    name="age"
                    required
                    min={18}
                    placeholder="Enter Age"
                    className="input input-bordered w-full pl-12 rounded-2xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  name="region"
                  required
                  className="select select-bordered w-full rounded-2xl h-14"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <select
                  name="district"
                  required
                  disabled={!region}
                  className="select select-bordered w-full rounded-2xl h-14"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="divider opacity-10 uppercase text-[10px] font-bold">
                Vehicle Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="bikeBrand"
                  required
                  placeholder="Bike Model"
                  className="input input-bordered w-full rounded-2xl h-14"
                />
                <input
                  type="text"
                  name="bikeRegistration"
                  required
                  placeholder="Reg Number"
                  className="input input-bordered w-full rounded-2xl h-14"
                />
              </div>

              <input
                type="text"
                name="nid"
                required
                placeholder="National ID (NID) Number"
                className="input input-bordered w-full rounded-2xl h-14"
              />

              <button
                type="submit"
                disabled={loading || !region}
                className="btn btn-primary w-full h-16 rounded-2xl text-lg font-black italic tracking-widest shadow-xl"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "SUBMIT APPLICATION"
                )}
              </button>
            </fieldset>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default BeARider;
