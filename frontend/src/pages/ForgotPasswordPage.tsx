import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import {
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
  ArrowLeft,
  Scale,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function ForgotPasswordPage(): React.JSX.Element {
  const { requestReset, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const [email, setEmail] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setSuccessMessage(null)

    if (!email.trim()) {
      setClientError("Please enter your official email address.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setClientError("Please enter a valid email format.")
      return
    }

    setIsSubmitting(true)
    const result = await requestReset(email.trim())
    setIsSubmitting(false)

    if (result.success) {
      setSuccessMessage(
        result.message || "Password reset instructions have been dispatched to your official email."
      )
      setClientError(null)
    }
  }

  const displayError = clientError || authError

  return (
    <div className="min-h-screen w-full flex flex-col bg-muted/20 text-foreground transition-colors selection:bg-primary/20">
      {/* Government Branding Top Header */}
      <header className="h-16 min-h-16 px-6 sm:px-8 flex items-center justify-between border-b border-border bg-card shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shrink-0">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground leading-tight">
              Legal Metrology Inspection System
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              Department of Consumer Affairs • Government of India
            </p>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-md border-border text-foreground hover:bg-muted cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>

      {/* Centered Recovery Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[440px]">
          <Card className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-7">
            <CardHeader className="p-0 pb-5 space-y-1.5 text-center">
              <div className="mx-auto w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 mb-1">
                <KeyRound className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight text-foreground">
                Reset Password
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your official email address and we'll help you reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {/* Success Notification */}
              {successMessage && (
                <Alert className="py-2.5 px-3 text-xs border-emerald-500/40 bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="flex-1 ml-2">
                    <AlertTitle className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Reset Link Dispatched
                    </AlertTitle>
                    <AlertDescription className="text-[11px] text-emerald-800 dark:text-emerald-200 mt-0.5 leading-tight">
                      {successMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Error Message Display */}
              {displayError && !successMessage && (
                <Alert
                  variant="destructive"
                  className="py-2.5 px-3 text-xs border-rose-500/30 bg-rose-500/10"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <div className="flex-1 ml-2">
                    <AlertTitle className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Request Failed
                    </AlertTitle>
                    <AlertDescription className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-tight">
                      {displayError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Reset Request Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email" className="text-xs font-medium text-foreground">
                    Official Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="e.g. officer@metrology.gov.in"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (clientError) setClientError(null)
                        if (authError) clearError()
                      }}
                      className="pl-8 h-8 text-xs bg-muted/40 focus-visible:bg-background border-border"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full h-8 font-semibold text-xs shadow-xs transition-colors mt-1 cursor-pointer"
                >
                  {isSubmitting || authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </Button>
              </form>

              {/* Subtle Divider */}
              <Separator className="my-4 bg-border/60" />

              {/* Back to Sign In Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline transition-colors focus:outline-none"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 px-6 text-center border-t border-border/40 bg-card/20">
        <p className="text-[10px] text-muted-foreground">
          Legal Metrology (Packaged Commodities) Rules, 2011 • Official Enforcement Portal
        </p>
      </footer>
    </div>
  )
}
