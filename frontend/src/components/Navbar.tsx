import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, Scale, Sun, Moon, Scan } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export interface NavbarProps {
  activeTab: string
  onSelectTab: (tab: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Navbar({
  activeTab = "Inspections",
  onSelectTab,
  searchQuery = "",
  onSearchChange,
}: NavbarProps): React.JSX.Element {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [notificationCount, setNotificationCount] = useState<number>(3)

  const tabs = ["Inspections", "Entities", "Analytics", "Settings"]

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 min-h-14 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 select-none transition-colors duration-200">
      {/* Left: Brand Crest & Title */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            Legal Metrology
          </span>
        </Link>

        {/* Center: Horizontal Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => onSelectTab(tab)}
                className={`px-3.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
              >
                {tab}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right: Officer Live Scanner, Search, Dark Mode Switch, Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Officer Live Scanner Launcher */}
        <button
          onClick={() => navigate('/inspections/new')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          title="Open Officer OCR Packaging Scanner"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Live Scanner</span>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 lg:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search GTIN, Docket..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </form>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Bell Notification */}
        <button
          onClick={() => setNotificationCount(0)}
          className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        {/* Profile Chip */}
        <div
          onClick={() => onSelectTab("Settings")}
          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
          title="Inspector S. Sharma"
        >
          SS
        </div>
      </div>
    </header>
  )
}
