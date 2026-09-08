import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
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

  return (
    <div
      className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col transition-colors duration-200"
      id="app-body"
    >
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <main
          className="flex-1 overflow-y-auto bg-muted/20 transition-colors"
          id="main-content"
        >
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
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
      </AuthProvider>
    </ThemeProvider>
  )
}
