import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaHeadset,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import useUserRole from "../../../hooks/useUserRole";
import useAuthValue from "../../../hooks/useAuthValue";

const faqData = [
  {
    id: 1,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    id: 2,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    id: 3,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    id: 4,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    id: 5,
    title: "Corporate Service / Contract Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    id: 6,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const FaqItem = ({ faq, isOpen, toggle }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
        isOpen
          ? "bg-base-200 border-primary shadow-xl ring-1 ring-primary/20"
          : "bg-base-100 border-base-content/5 hover:border-primary/40 hover:bg-base-200/50"
      }`}
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span
          className={`text-base md:text-lg font-black tracking-tight transition-colors ${isOpen ? "text-primary" : "text-base-content"}`}
        >
          {faq.title}
        </span>
        <div
          className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-primary text-white rotate-180" : "bg-base-content/5 text-base-content/30"}`}
        >
          {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
        </div>
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 text-sm md:text-base text-base-content/60 leading-relaxed font-medium max-w-2xl">
              {faq.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Faq = () => {
  const [openId, setOpenId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role } = useUserRole();
  const { user } = useAuthValue();

  return (
    <section className="section-spacing relative overflow-hidden bg-base-100">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 z-0" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT: HEADER */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <FaShieldAlt /> 100% Secure Logistics
            </motion.div>

            <motion.h2 className="text-5xl md:text-7xl font-black text-base-content leading-[0.9] tracking-tighter mb-8">
              Frequently <br />
              <span className="text-primary font-outline-2">
                Asked Questions
              </span>
            </motion.h2>

            <motion.p className="text-lg text-base-content/50 font-medium max-w-sm mb-10 leading-relaxed">
              Can't find what you're looking for? Our support team is available
              24/7.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-lg rounded-2xl px-10 gap-3 shadow-xl shadow-primary/20 border-none"
            >
              <FaHeadset /> Contact Support
            </motion.button>
          </div>

          {/* RIGHT: ACCORDION */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                toggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- SMART MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-base-100/60 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-base-200 border border-base-content/10 p-8 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)]"
            >
              {/* ✨ POLISHED CLOSE BUTTON (RIGHT SIDE) */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-base-100 border border-base-content/5 text-base-content/40 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all active:scale-95 shadow-sm"
              >
                <FaTimes size={18} />
              </button>

              <div className="mb-10 pr-8">
                <h3 className="text-4xl font-black mb-2 tracking-tight">
                  Hello,{" "}
                  <span className="text-primary">
                    {user?.displayName?.split(" ")[0] || "Friend"}!
                  </span>
                </h3>
                <p className="text-base-content/50 font-medium">
                  {role === "rider"
                    ? "Having trouble with a route?"
                    : "How can we assist your business today?"}
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+880123456789"
                  className="flex items-center gap-6 p-6 rounded-4xl bg-primary text-white hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="font-black text-xl">Instant Hotline</p>
                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">
                      Priority Support
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/880123456789"
                  className="flex items-center gap-6 p-6 rounded-4xl bg-base-100 border border-base-content/5 hover:border-success/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center text-2xl group-hover:bg-success group-hover:text-white transition-colors">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <p className="font-black text-xl text-base-content">
                      WhatsApp
                    </p>
                    <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">
                      Fast Chat
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@masakkali.com"
                  className="flex items-center gap-6 p-6 rounded-4xl bg-base-100 border border-base-content/5 hover:border-info/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-info/10 text-info flex items-center justify-center text-2xl group-hover:bg-info group-hover:text-white transition-colors">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="font-black text-xl text-base-content">
                      Email Us
                    </p>
                    <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">
                      Inquiries
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Faq;
