import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const priceId = data.priceId;
        const user = data.user;

        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/checkout?session_id={CHECKOUT_SESSION_ID}&status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/map`,
            metadata: {
                userId: user.uid,
                priceId
            }
        });

        return NextResponse.json({ result: checkoutSession, ok: true });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
