import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Import your images here as you did before
import img1 from "../../../assets/banner/banner1.webp";
import img2 from "../../../assets/banner/banner2.webp";
import img3 from "../../../assets/banner/banner3.webp";

const images = [img1, img2, img3];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.img
            src={images[index]}
            alt="Banner"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16">
            <motion.div
              initial="hidden"
              animate="visible"
              className="max-w-xl text-center text-white space-y-4"
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-6xl font-bold"
              >
                Fast & Reliable <br /> Courier Service
              </motion.h2>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm md:text-lg text-gray-200"
              >
                Delivering trust, speed, and safety across the country.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.5, delay: 0.6 }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full ${
              index === i ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
