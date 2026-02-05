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

  // Revoke the device
  await prisma.device.updateMany({
    where: {
      id: payload.deviceId,
      userId: auth.sub,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });

  return NextResponse.json({
    success: true
  });
}
