import { useQuery } from "@tanstack/react-query";
import customerImg from "../../../assets/customer-top.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { motion as Motion, AnimatePresence } from "framer-motion";
import reviewQuote from "../../../assets/reviewQuote.png";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";

const WhatCustomerSays = () => {
  const axiosPublic = useAxiosPublic();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const { data: reviews = [], isPending, isError } = useQuery({
    queryKey: ["reviews-home"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/reviews");
      return Array.isArray(data) ? data : [];
    },
  });

  const scrollToSelector = (index) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (!reviews?.length) return;
    const nextIndex = (currentIndex + 1) % reviews.length;
    scrollToSelector(nextIndex);
  };

  const handlePrev = () => {
    if (!reviews?.length) return;
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    scrollToSelector(prevIndex);
  };

  useEffect(() => {
    if (!sliderRef.current || !reviews?.length || isHovering) return;
    const interval = setInterval(() => handleNext(), 6000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, isHovering, currentIndex]);

  if (isError) return null;

  return (
    <section className="bg-base-100 section-spacing overflow-hidden relative">
      {/* Subtle Background Text for Luxury Feel */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[15vw] font-black opacity-[0.02] whitespace-nowrap pointer-events-none select-none">
        TESTIMONIALS
      </div>

      <div className="container-page relative z-10">
        {/* Header Section: Sophisticated & High-Contrast */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black tracking-[0.3em] uppercase mb-6 border border-primary/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Real Stories
          </Motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-base-content tracking-tight italic leading-[0.9] mb-8">
            TRUSTED BY <br />
            <span className="text-outline-sm text-transparent">LOGISTICS </span> 
            EXPERTS
          </h2>
          
          <p className="text-xl text-base-content/50 font-medium max-w-xl mx-auto leading-relaxed">
            The backbone of Masakkali isn't our fleet, it's the 
            <span className="text-base-content font-bold italic"> merchant success stories </span> 
            we build every single day.
          </p>
        </div>

        {/* Slider Wrapper */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Minimalist Side Nav */}
          <div className="absolute -inset-x-20 top-1/2 -translate-y-1/2 hidden lg:flex justify-between pointer-events-none">
            <button onClick={handlePrev} className="pointer-events-auto p-4 text-base-content/20 hover:text-primary transition-colors">
              <FaChevronLeft size={40} strokeWidth={1} />
            </button>
            <button onClick={handleNext} className="pointer-events-auto p-4 text-base-content/20 hover:text-primary transition-colors">
              <FaChevronRight size={40} strokeWidth={1} />
            </button>
          </div>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {isPending ? (
               <div className="min-w-full h-80 bg-base-200 animate-pulse rounded-[3rem]" />
            ) : (
              reviews.map((item) => (
                <div key={item._id} className="snap-center min-w-full px-4">
                  <div className="bg-base-200/40 border border-base-content/5 p-10 md:p-20 rounded-[4rem] relative group/card transition-all duration-500 hover:bg-base-200/60">
                    
                    <FaQuoteLeft className="text-6xl text-primary/10 absolute top-12 left-12" />

                    <div className="relative z-10">
                      <div className="flex gap-1 text-primary mb-10">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={18} fill={i < Math.floor(item.ratings || 5) ? "currentColor" : "none"} className="stroke-current" />
                        ))}
                      </div>

                      <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-base-content tracking-tight mb-16 italic">
                        “{item?.review}”
                      </blockquote>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-base-content/5">
                        <div className="flex items-center gap-5">
                          <img 
                            src={item?.user_photoURL || "https://i.ibb.co/mJR9Qxc/user.png"} 
                            className="w-16 h-16 rounded-2xl object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500 shadow-xl"
                            alt={item?.userName} 
                          />
                          <div>
                            <h4 className="text-xl font-black uppercase italic leading-none">{item?.userName}</h4>
                            <span className="text-[10px] font-black tracking-widest text-primary uppercase">Verified Merchant</span>
                          </div>
                        </div>
                        
                        <div className="px-6 py-2 rounded-full bg-base-content/5 text-[10px] font-black uppercase tracking-widest opacity-40 self-start md:self-auto">
                          Partner since {new Date(item?.date).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Luxury Dot Progress */}
          <div className="flex justify-center gap-4 mt-16">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSelector(idx)}
                className={`h-1 transition-all duration-700 rounded-full ${
                  currentIndex === idx ? "w-16 bg-primary" : "w-4 bg-base-content/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .text-outline-sm { -webkit-text-stroke: 1px currentColor; }`}</style>
    </section>
  );
};

export default WhatCustomerSays;