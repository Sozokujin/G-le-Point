'use client';
import useUserStore from '@/stores/userStore';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../ui/button';

type props = {
    priceId: string;
    price: string;
    description: string;
};

const CheckoutStripe = ({ priceId, price, description }: props) => {
    const { currentUser } = useUserStore();

    const handleSubmit = async () => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
        if (!stripe || !currentUser) {
            return;
        }
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: priceId,
                    user: currentUser
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error: ${response.statusText}. Details: ${text}`);
            }

            const data = await response.json();

            await stripe.redirectToCheckout({
                sessionId: data.result.id
            });
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <button
            onClick={handleSubmit}
            className="relative overflow-hidden bg-gradient-to-r from-green-400 to-glp-green hover:from-green-500 hover:to-glp-green-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 w-full group"
        >
            <span className="relative z-10">{description}</span>
            <span className="absolute top-0 left-0 w-full h-full bg-white transform -translate-x-full group-hover:translate-x-full transition-transform duration-300 ease-in-out opacity-25 rotate-12" />
            {/* DO NOT REMOVE SPAN, SHINE EFFECT ON HOVER */}
        </button>
    );
};

export default CheckoutStripe;
