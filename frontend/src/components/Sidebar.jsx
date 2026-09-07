import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-2.5 text-xs font-medium px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
    }`;

  const scenarioLinkClass = ({ isActive }) =>
    `flex items-center space-x-2 text-xs py-1 px-1.5 rounded transition-colors ${
      isActive
        ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-slate-100'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col space-y-6 dark:bg-slate-900 dark:border-slate-800 transition-colors shrink-0 select-none">
      {/* Primary Navigation */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
        <nav className="space-y-1">
          <NavLink to="/" end className={navLinkClass}>
            <span>📊</span> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/inspections/new" className={navLinkClass}>
            <span>📝</span> <span>New Inspection</span>
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            <span>⏳</span> <span>Inspection History</span>
          </NavLink>
        </nav>
      </div>

      {/* Test Scenarios Section */}
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Test Scenarios (Mock Cases)</p>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <li>
            <NavLink to="/inspections/INS-2024-001" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>1. Fully Compliant</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-002" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>2. Potential Violation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-003" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>3. Needs Review</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-004" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
              <span>4. Poor Image Quality</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-005" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
              <span>5. Low OCR Confidence</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-006" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0"></span>
              <span>6. Multiple Bounding Boxes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspections/INS-2024-007" className={scenarioLinkClass}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
              <span>7. Multiple Package Images</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Sidebar Footer & System Status */}
      <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800 text-[10px] text-slate-400 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-medium">
          <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
          <span>Engine: Active (Rules 2011)</span>
        </div>
        <p className="text-[9px] leading-tight text-slate-400/80">
          Statutory inspection assistant. Officer determination is legally binding.
        </p>
      </div>
    </aside>
  );
}
