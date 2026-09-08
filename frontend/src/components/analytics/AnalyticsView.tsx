import React, { useState } from "react"
import { BarChart3, Download, AlertCircle, X, ShieldAlert, ArrowUpRight, Scale, TrendingUp, DollarSign, Layers } from "lucide-react"

export interface RuleTelemetryItem {
  id: string
  citation: string
  description: string
  percentage: number
  cases: number
  compoundedAmount: string
  colorHex: string
  bgLight: string
  statutoryClause: string
  penaltyClause: string
  recentDockets: {
    id: string
    entity: string
    product: string
    timestamp: string
  }[]
}

const RULE_TELEMETRY: RuleTelemetryItem[] = [
  {
    id: "RULE-6-1-E",
    citation: "Rule 6(1)(e) - Missing MRP / Retail Sale Price",
    description: "Package omitted retail sale price inclusive of all taxes or unit sale price (USP).",
    percentage: 42,
    cases: 58,
    compoundedAmount: "₹8.7 Lakh",
    colorHex: "#4338CA", // Saturated Royal Indigo
    bgLight: "bg-[#4338CA]",
    statutoryClause:
      "Section 18 of Legal Metrology Act, 2009 read with Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011. Every package must clearly state the retail sale price in Indian Rupees inclusive of all taxes.",
    penaltyClause:
      "Section 36(1) penalty: Fine up to ₹25,000 for the first offence, ₹50,000 for the second offence, and up to ₹1,00,000 or imprisonment up to 1 year for subsequent offences.",
    recentDockets: [
      { id: "INS-8901", entity: "Crispy Munch Ltd.", product: "Classic Potato Crisps 120g", timestamp: "Oct 14, 13:45" },
      { id: "INS-8872", entity: "Crispy Munch Ltd.", product: "Salted Banana Chips 80g", timestamp: "Oct 10, 11:20" },
      { id: "INS-8854", entity: "Peshawari Bakery", product: "Butter Cookies 200g", timestamp: "Oct 08, 15:10" },
    ],
  },
  {
    id: "RULE-6-1-AC",
    citation: "Rule 6(1)(ac) - Missing Customer Care Contact Details",
    description: "Failure to provide designated consumer grievance officer, telephone, and email on packaging.",
    percentage: 26,
    cases: 36,
    compoundedAmount: "₹4.2 Lakh",
    colorHex: "#D97706", // Deep Amber Gold
    bgLight: "bg-[#D97706]",
    statutoryClause:
      "Rule 6(1)(ac) mandates name, address, telephone number, and email address of person/office to be contacted in case of consumer complaints.",
    penaltyClause: "Compoundable under Section 48 of Legal Metrology Act, 2009 for initial non-conformance.",
    recentDockets: [
      { id: "INS-8907", entity: "Glow & Charm Cosmetics", product: "Hydrating Facial Cream 50g", timestamp: "Oct 12, 17:40" },
      { id: "INS-8869", entity: "Aura Essentials", product: "Body Butter 150g", timestamp: "Oct 09, 13:20" },
    ],
  },
  {
    id: "RULE-6-1-C",
    citation: "Rule 6(1)(c) - Net Quantity Non-Conformity or Glare",
    description: "Net quantity declaration obscure, illegible, or non-compliant with standard units of weight/measure.",
    percentage: 18,
    cases: 25,
    compoundedAmount: "₹3.1 Lakh",
    colorHex: "#0D9488", // Rich Teal / Cyan
    bgLight: "bg-[#0D9488]",
    statutoryClause:
      "Rule 6(1)(c) read with Rule 11 and 12 mandates net quantity in terms of standard units (g, kg, ml, l) with prescribed minimum numeral height.",
    penaltyClause: "Section 36(2) penalty for short weight or measure: Fine up to ₹10,000.",
    recentDockets: [
      { id: "INS-8903", entity: "Botanica Care India", product: "Radiance Face Serum 30ml", timestamp: "Oct 14, 09:15" },
      { id: "INS-8831", entity: "Kaveri Herbal Soaps", product: "Sandalwood Bath Soap 75g", timestamp: "Oct 04, 11:00" },
    ],
  },
  {
    id: "RULE-6-1-A",
    citation: "Rule 6(1)(a) - Country of Origin Missing on Imported Goods",
    description: "Imported pre-packaged commodity without explicit Country of Origin declaration.",
    percentage: 10,
    cases: 14,
    compoundedAmount: "₹1.8 Lakh",
    colorHex: "#E11D48", // Vivid Crimson
    bgLight: "bg-[#E11D48]",
    statutoryClause:
      "Rule 6(1)(a) proviso: If a package contains imported commodities, the name of the country of origin or manufacture shall be mentioned on the package.",
    penaltyClause: "Customs and Metrology compounding notice issued under Rule 32.",
    recentDockets: [
      { id: "INS-8904", entity: "Assam Gold Tea Co.", product: "Premium Tea Leaves 500g", timestamp: "Oct 13, 16:30" },
      { id: "INS-8851", entity: "Assam Gold Tea Co.", product: "Orthodox Leaf Tea 250g", timestamp: "Oct 07, 12:15" },
    ],
  },
  {
    id: "RULE-6-1-D",
    citation: "Rule 6(1)(d) - Date of Manufacture / Packing Omission",
    description: "Omission of month and year in which the commodity is manufactured, packed, or imported.",
    percentage: 4,
    cases: 6,
    compoundedAmount: "₹0.6 Lakh",
    colorHex: "#7C3AED", // Deep Purple
    bgLight: "bg-[#7C3AED]",
    statutoryClause:
      "Rule 6(1)(d) mandates month and year of manufacture or packing in conspicuous font.",
    penaltyClause: "Statutory notice under Section 15 with 15-day compliance rectitude deadline.",
    recentDockets: [
      { id: "INS-8819", entity: "Himalaya Spice Mills", product: "Garam Masala 100g", timestamp: "Oct 03, 14:15" },
    ],
  },
]

