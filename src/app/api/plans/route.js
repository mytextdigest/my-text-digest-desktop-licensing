import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const plans = await prisma.desktopPlan.findMany({
    where: { isActive: true },
    orderBy: { deviceLimit: "asc" }
  });

  return NextResponse.json(plans);
}
