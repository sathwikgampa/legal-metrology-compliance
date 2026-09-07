import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Download, Info, ArrowRight, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import DashboardCards from "@/components/DashboardCards"
import InspectionTable, { type InspectionRecord } from "@/components/InspectionTable"
import LoadingState from "@/components/LoadingState"
import ErrorState from "@/components/ErrorState"
import { getDashboardStats, getInspectionHistory } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import SpotlightCard from "@/components/react-bits/SpotlightCard"
import BlurText from "@/components/react-bits/BlurText"

interface CategoryStat {
  category: string
  count: number
  violations: number
}

interface DashboardStats {
  total_inspections: number
  compliant: number
  potential_violations: number
  needs_review: number
  category_breakdown: CategoryStat[]
}

export default function DashboardPage(): React.JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentInspections, setRecentInspections] = useState<InspectionRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false)
  const [dateFilterActive, setDateFilterActive] = useState<boolean>(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsRes, historyRes] = await Promise.all([
        getDashboardStats(),
        getInspectionHistory(),
      ])
      setStats(statsRes)
      setRecentInspections(historyRes.slice(0, 5))
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard metrics.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Docket ID,Commodity,Category,Compliance Status,OCR Confidence\n" +
      "INS-2024-001,Heritage Basmati Rice,Food & Grains,COMPLIANT,98%\n" +
      "INS-2024-002,Spiced Namkeen,Snacks,POTENTIAL_VIOLATION,94%\n" +
      "INS-2024-003,Dark Cocoa Nibs,Food & Grains,NEEDS_REVIEW,62%\n" +
      "INS-2024-004,Pure Almond Beverage,Food & Grains,POOR_IMAGE_QUALITY,34%\n" +
      "INS-2024-005,Cold Pressed Olive Oil,Food & Grains,LOW_CONFIDENCE,48%\n" +
      "INS-2024-006,Ultra Clean Detergent,Household,COMPLIANT,96%\n" +
      "INS-2024-007,Herbal Shampoo,Cosmetics,COMPLIANT,95%\n"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "legal_metrology_inspections_zone4.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <LoadingState
        message="Loading Enforcement Dashboard..."
        subtext="Retrieving inspection metrics from Legal Metrology service..."
      />
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />
  }

  // Calculate percentage breakdown for visual bar chart
  const total = stats?.total_inspections || 1
  const compliantPct = Math.round(((stats?.compliant || 0) / total) * 100)
  const violationPct = Math.round(((stats?.potential_violations || 0) / total) * 100)
  const reviewPct = Math.round(((stats?.needs_review || 0) / total) * 100)

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Dashboard Title Block & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center">
            <BlurText text="Compliance Dashboard" delay={40} className="font-extrabold" />
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 • Enforcement & Regulatory Analytics
          </p>
        </div>

        {/* Secondary Action Controls using shadcn Button */}
        <div className="flex items-center space-x-2">
          <Button
            variant={dateFilterActive ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilterActive(!dateFilterActive)}
            className="text-xs h-8 gap-1.5"
            title="Filter dashboard records by date range"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateFilterActive ? "Last 30 Days (Active)" : "Filter Date Range"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-8 gap-1.5"
            title="Export audit records to CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards Grid */}
      <DashboardCards stats={stats} />

      {/* Main Interface Data Grid Split (2/3 and 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Status Distribution Card (2/3 Width) */}
        <SpotlightCard
          spotlightColor="rgba(37, 99, 235, 0.07)"
          className="lg:col-span-2 rounded-xl border border-border bg-card shadow-xs"
        >
          <Card className="border-0 bg-transparent shadow-none h-full flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                Compliance Status Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Aggregate statutory packaging audits across active jurisdiction
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-5">
              {/* Flat Progress Graph Segment Graphic */}
              <div
                className="w-full h-3.5 rounded-full overflow-hidden flex bg-muted shadow-inner"
                role="progressbar"
                aria-label="Compliance Status Distribution"
              >
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${compliantPct}%` }}
                  title={`Compliant (${compliantPct}%)`}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${violationPct}%` }}
                  title={`Violations (${violationPct}%)`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${reviewPct}%` }}
                  title={`Needs Review (${reviewPct}%)`}
                />
              </div>

              {/* Clean Distributed Legend */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
                  <div>
                    <div className="font-semibold text-foreground text-xs">Emerald Green</div>
                    <div className="text-[10px] text-muted-foreground">Compliant ({compliantPct}%)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-xs" />
                  <div>
                    <div className="font-semibold text-foreground text-xs">Soft Crimson</div>
                    <div className="text-[10px] text-muted-foreground">Violations ({violationPct}%)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs" />
                  <div>
                    <div className="font-semibold text-foreground text-xs">Warm Amber</div>
                    <div className="text-[10px] text-muted-foreground">Needs Review ({reviewPct}%)</div>
                  </div>
                </div>
              </div>

              {/* Statutory Enforcement Advisory using shadcn Alert */}
              {!alertDismissed && (
                <Alert variant="advisory" className="mt-4 relative pr-9">
                  <Info className="h-4 w-4" />
                  <div className="space-y-0.5">
                    <AlertTitle className="text-xs font-bold">
                      Statutory Enforcement Advisory
                    </AlertTitle>
                    <AlertDescription className="text-[11px] leading-relaxed">
                      Packages flagged with potential violations require formal notice issuance under Rule 32. Packages under review warrant secondary visual verification before formal compounding.
                    </AlertDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAlertDismissed(true)}
                    className="absolute right-2 top-2 h-6 w-6 text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                    aria-label="Dismiss statutory advisory"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </Alert>
              )}
            </CardContent>
          </Card>
        </SpotlightCard>

        {/* Right Side: Category Audit Breakdown Card (1/3 Width) */}
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.07)"
          className="rounded-xl border border-border bg-card shadow-xs"
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                Category Audit Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Commodity inspection records categorized by product sector
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              <div className="divide-y divide-border/60 text-xs">
                {(stats?.category_breakdown || [
                  { category: "Food & Grains", count: 5, violations: 1 },
                  { category: "Snacks", count: 1, violations: 1 },
                  { category: "Cosmetics", count: 1, violations: 0 },
                  { category: "Household", count: 1, violations: 0 },
                ]).map((cat, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between first:pt-1 last:pb-1">
                    <div>
                      <div className="font-semibold text-foreground text-xs">{cat.category}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {cat.count} package{cat.count === 1 ? "" : "s"} audited
                      </div>
                    </div>
                    {cat.violations > 0 ? (
                      <Badge variant="violation" size="sm" className="gap-1 font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{cat.violations} Non-Compliant</span>
                      </Badge>
                    ) : (
                      <Badge variant="compliant" size="sm" className="gap-1 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Compliant</span>
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SpotlightCard>
      </div>

      {/* Recent Inspections Ledger Card using shadcn Card */}
      <SpotlightCard
        spotlightColor="rgba(37, 99, 235, 0.06)"
        className="rounded-xl border border-border bg-card shadow-xs"
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Recent Inspection Audits
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Latest packaging verifications conducted in Zone 4
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-semibold text-primary">
              <Link to="/history">
                <span>View All Inspections History</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <InspectionTable
              inspections={recentInspections}
              emptyMessage="No recent inspections available."
            />
          </CardContent>
        </Card>
      </SpotlightCard>
    </div>
  )
}
