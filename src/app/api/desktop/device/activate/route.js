import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDesktopAuth } from "@/lib/requireDesktopAuth";
import { isDesktopSubscriptionActive } from "@/lib/desktopSubscription";
import jwt from "jsonwebtoken";

const LICENSE_SECRET = process.env.LICENSE_TOKEN_SECRET;
const LICENSE_TTL_DAYS = 30;

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

  /**
   * 1️⃣ Look up device by fingerprint
   */
  const existingDevice = await prisma.device.findUnique({
    where: { deviceHash: deviceFingerprint }
  });

  /**
   * 2️⃣ If device already exists
   */
  if (existingDevice) {
    // Belongs to another user → hard block
    if (existingDevice.userId !== auth.sub) {
      return NextResponse.json(
        { error: "This device is already registered to another account" },
        { status: 403 }
      );
    }

    // Device exists but is currently logged out → try to reactivate
    if (existingDevice.revokedAt) {
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

      // Reactivate device
      await prisma.device.update({
        where: { id: existingDevice.id },
        data: {
          revokedAt: null,
          deviceName,
          platform
        }
      });
    }

    // Issue license token (for active or reactivated device)
    const licenseToken = jwt.sign(
      {
        sub: auth.sub,
        deviceId: existingDevice.id
      },
      LICENSE_SECRET,
      { expiresIn: `${LICENSE_TTL_DAYS}d` }
    );

    return NextResponse.json({
      licenseToken,
      expiresAt: new Date(
        Date.now() + LICENSE_TTL_DAYS * 24 * 60 * 60 * 1000
      )
    });
  }

  /**
   * 3️⃣ New device → enforce concurrent device limit
   */
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

  /**
   * 4️⃣ Register new device
   */
  const device = await prisma.device.create({
    data: {
      userId: auth.sub,
      deviceHash: deviceFingerprint,
      deviceName,
      platform
    }
  });

  /**
   * 5️⃣ Issue license token
   */
  const licenseToken = jwt.sign(
    {
      sub: auth.sub,
      deviceId: device.id
    },
    LICENSE_SECRET,
    { expiresIn: `${LICENSE_TTL_DAYS}d` }
  );

  return NextResponse.json({
    licenseToken,
    expiresAt: new Date(
      Date.now() + LICENSE_TTL_DAYS * 24 * 60 * 60 * 1000
    )
  });
}
