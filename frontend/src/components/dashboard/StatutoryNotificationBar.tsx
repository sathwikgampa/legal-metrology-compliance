import React, { useState } from "react"
import { ShieldAlert, AlertTriangle, Info, ChevronLeft, ChevronRight, X, ExternalLink, BellRing } from "lucide-react"
import { useNotifications, NotificationItem } from "../../context/NotificationContext"

interface StatutoryNotificationBarProps {
  onSelectDocket?: (docketId: string) => void
}

export default function StatutoryNotificationBar({
  onSelectDocket,
}: StatutoryNotificationBarProps): React.JSX.Element | null {
  const { notifications, isBannerVisible, dismissBanner, markAsRead } = useNotifications()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  if (!isBannerVisible || notifications.length === 0) return null

  // Ensure index remains in bounds if notifications change
  const activeIndex = Math.min(currentIndex, notifications.length - 1)
  const currentNotice: NotificationItem = notifications[activeIndex]

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : notifications.length - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev < notifications.length - 1 ? prev + 1 : 0))
  }

  const handleActionClick = () => {
    if (currentNotice.docketId && onSelectDocket) {
      markAsRead(currentNotice.id)
      onSelectDocket(currentNotice.docketId)
    }
  }

  const getSeverityStyle = (severity: NotificationItem["severity"]) => {
    switch (severity) {
      case "violation":
        return {
          container:
            "border-l-4 border-l-[#F3A6A6] bg-[#FDF2F2] dark:bg-[#261212] border-[#F3A6A6]/40 dark:border-[#3D1B1B]",
          badge:
            "bg-[#F3A6A6]/30 text-[#9B3B3B] dark:text-[#F3A6A6] border border-[#F3A6A6]/60",
          icon: <ShieldAlert className="w-4 h-4 text-[#9B3B3B] dark:text-[#F3A6A6] shrink-0" />,
          label: "STATUTORY ENFORCEMENT NOTICE",
        }
      case "review":
        return {
          container:
            "border-l-4 border-l-[#F5D08A] bg-[#FEF9EE] dark:bg-[#261B0A] border-[#F5D08A]/40 dark:border-[#3D2B10]",
          badge:
            "bg-[#F5D08A]/30 text-[#8A6416] dark:text-[#F5D08A] border border-[#F5D08A]/60",
          icon: <AlertTriangle className="w-4 h-4 text-[#8A6416] dark:text-[#F5D08A] shrink-0" />,
          label: "COMPLIANCE REVIEW REQUISITION",
        }
      case "info":
      default:
        return {
          container:
            "border-l-4 border-l-[#7C6FE0] bg-[#F4F3FD] dark:bg-[#1A1829] border-[#E3E1F0] dark:border-[#2E2A44]",
          badge:
            "bg-[#EDEBFB] dark:bg-[#2A2544] text-[#7C6FE0] dark:text-[#9589EC] border border-[#7C6FE0]/30",
          icon: <BellRing className="w-4 h-4 text-[#7C6FE0] dark:text-[#9589EC] shrink-0" />,
          label: "REGULATORY ADVISORY",
        }
    }
  }

  const style = getSeverityStyle(currentNotice.severity)

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 mb-6 transition-all duration-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${style.container}`}
      role="alert"
    >
      {/* Left: Icon + Title + Description */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-lg bg-white dark:bg-[#161424] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          {style.icon}
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}
            >
              {style.label}
            </span>
            <span className="font-bold text-xs text-[#3A3A45] dark:text-[#ECE9F6]">
              {currentNotice.title}
            </span>
            <span className="text-[11px] text-[#6E6E80] dark:text-[#A29DB8] font-mono">
              • {currentNotice.timestamp}
            </span>
          </div>

          <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-1 leading-relaxed line-clamp-2">
            {currentNotice.message}
          </p>
        </div>
      </div>

      {/* Right: Actions, Navigator & Dismiss Button */}
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E3E1F0]/50 dark:border-[#26223A]/50 w-full md:w-auto justify-between md:justify-end">
        {/* Cycle through notifications if more than 1 */}
        {notifications.length > 1 && (
          <div className="flex items-center gap-1 bg-white dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg px-2 py-1 shadow-xs text-xs font-mono text-[#6E6E80] dark:text-[#A29DB8]">
            <button
              onClick={handlePrev}
              className="p-0.5 hover:text-[#7C6FE0] rounded transition-colors cursor-pointer"
              title="Previous notification"
              aria-label="Previous notification"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] px-1 font-bold">
              {activeIndex + 1}/{notifications.length}
            </span>
            <button
              onClick={handleNext}
              className="p-0.5 hover:text-[#7C6FE0] rounded transition-colors cursor-pointer"
              title="Next notification"
              aria-label="Next notification"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Action Button */}
        {currentNotice.docketId && (
          <button
            onClick={handleActionClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#161424] border border-[#7C6FE0] hover:bg-[#EDEBFB] dark:hover:bg-[#2A2544] text-[#7C6FE0] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Review Docket</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}

        {/* Dismiss Button */}
        <button
          onClick={dismissBanner}
          className="p-1.5 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#3A3A45] dark:hover:text-[#ECE9F6] hover:bg-white dark:hover:bg-[#161424] rounded-lg border border-transparent hover:border-[#E3E1F0] dark:hover:border-[#26223A] transition-colors cursor-pointer"
          title="Dismiss notification bar"
          aria-label="Dismiss notification bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
