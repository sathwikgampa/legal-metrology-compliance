import React from "react"
import { NavLink } from "react-router-dom"
import { ShieldCheck, LayoutDashboard, PlusCircle, History } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ScenarioItem {
  id: string
  title: string
  dotClass: string
}

const SCENARIOS: ScenarioItem[] = [
  { id: "INS-2024-001", title: "1. Fully Compliant", dotClass: "bg-emerald-500" },
  { id: "INS-2024-002", title: "2. Potential Violation", dotClass: "bg-rose-500" },
  { id: "INS-2024-003", title: "3. Needs Review", dotClass: "bg-amber-500" },
  { id: "INS-2024-004", title: "4. Poor Image Quality", dotClass: "bg-slate-400" },
  { id: "INS-2024-005", title: "5. Low OCR Confidence", dotClass: "bg-orange-400" },
  { id: "INS-2024-006", title: "6. Multiple Bounding Boxes", dotClass: "bg-teal-400" },
  { id: "INS-2024-007", title: "7. Multiple Package Images", dotClass: "bg-cyan-400" },
]

export default function Sidebar(): React.JSX.Element {
  return (
    <aside className="w-60 bg-card border-r border-border p-4 flex flex-col space-y-5 transition-colors shrink-0 select-none shadow-xs">
      {/* Primary Navigation */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Navigation
        </p>
        <nav className="space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2.5 text-xs font-medium px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/inspections/new"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2.5 text-xs font-medium px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )
            }
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Inspection</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2.5 text-xs font-medium px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )
            }
          >
            <History className="h-4 w-4" />
            <span>Inspection History</span>
          </NavLink>
        </nav>
      </div>

      <Separator className="bg-border/60" />

      {/* Test Scenarios Section */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Test Scenarios (Mock Cases)
        </p>
        <ul className="space-y-1">
          {SCENARIOS.map((item) => (
            <li key={item.id}>
              <NavLink
                to={`/inspections/${item.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 text-xs py-1.5 px-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )
                }
              >
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.dotClass)} />
                <span className="truncate">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer & System Status */}
      <div className="mt-auto pt-3 border-t border-border/60 text-[10px] text-muted-foreground space-y-1">
        <div className="flex items-center space-x-1.5 font-medium text-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Engine: Active (Rules 2011)</span>
        </div>
        <p className="text-[9px] leading-tight text-muted-foreground/80">
          Statutory inspection assistant. Officer determination is legally binding.
        </p>
      </div>
    </aside>
  )
}
