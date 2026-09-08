import React, { useState } from "react"
import { Settings, Moon, Sun, Shield, Download, Check } from "lucide-react"
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
    /* QUIET, LOW-CONTRAST MONOCHROMATIC SLATE (#F9FAFB Light / #111111 Dark) */
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-[#F9FAFB] dark:bg-[#111111] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Main Settings Content Area: Calm Two-Column Administrative Layout */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
        {/* Header */}
        <div className="mb-5 border-b border-slate-200 dark:border-[#222222] pb-4">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold">
            ADMINISTRATIVE CONSOLE • SYSTEM PREFERENCES
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            System Configuration & Enforcement Parameters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust visual preferences, operational jurisdiction, statutory strictness, and audit retention.
          </p>
        </div>

        {/* TWO-COLUMN BESPOKE LAYOUT (NO KPI CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Configuration Form Groups (65% width / 8 cols) */}
          <form onSubmit={handleSavePreferences} className="lg:col-span-8 space-y-4">
            {/* 1. Appearance & Theme Mode */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#2A2A2A] rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Display Appearance & Field Theme
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Toggle between standard light and field-contrast dark theme modes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] hover:bg-slate-200 dark:hover:bg-[#303030] text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-slate-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </button>
              </div>
            </div>

            {/* 2. Jurisdiction & Regional Enforcement Office */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#2A2A2A] rounded-md p-4 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Jurisdiction Enforcement Assignment
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Designate operational legal jurisdiction under Section 13 of Legal Metrology Act, 2009.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Active Regional Enforcement Zone
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => {
                      setSelectedZone(e.target.value)
                      onToast(`Jurisdiction updated to ${e.target.value}`)
                    }}
                    className="w-full p-2 bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#333333] rounded text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
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

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-[#222222]">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">Headquarters Directorate</div>
                    <div className="text-slate-800 dark:text-slate-200 font-medium text-xs mt-0.5">
                      Directorate of Legal Metrology, New Delhi
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">Officer License Cadre</div>
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold text-xs mt-0.5">
                      INSP-LM-2024-884
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Statutory Ruleset & Verification Strictness */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#2A2A2A] rounded-md p-4 space-y-3.5 text-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Statutory Ruleset & Verification Parameters
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Parameters applied during OCR analysis under Packaged Commodities Rules, 2011.
                </p>
              </div>

              {/* Confidence Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Automated Verification Confidence Threshold
                  </label>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
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
                  className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">
                  Scans below {confidenceThreshold}% are automatically routed to the manual verification queue.
                </p>
              </div>

              {/* USP Check */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#222222]">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Enforce Mandatory Unit Sale Price (USP) Check
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Flag Rule 6(1)(e) non-conformance for packages &gt; 1kg / 1L lacking unit sale price.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enforceUsp}
                  onChange={(e) => setEnforceUsp(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-slate-300 dark:border-[#333333] rounded focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Font Height Check */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#222222]">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Rule 7 Schedule 2 Minimum Numeral Height Check
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Enforce minimum 2mm height on principal display declarations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={strictFontHeight}
                  onChange={(e) => setStrictFontHeight(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-slate-300 dark:border-[#333333] rounded focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Audit Retention & Governance */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#2A2A2A] rounded-md p-4 space-y-3 text-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Audit Retention & Cryptographic Ledger
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Preserve digital evidentiary audit trails under Section 65B of Indian Evidence Act.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Statutory Retention Standard
                  </label>
                  <select
                    value={retentionPeriod}
                    onChange={(e) => setRetentionPeriod(e.target.value)}
                    className="p-1.5 bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#333333] rounded font-medium text-slate-800 dark:text-slate-200 text-xs"
                  >
                    <option value="3 Years">3 Years Statutory Minimum</option>
                    <option value="5 Years">5 Years (Standard Enforcement)</option>
                    <option value="7 Years">7 Years (Dispute Resolution)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end">
                  <button
                    type="button"
                    onClick={() => onToast("System Audit Log archive exported (CSV)")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#202020] border border-slate-300 dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#252525] text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Audit Archive</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded transition-colors cursor-pointer"
              >
                Save System Preferences
              </button>
            </div>
          </form>

          {/* RIGHT COLUMN: Quiet Officer Credentials Card (35% width / 4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#2A2A2A] rounded-md p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-[#222222] pb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
                OFFICER CREDENTIALS
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                Statutory Warrant Authority
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-400">Designated Officer</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  Inspector S. Sharma
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-400">Cadre & Post</div>
                <div className="text-slate-700 dark:text-slate-300 mt-0.5">
                  Assistant Controller of Legal Metrology
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-400">Statutory Warrant Reference</div>
                <div className="text-slate-700 dark:text-slate-300 font-serif mt-0.5 leading-relaxed text-[11px]">
                  Authorized under Section 13 & 15 of Legal Metrology Act, 2009 for search, inspection, seizure, and compounding.
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#222222]">
                <div className="text-[10px] font-mono text-slate-400">Cryptographic Signature Hash</div>
                <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all mt-0.5">
                  SHA256: 7f8a91b2c3d4e5f6a7b8c9d0e1f2
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-400">Central Sync Timestamp</div>
                <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                  2026-09-08 21:30 IST • Synchronized
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#222222]">
              <button
                type="button"
                onClick={() => onToast("Officer warrant credentials downloaded")}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-[#202020] border border-slate-200 dark:border-[#333333] hover:bg-slate-100 dark:hover:bg-[#252525] text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors cursor-pointer text-center"
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
