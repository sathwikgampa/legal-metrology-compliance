import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Moon, Sun, ChevronDown, User, Shield, LogOut, Plus } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { setSimulateNetworkError, getSimulateNetworkError } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MagneticButton from "@/components/react-bits/MagneticButton"

export default function Navbar(): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [errorSimulated, setErrorSimulated] = useState<boolean>(getSimulateNetworkError())
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleToggleError = (checked: boolean) => {
    setErrorSimulated(checked)
    setSimulateNetworkError(checked)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-card border-b border-border h-16 min-h-16 px-6 flex items-center justify-between transition-colors sticky top-0 z-40 shadow-xs">
      {/* Left: Logo & Title */}
      <Link to="/" className="flex items-center space-x-3 group text-foreground no-underline select-none">
        <div className="text-primary text-xl font-bold transition-transform group-hover:scale-105">⚖️</div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">
            Legal Metrology Inspection System
          </h1>
          <p className="text-[10px] text-muted-foreground font-medium">
            Department of Consumer Affairs • Packaged Commodities (2011)
          </p>
        </div>
      </Link>

      {/* Center: Search Bar with shadcn Input */}
      <div className="w-96 max-w-xs sm:max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search inspections, dockets, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-muted/40 focus-visible:bg-background h-8 text-xs border-border"
          />
        </form>
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
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
          >
            Simulate API Failure
          </Label>
        </div>

        {/* Clean Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-md border-border text-foreground hover:bg-muted"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Officer Profile with shadcn DropdownMenu */}
        <div className="border-l border-border pl-3 sm:pl-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-2 py-1 h-auto hover:bg-muted rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs ring-1 ring-primary/20 select-none">
                  SS
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-foreground leading-tight">Inspector S. Sharma</div>
                  <div className="text-[10px] text-muted-foreground">Zone 4 • Enforcement</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold text-xs">Inspector S. Sharma</div>
                <div className="text-[10px] text-muted-foreground font-normal">Officer ID: LM-ZONE4-8821</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/history")}>
                <Shield className="mr-2 h-3.5 w-3.5 text-primary" />
                <span>Zone 4 Jurisdiction</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/inspections/new")}>
                <User className="mr-2 h-3.5 w-3.5" />
                <span>Active Audits</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* High-priority Action Button with Magnetic Micro-Interaction */}
        <MagneticButton distance={0.15}>
          <Button
            size="sm"
            onClick={() => navigate("/inspections/new")}
            className="shadow-sm font-semibold text-xs px-3 py-1.5 h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Inspection</span>
          </Button>
        </MagneticButton>
      </div>
    </header>
  )
}
