import React, { useState } from "react"
import {
  BarChart3,
  Download,
  AlertCircle,
  X,
  ShieldAlert,
  ArrowUpRight,
  Scale,
  TrendingUp,
  DollarSign,
  Layers,
  ChevronRight,
  HelpCircle,
} from "lucide-react"

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
    citation: "Rule 6(1)(e) - Missing MRP / Retail Price",
    description: "Package omitted retail sale price inclusive of all taxes or unit sale price (USP).",
    percentage: 42,
    cases: 58,
    compoundedAmount: "₹8.7 Lakh",
    colorHex: "#7C6FE0", // Primary Indigo
    bgLight: "bg-[#7C6FE0]",
    statutoryClause:
      "Section 18 of Legal Metrology Act, 2009 read with Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011. Every package must clearly state the retail sale price in Indian Rupees inclusive of all taxes.",
    penaltyClause:
      "Section 36(1) penalty: Fine up to ₹25,000 for the first offence, ₹50,000 for second offence, and up to ₹1,00,000 or imprisonment up to 1 year for subsequent offences.",
    recentDockets: [
      { id: "INS-8901", entity: "Crispy Munch Ltd.", product: "Classic Potato Crisps 120g", timestamp: "Oct 14, 13:45" },
      { id: "INS-8872", entity: "Crispy Munch Ltd.", product: "Salted Banana Chips 80g", timestamp: "Oct 10, 11:20" },
      { id: "INS-8854", entity: "Peshawari Bakery", product: "Butter Cookies 200g", timestamp: "Oct 08, 15:10" },
    ],
  },
  {
    id: "RULE-6-1-AC",
    citation: "Rule 6(1)(ac) - Missing Customer Care Contact",
    description: "Failure to provide designated consumer grievance officer, telephone, and email on packaging.",
    percentage: 26,
    cases: 36,
    compoundedAmount: "₹4.2 Lakh",
    colorHex: "#F5D08A", // Amber Gold
    bgLight: "bg-[#F5D08A]",
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
    citation: "Rule 6(1)(c) - Net Quantity Glare / Ambiguity",
    description: "Net quantity declaration obscure, illegible, or non-compliant with standard units of measure.",
    percentage: 18,
    cases: 25,
    compoundedAmount: "₹3.1 Lakh",
    colorHex: "#5FC8B8", // Teal
    bgLight: "bg-[#5FC8B8]",
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
    citation: "Rule 6(1)(a) - Country of Origin Missing",
    description: "Imported pre-packaged commodity without explicit Country of Origin declaration.",
    percentage: 10,
    cases: 14,
    compoundedAmount: "₹1.8 Lakh",
    colorHex: "#F3A6A6", // Rose
    bgLight: "bg-[#F3A6A6]",
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
    citation: "Rule 6(1)(d) - Date of Manufacture Omission",
    description: "Omission of month and year in which commodity is manufactured, packed, or imported.",
    percentage: 4,
    cases: 6,
    compoundedAmount: "₹0.6 Lakh",
    colorHex: "#9589EC", // Lavender
    bgLight: "bg-[#9589EC]",
    statutoryClause:
      "Rule 6(1)(d) mandates month and year of manufacture or packing in conspicuous font.",
    penaltyClause: "Statutory notice under Section 15 with 15-day compliance rectitude deadline.",
    recentDockets: [
      { id: "INS-8819", entity: "Himalaya Spice Mills", product: "Garam Masala 100g", timestamp: "Oct 03, 14:15" },
    ],
  },
]

