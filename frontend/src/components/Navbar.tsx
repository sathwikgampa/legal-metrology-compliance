import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Scale, Sun, Moon, LogIn } from "lucide-react"
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
  const { isDarkMode, toggleTheme } = useTheme()
  const [notificationCount, setNotificationCount] = useState<number>(3)

  const tabs = ["Inspections", "Entities", "Analytics", "Settings"]

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    /* TOP NAV: Subtle lavender-gray in light (#FBFAFE), deep indigo-slate in dark (#1A1926) */
    <header className="sticky top-0 z-40 bg-[#FBFAFE] dark:bg-[#1C1A2B] border-b border-[#E3E1F0] dark:border-[#2E2A44] h-16 px-4 lg:px-8 flex items-center justify-between transition-colors duration-200 select-none shadow-xs">
      {/* Left: Brand with soft indigo accent (#7C6FE0) & text */}
      <div className="flex items-center gap-6 lg:gap-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-8 h-8 rounded-lg bg-[#7C6FE0] text-white flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(124,111,224,0.3)] transition-transform group-hover:scale-105">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#3A3A45] dark:text-[#ECE9F6]">
            Legal Metrology
          </span>
        </Link>

        {/* Navigation Category Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => onSelectTab(tab)}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] font-bold shadow-xs"
                    : "text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] font-semibold"
                }`}
              >
                {tab}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Center: Pill-shaped search bar */}
      <div className="flex-1 max-w-lg mx-4 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E80] dark:text-[#A29DB8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search compliance items, instruments, certificates, GTIN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-[#F2F1F9] dark:bg-[#232035] border border-[#E3E1F0] dark:border-[#2E2A44] rounded-full text-xs text-[#3A3A45] dark:text-[#ECE9F6] placeholder-[#6E6E80] dark:placeholder-[#A29DB8] focus:outline-none focus:bg-[#FDFDFF] dark:focus:bg-[#1C1A2B] focus:border-[#7C6FE0] focus:ring-2 focus:ring-[#7C6FE0]/20 transition-all"
          />
        </form>
      </div>

      {/* Right: Notifications, Dark mode toggle, Sign in & User Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] rounded-full transition-colors cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#F5D08A]" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell Icon */}
        <button
          onClick={() => setNotificationCount(0)}
          className="relative p-2 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#232035] rounded-full transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C6FE0]"></span>
          )}
        </button>

        {/* Sign In Secondary Button */}
        <Link
          to="/login"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDFDFF] dark:bg-[#1C1A2B] border border-[#7C6FE0] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2544] text-[#7C6FE0] text-xs font-semibold rounded-lg transition-colors no-underline shadow-xs"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </Link>

        {/* Profile Avatar */}
        <div
          onClick={() => onSelectTab("Settings")}
          className="w-8 h-8 rounded-full bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(124,111,224,0.3)] transition-all select-none"
          title="Officer S. Sharma - Account & Settings"
        >
          SS
        </div>
      </div>
    </header>
  )
}
