import { lazy, Suspense } from "react";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import ClientLogoMarquee from "../ClientLogoMarquee/ClientLogoMarquee";

// Lazy load below-the-fold content for 10x speed
const OurServices = lazy(() => import("../Services/OurServices"));
const Benefits = lazy(() => import("../Benefits/Benefits"));
const BeMerchant = lazy(() => import("../BeMerchant/BeMerchant"));
const WhatCustomerSays = lazy(
  () => import("../WhatCustomerSays/WhatCustomerSays"),
);
const Faq = lazy(() => import("../Faq/Faq"));

const Home = () => {
  return (
    <main>
      {/* 1. HERO - Instant Impact */}
      <Banner />

      {/* 2. TRUST - Move Marquee up to show credibility early */}
      <ClientLogoMarquee />

      {/* 3. PROCESS - Simple 1-2-3 guide */}
      <HowItWorks />

      <Suspense
        fallback={
          <div className="h-64 animate-pulse bg-base-200 m-10 rounded-3xl" />
        }
      >
        {/* 4. CAPABILITY - Detailed services */}
        <OurServices />

        {/* 5. VALUE PROPOSITION - Why we are better */}
        <Benefits />

        {/* 6. BUSINESS CONVERSION - The Merchant CTA */}
        <BeMerchant />

        {/* 7. SOCIAL PROOF - Testimonials */}
        <WhatCustomerSays />

        {/* 8. CLARITY - FAQs */}
        <Faq />
      </Suspense>
    </main>
  );
};

export default Home;
