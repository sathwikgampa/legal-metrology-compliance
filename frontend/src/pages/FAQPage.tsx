import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import {
  Scale,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      id: "q1",
      question: "What is the Legal Metrology Compliance platform?",
      answer:
        "It is a digital compliance platform that helps organizations and officials understand, assess, document, and track legal metrology compliance.",
    },
    {
      id: "q2",
      question: "Who can use the platform?",
      answer:
        "It is designed for authorized officials and organizations involved in packaged commodities, measurement instruments, and legal metrology compliance.",
    },
    {
      id: "q3",
      question: "What can officials do on the platform?",
      answer:
        "Officials can review compliance information, identify potential issues, examine supporting evidence, and record enforcement-related actions.",
    },
    {
      id: "q4",
      question: "What can organizations do?",
      answer:
        "Organizations can understand applicable compliance requirements, review their compliance status, identify potential issues, and maintain relevant records.",
    },
    {
      id: "q5",
      question: "Does the platform replace official inspection or enforcement?",
      answer:
        "No. The platform supports compliance assessment and evidence management. Official inspection, verification, and enforcement remain the responsibility of authorized authorities.",
    },
    {
      id: "q6",
      question: "How is compliance evidence handled?",
      answer:
        "Relevant compliance information and records are organized digitally so that actions and findings can be traced and reviewed.",
    },
    {
      id: "q7",
      question: "Can previous compliance actions be tracked?",
      answer:
        "Yes. The platform can maintain a traceable history of compliance-related records and actions.",
    },
    {
      id: "q8",
      question: "Who has access to official functions?",
      answer:
        "Official functions should remain restricted according to the project's existing authentication and authorization system.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen w-full bg-[#0b1623] text-white flex flex-col justify-between">
      <div
        className="relative flex-1 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11,22,35,0.92) 0%, rgba(11,22,35,0.85) 50%, rgba(11,22,35,0.92) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        {/* Ambient background accents */}
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
            <Link to="/how-it-works" className="transition hover:text-white">
              How it works
            </Link>
            <Link
              to="/faq"
              className="text-white font-bold border-b border-sky-400 pb-0.5"
            >
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
        <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-2xl mx-auto pt-4 pb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
              <HelpCircle className="h-3.5 w-3.5 text-sky-300" />
              Answers & Guidance
            </div>

            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200/90">
              Find clear answers about legal metrology compliance, platform capabilities, and statutory verification.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-white/15 bg-slate-950/35 backdrop-blur-md transition hover:border-white/25 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-base sm:text-lg font-semibold text-white focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.question}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-sky-500/20 text-sky-300" : "text-slate-400"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-slate-300/95 border-t border-white/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Trust Banner Note */}
          <div className="my-12 rounded-2xl border border-white/15 bg-slate-950/40 p-6 text-center backdrop-blur-md">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-sky-500/15 text-sky-300 mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Have more questions?</h3>
            <p className="mt-1 text-sm text-slate-300 max-w-md mx-auto">
              Authorized personnel and registered organizations can consult official guidelines or access the portal directly.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.18)] transition hover:-translate-y-px cursor-pointer"
              >
                Sign In
                <ArrowRight className="ml-1.5 h-4 w-4" />
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
