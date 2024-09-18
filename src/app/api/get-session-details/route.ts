import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items.data.price.product']
        });

        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

        return NextResponse.json({
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
            line_items: lineItems.data.map((item) => ({
                description: item.description,
                price: item.price,
                quantity: item.quantity
            }))
        });
    } catch (error) {
        console.error('Error retrieving Stripe session:', error);
        return NextResponse.json({ error: 'Unable to retrieve session details' }, { status: 500 });
    }
}