const SECTOR_METRICS = [
  { sector: "Food & Groceries", totalScanned: 5420, violations: 58, complianceRate: 89.3, barColor: "bg-[#7C6FE0]", topRule: "Rule 6(1)(e) - Missing MRP" },
  { sector: "Cosmetics & Personal Care", totalScanned: 2840, violations: 42, complianceRate: 85.2, barColor: "bg-[#F5D08A]", topRule: "Rule 6(1)(ac) - Missing Customer Care" },
  { sector: "Electronics & Hardware", totalScanned: 1980, violations: 11, complianceRate: 94.4, barColor: "bg-[#8FD9B6]", topRule: "Rule 6(1)(a) - Country of Origin" },
  { sector: "Beverages & Dairy", totalScanned: 1450, violations: 23, complianceRate: 84.1, barColor: "bg-[#5FC8B8]", topRule: "Rule 6(1)(c) - Net Qty Ambiguity" },
  { sector: "Household Chemicals", totalScanned: 790, violations: 8, complianceRate: 89.8, barColor: "bg-[#9589EC]", topRule: "Rule 6(1)(e) - Missing MRP" },
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
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] transition-colors duration-200 relative">
      {/* Main Scrollable Area */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto min-w-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-[#E3E1F0] dark:border-[#26223A]">
          <div>
            <h1 className="text-2xl sm:text-[30px] font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight leading-tight">
              Enforcement Analytics
            </h1>
            <p className="text-sm text-[#6E6E80] dark:text-[#A29DB8] mt-1">
              Statutory telemetry, Rule 6 infraction frequencies, and regional audit metrics
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards Strip (Refined & Balanced) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: National Compliance Rate */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#8FD9B6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              National Compliance
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                84.2%
              </span>
              <span className="text-xs font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                +2.1% against target
              </span>
            </div>
            {/* Multi-segmented bar */}
            <div className="h-2 w-full bg-[#E3E1F0] dark:bg-[#26223A] rounded-full overflow-hidden flex my-1">
              <div className="h-full bg-[#8FD9B6]" style={{ width: "84.2%" }} title="Compliant: 84.2%"></div>
              <div className="h-full bg-[#F5D08A]" style={{ width: "8.6%" }} title="Review: 8.6%"></div>
              <div className="h-full bg-[#F3A6A6]" style={{ width: "7.2%" }} title="Violations: 7.2%"></div>
            </div>
            <div className="flex justify-between text-[10px] text-[#6E6E80] dark:text-[#A29DB8] font-mono mt-1">
              <span>● Compliant</span>
              <span>● Review</span>
              <span>● Violation</span>
            </div>
          </div>

          {/* Card 2: Samples Audited */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#7C6FE0] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Samples Audited
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                12,480
              </span>
              <span className="text-xs font-bold text-[#7C6FE0]">
                +8.5% throughput
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Across 4 national jurisdictions
            </div>
          </div>

          {/* Card 3: Statutory Notices */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F3A6A6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Statutory Notices
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                142 Active
              </span>
              <span className="text-xs font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                Section 48
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              -5.4% compounding delta
            </div>
          </div>

          {/* Card 4: Compounding Levied */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F5D08A] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Compounding Levied
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                ₹18.4 Lakh
              </span>
              <span className="text-xs font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                +12.0% recovered
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Statutory revenue recovery
            </div>
          </div>
        </div>

        {/* Section 1: Rule 6 Infractions Pareto Distribution */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight">
              Rule 6 Statutory Non-Conformance Pareto Distribution
            </h3>
            <span className="text-[11px] font-medium text-[#6E6E80] dark:text-[#A29DB8]">
              Click row to view clause dossier
            </span>
          </div>

          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2F1F9] dark:bg-[#1C192C] text-[#6E6E80] dark:text-[#A29DB8] font-bold border-b border-[#E3E1F0] dark:border-[#26223A]">
                    <th className="py-3 px-4 font-semibold">Statutory Rule Citation</th>
                    <th className="py-3 px-4 font-semibold">Infraction Share</th>
                    <th className="py-3 px-4 font-semibold">Citations Count</th>
                    <th className="py-3 px-4 text-right font-semibold">Compounded Revenue</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E1F0] dark:divide-[#26223A]">
                  {RULE_TELEMETRY.map((rule) => {
                    const isSelected = selectedRule?.id === rule.id
                    return (
                      <tr
                        key={rule.id}
                        onClick={() => setSelectedRule(rule)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#EDEBFB] dark:bg-[#221C38]"
                            : "hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6] flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: rule.colorHex }}
                            />
                            <span>{rule.citation}</span>
                          </div>
                          <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5 ml-4.5">
                            {rule.description}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-[#E3E1F0] dark:bg-[#26223A] h-2.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${rule.percentage}%`,
                                  backgroundColor: rule.colorHex,
                                }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                              {rule.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">
                          {rule.cases} Cases
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                          {rule.compoundedAmount}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[11px] font-bold text-[#7C6FE0] hover:underline flex items-center justify-end gap-0.5">
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: Sectoral Compliance Performance */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight">
            Sectoral Compliance Performance Comparison
          </h3>
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2F1F9] dark:bg-[#1C192C] text-[#6E6E80] dark:text-[#A29DB8] font-bold border-b border-[#E3E1F0] dark:border-[#26223A]">
                    <th className="py-3 px-4 font-semibold">Commodity Sector</th>
                    <th className="py-3 px-4 font-semibold">Audited Samples</th>
                    <th className="py-3 px-4 font-semibold">Infractions Found</th>
                    <th className="py-3 px-4 font-semibold">Compliance Progress Meter</th>
                    <th className="py-3 px-4 text-right font-semibold">Compliance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E1F0] dark:divide-[#26223A]">
                  {SECTOR_METRICS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                        {row.sector}
                        <div className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8] font-normal mt-0.5">
                          Most common: {row.topRule}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#3A3A45] dark:text-[#ECE9F6]">
                        {row.totalScanned.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3A6A6]/20 text-[#9B3B3B] dark:bg-[#261212] dark:text-[#F3A6A6]">
                          {row.violations} Infractions
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-40 bg-[#E3E1F0] dark:bg-[#26223A] h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.barColor}`}
                            style={{ width: `${row.complianceRate}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                        {row.complianceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Rule Telemetry Detail Drawer */}
      {selectedRule && (
        <aside className="w-96 bg-[#FBFAFE] dark:bg-[#161424] border-l border-[#E3E1F0] dark:border-[#26223A] p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto shadow-sm">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#7C6FE0]" />
                <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">Statutory Clause Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="p-1 hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-md transition-colors cursor-pointer text-[#6E6E80] dark:text-[#A29DB8]"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Citation Header Card */}
            <div
              className="p-4 rounded-xl text-white space-y-1.5 shadow-sm"
              style={{ backgroundColor: selectedRule.colorHex }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                {selectedRule.cases} CITATIONS RECORDED ({selectedRule.percentage}% SHARE)
              </div>
              <div className="font-bold text-sm leading-snug">
                {selectedRule.citation}
              </div>
              <div className="text-xs opacity-90 pt-1 font-mono">
                Assessed Compounding: {selectedRule.compoundedAmount}
              </div>
            </div>

            {/* Statutory Provision Mandate */}
            <div>
              <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] tracking-wider uppercase mb-1.5">
                Statutory Provision (Legal Metrology Act 2009)
              </div>
              <div className="p-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl text-xs text-[#3A3A45] dark:text-[#ECE9F6] leading-relaxed shadow-xs">
                {selectedRule.statutoryClause}
              </div>
            </div>

            {/* Penalty Provisions */}
            <div>
              <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] tracking-wider uppercase mb-1.5">
                Penalty Provisions & Compounding Guideline
              </div>
              <div className="p-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl text-xs text-[#3A3A45] dark:text-[#ECE9F6] leading-relaxed shadow-xs">
                {selectedRule.penaltyClause}
              </div>
            </div>

            {/* Recent Case Dockets */}
            <div>
              <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] tracking-wider uppercase mb-2">
                Recent Active Dockets Flagged
              </div>
              <div className="space-y-2 text-xs">
                {selectedRule.recentDockets.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#7C6FE0]">{d.id}</span>
                      <span className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8]">{d.timestamp}</span>
                    </div>
                    <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6] mt-1">{d.entity}</div>
                    <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">{d.product}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#E3E1F0] dark:border-[#26223A]">
            <button
              onClick={() => onToast(`Exported analytical dataset for ${selectedRule.citation}`)}
              className="w-full py-2.5 px-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
            >
              Export Rule Telemetry Dataset
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
