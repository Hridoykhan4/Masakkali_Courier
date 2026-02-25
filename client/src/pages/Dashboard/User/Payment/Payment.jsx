import { useRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion as Motion, useInView } from "framer-motion";
import { FaShieldAlt, FaLock } from "react-icons/fa";
import { MdVerified, MdElectricBolt } from "react-icons/md";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const TRUST_BADGES = [
  { icon: <FaShieldAlt />, label: "PCI-DSS Certified" },
  { icon: <FaLock />, label: "256-bit Encryption" },
  { icon: <MdVerified />, label: "Stripe Secured" },
  { icon: <MdElectricBolt />, label: "Instant Settlement" },
];

const Payment = () => {
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  return (
    <section className="font-urbanist">
      {/* ── HEADER ── */}
      <div ref={headerRef} className="mb-10">
        <Motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2.5 mb-4"
        >
          <Motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary shrink-0"
          />
          <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
            Secure Checkout
          </span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]"
        >
          FINALIZE
          <br />
          <span
            style={{
              WebkitTextStroke: "2px var(--color-primary)",
              color: "transparent",
            }}
          >
            PAYMENT.
          </span>
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium mt-3 text-base-content"
        >
          Complete your transaction securely. Powered by Stripe.
        </Motion.p>
      </div>

      {/* ── CHECKOUT CARD ── */}
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-base-content/5 overflow-hidden shadow-2xl"
        style={{ background: "var(--color-base-100)" }}
      >
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>

        {/* ── FOOTER ── */}
        <div
          className="px-8 py-5 border-t border-base-content/5 flex flex-wrap justify-center items-center gap-x-8 gap-y-3"
          style={{ background: "var(--color-base-200)" }}
        >
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-25 hover:opacity-60 transition-opacity duration-200 cursor-default"
            >
              <span className="text-primary opacity-70">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </Motion.div>
    </section>
  );
};

export default Payment;
