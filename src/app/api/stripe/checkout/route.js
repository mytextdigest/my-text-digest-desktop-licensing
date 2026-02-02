import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await req.json();

  if (!planId) {
    return NextResponse.json(
      { error: "Missing planId" },
      { status: 400 }
    );
  }

  // ✅ Desktop plan (NOT SaaS plan)
  const plan = await prisma.desktopPlan.findUnique({
    where: { id: planId }
  });

  if (!plan || !plan.isActive) {
    return NextResponse.json(
      { error: "Invalid desktop plan" },
      { status: 400 }
    );
  }

  // ✅ Prevent duplicate desktop subscriptions
  const existing = await prisma.desktopSubscription.findUnique({
    where: { userId: session.user.id }
  });

  if (existing && ["active", "trialing"].includes(existing.status)) {
    return NextResponse.json(
      { error: "Desktop subscription already active" },
      { status: 400 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.user.email,

    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1
      }
    ],

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/cancel`,

    // 🔐 Critical for webhook correctness
    metadata: {
      userId: session.user.id,
      desktopPlanId: plan.id,
      product: "desktop"
    }
  });

  return NextResponse.json({ url: checkoutSession.url });
}
