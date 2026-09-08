import React from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { UserRole } from "../services/authService"
import { Shield, ShieldAlert, Loader2, ArrowLeft, LayoutDashboard, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProtectedRouteProps {
  children: React.JSX.Element
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Legal Metrology Inspection System</h2>
            <p className="text-xs text-muted-foreground">Verifying statutory officer session credentials...</p>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-primary mt-2" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based authorization if route specifies allowedRoles
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full rounded-xl border border-border bg-card shadow-sm p-6 text-center space-y-4">
          <CardHeader className="p-0 space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 mb-1">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              Statutory Role Authorization Required
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Your assigned officer role does not possess statutory jurisdiction to access this workflow.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Your Current Role:</span>
                <Badge variant="outline" className="font-semibold text-xs border-primary/30 text-primary bg-primary/5">
                  {user?.role || "Clerk"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Permitted Roles:</span>
                <span className="font-semibold text-foreground text-xs">
                  {allowedRoles.join(" • ")}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground/90 pt-1 border-t border-border/60">
                To request jurisdiction elevation, contact the Directorate General of Legal Metrology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/history")}
                className="flex-1 text-xs gap-1.5 h-8 cursor-pointer"
              >
                <History className="h-3.5 w-3.5" />
                <span>View Records</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/")}
                className="flex-1 text-xs gap-1.5 h-8 cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return children
}
