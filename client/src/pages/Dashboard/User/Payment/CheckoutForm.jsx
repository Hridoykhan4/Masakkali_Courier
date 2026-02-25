import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaShieldAlt,
  FaRegCreditCard,
  FaArrowLeft,
  FaTag,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { MdElectricBolt, MdVerified } from "react-icons/md";

import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useTheme from "../../../../hooks/useTheme";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

// ── STRIPE CARD ELEMENT STYLES 
const cardStyles = (isDark) => ({
  style: {
    base: {
      fontSize: "15px",
      color: isDark ? "#f1f5f9" : "#0f172a",
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: "600",
      letterSpacing: "0.02em",
      "::placeholder": { color: isDark ? "#475569" : "#94a3b8" },
    },
    invalid: { color: "#f87171", iconColor: "#f87171" },
  },
  hidePostalCode: true,
});

// ── PARCEL DETAIL ROW ──────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-primary-content/10 last:border-0">
    <div className="flex items-center gap-2.5 text-primary-content/50">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-xs font-black text-primary-content/80 max-w-35 truncate text-right">
      {value ?? "—"}
    </span>
  </div>
);

// ─────────────────────────────────────────────
// CHECKOUT FORM
// ─────────────────────────────────────────────
const CheckoutForm = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);

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
            card,
            billing_details: {
              email: user?.email ?? "anonymous",
              name: user?.displayName ?? "anonymous",
            },
          },
        });

      if (intentError) {
        setErrorMessage(intentError.message);
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
      setErrorMessage("Secure connection failed. Please check your network.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const stripeFailed = !stripe && !isPending;

  if (isPending || isError || stripeFailed)
    return (
      <div className="py-20 flex justify-center">
        <ErrorLoadingState
          error={stripeFailed ? { message: "Payment Engine Offline." } : error}
          isError={isError || stripeFailed}
          isPending={isPending}
        />
      </div>
    );

  return (
    <Motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:flex-row min-h-125"
    >
      {/* ══════════════════════════════════════════
          LEFT PANEL — Order summary 
      ══════════════════════════════════════════ */}
      <div className="relative lg:w-5/12 p-8 lg:p-10 bg-primary text-primary-content selection:bg-base-content selection:text-info overflow-hidden flex flex-col">
      
        <FaBoxOpen className="absolute -bottom-8 -right-8 text-[12rem] text-primary-content/4 pointer-events-none select-none" />

     
        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-content/20 to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => nav(-1)}
          className="self-start flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary-content/50 hover:text-primary-content transition-colors duration-200 mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </button>

        {/* Encrypted badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary-content/15 bg-primary-content/8 self-start mb-8">
          <MdVerified className="text-sm text-primary-content/60" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary-content/60">
            Encrypted Session
          </span>
        </div>

        {/* Parcel type */}
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-content/40 mb-1.5">
            Parcel Type
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.9] text-primary-content">
            {parcel?.parcelType ?? "—"}
          </h2>
        </div>

        {/* Details */}
        <div className="flex-1 mb-6">
          <DetailRow
            icon={<FaTag />}
            label="Parcel ID"
            value={id?.slice(-10).toUpperCase()}
          />
          <DetailRow
            icon={<FaUser />}
            label="Sender"
            value={parcel?.senderName ?? user?.displayName}
          />
          <DetailRow
            icon={<FaMapMarkerAlt />}
            label="Destination"
            value={parcel?.receiverAddress}
          />
        </div>

        {/* Amount */}
        <div className="pt-6 border-t border-primary-content/15">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-content/40">
                Total Payable
              </p>
              <p className="text-[9px] font-bold text-primary-content/30 mt-0.5">
                VAT Incl.
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black tracking-tighter leading-none text-primary-content">
                ৳{parcel?.cost}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Card input
      ══════════════════════════════════════════ */}
      <div
        className="lg:w-7/12 p-8 lg:p-10 flex flex-col justify-center"
        style={{ background: "var(--color-base-100)" }}
      >
        {/* Section title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <FaRegCreditCard className="text-sm" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Card Details</h3>
          </div>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest ml-12">
            Terminal · {id?.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Card element wrapper */}
        <div className="space-y-2 mb-6">
          <label className="text-[9px] font-black uppercase tracking-widest opacity-35 ml-1 block">
            Credit / Debit Card
          </label>
          <div
            className="p-4 rounded-2xl border-2 transition-all duration-250"
            style={{
              borderColor: cardFocused
                ? "var(--color-primary)"
                : "color-mix(in srgb, var(--color-base-content) 10%, transparent)",
              background: cardFocused
                ? "var(--color-base-100)"
                : "var(--color-base-200)",
              boxShadow: cardFocused
                ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 12%, transparent)"
                : "none",
            }}
          >
            <CardElement
              options={cardStyles(isDark)}
              onFocus={() => setCardFocused(true)}
              onBlur={() => setCardFocused(false)}
            />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {errorMessage && (
              <Motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-error/20 bg-error/8 text-error text-[11px] font-bold"
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                {errorMessage}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amount recap */}
        <div
          className="flex items-center justify-between px-4 py-3.5 rounded-2xl mb-6 border border-base-content/5"
          style={{ background: "var(--color-base-200)" }}
        >
          <span className="text-xs font-black uppercase tracking-widest opacity-40">
            Charge Total
          </span>
          <span className="text-lg font-black text-primary">
            ৳ {parcel?.cost}
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!stripe || processing}
          className="relative w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-250 hover:scale-[1.02] hover:shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          style={{
            background: "var(--color-primary)",
            color: "#020617",
            boxShadow:
              "0 8px 30px color-mix(in srgb, var(--color-primary) 35%, transparent)",
          }}
        >
          {/* Shimmer on idle */}
          {!processing && (
            <Motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1.5,
              }}
            />
          )}

          {processing ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>
              <FaShieldAlt />
              <span>Authorize Payment</span>
              <FaCheckCircle className="text-xs opacity-70" />
            </>
          )}
        </button>

        {/* Bottom trust note */}
        <p className="text-center text-[9px] font-black uppercase tracking-widest opacity-20 mt-5 flex items-center justify-center gap-1.5">
          <MdElectricBolt />
          Secured by Stripe · PCI-DSS Level 1
        </p>
      </div>
    </Motion.form>
  );
};

export default CheckoutForm;
