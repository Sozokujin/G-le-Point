"use client";
import useUserStore from "@/stores/userStore";
import { loadStripe } from "@stripe/stripe-js";

type props = {
  priceId: string;
  price: string;
  description: string;
};

const CheckoutStripe = ({ priceId, price, description }: props) => {
  const user = useUserStore((state) => state.currentUser);

  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    );
    if (!stripe || !user) {
      return;
    }
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          user: user,
        }),
      });

      if (!response.ok) {
        const text = await response.text(); // Essayez de lire le texte en cas d'erreur
        throw new Error(`Error: ${response.statusText}. Details: ${text}`);
      }

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="text-primary ring-1 ring-inset hover:bg-glp-green-800 hover:text-white ring-current duration-300 mb-6 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <button onClick={handleSubmit}>{description}</button>
    </div>
  );
};

export default CheckoutStripe;
