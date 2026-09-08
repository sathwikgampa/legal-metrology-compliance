import React, { useState } from "react"
import {
  Settings,
  Moon,
  Sun,
  Shield,
  Download,
  Check,
  Building2,
  Sliders,
  FileCheck,
  Scale,
  Lock,
} from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

interface SettingsViewProps {
  onToast: (msg: string) => void
}

export default function SettingsView({ onToast }: SettingsViewProps): React.JSX.Element {
  const { isDarkMode, toggleTheme } = useTheme()
  const [selectedZone, setSelectedZone] = useState<string>("Zone 4 - Northern Enforcement Region")
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75)
  const [enforceUsp, setEnforceUsp] = useState<boolean>(true)
  const [strictFontHeight, setStrictFontHeight] = useState<boolean>(true)
  const [retentionPeriod, setRetentionPeriod] = useState<string>("5 Years")

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    onToast("System preferences and statutory parameters saved.")
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] transition-colors duration-200 relative">
      {/* Main Settings Content Area */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto min-w-0">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-[#E3E1F0] dark:border-[#26223A]">
          <h1 className="text-2xl sm:text-[30px] font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight leading-tight">
            System Settings
          </h1>
          <p className="text-sm text-[#6E6E80] dark:text-[#A29DB8] mt-1">
            Adjust visual preferences, operational jurisdiction, statutory rulesets, and audit retention
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Configuration Forms (8 cols) */}
          <form onSubmit={handleSavePreferences} className="lg:col-span-8 space-y-5">
            {/* 1. Appearance & Theme Mode */}
            <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] rounded-lg">
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                      Display Appearance & Theme
                    </h3>
                    <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                      Toggle between daylight soft lavender and enhanced dark mode
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-[#F2F1F9] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#F5D08A]" /> : <Moon className="w-4 h-4 text-[#7C6FE0]" />}
                  <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </button>
              </div>
            </div>

            {/* 2. Jurisdiction & Enforcement Office */}
            <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Jurisdiction Enforcement Assignment
                  </h3>
                  <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                    Designate operational legal jurisdiction under Section 13 of Legal Metrology Act, 2009
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider block mb-1.5">
                    Active Regional Enforcement Zone
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => {
                      setSelectedZone(e.target.value)
                      onToast(`Jurisdiction updated to ${e.target.value}`)
                    }}
                    className="w-full p-2.5 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs font-medium text-[#3A3A45] dark:text-[#ECE9F6] focus:outline-none focus:border-[#7C6FE0] shadow-xs"
                  >
                    <option value="Zone 4 - Northern Enforcement Region">
                      Zone 4 - Northern Enforcement Region (Delhi NCR, Haryana, Punjab, HP)
                    </option>
                    <option value="Zone 1 - Western Enforcement Region">
                      Zone 1 - Western Enforcement Region (Maharashtra, Gujarat, Goa)
                    </option>
                    <option value="Zone 2 - Southern Enforcement Region">
                      Zone 2 - Southern Enforcement Region (Karnataka, TN, Kerala, AP, Telangana)
                    </option>
                    <option value="Zone 3 - Eastern Enforcement Region">
                      Zone 3 - Eastern Enforcement Region (West Bengal, Odisha, Assam, NE)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E3E1F0] dark:border-[#26223A]">
                  <div>
                    <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                      Headquarters Directorate
                    </div>
                    <div className="text-[#3A3A45] dark:text-[#ECE9F6] font-semibold text-xs mt-0.5">
                      Directorate of Legal Metrology, New Delhi
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                      Officer Cadre License
                    </div>
                    <div className="font-mono text-[#7C6FE0] font-bold text-xs mt-0.5">
                      INSP-LM-2024-884
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Statutory Ruleset & Verification Parameters */}
            <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] rounded-lg">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Statutory Ruleset & Verification Parameters
                  </h3>
                  <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                    Parameters applied during OCR analysis under Packaged Commodities Rules, 2011
                  </p>
                </div>
              </div>

              {/* Confidence Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Automated Verification Confidence Threshold
                  </label>
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC]">
                    {confidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-[#7C6FE0] cursor-pointer"
                />
                <p className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
                  Scans below {confidenceThreshold}% are automatically routed to manual officer review.
                </p>
              </div>

              {/* USP Toggle Switch */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E3E1F0] dark:border-[#26223A]">
                <div>
                  <div className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Enforce Mandatory Unit Sale Price (USP) Check
                  </div>
                  <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                    Flag Rule 6(1)(e) non-conformance for packages &gt; 1kg / 1L lacking unit sale price.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforceUsp(!enforceUsp)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    enforceUsp ? "bg-[#7C6FE0]" : "bg-[#E3E1F0] dark:bg-[#26223A]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${
                      enforceUsp ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Font Height Toggle Switch */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E3E1F0] dark:border-[#26223A]">
                <div>
                  <div className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Rule 7 Schedule 2 Minimum Numeral Height Check
                  </div>
                  <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                    Enforce minimum 2mm height on principal display declarations.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictFontHeight(!strictFontHeight)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    strictFontHeight ? "bg-[#7C6FE0]" : "bg-[#E3E1F0] dark:bg-[#26223A]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${
                      strictFontHeight ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 4. Audit Retention & Ledger */}
            <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] rounded-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Audit Retention & Cryptographic Ledger
                  </h3>
                  <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                    Preserve digital evidentiary audit trails under Section 65B of Indian Evidence Act
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="w-full sm:w-64">
                  <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider block mb-1.5">
                    Statutory Retention Period
                  </label>
                  <select
                    value={retentionPeriod}
                    onChange={(e) => setRetentionPeriod(e.target.value)}
                    className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg font-medium text-[#3A3A45] dark:text-[#ECE9F6] text-xs focus:outline-none focus:border-[#7C6FE0] shadow-xs"
                  >
                    <option value="3 Years">3 Years Statutory Minimum</option>
                    <option value="5 Years">5 Years (Standard Enforcement)</option>
                    <option value="7 Years">7 Years (Dispute Resolution)</option>
                  </select>
                </div>

                <div className="self-end">
                  <button
                    type="button"
                    onClick={() => onToast("System Audit Log archive exported (CSV)")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Audit Archive</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Preferences Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,111,224,0.25)] hover:shadow-[0_6px_16px_rgba(124,111,224,0.35)] active:scale-[0.99]"
              >
                Save System Preferences
              </button>
            </div>
          </form>

          {/* Right Column: Officer Credentials Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E3E1F0] dark:border-[#26223A] pb-4">
              <div className="p-2.5 bg-[#8FD9B6]/20 text-[#2F7A55] dark:text-[#8FD9B6] rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#6E6E80] dark:text-[#A29DB8] uppercase block">
                  OFFICER CREDENTIALS
                </span>
                <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                  Statutory Warrant Authority
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                  Designated Officer
                </div>
                <div className="font-bold text-sm text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                  Inspector S. Sharma
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                  Cadre & Post
                </div>
                <div className="text-[#3A3A45] dark:text-[#ECE9F6] font-medium mt-0.5">
                  Assistant Controller of Legal Metrology
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                  Statutory Warrant Reference
                </div>
                <div className="text-[#6E6E80] dark:text-[#A29DB8] mt-1 leading-relaxed text-[11px]">
                  Authorized under Section 13 & 15 of Legal Metrology Act, 2009 for search, inspection, seizure, and compounding.
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E1F0] dark:border-[#26223A]">
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                  Cryptographic Signature Hash
                </div>
                <div className="font-mono text-[10px] text-[#7C6FE0] break-all mt-1 bg-[#F2F1F9] dark:bg-[#1C192C] p-2 rounded-md border border-[#E3E1F0] dark:border-[#26223A]">
                  SHA256: 7f8a91b2c3d4e5f6a7b8c9d0e1f2
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider">
                  Central Sync Status
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2F7A55] dark:text-[#8FD9B6] font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#8FD9B6] animate-pulse"></span>
                  <span>Synchronized with Central Registry</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E1F0] dark:border-[#26223A]">
              <button
                type="button"
                onClick={() => onToast("Officer warrant credentials downloaded")}
                className="w-full py-2 px-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
              >
                Download Warrant PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
