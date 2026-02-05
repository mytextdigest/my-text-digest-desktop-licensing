import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDesktopAuth } from "@/lib/requireDesktopAuth";
import { isDesktopSubscriptionActive } from "@/lib/desktopSubscription";
import jwt from "jsonwebtoken";

const LICENSE_SECRET = process.env.LICENSE_TOKEN_SECRET;

export async function POST(req) {
  let auth;
  try {
    auth = requireDesktopAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { deviceFingerprint, deviceName, platform } = await req.json();

  if (!deviceFingerprint) {
    return NextResponse.json(
      { error: "deviceFingerprint is required" },
      { status: 400 }
    );
  }

  const subscription = await prisma.desktopSubscription.findUnique({
    where: { userId: auth.sub },
    include: { plan: true }
  });

  if (!isDesktopSubscriptionActive(subscription)) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 403 }
    );
  }

  // Enforce device limit (1 for now)
  const activeDevices = await prisma.device.count({
    where: {
      userId: auth.sub,
      revokedAt: null
    }
  });

  if (activeDevices >= subscription.plan.deviceLimit) {
    return NextResponse.json(
      { error: "Device limit exceeded" },
      { status: 403 }
    );
  }

  const device = await prisma.device.create({
    data: {
      userId: auth.sub,
      deviceHash: deviceFingerprint,
      deviceName,
      platform
    }
  });

  const licenseToken = jwt.sign(
    {
      sub: auth.sub,
      deviceId: device.id
    },
    LICENSE_SECRET,
    {
      expiresIn: "30d"
    }
  );

  return NextResponse.json({
    licenseToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
}
