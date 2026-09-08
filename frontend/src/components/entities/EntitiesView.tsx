import React, { useState } from "react"
import {
  Building2,
  Search,
  Download,
  AlertCircle,
  X,
  MoreHorizontal,
  HelpCircle,
  Shield,
  Check,
  ChevronRight,
  ExternalLink,
  Filter,
} from "lucide-react"

export interface EntityItem {
  id: string
  name: string
  sector: string
  lin: string
  gtinPrefix: string
  status: "VIOLATION" | "COMPLIANT"
  totalScans: number
  complianceRate: number
  activeViolationsCount: number
  rule_violation?: string
  address: string
  signatory: string
  dockets: {
    id: string
    product: string
    status: "VIOLATION" | "COMPLIANT" | "REVIEW"
    rule_violation?: string
    timestamp: string
  }[]
}

const ENTITIES_DATA: EntityItem[] = [
  {
    id: "ENT-101",
    name: "Crispy Munch Ltd.",
    sector: "Snacks & Confectionery",
    lin: "LIN-2021-DL-0042",
    gtinPrefix: "8901030XXXX",
    status: "VIOLATION",
    totalScans: 42,
    complianceRate: 85.7,
    activeViolationsCount: 3,
    rule_violation: "Rule 6(1)(e) - Missing MRP across 3 packaged commodities",
    address: "Plot 14, Industrial Area Phase II, Okhla, New Delhi 110020",
    signatory: "Vikramaditya Sen (Managing Director)",
    dockets: [
      { id: "INS-8901", product: "Classic Potato Crisps 120g", status: "VIOLATION", rule_violation: "Rule 6(1)(e) - Missing MRP", timestamp: "Oct 14, 13:45" },
      { id: "INS-8872", product: "Salted Banana Chips 80g", status: "VIOLATION", rule_violation: "Rule 6(1)(e) - Missing MRP", timestamp: "Oct 10, 11:20" },
      { id: "INS-8840", product: "Roasted Peanuts 200g", status: "COMPLIANT", timestamp: "Oct 05, 16:10" },
    ],
  },
  {
    id: "ENT-102",
    name: "Shree Bhog Foods",
    sector: "Food & Grains",
    lin: "LIN-2019-MH-0198",
    gtinPrefix: "8901031XXXX",
    status: "COMPLIANT",
    totalScans: 85,
    complianceRate: 100.0,
    activeViolationsCount: 0,
    address: "Survey 48/2, APMC Market Yard, Vashi, Navi Mumbai 400703",
    signatory: "Rameshwar Bhog (Partner)",
    dockets: [
      { id: "INS-8902", product: "Fortified Wheat Atta 5kg", status: "COMPLIANT", timestamp: "Oct 14, 11:20" },
      { id: "INS-8865", product: "Basmati Rice 1kg", status: "COMPLIANT", timestamp: "Oct 09, 14:00" },
      { id: "INS-8812", product: "Refined Gram Flour 1kg", status: "COMPLIANT", timestamp: "Oct 02, 10:30" },
    ],
  },
  {
    id: "ENT-103",
    name: "Botanica Care India",
    sector: "Cosmetics & Personal Care",
    lin: "LIN-2022-KA-0751",
    gtinPrefix: "8901032XXXX",
    status: "VIOLATION",
    totalScans: 29,
    complianceRate: 89.6,
    activeViolationsCount: 1,
    rule_violation: "Rule 6(1)(c) - Net Quantity Glare / Ambiguity",
    address: "Tech Park Boulevard, Whitefield, Bengaluru 560066",
    signatory: "Ananya Deshmukh (Compliance Officer)",
    dockets: [
      { id: "INS-8903", product: "Radiance Face Serum 30ml", status: "REVIEW", rule_violation: "Rule 6(1)(c) - Net Qty Glare", timestamp: "Oct 14, 09:15" },
      { id: "INS-8834", product: "Rosewater Mist 100ml", status: "COMPLIANT", timestamp: "Oct 04, 15:45" },
    ],
  },
  {
    id: "ENT-104",
    name: "Assam Gold Tea Co.",
    sector: "Beverages & Agrifoods",
    lin: "LIN-2018-AS-0012",
    gtinPrefix: "8901033XXXX",
    status: "VIOLATION",
    totalScans: 37,
    complianceRate: 81.1,
    activeViolationsCount: 4,
    rule_violation: "Rule 6(1)(a) - Country of Origin Missing on Blend",
    address: "Tea Auction Road, Dispur, Guwahati 781005",
    signatory: "Pranab Phookan (General Manager)",
    dockets: [
      { id: "INS-8904", product: "Premium Tea Leaves 500g", status: "VIOLATION", rule_violation: "Rule 6(1)(a) - Country of Origin Missing", timestamp: "Oct 13, 16:30" },
      { id: "INS-8851", product: "Orthodox Leaf Tea 250g", status: "VIOLATION", rule_violation: "Rule 6(1)(a) - Country of Origin Missing", timestamp: "Oct 07, 12:15" },
    ],
  },
  {
    id: "ENT-105",
    name: "Aqua Pure Beverages",
    sector: "Beverages & Dairy",
    lin: "LIN-2020-TN-0433",
    gtinPrefix: "8901034XXXX",
    status: "COMPLIANT",
    totalScans: 64,
    complianceRate: 100.0,
    activeViolationsCount: 0,
    address: "SIPCOT Industrial Complex, Sriperumbudur, Tamil Nadu 602105",
    signatory: "K. R. Sundaram (Director - Operations)",
    dockets: [
      { id: "INS-8905", product: "Mineral Water 1L", status: "COMPLIANT", timestamp: "Oct 13, 14:00" },
      { id: "INS-8848", product: "Sparkling Spring Water 500ml", status: "COMPLIANT", timestamp: "Oct 06, 17:30" },
    ],
  },
  {
    id: "ENT-106",
    name: "TechPro Electronics",
    sector: "Electronics & Hardware",
    lin: "LIN-2023-HR-0899",
    gtinPrefix: "8901035XXXX",
    status: "COMPLIANT",
    totalScans: 18,
    complianceRate: 100.0,
    activeViolationsCount: 0,
    address: "Udyog Vihar Phase IV, Gurugram, Haryana 122015",
    signatory: "Neeraj Arora (Authorised Signatory)",
    dockets: [
      { id: "INS-8906", product: "Smart Wireless Earbuds v2", status: "COMPLIANT", timestamp: "Oct 13, 11:15" },
    ],
  },
  {
    id: "ENT-107",
    name: "Glow & Charm Cosmetics",
    sector: "Cosmetics & Personal Care",
    lin: "LIN-2022-DL-0556",
    gtinPrefix: "8901036XXXX",
    status: "VIOLATION",
    totalScans: 31,
    complianceRate: 83.8,
    activeViolationsCount: 2,
    rule_violation: "Rule 6(1)(ac) - Missing Customer Care Contact",
    address: "Naraina Industrial Area Phase I, New Delhi 110028",
    signatory: "Meera Kapoor (Director)",
    dockets: [
      { id: "INS-8907", product: "Hydrating Facial Cream 50g", status: "VIOLATION", rule_violation: "Rule 6(1)(ac) - Missing Customer Care", timestamp: "Oct 12, 17:40" },
    ],
  },
]

