import React, { createContext, useContext, useState, ReactNode } from "react"

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  severity: "violation" | "review" | "info" | "compliant"
  docketId?: string
  isRead: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    title: "Rule 32 Violation Notice Pending",
    message:
      "Crispy Munch Ltd. (INS-8901) — Mandatory MRP declaration omitted under Section 18. SLA countdown: 14h remaining.",
    timestamp: "12 mins ago",
    severity: "violation",
    docketId: "INS-8901",
    isRead: false,
  },
  {
    id: "NOTIF-02",
    title: "Physical Audit Requisitioned",
    message:
      "Botanica Care India (INS-8903) — Optical glare on Net Quantity declaration requires field inspector verification.",
    timestamp: "1 hour ago",
    severity: "review",
    docketId: "INS-8903",
    isRead: false,
  },
  {
    id: "NOTIF-03",
    title: "Statutory Enforcement Advisory",
    message:
      "National Legal Metrology Portal: Annual statutory packaged commodity verification cycle active for Zone 4.",
    timestamp: "3 hours ago",
    severity: "info",
    isRead: false,
  },
]

interface NotificationContextType {
  notifications: NotificationItem[]
  unreadCount: number
  isBannerVisible: boolean
  targetDocketId: string | null
  setTargetDocketId: (id: string | null) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  dismissBanner: () => void
  restoreBanner: () => void
  addNotification: (notif: Omit<NotificationItem, "id" | "isRead">) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true)
  const [targetDocketId, setTargetDocketId] = useState<string | null>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const dismissBanner = () => {
    setIsBannerVisible(false)
  }

  const restoreBanner = () => {
    setIsBannerVisible(true)
  }

  const addNotification = (notif: Omit<NotificationItem, "id" | "isRead">) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      isRead: false,
    }
    setNotifications((prev) => [newItem, ...prev])
    setIsBannerVisible(true)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isBannerVisible,
        targetDocketId,
        setTargetDocketId,
        markAsRead,
        markAllAsRead,
        clearAll,
        dismissBanner,
        restoreBanner,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
