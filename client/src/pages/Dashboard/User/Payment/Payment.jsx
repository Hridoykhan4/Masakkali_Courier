import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          <FaShieldAlt /> Secure Checkout
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-base-content">
          Finalize <span className="text-primary">Payment</span>
        </h2>
        <p className="text-sm opacity-50 font-medium">
          Complete your transaction securely via Stripe
        </p>
      </div>

      <div className="bg-base-100 rounded-[3rem] shadow-2xl border border-base-content/5 overflow-hidden">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>

        {/* Trust Footer */}
        <div className="bg-base-200/50 p-6 flex flex-wrap justify-center items-center gap-8 border-t border-base-content/5">
          <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe"
              className="h-5"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30 italic">
            <FaLock /> 256-bit AES Encryption
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
