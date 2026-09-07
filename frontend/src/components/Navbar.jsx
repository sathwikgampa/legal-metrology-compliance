import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Plus, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { setSimulateNetworkError, getSimulateNetworkError } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [errorSimulated, setErrorSimulated] = useState(getSimulateNetworkError());
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleError = () => {
    const next = !errorSimulated;
    setErrorSimulated(next);
    setSimulateNetworkError(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 min-h-16 px-6 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800 transition-colors">
      {/* Left: Logo & Title */}
      <Link to="/" className="flex items-center space-x-3 group text-inherit no-underline">
        <div className="text-blue-600 dark:text-blue-400 text-xl font-bold transition-transform group-hover:scale-105">⚖️</div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Legal Metrology Inspection System
          </h1>
          <p className="text-[10px] text-slate-400">Department of Consumer Affairs • Packaged Commodities (2011)</p>
        </div>
      </Link>

      {/* Center: Search Bar */}
      <div className="w-96 max-w-xs sm:max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search inspections, dockets, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 placeholder-slate-400 transition-colors"
          />
        </form>
      </div>

      {/* Right: Quick Controls, Dark Mode Switch, Profile */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={errorSimulated}
            onChange={handleToggleError}
            className="rounded border-slate-300 accent-blue-600 cursor-pointer"
          />
          <span className="hidden sm:inline">Simulate API Failure</span>
        </label>

        {/* Clean Dark Mode Toggle Switch Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          <span id="theme-icon" className="text-xs leading-none select-none">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs dark:bg-blue-900/50 dark:text-blue-300 select-none">
            SS
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              Inspector S. Sharma
            </div>
            <div className="text-[10px] text-slate-400">Zone 4 • Enforcement</div>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          type="button"
          onClick={() => navigate('/inspections/new')}
          className="bg-blue-600 text-white font-medium text-xs px-3 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer shadow-sm flex items-center space-x-1"
        >
          <span>+ New Inspection</span>
        </button>
      </div>
    </header>
  );
}
