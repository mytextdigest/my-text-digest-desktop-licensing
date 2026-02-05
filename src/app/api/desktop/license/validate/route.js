import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const LICENSE_SECRET = process.env.LICENSE_TOKEN_SECRET;

export async function POST(req) {
  const { licenseToken } = await req.json();

  if (!licenseToken) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  try {
    const payload = jwt.verify(licenseToken, LICENSE_SECRET);

    const device = await prisma.device.findUnique({
      where: { id: payload.deviceId }
    });

    if (!device || device.revokedAt) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      expiresAt: new Date(payload.exp * 1000)
    });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
