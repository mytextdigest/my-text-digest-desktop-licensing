import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isDesktopSubscriptionActive
} from "@/lib/desktopSubscription";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(null);
  }

  const subscription = await prisma.desktopSubscription.findUnique({
    where: { userId: session.user.id },
    include: {
      plan: true
    }
  });

  if (!subscription) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    id: subscription.id,
    status: subscription.status,
    isActive: isDesktopSubscriptionActive(subscription),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    currentPeriodEnd: subscription.currentPeriodEnd,
    plan: {
      id: subscription.plan.id,
      name: subscription.plan.name,
      billingInterval: subscription.plan.billingInterval,
      deviceLimit: subscription.plan.deviceLimit,
      priceCents: subscription.plan.priceCents,
      currency: subscription.plan.currency
    }
  });
}
