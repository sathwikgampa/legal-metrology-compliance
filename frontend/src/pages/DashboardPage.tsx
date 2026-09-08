import React, { useState, useEffect } from "react"
import {
  Filter,
  Download,
  Plus,
  Check,
  ChevronRight,
  Package,
  AlertCircle,
  LayoutGrid,
  List,
  Star,
  Sparkles,
  Cpu,
  ShoppingBag,
  Camera,
  Scan,
  BellRing,
} from "lucide-react"
import DocketDetailSplitPane, { DocketItem } from "../components/ledger/DocketDetailSplitPane"
import FilterSplitPane, { FilterCriteria } from "../components/ledger/FilterSplitPane"
import ManualScanSplitPane from "../components/ledger/ManualScanSplitPane"
import OfficerScannerModal from "../components/OfficerScannerModal"
import StatutoryNotificationBar from "../components/dashboard/StatutoryNotificationBar"
import { useNotifications } from "../context/NotificationContext"
import EntitiesView from "../components/entities/EntitiesView"
import AnalyticsView from "../components/analytics/AnalyticsView"
import SettingsView from "../components/settings/SettingsView"

const INITIAL_DOCKETS: DocketItem[] = [
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
    image: "/products/potato_crisps.jpg",
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
    image: "/products/wheat_atta.jpg",
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
    image: "/products/face_serum.jpg",
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
    image: "/products/tea_leaves.jpg",
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
    image: "/products/mineral_water.jpg",
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
    image: "/products/wireless_earbuds.jpg",
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
    image: "/products/facial_cream.jpg",
  },
]

export interface DashboardPageProps {
  activeTab?: string
  activeView?: string
  activeCategory?: string
  searchQuery?: string
}

type SplitPaneType = "docket" | "filter" | "manual_scan" | null
type ViewDisplayMode = "cards" | "table"

