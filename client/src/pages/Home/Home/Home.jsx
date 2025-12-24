import Banner from "../Banner/Banner";
import BeMerchant from "../BeMerchant/BeMerchant";
import Benefits from "../Benefits/Benefits";
import ClientLogoMarquee from "../ClientLogoMarquee/ClientLogoMarquee";
import Faq from "../Faq/Faq";
import HowItWorks from "../HowItWorks/HowItWorks";
import OurServices from "../Services/OurServices";
import WhatCustomerSays from "../WhatCustomerSays/WhatCustomerSays";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <ClientLogoMarquee></ClientLogoMarquee>
      <Benefits></Benefits>
      <BeMerchant></BeMerchant>
      <WhatCustomerSays></WhatCustomerSays>
      <Faq></Faq>
    </div>
  );
};

export default Home;
