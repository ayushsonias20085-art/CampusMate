import React from 'react';
import { Sun, Moon, GraduationCap, Menu, Timer, Clock } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  profile: StudentProfile;
  activeTab: string;
  onNavigate: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  pomodoroActive: boolean;
  pomodoroFormattedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  onNavigate,
  theme,
  onToggleTheme,
  onToggleMobileMenu,
  pomodoroActive,
  pomodoroFormattedTime
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                CampusMate
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('notes')}
            className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'notes' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Notes & Subjects
          </button>
          <button
            onClick={() => onNavigate('pyq')}
            className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'pyq' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            PYQ Library
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'planner' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Revision Planner
          </button>
          <button
            onClick={() => onNavigate('countdown')}
            className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'countdown' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Exams
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Pomodoro Floating Indicator */}
          <button
            onClick={() => onNavigate('pomodoro')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              pomodoroActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
            title="Open Pomodoro Timer"
          >
            {pomodoroActive ? (
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
            ) : (
              <Timer className="w-3.5 h-3.5" />
            )}
            <span className="font-mono tabular-nums">{pomodoroFormattedTime}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Profile Pill */}
          <button
            onClick={() => onNavigate('profile')}
            className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              {profile.displayName.charAt(0) || 'S'}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
              {profile.displayName.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
