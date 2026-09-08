import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
  Scale,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const [identifier, setIdentifier] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null)

  // Check if routed from registration page with success state
  useEffect(() => {
    const state = location.state as any
    if (state?.registrationSuccess) {
      setRegistrationMessage(
        state.message || "Officer account created successfully. Please sign in with your credentials."
      )
      if (state.email) {
        setIdentifier(state.email)
      }
    }
  }, [location.state])

  // If already authenticated, redirect to destination or dashboard
  if (isAuthenticated && !authLoading) {
    const destination = (location.state as any)?.from?.pathname || "/"
    return <Navigate to={destination} replace />
  }

  const validateForm = (): boolean => {
    if (!identifier.trim()) {
      setClientError("Please enter your official email or username.")
      return false
    }
    if (!password) {
      setClientError("Please enter your password.")
      return false
    }
    setClientError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setRegistrationMessage(null)

    if (!validateForm()) return

    setIsSubmitting(true)
    const result = await login({
      identifier: identifier.trim(),
      password,
      rememberMe,
    })

    setIsSubmitting(false)

    if (result.success) {
      const destination = (location.state as any)?.from?.pathname || "/"
      navigate(destination, { replace: true })
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

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-[440px]">
          <Card className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-7">
            <CardHeader className="p-0 pb-5 space-y-1.5 text-center">
              <div className="mx-auto w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 mb-1">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight text-foreground">
                Statutory Officer Login
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Sign in to access the Legal Metrology enforcement dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {/* Registration Success Banner */}
              {registrationMessage && (
                <Alert className="py-2.5 px-3 text-xs border-emerald-500/40 bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="flex-1 ml-2">
                    <AlertTitle className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Account Created
                    </AlertTitle>
                    <AlertDescription className="text-[11px] text-emerald-800 dark:text-emerald-200 mt-0.5 leading-tight">
                      {registrationMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Error Message Display */}
              {displayError && (
                <Alert
                  variant="destructive"
                  className="py-2.5 px-3 text-xs border-rose-500/30 bg-rose-500/10"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <div className="flex-1 ml-2">
                    <AlertTitle className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Authentication Failed
                    </AlertTitle>
                    <AlertDescription className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-tight">
                      {displayError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Officer Email / Username Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="officer-identifier" className="text-xs font-medium text-foreground">
                    Officer Email / Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="officer-identifier"
                      type="text"
                      placeholder="Enter your official email or username"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value)
                        if (clientError) setClientError(null)
                        if (authError) clearError()
                      }}
                      className="pl-8 h-8 text-xs bg-muted/40 focus-visible:bg-background border-border"
                      autoComplete="username"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div className="space-y-1.5">
                  <Label htmlFor="officer-password" className="text-xs font-medium text-foreground">
                    Security Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="officer-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (clientError) setClientError(null)
                        if (authError) clearError()
                      }}
                      className="pl-8 pr-8 h-8 text-xs bg-muted/40 focus-visible:bg-background border-border"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none font-normal"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline transition-colors focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Primary Sign In Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full h-8 font-semibold text-xs shadow-xs transition-colors mt-1 cursor-pointer"
                >
                  {isSubmitting || authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>

              {/* New Officer Registration Option */}
              <div className="text-center text-xs text-muted-foreground pt-1">
                <span>New Officer? </span>
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:underline transition-colors focus:outline-none"
                >
                  Create an account
                </Link>
              </div>

              {/* Subtle Divider */}
              <Separator className="my-3 bg-border/60" />

              {/* Statutory Notice */}
              <div className="text-center space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Authorized personnel only
                </p>
                <p className="text-[10px] text-muted-foreground/80">
                  Legal Metrology (Packaged Commodities) Rules, 2011
                </p>
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
