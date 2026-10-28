/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Note, Subject, PYQuestion, RevisionTask, Exam, StudentProfile, PomodoroSettings } from './types';
import { INITIAL_STATE } from './data/sampleData';
import { loadAppState, saveAppState, playCompletionChime } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { NotesManager } from './components/NotesManager';
import { PYQLibrary } from './components/PYQLibrary';
import { RevisionPlanner } from './components/RevisionPlanner';
import { ExamCountdown } from './components/ExamCountdown';
import { PomodoroTimer } from './components/PomodoroTimer';
import { StudyAnalytics } from './components/StudyAnalytics';
import { ProfileSettings } from './components/ProfileSettings';
import { CompetitionKit } from './components/CompetitionKit';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Note Reader modal direct bridge
  const [selectedNoteForReading, setSelectedNoteForReading] = useState<Note | null>(null);

  // Background Pomodoro Timer state
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState<number>(25 * 60);
  const [pomodoroIsRunning, setPomodoroIsRunning] = useState<boolean>(false);
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to LocalStorage whenever state changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Sync theme class to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Profile Update
  const handleUpdateProfile = (profile: StudentProfile) => {
    setState((prev) => ({ ...prev, profile }));
  };

  // Reset to Demo Data
  const handleResetDemoData = () => {
    setState({ ...INITIAL_STATE });
    showToast('Default college sample records restored.', 'info');
  };

  // Wipe All Data
  const handleWipeData = () => {
    setState({
      profile: {
        displayName: 'Student',
        semester: 'Semester 1',
        branch: 'General Studies',
        collegeName: '',
        targetGpa: ''
      },
      subjects: [],
      notes: [],
      pyqs: [],
      tasks: [],
      exams: [],
      pomodoroSessionsCount: 0,
      pomodoroSettings: {
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        soundEnabled: true
      },
      theme: state.theme
    });
  };

  // Backup Import
  const handleImportBackup = (importedState: AppState) => {
    setState(importedState);
  };

  // --- Subject Actions ---
  const handleSaveSubject = (subjectData: Partial<Subject> & { id?: string }) => {
    if (subjectData.id) {
      // Edit
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) => (s.id === subjectData.id ? { ...s, ...subjectData } as Subject : s))
      }));
      showToast('Subject updated.', 'success');
    } else {
      // Add
      const newSubject: Subject = {
        id: 'sub-' + Date.now(),
        name: subjectData.name || 'New Subject',
        code: subjectData.code || 'SUB',
        color: subjectData.color || '#4F46E5',
        description: subjectData.description || ''
      };
      setState((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject]
      }));
      showToast(`Subject "${newSubject.name}" created.`, 'success');
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId),
      notes: prev.notes.filter((n) => n.subjectId !== subjectId),
      tasks: prev.tasks.filter((t) => t.subjectId !== subjectId),
      exams: prev.exams.filter((e) => e.subjectId !== subjectId)
    }));
    showToast('Subject and related items removed.', 'info');
  };

  // --- Note Actions ---
  const handleSaveNote = (noteData: Partial<Note> & { id?: string }) => {
    if (noteData.id) {
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === noteData.id
            ? { ...n, ...noteData, updatedAt: new Date().toISOString() } as Note
            : n
        )
      }));
      showToast('Note updated.', 'success');
    } else {
      const newNote: Note = {
        id: 'note-' + Date.now(),
        title: noteData.title || 'Untitled Note',
        subjectId: noteData.subjectId || prevSubjectsFallback(),
        topic: noteData.topic || 'General',
        content: noteData.content || '',
        isFavorite: false,
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setState((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes]
      }));
      showToast('Note saved successfully.', 'success');
    }
  };

  const prevSubjectsFallback = () => state.subjects[0]?.id || 'sub-1';

  const handleDeleteNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId)
    }));
    showToast('Note deleted.', 'info');
  };

  const handleToggleFavoriteNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n))
    }));
  };

  // --- PYQ Actions ---
  const handleSavePYQ = (pyqData: Partial<PYQuestion> & { id?: string }) => {
    if (pyqData.id) {
      setState((prev) => ({
        ...prev,
        pyqs: prev.pyqs.map((q) => (q.id === pyqData.id ? { ...q, ...pyqData } as PYQuestion : q))
      }));
      showToast('Question updated.', 'success');
    } else {
      const newPYQ: PYQuestion = {
        id: 'pyq-' + Date.now(),
        title: pyqData.title || 'Past Question',
        subjectId: pyqData.subjectId || prevSubjectsFallback(),
        unit: pyqData.unit || 'Unit 1',
        year: pyqData.year || 2024,
        questionType: pyqData.questionType || 'Long Answer',
        marks: pyqData.marks || 10,
        question: pyqData.question || '',
        solution: pyqData.solution || '',
        isImportant: false,
        isDemo: false,
        createdAt: new Date().toISOString()
      };
      setState((prev) => ({
        ...prev,
        pyqs: [newPYQ, ...prev.pyqs]
      }));
      showToast('PYQ question added to library.', 'success');
    }
  };

  const handleDeletePYQ = (id: string) => {
    setState((prev) => ({
      ...prev,
      pyqs: prev.pyqs.filter((q) => q.id !== id)
    }));
    showToast('Question deleted.', 'info');
  };

  const handleToggleImportantPYQ = (id: string) => {
    setState((prev) => ({
      ...prev,
      pyqs: prev.pyqs.map((q) => (q.id === id ? { ...q, isImportant: !q.isImportant } : q))
    }));
  };

  // --- Task Actions ---
  const handleSaveTask = (taskData: Partial<RevisionTask> & { id?: string }) => {
    if (taskData.id) {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData } as RevisionTask : t))
      }));
      showToast('Revision task updated.', 'success');
    } else {
      const newTask: RevisionTask = {
        id: 'task-' + Date.now(),
        subjectId: taskData.subjectId || prevSubjectsFallback(),
        topic: taskData.topic || 'Revision Topic',
        priority: taskData.priority || 'High',
        deadline: taskData.deadline || new Date().toISOString().split('T')[0],
        isCompleted: false,
        estimatedHours: taskData.estimatedHours || 2,
        notes: taskData.notes || ''
      };
      setState((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      showToast('Revision task scheduled.', 'success');
    }
  };

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
    showToast('Task removed.', 'info');
  };

  const handleToggleTaskComplete = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === id) {
          const nextState = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    }));
  };

  // --- Exam Actions ---
  const handleSaveExam = (examData: Partial<Exam> & { id?: string }) => {
    if (examData.id) {
      setState((prev) => ({
        ...prev,
        exams: prev.exams.map((e) => (e.id === examData.id ? { ...e, ...examData } as Exam : e))
      }));
      showToast('Exam schedule updated.', 'success');
    } else {
      const newExam: Exam = {
        id: 'exam-' + Date.now(),
        name: examData.name || 'Target Exam',
        subjectId: examData.subjectId || prevSubjectsFallback(),
        examDate: examData.examDate || new Date().toISOString().split('T')[0],
        time: examData.time || '10:00 AM',
        location: examData.location || '',
        targetScore: examData.targetScore || '',
        notes: examData.notes || ''
      };
      setState((prev) => ({
        ...prev,
        exams: [...prev.exams, newExam]
      }));
      showToast('Exam date scheduled.', 'success');
    }
  };

  const handleDeleteExam = (id: string) => {
    setState((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== id)
    }));
    showToast('Exam record removed.', 'info');
  };

  // --- Pomodoro Session Finish ---
  const handlePomodoroSessionComplete = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    if (mode === 'focus') {
      setState((prev) => ({
        ...prev,
        pomodoroSessionsCount: prev.pomodoroSessionsCount + 1
      }));
      showToast('Focus session complete! Excellent work. Time for a break.', 'success');
    } else {
      showToast('Break finished! Ready to resume focus?', 'info');
    }
  };

  const handleUpdatePomodoroSettings = (settings: PomodoroSettings) => {
    setState((prev) => ({ ...prev, pomodoroSettings: settings }));
    showToast('Timer settings updated.', 'success');
  };

  // Format header timer
  const headerMinutes = Math.floor(pomodoroSecondsLeft / 60);
  const headerSeconds = pomodoroSecondsLeft % 60;
  const headerFormatted = `${headerMinutes < 10 ? '0' : ''}${headerMinutes}:${headerSeconds < 10 ? '0' : ''}${headerSeconds}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* 1. Header (Follows Top Bar Contract) */}
      <Header
        profile={state.profile}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        theme={state.theme}
        onToggleTheme={handleToggleTheme}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        pomodoroActive={pomodoroIsRunning}
        pomodoroFormattedTime={headerFormatted}
      />

      {/* 2. Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          state={state}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
          {activeTab === 'dashboard' && (
            <Dashboard
              state={state}
              onNavigate={setActiveTab}
              onOpenNewNote={() => setActiveTab('notes')}
              onOpenNewExam={() => setActiveTab('countdown')}
              onOpenNewTask={() => setActiveTab('planner')}
              onToggleTaskComplete={handleToggleTaskComplete}
              onSelectNote={(note) => {
                setSelectedNoteForReading(note);
                setActiveTab('notes');
              }}
              onLoadDemoData={handleResetDemoData}
            />
          )}

          {activeTab === 'notes' && (
            <NotesManager
              subjects={state.subjects}
              notes={state.notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onToggleFavorite={handleToggleFavoriteNote}
              onSaveSubject={handleSaveSubject}
              onDeleteSubject={handleDeleteSubject}
              selectedNoteToView={selectedNoteForReading}
              onCloseViewModal={() => setSelectedNoteForReading(null)}
            />
          )}

          {activeTab === 'pyq' && (
            <PYQLibrary
              subjects={state.subjects}
              pyqs={state.pyqs}
              onSavePYQ={handleSavePYQ}
              onDeletePYQ={handleDeletePYQ}
              onToggleImportant={handleToggleImportantPYQ}
            />
          )}

          {activeTab === 'planner' && (
            <RevisionPlanner
              subjects={state.subjects}
              tasks={state.tasks}
              onSaveTask={handleSaveTask}
              onDeleteTask={handleDeleteTask}
              onToggleTaskComplete={handleToggleTaskComplete}
            />
          )}

          {activeTab === 'countdown' && (
            <ExamCountdown
              subjects={state.subjects}
              exams={state.exams}
              onSaveExam={handleSaveExam}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {activeTab === 'pomodoro' && (
            <PomodoroTimer
              settings={state.pomodoroSettings}
              sessionsCount={state.pomodoroSessionsCount}
              tasks={state.tasks}
              subjects={state.subjects}
              onSessionComplete={handlePomodoroSessionComplete}
              onUpdateSettings={handleUpdatePomodoroSettings}
            />
          )}

          {activeTab === 'analytics' && <StudyAnalytics state={state} />}

          {activeTab === 'profile' && (
            <ProfileSettings
              state={state}
              onUpdateProfile={handleUpdateProfile}
              theme={state.theme}
              onToggleTheme={handleToggleTheme}
              onResetDemoData={handleResetDemoData}
              onImportBackup={handleImportBackup}
              onWipeData={handleWipeData}
              showToast={showToast}
            />
          )}

          {activeTab === 'competition' && <CompetitionKit />}
        </main>
      </div>

      {/* 3. Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 4. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CampusMate — Built for Students</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Offline & Client-Side</span>
            <span>·</span>
            <span>LocalStorage Persistence</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('competition')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Competition Pitch & Source Kit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
