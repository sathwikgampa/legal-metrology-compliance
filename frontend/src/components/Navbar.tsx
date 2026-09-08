import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Moon, Sun, ChevronDown, User, Shield, LogOut, Plus, Scale, LogIn } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { setSimulateNetworkError, getSimulateNetworkError } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MagneticButton from "@/components/react-bits/MagneticButton"

export interface NavbarProps {
  activeTab?: string
  onSelectTab?: (tab: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export default function Navbar({
  activeTab = "Inspections",
  onSelectTab,
  searchQuery = "",
  onSearchChange,
}: NavbarProps): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, logout, hasRole, isAuthenticated } = useAuth()
  const [errorSimulated, setErrorSimulated] = useState<boolean>(getSimulateNetworkError())
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery)

  const officerName = user?.name || "Inspector S. Sharma"
  const officerZoneSubtitle = user?.zone
    ? user.designation
      ? `${user.zone} • ${user.designation}`
      : `${user.zone} • Enforcement`
    : "Zone 4 • Enforcement"
  const officerInitials = user?.initials || "SS"
  const officerId = user?.officerId || "LM-ZONE4-8821"
  const jurisdictionLabel = user?.zone ? `${user.zone} Jurisdiction` : "Zone 4 Jurisdiction"
  const officerRole = user?.role || "Inspector"

  const handleToggleError = (checked: boolean) => {
    setErrorSimulated(checked)
    setSimulateNetworkError(checked)
  }

  const handleSearchChange = (value: string) => {
    setInternalSearch(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = (onSearchChange ? searchQuery : internalSearch).trim()
    if (query) {
      navigate(`/history?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSignOut = async () => {
    await logout()
    navigate("/login")
  }

  const tabs = ["Inspections", "Entities", "Analytics", "Settings"]

  return (
    <header className="bg-card border-b border-border h-16 min-h-16 px-4 lg:px-6 flex items-center justify-between transition-colors sticky top-0 z-40 shadow-xs select-none">
      {/* Left: Brand Crest & Title */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center space-x-3 group text-foreground no-underline select-none">
          <div className="text-primary text-xl font-bold transition-transform group-hover:scale-105 flex items-center">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground leading-tight">
              Legal Metrology Inspection System
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              Department of Consumer Affairs • Packaged Commodities (2011)
            </p>
          </div>
        </Link>

        {/* Optional Center Tabs (if onSelectTab provided) */}
        {onSelectTab && (
          <nav className="hidden xl:flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/60">
            {tabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </nav>
        )}
      </div>

      {/* Right: Quick Controls, Theme Switch, Profile Dropdown, Main Action */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Simulate API Failure Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="simulate-api-failure"
            checked={errorSimulated}
            onCheckedChange={(checked) => handleToggleError(Boolean(checked))}
          />
          <Label
            htmlFor="simulate-api-failure"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:inline cursor-pointer"
          >
            Simulate API Failure
          </Label>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-44 lg:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search GTIN, Docket..."
            value={onSearchChange ? searchQuery : internalSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-muted/30 focus-visible:bg-background border-border"
          />
        </form>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-md border-border text-foreground hover:bg-muted cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </Button>

        {/* Officer Profile with shadcn DropdownMenu or Login Button */}
        {isAuthenticated ? (
          <div className="border-l border-border pl-3 sm:pl-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-2 py-1 h-auto hover:bg-muted rounded-lg cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs ring-1 ring-primary/20 select-none">
                    {officerInitials}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold text-foreground leading-tight">{officerName}</div>
                    <div className="text-[10px] text-muted-foreground">{officerZoneSubtitle}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-foreground">{officerName}</div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0 px-1.5 border-primary/40 text-primary bg-primary/5">
                      {officerRole}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-normal mt-0.5">Officer ID: {officerId}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/history")} className="cursor-pointer">
                  <Shield className="mr-2 h-3.5 w-3.5 text-primary" />
                  <span>{jurisdictionLabel}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/inspections/new")} className="cursor-pointer">
                  <User className="mr-2 h-3.5 w-3.5" />
                  <span>Active Audits</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            className="gap-1.5 h-8 text-xs font-semibold"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Button>
        )}

        {/* High-priority Action Button with Magnetic Micro-Interaction */}
        {hasRole(["Inspector", "Admin"]) && (
          <MagneticButton distance={0.15}>
            <Button
              size="sm"
              onClick={() => navigate("/inspections/new")}
              className="shadow-xs font-semibold text-xs px-3 py-1.5 h-8 gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Inspection</span>
            </Button>
          </MagneticButton>
        )}
      </div>
    </header>
  )
}
