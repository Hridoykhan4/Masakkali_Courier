import merchantImg from "../../../assets/location-merchant.png";
import beMerchantBg from "../../../assets/be-a-merchant-bg.png";
import {motion as Motion} from 'framer-motion'
const BeMerchant = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ease: "easeInOut", duration: 0.6 }}
      style={{
        background: `linear-gradient(rgba(51, 146, 157, 0.2), rgba(51, 146, 157, 0.1)), url(${beMerchantBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
      }}
      className="hero bg-base-200 py-10 bg-cover bg-no-repeat"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={merchantImg} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <Motion.h1
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut", duration: 0.6, delay: 0.3 }}
            className="sm:text-5xl text-2xl font-bold"
          >
            Merchant and Customer Satisfaction is Our First Priority
          </Motion.h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button className="btn  btn-primary rounded-full">
              Become a Merchant
            </button>
            <button className="btn dark:btn-primary btn-outline">
              Earn with Masakkali Courier
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default BeMerchant;
