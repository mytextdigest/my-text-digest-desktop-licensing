"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            My Text Digest Desktop
          </h1>
          <p className="text-gray-600">
            Manage your desktop license
          </p>
        </div>

        {/* License Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">License Status</h2>

          {loading ? (
            <p className="text-gray-500">Loading license…</p>
          ) : subscription?.isActive ? (
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600">Active</span>
              </p>

              <p>
                <strong>Plan:</strong>{" "}
                {subscription.plan.name}
              </p>

              <p>
                <strong>Billing:</strong>{" "}
                ${(subscription.plan.priceCents / 100).toFixed(2)} /{" "}
                {subscription.plan.billingInterval}
              </p>

              <p>
                <strong>Devices allowed:</strong>{" "}
                {subscription.plan.deviceLimit}
              </p>

              {subscription.cancelAtPeriodEnd &&
                subscription.currentPeriodEnd && (
                  <p className="text-sm text-orange-600">
                    Cancels on{" "}
                    {new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                )}
            </div>
          ) : (
            <p className="text-red-600">
              No active license found
            </p>
          )}

          <div className="pt-4 flex gap-3">
            <Button
              onClick={async () => {
                const res = await fetch("/api/stripe/portal", {
                  method: "POST"
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
            >
              Manage Subscription
            </Button>
          </div>
        </motion.div>

        {/* Desktop App CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Desktop App
          </h2>

          <p className="text-gray-600">
            Download and activate My Text Digest Desktop
            using your license.
          </p>

          <div className="flex gap-3">
            <Button variant="default">
              Download Desktop App
            </Button>

            <Button variant="outline" disabled>
              Activate on this device
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Device activation coming next.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
