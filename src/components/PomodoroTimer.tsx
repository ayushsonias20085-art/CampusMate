import React, { useState, useEffect } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
  Coffee,
  BrainCircuit
} from 'lucide-react';
import { PomodoroSettings, RevisionTask, Subject } from '../types';
import { playCompletionChime } from '../services/storage';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  sessionsCount: number;
  tasks: RevisionTask[];
  subjects: Subject[];
  onSessionComplete: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  onUpdateSettings: (settings: PomodoroSettings) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  settings,
  sessionsCount,
  tasks,
  subjects,
  onSessionComplete,
  onUpdateSettings
}) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  // Mode durations in seconds
  const getDuration = (m: 'focus' | 'shortBreak' | 'longBreak') => {
    if (m === 'focus') return settings.focusDuration * 60;
    if (m === 'shortBreak') return settings.shortBreak * 60;
    return settings.longBreak * 60;
  };

  const totalDuration = getDuration(mode);

  // Switch modes
  const handleSwitchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Completed!
            setIsRunning(false);
            if (settings.soundEnabled) {
              playCompletionChime();
            }
            onSessionComplete(mode);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, settings.soundEnabled, onSessionComplete]);

  // Handle play / pause / reset
  const handleTogglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalDuration);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  // Circular progress calculation
  const progressFraction = (totalDuration - timeLeft) / totalDuration;
  const strokeDashoffset = 100 - progressFraction * 100;

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* 1. Header Toolbar */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Pomodoro Focus Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Science-backed interval study system with offline auditory feedback and task tracking.
        </p>
      </div>

      {/* 2. Main Timer Card */}
      <div className="p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Focus ({settings.focusDuration}m)</span>
          </button>
          <button
            onClick={() => handleSwitchMode('shortBreak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break ({settings.shortBreak}m)</span>
          </button>
          <button
            onClick={() => handleSwitchMode('longBreak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              mode === 'longBreak'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Long Break ({settings.longBreak}m)</span>
          </button>
        </div>

        {/* Circular Progress Ring with Digital Countdown */}
        <div className="relative my-8 sm:my-10 flex items-center justify-center">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className={`transition-all duration-300 ${
                mode === 'focus'
                  ? 'stroke-indigo-600 dark:stroke-indigo-500'
                  : mode === 'shortBreak'
                  ? 'stroke-emerald-600 dark:stroke-emerald-500'
                  : 'stroke-sky-600 dark:stroke-sky-500'
              }`}
              strokeWidth="10"
              strokeDasharray="276"
              strokeDashoffset={`${(strokeDashoffset / 100) * 276}`}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Numbers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tighter tabular-nums text-slate-900 dark:text-white">
              {formattedMinutes}:{formattedSeconds}
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {mode === 'focus'
                ? isRunning
                  ? 'Deep Focus In Progress'
                  : 'Ready to Study'
                : 'Rest & Recharge'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Reset Timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-2 text-base ${
              mode === 'focus'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                : mode === 'shortBreak'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft === 0 ? 'Start Again' : 'Start Focus'}</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
            }
            className={`p-3.5 rounded-2xl border transition-colors ${
              settings.soundEnabled
                ? 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={settings.soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
            aria-label="Toggle sound chime"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Task Binding Selector */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-md">
          <label className="block text-center text-xs font-semibold text-slate-500 mb-2">
            Target Focus Topic
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
          >
            <option value="">-- General Revision Session --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.topic} ({t.priority} Priority)
              </option>
            ))}
          </select>

          {currentTask && (
            <p className="mt-2 text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
              Focusing on: {currentTask.topic}
            </p>
          )}
        </div>
      </div>

      {/* 3. Session Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-medium text-slate-500">Sessions Completed Today</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {sessionsCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-medium text-slate-500">Total Focused Time</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {Math.round((sessionsCount * settings.focusDuration) / 60 * 10) / 10} hrs
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-medium text-slate-500">Target Daily Streak</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            4 / 4 Goals
          </div>
        </div>
      </div>
    </div>
  );
};