export default function DashboardPage({
  activeTab = "Inspections",
  activeView = "all",
  activeCategory = "all",
  searchQuery = "",
}: DashboardPageProps): React.JSX.Element {
  const [dockets, setDockets] = useState<DocketItem[]>(INITIAL_DOCKETS)
  const [selectedDocket, setSelectedDocket] = useState<DocketItem | null>(INITIAL_DOCKETS[0])
  const [activePane, setActivePane] = useState<SplitPaneType>(null)
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>("cards")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLiveScannerOpen, setIsLiveScannerOpen] = useState<boolean>(false)

  // Filter Criteria State
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    status: "ALL",
    category: "ALL",
    ruleViolation: "ALL",
    minConfidence: 0,
  })

  // Notification System Integration
  const {
    targetDocketId,
    setTargetDocketId,
    isBannerVisible,
    restoreBanner,
    notifications,
  } = useNotifications()

  const handleSelectDocketById = (docketId: string) => {
    const found = dockets.find((d) => d.id === docketId)
    if (found) {
      setSelectedDocket(found)
      setActivePane("docket")
    }
  }

  // Auto-open docket when targeted from notification
  useEffect(() => {
    if (targetDocketId) {
      handleSelectDocketById(targetDocketId)
      setTargetDocketId(null)
    }
  }, [targetDocketId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  // Filter Items dynamically
  const filteredItems = dockets.filter((item) => {
    if (activeView === "violations" && item.status !== "VIOLATION") return false
    if (activeView === "review" && item.status !== "REVIEW") return false
    if (activeCategory !== "all" && item.category !== activeCategory) return false

    // Category Pill Filter
    if (selectedCategoryFilter !== "all") {
      if (selectedCategoryFilter === "COMPLIANT" && item.status !== "COMPLIANT") return false
      if (selectedCategoryFilter === "REVIEW" && item.status !== "REVIEW") return false
      if (selectedCategoryFilter === "VIOLATION" && item.status !== "VIOLATION") return false
      if (
        ["Food & Groceries", "Cosmetics", "Electronics"].includes(selectedCategoryFilter) &&
        item.category !== selectedCategoryFilter
      ) {
        return false
      }
    }

    if (filterCriteria.status !== "ALL" && item.status !== filterCriteria.status) return false
    if (filterCriteria.category !== "ALL" && item.category !== filterCriteria.category) return false
    if (
      filterCriteria.ruleViolation !== "ALL" &&
      (!item.rule_violation || !item.rule_violation.includes(filterCriteria.ruleViolation))
    )
      return false
    if (filterCriteria.minConfidence > 0 && item.confidence < filterCriteria.minConfidence) return false

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

  // Telemetry Calculations
  const totalScans = 1284 + (dockets.length - INITIAL_DOCKETS.length)
  const compliantCount = dockets.filter((i) => i.status === "COMPLIANT").length
  const complianceRate = ((compliantCount / dockets.length) * 100).toFixed(1)
  const violationCount = dockets.filter((i) => i.status === "VIOLATION").length
  const reviewCount = dockets.filter((i) => i.status === "REVIEW").length

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Docket ID,Timestamp,Manufacturer,Product,Category,Status,Rule Citation,GTIN,Confidence\n" +
      filteredItems
        .map(
          (i) =>
            `${i.id},${i.timestamp},"${i.manufacturer}","${i.product}","${i.category}",${i.status},"${i.rule_violation || "None"}",${i.gtin},${i.confidence}%`
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "compliance_records.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredItems.length} compliance records as CSV`)
  }

  const handleAddNewDocket = (newDocket: DocketItem) => {
    setDockets([newDocket, ...dockets])
    setSelectedDocket(newDocket)
    setActivePane("docket")
    showToast(`Created compliance docket ${newDocket.id}`)
  }

  // Handle 4-Sided Live Optical Scanner Result
  const handleLiveScanComplete = (scannedData: {
    photoUrl: string
    productName: string
    brand: string
    category?: string
    declaredNetQty: string
    sidesCaptured: Record<string, any>
    ocrExtracted: { text: string; confidence: number; label: string; bbox: number[] }[]
  }) => {
    const nextId = `INS-${8908 + (dockets.length - INITIAL_DOCKETS.length)}`

    // Determine compliance from extracted OCR declarations across all captured sides
    let status: "VIOLATION" | "COMPLIANT" | "REVIEW" = "COMPLIANT"
    let rule_violation: string | undefined = undefined

    const hasLowConfidence = scannedData.ocrExtracted.some((i) => i.confidence < 0.75)
    const hasViolationItem = scannedData.ocrExtracted.find((i) => i.label.toLowerCase().includes("glare"))

    if (hasViolationItem) {
      status = "REVIEW"
      rule_violation = hasViolationItem.label
    } else if (hasLowConfidence) {
      status = "REVIEW"
      rule_violation = "Rule 6(1)(c) - Net Qty Glare"
    } else {
      status = "COMPLIANT"
    }

    const avgConfidence = Math.round(
      scannedData.ocrExtracted.reduce((acc, curr) => acc + curr.confidence * 100, 0) /
        (scannedData.ocrExtracted.length || 1)
    )

    const newDocket: DocketItem = {
      id: nextId,
      timestamp: "Just now",
      manufacturer: scannedData.brand,
      product: scannedData.productName,
      category: scannedData.category || "Food & Groceries",
      status,
      rule_violation,
      gtin: `00890${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: avgConfidence || 98.0,
      image: scannedData.photoUrl,
    }

    setDockets([newDocket, ...dockets])
    setSelectedDocket(newDocket)
    setActivePane("docket")
    const sideCount = Object.keys(scannedData.sidesCaptured || {}).length || 4
    showToast(`4-Side Scanned (${sideCount}/4 sides) "${scannedData.productName}" — Created Docket ${nextId}`)
  }

  // Get Category icon with soft pastel and muted secondary accents
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food & Groceries":
        return <ShoppingBag className="w-8 h-8 text-[#7C6FE0] dark:text-[#9589EC]" />
      case "Cosmetics":
        return <Sparkles className="w-8 h-8 text-[#F2A488]" />
      case "Electronics":
        return <Cpu className="w-8 h-8 text-[#5FC8B8]" />
      default:
        return <Package className="w-8 h-8 text-[#7C6FE0] dark:text-[#9589EC]" />
    }
  }

  // TAB 2: ENTITIES VIEW
  if (activeTab === "Entities") {
    return (
      <div className="flex flex-1 overflow-hidden relative bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6]">
        <EntitiesView searchQuery={searchQuery} onToast={showToast} />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3A3A45] dark:bg-[#221C38] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#E3E1F0]/30 flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4 text-[#8FD9B6]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    )
  }

  // TAB 3: ANALYTICS VIEW
  if (activeTab === "Analytics") {
    return (
      <div className="flex flex-1 overflow-hidden relative bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6]">
        <AnalyticsView onToast={showToast} />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3A3A45] dark:bg-[#221C38] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#E3E1F0]/30 flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4 text-[#8FD9B6]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    )
  }

  // TAB 4: SETTINGS VIEW
  if (activeTab === "Settings") {
    return (
      <div className="flex flex-1 overflow-hidden relative bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6]">
        <SettingsView onToast={showToast} />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3A3A45] dark:bg-[#221C38] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#E3E1F0]/30 flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4 text-[#8FD9B6]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    )
  }

  // TAB 1 (DEFAULT): COMPLIANCE DASHBOARD IN REFINED SOFT LAVENDER & INDIGO PALETTE (WITH FULL LIGHT/DARK SUPPORT)
  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] transition-colors duration-200 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3A3A45] dark:bg-[#221C38] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#E3E1F0]/30 flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#8FD9B6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Scrollable Area */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto min-w-0">
        {/* 1. DASHBOARD HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-[#E3E1F0] dark:border-[#26223A]">
          <div>
            <h1 className="text-2xl sm:text-[30px] font-bold text-[#3A3A45] dark:text-[#ECE9F6] tracking-tight leading-tight">
              Compliance Dashboard
            </h1>
            <p className="text-sm text-[#6E6E80] dark:text-[#A6A4B8] mt-1">
              Track certification status, audits, and compliance records across statutory jurisdictions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Filter Button */}
            <button
              onClick={() => setActivePane(activePane === "filter" ? null : "filter")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                activePane === "filter"
                  ? "bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] border-[#7C6FE0] font-bold"
                  : "bg-[#FDFDFF] dark:bg-[#161424] border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6]"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] hover:bg-[#EDEBFB] dark:hover:bg-[#221C38] hover:text-[#7C6FE0] hover:border-[#7C6FE0] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Un-dismiss notification bar button if hidden */}
            {!isBannerVisible && notifications.length > 0 && (
              <button
                onClick={restoreBanner}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EDEBFB] dark:bg-[#2A2544] border border-[#7C6FE0]/40 text-[#7C6FE0] text-xs font-bold transition-all cursor-pointer shadow-xs hover:bg-[#7C6FE0] hover:text-white"
                title="Restore Statutory Advisory Bar"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Advisories ({notifications.length})</span>
              </button>
            )}

            {/* Primary Action Button: Live Scanner */}
            <button
              onClick={() => setIsLiveScannerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white text-xs font-semibold transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,111,224,0.25)] hover:shadow-[0_6px_16px_rgba(124,111,224,0.35)] active:scale-[0.99]"
              title="Launch Live Optical Packaging Scanner"
            >
              <Camera className="w-4 h-4" />
              <span>Live Scanner</span>
            </button>
          </div>
        </div>

        {/* 2. STATUTORY ENFORCEMENT & COMPLIANCE NOTIFICATION BAR */}
        <StatutoryNotificationBar onSelectDocket={handleSelectDocketById} />

        {/* 3. SUMMARY STAT CARDS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Compliance Rate */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#8FD9B6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Compliance Rate
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                {complianceRate}%
              </span>
              <span className="text-xs font-bold text-[#2F7A55] dark:text-[#8FD9B6]">
                +2.1% against baseline
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Minimum 90% threshold mandated
            </div>
          </div>

          {/* Card 2: Total Items Audited */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#7C6FE0] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Total Items Audited
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                {totalScans.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#7C6FE0]">
                12,480 monthly samples
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Across 4 national jurisdictions
            </div>
          </div>

          {/* Card 3: Flagged Violations */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F3A6A6] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Flagged Violations
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                {violationCount} Active
              </span>
              <span className="text-xs font-bold text-[#9B3B3B] dark:text-[#F3A6A6]">
                Rule 32 notices pending
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Primary: Rule 6(1)(e) Missing MRP
            </div>
          </div>

          {/* Card 4: Pending Review */}
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] border-l-4 border-l-[#F5D08A] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)] hover:border-[#7C6FE0] transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E80] dark:text-[#A29DB8]">
              Pending Review
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#8A6416] dark:text-[#F5D08A]">
                {reviewCount} Dockets
              </span>
              <span className="text-xs font-bold text-[#8A6416] dark:text-[#F5D08A]">
                SLA &lt; 24h
              </span>
            </div>
            <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
              Awaiting officer physical inspection
            </div>
          </div>
        </div>

        {/* 3. FILTER & VIEW TOGGLE STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          {/* Category / Status Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "All Items" },
              { id: "COMPLIANT", label: "Certified" },
              { id: "REVIEW", label: "Pending Review" },
              { id: "VIOLATION", label: "Violations" },
              { id: "Food & Groceries", label: "Food & Groceries" },
              { id: "Cosmetics", label: "Cosmetics" },
              { id: "Electronics", label: "Electronics" },
            ].map((chip) => {
              const isActive = selectedCategoryFilter === chip.id
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedCategoryFilter(chip.id)}
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

          {/* View Mode Switcher: Cards vs Table */}
          <div className="flex items-center self-end sm:self-auto bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] p-1 rounded-lg shadow-xs">
            <button
              onClick={() => setDisplayMode("cards")}
              title="Card Grid View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                displayMode === "cards"
                  ? "bg-[#7C6FE0] text-white shadow-xs"
                  : "text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#3A3A45] dark:hover:text-white hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode("table")}
              title="Table Ledger View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                displayMode === "table"
                  ? "bg-[#7C6FE0] text-white shadow-xs"
                  : "text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#3A3A45] dark:hover:text-white hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. MAIN CONTENT AREA */}
        {/* VIEW MODE A: COURSE-CARD GRID */}
        {displayMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedDocket?.id === item.id && activePane === "docket"
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedDocket(item)
                    setActivePane("docket")
                  }}
                  className={`bg-[#FDFDFF] dark:bg-[#161424] border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-xs ${
                    isSelected
                      ? "border-[#7C6FE0] ring-2 ring-[#7C6FE0]/30 shadow-[0_8px_20px_rgba(124,111,224,0.2)]"
                      : "border-[#E3E1F0] dark:border-[#26223A] hover:border-[#7C6FE0] hover:shadow-[0_8px_20px_rgba(124,111,224,0.15)]"
                  }`}
                >
                  {/* Top Thumbnail */}
                  <div className="h-44 bg-[#F2F1F9] dark:bg-[#1C192C] border-b border-[#E3E1F0] dark:border-[#26223A] relative flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.product}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="p-3 bg-[#FDFDFF] dark:bg-[#161424] rounded-lg border border-[#E3E1F0] dark:border-[#26223A] shadow-xs group-hover:scale-105 transition-transform">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}

                    {/* GTIN / Docket ID pill in thumbnail */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="font-mono text-[10px] font-bold text-[#3A3A45] dark:text-[#ECE9F6] bg-white/90 dark:bg-[#161424]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#E3E1F0] dark:border-[#26223A] shadow-xs">
                        {item.id}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="text-[10px] font-mono text-[#3A3A45] dark:text-[#ECE9F6] bg-white/90 dark:bg-[#161424]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#E3E1F0] dark:border-[#26223A] shadow-xs">
                        GTIN {item.gtin}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Product Title */}
                      <h3 className="font-bold text-sm text-[#3A3A45] dark:text-[#ECE9F6] leading-snug line-clamp-2 group-hover:text-[#7C6FE0] transition-colors">
                        {item.product}
                      </h3>

                      {/* Regulated Entity */}
                      <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] truncate mt-1">
                        {item.manufacturer}
                      </p>

                      {/* Star Rating / Confidence Score */}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-xs font-bold text-[#8A6416] dark:text-[#F5D08A]">
                          {item.confidence}%
                        </span>
                        <div className="flex items-center text-[#F5D08A]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current opacity-50" />
                        </div>
                        <span className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8]">
                          OCR score
                        </span>
                      </div>

                      {/* Status Pill Badges */}
                      <div className="mt-3">
                        {item.status === "COMPLIANT" && (
                          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#8FD9B6]/20 text-[#2F7A55] dark:bg-[#0E2319] dark:text-[#8FD9B6] border border-[#8FD9B6]/40 dark:border-[#163A29]">
                            CERTIFIED COMPLIANT
                          </span>
                        )}
                        {item.status === "REVIEW" && (
                          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5D08A]/20 text-[#8A6416] dark:bg-[#261B0A] dark:text-[#F5D08A] border border-[#F5D08A]/40 dark:border-[#3D2B10]">
                            PENDING REVIEW
                          </span>
                        )}
                        {item.status === "VIOLATION" && (
                          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3A6A6]/20 text-[#9B3B3B] dark:bg-[#261212] dark:text-[#F3A6A6] border border-[#F3A6A6]/40 dark:border-[#3D1B1B]">
                            FLAGGED VIOLATION
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Meta Row */}
                    <div className="pt-3 mt-3 border-t border-[#E3E1F0] dark:border-[#26223A] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                          {item.timestamp}
                        </span>
                        {item.rule_violation && (
                          <div className="text-[10px] text-[#9B3B3B] dark:text-[#F3A6A6] truncate max-w-[140px] font-semibold mt-0.5">
                            {item.rule_violation}
                          </div>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-[#7C6FE0] group-hover:underline flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW MODE B: TABLE LEDGER VIEW */}
        {displayMode === "table" && (
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2F1F9] dark:bg-[#1C192C] text-[#6E6E80] dark:text-[#A29DB8] font-bold border-b border-[#E3E1F0] dark:border-[#26223A]">
                    <th className="py-3 px-4 font-semibold">Docket ID</th>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Commodity & Entity</th>
                    <th className="py-3 px-4 font-semibold">Jurisdiction</th>
                    <th className="py-3 px-4 font-semibold">Audit Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Confidence</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E1F0] dark:divide-[#26223A]">
                  {filteredItems.map((item) => {
                    const isSelected = selectedDocket?.id === item.id && activePane === "docket"
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedDocket(item)
                          setActivePane("docket")
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#EDEBFB] dark:bg-[#221C38]"
                            : "hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#7C6FE0]">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-4 text-[#6E6E80] dark:text-[#A29DB8]">
                          {item.timestamp}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.product}
                                className="w-10 h-10 rounded-lg object-cover border border-[#E3E1F0] dark:border-[#26223A] shadow-xs shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#F2F1F9] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] flex items-center justify-center shrink-0">
                                {getCategoryIcon(item.category)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6]">{item.product}</div>
                              <div className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                                {item.manufacturer} • GTIN {item.gtin}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#3A3A45] dark:text-[#ECE9F6] font-medium">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.status === "COMPLIANT" && (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8FD9B6]/20 text-[#2F7A55] dark:bg-[#0E2319] dark:text-[#8FD9B6] border border-[#8FD9B6]/40 dark:border-[#163A29]">
                              CERTIFIED
                            </span>
                          )}
                          {item.status === "REVIEW" && (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5D08A]/20 text-[#8A6416] dark:bg-[#261B0A] dark:text-[#F5D08A] border border-[#F5D08A]/40 dark:border-[#3D2B10]">
                              PENDING REVIEW
                            </span>
                          )}
                          {item.status === "VIOLATION" && (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3A6A6]/20 text-[#9B3B3B] dark:bg-[#261212] dark:text-[#F3A6A6] border border-[#F3A6A6]/40 dark:border-[#3D1B1B]">
                              VIOLATION
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                          {item.confidence}%
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[11px] font-bold text-[#7C6FE0] hover:underline">
                            View
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-12 text-center my-6">
            <AlertCircle className="w-10 h-10 text-[#6E6E80] dark:text-[#A29DB8] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
              No matching compliance items found
            </h3>
            <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-1 max-w-sm mx-auto">
              No audit records matched your current query or category filter. Try clearing your search or filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryFilter("all")
                setFilterCriteria({
                  status: "ALL",
                  category: "ALL",
                  ruleViolation: "ALL",
                  minConfidence: 0,
                })
              }}
              className="mt-4 px-4 py-2 bg-[#7C6FE0] dark:bg-[#9589EC] text-white rounded-lg text-xs font-semibold hover:bg-[#6C5FD1] shadow-[0_4px_12px_rgba(124,111,224,0.25)] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Right-Side Split-Panes */}
      {activePane === "docket" && selectedDocket && (
        <DocketDetailSplitPane
          docket={selectedDocket}
          onClose={() => setActivePane(null)}
          onToast={showToast}
        />
      )}

      {activePane === "filter" && (
        <FilterSplitPane
          filters={filterCriteria}
          onFilterChange={setFilterCriteria}
          onReset={() => {
            setFilterCriteria({
              status: "ALL",
              category: "ALL",
              ruleViolation: "ALL",
              minConfidence: 0,
            })
            setSelectedCategoryFilter("all")
            showToast("Filter criteria reset")
          }}
          onClose={() => setActivePane(null)}
          onApply={() => {
            setActivePane(null)
            showToast(`Applied filters (${filteredItems.length} records matching)`)
          }}
        />
      )}

      {activePane === "manual_scan" && (
        <ManualScanSplitPane
          nextId={`INS-${8908 + (dockets.length - INITIAL_DOCKETS.length)}`}
          onClose={() => setActivePane(null)}
          onAddDocket={handleAddNewDocket}
          onToast={showToast}
          onLaunchLiveScanner={() => {
            setActivePane(null)
            setIsLiveScannerOpen(true)
          }}
        />
      )}

      {/* 4-Side Live Optical Packaging Scanner Modal */}
      <OfficerScannerModal
        isOpen={isLiveScannerOpen}
        onClose={() => setIsLiveScannerOpen(false)}
        onScanComplete={handleLiveScanComplete}
      />
    </div>
  )
}
