import React from "react"
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
  const [activeView, setActiveView] = React.useState<string>("all")
  const [activeCategory, setActiveCategory] = React.useState<string>("all")

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div
          className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col"
          id="app-body"
        >
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeView={activeView}
              onSelectView={setActiveView}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
            <main className="flex-1 overflow-hidden" id="main-content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
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
