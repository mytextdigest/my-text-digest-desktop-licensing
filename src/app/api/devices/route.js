import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const devices = await prisma.device.findMany({
    where: {
      userId: session.user.id,
      revokedAt: null
    },
    orderBy: { activatedAt: "desc" }
  });

  return NextResponse.json(devices);
}
