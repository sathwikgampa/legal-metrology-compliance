import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, Scale } from "lucide-react"

export default function Navbar(): React.JSX.Element {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>("Inspections")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const tabs = ["Inspections", "Entities", "Analytics", "Settings"]

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 h-14 min-h-14 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Brand Crest & Title */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            Legal Metrology
          </span>
        </Link>

        {/* Center: Horizontal Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/80">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right: Search, Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search GTIN, Docket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-colors"
          />
        </form>

        {/* Bell Notification */}
        <button className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        </button>

        {/* Profile Chip */}
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors select-none">
          SS
        </div>
      </div>
    </header>
  )
}
