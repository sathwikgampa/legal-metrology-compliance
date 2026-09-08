import React from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, AlertCircle, Activity, History, Package } from "lucide-react"

export interface SidebarProps {
  activeView?: string
  onSelectView?: (view: string) => void
  activeCategory?: string
  onSelectCategory?: (category: string) => void
}

export default function Sidebar({
  activeView = "all",
  onSelectView,
  activeCategory = "all",
  onSelectCategory,
}: SidebarProps): React.JSX.Element {
  const navigate = useNavigate()

  const views = [
    { id: "all", label: "All Inspections", count: 124, icon: LayoutGrid },
    { id: "violations", label: "Violations", count: 12, icon: AlertCircle },
    { id: "review", label: "Pending Review", count: 8, icon: Activity },
    { id: "audit_log", label: "Audit Log", count: null, icon: History },
  ]

  const categories = [
    { id: "food", label: "Food & Groceries" },
    { id: "cosmetics", label: "Cosmetics" },
    { id: "electronics", label: "Electronics" },
  ]

  return (
    <aside className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-6">
        {/* VIEWS SECTION */}
        <div>
          <div className="px-2 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Views
          </div>
          <nav className="space-y-0.5">
            {views.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectView) onSelectView(item.id)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded font-normal ${
                        isActive ? "bg-slate-200/70 text-slate-700 font-semibold" : "text-slate-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* CATEGORIES SECTION */}
        <div>
          <div className="px-2 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Categories
          </div>
          <nav className="space-y-0.5">
            {categories.map((item) => {
              const isActive = activeCategory === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(isActive ? "all" : item.id)
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Package className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
