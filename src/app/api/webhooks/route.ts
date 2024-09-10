import { incrementSuperMarkersByUid } from '@/services/firebase/stripe';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

type METADATA = {
    userId: string;
    priceId: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
    const sig = headers().get('stripe-signature') as string;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        return new Response(`Webhook Error: ${err}`, {
            status: 400
        });
    }
    const eventType = event.type;

    if (eventType == 'payment_intent.payment_failed') {
        return new Response('Payment failed', {
            status: 400
        });
    }

    const eventTypeArray: string[] = ['payment_intent.created', 'payment_intent.succeeded', 'charge.succeeded', 'charge.updated'];

    if (eventTypeArray.includes(eventType)) {
        return new Response('Event OK', {
            status: 200
        });
    }

    if (eventType === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== 'paid') {
            return new Response('Payment error', {
                status: 400
            });
        }
        const data = event.data.object;
        const metadata = data.metadata as METADATA;
        const userId = metadata.userId;
        const priceId = metadata.priceId;
        const created = data.created;
        const currency = data.currency;
        const customerDetails = data.customer_details!;
        const amount = data.amount_total;
        const transactionDetails = {
            userId,
            priceId,
            created,
            currency,
            customerDetails,
            amount
        };
        const numberPoints = priceId === 'price_1PuAYAP4rVLS4DImVQ2x3c25' ? 1 : 5;
        try {
            await incrementSuperMarkersByUid(userId, numberPoints);
            return new Response('Payment OK and superMarkers incremented', {
                status: 200
            });
        } catch (error) {
            return new Response('Server error', {
                status: 500
            });
        }
    } else {
        return new Response('Event not handled', {
            status: 400
        });
    }
}
