import SubscribeClient from "@/components/subscribe/SubscribeClient";
import { prisma } from "@/lib/prisma";
// import SubscribeClient from "./SubscribeClient";

export default async function SubscribePage() {
  const plans = await prisma.desktopPlan.findMany({
    where: { isActive: true },
    orderBy: { billingInterval: "asc" } // month → year
  });

  console.log("Plans: ", plans)

  return <SubscribeClient plans={plans} />;
}
