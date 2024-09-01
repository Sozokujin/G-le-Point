import { FirebaseUser } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest, user: FirebaseUser) {
  try {
    if (!user) {
      console.error("Unauthorized access attempt.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const priceId = data.priceId;

    console.log("Received request for priceId:", priceId);

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_BASE_URL}/billing`,
        cancel_url: `${process.env.NEXT_BASE_URL}/billing`,
        metadata: {
          userId: user.uid,
          priceId,
        },
      });

    console.log("Checkout session created successfully:", checkoutSession);

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
