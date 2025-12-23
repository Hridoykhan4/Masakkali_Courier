import { motion as Motion } from "framer-motion";

// Placeholder illustration images (replace later)
import benefit1 from "../../../assets/live-tracking.png";
import benefit2 from "../../../assets/safe-delivery.png";
import benefit3 from "../../../assets/tiny-deliveryman.png";

const benefitsData = [
  {
    id: 1,
    title: "100% Safe Delivery",
    description:
      "We ensure secure handling of every parcel with proper packaging, careful transportation, and verified delivery processes.",
    image: benefit1,
  },
  {
    id: 2,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with tracking, delivery updates, and issue resolution.",
    image: benefit2,
  },
  {
    id: 3,
    title: "Real-Time Tracking",
    description:
      "Track your parcels in real-time with full transparency from pickup to final delivery, ensuring peace of mind.",
    image: benefit3,
  },
];

const Benefits = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <Motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-base-content/70">
            We focus on reliability, transparency, and customer satisfaction to
            deliver the best courier experience.
          </p>
        </Motion.div>

        {/* Benefits Cards */}
        <div className="space-y-6">
          {benefitsData.map((benefit) => (
            <Motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card bg-base-100 shadow-sm hover:shadow-md transition"
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Left: Image */}
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full md:w-48 h-40 object-contain"
                  />

                  {/* Divider */}
                  <div className="hidden md:block w-px bg-base-300 h-24" />

                  {/* Right: Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-base-content/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
