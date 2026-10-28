import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  CalendarCheck2,
  Hourglass,
  Timer,
  BarChart3,
  UserCog,
  Award,
  X,
  Sparkles
} from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  state: AppState;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  state,
  isOpenMobile,
  onCloseMobile
}) => {
  const pendingTasks = state.tasks.filter((t) => !t.isCompleted).length;
  const upcomingExams = state.exams.filter((e) => {
    const diff = Math.ceil((new Date(e.examDate).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
    return diff >= 0;
  }).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'notes',
      label: 'Subjects & Notes',
      icon: BookOpen,
      badge: state.notes.length
    },
    {
      id: 'pyq',
      label: 'PYQ Library',
      icon: FileQuestion,
      badge: state.pyqs.length
    },
    {
      id: 'planner',
      label: 'Revision Planner',
      icon: CalendarCheck2,
      badge: pendingTasks > 0 ? `${pendingTasks} pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      id: 'countdown',
      label: 'Exam Countdown',
      icon: Hourglass,
      badge: upcomingExams > 0 ? `${upcomingExams} soon` : null,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
    },
    {
      id: 'pomodoro',
      label: 'Pomodoro Timer',
      icon: Timer,
      badge: `${state.pomodoroSessionsCount} done`
    },
    {
      id: 'analytics',
      label: 'Study Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: UserCog,
      badge: null
    },
    {
      id: 'competition',
      label: 'Competition Kit',
      icon: Award,
      badge: 'Pitch & Code',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
    }
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between p-4">
      <div>
        {/* Onboarding Context Kicker */}
        <div className="px-3 py-2 mb-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Study Hub Workspace</span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 leading-snug">
            {state.profile.branch || 'Engineering'} · {state.profile.semester || 'Semester'}
          </p>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[11px] font-medium rounded shrink-0 tabular-nums ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between text-[11px]">
          <span>Data Storage</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Local (Offline)</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          CampusMate — Built for Students
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed 260px) */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop and Off-canvas */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">CampusMate Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};
