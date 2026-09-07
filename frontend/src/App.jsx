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
        <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100" id="app-body">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors" id="main-content">
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
