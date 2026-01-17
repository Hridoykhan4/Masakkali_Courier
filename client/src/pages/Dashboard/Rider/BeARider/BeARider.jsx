import { useMemo, useState } from "react";
import useAuthValue from "../../../../hooks/useAuthValue";
import deliveryMan from "../../../../assets/big-deliveryman.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import coverageData from "../../../../utils/coverageData";
import useScrollTo from "../../../../hooks/useScrollTo";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
const BeARider = () => {
  const axiosSecure = useAxiosSecure();
  useScrollTo();
  const { user } = useAuthValue();
  const [region, setRegion] = useState("");
  const regions = [...new Set(coverageData.map((s) => s.region))];
  const [loading, setLoading] = useState(false);
  const districts = useMemo(() => {
    return region
      ? coverageData
          .filter((item) => item.region === region)
          .map((s) => s.district)
      : [];
  }, [region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bdPhoneRegex = /^01[3-9]\d{8}$/;

    const riderApplications = Object.fromEntries(new FormData(e.target));
    if (!bdPhoneRegex.test(riderApplications.phone))
      return toast.error(
        "Invalid Bangladeshi Phone Number! It must be 11 digits and start with 013-019."
      );
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/riders", riderApplications);
      if (data?.insertedId) {
        toast.success("Application Submitted Successfully", {
          position: "top-right",
          autoClose: 1100,
        });
        e.target.reset();
        setRegion('')
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        toast.warning("You have already applied.");
      } else if (status === 400) {
        toast.error(message || "Check your input data.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-11/12 mx-auto py-7">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h2 className="text-4xl font-bold text-base-content">Become a Rider</h2>
        <p className="mt-4 text-base-content">
          Join our delivery network and earn by delivering parcels efficiently
          in your area. Flexible hours, reliable income, and real impact.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-base-100/30 shadow-2xl rounded-2xl p-8 space-y-5"
        >
          <h3 className="text-2xl font-semibold ">Rider Application Form</h3>
          <fieldset disabled={loading} className="space-y-5">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                defaultValue={user?.displayName || ""}
                readOnly
                className="input input-bordered w-full"
              />

              <input
                type="email"
                name="email"
                defaultValue={user?.email || ""}
                readOnly
                className="input input-bordered w-full"
              />
            </div>

            {/* Age */}
            <input
              type="number"
              name="age"
              step={1}
              required
              min={18}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Age"
              className="input input-bordered w-full"
            />

            {/* Region and district */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="region"
                required
                className="select select-bordered w-full"
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Select Region</option>
                {regions?.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                disabled={!region}
                name="district"
                className="select select-bordered w-full"
                required
                id=""
              >
                {districts?.length > 0 || (
                  <option value="">Select Region First</option>
                )}
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* NID */}
            <input
              type="number"
              name="nid"
              required
              placeholder="National ID Number"
              className="input input-bordered w-full"
            />
            {/* Bike Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bikeBrand"
                required
                placeholder="Bike Brand"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="bikeRegistration"
                required
                placeholder="Bike Registration Number"
                className="input input-bordered w-full"
              />
            </div>

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              required
              placeholder="01XXXXXXXXX"
              className="input input-bordered w-full"
              maxLength={11}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              pattern="^01[3-9]\d{8}$"
              title="Please enter a valid 11-digit Bangladeshi number (e.g., 01712345678)"
            />
            <button disabled={loading || !region} className="btn btn-primary w-full">
              {loading && <span className="loading loading-spinner"></span>}
              {loading ? "Submitting..." : "Apply as Rider"}
            </button>
          </fieldset>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <img
            src={deliveryMan}
            alt="Delivery Rider"
            className="rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BeARider;
