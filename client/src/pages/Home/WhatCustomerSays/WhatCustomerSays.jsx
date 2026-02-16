import { useQuery } from "@tanstack/react-query";
import customerImg from "../../../assets/customer-top.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { motion as Motion } from "framer-motion";
import reviewQuote from "../../../assets/reviewQuote.png";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const WhatCustomerSays = () => {
  const axiosPublic = useAxiosPublic();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

const { data: reviews = [], isPending, isError, error } = useQuery({
    queryKey: ["reviews-home"], // Changed key to avoid collisions
    queryFn: async () => {
      console.log("Fetching reviews from:", "/reviews"); // Debugging
      const { data } = await axiosPublic.get("/reviews");
      console.log("Data Received:", data); // Check your console!
      return Array.isArray(data) ? data : [];
    },
    staleTime: 0, // Force fresh data
    gcTime: 1000 * 60 * 5,
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
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [reviews, isHovering, currentIndex]);

  if (isError) return (
    <div className="py-20 text-center text-error font-medium animate-bounce">
      ⚠️ Failed to sync community voices.
    </div>
  );

  return (
    <section className="bg-gradient-to-b from-base-100 to-base-200/50 section-spacing overflow-hidden">
      <div className="container-page">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Motion.img
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            src={customerImg}
            alt="Customers"
            className="mb-6 w-40 drop-shadow-2xl"
          />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Voice of Our Community
          </h2>
          <div className="h-2 w-24 bg-primary rounded-full mb-8 shadow-lg shadow-primary/20"></div>
          <p className="max-w-2xl text-base-content/70 text-lg font-medium">
            Discover why thousands of merchants trust Masakkali for their daily logistics.
          </p>
        </div>

        {/* Slider Section */}
        <div 
          className="relative group px-4 md:px-0"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Custom Nav Buttons */}
          <div className="hidden md:block">
            <button onClick={handlePrev} className="absolute -left-16 top-1/2 -translate-y-1/2 btn btn-circle btn-lg border-none bg-base-100 shadow-2xl hover:bg-primary hover:text-white transition-all duration-500 z-20">
              <FaChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className="absolute -right-16 top-1/2 -translate-y-1/2 btn btn-circle btn-lg border-none bg-base-100 shadow-2xl hover:bg-primary hover:text-white transition-all duration-500 z-20">
              <FaChevronRight size={24} />
            </button>
          </div>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6"
          >
            {isPending ? (
              /* Skeleton Loader for 10X Feel */
              [...Array(1)].map((_, i) => (
                <div key={i} className="min-w-full h-[400px] bg-base-300 animate-pulse rounded-[3rem]"></div>
              ))
            ) : (
              (reviews || []).map((item) => (
                <div key={item._id} className="snap-center min-w-full py-4">
                  <div className="bg-base-100 border border-base-300/30 p-8 md:p-16 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden group/card hover:shadow-primary/10 transition-shadow duration-700">
                    
                    {/* Background Accent */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover/card:bg-primary/10 transition-colors"></div>

                    <img src={reviewQuote} className="absolute top-10 right-12 w-20 opacity-10 pointer-events-none" alt="Quote" />

                    {/* Ratings with fixed key mapping */}
                    <div className="flex gap-1.5 text-warning mb-8">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={22}
                          fill={i < Math.floor(item.ratings || 5) ? "currentColor" : "none"}
                          className="drop-shadow-sm stroke-current"
                        />
                      ))}
                    </div>

                    <blockquote className="text-2xl md:text-4xl font-semibold leading-snug italic text-base-content tracking-tight mb-12">
                      “{item?.review}”
                    </blockquote>

                    <div className="flex items-center gap-6 pt-10 border-t border-base-200">
                      <div className="avatar">
                        <div className="w-16 md:w-20 rounded-2xl rotate-3 group-hover/card:rotate-0 transition-transform duration-500 ring-4 ring-primary/10">
                          <img src={item?.user_photoURL || "https://i.ibb.co/mJR9Qxc/user.png"} alt={item?.userName} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-black text-base-content mb-1">
                          {item?.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-primary badge-sm font-bold uppercase tracking-tighter p-3">Verified Merchant</span>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-base-content/30 uppercase tracking-[0.2em]">Registered</p>
                        <p className="font-bold text-base-content/60">
                          {new Date(item?.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Luxury Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSelector(idx)}
                className={`transition-all duration-500 rounded-full ${
                  currentIndex === idx ? "w-12 bg-primary shadow-lg shadow-primary/40" : "w-3 bg-base-300 hover:bg-base-content/20"
                } h-3`}
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }` }} />
    </section>
  );
};

export default WhatCustomerSays;