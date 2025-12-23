import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion as Motion } from "framer-motion";

import img1 from "../../../assets/banner/banner1.png";
import img2 from "../../../assets/banner/banner2.png";
import img3 from "../../../assets/banner/banner3.png";
import img4 from "../../../assets/banner/ari-sha-RqZ-xGRnCYI-unsplash (1).jpg";
import img5 from "../../../assets/banner/claudio-schwarz-q8kR_ie6WnI-unsplash (1).jpg";
import img6 from "../../../assets/banner/jan-kopriva-b6fns2kOFsk-unsplash (1).jpg";

const images = [img1, img2, img3, img4, img5, img6];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const Banner = () => {
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <Carousel
        autoPlay
        infiniteLoop
        swipeable
        showThumbs={false}
        showStatus={false}
        interval={3500}
        transitionTime={800}
        stopOnHover
        emulateTouch
      >
        {images.map((image, i) => (
          <div className="relative h-[70vh] md:h-[85vh]" key={i}>
            <Motion.img
              src={image}
              alt={`Banner-${i}`}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3.5, ease: "easeOut" }}
            />

            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />

            <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16">
              <Motion.div
                className="max-w-xl text-white space-y-4"
                variants={container}
                initial="hidden"
                whileInView="visible"
                key={i}
              >
                <Motion.h2
                  variants={item}
                  className="text-2xl md:text-5xl font-bold leading-tight"
                >
                  Fast & Reliable <br /> Courier Service
                </Motion.h2>

                <Motion.p
                  variants={item}
                  className="text-sm md:text-lg text-gray-200"
                >
                  Delivering trust, speed, and safety across the country.
                </Motion.p>
{/* 
                <Motion.div variants={item}>
                  <button className="btn btn-primary mt-4">Get Started</button>
                </Motion.div> */}
              </Motion.div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
