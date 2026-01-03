import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
  return (
    <section>
        <div>
            <h2 className="text-center my-5 font-semibold text-lg sm:text-2xl text-primary">Pay Now !!</h2>
        </div>
        <Elements stripe={stripePromise}>
            <CheckoutForm></CheckoutForm>
        </Elements>
    </section>
  )
};

export default Payment;
