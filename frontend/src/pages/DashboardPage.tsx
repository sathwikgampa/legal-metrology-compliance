import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, Download, Plus, AlertCircle, X, MoreHorizontal, HelpCircle, Check, Building2, BarChart3, Settings, ShieldCheck, Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

interface DocketItem {
  id: string
  timestamp: string
  manufacturer: string
  product: string
  category: string
  status: "VIOLATION" | "COMPLIANT" | "REVIEW"
  rule_violation?: string
  gtin: string
  confidence: number
}

const DOCKET_ITEMS: DocketItem[] = [
  {
    id: "INS-8901",
    timestamp: "Oct 14, 13:45",
    manufacturer: "Crispy Munch Ltd.",
    product: "Classic Potato Crisps 120g",
    category: "Food & Groceries",
    status: "VIOLATION",
    rule_violation: "Rule 6(1)(e) - Missing MRP",
    gtin: "008901030",
    confidence: 94.1,
  },
  {
    id: "INS-8902",
    timestamp: "Oct 14, 11:20",
    manufacturer: "Shree Bhog Foods",
    product: "Fortified Wheat Atta 5kg",
    category: "Food & Groceries",
    status: "COMPLIANT",
    gtin: "008901031",
    confidence: 98.4,
  },
  {
    id: "INS-8903",
    timestamp: "Oct 14, 09:15",
    manufacturer: "Botanica Care India",
    product: "Radiance Face Serum 30ml",
    category: "Cosmetics",
    status: "REVIEW",
    rule_violation: "Rule 6(1)(c) - Net Qty Glare",
    gtin: "008901032",
    confidence: 62.8,
  },
  {
    id: "INS-8904",
    timestamp: "Oct 13, 16:30",
    manufacturer: "Assam Gold Tea Co.",
    product: "Premium Tea Leaves 500g",
    category: "Food & Groceries",
    status: "VIOLATION",
    rule_violation: "Rule 6(1)(a) - Country of Origin Missing",
    gtin: "008901033",
    confidence: 91.0,
  },
  {
    id: "INS-8905",
    timestamp: "Oct 13, 14:00",
    manufacturer: "Aqua Pure Beverages",
    product: "Mineral Water 1L",
    category: "Food & Groceries",
    status: "COMPLIANT",
    gtin: "008901034",
    confidence: 99.1,
  },
  {
    id: "INS-8906",
    timestamp: "Oct 13, 11:15",
    manufacturer: "TechPro Electronics",
    product: "Smart Wireless Earbuds v2",
    category: "Electronics",
    status: "COMPLIANT",
    gtin: "008901035",
    confidence: 97.5,
  },
  {
    id: "INS-8907",
    timestamp: "Oct 12, 17:40",
    manufacturer: "Glow & Charm Cosmetics",
    product: "Hydrating Facial Cream 50g",
    category: "Cosmetics",
    status: "VIOLATION",
    rule_violation: "Rule 6(1)(ac) - Missing Customer Care",
    gtin: "008901036",
    confidence: 93.2,
  },
]

export interface DashboardPageProps {
  activeTab?: string
  activeView?: string
  activeCategory?: string
  searchQuery?: string
}

