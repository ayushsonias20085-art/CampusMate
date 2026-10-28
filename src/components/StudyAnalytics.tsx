import React, { useMemo } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { AppState } from '../types';

interface StudyAnalyticsProps {
  state: AppState;
}

export const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ state }) => {
  const { subjects, tasks, notes, pyqs, pomodoroSessionsCount, pomodoroSettings } = state;

  // Real calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  const todayMs = new Date().setHours(0, 0, 0, 0);
  const overdueTasks = pendingTasks.filter((t) => {
    return Math.ceil((new Date(t.deadline).getTime() - todayMs) / (1000 * 60 * 60 * 24)) < 0;
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Subject-wise calculations
  const subjectBreakdown = useMemo(() => {
    return subjects.map((sub) => {
      const subTasks = tasks.filter((t) => t.subjectId === sub.id);
      const subNotes = notes.filter((n) => n.subjectId === sub.id);
      const subPyqs = pyqs.filter((q) => q.subjectId === sub.id);
      const subCompleted = subTasks.filter((t) => t.isCompleted).length;
      const progress = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;

      return {
        ...sub,
        totalTasks: subTasks.length,
        completedTasks: subCompleted,
        notesCount: subNotes.length,
        pyqsCount: subPyqs.length,
        progress
      };
    });
  }, [subjects, tasks, notes, pyqs]);

  // Real Weekly Task Distribution (derived from completedAt timestamps or deadlines)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    completedTasks.forEach((t) => {
      const d = t.completedAt ? new Date(t.completedAt) : new Date(t.deadline);
      const dayIndex = (d.getDay() + 6) % 7; // Map Mon=0 to Sun=6
      if (dayIndex >= 0 && dayIndex < 7) {
        counts[dayIndex]++;
      }
    });
    return counts;
  }, [completedTasks]);

  const maxWeekly = Math.max(1, ...weeklyDistribution);

  // SVG Donut calculation
  const completedAngle = (completedTasks.length / (totalTasks || 1)) * 360;
  const overdueAngle = (overdueTasks.length / (totalTasks || 1)) * 360;
  const pendingStandardAngle = 360 - completedAngle - overdueAngle;

  // Total study hours estimated
  const totalHoursLogged = Math.round(
    completedTasks.reduce((acc, t) => acc + (t.estimatedHours || 2), 0) +
    (pomodoroSessionsCount * pomodoroSettings.focusDuration) / 60
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Study Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Empirical metrics derived exclusively from your local revision activity and completed topics.
        </p>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Overall Task Completion</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {completionRate}%
          </div>
          <span className="text-xs text-slate-400">{completedTasks.length} of {totalTasks} finished</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Total Hours Invested</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            ~{totalHoursLogged} hrs
          </div>
          <span className="text-xs text-slate-400">Tasks + Pomodoro</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Focus Sessions Completed</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {pomodoroSessionsCount}
          </div>
          <span className="text-xs text-slate-400">{pomodoroSessionsCount * 25} minutes</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Overdue Topics</span>
          <div className={`mt-2 text-2xl font-bold font-mono tabular-nums ${overdueTasks.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
            {overdueTasks.length}
          </div>
          <span className="text-xs text-slate-400">needs attention</span>
        </div>
      </div>

      {/* 3. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Donut Breakdown (Completed / Pending / Overdue) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Task Status Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current state of scheduled syllabus revision topics.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              {/* SVG Donut */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  {/* Completed (Emerald) */}
                  {totalTasks > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      className="stroke-emerald-500"
                      strokeWidth="3.8"
                      strokeDasharray={`${(completedTasks.length / totalTasks) * 100} ${100 - (completedTasks.length / totalTasks) * 100}`}
                      strokeDashoffset="0"
                      fill="none"
                    />
                  )}
                  {/* Overdue (Rose) */}
                  {overdueTasks.length > 0 && totalTasks > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      className="stroke-rose-500"
                      strokeWidth="3.8"
                      strokeDasharray={`${(overdueTasks.length / totalTasks) * 100} ${100 - (overdueTasks.length / totalTasks) * 100}`}
                      strokeDashoffset={`${-((completedTasks.length / totalTasks) * 100)}`}
                      fill="none"
                    />
                  )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {completionRate}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
                </div>
              </div>

              {/* Legend with tabular data */}
              <div className="space-y-3 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Completed</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {completedTasks.length} ({Math.round((completedTasks.length / (totalTasks || 1)) * 100)}%)
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">In Progress</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {pendingTasks.length - overdueTasks.length}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Overdue</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-rose-600 dark:text-rose-400">
                    {overdueTasks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center sm:text-left">
            Calculated dynamically against current system date.
          </div>
        </div>

        {/* Chart 2: Weekly Task Activity Bar Chart */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Activity Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Task completions and target deadlines across this week.
            </p>

            {/* SVG / CSS Bar Chart */}
            <div className="mt-8 flex items-end justify-between gap-2 h-44 px-2">
              {dayNames.map((day, idx) => {
                const count = weeklyDistribution[idx];
                const heightPercent = Math.max(12, Math.round((count / maxWeekly) * 100));

                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {count}
                    </span>
                    <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end p-0.5 overflow-hidden">
                      <div
                        className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-all duration-300 group-hover:bg-indigo-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center sm:text-left">
            Total completed tasks: <strong className="text-slate-700 dark:text-slate-300 font-mono">{completedTasks.length}</strong>
          </div>
        </div>
      </div>

      {/* 4. Subject-wise Progress Bars */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Subject-Wise Syllabus Coverage
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Track individual course notes, previous year questions, and task completion percentages.
        </p>

        <div className="space-y-4">
          {subjectBreakdown.map((sub) => (
            <div key={sub.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sub.code} · {sub.name}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-slate-400">
                    {sub.notesCount} notes, {sub.pyqsCount} PYQs
                  </span>
                </div>
                <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                  {sub.progress}% ({sub.completedTasks}/{sub.totalTasks} topics)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${sub.progress}%`,
                    backgroundColor: sub.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
