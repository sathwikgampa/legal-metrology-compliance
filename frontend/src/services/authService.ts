/**
 * Authentication Service for Legal Metrology Inspection System
 * Clean abstraction layer supporting RBAC (Inspector, Clerk, Director, Admin),
 * Two-Step Registration, Session Management, and Password Recovery.
 */

export type UserRole = "Inspector" | "Clerk" | "Director" | "Admin"

export interface User {
  id: string
  name: string
  email: string
  username: string
  initials: string
  zone: string
  role: UserRole
  designation: string
  officerId: string
  department: string
  permissions: string[]
}

export interface LoginCredentials {
  identifier: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  fullName: string
  email: string
  officerId: string
  department: string
  zone: string
  designation: string
  role: UserRole
  password: string
  confirmPassword: string
  isAuthorizedConfirmed: boolean
}

export interface AuthSession {
  token: string
  user: User
  expiresAt: number
  rememberMe: boolean
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
  message?: string
}

// Statutory permissions registry
export const PERMISSIONS = {
  CREATE_INSPECTION: "inspection:create",
  REVIEW_DECISION: "inspection:review_decision",
  VIEW_INSPECTIONS: "inspection:view",
  VIEW_ANALYTICS: "analytics:view",
  MANAGE_USERS: "admin:manage_users",
} as const

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Inspector: [
    PERMISSIONS.CREATE_INSPECTION,
    PERMISSIONS.REVIEW_DECISION,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  Clerk: [
    PERMISSIONS.VIEW_INSPECTIONS,
  ],
  Director: [
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.REVIEW_DECISION,
  ],
  Admin: [
    PERMISSIONS.CREATE_INSPECTION,
    PERMISSIONS.REVIEW_DECISION,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_USERS,
  ],
}

// Pre-configured statutory accounts for every role
export const DEFAULT_OFFICERS: (User & { passwordHash: string })[] = [
  {
    id: "usr-001",
    name: "Inspector S. Sharma",
    email: "inspector.sharma@metrology.gov.in",
    username: "sharma",
    passwordHash: "Password@123",
    initials: "SS",
    zone: "Zone 4",
    role: "Inspector",
    designation: "Senior Enforcement Officer",
    officerId: "LM-ZONE4-8821",
    department: "Department of Consumer Affairs • Legal Metrology Division",
    permissions: ROLE_PERMISSIONS.Inspector,
  },
  {
    id: "usr-002",
    name: "Director R. Verma",
    email: "director.verma@metrology.gov.in",
    username: "verma",
    passwordHash: "Password@123",
    initials: "RV",
    zone: "HQ Directorate",
    role: "Director",
    designation: "Director of Legal Metrology",
    officerId: "LM-HQ-1002",
    department: "Directorate General of Legal Metrology",
    permissions: ROLE_PERMISSIONS.Director,
  },
  {
    id: "usr-003",
    name: "A. Patel",
    email: "clerk.patel@metrology.gov.in",
    username: "clerk",
    passwordHash: "Password@123",
    initials: "AP",
    zone: "Zone 4",
    role: "Clerk",
    designation: "Documentation & Records Officer",
    officerId: "LM-ZONE4-5509",
    department: "Legal Metrology Registry & Docket Records",
    permissions: ROLE_PERMISSIONS.Clerk,
  },
  {
    id: "usr-004",
    name: "Administrator K. Singh",
    email: "admin.metrology@gov.in",
    username: "admin",
    passwordHash: "Password@123",
    initials: "KS",
    zone: "National HQ",
    role: "Admin",
    designation: "Chief IT & Systems Administrator",
    officerId: "LM-ADM-001",
    department: "National Metrology Information Grid (NIC)",
    permissions: ROLE_PERMISSIONS.Admin,
  },
]

const REGISTERED_USERS_KEY = "lm_registered_officers_registry"
const SESSION_KEY = "lm_auth_session_token"
const USER_KEY = "lm_auth_user_data"
const REMEMBER_KEY = "lm_remember_me_flag"

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Computes officer initials from full name
 */
export function calculateInitials(fullName: string): string {
  if (!fullName) return "LM"
  const clean = fullName.replace(/^(Inspector|Officer|Director|Shri|Smt|Dr\.|Administrator)\s+/i, "").trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "LM"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Fetches registered officers persisted in storage
 */
function getRegisteredOfficers(): (User & { passwordHash: string })[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)
    if (!raw) return [...DEFAULT_OFFICERS]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_OFFICERS]
  } catch (e) {
    return [...DEFAULT_OFFICERS]
  }
}

/**
 * Saves registered officers to storage
 */
function saveRegisteredOfficers(officers: (User & { passwordHash: string })[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(officers))
  } catch (e) {
    console.error("Failed to save registered officers:", e)
  }
}

