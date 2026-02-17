import merchantImg from "../../../assets/location-merchant.png";
import beMerchantBg from "../../../assets/be-a-merchant-bg.png";
import { motion as Motion } from "motion/react";
import ActionPortal from "../../../components/shared/ActionPortal";
import { FaHandshake } from "react-icons/fa";

const BeMerchant = () => {


  return (
    <section className="section-spacing bg-base-100 transition-colors duration-500 overflow-hidden">
      <div className="container-page">
        {/* Main Card with Glassmorphism */}
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] glass-card overflow-hidden"
        >
          {/* Background Mesh/Pattern Overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.08] grayscale pointer-events-none"
            style={{
              backgroundImage: `url(${beMerchantBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 px-8 py-16 lg:px-20 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
            {/* LEFT: TEXT CONTENT */}
            <div className="flex-1 text-center lg:text-left">
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <FaHandshake className="text-sm" /> Masakkali Partnership
              </Motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-base-content leading-[1.1] mb-6 tracking-tight">
                Seamless Logistics <br />
                <span className="text-primary">Global Standards.</span>
              </h2>

              <p className="text-lg text-base-content/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                From local entrepreneurs to national enterprises, we provide the
                digital backbone for your supply chain. Reliable, safe, and
                fast.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <ActionPortal variant="default" />
              </div>
            </div>

            {/* RIGHT: IMAGE AREA */}
            <div className="flex-1 relative">
              <Motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <img
                  src={merchantImg}
                  alt="Logistics Partnership"
                  className="w-full max-w-120 mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] filter saturate-[1.1]"
                />
              </Motion.div>

              {/* High-End Data Badge */}
              <Motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute -bottom-6 right-0 md:right-10 bg-base-100/80 backdrop-blur-2xl border border-base-content/10 p-5 rounded-3xl shadow-2xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="radial-progress text-primary transition-all duration-1000"
                    style={{
                      "--value": 70,
                      "--size": "3.5rem",
                      "--thickness": "4px",
                    }}
                    role="progressbar"
                  >
                    <span className="text-[10px] font-black">70%</span>
                  </div>
                  <div>
                    <p className="text-base-content font-black text-sm">
                      Faster Growth
                    </p>
                    <p className="text-base-content/50 text-[10px] font-bold uppercase tracking-wider">
                      Merchant Success Rate
                    </p>
                  </div>
                </div>
              </Motion.div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default BeMerchant;
