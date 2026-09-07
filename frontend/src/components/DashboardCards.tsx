import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SpotlightCard from "@/components/react-bits/SpotlightCard"
import CountUp from "@/components/react-bits/CountUp"
import { cn } from "@/lib/utils"

export interface DashboardStatsProps {
  stats?: {
    total_inspections: number
    compliant: number
    potential_violations: number
    needs_review: number
    category_breakdown?: Array<{
      category: string
      count: number
      violations: number
    }>
  } | null
}

export default function DashboardCards({ stats }: DashboardStatsProps): React.JSX.Element {
  const data = stats || {
    total_inspections: 8,
    compliant: 3,
    potential_violations: 2,
    needs_review: 3,
  }

  const cards = [
    {
      id: "total",
      title: "Total Inspections",
      value: data.total_inspections,
      helperText: "Processed packages across all active zones",
      dotColor: "bg-blue-500",
      spotlightColor: "rgba(59, 130, 246, 0.12)",
    },
    {
      id: "compliant",
      title: "Compliant Packages",
      value: data.compliant,
      helperText: "Verified mandatory declarations",
      dotColor: "bg-emerald-500",
      spotlightColor: "rgba(16, 185, 129, 0.12)",
    },
    {
      id: "violations",
      title: "Potential Violations",
      value: data.potential_violations,
      helperText: "Non-compliant statutory declarations detected",
      dotColor: "bg-rose-500",
      spotlightColor: "rgba(244, 63, 94, 0.12)",
    },
    {
      id: "review",
      title: "Needs Officer Review",
      value: data.needs_review,
      helperText: "Uncertain OCR reading or marginal quality",
      dotColor: "bg-amber-500",
      spotlightColor: "rgba(245, 158, 11, 0.12)",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <SpotlightCard
          key={card.id}
          spotlightColor={card.spotlightColor}
          className="rounded-xl border border-border bg-card shadow-xs hover:border-border/80 transition-colors"
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-4 pb-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>{card.title}</span>
                <span className={cn("w-2 h-2 rounded-full ring-2 ring-background", card.dotColor)} />
              </div>
              <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight my-1 flex items-center">
                <CountUp to={card.value} duration={1.2} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[11px] text-muted-foreground leading-normal">
                {card.helperText}
              </p>
            </CardContent>
          </Card>
        </SpotlightCard>
      ))}
    </div>
  )
}
