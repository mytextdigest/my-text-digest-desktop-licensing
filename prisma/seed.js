import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: "Desktop Monthly",
      description: "Use My Text Digest Desktop on one device (monthly billing)",
      deviceLimit: 1,
      priceCents: 999,
      currency: "USD",
      billingInterval: "month",
      stripePriceId: "price_desktop_monthly",
      isActive: true,
    },
    {
      name: "Desktop Yearly",
      description: "Use My Text Digest Desktop on one device (yearly billing)",
      deviceLimit: 1,
      priceCents: 9999, // informational only
      currency: "USD",
      billingInterval: "year",
      stripePriceId: "price_desktop_yearly",
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.desktopPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log("✅ Desktop Monthly & Yearly plans seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