export default function DashboardPage({
  activeTab = "Inspections",
  activeView = "all",
  activeCategory = "all",
  searchQuery = "",
}: DashboardPageProps): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [selectedDocket, setSelectedDocket] = useState<DocketItem | null>(DOCKET_ITEMS[0])
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string>("Zone 4 - Enforcement Active")

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filter items dynamically based on active View, Category, Search, and Status filter
  const filteredItems = DOCKET_ITEMS.filter((item) => {
    if (activeView === "violations" && item.status !== "VIOLATION") return false
    if (activeView === "review" && item.status !== "REVIEW") return false
    if (activeCategory !== "all" && item.category !== activeCategory) return false

    if (statusFilter !== "ALL" && item.status !== statusFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchId = item.id.toLowerCase().includes(q)
      const matchMfg = item.manufacturer.toLowerCase().includes(q)
      const matchProd = item.product.toLowerCase().includes(q)
      const matchGtin = item.gtin.toLowerCase().includes(q)
      if (!matchId && !matchMfg && !matchProd && !matchGtin) return false
    }

    return true
  })

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Docket ID,Timestamp,Manufacturer,Product,Category,Status,GTIN\n" +
      filteredItems
        .map(
          (i) =>
            `${i.id},${i.timestamp},"${i.manufacturer}","${i.product}","${i.category}",${i.status},${i.gtin}`
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "inspections_ledger.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("CSV Inspection Ledger exported successfully.")
  }

  // RENDER TAB 2: ENTITIES VIEW
  if (activeTab === "Entities") {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-3.5rem)] space-y-6 transition-colors duration-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Regulated Entities & Manufacturers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered corporate entities, packers, and importers under Packaged Commodities Rules 2011.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Crispy Munch Ltd.", sector: "Snacks & Confectionery", total: 42, violations: 3, gtin: "8901030XXXX" },
            { name: "Shree Bhog Foods", sector: "Food & Grains", total: 85, violations: 0, gtin: "8901031XXXX" },
            { name: "Botanica Care India", sector: "Cosmetics & Personal Care", total: 29, violations: 1, gtin: "8901032XXXX" },
            { name: "Assam Gold Tea Co.", sector: "Beverages", total: 37, violations: 4, gtin: "8901033XXXX" },
            { name: "Aqua Pure Beverages", sector: "Beverages", total: 64, violations: 0, gtin: "8901034XXXX" },
            { name: "TechPro Electronics", sector: "Electronics", total: 18, violations: 0, gtin: "8901035XXXX" },
          ].map((entity, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{entity.name}</span>
                {entity.violations > 0 ? (
                  <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {entity.violations} Violations
                  </span>
                ) : (
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    100% Compliant
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{entity.sector}</div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Scanned: <strong className="text-slate-800 dark:text-slate-200">{entity.total}</strong></span>
                <span className="font-mono text-[11px] text-slate-400">Prefix: {entity.gtin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // RENDER TAB 3: ANALYTICS VIEW
  if (activeTab === "Analytics") {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-3.5rem)] space-y-6 transition-colors duration-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Enforcement Telemetry & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aggregate compliance trends, Rule 6 violation frequencies, and regional audit metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Compliance Rate Trend (Last 7 Days)</h3>
            <div className="space-y-3">
              {[
                { day: "Mon", rate: "86.4%", width: "86%", color: "bg-emerald-500" },
                { day: "Tue", rate: "84.2%", width: "84%", color: "bg-emerald-500" },
                { day: "Wed", rate: "88.0%", width: "88%", color: "bg-emerald-500" },
                { day: "Thu", rate: "79.5%", width: "80%", color: "bg-amber-500" },
                { day: "Fri", rate: "85.1%", width: "85%", color: "bg-emerald-500" },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-semibold text-slate-500 dark:text-slate-400">{row.day}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className={`${row.color} h-full transition-all duration-500`} style={{ width: row.width }}></div>
                  </div>
                  <span className="w-12 text-right font-bold text-slate-800 dark:text-slate-200">{row.rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Rule Violations Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex justify-between items-center border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Rule 6(1)(e) - Missing MRP / USP</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">42% of total infractions</div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">18 Cases</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex justify-between items-center border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Rule 6(1)(ac) - Missing Customer Care</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">28% of total infractions</div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">12 Cases</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex justify-between items-center border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Rule 6(1)(c) - Net Quantity Glare / Ambiguity</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">19% of total infractions</div>
                </div>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">8 Cases</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RENDER TAB 4: SETTINGS VIEW
  if (activeTab === "Settings") {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-3.5rem)] space-y-6 transition-colors duration-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            System Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure UI appearance, enforcement rulesets, and officer preferences.
          </p>
        </div>

        <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-6">
          {/* Appearance Settings */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Appearance & Theme Mode</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-slate-700" />}
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    {isDarkMode ? "Dark Theme Enabled" : "Light Theme Enabled"}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Seamlessly toggle visual theme based on your environmental preferences.
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>

          {/* Enforcement Zone */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Jurisdiction Enforcement Zone</h3>
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value)
                showToast(`Jurisdiction updated to ${e.target.value}`)
              }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Zone 4 - Enforcement Active">Zone 4 - Northern Enforcement Region</option>
              <option value="Zone 1 - Western Region">Zone 1 - Western Enforcement Region</option>
              <option value="Zone 2 - Southern Region">Zone 2 - Southern Enforcement Region</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  // RENDER TAB 1 (DEFAULT): INSPECTIONS LEDGER VIEW
  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-blue-600 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Ledger Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
        {/* Title Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inspections Ledger</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time telemetry and compliance audit logs.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setFilterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => navigate("/inspections/new")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Run Manual Scan</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Scans */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Scans (24h)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1,284</span>
              <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                +12.5%
              </span>
            </div>
          </div>

          {/* Card 2: Compliance Rate */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Compliance Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">84.2%</span>
              <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                +2.1%
              </span>
            </div>
          </div>

          {/* Card 3: Flagged Violations */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Flagged Violations</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">12</div>
          </div>

          {/* Card 4: Pending Review */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Review</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">8</div>
          </div>
        </div>

        {/* Inspections Ledger Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4" scope="col">DOCKET ID</th>
                  <th className="py-3 px-4" scope="col">TIMESTAMP</th>
                  <th className="py-3 px-4" scope="col">ENTITY / PRODUCT</th>
                  <th className="py-3 px-4" scope="col">STATUS</th>
                  <th className="py-3 px-4 text-right" scope="col">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredItems.map((item) => {
                  const isSelected = selectedDocket?.id === item.id
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedDocket(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-slate-100/80 dark:bg-slate-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {item.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{item.manufacturer}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.product}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.status === "VIOLATION" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400"></span>
                            Violation
                          </span>
                        )}
                        {item.status === "COMPLIANT" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                            Compliant
                          </span>
                        )}
                        {item.status === "REVIEW" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                            Review
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-600 dark:text-slate-300">
                        {item.confidence}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer Panel: Docket Details */}
      {selectedDocket && (
        <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shrink-0 shadow-lg relative z-20 transition-colors duration-200">
          <div className="space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Docket Details</h3>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
                  {selectedDocket.id}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => showToast(`Copying Docket ${selectedDocket.id} metadata`)}
                  className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDocket(null)}
                  className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Violation Alert Banner */}
            {selectedDocket.status === "VIOLATION" ? (
              <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-rose-950 dark:text-rose-200">
                    Statutory Violation Detected
                  </div>
                  <div className="text-xs text-rose-700 dark:text-rose-300 font-semibold mt-0.5">
                    {selectedDocket.rule_violation || "Rule 6(1)(e) - Missing MRP"}
                  </div>
                </div>
              </div>
            ) : selectedDocket.status === "REVIEW" ? (
              <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-amber-950 dark:text-amber-200">
                    Officer Verification Needed
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
                    {selectedDocket.rule_violation || "Low OCR confidence on net quantity"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                <div>
                  <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                    Statutory Compliance Verified
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                    All mandatory Rule 6 declarations verified cleanly.
                  </div>
                </div>
              </div>
            )}

            {/* ENTITY INFORMATION */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3">
                Entity Information
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Manufacturer</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDocket.manufacturer}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Product</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDocket.product}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">GTIN / Barcode</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedDocket.gtin}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Inspection Time</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {selectedDocket.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                showToast(`Analysis override requested for ${selectedDocket.id}`)
              }}
              className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer text-center"
            >
              Override Analysis
            </button>
            <button
              onClick={() => {
                showToast(`Formal Notice Rule 32 generated for ${selectedDocket.manufacturer}`)
              }}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Issue Formal Notice
            </button>
          </div>

          {/* Floating ? Help Icon */}
          <button
            onClick={() => showToast("Legal Metrology Help: Section 18 / Rule 6 compounding protocol active")}
            className="absolute bottom-4 right-4 w-7 h-7 bg-slate-900 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-md hover:bg-slate-800 dark:hover:bg-blue-500 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Modal Dialog */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 w-80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Filter Inspections Ledger</h3>
              <button onClick={() => setFilterModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Compliance Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="VIOLATION">Violations Only</option>
                <option value="COMPLIANT">Compliant Only</option>
                <option value="REVIEW">Needs Review</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-3 py-1.5 bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
