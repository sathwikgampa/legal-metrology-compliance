import React, { useState } from "react"
import { Building2, Search, Download, AlertCircle, X, MoreHorizontal, HelpCircle, FileSpreadsheet, Shield } from "lucide-react"

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
    /* WARM NEUTRAL / AGED PAPER UNDERTONE (#F7F5F0 Light / #181614 Dark) */
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-[#F7F5F0] dark:bg-[#181614] text-[#2D2A26] dark:text-[#ECE6DF] transition-colors duration-200">
      {/* Main Entities Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
        {/* Title Header with Gazette Context */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 border-b border-[#E5E0D6] dark:border-[#38332E] pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#7A756D] dark:text-[#A8A196]">
              STATUTORY REGISTRY • RULE 27 CADRE
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2D2A26] dark:text-[#FAF8F5] mt-0.5">
              Regulated Entities & Corporate Dossiers
            </h1>
            <p className="text-xs text-[#7A756D] dark:text-[#A8A196] mt-0.5 font-serif">
              Registered corporate packers, manufacturers, and importers under Packaged Commodities Rules 2011.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FCFBF9] dark:bg-[#211E1B] border border-[#DCD5C8] dark:border-[#423D37] hover:bg-[#F2EFE8] dark:hover:bg-[#2B2723] text-[#2D2A26] dark:text-[#ECE6DF] text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossiers</span>
            </button>
          </div>
        </div>

        {/* BESPOKE LAYOUT: COMPACT HORIZONTAL TELEMETRY STRIP (REPLACES 4-BOX ROW) */}
        <div className="bg-[#FCFBF9] dark:bg-[#211E1B] border border-[#E5E0D6] dark:border-[#38332E] rounded-md p-3 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Integrated Search & Sector Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A756D] dark:text-[#A8A196] pointer-events-none" />
              <input
                type="text"
                placeholder="Search legal name, LIN, GTIN..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] dark:bg-[#181614] border border-[#DCD5C8] dark:border-[#423D37] rounded-md text-xs text-[#2D2A26] dark:text-[#ECE6DF] placeholder-[#A8A196] focus:outline-none focus:border-[#7A756D]"
              />
            </div>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="p-1.5 bg-[#FFFFFF] dark:bg-[#181614] border border-[#DCD5C8] dark:border-[#423D37] rounded-md text-xs font-medium text-[#2D2A26] dark:text-[#ECE6DF] focus:outline-none"
            >
              <option value="ALL">All Sectors</option>
              <option value="Food">Food & Grains</option>
              <option value="Snacks">Snacks & Confectionery</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Beverages">Beverages</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          {/* Compact Telemetry Metrics in a Single Horizontal Line */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#7A756D] dark:text-[#A8A196] border-t md:border-t-0 md:border-l border-[#E5E0D6] dark:border-[#38332E] pt-2 md:pt-0 md:pl-4">
            <div>
              <span className="text-[#2D2A26] dark:text-[#FAF8F5] font-bold">428</span> Registered
            </div>
            <span className="text-[#DCD5C8] dark:text-[#423D37]">•</span>
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">386</span> Compliant (90.2%)
            </div>
            <span className="text-[#DCD5C8] dark:text-[#423D37]">•</span>
            <div>
              <span className="text-rose-700 dark:text-rose-400 font-bold">42</span> Infractions
            </div>
            <span className="text-[#DCD5C8] dark:text-[#423D37]">•</span>
            <div>
              <span className="text-[#2D2A26] dark:text-[#FAF8F5] font-bold">14</span> Formal Notices
            </div>
          </div>
        </div>

        {/* FULL-WIDTH REGULATED ENTITIES TABLE (SPACIOUS / EDITORIAL DENSITY) */}
        <div className="bg-[#FCFBF9] dark:bg-[#211E1B] border border-[#E5E0D6] dark:border-[#38332E] rounded-md overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E0D6] dark:border-[#38332E] bg-[#F2EFE8]/70 dark:bg-[#2B2723]/60 text-[10px] font-mono font-bold text-[#7A756D] dark:text-[#A8A196] uppercase tracking-wider">
                  <th className="py-3 px-5" scope="col">LEGAL ENTITY NAME & SECTOR</th>
                  <th className="py-3 px-5" scope="col">REGISTRATION / LIN</th>
                  <th className="py-3 px-5" scope="col">GTIN PREFIX</th>
                  <th className="py-3 px-5" scope="col">STATUTORY STANDING</th>
                  <th className="py-3 px-5" scope="col">AUDITED LOTS</th>
                  <th className="py-3 px-5 text-right" scope="col">COMPLIANCE RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE4] dark:divide-[#2E2A26] text-xs">
                {filteredEntities.map((item) => {
                  const isSelected = selectedEntity?.id === item.id
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEntity(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#EFECE4] dark:bg-[#2B2723]"
                          : "hover:bg-[#F5F2EA] dark:hover:bg-[#26221F]"
                      }`}
                    >
                      {/* Generous row breathing room (py-4 px-5) */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#2D2A26] dark:text-[#FAF8F5]">{item.name}</div>
                        <div className="text-[11px] text-[#7A756D] dark:text-[#A8A196] mt-0.5">{item.sector}</div>
                      </td>
                      <td className="py-4 px-5 font-mono text-[#4A453E] dark:text-[#CEC6BA]">
                        {item.lin}
                      </td>
                      <td className="py-4 px-5 font-mono text-[#7A756D] dark:text-[#A8A196]">
                        {item.gtinPrefix}
                      </td>
                      <td className="py-4 px-5">
                        {item.status === "VIOLATION" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0"></span>
                            Infractions ({item.activeViolationsCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0"></span>
                            Compliant
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-medium text-[#4A453E] dark:text-[#CEC6BA]">
                        {item.totalScans} Samples
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-medium text-[#2D2A26] dark:text-[#FAF8F5]">
                        {item.complianceRate}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE WARM CORPORATE DOSSIER SPLIT-PANE */}
      {selectedEntity && (
        <aside className="w-96 bg-[#FCFBF9] dark:bg-[#211E1B] border-l border-[#E5E0D6] dark:border-[#38332E] p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto">
          <div className="space-y-5">
            {/* Split-Pane Header */}
            <div className="flex items-center justify-between border-b border-[#E5E0D6] dark:border-[#38332E] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#7A756D] dark:text-[#A8A196]" />
                <h3 className="text-xs font-bold text-[#2D2A26] dark:text-[#FAF8F5] uppercase tracking-wider">
                  Corporate Dossier Record
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[#7A756D]">
                <button
                  onClick={() => onToast(`Copied Entity ${selectedEntity.lin} dossier metadata`)}
                  className="p-1 hover:text-[#2D2A26] dark:hover:text-white rounded transition-colors cursor-pointer"
                  title="Copy metadata"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="p-1 hover:text-[#2D2A26] dark:hover:text-white rounded transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Finding Certificate Treatment for Entity */}
            {selectedEntity.status === "VIOLATION" ? (
              <div className="border border-rose-600 dark:border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-rose-800 dark:text-rose-300 uppercase">
                  OUTSTANDING STATUTORY INFRACTIONS ({selectedEntity.activeViolationsCount})
                </div>
                <div className="font-serif font-bold text-xs text-rose-950 dark:text-rose-200">
                  {selectedEntity.rule_violation || "Rule 6(1)(e) - Missing MRP across multiple commodity lines"}
                </div>
                <p className="text-[11px] text-rose-900/80 dark:text-rose-300/80 leading-relaxed font-serif">
                  Compounding proceedings initiated under Section 48. Formal notice dispatch issued to registered office.
                </p>
              </div>
            ) : (
              <div className="border border-emerald-600 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                  STATUTORY STANDING: COMPLIANT
                </div>
                <div className="font-serif font-bold text-xs text-emerald-950 dark:text-emerald-200">
                  All Mandatory Rule 6 Declarations Clear
                </div>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed font-serif">
                  Zero non-conformance citations recorded across {selectedEntity.totalScans} physical samples.
                </p>
              </div>
            )}

            {/* Corporate Registration Details */}
            <div>
              <div className="text-[10px] font-mono font-bold text-[#7A756D] dark:text-[#A8A196] tracking-wider uppercase mb-2.5">
                CORPORATE REGISTRATION & LICENSING
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="text-[10px] text-[#7A756D] font-medium">Registered Legal Entity</div>
                  <div className="font-semibold text-[#2D2A26] dark:text-[#FAF8F5] mt-0.5">
                    {selectedEntity.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-[#7A756D] font-medium">LIN / Registration</div>
                    <div className="font-mono text-[#2D2A26] dark:text-[#FAF8F5] mt-0.5">
                      {selectedEntity.lin}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7A756D] font-medium">Primary GTIN Prefix</div>
                    <div className="font-mono text-[#2D2A26] dark:text-[#FAF8F5] mt-0.5">
                      {selectedEntity.gtinPrefix}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#7A756D] font-medium">Registered Factory Premises</div>
                  <div className="text-[#4A453E] dark:text-[#CEC6BA] mt-0.5 font-serif leading-relaxed">
                    {selectedEntity.address}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#7A756D] font-medium">Designated Compliance Director</div>
                  <div className="text-[#2D2A26] dark:text-[#FAF8F5] font-medium mt-0.5">
                    {selectedEntity.signatory}
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Commodity Inspection Dockets */}
            <div>
              <div className="text-[10px] font-mono font-bold text-[#7A756D] dark:text-[#A8A196] tracking-wider uppercase mb-2">
                ASSOCIATED PACKAGED COMMODITIES
              </div>
              <div className="space-y-2 text-xs">
                {selectedEntity.dockets.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 bg-[#F7F5F0] dark:bg-[#181614] border border-[#E5E0D6] dark:border-[#38332E] rounded flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#2D2A26] dark:text-[#FAF8F5]">{d.id}</span>
                        <span className="text-[10px] text-[#7A756D]">{d.timestamp}</span>
                      </div>
                      <div className="text-[#2D2A26] dark:text-[#FAF8F5] font-medium mt-0.5">{d.product}</div>
                      {d.rule_violation && (
                        <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold mt-0.5">
                          {d.rule_violation}
                        </div>
                      )}
                    </div>
                    {d.status === "VIOLATION" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400"></span>
                        Violation
                      </span>
                    ) : d.status === "REVIEW" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                        Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                        Compliant
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-[#E5E0D6] dark:border-[#38332E] space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToast(`Full Dossier exported for ${selectedEntity.name}`)}
                className="flex-1 py-2 px-3 bg-[#FCFBF9] dark:bg-[#211E1B] border border-[#DCD5C8] dark:border-[#423D37] hover:bg-[#F2EFE8] dark:hover:bg-[#2B2723] text-[#2D2A26] dark:text-[#ECE6DF] text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
              >
                Export Dossier
              </button>
              {selectedEntity.status === "VIOLATION" ? (
                <button
                  onClick={() => onToast(`Rule 32 Formal Notice issued to ${selectedEntity.name}`)}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
                >
                  Issue Formal Notice
                </button>
              ) : (
                <button
                  onClick={() => onToast(`Inspection scheduled for ${selectedEntity.name}`)}
                  className="flex-1 py-2 px-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
                >
                  Schedule Audit
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#7A756D] font-mono pt-1">
              <span>RULE 27 REGISTER</span>
              <button
                onClick={() => onToast("Registry synchronized with Director of Legal Metrology")}
                className="text-[#7A756D] hover:text-[#2D2A26] dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
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
