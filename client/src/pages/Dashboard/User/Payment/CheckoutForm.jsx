import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const [errorMessage, setErrorMessage] = useState(null);
  const elements = useElements();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);
  const nav = useNavigate();
  const {
    data: parcel = {},
    isPending,
    error,
    isError,
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
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return null;
    setErrorMessage(null);
    setProcessing(true);
    try {
   
      //   Create Payment Intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        cost: parcel?.cost,
      });

      const { error: cardIntentError, paymentIntent } =
        await stripe.confirmCardPayment(data?.clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        });

      if (cardIntentError) {
        setErrorMessage(cardIntentError?.message);
        return;
      }

      console.log(paymentIntent);

      if (paymentIntent?.status === "succeeded") {
        const payment = {
          name: user?.displayName,
          email: user?.email,
          amount: parcel?.cost,
          transactionId: paymentIntent?.id,
          parcelId: id,
          paymentMethod: paymentIntent.payment_method_types,
        };

        const { data } = await axiosSecure.post("/payments", payment);
        console.log(data);
        if (data?.insertedId) {
          toast.success(data?.message || "Payment Success", {
            position: "top-right",
            autoClose: 1500,
          });
          nav("/dashboard/myParcels");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setProcessing(false);
    }
  };

  if (!parcel?._id) {
    return (
      <p className="text-center text-red-500">
        Parcel not found or already paid.
      </p>
    );
  }


  return (
    <form
      className="md:w-[60%] mx-auto border p-4 rounded-xl space-y-6"
      onSubmit={handleSubmit}
    >
    <div className="bg-base-100 text-base-content shadow-md p-3 rounded text-sm">
        <p>
          Parcel Cost: <strong>${parcel?.cost}</strong>
        </p>
        <p>Payment Method: Card</p>
      </div>

      <ErrorLoadingState
        error={error}
        isError={isError}
        isPending={isPending}
      ></ErrorLoadingState>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />

      <button
        type="submit"
        className="btn rounded-md  btn-primary text-neutral disabled:bg-gray-700 disabled:cursor-not-allowed"
        disabled={!stripe || !elements || !parcel?.cost || processing}
      >
        {processing ? "Processing Payment..." : `Pay $${parcel?.cost}`}
      </button>
      {errorMessage && (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
