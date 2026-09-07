import React from "react"
import { CheckCircle2, Loader2, Circle, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import SpotlightCard from "@/components/react-bits/SpotlightCard"
import BorderBeam from "@/components/react-bits/BorderBeam"
import { cn } from "@/lib/utils"

export interface AnalysisStep {
  id: string
  label: string
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "upload", label: "Images uploaded to inspection vault" },
  { id: "quality", label: "Optical sharpness & quality validated" },
  { id: "ocr", label: "OCR text extraction & tokenization" },
  { id: "detect", label: "Mandatory declarations identified" },
  { id: "rules", label: "Applying 2011 Legal Metrology rules" },
  { id: "results", label: "Generating compliance findings dossier" },
]

export interface AnalysisProgressProps {
  currentStepIndex?: number
}

export default function AnalysisProgress({
  currentStepIndex = 0,
}: AnalysisProgressProps): React.JSX.Element {
  const progressPercent = Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)

  return (
    <div className="max-w-xl mx-auto my-6">
      <SpotlightCard
        spotlightColor="rgba(37, 99, 235, 0.15)"
        className="relative rounded-xl border border-border bg-card shadow-lg overflow-hidden"
      >
        <BorderBeam size={250} duration={8} colorFrom="#3b82f6" colorTo="#93c5fd" />
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="p-6 pb-4 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              AI Compliance Engine Pipeline
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Executing mandatory verification sequence under Packaged Commodities Rules, 2011
            </CardDescription>
            <div className="pt-3">
              <Progress value={progressPercent} className="h-2 bg-muted" />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 font-mono">
                <span>Stage {currentStepIndex + 1} of {ANALYSIS_STEPS.length}</span>
                <span className="font-bold text-primary">{progressPercent}% complete</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-3">
            {ANALYSIS_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex
              const isInProgress = idx === currentStepIndex
              const isPending = idx > currentStepIndex

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center space-x-3 p-2.5 rounded-lg border transition-all duration-300",
                    isDone && "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300",
                    isInProgress && "bg-primary/5 border-primary/40 text-foreground ring-1 ring-primary/20 shadow-xs",
                    isPending && "bg-muted/10 border-transparent text-muted-foreground opacity-60"
                  )}
                >
                  <div className="shrink-0">
                    {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    {isInProgress && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                    {isPending && <Circle className="h-4 w-4 text-muted-foreground/40" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold block truncate">{step.label}</span>
                  </div>
                  <div>
                    {isDone && (
                      <Badge variant="compliant" size="sm" className="text-[10px]">
                        Done
                      </Badge>
                    )}
                    {isInProgress && (
                      <Badge variant="default" size="sm" className="text-[10px] animate-pulse">
                        Analyzing
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </SpotlightCard>
    </div>
  )
}
