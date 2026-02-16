import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCreditCard,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState("light");

  // Fix for Dark Mode Visibility: Detect current theme color
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme || "light");
  }, []);

  const {
    data: parcel,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setErrorMessage(null);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        cost: parcel?.cost,
      });

      const { error: intentError, paymentIntent } =
        await stripe.confirmCardPayment(data?.clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        });

      if (intentError) {
        setErrorMessage(intentError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const paymentData = {
          name: user?.displayName,
          email: user?.email,
          amount: parcel?.cost,
          transactionId: paymentIntent.id,
          parcelId: id,
          paymentMethod: paymentIntent.payment_method_types,
        };

        const { data: res } = await axiosSecure.post("/payments", paymentData);

        if (res?.insertedId) {
          toast.success("Transaction Securely Completed");
          nav("/dashboard/myParcels");
        }
      }
    } catch (err) {
      setErrorMessage("Secure connection failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isPending || isError)
    return (
      <div className="p-20">
        <ErrorLoadingState
          error={error}
          isError={isError}
          isPending={isPending}
        />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row min-h-[500px]"
    >
      {/* --- Order Summary (Glassmorphism Left) --- */}
      <div className="lg:w-5/12 p-8 md:p-12 bg-primary/[0.03] border-b lg:border-b-0 lg:border-r border-base-content/5">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
          <FaShieldAlt /> Checkout Summary
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-base-100 shadow-xl flex items-center justify-center text-primary shrink-0 border border-primary/10">
              <FaBoxOpen size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase italic tracking-tight">
                {parcel?.title}
              </p>
              <p className="text-[10px] font-mono font-bold opacity-40 mt-1">
                {parcel?.trackingId}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-dashed border-base-content/10">
            <div className="flex justify-between text-xs font-bold italic">
              <span className="opacity-40 uppercase tracking-tighter">
                Logistics Route
              </span>
              <span>
                {parcel?.senderRegion}{" "}
                <FaMapMarkerAlt className="inline text-primary mx-1" />{" "}
                {parcel?.receiverRegion}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold italic">
              <span className="opacity-40 uppercase tracking-tighter">
                Tax & Processing
              </span>
              <span>৳0.00</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-xs font-black uppercase opacity-40">
                Grand Total
              </span>
              <span className="text-4xl font-black italic tracking-tighter text-primary leading-none">
                ৳{parcel?.cost}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Secure Payment Input (Right) --- */}
      <div className="lg:w-7/12 p-8 md:p-12 bg-base-100 flex flex-col justify-center">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-2">
          Secure Credit Card Entry <FaLock />
        </h3>

        <div className="space-y-10">
          <div className="group">
            <div
              className={`p-5 rounded-2xl border-2 transition-all shadow-inner ${
                errorMessage
                  ? "border-error/30 bg-error/5"
                  : "border-base-content/10 bg-base-200/50 focus-within:border-primary focus-within:bg-base-100"
              }`}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      // DYNAMIC COLOR: White in dark mode, Dark Grey in light mode
                      color:
                        theme === "dark" ||
                        theme === "night" ||
                        theme === "luxury"
                          ? "#ffffff"
                          : "#1a1a1a",
                      fontFamily: '"Inter", sans-serif',
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#ef4444" },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={!stripe || processing}
              className="btn btn-primary w-full h-16 rounded-2xl text-lg font-black italic uppercase tracking-widest shadow-2xl shadow-primary/30 group relative overflow-hidden"
            >
              {processing ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span className="flex items-center gap-2">
                  Confirm Payment <FaCheckCircle />
                </span>
              )}
            </button>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[11px] font-bold text-error bg-error/10 p-4 rounded-xl border border-error/20"
                >
                  ⚠️ {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-[9px] font-bold opacity-30 uppercase tracking-widest px-10 leading-relaxed">
            Authorized by Masakkali Logistics. All data is encrypted using
            256-bit SSL protocols.
          </p>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
