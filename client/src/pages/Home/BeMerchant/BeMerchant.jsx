import merchantImg from "../../../assets/location-merchant.png";
import beMerchantBg from "../../../assets/be-a-merchant-bg.png";
import { motion as Motion } from "motion/react";
import useUserRole from "../../../hooks/useUserRole";
import { Link } from "react-router";

const BeMerchant = () => {
  const { role } = useUserRole();

  return (
    <section className="section-spacing bg-base-100">
      <div className="container-page">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] overflow-hidden bg-primary text-primary-content shadow-2xl"
        >
          {/* Background Image Layer with Theme-Aware Overlay */}
          <div
            className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url(${beMerchantBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Decorative Glows */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary/20 blur-3xl rounded-full" />

          <div className="relative z-10 px-8 py-12 lg:px-20 lg:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Content Side */}
              <div className="flex-1 text-center lg:text-left">
                <Motion.span
                  className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  Join the Network
                </Motion.span>

                <Motion.h2
                  className="text-3xl md:text-5xl font-black leading-tight mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  Merchant & Customer <br className="hidden md:block" />
                  Satisfaction Comes First
                </Motion.h2>

                <Motion.p
                  className="text-lg text-primary-content/80 mb-10 max-w-lg mx-auto lg:mx-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Lowest delivery charges, fastest service, and 100% safety. We
                  deliver parcels to every corner of Bangladesh—right on time.
                </Motion.p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button className="btn btn-lg bg-white text-primary border-none hover:bg-white/90 rounded-2xl px-10">
                    Become a Merchant
                  </button>

                  {role !== "rider" && (
                    <Link to="/beARider">
                      <button className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary rounded-2xl px-10">
                        Earn as a Rider
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Image Side */}
              <div className="flex-1 relative">
                <Motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.8 },
                  }}
                  className="relative z-10"
                >
                  <img
                    src={merchantImg}
                    alt="Merchant"
                    className="w-full max-w-[450px] mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
                  />
                </Motion.div>

                {/* Floating Card UI decoration */}
                <Motion.div
                  className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl hidden md:block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      ✓
                    </div>
                    <div>
                      <p className="text-black text-xs font-bold">
                        Fast Delivery
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        Guaranteed Safety
                      </p>
                    </div>
                  </div>
                </Motion.div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default BeMerchant;