interface EntitiesViewProps {
  searchQuery?: string
  onToast: (msg: string) => void
}

export default function EntitiesView({
  searchQuery = "",
  onToast,
}: EntitiesViewProps): React.JSX.Element {
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(ENTITIES_DATA[0])
  const [sectorFilter, setSectorFilter] = useState<string>("ALL")
  const [localSearch, setLocalSearch] = useState<string>(searchQuery)

  const effectiveSearch = localSearch || searchQuery

  const filteredEntities = ENTITIES_DATA.filter((item) => {
    if (sectorFilter !== "ALL" && !item.sector.includes(sectorFilter)) return false

    if (effectiveSearch.trim()) {
      const q = effectiveSearch.toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchLin = item.lin.toLowerCase().includes(q)
      const matchGtin = item.gtinPrefix.toLowerCase().includes(q)
      const matchSector = item.sector.toLowerCase().includes(q)
      if (!matchName && !matchLin && !matchGtin && !matchSector) return false
    }

    return true
  })

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Entity Name,Sector,LIN,GTIN Prefix,Status,Total Scans,Compliance Rate\n" +
      filteredEntities
        .map(
          (e) =>
            `"${e.name}","${e.sector}",${e.lin},${e.gtinPrefix},${e.status},${e.totalScans},${e.complianceRate}%`
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "regulated_entities_dossier.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onToast("Corporate Registry Dossier exported as CSV")
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] transition-colors duration-200 relative">
      {/* Main Scrollable Area */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto min-w-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-[#E3E1F0] dark:border-[#26223A]">
          <div>
            <h1 className="text-2xl sm:text-[30px] font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight leading-tight">
              Regulated Entities
            </h1>
            <p className="text-sm text-[#6E6E80] dark:text-[#A29DB8] mt-1">
              Registered manufacturers, packers, and importers under Packaged Commodities Rules, 2011
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossiers</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards Strip (Refined & Balanced) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Registered Entities */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#7C6FE0] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Registered Entities
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                428
              </span>
              <span className="text-xs font-bold text-[#7C6FE0]">
                Rule 27 Cadre
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Active across 4 national zones
            </div>
          </div>

          {/* Card 2: Full Compliance Rate */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#8FD9B6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Fully Compliant
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                386
              </span>
              <span className="text-xs font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                90.2% standing
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Zero non-conformance citations
            </div>
          </div>

          {/* Card 3: Active Infractions */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F3A6A6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Active Infractions
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                42
              </span>
              <span className="text-xs font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                Non-compliant
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Primary: Rule 6(1)(e) & 6(1)(ac)
            </div>
          </div>

          {/* Card 4: Formal Notices */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F5D08A] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Compounding Notices
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#8A6416] dark:text-[#F5D08A]">
                14
              </span>
              <span className="text-xs font-bold text-[#8A6416] dark:text-[#F5D08A]">
                Section 48
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              15-day compliance rectitude SLA
            </div>
          </div>
        </div>

        {/* Filter Strip with Search & Sector Chips */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          {/* Sector Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "ALL", label: "All Sectors" },
              { id: "Food", label: "Food & Grains" },
              { id: "Snacks", label: "Snacks & Sweets" },
              { id: "Cosmetics", label: "Cosmetics" },
              { id: "Beverages", label: "Beverages" },
              { id: "Electronics", label: "Electronics" },
            ].map((chip) => {
              const isActive = sectorFilter === chip.id
              return (
                <button
                  key={chip.id}
                  onClick={() => setSectorFilter(chip.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#7C6FE0] text-white shadow-[0_2px_8px_rgba(124,111,224,0.3)] font-bold"
                      : "bg-[#FDFDFF] dark:bg-[#161424] text-[#6E6E80] dark:text-[#A29DB8] border border-[#E3E1F0] dark:border-[#26223A] hover:text-[#3A3A45] dark:hover:text-[#ECE9F6] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
                  }`}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E80] dark:text-[#A29DB8] pointer-events-none" />
            <input
              type="text"
              placeholder="Search company, LIN, GTIN..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs text-[#3A3A45] dark:text-[#ECE9F6] placeholder-[#6E6E80] dark:placeholder-[#A29DB8] focus:outline-none focus:border-[#7C6FE0] shadow-xs"
            />
          </div>
        </div>

        {/* Regulated Entities Ledger Table */}
        <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2F1F9] dark:bg-[#1C192C] text-[#6E6E80] dark:text-[#A29DB8] font-bold border-b border-[#E3E1F0] dark:border-[#26223A]">
                  <th className="py-3 px-4 font-semibold">Corporate Entity & Sector</th>
                  <th className="py-3 px-4 font-semibold">Registration / LIN</th>
                  <th className="py-3 px-4 font-semibold">GTIN Prefix</th>
                  <th className="py-3 px-4 font-semibold">Statutory Status</th>
                  <th className="py-3 px-4 font-semibold">Audited Samples</th>
                  <th className="py-3 px-4 font-semibold text-right">Compliance Rate</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E1F0] dark:divide-[#26223A]">
                {filteredEntities.map((item) => {
                  const isSelected = selectedEntity?.id === item.id
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEntity(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#EDEBFB] dark:bg-[#221C38]"
                          : "hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6]">{item.name}</div>
                        <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                          {item.sector}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#3A3A45] dark:text-[#ECE9F6]">
                        {item.lin}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#6E6E80] dark:text-[#A29DB8]">
                        {item.gtinPrefix}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.status === "COMPLIANT" ? (
                          <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8FD9B6]/20 text-[#2F7A55] dark:bg-[#0E2319] dark:text-[#8FD9B6] border border-[#8FD9B6]/40 dark:border-[#163A29]">
                            CERTIFIED COMPLIANT
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3A6A6]/20 text-[#9B3B3B] dark:bg-[#261212] dark:text-[#F3A6A6] border border-[#F3A6A6]/40 dark:border-[#3D1B1B]">
                            {item.activeViolationsCount} INFRACTIONS
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#3A3A45] dark:text-[#ECE9F6] font-medium">
                        {item.totalScans} Samples
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#E3E1F0] dark:bg-[#26223A] rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                item.complianceRate >= 90
                                  ? "bg-[#8FD9B6]"
                                  : item.complianceRate >= 80
                                  ? "bg-[#F5D08A]"
                                  : "bg-[#F3A6A6]"
                              }`}
                              style={{ width: `${item.complianceRate}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                            {item.complianceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[11px] font-bold text-[#7C6FE0] hover:underline flex items-center justify-end gap-0.5">
                          <span>Dossier</span>
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

        {filteredEntities.length === 0 && (
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-12 text-center my-6">
            <AlertCircle className="w-10 h-10 text-[#6E6E80] dark:text-[#A29DB8] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
              No matching regulated entities found
            </h3>
            <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-1 max-w-sm mx-auto">
              No entity records matched your current query or sector filter. Try adjusting your search.
            </p>
            <button
              onClick={() => {
                setSectorFilter("ALL")
                setLocalSearch("")
              }}
              className="mt-4 px-4 py-2 bg-[#7C6FE0] text-white rounded-lg text-xs font-semibold hover:bg-[#6C5FD1] shadow-sm cursor-pointer"
            >
              Reset Sector Filter
            </button>
          </div>
        )}
      </div>

      {/* Right-Side Corporate Dossier Detail Drawer */}
      {selectedEntity && (
        <aside className="w-96 bg-[#FBFAFE] dark:bg-[#161424] border-l border-[#E3E1F0] dark:border-[#26223A] p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto shadow-sm">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#7C6FE0]" />
                <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">Corporate Dossier</h3>
              </div>
              <div className="flex items-center gap-1 text-[#6E6E80] dark:text-[#A29DB8]">
                <button
                  onClick={() => onToast(`Copied ${selectedEntity.name} metadata`)}
                  className="p-1 hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-md transition-colors cursor-pointer"
                  title="Copy details"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="p-1 hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-md transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Finding Card */}
            {selectedEntity.status === "VIOLATION" ? (
              <div className="bg-[#F3A6A6]/10 dark:bg-[#261212] border border-[#F3A6A6]/40 dark:border-[#3D1B1B] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#9B3B3B] dark:text-[#F3A6A6]" />
                  <span className="font-bold text-xs text-[#9B3B3B] dark:text-[#F3A6A6] uppercase tracking-wider">
                    Outstanding Infractions ({selectedEntity.activeViolationsCount})
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#9B3B3B] dark:text-[#F3A6A6] pt-1">
                  {selectedEntity.rule_violation || "Rule 6(1)(e) - Missing Retail Price"}
                </p>
                <p className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] leading-relaxed">
                  Compounding proceedings initiated under Section 48. Formal notice dispatch issued.
                </p>
              </div>
            ) : (
              <div className="bg-[#8FD9B6]/10 dark:bg-[#0E2319] border border-[#8FD9B6]/40 dark:border-[#163A29] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2F7A55] dark:text-[#8FD9B6]" />
                  <span className="font-bold text-xs text-[#2F7A55] dark:text-[#8FD9B6] uppercase tracking-wider">
                    Statutory Standing: Compliant
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#2F7A55] dark:text-[#8FD9B6] pt-1">
                  All Mandatory Declarations Verified
                </p>
                <p className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] leading-relaxed">
                  Zero non-conformance citations recorded across {selectedEntity.totalScans} physical samples.
                </p>
              </div>
            )}

            {/* Corporate Metadata Group */}
            <div>
              <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider mb-3">
                Corporate Registration & Licensing
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">Registered Legal Name</div>
                  <div className="font-bold text-sm text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                    {selectedEntity.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">LIN / Registration</div>
                    <div className="font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                      {selectedEntity.lin}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">Primary GTIN Prefix</div>
                    <div className="font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                      {selectedEntity.gtinPrefix}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">Registered Premises Address</div>
                  <div className="text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5 leading-relaxed">
                    {selectedEntity.address}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">Designated Compliance Officer</div>
                  <div className="font-medium text-[#3A3A45] dark:text-[#ECE9F6] mt-0.5">
                    {selectedEntity.signatory}
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Commodity Inspection Dockets */}
            <div>
              <div className="text-[10px] font-bold text-[#6E6E80] dark:text-[#A29DB8] uppercase tracking-wider mb-2.5">
                Associated Packaged Commodities
              </div>
              <div className="space-y-2 text-xs">
                {selectedEntity.dockets.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg flex items-start justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#7C6FE0]">{d.id}</span>
                        <span className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8]">{d.timestamp}</span>
                      </div>
                      <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6] mt-1">{d.product}</div>
                      {d.rule_violation && (
                        <div className="text-[10px] text-[#9B3B3B] dark:text-[#F3A6A6] font-semibold mt-0.5">
                          {d.rule_violation}
                        </div>
                      )}
                    </div>
                    {d.status === "VIOLATION" ? (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3A6A6]/20 text-[#9B3B3B] dark:bg-[#261212] dark:text-[#F3A6A6] shrink-0">
                        Violation
                      </span>
                    ) : d.status === "REVIEW" ? (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5D08A]/20 text-[#8A6416] dark:bg-[#261B0A] dark:text-[#F5D08A] shrink-0">
                        Review
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8FD9B6]/20 text-[#2F7A55] dark:bg-[#0E2319] dark:text-[#8FD9B6] shrink-0">
                        Compliant
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-[#E3E1F0] dark:border-[#26223A] space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToast(`Full Dossier exported for ${selectedEntity.name}`)}
                className="flex-1 py-2 px-3 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
              >
                Export Dossier
              </button>
              {selectedEntity.status === "VIOLATION" ? (
                <button
                  onClick={() => onToast(`Rule 32 Formal Notice issued to ${selectedEntity.name}`)}
                  className="flex-1 py-2 px-3 bg-[#F3A6A6] text-[#9B3B3B] hover:bg-[#ee8f8f] text-xs font-bold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
                >
                  Issue Notice
                </button>
              ) : (
                <button
                  onClick={() => onToast(`Routine audit scheduled for ${selectedEntity.name}`)}
                  className="flex-1 py-2 px-3 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
                >
                  Schedule Audit
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#6E6E80] dark:text-[#A29DB8] font-mono pt-1">
              <span>RULE 27 REGISTER</span>
              <button
                onClick={() => onToast("Registry synchronized with Director of Legal Metrology")}
                className="hover:text-[#7C6FE0] inline-flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Statutory Authority</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
