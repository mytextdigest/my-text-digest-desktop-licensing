import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdminRequest(req) {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_API_SECRET;
}

export async function GET(req) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();

    const totalSubscriptions = await prisma.desktopSubscription.count();

    const activeSubscriptions = await prisma.desktopSubscription.count({
      where: { status: "active" },
    });

    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const planStats = await prisma.desktopSubscription.groupBy({
      by: ["planId"],
      _count: true,
    });

    return NextResponse.json({
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      recentUsers,
      planStats,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}