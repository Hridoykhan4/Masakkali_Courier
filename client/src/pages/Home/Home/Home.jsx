import { lazy, Suspense } from "react";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import ClientLogoMarquee from "../ClientLogoMarquee/ClientLogoMarquee";

const OurServices = lazy(() => import("../Services/OurServices"));
const Benefits = lazy(() => import("../Benefits/Benefits"));
const BeMerchant = lazy(() => import("../BeMerchant/BeMerchant"));
const WhatCustomerSays = lazy(() => import("../WhatCustomerSays/WhatCustomerSays"));
const Faq = lazy(() => import("../Faq/Faq"));

const Home = () => {
  return (
    <main>
      <Banner />
      <ClientLogoMarquee />
      <HowItWorks />

      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 m-10 rounded-3xl" />}>
        <OurServices />
        <Benefits />
        <BeMerchant />
        <WhatCustomerSays />
        <Faq />
      </Suspense>
    </main>
  );
};

export default Home;