import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

if (!appUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

type CreateCheckoutPayload = {
  priceId?: string;
  userId?: string;
  email?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, email }: CreateCheckoutPayload = await request.json();

    if (!priceId || !userId || !email) {
      return NextResponse.json(
        { error: "priceId, userId, and email are required." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          supabase_user_id: userId,
        },
      },
      customer_email: email,
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata: {
        supabase_user_id: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";
    const status =
      error instanceof Stripe.errors.StripeError && error.statusCode
        ? error.statusCode
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}


