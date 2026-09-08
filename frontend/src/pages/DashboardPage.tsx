import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, Download, Plus, AlertCircle, X, MoreHorizontal, HelpCircle } from "lucide-react"

interface DocketItem {
  id: string
  timestamp: string
  manufacturer: string
  product: string
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
    status: "COMPLIANT",
    gtin: "008901031",
    confidence: 98.4,
  },
  {
    id: "INS-8903",
    timestamp: "Oct 14, 09:15",
    manufacturer: "Botanica Care India",
    product: "Radiance Face Serum 30ml",
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
    status: "COMPLIANT",
    gtin: "008901034",
    confidence: 99.1,
  },
]

export default function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [selectedDocket, setSelectedDocket] = useState<DocketItem | null>(DOCKET_ITEMS[0])
  const [activeViewFilter, setActiveViewFilter] = useState<string>("all")

  const filteredItems = DOCKET_ITEMS.filter((item) => {
    if (activeViewFilter === "violations" && item.status !== "VIOLATION") return false
    if (activeViewFilter === "review" && item.status !== "REVIEW") return false
    return true
  })

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Docket ID,Timestamp,Manufacturer,Product,Status,GTIN\n" +
      DOCKET_ITEMS.map(
        (i) => `${i.id},${i.timestamp},"${i.manufacturer}","${i.product}",${i.status},${i.gtin}`
      ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "inspections_ledger.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50">
      {/* Main Ledger Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
        {/* Title Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inspections Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time telemetry and compliance audit logs.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveViewFilter(activeViewFilter === "all" ? "violations" : "all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                activeViewFilter !== "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => navigate("/inspections/new")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Run Manual Scan</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Scans */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">Total Scans (24h)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">1,284</span>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">
                +12.5%
              </span>
            </div>
          </div>

          {/* Card 2: Compliance Rate */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">Compliance Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">84.2%</span>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">
                +2.1%
              </span>
            </div>
          </div>

          {/* Card 3: Flagged Violations */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">Flagged Violations</div>
            <div className="text-2xl font-bold text-rose-600 tracking-tight">12</div>
          </div>

          {/* Card 4: Pending Review */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-medium text-slate-500">Pending Review</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">8</div>
          </div>
        </div>

        {/* Inspections Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4" scope="col">DOCKET ID</th>
                  <th className="py-3 px-4" scope="col">TIMESTAMP</th>
                  <th className="py-3 px-4" scope="col">ENTITY / PRODUCT</th>
                  <th className="py-3 px-4" scope="col">STATUS</th>
                  <th className="py-3 px-4 text-right" scope="col">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => {
                  const isSelected = selectedDocket?.id === item.id
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedDocket(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-slate-100/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.manufacturer}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.product}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.status === "VIOLATION" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Violation
                          </span>
                        )}
                        {item.status === "COMPLIANT" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Compliant
                          </span>
                        )}
                        {item.status === "REVIEW" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Review
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-600">
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
        <div className="w-96 bg-white border-l border-slate-200 p-5 flex flex-col justify-between shrink-0 shadow-lg relative z-20">
          <div className="space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Docket Details</h3>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {selectedDocket.id}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-600 rounded transition-colors cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDocket(null)}
                  className="p-1 hover:text-slate-600 rounded transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Violation Alert Banner */}
            {selectedDocket.status === "VIOLATION" ? (
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-rose-950">
                    Statutory Violation Detected
                  </div>
                  <div className="text-xs text-rose-700 font-semibold mt-0.5">
                    {selectedDocket.rule_violation || "Rule 6(1)(e) - Missing MRP"}
                  </div>
                </div>
              </div>
            ) : selectedDocket.status === "REVIEW" ? (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-amber-950">
                    Officer Verification Needed
                  </div>
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">
                    {selectedDocket.rule_violation || "Low OCR confidence on net quantity"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                <div>
                  <div className="font-bold text-xs text-emerald-950">
                    Statutory Compliance Verified
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">
                    All mandatory Rule 6 declarations verified cleanly.
                  </div>
                </div>
              </div>
            )}

            {/* ENTITY INFORMATION */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                Entity Information
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Manufacturer</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDocket.manufacturer}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Product</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDocket.product}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">GTIN / Barcode</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {selectedDocket.gtin}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Inspection Time</div>
                  <div className="text-slate-600 font-medium mt-0.5">
                    {selectedDocket.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => navigate(`/inspections/${selectedDocket.id}`)}
              className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer text-center"
            >
              Override Analysis
            </button>
            <button
              onClick={() => navigate(`/inspections/${selectedDocket.id}/review`)}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Issue Formal Notice
            </button>
          </div>

          {/* Floating ? Help Icon */}
          <button className="absolute bottom-4 right-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs shadow-md hover:bg-slate-800 cursor-pointer">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
