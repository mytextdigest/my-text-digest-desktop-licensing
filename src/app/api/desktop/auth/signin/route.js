import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signDesktopToken } from "@/lib/desktopAuth";
import { isDesktopSubscriptionActive } from "@/lib/desktopSubscription";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      desktopSubscription: {
        include: { plan: true }
      }
    }
  });

  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signDesktopToken(user);

  return NextResponse.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email
    },
    subscription: {
      isActive: isDesktopSubscriptionActive(user.desktopSubscription),
      plan: user.desktopSubscription?.plan
        ? {
            name: user.desktopSubscription.plan.name,
            billingInterval: user.desktopSubscription.plan.billingInterval,
            deviceLimit: user.desktopSubscription.plan.deviceLimit
          }
        : null
    }
  });
}
