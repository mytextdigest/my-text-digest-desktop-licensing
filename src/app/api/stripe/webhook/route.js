import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

//
// Handlers
//

async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId;
  const desktopPlanId = session.metadata?.desktopPlanId;

  if (!userId || !desktopPlanId || !session.subscription) {
    console.warn("Missing metadata in checkout.session.completed");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  await prisma.desktopSubscription.upsert({
    where: { userId },
    update: {
      planId: desktopPlanId,
      status: subscription.status,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null
    },
    create: {
      userId,
      planId: desktopPlanId,
      status: subscription.status,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null
    }
  });
}

async function handleSubscriptionUpdated(subscription) {
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return;

  const plan = await prisma.desktopPlan.findUnique({
    where: { stripePriceId: priceId }
  });
  if (!plan) return;

  const updateData = {
    planId: plan.id,
    status: subscription.status,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end)
  };

  if (typeof subscription.current_period_end === "number") {
    updateData.currentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
  }

  await prisma.desktopSubscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: updateData
  });
}

async function handleSubscriptionDeleted(subscription) {
  await prisma.desktopSubscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null
    }
  });
}
