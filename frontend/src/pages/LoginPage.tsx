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
  Sparkles,
  ArrowRight,
  UserCheck,
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

  const handleQuickLogin = async (loginId: string) => {
    clearError()
    setClientError(null)
    setIsSubmitting(true)
    setIdentifier(loginId)
    setPassword("Password@123")

    const result = await login({
      identifier: loginId,
      password: "Password@123",
      rememberMe: true,
    })

    setIsSubmitting(false)

    if (result.success) {
      const destination = (location.state as any)?.from?.pathname || "/"
      navigate(destination, { replace: true })
    }
  }

  const displayError = clientError || authError

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] transition-colors selection:bg-[#7C6FE0]/20 font-sans">
      {/* Government Branding Top Header */}
      <header className="h-16 min-h-16 px-6 sm:px-8 flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] bg-[#FBFAFE] dark:bg-[#161424] shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C6FE0] text-white flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(124,111,224,0.3)] shrink-0">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#3A3A45] dark:text-[#ECE9F6] leading-tight">
              Legal Metrology Inspection System
            </h1>
            <p className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8] font-medium">
              Department of Consumer Affairs • Government of India
            </p>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] rounded-full transition-colors cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-[#F5D08A]" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-[460px]">
          <Card className="rounded-2xl border border-[#E3E1F0] dark:border-[#26223A] bg-[#FBFAFE] dark:bg-[#161424] shadow-lg p-6 sm:p-8">
            <CardHeader className="p-0 pb-5 space-y-1.5 text-center">
              <div className="mx-auto w-10 h-10 rounded-xl bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] flex items-center justify-center ring-1 ring-[#7C6FE0]/30 mb-1 shadow-xs">
                <Shield className="h-5 w-5 text-[#7C6FE0]" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight text-[#3A3A45] dark:text-[#ECE9F6]">
                Statutory Officer Login
              </CardTitle>
              <CardDescription className="text-xs text-[#6E6E80] dark:text-[#A29DB8]">
                Sign in to access the Legal Metrology enforcement dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {/* Quick 1-Click Role Logins for seamless demo */}
              <div className="p-3 bg-[#F2F1F9] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7C6FE0]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Cadre Sign-In (Demo Access)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("sharma")}
                    disabled={isSubmitting}
                    className="px-2 py-1.5 bg-white dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] hover:border-[#7C6FE0] rounded-lg text-left text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-[11px] text-[#3A3A45] dark:text-[#ECE9F6] truncate">Inspector</div>
                    <div className="text-[9px] text-[#6E6E80] dark:text-[#A29DB8]">S. Sharma</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("verma")}
                    disabled={isSubmitting}
                    className="px-2 py-1.5 bg-white dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] hover:border-[#7C6FE0] rounded-lg text-left text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-[11px] text-[#3A3A45] dark:text-[#ECE9F6] truncate">Director</div>
                    <div className="text-[9px] text-[#6E6E80] dark:text-[#A29DB8]">R. Verma</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@metrology.gov.in")}
                    disabled={isSubmitting}
                    className="px-2 py-1.5 bg-white dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] hover:border-[#7C6FE0] rounded-lg text-left text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-[11px] text-[#3A3A45] dark:text-[#ECE9F6] truncate">Admin</div>
                    <div className="text-[9px] text-[#6E6E80] dark:text-[#A29DB8]">HQ System</div>
                  </button>
                </div>
              </div>

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
                  <Label htmlFor="officer-identifier" className="text-xs font-medium text-[#3A3A45] dark:text-[#ECE9F6]">
                    Officer Email / Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E80] dark:text-[#A29DB8] pointer-events-none" />
                    <Input
                      id="officer-identifier"
                      type="text"
                      placeholder="e.g. sharma or inspector.sharma@metrology.gov.in"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value)
                        if (clientError) setClientError(null)
                        if (authError) clearError()
                      }}
                      className="pl-9 h-9 text-xs bg-[#F2F1F9] dark:bg-[#232035] border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg focus-visible:bg-white dark:focus-visible:bg-[#1C1A2B]"
                      autoComplete="username"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div className="space-y-1.5">
                  <Label htmlFor="officer-password" className="text-xs font-medium text-[#3A3A45] dark:text-[#ECE9F6]">
                    Security Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E80] dark:text-[#A29DB8] pointer-events-none" />
                    <Input
                      id="officer-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your security password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (clientError) setClientError(null)
                        if (authError) clearError()
                      }}
                      className="pl-9 pr-9 h-9 text-xs bg-[#F2F1F9] dark:bg-[#232035] border-[#E3E1F0] dark:border-[#2E2A44] rounded-lg focus-visible:bg-white dark:focus-visible:bg-[#1C1A2B]"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] transition-colors focus:outline-none cursor-pointer"
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
                      className="text-xs text-[#6E6E80] dark:text-[#A29DB8] cursor-pointer hover:text-foreground transition-colors select-none font-normal"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#7C6FE0] hover:underline transition-colors focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Primary Sign In Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full h-9 font-semibold text-xs bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white shadow-xs transition-colors mt-1 cursor-pointer rounded-lg"
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
              <div className="text-center text-xs text-[#6E6E80] dark:text-[#A29DB8] pt-1">
                <span>New Officer? </span>
                <Link
                  to="/register"
                  className="font-semibold text-[#7C6FE0] hover:underline transition-colors focus:outline-none"
                >
                  Create an account
                </Link>
              </div>

              {/* Subtle Divider */}
              <Separator className="my-3 bg-[#E3E1F0]/60 dark:bg-[#26223A]/60" />

              {/* Statutory Notice */}
              <div className="text-center space-y-0.5">
                <p className="text-[11px] font-medium text-[#6E6E80] dark:text-[#A29DB8]">
                  Authorized personnel only
                </p>
                <p className="text-[10px] text-[#6E6E80]/80 dark:text-[#A29DB8]/80">
                  Legal Metrology (Packaged Commodities) Rules, 2011
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 px-6 text-center border-t border-[#E3E1F0]/40 dark:border-[#26223A]/40 bg-card/20">
        <p className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8]">
          Legal Metrology (Packaged Commodities) Rules, 2011 • Official Enforcement Portal
        </p>
      </footer>
    </div>
  )
}
