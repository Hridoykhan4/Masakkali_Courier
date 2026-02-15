import { motion as Motion } from "motion/react"; // Matches your package.json
import Marquee from "react-fast-marquee";
import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/randstad.png";
import logo5 from "../../../assets/brands/star.png";
import logo6 from "../../../assets/brands/start_people.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6];

const ClientLogoMarquee = () => {
  return (
    /* FIX: Remove 'container-page' from the section. 
       Use 'py-10' for tight, professional spacing instead of 'section-spacing'.
    */
    <section className="py-12 bg-base-200/50 border-y border-base-300 overflow-hidden">
      <div className="container-page">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-base-content/50 mb-10">
            Trusted by Industry Giants
          </h2>

          <Marquee
            pauseOnHover
            speed={40}
            gradient={true}
            gradientColor="var(--color-base-200)"
            className="overflow-hidden"
          >
            {logos.map((logo, i) => (
              <div key={i} className="flex bg-red-500 items-center justify-center px-12">
                <img
                  src={logo}
                  alt="Brand Logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
                />
              </div>
            ))}
          </Marquee>
        </Motion.div>
      </div>
    </section>
  );
};

export default ClientLogoMarquee;
