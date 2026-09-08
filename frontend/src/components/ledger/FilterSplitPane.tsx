import React from "react"
import { Filter, X, RotateCcw } from "lucide-react"

export interface FilterCriteria {
  status: string
  category: string
  ruleViolation: string
  minConfidence: number
}

interface FilterSplitPaneProps {
  filters: FilterCriteria
  onFilterChange: (filters: FilterCriteria) => void
  onReset: () => void
  onClose: () => void
  onApply: () => void
}

const CATEGORY_OPTIONS = [
  "ALL",
  "Food & Groceries",
  "Cosmetics",
  "Electronics",
  "Beverages",
]

const RULE_OPTIONS = [
  { id: "ALL", label: "All Rules" },
  { id: "Rule 6(1)(e)", label: "Rule 6(1)(e) - Missing MRP / Retail Price" },
  { id: "Rule 6(1)(a)", label: "Rule 6(1)(a) - Country of Origin Missing" },
  { id: "Rule 6(1)(ac)", label: "Rule 6(1)(ac) - Missing Customer Care Contact" },
  { id: "Rule 6(1)(c)", label: "Rule 6(1)(c) - Net Quantity Glare / Ambiguity" },
]

export default function FilterSplitPane({
  filters,
  onFilterChange,
  onReset,
  onClose,
  onApply,
}: FilterSplitPaneProps): React.JSX.Element {
  return (
    <aside className="w-96 bg-[#FBFAFE] dark:bg-[#1A1926] border-l border-[#E3E1F0] dark:border-[#2E2C42] p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#2E2C42] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7C6FE0] dark:text-[#9589EC]" />
            <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECEBF5]">Filter Compliance Items</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6E6E80] dark:text-[#A6A4B8] hover:text-[#7C6FE0] dark:hover:text-[#9589EC] hover:bg-[#F2F1F9] dark:hover:bg-[#222132] rounded-md transition-colors cursor-pointer"
            title="Close filter panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Section 1: Compliance Status */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A6A4B8] uppercase tracking-wider block">
            Status Filter
          </label>
          <div className="space-y-1.5">
            {[
              { id: "ALL", label: "All Items", badgeColor: "bg-[#F2F1F9] dark:bg-[#1F1E2E] text-[#3A3A45] dark:text-[#ECEBF5]" },
              { id: "COMPLIANT", label: "Certified Only", badgeColor: "bg-[#8FD9B6] text-[#2F7A55] dark:bg-[#8FD9B6]/20 dark:text-[#8FD9B6]" },
              { id: "REVIEW", label: "Pending Review", badgeColor: "bg-[#F5D08A] text-[#8A6416] dark:bg-[#F5D08A]/20 dark:text-[#F5D08A]" },
              { id: "VIOLATION", label: "Non-Compliant Only", badgeColor: "bg-[#F3A6A6] text-[#9B3B3B] dark:bg-[#F3A6A6]/20 dark:text-[#F3A6A6]" },
            ].map((st) => (
              <label
                key={st.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  filters.status === st.id
                    ? "bg-[#EDEBFB] dark:bg-[#2A2744] border-[#7C6FE0] dark:border-[#9589EC] font-bold"
                    : "bg-[#FDFDFF] dark:bg-[#1F1E2E] border-[#E3E1F0] dark:border-[#2E2C42] hover:bg-[#F2F1F9] dark:hover:bg-[#252336]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${st.badgeColor}`}>
                    {st.label}
                  </span>
                </div>
                <input
                  type="radio"
                  name="status_filter"
                  checked={filters.status === st.id}
                  onChange={() => onFilterChange({ ...filters, status: st.id })}
                  className="w-3.5 h-3.5 accent-[#7C6FE0] cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Filter Section 2: Commodity Category */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A6A4B8] uppercase tracking-wider block">
            Commodity Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1F1E2E] border border-[#E3E1F0] dark:border-[#2E2C42] rounded-lg text-xs font-medium text-[#3A3A45] dark:text-[#ECEBF5] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Section 3: Statutory Rule Infraction */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A6A4B8] uppercase tracking-wider block">
            Rule Citation Filter
          </label>
          <select
            value={filters.ruleViolation}
            onChange={(e) => onFilterChange({ ...filters, ruleViolation: e.target.value })}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1F1E2E] border border-[#E3E1F0] dark:border-[#2E2C42] rounded-lg text-xs font-medium text-[#3A3A45] dark:text-[#ECEBF5] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
          >
            {RULE_OPTIONS.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Section 4: Minimum Confidence Threshold */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#6E6E80] dark:text-[#A6A4B8] uppercase tracking-wider">
              Min Confidence Score
            </label>
            <span className="font-mono text-xs font-bold text-[#7C6FE0] dark:text-[#9589EC]">
              {filters.minConfidence}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={filters.minConfidence}
            onChange={(e) => onFilterChange({ ...filters, minConfidence: Number(e.target.value) })}
            className="w-full accent-[#7C6FE0] cursor-pointer"
          />
        </div>
      </div>

      {/* Action Footer: Soft indigo apply button */}
      <div className="pt-4 border-t border-[#E3E1F0] dark:border-[#2E2C42] flex items-center gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FDFDFF] dark:bg-[#1F1E2E] border border-[#E3E1F0] dark:border-[#2E2C42] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2744] hover:text-[#7C6FE0] dark:hover:text-[#9589EC] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECEBF5] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          onClick={onApply}
          className="flex-1 py-2 px-3 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-[0_4px_12px_rgba(124,111,224,0.25)]"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  )
}
