// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const faqData = [
  {
    id: 1,
    title: "How long does delivery usually take?",
    desc: "Inside major cities like Dhaka, delivery typically takes 24–48 hours. Nationwide deliveries usually arrive within 48–72 hours depending on the destination.",
  },
  {
    id: 2,
    title: "Do you offer Cash on Delivery (COD)?",
    desc: "Yes, we provide 100% Cash on Delivery service across Bangladesh. Collected payments are securely transferred to merchants on a regular schedule.",
  },
  {
    id: 3,
    title: "How can I track my parcel?",
    desc: "Once your parcel is booked, you will receive a tracking ID. Use this ID on our website to get real-time updates on your shipment status.",
  },
  {
    id: 4,
    title: "What items are restricted for delivery?",
    desc: "Illegal goods, fragile items without proper packaging, flammable materials, and perishable food items are not allowed for delivery.",
  },
  {
    id: 5,
    title: "What happens if a delivery fails?",
    desc: "If a delivery attempt fails, we retry based on our policy. In case of repeated failure, the parcel is returned to the sender through our return service.",
  },
  {
    id: 6,
    title: "Do you provide corporate or bulk delivery services?",
    desc: "Yes, we offer customized logistics solutions for SMEs and corporate clients, including bulk shipments, warehouse support, and dedicated account management.",
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
              type="radio"
              name="faq-accordion"
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
