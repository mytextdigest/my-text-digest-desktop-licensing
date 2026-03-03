"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Lock, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b1220] text-white">
      
      {/* Radial glow background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1220]/70 to-[#0b1220]" />
      </div>

      {/* Floating particles (subtle) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        {/* Headline */}
        {/* <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Ask Anything.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
            }}
          >
            From Your Documents.
          </span>
        </motion.h1> */}

        {/* Desktop Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <div
            className="
              inline-flex items-center gap-2
              px-5 py-2
              rounded-full
              bg-gradient-to-r from-primary-500/20 to-primary-600/20
              border border-primary-500/40
              text-primary-300
              text-sm font-semibold tracking-wide
              backdrop-blur-md
              shadow-[0_0_25px_rgba(59,130,246,0.25)]
            "
          >
            {/* <Download className="w-4 h-4" /> */}
            DESKTOP VERSION
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Your Knowledge.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
            }}
          >
            Structured by Project. Protected by Design.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Upload PDFs, docx or text — My Text Digest gives you
          precise, contextual answers instantly. Private by design.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: Zap, label: "AI-powered understanding" },
            { icon: FileText, label: "All document formats" },
            { icon: Lock, label: "100% private & offline-ready" },
          ].map((item) => (
            <div
              key={item.label}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-xl
                bg-white/5 backdrop-blur-md
                border border-white/10
                text-sm text-slate-300
                hover:border-primary-500/40
                transition
              "
            >
              <item.icon className="w-4 h-4 text-primary-400" />
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => router.push("/auth/signup")}
            className="
              bg-gradient-to-r
              from-primary-500
              to-primary-600
              hover:brightness-110
              text-white
              px-8 py-6
              shadow-[0_15px_50px_rgba(59,130,246,0.45)]
              hover:shadow-[0_20px_60px_rgba(59,130,246,0.65)]
              transition-all duration-300
              group
            "
          >
            <Download className="mr-2 w-4 h-4" />
            Sign Up For Desktop
          </Button>

          {/* <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="
              bg-transparent
              border border-white/30
              text-white
              hover:bg-white/10
              hover:border-white/50
              px-8 py-6
              transition-all duration-300
              group
            "
          >
            Watch Demo
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button> */}


        </motion.div>
      </div>
    </section>
  );
}