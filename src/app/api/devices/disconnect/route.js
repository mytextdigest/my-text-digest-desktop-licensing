import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { deviceId } = await req.json();

  if (!deviceId) {
    return NextResponse.json(
      { error: "deviceId is required" },
      { status: 400 }
    );
  }

  await prisma.device.updateMany({
    where: {
      id: deviceId,
      userId: session.user.id,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });

  return NextResponse.json({ success: true });
}
