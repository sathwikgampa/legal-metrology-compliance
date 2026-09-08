import React, { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Bell,
  Scale,
  Sun,
  Moon,
  LogIn,
  Menu,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  BellRing,
  Trash2,
  RotateCcw,
  ExternalLink,
  Check,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useNotifications, NotificationItem } from "../context/NotificationContext"

export interface NavbarProps {
  activeTab: string
  onSelectTab: (tab: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Navbar({
  activeTab = "Inspections",
  onSelectTab,
  searchQuery = "",
  onSearchChange,
  onToggleSidebar,
}: NavbarProps): React.JSX.Element {
  const { isDarkMode, toggleTheme } = useTheme()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    isBannerVisible,
    restoreBanner,
    setTargetDocketId,
  } = useNotifications()

  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const tabs = ["Inspections", "Entities", "Analytics", "Settings"]

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false)
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNotificationsOpen])

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id)
    if (notif.docketId) {
      setTargetDocketId(notif.docketId)
      onSelectTab("Inspections")
      navigate("/")
      setIsNotificationsOpen(false)
    }
  }

  const getSeverityIcon = (severity: NotificationItem["severity"]) => {
    switch (severity) {
      case "violation":
        return <ShieldAlert className="w-4 h-4 text-[#9B3B3B] dark:text-[#F3A6A6] shrink-0" />
      case "review":
        return <AlertTriangle className="w-4 h-4 text-[#8A6416] dark:text-[#F5D08A] shrink-0" />
      case "info":
      default:
        return <BellRing className="w-4 h-4 text-[#7C6FE0] dark:text-[#9589EC] shrink-0" />
    }
  }

  return (
    /* TOP NAV: Subtle lavender-gray in light (#FBFAFE), deep indigo-slate in dark (#161424) */
    <header className="sticky top-0 z-40 bg-[#FBFAFE] dark:bg-[#161424] border-b border-[#E3E1F0] dark:border-[#26223A] h-16 px-4 lg:px-8 flex items-center justify-between transition-colors duration-200 select-none shadow-xs">
      {/* Left: Hamburger menu + Brand with soft indigo accent (#7C6FE0) & text */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
        {/* Sidebar Toggle Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          title="Toggle Navigation Menu & Filters"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

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

        {/* Notification Bell Icon & Floating Popover Drawer */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              isNotificationsOpen
                ? "bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0]"
                : "text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#7C6FE0] hover:bg-[#F2F1F9] dark:hover:bg-[#232035]"
            }`}
            title="Statutory Notifications & Advisories"
            aria-label="View statutory notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C6FE0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7C6FE0]"></span>
              </span>
            )}
          </button>

          {/* Floating Dropdown Drawer */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FBFAFE] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#E3E1F0] dark:border-[#26223A] flex items-center justify-between bg-[#F2F1F9]/50 dark:bg-[#1C192C]/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#3A3A45] dark:text-[#ECE9F6]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-[#7C6FE0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-[#7C6FE0] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E3E1F0]/60 dark:divide-[#26223A]/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6E6E80] dark:text-[#A29DB8]">
                    No statutory notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.isRead ? "bg-[#EDEBFB]/30 dark:bg-[#2A2544]/20" : ""
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] shadow-xs shrink-0 mt-0.5">
                        {getSeverityIcon(n.severity)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs text-[#3A3A45] dark:text-[#ECE9F6] truncate">
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-[#6E6E80] dark:text-[#A29DB8] shrink-0 font-mono">
                            {n.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-1 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>

                        {n.docketId && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#7C6FE0]">
                            <span>Inspect {n.docketId}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#7C6FE0] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-2.5 border-t border-[#E3E1F0] dark:border-[#26223A] bg-[#F2F1F9]/50 dark:bg-[#1C192C]/50 flex items-center justify-between text-xs">
                {!isBannerVisible && (
                  <button
                    onClick={restoreBanner}
                    className="text-[11px] font-semibold text-[#7C6FE0] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Dashboard Banner</span>
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="ml-auto text-[11px] text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#9B3B3B] dark:hover:text-[#F3A6A6] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

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
