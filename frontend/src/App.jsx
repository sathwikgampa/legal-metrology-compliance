import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import NewInspectionPage from './pages/NewInspectionPage';
import InspectionResultPage from './pages/InspectionResultPage';
import HistoryPage from './pages/HistoryPage';
import ReviewPage from './pages/ReviewPage';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <div className="app-main-layout">
            <Sidebar />
            <main className="app-content-viewport" id="main-content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/inspections/new" element={<NewInspectionPage />} />
                <Route path="/inspections/:id" element={<InspectionResultPage />} />
                <Route path="/inspections/:id/review" element={<ReviewPage />} />
                <Route path="/history" element={<HistoryPage />} />
                {/* Fallback to Dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
