import {
  FaShippingFast,
  FaMoneyBillWave,
  FaWarehouse,
  FaBuilding,
} from "react-icons/fa";
import { motion as Motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time with easy booking.",
    icon: <FaShippingFast />,
  },
  {
    id: 2,
    title: "Cash On Delivery",
    description:
      "We collect payment securely from customers and ensure hassle-free cash settlement.",
    icon: <FaMoneyBillWave />,
  },
  {
    id: 3,
    title: "Delivery Hub",
    description:
      "Your parcels are sorted and processed at our delivery hubs for fast and accurate delivery.",
    icon: <FaWarehouse />,
  },
  {
    id: 4,
    title: "Booking SME & Corporate",
    description:
      "Custom logistics solutions designed for SMEs and corporate clients with dedicated support.",
    icon: <FaBuilding />,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-base-content/70">
            A simple and reliable process that keeps your deliveries fast,
            secure, and stress-free.
          </p>
        </Motion.div>

        {/* Steps */}
        <Motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <Motion.div
              key={step.id}
              variants={item}
              whileHover={{ y: -6 }}
              className="card bg-base-200 shadow-sm hover:shadow-md transition"
            >
              <div className="card-body text-center">
                {/* Icon */}
                <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-base-content/70">
                  {step.description}
                </p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
