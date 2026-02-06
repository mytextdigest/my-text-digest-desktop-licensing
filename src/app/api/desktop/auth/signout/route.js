import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { requireDesktopAuth } from "@/lib/requireDesktopAuth";

const LICENSE_SECRET = process.env.LICENSE_TOKEN_SECRET;

export async function POST(req) {
  let auth;
  try {
    auth = requireDesktopAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { licenseToken } = await req.json();

  if (!licenseToken) {
    return NextResponse.json(
      { error: "licenseToken is required" },
      { status: 400 }
    );
  }

  let payload;
  try {
    payload = jwt.verify(licenseToken, LICENSE_SECRET);
  } catch {
    return NextResponse.json(
      { error: "Invalid license token" },
      { status: 400 }
    );
  }

  const device = await prisma.device.findFirst({
    where: {
      id: payload.deviceId,
      userId: auth.sub
    }
  });

  // Device already signed out or does not exist → treat as success
  if (!device || device.revokedAt) {
    return NextResponse.json({ success: true });
  }

  // Mark device as logged out
  await prisma.device.update({
    where: { id: device.id },
    data: {
      revokedAt: new Date()
    }
  });

  return NextResponse.json({
    success: true
  });
}
