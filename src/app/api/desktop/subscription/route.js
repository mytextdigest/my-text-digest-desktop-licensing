import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDesktopAuth } from "@/lib/requireDesktopAuth";
import { isDesktopSubscriptionActive } from "@/lib/desktopSubscription";

export async function GET(req) {
  let auth;
  try {
    auth = requireDesktopAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.desktopSubscription.findUnique({
    where: { userId: auth.sub },
    include: { plan: true }
  });

  if (!subscription) {
    return NextResponse.json({
      isActive: false,
      plan: null
    });
  }

  return NextResponse.json({
    isActive: isDesktopSubscriptionActive(subscription),
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    currentPeriodEnd: subscription.currentPeriodEnd,
    plan: {
      name: subscription.plan.name,
      billingInterval: subscription.plan.billingInterval,
      deviceLimit: subscription.plan.deviceLimit,
      priceCents: subscription.plan.priceCents,
      currency: subscription.plan.currency
    }
  });
}