/**
 * Validates password strength policy
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  hasMinLength: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSpecial: boolean
  error?: string
} {
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const isValid = hasMinLength && hasUpper && hasNumber && hasSpecial

  let error = ""
  if (!hasMinLength) error = "Password must be at least 8 characters long."
  else if (!hasUpper) error = "Password must contain at least one uppercase letter."
  else if (!hasNumber) error = "Password must contain at least one number."
  else if (!hasSpecial) error = "Password must contain at least one special character."

  return { isValid, hasMinLength, hasUpper, hasNumber, hasSpecial, error }
}

/**
 * Registers a new officer with RBAC role and metadata
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  await delay(400)

  if (
    !payload.fullName?.trim() ||
    !payload.email?.trim() ||
    !payload.officerId?.trim() ||
    !payload.department?.trim() ||
    !payload.zone?.trim() ||
    !payload.designation?.trim() ||
    !payload.role ||
    !payload.password
  ) {
    return {
      success: false,
      error: "All required officer registration fields must be completed.",
    }
  }

  const email = payload.email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid official email address.",
    }
  }

  const strength = validatePasswordStrength(payload.password)
  if (!strength.isValid) {
    return {
      success: false,
      error: strength.error || "Password does not meet statutory security requirements.",
    }
  }

  if (payload.password !== payload.confirmPassword) {
    return {
      success: false,
      error: "Password confirmation does not match the entered password.",
    }
  }

  if (!payload.isAuthorizedConfirmed) {
    return {
      success: false,
      error: "You must confirm statutory officer authorization before registering.",
    }
  }

  const allOfficers = getRegisteredOfficers()
  const existingEmail = allOfficers.find((o) => o.email.toLowerCase() === email)
  if (existingEmail) {
    return {
      success: false,
      error: `An officer account with email ${email} is already registered.`,
    }
  }

  const officerId = payload.officerId.trim().toUpperCase()
  const existingOfficerId = allOfficers.find(
    (o) => o.officerId.toUpperCase() === officerId
  )
  if (existingOfficerId) {
    return {
      success: false,
      error: `Officer ID ${officerId} is already associated with an existing account.`,
    }
  }

  const initials = calculateInitials(payload.fullName)
  const username = email.split("@")[0]
  const permissions = ROLE_PERMISSIONS[payload.role] || ROLE_PERMISSIONS.Inspector

  const newOfficer: User & { passwordHash: string } = {
    id: `usr-${String(allOfficers.length + 1).padStart(3, "0")}`,
    name: payload.fullName.trim(),
    email,
    username,
    initials,
    zone: payload.zone.trim(),
    role: payload.role,
    designation: payload.designation.trim(),
    officerId,
    department: payload.department.trim(),
    permissions,
    passwordHash: payload.password,
  }

  allOfficers.push(newOfficer)
  saveRegisteredOfficers(allOfficers)

  const { passwordHash: _, ...safeUser } = newOfficer

  return {
    success: true,
    user: safeUser,
    message: "Officer account created successfully.",
  }
}

/**
 * Validates credentials and initializes officer session
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(350)

  const identifier = credentials.identifier?.trim().toLowerCase()
  const password = credentials.password

  if (!identifier || !password) {
    return {
      success: false,
      error: "Both Officer Email / Username and Password are required.",
    }
  }

  const allOfficers = getRegisteredOfficers()

  const matchedUser = allOfficers.find(
    (u) =>
      u.email.toLowerCase() === identifier ||
      u.username.toLowerCase() === identifier ||
      u.officerId.toLowerCase() === identifier ||
      (identifier === "sharma" && u.id === "usr-001") ||
      (identifier === "verma" && u.id === "usr-002") ||
      (identifier === "patel" && u.id === "usr-003") ||
      (identifier === "admin" && u.id === "usr-004")
  )

  if (!matchedUser) {
    return {
      success: false,
      error: "No officer account found matching the provided credentials.",
    }
  }

  if (matchedUser.passwordHash !== password) {
    return {
      success: false,
      error: "Invalid security credentials. Please check your password and try again.",
    }
  }

  // Ensure role permissions are present
  const permissions = matchedUser.permissions || ROLE_PERMISSIONS[matchedUser.role] || ROLE_PERMISSIONS.Inspector
  const userWithPermissions: User = {
    ...matchedUser,
    permissions,
  }

  const token = `lm_jwt_${btoa(`${matchedUser.id}:${Date.now()}`)}`
  const durationMs = credentials.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000
  const expiresAt = Date.now() + durationMs

  const { passwordHash: _, ...safeUser } = userWithPermissions as any

  const sessionData: AuthSession = {
    token,
    user: safeUser,
    expiresAt,
    rememberMe: Boolean(credentials.rememberMe),
  }

  saveSession(sessionData)

  return {
    success: true,
    user: safeUser,
    token,
  }
}

/**
 * Requests password reset instructions
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  await delay(400)

  const cleanEmail = email?.trim().toLowerCase()
  if (!cleanEmail) {
    return {
      success: false,
      error: "Please enter your official officer email address.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      error: "Please provide a valid email format (e.g. officer@metrology.gov.in).",
    }
  }

  return {
    success: true,
    message: `Password reset instructions have been dispatched to ${cleanEmail}.`,
  }
}

/**
 * Terminates the active session
 */
export async function logoutUser(): Promise<void> {
  await delay(100)
  clearSession()
}

/**
 * Retrieves active session if valid
 */
export function getStoredSession(): AuthSession | null {
  try {
    const isRemembered = localStorage.getItem(REMEMBER_KEY) === "true"
    const storage = isRemembered ? localStorage : sessionStorage

    const token = storage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
    const rawUser = storage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)

    if (!token || !rawUser) {
      return null
    }

    const session: AuthSession = JSON.parse(rawUser)
    if (!session || !session.user || !session.expiresAt) {
      clearSession()
      return null
    }

    if (Date.now() > session.expiresAt) {
      clearSession()
      return null
    }

    return session
  } catch (err) {
    clearSession()
    return null
  }
}

function saveSession(session: AuthSession): void {
  try {
    clearSession()
    const targetStorage = session.rememberMe ? localStorage : sessionStorage
    targetStorage.setItem(SESSION_KEY, session.token)
    targetStorage.setItem(USER_KEY, JSON.stringify(session))
    if (session.rememberMe) {
      localStorage.setItem(REMEMBER_KEY, "true")
    }
  } catch (err) {
    console.error("Failed to persist authentication session:", err)
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REMEMBER_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(USER_KEY)
  } catch (err) {}
}
