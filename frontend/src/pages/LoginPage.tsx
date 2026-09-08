import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import {
  Shield,
  ShieldCheck,
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
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

  const quickRoles = [
    { label: "Inspector S. Sharma", value: "sharma" },
    { label: "Director R. Verma", value: "verma" },
    { label: "Admin HQ System", value: "admin@metrology.gov.in" },
  ]

  const metrics = [
    { title: "Inspection Queue", subtitle: "48 active cases", icon: ShieldCheck },
    { title: "Zone Coverage", subtitle: "8 jurisdictions", icon: Scale },
    { title: "Digital Records", subtitle: "1,284 verified", icon: CheckCircle2 },
    { title: "Officer Status", subtitle: "All systems online", icon: UserCheck },
  ]

  return (
    <div className="min-h-screen w-full bg-[#0b1623] text-white">
      <div
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11,22,35,0.88) 0%, rgba(11,22,35,0.75) 42%, rgba(11,22,35,0.45) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_30%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Legal Metrology</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200/80">
                Department of Consumer Affairs • India
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-100/90 md:flex">
            <a href="#" className="transition hover:text-white">
              How it works
            </a>
            <a href="#" className="transition hover:text-white">
              FAQ
            </a>
            <a href="#" className="transition hover:text-white">
              For Officials
            </a>
            <a href="#" className="transition hover:text-white">
              For Organizations
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.18)] transition hover:-translate-y-px"
            >
              Get Started
            </Button>
          </div>
        </header>

        <main className="relative z-10 mx-auto flex max-w-7xl flex-1 flex-col justify-center px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="grid items-center gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="py-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                AI-Powered Compliance Intelligence
              </div>

              <h2 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.97] tracking-[-0.07em] text-white sm:text-6xl xl:text-[7rem]">
                Turn Compliance
                <span className="mt-2 block bg-linear-to-r from-sky-200 via-white to-sky-100 bg-clip-text text-transparent">
                  Into Public Trust.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100/90">
                Understand packaged commodity compliance, identify risk patterns, and record enforcement
                actions with traceable digital evidence across every officer and inspection zone.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-white px-6 py-3 text-base font-bold text-slate-900 shadow-[0_16px_40px_rgba(255,255,255,0.22)] transition hover:-translate-y-px"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-100/90">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  Scroll to explore
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-white/20 bg-slate-950/30 p-4 shadow-[0_32px_90px_rgba(8,15,25,0.4)] backdrop-blur-md">
              <div className="rounded-[26px] border border-white/15 bg-slate-900/40 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                      Official Sign In
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                      Secure Access Portal
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {quickRoles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleQuickLogin(role.value)}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:bg-sky-500/10"
                    >
                      <span>{role.label}</span>
                      <UserCheck className="h-4 w-4 text-sky-300" />
                    </button>
                  ))}
                </div>

                {displayError && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-100">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{displayError}</span>
                  </div>
                )}

                {registrationMessage && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-100">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{registrationMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="officer-identifier"
                      className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300"
                    >
                      Officer Email / Username
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="officer-identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value)
                          if (clientError) setClientError(null)
                          if (authError) clearError()
                        }}
                        placeholder="e.g. sharma or inspector.sharma@metrology.gov.in"
                        className="h-11 rounded-xl border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-slate-400 focus-visible:ring-sky-400/40"
                        autoComplete="username"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="officer-password"
                      className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300"
                    >
                      Security Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="officer-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (clientError) setClientError(null)
                          if (authError) clearError()
                        }}
                        placeholder="Enter your security password"
                        className="h-11 rounded-xl border-white/10 bg-white/5 pl-9 pr-10 text-sm text-white placeholder:text-slate-400 focus-visible:ring-sky-400/40"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-sky-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                      />
                      <Label
                        htmlFor="remember-me"
                        className="cursor-pointer text-xs font-medium text-slate-300 transition hover:text-white"
                      >
                        Remember me
                      </Label>
                    </div>

                    <Link to="/forgot-password" className="text-xs font-semibold text-sky-300 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-[0_16px_38px_rgba(59,130,246,0.35)] transition hover:brightness-110"
                  >
                    {isSubmitting || authLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-medium text-slate-300">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-100 transition hover:border-sky-300/40 hover:bg-sky-500/10"
                  >
                    <Scale className="h-3.5 w-3.5 text-sky-300" />
                    Government SSO
                  </button>
                  <span>Authorized personnel only</span>
                </div>
              </div>
            </section>
          </div>

          <div className="relative mt-8">
            <div className="rounded-[30px] border border-white/15 bg-slate-950/25 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur-sm">
              <div className="grid gap-4 md:grid-cols-4">
                {metrics.map(({ title, subtitle, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-xs text-slate-300">{subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
