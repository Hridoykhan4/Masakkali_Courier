import { useQuery } from "@tanstack/react-query";
import customerImg from "../../../assets/customer-top.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { motion as Motion, AnimatePresence } from "framer-motion";
import reviewQuote from "../../../assets/reviewQuote.png";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const WhatCustomerSays = () => {
  const axiosPublic = useAxiosPublic();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const {
    data: reviews = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/reviews");
      return data;
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
    const nextIndex = (currentIndex + 1) % reviews.length;
    scrollToSelector(nextIndex);
  };

  // Handle Auto-play
  useEffect(() => {
    if (!sliderRef.current || reviews.length === 0 || isHovering) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, isHovering, currentIndex]);



  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    scrollToSelector(prevIndex);
  };

  if (isError)
    return (
      <div className="py-20 text-center text-error font-medium">
        Failed to load reviews.
      </div>
    );
  if (isPending)
    return (
      <div className="py-20 text-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );

  return (
    <section className="bg-base-200/50 section-spacing overflow-hidden">
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            src={customerImg}
            alt="Customers"
            className="mb-4 w-32"
          />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Voice of Our Community
          </h2>
          <div className="h-1.5 w-20 bg-primary rounded-full mb-6"></div>
          <p className="max-w-2xl text-base-content/60 text-lg">
            Join thousands of satisfied merchants across Bangladesh who trust
            our logistics network every day.
          </p>
        </div>

        {/* Slider Container */}
        <div
          className="relative container-page"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 z-10">
            <button
              onClick={handlePrev}
              className="btn btn-circle btn-ghost bg-base-100 shadow-lg hover:bg-primary hover:text-white transition-all"
            >
              <FaChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 z-10">
            <button
              onClick={handleNext}
              className="btn btn-circle btn-ghost bg-base-100 shadow-lg hover:bg-primary hover:text-white transition-all"
            >
              <FaChevronRight size={20} />
            </button>
          </div>

          {/* Wrapper for hidden scrollbar */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((item) => (
              <div key={item._id} className="snap-center min-w-full px-2 py-4">
                <div className="bg-base-100 border border-base-300/50 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  {/* Decorative Quote Mark */}
                  <img
                    src={reviewQuote}
                    className="absolute top-8 right-10 w-16 opacity-5 group-hover:opacity-10 transition-opacity"
                    alt="Quote"
                  />

                  {/* Rating Info */}
                  <div className="flex gap-1 text-warning mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={18}
                        fill={i < (item.rating || 5) ? "currentColor" : "none"}
                        className="stroke-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic text-base-content/90 mb-10">
                    “{item?.review}”
                  </blockquote>

                  <div className="flex items-center gap-5 pt-8 border-t border-base-200">
                    <div className="avatar">
                      <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={item?.user_photoURL} alt={item?.userName} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-base-content">
                        {item?.userName}
                      </h4>
                      <p className="text-sm font-medium text-primary/70 italic">
                        Verified Merchant
                      </p>
                    </div>
                    <div className="ml-auto text-xs font-bold uppercase tracking-widest text-base-content/30">
                      {new Date(item?.date).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSelector(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-base-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </section>
  );
};

export default WhatCustomerSays;
