import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import HowItWorksPage from "./pages/HowItWorksPage"
import FAQPage from "./pages/FAQPage"
import ForOfficialsPage from "./pages/ForOfficialsPage"
import ForOrganizationsPage from "./pages/ForOrganizationsPage"
import DashboardPage from "./pages/DashboardPage"
import NewInspectionPage from "./pages/NewInspectionPage"
import InspectionResultPage from "./pages/InspectionResultPage"
import HistoryPage from "./pages/HistoryPage"
import ReviewPage from "./pages/ReviewPage"
import "./App.css"

function AppLayout(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("Inspections")
  const [activeView, setActiveView] = useState<string>("all")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

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
            {/* Compliance Dashboard - Accessible to all roles */}
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
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

            {/* New Inspection Creation - Restricted to Inspector and Admin */}
            <Route
              path="/inspections/new"
              element={
                <ProtectedRoute allowedRoles={["Inspector", "Admin"]}>
                  <NewInspectionPage />
                </ProtectedRoute>
              }
            />

            {/* Inspection Details & Evidence - Accessible to all roles */}
            <Route path="/inspections/:id" element={<InspectionResultPage />} />

            {/* Statutory Order / Review - Restricted to Inspector, Director, Admin */}
            <Route
              path="/inspections/:id/review"
              element={
                <ProtectedRoute allowedRoles={["Inspector", "Director", "Admin"]}>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />

            {/* Inspection Ledger & History - Accessible to all roles */}
            <Route path="/history" element={<HistoryPage />} />

            {/* Fallback to Dashboard */}
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
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/for-officials" element={<ForOfficialsPage />} />
              <Route path="/for-organizations" element={<ForOrganizationsPage />} />

              {/* Protected Statutory Application Shell */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
