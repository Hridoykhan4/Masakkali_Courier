import { useQuery } from "@tanstack/react-query";
import customerImg from "../../../assets/customer-top.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { motion as Motion } from "framer-motion";
import reviewQuote from "../../../assets/reviewQuote.png";
import { useEffect, useRef, useState } from "react";

const WhatCustomerSays = () => {
  const axiosPublic = useAxiosPublic();
  const sliderRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const {
    data: reviews = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/reviews");
      return data;
    },
  });

  useEffect(() => {
    if (!sliderRef.current || reviews.length === 0 || isHovering) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % reviews.length;
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * index,
        behavior: "smooth",
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [reviews, isHovering]);

  if (isError)
    return <p className="text-red-600 text-center">{error?.message}</p>;
  if (isPending) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="bg-base-200 py-20">
      {/* Header */}
      <div className="flex max-w-4xl mx-auto px-4 text-center items-center gap-3 flex-col mb-16">
        <img src={customerImg} alt="Customers" />
        <h2 className="text-3xl sm:text-4xl font-bold">
          What Our Customers Say
        </h2>
        <p className="text-base-content/70">
          Trusted by merchants and customers across Bangladesh.
        </p>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {reviews.map((item) => (
          <Motion.div
            key={item._id}
            className="snap-center min-w-full px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-xl  mx-auto bg-base-100 p-8 rounded-3xl shadow-xl transition hover:shadow-2xl">
              <img src={reviewQuote} className="mb-5 opacity-70" alt="Quote" />

              <p className="text-lg leading-relaxed text-base-content/80 mb-8">
                “{item?.review}”
              </p>

              <div className="flex items-center gap-4 border-t border-dashed pt-4">
                <img  
                  src={item?.user_photoURL}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                  alt={item?.userName}
                />
                <div>
                  <h4 className="font-semibold leading-tight">
                    {item?.userName}
                  </h4>
                  <p className="text-sm text-base-content/60">
                    {new Date(item?.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatCustomerSays;
