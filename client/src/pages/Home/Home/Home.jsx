import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import OurServices from "../Services/OurServices";
import ClientLogoMarquee from "../ClientLogoMarquee/ClientLogoMarquee";
import Benefits from "../Benefits/Benefits";
import BeMerchant from "../BeMerchant/BeMerchant";
import WhatCustomerSays from "../WhatCustomerSays/WhatCustomerSays";
import Faq from "../Faq/Faq";

const Home = () => {
  return (
    <main className="space-y-20">
      {" "}
      {/* Unified spacing for a clean look */}
      <section>
        <Banner />
      </section>
      <section className="container mx-auto">
        <HowItWorks />
      </section>
      <section className="bg-base-200 py-10">
        <OurServices />
      </section>
      <ClientLogoMarquee />
      <section className="container mx-auto">
        <Benefits />
      </section>
      <BeMerchant />
      <WhatCustomerSays />
      <Faq />
    </main>
  );
};

export default Home;
