import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Lock, Shield } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim() || !password.trim()) {
      setError('Please enter a valid Officer ID and password.');
      return;
    }
    setError(null);
    // Simulate successful sign-in
    navigate('/');
  };

  const handleSocialLogin = (provider: string) => {
    setError(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      
      {/* Left Panel (60% width on Desktop) - Dark Charcoal/Navy Background */}
      <div className="lg:w-[60%] w-full bg-slate-900 text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden min-h-[320px] lg:min-h-screen">
        
        {/* Static Architecture Lines Pattern Background (No cartoon/stock photos) */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-slate-400"
        >
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Top-Left: Logo and Wordmark */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white text-slate-900 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white">
                Legal Metrology Directorate
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Department of Consumer Affairs • Govt. of India
              </div>
            </div>
          </div>
        </div>

        {/* Center/Bottom: Institutional Tagline */}
        <div className="relative z-10 max-w-lg my-12 lg:my-0 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-slate-700 bg-slate-800/80 rounded-md text-xs text-slate-300 font-mono">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Enforcement Portal v2.4
          </div>

          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white leading-tight">
            Compliance enforcement under the Legal Metrology Act, 2009
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Standardizing packaging declarations, net quantity verifications, and statutory compounding inspections across national consumer markets.
          </p>
        </div>

        {/* Bottom Metadata Footer */}
        <div className="relative z-10 text-xs text-slate-500 pt-6 border-t border-slate-800 flex items-center justify-between">
          <span>Official Government Enforcement Authority</span>
          <span className="font-mono">SECURE-SSL-256</span>
        </div>
      </div>

      {/* Right Panel (40% width on Desktop) - White Background & Login Form */}
      <div className="lg:w-[40%] w-full bg-white dark:bg-slate-950 p-8 lg:p-14 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Officer sign in
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your official credentials or authentication provider to access the inspection portal.
            </p>
          </div>

          {/* Validation Status Error Message (Status colors only) */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-md text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="officerId" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email or Officer ID
              </label>
              <input
                id="officerId"
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. officer.sharma@gov.in or LM-8842"
                className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors"
              />
            </div>

            {/* Solid Black Primary Sign in Button */}
            <button
              type="submit"
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Sign in
            </button>
          </form>

          {/* Plain Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="absolute bg-white dark:bg-slate-950 px-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              or continue with
            </span>
          </div>

          {/* Outlined Provider Social Login Buttons */}
          <div className="space-y-2.5">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-700 dark:text-slate-300" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.21 5.39-7.84 5.39-4.72 0-8.58-3.92-8.58-8.74s3.86-8.74 8.58-8.74c2.69 0 4.49 1.15 5.52 2.14l2.6-2.6C18.96 1.84 16.03 1 12.48 1 6.27 1 1.28 5.98 1.28 12.18s4.99 11.18 11.2 11.18c6.48 0 10.77-4.56 10.77-10.96 0-.74-.08-1.31-.19-1.87h-10.58z" />
              </svg>
              Continue with Google
            </button>

            {/* Microsoft Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Microsoft')}
              className="w-full h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-700 dark:text-slate-300" viewBox="0 0 24 24">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* Muted Legal Warning Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              Access restricted to authorized enforcement personnel. All sign-ins are logged.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
