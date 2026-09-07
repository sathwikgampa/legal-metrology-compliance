import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import NewInspectionPage from './pages/NewInspectionPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardPage onStartNewInspection={() => setActiveTab('new-inspection')} />
        )}
        {activeTab === 'new-inspection' && (
          <NewInspectionPage onFinish={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'history' && (
          <HistoryPage />
        )}
      </main>
    </div>
  );
}
