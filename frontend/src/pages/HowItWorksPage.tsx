import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import {
  Scale,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  History,
  ArrowRight,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HowItWorksPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()

  const steps = [
    {
      number: "01",
      title: "Identify",
      icon: Search,
      badge: "Step 01",
      description:
        "An organization or official begins by identifying the commodity, instrument, package, or statutory compliance requirement that needs to be checked.",
    },
    {
      number: "02",
      title: "Assess",
      icon: CheckCircle2,
      badge: "Step 02",
      description:
        "The platform evaluates the relevant compliance information, declarations, measurements, labels, documentation, and applicable statutory requirements.",
    },
    {
      number: "03",
      title: "Detect",
      icon: AlertCircle,
      badge: "Step 03",
      description:
        "Potential non-compliance, missing information, label inconsistencies, and risk patterns are accurately identified and brought forward for scrutiny.",
    },
    {
      number: "04",
      title: "Review",
      icon: ShieldCheck,
      badge: "Step 04",
      description:
        "Officials can review the verified findings and supporting evidence in detail before taking an enforcement or corrective action.",
    },
    {
      number: "05",
      title: "Record",
      icon: FileCheck,
      badge: "Step 05",
      description:
        "The outcome, evidence, observations, and enforcement action can be recorded digitally to maintain complete procedural traceability.",
    },
    {
      number: "06",
      title: "Track",
      icon: History,
      badge: "Step 06",
      description:
        "Compliance status and previous actions can be tracked over time, creating a clear history and audit trail for future review.",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-[#0b1623] text-white flex flex-col justify-between">
      <div
        className="relative flex-1 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11,22,35,0.92) 0%, rgba(11,22,35,0.85) 50%, rgba(11,22,35,0.92) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        {/* Ambient background accents identical to the landing page */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.15),transparent_35%)]" />

        {/* Existing-style Top Navigation Header */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/login" className="flex items-center gap-3 group transition">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition group-hover:scale-105">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Legal Metrology</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200/80">
                Department of Consumer Affairs • India
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-100/90 md:flex">
            <Link
              to="/how-it-works"
              className="text-white font-bold border-b border-sky-400 pb-0.5"
            >
              How it works
            </Link>
            <Link to="/faq" className="transition hover:text-white">
              FAQ
            </Link>
            <Link to="/for-officials" className="transition hover:text-white">
              For Officials
            </Link>
            <Link to="/for-organizations" className="transition hover:text-white">
              For Organizations
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.18)] transition hover:-translate-y-px"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto pt-4 pb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-sky-300" />
              Compliance Workflow
            </div>

            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              How It Works
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200/90">
              From compliance assessment to traceable enforcement, understand how the platform turns legal
              metrology requirements into actionable compliance.
            </p>
          </div>

          {/* 6 Steps Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="rounded-3xl border border-white/15 bg-slate-950/35 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.3)] backdrop-blur-md transition hover:border-white/25 hover:bg-slate-950/45"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300">
                      {step.badge}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300/90">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Final Section: From Detection to Trust */}
          <div className="my-14 rounded-3xl border border-white/20 bg-slate-950/40 p-8 sm:p-10 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur-md text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-500/20 text-sky-300 mb-4 border border-blue-400/20">
              <Scale className="h-6 w-6" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              From Detection to Trust
            </h3>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-200/90 max-w-2xl mx-auto">
              Every compliance decision is supported by structured information and traceable digital evidence,
              helping officials and organizations make compliance clearer, faster, and more accountable.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.18)] transition hover:-translate-y-px cursor-pointer"
              >
                Access Official Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/register")}
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                Register Officer
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#09111c] py-4 px-4 text-center">
        <p className="text-xs text-slate-400">
          Legal Metrology (Packaged Commodities) Rules, 2011 • Department of Consumer Affairs, Government of India
        </p>
      </footer>
    </div>
  )
}
