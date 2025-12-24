import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/randstad.png";
import logo5 from "../../../assets/brands/star.png";
import logo6 from "../../../assets/brands/start_people.png";
import { motion as Motion } from "framer-motion";
import Marquee from "react-fast-marquee";
const logos = [logo1, logo2, logo3, logo4, logo5, logo6];
const ClientLogoMarquee = () => {
  return (
    <Motion.section
      className="py-10 bg-accent/40 max-w-7xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-10">
        Trusted by Leading Brands
      </h2>
      <Marquee pauseOnHover speed={50} gradient={false}>
        {logos?.map((logo, i) => (
          <div key={i} className="flex items-center gap-20 mx-16">
            <img src={logo} alt={logo} className="w-60 h-10 object-contain " />
          </div>
        ))}
      </Marquee>
    </Motion.section>
  );
};

export default ClientLogoMarquee;
