import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaRegCreditCard,
  FaArrowLeft,
} from "react-icons/fa";

import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import useTheme from "../../../../hooks/useTheme";

const CheckoutForm = () => {
  const queryClient = useQueryClient();
  const {theme} = useTheme()
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

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
          await queryClient.invalidateQueries(["parcels"]); 
        await queryClient.invalidateQueries(["parcel", id]);
          toast.success("Transaction Securely Completed");
          nav("/dashboard/myParcels");
        }
      }
    } catch (err) {
      setErrorMessage("Secure connection failed. Check your network.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const stripeFailed = !stripe && !isPending;

  if (isPending || isError || stripeFailed)
    return (
      <div className="container-page py-20 flex justify-center">
        <ErrorLoadingState
          error={
            stripeFailed
              ? { message: "Payment Engine Offline. Check connection." }
              : error
          }
          isError={isError || stripeFailed}
          isPending={isPending}
        />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-page py-6 lg:py-10"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row glass-card rounded-3xl overflow-hidden min-h-137.5"
      >
        {/* --- LEFT: LOGISTICS DATA (Dark in Dark, Navy in Light) --- */}
        <div className="lg:w-5/12 p-8 lg:p-12 bg-primary text-primary-content relative overflow-hidden">
          <FaBoxOpen className="absolute -bottom-10 -right-10 text-primary-content/5 text-[15rem] pointer-events-none" />

          <button
            type="button"
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all mb-8"
          >
            <FaArrowLeft /> Return
          </button>

          <div className="relative z-10 space-y-8">
            <div className="badge badge-outline border-primary-content/20 text-primary-content font-black italic p-3 gap-2 uppercase text-[10px]">
              <FaShieldAlt /> Encrypted
            </div>

            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                Consignment Type
              </p>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
                {parcel?.parcelType}
              </h2>
            </div>

            <div className="pt-6 border-t border-primary-content/10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">
                    Payable Amount
                  </p>
                  <p className="text-xs font-bold italic opacity-40 leading-none">
                    Net Total
                  </p>
                </div>
                <p className="text-5xl font-black italic tracking-tighter leading-none">
                  ৳{parcel?.cost}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: SECURE INPUT (Base Theme) --- */}
        <div className="lg:w-7/12 p-8 lg:p-12 bg-base-100 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-base-content">
              Secure Checkout <FaRegCreditCard className="text-primary" />
            </h3>
            <p className="text-xs font-bold opacity-50 uppercase tracking-tighter mt-1">
              Terminal ID: {id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">
                Card Details
              </label>
              <div className="p-5 rounded-2xl border-2 border-base-content/10 bg-base-200/50 focus-within:border-primary focus-within:bg-base-100 transition-all">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        // Uses CSS variable fallback via computed styles
                        color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                        fontFamily: "var(--font-urbanist)",
                        "::placeholder": { color: "#64748b" },
                      },
                      invalid: { color: "#ef4444" },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || processing}
              className={`btn-main w-full h-16 flex items-center justify-center`}
            >
              {processing ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Dispatch <FaCheckCircle />
                </span>
              )}
            </button>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="alert alert-error text-[11px] font-black uppercase tracking-tight py-3 rounded-xl"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center opacity-30 grayscale pt-4">
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                PCI-DSS Secure
              </span>
              <div className="flex gap-4">
                <div className="w-8 h-5 bg-base-content/20 rounded-sm" />{" "}
                {/* Mock Visa */}
                <div className="w-8 h-5 bg-base-content/20 rounded-sm" />{" "}
                {/* Mock MC */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
