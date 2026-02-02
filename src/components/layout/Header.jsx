import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Settings, X, Key, CheckCircle2, XCircle, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import LogoutButton from '../ui/LogoutButton';
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
// import { applyTheme, getStoredTheme, setStoredTheme } from "@/lib/theme";



const Header = ({
  onSearch,
  searchValue,
  onSearchChange,
  className
}) => {
  const router = useRouter();
  const [theme, setTheme] = useState("system");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'apikey'
  const [status, setStatus] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const { data: session } = useSession();


  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //   const stored = getStoredTheme();
  //   setTheme(stored);
  // }, []);

  useEffect(() => {
    if (activeTab === "general") {
      fetch("/api/subscription")
        .then(res => res.json())
        .then(data => setSubscription(data))
        .catch(() => setSubscription(null))
        .finally(() => setLoadingSubscription(false));
    }
  }, [activeTab]);

  const loadApiKey = async () => {
    console.log("Loading api key ...")
    // if (typeof window !== 'undefined' && window.api) {
    const res = await fetch("/api/settings/get-openai-key");
    const data = await res.json();

    if (data.key) {
      setCurrentApiKey(data.key);
      setApiKey(data.key);
    }

    console.log("Loaded api key succesfully")
    // }
  };




  

 
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md",
        "dark:border-gray-800 dark:bg-gray-900/80",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Text Digest
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Document Management System
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center space-x-2">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="hidden sm:flex text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setSettingsOpen(false)}
            />

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 right-4 z-50 w-full max-w-md"
            >
              <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Settings</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSettingsOpen(false)}
                    className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-900 dark:text-white" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tabs */}
                  <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
                    <button
                      onClick={() => {
                        setActiveTab('general');
                        setStatus(null);
                        setVerified(false);
                      }}
                      className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'general'
                          ? "border-primary-600 text-primary-600 dark:text-primary-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      General
                    </button>
                  </div>

                  {/* General Tab */}
                  {activeTab === 'general' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Theme Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Follows your system preference
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Auto</span>
                        </div>
                      
                      </div>

                      {/* Subscription */}
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Subscription
                          </p>

                          {loadingSubscription ? (
                            <p className="text-sm text-gray-500">
                              Loading subscription…
                            </p>
                          ) : subscription?.plan ? (
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>{subscription.plan.name}</strong>
                              </p>

                              <p className="text-sm text-gray-600">
                                ${(subscription.plan.priceCents / 100).toFixed(2)} /{" "}
                                {subscription.plan.billingInterval}
                              </p>

                              <p className="text-sm text-gray-600">
                                Devices allowed: {subscription.plan.deviceLimit}
                              </p>

                              {subscription.cancelAtPeriodEnd &&
                                subscription.currentPeriodEnd && (
                                  <p className="text-xs text-orange-600">
                                    Cancels on{" "}
                                    {new Date(
                                      subscription.currentPeriodEnd
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No active subscription
                            </p>
                          )}

                        </div>

                        <button
                          onClick={async () => {
                            const res = await fetch("/api/stripe/portal", { method: "POST" });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Manage subscription
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 dark:border-gray-700" />

                      {session?.user?.email && (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Signed in as
                              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {session.user.email}
                              </div>
                            </div>

                            <button
                              onClick={() => router.push("/settings/change-password")}
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Change password
                            </button>
                          </div>
                        )}

                      {/* Logout */}
                      <LogoutButton />
                    </motion.div>
                  )}


                  {/* API Key Tab */}
                  
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