const SECTOR_METRICS = [
  { sector: "Food & Groceries", totalScanned: 5420, violations: 58, complianceRate: 89.3, barColor: "bg-[#4338CA]", topRule: "Rule 6(1)(e) - Missing MRP" },
  { sector: "Cosmetics & Personal Care", totalScanned: 2840, violations: 42, complianceRate: 85.2, barColor: "bg-[#D97706]", topRule: "Rule 6(1)(ac) - Missing Customer Care" },
  { sector: "Electronics & Hardware", totalScanned: 1980, violations: 11, complianceRate: 94.4, barColor: "bg-[#059669]", topRule: "Rule 6(1)(a) - Country of Origin" },
  { sector: "Beverages & Dairy", totalScanned: 1450, violations: 23, complianceRate: 84.1, barColor: "bg-[#0D9488]", topRule: "Rule 6(1)(c) - Net Qty Ambiguity" },
  { sector: "Household Chemicals", totalScanned: 790, violations: 8, complianceRate: 89.8, barColor: "bg-[#7C3AED]", topRule: "Rule 6(1)(e) - Missing MRP" },
]

interface AnalyticsViewProps {
  onToast: (msg: string) => void
}

export default function AnalyticsView({ onToast }: AnalyticsViewProps): React.JSX.Element {
  const [selectedRule, setSelectedRule] = useState<RuleTelemetryItem | null>(RULE_TELEMETRY[0])

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Rule Citation,Infraction Share,Cases Count,Compounded Penalties\n" +
      RULE_TELEMETRY.map(
        (r) => `"${r.citation}",${r.percentage}%,${r.cases},"${r.compoundedAmount}"`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "enforcement_telemetry_analytics.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onToast("Enforcement Telemetry exported as CSV")
  }

  return (
    /* ANALYTICS CANVAS: CLEAN NEUTRAL BACKDROP (#F8FAFC) ALLOWING SATURATED CHART COLORS TO DO REAL WORK */
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors duration-200">
      {/* Main Analytics Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
        {/* Title Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-indigo-700 dark:text-indigo-400 font-bold">
              STATISTICAL ENFORCEMENT MODELING • RULE 6 TELEMETRY
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Enforcement Telemetry & Statistical Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aggregate compliance trends, Rule 6 violation frequencies, and regional audit metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>

        {/* BESPOKE LAYOUT: COMPARATIVE ENFORCEMENT BAROMETER (REPLACES 4 GENERIC BOXES) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* National Compliance Progress Meter */}
            <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-6">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                National Compliance Barometer
              </div>
              <div className="flex items-baseline gap-3 mt-1.5">
                <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  84.2%
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  +2.1% against target
                </span>
              </div>
              {/* Multi-segmented compliance bar */}
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mt-2.5">
                <div className="h-full bg-emerald-600" style={{ width: "84.2%" }} title="Compliant: 84.2%"></div>
                <div className="h-full bg-amber-500" style={{ width: "8.6%" }} title="Review: 8.6%"></div>
                <div className="h-full bg-rose-600" style={{ width: "7.2%" }} title="Violations: 7.2%"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                <span>0%</span>
                <span className="text-emerald-600 font-bold">● Compliant (84.2%)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Three Analytical Dimension Columns */}
            <div className="lg:w-2/3 grid grid-cols-3 gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">
                  Packaging Samples Audited
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  12,480
                </div>
                <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold mt-0.5">
                  +8.5% throughput
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">
                  Statutory Notices Issued
                </div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight mt-1">
                  142
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  -5.4% compounding delta
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">
                  Compounding Levied
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  ₹18.4L
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  +12.0% recovered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: SATURATED PARETO DISTRIBUTION OF RULE 6 INFRACTIONS */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Rule 6 Statutory Non-Conformance Pareto Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">SELECT ROW FOR CLAUSE DOSSIER</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4" scope="col">STATUTORY RULE CITATION</th>
                  <th className="py-3 px-4" scope="col">INFRACTION SHARE</th>
                  <th className="py-3 px-4" scope="col">CITATIONS</th>
                  <th className="py-3 px-4 text-right" scope="col">COMPOUNDED REVENUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {RULE_TELEMETRY.map((rule) => {
                  const isSelected = selectedRule?.id === rule.id
                  return (
                    <tr
                      key={rule.id}
                      onClick={() => setSelectedRule(rule)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-slate-100/80 dark:bg-slate-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {/* Rich saturated color dot indicator */}
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: rule.colorHex }}
                          />
                          <span>{rule.citation}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 ml-4.5">
                          {rule.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Saturated High-Energy Distribution Bar */}
                          <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${rule.percentage}%`,
                                backgroundColor: rule.colorHex,
                              }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {rule.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {rule.cases} Cases
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {rule.compoundedAmount}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: SECTORAL COMPLIANCE MATRIX WITH VISUAL METERS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Sectoral Compliance Performance Comparison
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4" scope="col">COMMODITY SECTOR</th>
                  <th className="py-3 px-4" scope="col">AUDITED SAMPLES</th>
                  <th className="py-3 px-4" scope="col">INFRACTIONS FOUND</th>
                  <th className="py-3 px-4" scope="col">COMPLIANCE PROGRESS METER</th>
                  <th className="py-3 px-4 text-right" scope="col">COMPLIANCE RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {SECTOR_METRICS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {row.sector}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {row.totalScanned.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                        {row.violations} Infractions
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Saturated progress meter per sector */}
                      <div className="w-36 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.barColor}`}
                          style={{ width: `${row.complianceRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {row.complianceRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE SPLIT-PANE: RULE TELEMETRY & STATUTORY CLAUSE DOSSIER */}
      {selectedRule && (
        <aside className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Rule Telemetry & Legal Clause
                </h3>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer text-slate-400"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Saturated Citation Header Block */}
            <div
              className="p-4 rounded-md text-white space-y-1.5"
              style={{ backgroundColor: selectedRule.colorHex }}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-90">
                {selectedRule.cases} CITATIONS RECORDED
              </div>
              <div className="font-bold text-sm leading-snug">
                {selectedRule.citation}
              </div>
              <div className="text-[11px] opacity-90 pt-1 font-mono">
                Assessed Penalties: {selectedRule.compoundedAmount}
              </div>
            </div>

            {/* Statutory Provision Mandate */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1.5">
                STATUTORY PROVISION (LEGAL METROLOGY ACT 2009)
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                {selectedRule.statutoryClause}
              </div>
            </div>

            {/* Compounding Standards & Section 36 Penalty */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1.5">
                PENALTY PROVISIONS & COMPOUNDING GUIDELINE
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                {selectedRule.penaltyClause}
              </div>
            </div>

            {/* Recent Case Dockets Flagged */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-2">
                RECENT ACTIVE DOCKETS UNDER THIS RULE
              </div>
              <div className="space-y-2 text-xs">
                {selectedRule.recentDockets.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{d.id}</span>
                      <span className="text-[10px] text-slate-400">{d.timestamp}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{d.entity}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.product}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onToast(`Exported analytical dataset for ${selectedRule.citation}`)}
              className="w-full py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
            >
              Export Rule Telemetry Dataset
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
