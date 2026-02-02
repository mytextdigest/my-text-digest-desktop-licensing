import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  getUserDesktopSubscription,
  isDesktopSubscriptionActive
} from "@/lib/desktopSubscription";

export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 🔐 Must be logged in
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // 💳 Must have an active desktop subscription
  const subscription = await getUserDesktopSubscription(session.user.id);

  if (!isDesktopSubscriptionActive(subscription)) {
    redirect("/subscribe");
  }

  return <>{children}</>;
}
