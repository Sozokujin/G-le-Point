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
                const text = await response.text(); // Essayez de lire le texte en cas d'erreur
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
        <Button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            {description}
        </Button>
    );
};

export default CheckoutStripe;
