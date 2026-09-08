import React from "react"
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  FileCheck,
  AlertCircle,
  Clock,
  FileText,
  Package,
  X,
} from "lucide-react"

export interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeTab?: string
  onSelectTab?: (tab: string) => void
  activeView?: string
  onSelectView?: (view: string) => void
  activeCategory?: string
  onSelectCategory?: (category: string) => void
}

export default function Sidebar({
  isOpen = false,
  onClose,
  activeTab = "Inspections",
  onSelectTab,
  activeView = "all",
  onSelectView,
  activeCategory = "all",
  onSelectCategory,
}: SidebarProps): React.JSX.Element {
  const mainNav = [
    { id: "Inspections", label: "Dashboard", icon: LayoutDashboard },
    { id: "Entities", label: "Instruments & Entities", icon: Building2 },
    { id: "Analytics", label: "Audits & Reports", icon: BarChart3 },
    { id: "Settings", label: "Account Settings", icon: Settings },
  ]

  const statusFilters = [
    { id: "all", label: "All Inspections", count: 124, icon: FileCheck },
    { id: "violations", label: "Violations (Non-Compliant)", count: 12, icon: AlertCircle },
    { id: "review", label: "Pending Review", count: 8, icon: Clock },
    { id: "audit_log", label: "Audit Certificate Log", count: null, icon: FileText },
  ]

  const categories = [
    { id: "Food & Groceries", label: "Food & Groceries" },
    { id: "Cosmetics", label: "Cosmetics" },
    { id: "Electronics", label: "Electronics" },
    { id: "Beverages", label: "Beverages" },
  ]

  return (
    /* SIDEBAR DRAWER: Subtle lavender-gray (#FBFAFE) in light, deep indigo-slate (#161424) in dark */
    <aside className="w-72 bg-[#FBFAFE] dark:bg-[#161424] border-r border-[#E3E1F0] dark:border-[#26223A] py-4 flex flex-col justify-between shrink-0 select-none overflow-y-auto transition-colors duration-200 h-full shadow-2xl">
      <div className="space-y-5">
        {/* Drawer Header with Close Button */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A]">
          <span className="text-[11px] font-bold tracking-wider text-[#6E6E80] dark:text-[#A29DB8] uppercase">
            Menu & Navigation
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 -mr-1 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-md transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div>
          <div className="px-5 pb-2 text-[10px] font-bold tracking-wider text-[#6E6E80] dark:text-[#A29DB8] uppercase">
            Platform Sections
          </div>
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectTab) onSelectTab(item.id)
                    if (onClose) onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                    isActive
                      ? "border-l-4 border-l-[#7C6FE0] bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] font-bold"
                      : "border-l-4 border-l-transparent text-[#6E6E80] dark:text-[#A29DB8] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] hover:text-[#3A3A45] dark:hover:text-[#ECE9F6] font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#7C6FE0]" : "text-[#6E6E80] dark:text-[#A29DB8]"}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Status Views (Only on Dashboard) */}
        {activeTab === "Inspections" && (
          <div>
            <div className="px-5 pb-2 text-[11px] font-bold tracking-wider text-[#6E6E80] dark:text-[#A29DB8] uppercase">
              Certification Status
            </div>
            <nav className="space-y-0.5">
              {statusFilters.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSelectView) onSelectView(item.id)
                    }}
                    className={`w-full flex items-center justify-between px-5 py-2 text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "border-l-4 border-l-[#7C6FE0] bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] font-bold"
                        : "border-l-4 border-l-transparent text-[#6E6E80] dark:text-[#A29DB8] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] hover:text-[#3A3A45] dark:hover:text-[#ECE9F6] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#7C6FE0]" : "text-[#6E6E80] dark:text-[#A29DB8]"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className="text-[11px] font-mono text-[#6E6E80] dark:text-[#A29DB8] bg-[#F2F1F9] dark:bg-[#232035] px-2 py-0.5 rounded-full font-semibold">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Commodity Categories */}
        {activeTab === "Inspections" && (
          <div>
            <div className="px-5 pb-2 text-[11px] font-bold tracking-wider text-[#6E6E80] dark:text-[#A29DB8] uppercase">
              Commodity Sectors
            </div>
            <nav className="space-y-0.5">
              {categories.map((item) => {
                const isActive = activeCategory === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(isActive ? "all" : item.id)
                    }}
                    className={`w-full flex items-center gap-2.5 px-5 py-2 text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "border-l-4 border-l-[#7C6FE0] bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] font-bold"
                        : "border-l-4 border-l-transparent text-[#6E6E80] dark:text-[#A29DB8] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] hover:text-[#3A3A45] dark:hover:text-[#ECE9F6] font-medium"
                    }`}
                  >
                    <Package className={`w-3.5 h-3.5 ${isActive ? "text-[#7C6FE0]" : "text-[#6E6E80] dark:text-[#A29DB8]"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer / Branding */}
      <div className="px-5 pt-4 border-t border-[#E3E1F0] dark:border-[#2E2A44] text-[11px] text-[#6E6E80] dark:text-[#A29DB8] space-y-1">
        <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6]">Compliance Cadre</div>
        <div>Legal Metrology Rules 2011</div>
      </div>
    </aside>
  )
}
