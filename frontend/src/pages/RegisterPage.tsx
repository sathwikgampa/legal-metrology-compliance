import React, { useState } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { validatePasswordStrength, UserRole } from "../services/authService"
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  BadgeCheck,
  Building,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Check,
  Scale,
  ArrowRight,
  ArrowLeft,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function RegisterPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

  // Step 1: Account credentials
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // Step 2: Officer details & role
  const [officerId, setOfficerId] = useState<string>("")
  const [department, setDepartment] = useState<string>(
    "Department of Consumer Affairs • Legal Metrology Division"
  )
  const [zone, setZone] = useState<string>("Zone 2")
  const [designation, setDesignation] = useState<string>("Enforcement Officer")
  const [role, setRole] = useState<UserRole>("Inspector")
  const [isAuthorizedConfirmed, setIsAuthorizedConfirmed] = useState<boolean>(false)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [clientError, setClientError] = useState<string | null>(null)

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/" replace />
  }

  const passwordStrength = validatePasswordStrength(password)

  const validateStep1 = (): boolean => {
    if (!fullName.trim()) {
      setClientError("Please enter your Full Name.")
      return false
    }
    if (!email.trim()) {
      setClientError("Please enter your Official Email address.")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setClientError("Please provide a valid official email (e.g. officer@metrology.gov.in).")
      return false
    }
    if (!passwordStrength.isValid) {
      setClientError(passwordStrength.error || "Password does not meet the statutory security requirements.")
      return false
    }
    if (password !== confirmPassword) {
      setClientError("Password confirmation does not match the entered password.")
      return false
    }

    setClientError(null)
    return true
  }

  const handleContinueToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const validateStep2 = (): boolean => {
    if (!officerId.trim()) {
      setClientError("Please enter your statutory Officer ID.")
      return false
    }
    if (!department.trim()) {
      setClientError("Please enter your Department or Directorate.")
      return false
    }
    if (!zone.trim()) {
      setClientError("Please specify your assigned Jurisdiction Zone.")
      return false
    }
    if (!designation.trim()) {
      setClientError("Please specify your official Designation.")
      return false
    }
    if (!isAuthorizedConfirmed) {
      setClientError("You must confirm statutory officer authorization before completing registration.")
      return false
    }

    setClientError(null)
    return true
  }

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateStep1()) {
      setCurrentStep(1)
      return
    }

    if (!validateStep2()) return

    setIsSubmitting(true)
    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      officerId: officerId.trim(),
      department: department.trim(),
      zone: zone.trim(),
      designation: designation.trim(),
      role,
      isAuthorizedConfirmed,
    })

    setIsSubmitting(false)

    if (result.success) {
      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
          email: email.trim(),
          message: `Officer account created successfully (${role} role). Please sign in.`,
        },
      })
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

      {/* Centered Registration Card with Spacious Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-[540px]">
          <Card className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-8">
            {/* Step Progress Header */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shrink-0">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                      {currentStep === 1 ? "Create Officer Account" : "Officer Information"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {currentStep === 1
                        ? "Step 1 of 2: Authorized Account Credentials"
                        : "Step 2 of 2: Statutory Designation & Jurisdiction"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md ring-1 ring-primary/20">
                  <span>Step {currentStep}</span>
                  <span className="text-muted-foreground">/ 2</span>
                </div>
              </div>

              {/* Progress Bar Indicator */}
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden flex">
                <div
                  className={`h-full bg-primary transition-all duration-300 ${
                    currentStep === 1 ? "w-1/2" : "w-full"
                  }`}
                />
              </div>
            </div>

            <CardContent className="p-0 space-y-5">
              {/* Error Message Display */}
              {displayError && (
                <Alert
                  variant="destructive"
                  className="py-2.5 px-3.5 text-xs border-rose-500/30 bg-rose-500/10 animate-in fade-in-50"
                >
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  <div className="flex-1 ml-2">
                    <AlertTitle className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Registration Incomplete
                    </AlertTitle>
                    <AlertDescription className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-tight">
                      {displayError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* STEP 1: Account Credentials */}
              {currentStep === 1 && (
                <form onSubmit={handleContinueToStep2} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-fullname" className="text-xs font-semibold text-foreground">
                      Full Legal Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reg-fullname"
                        type="text"
                        placeholder="e.g. Rahul Verma"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                          if (clientError) setClientError(null)
                        }}
                        className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-xs font-semibold text-foreground">
                      Official Government Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="e.g. rahul.verma@metrology.gov.in"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (clientError) setClientError(null)
                        }}
                        className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-xs font-semibold text-foreground">
                      Security Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create statutory portal password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (clientError) setClientError(null)
                        }}
                        className="pl-9 pr-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Compact Live Password Requirements Checklist */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/80 space-y-1.5 text-xs">
                    <span className="font-semibold text-foreground text-[11px] block">
                      Statutory Password Criteria:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className={`flex items-center space-x-1.5 ${passwordStrength.hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                        <Check className={`h-3.5 w-3.5 ${passwordStrength.hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
                        <span>Min 8 characters</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordStrength.hasUpper ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                        <Check className={`h-3.5 w-3.5 ${passwordStrength.hasUpper ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
                        <span>1 uppercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordStrength.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                        <Check className={`h-3.5 w-3.5 ${passwordStrength.hasNumber ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
                        <span>1 numeric digit</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordStrength.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                        <Check className={`h-3.5 w-3.5 ${passwordStrength.hasSpecial ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
                        <span>1 special symbol</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-confirm-password" className="text-xs font-semibold text-foreground">
                      Confirm Security Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password to confirm"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (clientError) setClientError(null)
                        }}
                        className="pl-9 pr-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Button
                    type="submit"
                    className="w-full h-9 font-semibold text-xs shadow-xs transition-colors mt-2 cursor-pointer gap-1.5"
                  >
                    <span>Continue to Officer Information</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </form>
              )}

              {/* STEP 2: Officer Information & Role */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  {/* Officer ID & Jurisdiction Zone (2 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-officer-id" className="text-xs font-semibold text-foreground">
                        Officer ID / Badge No. <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="reg-officer-id"
                          type="text"
                          placeholder="e.g. LM-ZONE2-4412"
                          value={officerId}
                          onChange={(e) => {
                            setOfficerId(e.target.value)
                            if (clientError) setClientError(null)
                          }}
                          className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border uppercase"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reg-zone" className="text-xs font-semibold text-foreground">
                        Jurisdiction Zone <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="reg-zone"
                          type="text"
                          placeholder="e.g. Zone 2"
                          value={zone}
                          onChange={(e) => {
                            setZone(e.target.value)
                            if (clientError) setClientError(null)
                          }}
                          className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Department & Designation (2 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-dept" className="text-xs font-semibold text-foreground">
                        Department / Directorate <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="reg-dept"
                          type="text"
                          placeholder="Legal Metrology Division"
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value)
                            if (clientError) setClientError(null)
                          }}
                          className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reg-desig" className="text-xs font-semibold text-foreground">
                        Designation Title <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="reg-desig"
                          type="text"
                          placeholder="e.g. Enforcement Officer"
                          value={designation}
                          onChange={(e) => {
                            setDesignation(e.target.value)
                            if (clientError) setClientError(null)
                          }}
                          className="pl-9 h-9 text-xs bg-muted/30 focus-visible:bg-background border-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational Role Selection (RBAC) */}
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Statutory Access Role (RBAC) <span className="text-destructive">*</span></span>
                      <span className="text-[10px] text-muted-foreground font-normal">Select authorization tier</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Inspector", "Clerk", "Director"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            role === r
                              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                              : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <UserCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="font-bold text-xs">{r}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                            {r === "Inspector" && "Inspections & Audits"}
                            {r === "Clerk" && "Records & Dockets"}
                            {r === "Director" && "Analytics & Approvals"}
                          </p>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground pt-0.5">
                      Note: In production environments, role elevations are approved by the Directorate Administrator.
                    </p>
                  </div>

                  {/* Statutory Confirmation Checkbox */}
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="confirm-authorization"
                      checked={isAuthorizedConfirmed}
                      onCheckedChange={(checked) => setIsAuthorizedConfirmed(Boolean(checked))}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="confirm-authorization"
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none font-normal leading-relaxed"
                    >
                      I confirm that I am an authorized statutory officer appointed under the Legal Metrology Act, 2009.
                    </Label>
                  </div>

                  {/* Action Buttons: Back & Submit */}
                  <div className="flex gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="h-9 font-semibold text-xs border-border cursor-pointer gap-1.5"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || authLoading}
                      className="flex-1 h-9 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      {isSubmitting || authLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create Officer Account</span>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Subtle Divider & Sign In link */}
              <Separator className="my-4 bg-border/60" />

              <div className="text-center text-xs text-muted-foreground">
                <span>Already have an authorized account? </span>
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline transition-colors focus:outline-none"
                >
                  Sign In
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
