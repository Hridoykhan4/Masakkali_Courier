// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const faqData = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];


const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const Faq = () => {
  return (
    <section className="mb-16 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-base-content/70 text-sm sm:text-base">
          Everything you need to know about our delivery process, payments, and
          services across Bangladesh.
        </p>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto space-y-4"
      >
        {faqData.map((faq) => (
          <motion.div
            key={faq.id}
            variants={itemVariants}
            className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <input
              type="checkbox"
              defaultChecked={faq.id === 1}
            />
            <div className="collapse-title text-base sm:text-lg font-semibold">
              {faq.title}
            </div>
            <div className="collapse-content text-sm text-base-content/80 leading-relaxed">
              {faq.desc}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Faq;
