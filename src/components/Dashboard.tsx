import React from 'react';
import {
  BookOpen,
  FileQuestion,
  CalendarCheck2,
  Hourglass,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Timer
} from 'lucide-react';
import { AppState, Note, RevisionTask, Exam } from '../types';

interface DashboardProps {
  state: AppState;
  onNavigate: (tab: string) => void;
  onOpenNewNote: () => void;
  onOpenNewExam: () => void;
  onOpenNewTask: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onSelectNote: (note: Note) => void;
  onLoadDemoData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onNavigate,
  onOpenNewNote,
  onOpenNewExam,
  onOpenNewTask,
  onToggleTaskComplete,
  onSelectNote,
  onLoadDemoData
}) => {
  const { profile, subjects, notes, pyqs, tasks, exams, pomodoroSessionsCount } = state;

  // Study progress calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pending revision topics
  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  // Calculate upcoming exams (sorted by date ascending)
  const todayMs = new Date().setHours(0, 0, 0, 0);
  const validUpcomingExams = [...exams]
    .map((exam) => {
      const examDateMs = new Date(exam.examDate).getTime();
      const diffDays = Math.ceil((examDateMs - todayMs) / (1000 * 60 * 60 * 24));
      return { ...exam, diffDays };
    })
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const nearestExam = validUpcomingExams.find((e) => e.diffDays >= 0) || validUpcomingExams[0];

  // Today's suggested study tasks (overdue or high priority or due soon)
  const todayTasks = [...tasks]
    .sort((a, b) => {
      // Pending first, then High priority, then deadline
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      const priorityWeight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 4);

  // Recently added or updated notes
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  const isEmpty = subjects.length === 0 && notes.length === 0 && tasks.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to CampusMate!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your personal smart student study hub is ready. Start by adding your college subjects, study notes, and upcoming exams, or load our complete sample dataset.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onLoadDemoData}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Load Sample College Data
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Add First Subject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner & Profile Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <span>Campus Study Dashboard</span>
              <span>·</span>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Hello, {profile.displayName || 'Student'}!
            </h1>
            <p className="text-sm text-indigo-200 leading-relaxed">
              {profile.branch} ({profile.semester}) {profile.collegeName ? `· ${profile.collegeName}` : ''}.
              You have <span className="font-semibold text-white">{pendingTasks.length} pending revision topics</span> and <span className="font-semibold text-white">{validUpcomingExams.filter(e => e.diffDays >= 0).length} upcoming exams</span> scheduled.
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewNote}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/15 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/15 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Revision Task</span>
            </button>
            <button
              onClick={() => onNavigate('pomodoro')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Focus Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Subjects */}
        <div
          onClick={() => onNavigate('notes')}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {subjects.length}
            </span>
            <span className="text-xs text-slate-400">enrolled</span>
          </div>
        </div>

        {/* Card 2: Notes */}
        <div
          onClick={() => onNavigate('notes')}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Notes</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {notes.length}
            </span>
            <span className="text-xs text-slate-400">saved</span>
          </div>
        </div>

        {/* Card 3: Pending Revision */}
        <div
          onClick={() => onNavigate('planner')}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Topics</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">to revise</span>
          </div>
        </div>

        {/* Card 4: Upcoming Exams */}
        <div
          onClick={() => onNavigate('countdown')}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Exams</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {validUpcomingExams.filter((e) => e.diffDays >= 0).length}
            </span>
            <span className="text-xs text-slate-400">scheduled</span>
          </div>
        </div>

        {/* Card 5: Overall Progress */}
        <div
          onClick={() => onNavigate('analytics')}
          className="col-span-2 sm:col-span-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Progress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-400">{completedTasks}/{totalTasks} tasks</span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Nearest Exam Countdown Hero Card */}
      {nearestExam && (
        <div className="p-5 sm:p-6 rounded-2xl border border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-r from-indigo-50/90 via-white to-slate-50/80 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-xs font-bold leading-none uppercase">
                {new Date(nearestExam.examDate).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-base font-extrabold leading-none mt-0.5 font-mono">
                {new Date(nearestExam.examDate).getDate()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                <span>Next Upcoming Target Exam</span>
                <span>·</span>
                <span>{getSubject(nearestExam.subjectId)?.name || 'Subject'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {nearestExam.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {nearestExam.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {nearestExam.time}
                  </span>
                )}
                {nearestExam.location && (
                  <span>Venue: {nearestExam.location}</span>
                )}
                {nearestExam.targetScore && (
                  <span>Target: {nearestExam.targetScore}</span>
                )}
              </div>
            </div>
          </div>

          {/* Countdown Clock Tag */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Time Remaining</span>
            <div className="text-right">
              {nearestExam.diffDays > 1 ? (
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {nearestExam.diffDays} Days Left
                </span>
              ) : nearestExam.diffDays === 1 ? (
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
                  Tomorrow!
                </span>
              ) : nearestExam.diffDays === 0 ? (
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 animate-pulse">
                  Today!
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  Exam Passed
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate('countdown')}
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>View all exams</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Split Grid: Today's Tasks & Recently Added Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Today's Revision Tasks */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Priority Revision
                </h2>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Full Planner</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No revision tasks added yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                        task.isCompleted
                          ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => onToggleTaskComplete(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        aria-label={task.isCompleted ? 'Mark pending' : 'Mark completed'}
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="font-medium truncate max-w-[140px]"
                            style={{ color: subject?.color || '#6366f1' }}
                          >
                            {subject?.name || 'General'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span
                            className={`font-semibold ${
                              task.priority === 'High'
                                ? 'text-rose-600 dark:text-rose-400'
                                : task.priority === 'Medium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm font-medium mt-0.5 text-slate-800 dark:text-slate-200 truncate ${
                            task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.topic}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                        {task.deadline}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Rule-based priority queue</span>
            <button
              onClick={onOpenNewTask}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Topic
            </button>
          </div>
        </div>

        {/* Right Column: Recently Added Notes */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Study Notes
                </h2>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All Notes</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentNotes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No study notes written yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentNotes.map((note) => {
                  const subject = getSubject(note.subjectId);
                  return (
                    <div
                      key={note.id}
                      onClick={() => onSelectNote(note)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium truncate max-w-[150px]"
                            style={{ color: subject?.color || '#0284c7' }}
                          >
                            {subject?.name || 'General'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                            {note.topic}
                          </span>
                        </div>
                        {note.isDemo && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                            Demo Content
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {note.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {note.content.replace(/[#*`]/g, '').slice(0, 100)}...
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>{notes.length} notes across {subjects.length} subjects</span>
            <button
              onClick={onOpenNewNote}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Create Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
