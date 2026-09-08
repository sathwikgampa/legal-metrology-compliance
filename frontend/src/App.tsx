import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { NotificationProvider } from "./context/NotificationContext"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import DashboardPage from "./pages/DashboardPage"
import NewInspectionPage from "./pages/NewInspectionPage"
import InspectionResultPage from "./pages/InspectionResultPage"
import HistoryPage from "./pages/HistoryPage"
import ReviewPage from "./pages/ReviewPage"
import LoginPage from "./pages/LoginPage"
import "./App.css"

function AppContent() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<string>("Inspections")
  const [activeView, setActiveView] = useState<string>("all")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const isLoginPage = location.pathname === "/login"

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <div
      className="bg-[#F8F7FC] dark:bg-[#0F0E17] text-[#3A3A45] dark:text-[#ECE9F6] font-sans antialiased min-h-screen flex flex-col transition-colors duration-200"
      id="app-body"
    >
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Slide-over Sidebar Drawer with Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab)
            setIsSidebarOpen(false)
          }}
          activeView={activeView}
          onSelectView={setActiveView}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      <div className="flex flex-1 overflow-hidden w-full">
        <main className="flex-1 overflow-hidden w-full" id="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  activeTab={activeTab}
                  activeView={activeView}
                  activeCategory={activeCategory}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/inspections/new" element={<NewInspectionPage />} />
            <Route path="/inspections/:id" element={<InspectionResultPage />} />
            <Route path="/inspections/:id/review" element={<ReviewPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  )
}
