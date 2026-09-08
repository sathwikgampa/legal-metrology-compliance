import React from "react"
import { Scale, X, MoreHorizontal, FileText, CheckCircle2, AlertTriangle, AlertCircle, ExternalLink } from "lucide-react"

export interface DocketItem {
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

interface DocketDetailSplitPaneProps {
  docket: DocketItem | null
  onClose: () => void
  onToast: (msg: string) => void
}

export default function DocketDetailSplitPane({
  docket,
  onClose,
  onToast,
}: DocketDetailSplitPaneProps): React.JSX.Element | null {
  if (!docket) return null

  return (
    /* Side Drawer Panel with Refined Soft Palette & Dark Mode Support */
    <aside className="w-96 bg-[#FBFAFE] dark:bg-[#1A1926] border-l border-[#E3E1F0] dark:border-[#2E2C42] p-5 flex flex-col justify-between shrink-0 shadow-sm transition-colors duration-200 overflow-y-auto">
      <div className="space-y-5">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#2E2C42] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#3A3A45] dark:text-[#ECEBF5]">Compliance Docket</span>
            <span className="font-mono text-xs text-[#6E6E80] dark:text-[#A6A4B8] bg-[#F2F1F9] dark:bg-[#1F1E2E] px-2 py-0.5 rounded-md border border-[#E3E1F0] dark:border-[#2E2C42] font-bold">
              {docket.id}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#6E6E80] dark:text-[#A6A4B8]">
            <button
              onClick={() => onToast(`Copied Docket ${docket.id} details`)}
              className="p-1 hover:text-[#7C6FE0] dark:hover:text-[#9589EC] hover:bg-[#F2F1F9] dark:hover:bg-[#222132] rounded-md transition-colors cursor-pointer"
              title="Copy details"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-[#7C6FE0] dark:hover:text-[#9589EC] hover:bg-[#F2F1F9] dark:hover:bg-[#222132] rounded-md transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Soft Colored Status Alert Card */}
        {docket.status === "VIOLATION" ? (
          <div className="border border-[#F3A6A6] bg-[#F3A6A6]/15 dark:bg-[#F3A6A6]/20 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-[#F3A6A6] text-[#9B3B3B] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Non-Compliant
              </span>
              <span className="font-mono text-xs font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                Rule 32 Action
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-[#9B3B3B] dark:text-[#F3A6A6]">
                Statutory Violation Detected
              </div>
              <div className="text-xs font-semibold text-[#9B3B3B] dark:text-[#F3A6A6] mt-0.5">
                {docket.rule_violation || "Rule 6(1)(e) - Missing MRP"}
              </div>
            </div>
            <p className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8] leading-relaxed">
              Declaration omitted under Section 18 of Legal Metrology Act, 2009. Evidence recorded.
            </p>
          </div>
        ) : docket.status === "REVIEW" ? (
          <div className="border border-[#F5D08A] bg-[#F5D08A]/15 dark:bg-[#F5D08A]/20 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-[#F5D08A] text-[#8A6416] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pending Review
              </span>
              <span className="font-mono text-xs font-bold text-[#8A6416] dark:text-[#F5D08A]">
                {docket.confidence}% Score
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-[#8A6416] dark:text-[#F5D08A]">
                Physical Audit Requisitioned
              </div>
              <div className="text-xs font-semibold text-[#8A6416] dark:text-[#F5D08A] mt-0.5">
                {docket.rule_violation || "Rule 6(1)(c) - Net Quantity Glare"}
              </div>
            </div>
            <p className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8] leading-relaxed">
              Optical character recognition below verification threshold. Field inspector sign-off required.
            </p>
          </div>
        ) : (
          <div className="border border-[#8FD9B6] bg-[#8FD9B6]/15 dark:bg-[#8FD9B6]/20 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-[#8FD9B6] text-[#2F7A55] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Certified
              </span>
              <span className="font-mono text-xs font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                100% Pass
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-[#2F7A55] dark:text-[#8FD9B6]">
                Statutory Compliance Verified
              </div>
              <div className="text-xs font-medium text-[#2F7A55] dark:text-[#8FD9B6] mt-0.5">
                All Rule 6 Declarations Approved
              </div>
            </div>
            <p className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8] leading-relaxed">
              Mandatory declarations (Name, Net Quantity, MRP, Date, Customer Care) verified compliant.
            </p>
          </div>
        )}

        {/* Commodity / Instrument Details */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A6A4B8] uppercase tracking-wider">
            Commodity Specifications
          </div>
          <div className="bg-[#F2F1F9] dark:bg-[#1F1E2E] border border-[#E3E1F0] dark:border-[#2E2C42] rounded-lg p-3.5 space-y-2.5 text-xs">
            <div>
              <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">Manufacturer / Regulated Entity</div>
              <div className="font-bold text-[#3A3A45] dark:text-[#ECEBF5] mt-0.5">
                {docket.manufacturer}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">Product Title</div>
              <div className="font-semibold text-[#3A3A45] dark:text-[#ECEBF5] mt-0.5">
                {docket.product}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3E1F0] dark:border-[#2E2C42]">
              <div>
                <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">GTIN / Barcode</div>
                <div className="font-mono font-bold text-[#3A3A45] dark:text-[#ECEBF5] mt-0.5">
                  {docket.gtin}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">Sector</div>
                <div className="text-[#3A3A45] dark:text-[#ECEBF5] font-medium mt-0.5">
                  {docket.category}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3E1F0] dark:border-[#2E2C42]">
              <div>
                <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">Audit Date</div>
                <div className="font-bold text-[#3A3A45] dark:text-[#ECEBF5] mt-0.5">
                  {docket.timestamp}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#6E6E80] dark:text-[#A6A4B8]">OCR Score</div>
                <div className="font-mono font-bold text-[#7C6FE0] dark:text-[#9589EC] mt-0.5">
                  {docket.confidence}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons with soft indigo and salmon tones */}
      <div className="pt-4 border-t border-[#E3E1F0] dark:border-[#2E2C42] space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast(`Analysis override recorded for ${docket.id}`)}
            className="flex-1 py-2 px-3 bg-[#FDFDFF] dark:bg-[#1F1E2E] border border-[#E3E1F0] dark:border-[#2E2C42] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2744] hover:text-[#7C6FE0] dark:hover:text-[#9589EC] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECEBF5] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
          >
            Override Check
          </button>
          {docket.status === "VIOLATION" ? (
            <button
              onClick={() => onToast(`Formal Notice Rule 32 generated for ${docket.manufacturer}`)}
              className="flex-1 py-2 px-3 bg-[#F3A6A6] hover:bg-[#ea9393] text-[#9B3B3B] text-xs font-bold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
            >
              Issue Notice
            </button>
          ) : (
            <button
              onClick={() => onToast(`Certificate approved for ${docket.id}`)}
              className="flex-1 py-2 px-3 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-[0_4px_12px_rgba(124,111,224,0.25)]"
            >
              Approve Record
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
