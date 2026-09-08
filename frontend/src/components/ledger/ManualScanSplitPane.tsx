import React, { useState } from "react"
import { Plus, X, Scan, Camera, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { DocketItem } from "./DocketDetailSplitPane"

interface ManualScanSplitPaneProps {
  nextId: string
  onClose: () => void
  onAddDocket: (item: DocketItem) => void
  onToast: (msg: string) => void
  onLaunchLiveScanner?: () => void
}

export default function ManualScanSplitPane({
  nextId,
  onClose,
  onAddDocket,
  onToast,
  onLaunchLiveScanner,
}: ManualScanSplitPaneProps): React.JSX.Element {
  const [manufacturer, setManufacturer] = useState<string>("Crispy Munch Ltd.")
  const [product, setProduct] = useState<string>("Classic Masala Chips 100g")
  const [category, setCategory] = useState<string>("Food & Groceries")
  const [gtin, setGtin] = useState<string>("008901048")
  const [scenario, setScenario] = useState<string>("RULE_MRP")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmitScan = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      let status: "VIOLATION" | "COMPLIANT" | "REVIEW" = "COMPLIANT"
      let rule_violation: string | undefined = undefined
      let confidence = 96.5

      if (scenario === "RULE_MRP") {
        status = "VIOLATION"
        rule_violation = "Rule 6(1)(e) - Missing MRP"
        confidence = 94.8
      } else if (scenario === "RULE_ORIGIN") {
        status = "VIOLATION"
        rule_violation = "Rule 6(1)(a) - Country of Origin Missing"
        confidence = 91.2
      } else if (scenario === "RULE_CARE") {
        status = "VIOLATION"
        rule_violation = "Rule 6(1)(ac) - Missing Customer Care"
        confidence = 93.6
      } else if (scenario === "RULE_QTY") {
        status = "REVIEW"
        rule_violation = "Rule 6(1)(c) - Net Qty Glare"
        confidence = 64.0
      } else {
        status = "COMPLIANT"
        rule_violation = undefined
        confidence = 98.9
      }

      let image = "/products/potato_crisps.jpg"
      if (category === "Cosmetics") image = "/products/face_serum.jpg"
      else if (category === "Electronics") image = "/products/wireless_earbuds.jpg"
      else if (product.toLowerCase().includes("atta") || product.toLowerCase().includes("flour")) image = "/products/wheat_atta.jpg"
      else if (product.toLowerCase().includes("tea")) image = "/products/tea_leaves.jpg"
      else if (product.toLowerCase().includes("water")) image = "/products/mineral_water.jpg"

      const newDocket: DocketItem = {
        id: nextId,
        timestamp: "Just now",
        manufacturer,
        product,
        category,
        status,
        rule_violation,
        gtin,
        confidence,
        image,
      }

      onAddDocket(newDocket)
      setIsSubmitting(false)
      onToast(`New compliance scan recorded into docket ${nextId}`)
      onClose()
    }, 400)
  }

  return (
    <aside className="w-96 bg-[#FBFAFE] dark:bg-[#161424] border-l border-[#E3E1F0] dark:border-[#26223A] p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 overflow-y-auto">
      <form onSubmit={handleSubmitScan} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] pb-3">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-[#7C6FE0]" />
            <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">Manual Audit Entry</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-md transition-colors cursor-pointer"
            title="Close scan panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Camera Scanner Alternative Banner */}
        {onLaunchLiveScanner && (
          <div className="p-3 bg-[#EDEBFB] dark:bg-[#221C38] border border-[#7C6FE0]/30 rounded-lg flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#7C6FE0] block">Prefer Optical Scanner?</span>
              <span className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">Scan label directly via webcam/OCR</span>
            </div>
            <button
              type="button"
              onClick={onLaunchLiveScanner}
              className="px-3 py-1.5 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
          </div>
        )}

        {/* Assigned Docket ID */}
        <div className="flex items-center justify-between p-3 bg-[#F2F1F9] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg">
          <span className="text-xs text-[#6E6E80] dark:text-[#A29DB8]">Assigned Docket ID</span>
          <span className="font-mono text-xs font-bold text-[#7C6FE0]">{nextId}</span>
        </div>

        {/* Manufacturer */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6] block">
            Manufacturer / Regulated Entity
          </label>
          <input
            type="text"
            required
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] rounded-lg text-xs font-medium focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
            placeholder="e.g. Crispy Munch Ltd."
          />
        </div>

        {/* Product Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6] block">
            Commodity / Product Name
          </label>
          <input
            type="text"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] rounded-lg text-xs font-medium focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
            placeholder="e.g. Classic Masala Chips 100g"
          />
        </div>

        {/* GTIN / Barcode */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6] block">
            GTIN / Barcode
          </label>
          <input
            type="text"
            required
            value={gtin}
            onChange={(e) => setGtin(e.target.value)}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs font-mono text-[#3A3A45] dark:text-[#ECE9F6] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
            placeholder="008901048"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6] block">
            Sector Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs font-medium text-[#3A3A45] dark:text-[#ECE9F6] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
          >
            <option value="Food & Groceries">Food & Groceries</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Electronics">Electronics</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        {/* Declaration Scenario */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6] block">
            Inspection Verification Scenario
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full p-2 bg-[#FDFDFF] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs font-medium text-[#3A3A45] dark:text-[#ECE9F6] focus:outline-none focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20"
          >
            <option value="RULE_MRP">Missing MRP / Sale Price (Rule 6(1)(e))</option>
            <option value="RULE_ORIGIN">Country of Origin Missing (Rule 6(1)(a))</option>
            <option value="RULE_CARE">Missing Customer Care (Rule 6(1)(ac))</option>
            <option value="RULE_QTY">Net Quantity Ambiguity (Rule 6(1)(c))</option>
            <option value="COMPLIANT">Fully Certified Package (All Rules Verified)</option>
          </select>
        </div>

        {/* Primary Action Button: Soft Indigo-Violet #7C6FE0 */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(124,111,224,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? "Recording Entry..." : "Record Manual Entry"}</span>
          </button>
        </div>
      </form>
    </aside>
  )
}
