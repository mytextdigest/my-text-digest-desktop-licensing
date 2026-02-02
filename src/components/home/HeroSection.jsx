"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft background blobs (aligned with globals.css) */}
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-primary-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-primary-200/40 rounded-full blur-3xl" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-muted-foreground">
            Privacy-first document intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight"
        >
          Your documents.
          <br />
          <span className="text-primary-600">
            Instantly summarized
          </span>
          <br />
          <span className="text-muted-foreground">
            &amp; searchable.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Transform PDFs, notes, and files into structured knowledge you can chat with —
          organized into projects, private by design, and built for deep work.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => router.push("/auth/signup")}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 text-primary-foreground px-8 py-6 text-base font-medium shadow-lg group"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-medium border-2"
          >
            See Demo
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          No credit card required · Start free with 1GB storage
        </motion.p>
      </div>

      {/* Decorative cards (static, safe) */}
      <div className="hidden lg:block absolute left-[6%] top-1/3">
        <div className="glass rounded-xl p-4 shadow-md w-48">
          <div className="w-full h-2 bg-primary-200 rounded mb-2" />
          <div className="w-3/4 h-2 bg-muted rounded mb-2" />
          <div className="w-5/6 h-2 bg-muted rounded" />
        </div>
      </div>

      <div className="hidden lg:block absolute right-[6%] top-1/2">
        <div className="glass rounded-xl p-4 shadow-md w-52">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary-500" />
            <div className="w-20 h-2 bg-muted rounded" />
          </div>
          <div className="w-full h-2 bg-muted rounded mb-2" />
          <div className="w-2/3 h-2 bg-muted rounded" />
        </div>
      </div>
    </section>
  );
}
