import React, { useState, useMemo } from 'react';
import {
  Hourglass,
  Plus,
  Clock,
  MapPin,
  Target,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Subject, Exam } from '../types';

interface ExamCountdownProps {
  subjects: Subject[];
  exams: Exam[];
  onSaveExam: (exam: Partial<Exam> & { id?: string }) => void;
  onDeleteExam: (id: string) => void;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  subjects,
  exams,
  onSaveExam,
  onDeleteExam
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const todayMs = new Date().setHours(0, 0, 0, 0);

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  // Sorted exams by date ascending
  const sortedExams = useMemo(() => {
    return [...exams].map((e) => {
      const examMs = new Date(e.examDate).getTime();
      const diffDays = Math.ceil((examMs - todayMs) / (1000 * 60 * 60 * 24));
      return { ...e, diffDays };
    }).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  }, [exams, todayMs]);

  const handleOpenAdd = () => {
    setEditingExam(null);
    setName('');
    setSubjectId(subjects[0]?.id || '');
    // Default exam date 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExamDate(d.toISOString().split('T')[0]);
    setTime('10:00 AM');
    setLocation('Main Examination Hall');
    setTargetScore('85+');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setName(exam.name);
    setSubjectId(exam.subjectId);
    setExamDate(exam.examDate);
    setTime(exam.time || '');
    setLocation(exam.location || '');
    setTargetScore(exam.targetScore || '');
    setNotes(exam.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Exam title is required.');
      return;
    }
    if (!subjectId) {
      setFormError('Please select a subject.');
      return;
    }
    if (!examDate) {
      setFormError('Valid exam date is required.');
      return;
    }

    // Validate that the date is a real parseable date
    const parsed = new Date(examDate);
    if (isNaN(parsed.getTime())) {
      setFormError('Please provide a valid calendar date.');
      return;
    }

    onSaveExam({
      id: editingExam ? editingExam.id : undefined,
      name: name.trim(),
      subjectId,
      examDate,
      time: time.trim(),
      location: location.trim(),
      targetScore: targetScore.trim(),
      notes: notes.trim()
    });

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = (id: string, examName: string) => {
    if (window.confirm(`Delete exam record: "${examName}"?`)) {
      onDeleteExam(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Exam Countdown & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time day calculations, exam venues, syllabus scopes, and target scores.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Exam</span>
        </button>
      </div>

      {/* 2. Exam Cards List */}
      {sortedExams.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Hourglass className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No exams scheduled
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Stay on top of your academic calendar by adding your mid-term and semester finals.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            Add Your First Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedExams.map((exam) => {
            const subject = getSubject(exam.subjectId);
            const { diffDays } = exam;

            const isPassed = diffDays < 0;
            const isToday = diffDays === 0;
            const isTomorrow = diffDays === 1;
            const isUrgent = diffDays > 1 && diffDays <= 5;

            return (
              <div
                key={exam.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPassed
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isToday
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 shadow-sm'
                    : isTomorrow || isUrgent
                    ? 'bg-amber-50/30 dark:bg-amber-950/15 border-amber-300 dark:border-amber-900/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar with Subject & Countdown Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: subject?.color || '#4f46e5' }}
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {subject?.code || 'EXAM'} · {subject?.name || 'Subject'}
                      </span>
                    </div>

                    {/* Countdown Tag */}
                    <div className="shrink-0">
                      {isPassed ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Exam Passed
                        </span>
                      ) : isToday ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white animate-pulse">
                          Today!
                        </span>
                      ) : isTomorrow ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white">
                          Tomorrow!
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300">
                          {diffDays} Days Left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                    {exam.name}
                  </h3>

                  {/* Meta Details */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono tabular-nums">{exam.examDate}</span>
                    </div>

                    {exam.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{exam.time}</span>
                      </div>
                    )}

                    {exam.location && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{exam.location}</span>
                      </div>
                    )}

                    {exam.targetScore && (
                      <div className="flex items-center gap-1.5 col-span-2 text-indigo-600 dark:text-indigo-400 font-medium">
                        <Target className="w-3.5 h-3.5 shrink-0" />
                        <span>Target: {exam.targetScore}</span>
                      </div>
                    )}
                  </div>

                  {exam.notes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {exam.notes}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">
                    {new Date(exam.examDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(exam)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit exam"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(exam.id, exam.name)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingExam ? 'Edit Exam Record' : 'Schedule New Exam'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. End-Semester Theory Examination"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time / Slot
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hall / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Hall 3, Block B"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Score
                  </label>
                  <input
                    type="text"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="90+ or Grade A"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Coverage / Exam Guidelines
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Units 1 through 4, brings scientific calculator, emphasis on proofs..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {editingExam ? 'Save Exam' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
