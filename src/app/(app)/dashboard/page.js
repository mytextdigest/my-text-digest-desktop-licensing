"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  Monitor,
  Laptop,
  Cpu,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const [subscription, setSubscription] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loadingLicense, setLoadingLicense] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(true);

  const loadSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      setSubscription(data);
    } catch {
      setSubscription(null);
    } finally {
      setLoadingLicense(false);
    }
  };

  const loadDevices = async () => {
    try {
      const res = await fetch("/api/devices");
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch {
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    loadSubscription();
    loadDevices();
  }, []);

  const disconnectDevice = async (deviceId) => {
    await fetch("/api/devices/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId })
    });

    loadDevices();
  };

  const platformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "windows":
        return <Monitor className="h-5 w-5" />;
      case "macos":
        return <Laptop className="h-5 w-5" />;
      case "linux":
        return <Cpu className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            My Text Digest Desktop
          </h1>
          <p className="text-gray-600">
            Manage your desktop license and devices
          </p>
        </div>

        {/* License Status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">License Status</h2>

          {loadingLicense ? (
            <p className="text-gray-500">Loading license…</p>
          ) : subscription?.isActive ? (
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600">Active</span>
              </p>

              <p>
                <strong>Plan:</strong> {subscription.plan.name}
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

          <div className="pt-4">
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

        {/* Active Devices */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Active Devices</h2>

          {loadingDevices ? (
            <p className="text-gray-500">Loading devices…</p>
          ) : devices.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No active devices connected
            </p>
          ) : (
            <ul className="space-y-3">
              {devices.map((device) => (
                <li
                  key={device.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    {platformIcon(device.platform)}
                    <div>
                      <p className="font-medium">
                        {device.deviceName || "Unknown device"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {device.platform} · Activated{" "}
                        {new Date(
                          device.activatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => disconnectDevice(device.id)}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign out
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Desktop Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Download Desktop App
          </h2>

          <p className="text-gray-600">
            Download My Text Digest Desktop for your platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button asChild>
              <a
                href={process.env.NEXT_PUBLIC_DESKTOP_WIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Windows
              </a>
            </Button>

            <Button asChild>
              <a
                href={process.env.NEXT_PUBLIC_DESKTOP_MAC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                macOS
              </a>
            </Button>

            <Button asChild>
              <a
                href={process.env.NEXT_PUBLIC_DESKTOP_LINUX_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Linux (.deb)
              </a>
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Linux package is provided as a <code>.deb</code> file
            (Debian / Ubuntu).
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
