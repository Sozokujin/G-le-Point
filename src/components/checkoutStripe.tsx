"use client";
import useUserStore from "@/stores/userStore";
import { loadStripe } from "@stripe/stripe-js";

type props = {
  priceId: string;
  price: string;
  description: string;
};

const CheckoutStripe = ({ priceId, price, description }: props) => {
  const user = useUserStore((state) => state.user);

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

      console.log("Response:", response);

      if (!response.ok) {
        const text = await response.text(); // Essayez de lire le texte en cas d'erreur
        throw new Error(`Error: ${response.statusText}. Details: ${text}`);
      }

      console.log("Response:", response);

      const data = await response.json();

      console.log(data);

      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      Click Below button to get {description}
      <button onClick={handleSubmit}>Upgrade in {price}</button>
    </div>
  );
};

export default CheckoutStripe;
