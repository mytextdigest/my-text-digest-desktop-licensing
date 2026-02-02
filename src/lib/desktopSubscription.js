import { prisma } from "@/lib/prisma";

/**
 * Fetch the user's desktop subscription with plan details
 */
export async function getUserDesktopSubscription(userId) {
  return prisma.desktopSubscription.findUnique({
    where: { userId },
    include: { plan: true }
  });
}

/**
 * Determines whether the desktop subscription allows usage
 */
export function isDesktopSubscriptionActive(subscription) {
  if (!subscription) return false;

  // Only these states allow access
  if (!["active", "trialing"].includes(subscription.status)) {
    return false;
  }

  // If cancellation is scheduled, allow access
  // until the billing period actually ends
  if (subscription.cancelAtPeriodEnd) {
    if (subscription.currentPeriodEnd) {
      return new Date(subscription.currentPeriodEnd) > new Date();
    }

    // If Stripe didn't give an end date, trust status
    return true;
  }

  return true;
}
