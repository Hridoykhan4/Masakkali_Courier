import { motion as Motion } from "motion/react";
import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/sports.webp";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/download.jfif";
import logo5 from "../../../assets/brands/star.png";
import logo6 from "../../../assets/brands/airbnb.jfif";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6];

const ClientLogoMarquee = () => {
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="section-spacing bg-base-100 overflow-hidden">
      <div className="container-page">
        <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-base-content/30 mb-12">
          Integrated with Global Logistics
        </h2>

        {/* The Masking Container */}
        <div className="relative flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)">
          <Motion.div
            className="flex flex-none gap-8 pr-8"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {duplicatedLogos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center 
                           w-40 h-20 md:w-52 md:h-24 
                           bg-base-200/40 backdrop-blur-sm 
                           border border-base-content/5 
                           rounded-2xl p-6 transition-all duration-300 
                           hover:bg-base-200 hover:border-base-content/10 group"
              >
                <img
                  src={logo}
                  alt="Brand Logo"
                  className="max-h-full w-auto object-contain 
                             opacity-40 group-hover:opacity-100 
                             transition-all duration-500 
                             dark:invert dark:brightness-200 
                             grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogoMarquee;
