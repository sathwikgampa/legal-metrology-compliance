import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Scale, Lock, Shield, ArrowRight, UserCheck, Sparkles, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export default function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [officerId, setOfficerId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!officerId.trim() || !password.trim()) {
      setError("Please enter a valid Officer ID or NIC Email and statutory key.")
      return
    }
    setError(null)
    navigate("/")
  }

  const handleQuickLogin = (roleId: string, roleTitle: string) => {
    setOfficerId(roleId)
    setPassword("StatutoryCadre@2026")
    setError(null)
    setTimeout(() => {
      navigate("/")
    }, 250)
  }

  const handleSsoLogin = () => {
    setError(null)
    navigate("/")
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F7FC] dark:bg-[#13111C] text-[#3A3A45] dark:text-[#ECE9F6] font-sans antialiased transition-colors duration-200 relative">
      {/* Top Right Dark/Light Mode Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-[#FBFAFE] dark:bg-[#1C1A2B] border border-[#E3E1F0] dark:border-[#2E2A44] text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] rounded-full transition-colors cursor-pointer shadow-xs"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#F5D08A]" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Left Panel (50% Desktop) - Elegant Government Cadre Dossier */}
      <div className="lg:w-[50%] w-full bg-[#FBFAFE] dark:bg-[#1C1A2B] border-r border-[#E3E1F0] dark:border-[#2E2A44] p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
        {/* Subtle Decorative Background Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#7C6FE0_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
        />

        {/* Top Header: Directorate & Emblem */}
        <div className="relative z-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-xl bg-[#7C6FE0] text-white flex items-center justify-center font-bold shadow-[0_4px_14px_rgba(124,111,224,0.3)] transition-transform group-hover:scale-105">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight block">
                Directorate of Legal Metrology
              </span>
              <span className="text-[11px] font-mono text-[#6E6E80] dark:text-[#A29DB8] tracking-wider uppercase">
                Govt. of India • Department of Consumer Affairs
              </span>
            </div>
          </Link>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] border border-[#7C6FE0]/20 rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Packaged Commodities Rules, 2011 • Enforcement Cadre</span>
            </span>
          </div>
        </div>

        {/* Center: Mission & Statutory Authority */}
        <div className="relative z-10 max-w-lg my-10 lg:my-0 space-y-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6] leading-tight tracking-tight">
            National statutory compliance portal for packaged commodity inspections.
          </h1>
          <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] leading-relaxed">
            Authorized portal for District Legal Metrology Officers, Central Controllers, and Inspection Cadres under Section 15 of the Legal Metrology Act, 2009. Automated optical verification guarantees tamper-proof evidentiary audit trails.
          </p>

          {/* Statutory Pillars Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#F2F1F9] dark:bg-[#13111C] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg space-y-1">
              <div className="text-[11px] font-bold text-[#7C6FE0] uppercase">Rule 6 Mandate</div>
              <div className="text-xs text-[#3A3A45] dark:text-[#ECE9F6] font-medium">Automatic 4-sided OCR declaration audits (MRP, Net Qty, Dates)</div>
            </div>
            <div className="p-3 bg-[#F2F1F9] dark:bg-[#13111C] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg space-y-1">
              <div className="text-[11px] font-bold text-[#5FC8B8] uppercase">Section 48 Recovery</div>
              <div className="text-xs text-[#3A3A45] dark:text-[#ECE9F6] font-medium">Instant compounding penalty calculation & Rule 32 notices</div>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Footer */}
        <div className="relative z-10 text-[11px] text-[#6E6E80] dark:text-[#A29DB8] pt-4 border-t border-[#E3E1F0] dark:border-[#2E2A44] flex items-center justify-between font-mono">
          <span>CENTRAL TERMINAL • JURISDICTION DL-HQ</span>
          <span className="text-[#8FD9B6] font-bold bg-[#8FD9B6]/15 dark:bg-[#142E22] px-2 py-0.5 rounded border dark:border-[#1F4A36]">
            PORTAL STATUS: SECURE (TLS 1.3)
          </span>
        </div>
      </div>

      {/* Right Panel (50% Desktop) - Modern Clean Authentication Card */}
      <div className="lg:w-[50%] w-full bg-[#F8F7FC] dark:bg-[#13111C] p-8 lg:p-14 flex flex-col justify-center items-center transition-colors duration-200">
        <div className="w-full max-w-md bg-[#FDFDFF] dark:bg-[#1C1A2B] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-2xl p-8 shadow-[0_12px_32px_rgba(124,111,224,0.08)] space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#3A3A45] dark:text-[#ECE9F6]">
              Officer Sign In
            </h2>
            <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8]">
              Authenticate to access the live statutory inspection ledger.
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="p-3 bg-[#F2F1F9] dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#6E6E80] dark:text-[#A29DB8]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C6FE0]" />
                <span>Instant Officer Demo Login:</span>
              </span>
              <span className="text-[10px] text-[#7C6FE0]">1-Click Access</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("s.sharma@gov.in", "Inspector S. Sharma")}
                className="flex-1 px-2.5 py-1.5 bg-[#FDFDFF] dark:bg-[#1C1A2B] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2544] border border-[#E3E1F0] dark:border-[#2E2A44] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] hover:text-[#7C6FE0] rounded-md text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between shadow-xs"
              >
                <span>S. Sharma (Inspector)</span>
                <UserCheck className="w-3.5 h-3.5 text-[#7C6FE0]" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("controller.hq@gov.in", "Central Controller")}
                className="flex-1 px-2.5 py-1.5 bg-[#FDFDFF] dark:bg-[#1C1A2B] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2544] border border-[#E3E1F0] dark:border-[#2E2A44] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] hover:text-[#7C6FE0] rounded-md text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between shadow-xs"
              >
                <span>Central Controller</span>
                <UserCheck className="w-3.5 h-3.5 text-[#5FC8B8]" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#F3A6A6]/20 border border-[#F3A6A6] rounded-lg text-xs text-[#9B3B3B] dark:text-[#F3A6A6] font-semibold">
              {error}
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="officerId" className="block text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">
                Officer ID / NIC Government Email
              </label>
              <input
                id="officerId"
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. s.sharma@gov.in or INSP-LM-884"
                className="w-full h-10 px-3.5 bg-[#FDFDFF] dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg text-xs text-[#3A3A45] dark:text-[#ECE9F6] placeholder-[#6E6E80] dark:placeholder-[#A29DB8] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20 transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">
                Password / Statutory Key
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 bg-[#FDFDFF] dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg text-xs text-[#3A3A45] dark:text-[#ECE9F6] placeholder-[#6E6E80] dark:placeholder-[#A29DB8] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20 transition-all shadow-xs"
              />
            </div>

            {/* Primary Action Button (Soft Indigo #7C6FE0) */}
            <button
              type="submit"
              className="w-full h-10 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(124,111,224,0.25)] hover:shadow-[0_6px_16px_rgba(124,111,224,0.35)] active:scale-[0.99]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate into Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#E3E1F0] dark:border-[#2E2A44] w-full" />
            <span className="absolute bg-[#FDFDFF] dark:bg-[#1C1A2B] px-3 text-[11px] text-[#6E6E80] dark:text-[#A29DB8] font-medium">
              or authenticate via
            </span>
          </div>

          {/* Parichay SSO Button */}
          <button
            type="button"
            onClick={handleSsoLogin}
            className="w-full h-10 border border-[#E3E1F0] dark:border-[#2E2A44] bg-[#FDFDFF] dark:bg-[#232035] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2544] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] hover:text-[#7C6FE0] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Scale className="w-3.5 h-3.5 text-[#7C6FE0]" />
            <span>Government Parichay / Jan Parichay SSO</span>
          </button>

          {/* Statutory Legal Warning Notice */}
          <div className="p-3 bg-[#F2F1F9] dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg text-[11px] text-[#6E6E80] dark:text-[#A29DB8] leading-relaxed">
            <strong className="text-[#3A3A45] dark:text-[#ECE9F6] font-semibold block mb-0.5">
              STATUTORY WARNING (SECTION 15):
            </strong>
            This enforcement terminal is restricted to authorized officers. Access is monitored and tamper-proof logs are recorded under Section 65B of the Indian Evidence Act.
          </div>
        </div>
      </div>
    </div>
  )
}
