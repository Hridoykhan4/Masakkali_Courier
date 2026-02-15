import merchantImg from "../../../assets/location-merchant.png";
import beMerchantBg from "../../../assets/be-a-merchant-bg.png";
import { motion as Motion } from "framer-motion";
import useUserRole from "../../../hooks/useUserRole";
import { Link } from "react-router";

const BeMerchant = () => {
  const { role } = useUserRole();
  return (
    <Motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        background: `
          linear-gradient(135deg, rgba(51, 146, 157, 1), rgba(51, 146, 157, 0.56)),
          url(${beMerchantBg})
        `,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="relative container-page hero overflow-hidden mb-16 section-spacing rounded-3xl"
    >
      {/* Soft Glow Accent */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 blur-3xl rounded-full"></div>

      <div className="hero-content flex-col lg:flex-row-reverse gap-14 relative z-10">
        {/* Image */}
        <Motion.img
          src={merchantImg}
          className="max-w-sm w-full rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          animate={{ y: [0, -8, 0] }}
          viewport={{ once: true }}
        />

        {/* Content */}
        <div className="text-white max-w-xl">
          <Motion.h1
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-5xl font-extrabold leading-tight"
          >
            Merchant & Customer <br />
            Satisfaction Comes First
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="py-6 text-white/80"
          >
            Lowest delivery charge, fastest service, and 100% product safety. We
            deliver parcels to every corner of Bangladesh—right on time, every
            time.
          </Motion.p>

          {/* CTA Buttons */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-5"
          >
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary rounded-full px-8"
            >
              Become a Merchant
            </Motion.button>

            {role === "rider" && (
              <Link to="/beARider">
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline text-neutral btn-primary rounded-full px-8"
                >
                  Earn with Masakkali
                </Motion.button>
              </Link>
            )}
          </Motion.div>
        </div>
      </div>
    </Motion.section>
  );
};

export default BeMerchant;
