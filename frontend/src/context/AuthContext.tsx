import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  User,
  UserRole,
  LoginCredentials,
  RegisterPayload,
  loginUser,
  registerUser,
  requestPasswordReset,
  logoutUser,
  getStoredSession,
} from "../services/authService"

interface AuthContextType {
  user: User | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasRole: (allowedRoles: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string) => boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; message?: string }>
  requestReset: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Hydrate session on application initialization
  useEffect(() => {
    try {
      const activeSession = getStoredSession()
      if (activeSession && activeSession.user && activeSession.token) {
        setUser(activeSession.user)
        setToken(activeSession.token)
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasRole = (allowedRoles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    return roles.includes(user.role) || user.role === "Admin"
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === "Admin") return true
    return Array.isArray(user.permissions) && user.permissions.includes(permission)
  }

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await loginUser(credentials)
      if (response.success && response.user && response.token) {
        setUser(response.user)
        setToken(response.token)
        setIsLoading(false)
        return { success: true }
      } else {
        const errorMsg = response.error || "Authentication failed. Please check your credentials."
        setError(errorMsg)
        setIsLoading(false)
        return { success: false, error: errorMsg }
      }
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred during authentication."
      setError(errorMsg)
      setIsLoading(false)
      return { success: false, error: errorMsg }
    }
  }

  const register = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await registerUser(payload)
      setIsLoading(false)
      if (response.success) {
        return {
          success: true,
          message: response.message || "Officer account created successfully.",
        }
      } else {
        const errorMsg = response.error || "Registration failed. Please review your details."
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred during registration."
      setError(errorMsg)
      setIsLoading(false)
      return { success: false, error: errorMsg }
    }
  }

  const requestReset = async (
    email: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await requestPasswordReset(email)
      setIsLoading(false)
      if (response.success) {
        return {
          success: true,
          message: response.message || "Password reset instructions dispatched.",
        }
      } else {
        const errorMsg = response.error || "Failed to process password reset."
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred during reset request."
      setError(errorMsg)
      setIsLoading(false)
      return { success: false, error: errorMsg }
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await logoutUser()
    } finally {
      setUser(null)
      setToken(null)
      setError(null)
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: Boolean(user && token),
        isLoading,
        error,
        hasRole,
        hasPermission,
        login,
        register,
        requestReset,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
