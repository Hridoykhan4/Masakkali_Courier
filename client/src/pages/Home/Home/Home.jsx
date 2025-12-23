import Banner from "../Banner/Banner";
import BeMerchant from "../BeMerchant/BeMerchant";
import Benefits from "../Benefits/Benefits";
import ClientLogoMarquee from "../ClientLogoMarquee/ClientLogoMarquee";
import OurServices from "../Services/OurServices";

const Home = () => {
    return (
        <div>
        <Banner></Banner>   
        <OurServices></OurServices>         
        <ClientLogoMarquee></ClientLogoMarquee>
        <Benefits></Benefits>
        <BeMerchant></BeMerchant>
        </div>
    );
};

export default Home;