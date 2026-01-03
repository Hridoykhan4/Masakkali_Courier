import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const [errorMessage, setErrorMessage] = useState(null);
  const elements = useElements();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false)
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
    setProcessing(true)
    try {
      // eslint-disable-next-line no-unused-vars
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });
      if (paymentMethodError) {
        setErrorMessage(paymentMethodError.message);
        console.log("method Error", paymentMethodError);
        return;
      }

      //   Create Payment Intent
      const {data} = await axiosSecure.post("/create-payment-intent", {
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

        if(cardIntentError){
            setErrorMessage(cardIntentError?.message);
            return
        }
        if(paymentIntent?.status === 'succeeded'){
            const payment = {
                email: user?.email,
                name: user?.displayName,
                amount: parcel?.cost,
                transactionId: paymentIntent?.id,
                status: 'pending'
            }
        }

    } catch (err) {
      console.log(err);
    }
    finally{
        setProcessing(false)
    }
  };

  return (
    <form
      className="md:w-[60%] mx-auto border p-4 rounded-xl space-y-6"
      onSubmit={handleSubmit}
    >
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
        {processing ? 'paying' : 'Pay'} ${parcel?.cost} for parcel pickup
      </button>
      {errorMessage && (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
