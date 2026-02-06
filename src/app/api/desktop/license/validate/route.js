import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isDesktopSubscriptionActive } from "@/lib/desktopSubscription";

const LICENSE_SECRET = process.env.LICENSE_TOKEN_SECRET;

export async function POST(req) {
  const { licenseToken } = await req.json();

  if (!licenseToken) {
    return NextResponse.json({
      valid: false,
      reason: "INVALID_LICENSE"
    }, { status: 400 });
  }

  let payload;
  try {
    payload = jwt.verify(licenseToken, LICENSE_SECRET);
  } catch {
    return NextResponse.json({
      valid: false,
      reason: "INVALID_LICENSE"
    });
  }

  const device = await prisma.device.findUnique({
    where: { id: payload.deviceId }
  });

  if (!device) {
    return NextResponse.json({
      valid: false,
      reason: "INVALID_LICENSE"
    });
  }

  // Device explicitly logged out (locally or from web dashboard)
  if (device.revokedAt) {
    return NextResponse.json({
      valid: false,
      reason: "LOGGED_OUT"
    });
  }

  // Extra safety: token-user mismatch
  if (device.userId !== payload.sub) {
    return NextResponse.json({
      valid: false,
      reason: "INVALID_LICENSE"
    });
  }

  const subscription = await prisma.desktopSubscription.findUnique({
    where: { userId: payload.sub },
    include: { plan: true }
  });

  if (!isDesktopSubscriptionActive(subscription)) {
    return NextResponse.json({
      valid: false,
      reason: "SUBSCRIPTION_INACTIVE"
    });
  }

  // ✅ License is valid
  return NextResponse.json({
    valid: true,
    expiresAt: new Date(payload.exp * 1000)
  });
}
