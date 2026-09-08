import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import DashboardPage from "./pages/DashboardPage"
import NewInspectionPage from "./pages/NewInspectionPage"
import InspectionResultPage from "./pages/InspectionResultPage"
import HistoryPage from "./pages/HistoryPage"
import ReviewPage from "./pages/ReviewPage"
import "./App.css"

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("Inspections")
  const [activeView, setActiveView] = useState<string>("all")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div
          className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col transition-colors duration-200"
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
            <main className="flex-1 overflow-hidden" id="main-content">
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
      </BrowserRouter>
    </ThemeProvider>
  )
}
