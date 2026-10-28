import React, { useState, useMemo } from 'react';
import {
  FileQuestion,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  X,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';
import { Subject, PYQuestion, QuestionType } from '../types';

interface PYQLibraryProps {
  subjects: Subject[];
  pyqs: PYQuestion[];
  onSavePYQ: (pyq: Partial<PYQuestion> & { id?: string }) => void;
  onDeletePYQ: (id: string) => void;
  onToggleImportant: (id: string) => void;
}

export const PYQLibrary: React.FC<PYQLibraryProps> = ({
  subjects,
  pyqs,
  onSavePYQ,
  onDeletePYQ,
  onToggleImportant
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyImportant, setOnlyImportant] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPYQ, setEditingPYQ] = useState<PYQuestion | null>(null);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unit, setUnit] = useState('Unit 1');
  const [year, setYear] = useState<number>(2024);
  const [questionType, setQuestionType] = useState<QuestionType>('Long Answer');
  const [marks, setMarks] = useState<number>(10);
  const [questionText, setQuestionText] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [formError, setFormError] = useState('');

  // Solution Viewer Modal
  const [viewingPYQ, setViewingPYQ] = useState<PYQuestion | null>(null);

  const QUESTION_TYPES: QuestionType[] = [
    'Long Answer',
    'Short Answer',
    'Numerical',
    'Conceptual',
    '2-Mark',
    '10-Mark'
  ];

  const UNITS = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
  const YEARS = [2024, 2023, 2022, 2021, 2020];

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  const filteredPYQs = useMemo(() => {
    return pyqs.filter((q) => {
      const matchesSearch =
        searchQuery === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.solution.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = selectedSubjectId === 'all' || q.subjectId === selectedSubjectId;
      const matchesUnit = selectedUnit === 'all' || q.unit === selectedUnit;
      const matchesYear = selectedYear === 'all' || q.year.toString() === selectedYear;
      const matchesType = selectedType === 'all' || q.questionType === selectedType;
      const matchesImportant = !onlyImportant || q.isImportant;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesUnit &&
        matchesYear &&
        matchesType &&
        matchesImportant
      );
    });
  }, [pyqs, searchQuery, selectedSubjectId, selectedUnit, selectedYear, selectedType, onlyImportant]);

  const handleOpenAdd = () => {
    setEditingPYQ(null);
    setTitle('');
    setSubjectId(subjects[0]?.id || '');
    setUnit('Unit 1');
    setYear(2024);
    setQuestionType('Long Answer');
    setMarks(10);
    setQuestionText('');
    setSolutionText('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: PYQuestion, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPYQ(q);
    setTitle(q.title);
    setSubjectId(q.subjectId);
    setUnit(q.unit);
    setYear(q.year);
    setQuestionType(q.questionType);
    setMarks(q.marks);
    setQuestionText(q.question);
    setSolutionText(q.solution);
    setFormError('');
    setIsModalOpen(true);
    if (viewingPYQ?.id === q.id) setViewingPYQ(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Question topic title is required.');
      return;
    }
    if (!subjectId) {
      setFormError('Please select a subject.');
      return;
    }
    if (!questionText.trim()) {
      setFormError('Question body cannot be empty.');
      return;
    }

    onSavePYQ({
      id: editingPYQ ? editingPYQ.id : undefined,
      title: title.trim(),
      subjectId,
      unit,
      year: Number(year) || 2024,
      questionType,
      marks: Number(marks) || 5,
      question: questionText.trim(),
      solution: solutionText.trim(),
      isImportant: editingPYQ ? editingPYQ.isImportant : false,
      isDemo: false
    });

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = (id: string, qTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`Delete question: "${qTitle}"?`)) {
      onDeletePYQ(id);
      if (viewingPYQ?.id === id) setViewingPYQ(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Previous-Year Questions (PYQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Past university exam questions categorized by subject, unit, year, and model solutions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
        <p className="leading-relaxed">
          <span className="font-semibold">Academic Integrity Notice:</span> Sample questions are provided for demonstration and exam revision practice. Always cross-verify solutions with your university syllabus and professor's marking guidelines.
        </p>
      </div>

      {/* 2. Search & Multi-Filters */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keywords, concepts, or formulas..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Units</option>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Exam Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Important Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setOnlyImportant(!onlyImportant)}
              className={`w-full p-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                onlyImportant
                  ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>High Weightage</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PYQ Cards List */}
      {filteredPYQs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileQuestion className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No previous year questions match
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Try adjusting your search keywords or unit/year filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPYQs.map((q) => {
            const subject = getSubject(q.subjectId);

            return (
              <div
                key={q.id}
                onClick={() => setViewingPYQ(q)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="font-semibold"
                        style={{ color: subject?.color || '#4f46e5' }}
                      >
                        {subject?.code || 'CS'} · {subject?.name || 'Subject'}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{q.unit}</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{q.year} Paper</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {q.questionType} ({q.marks} Marks)
                      </span>

                      {q.isDemo && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                            Demo Content
                          </span>
                        </>
                      )}
                    </div>

                    {/* Question Topic Header */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {q.title}
                    </h3>

                    {/* Question Body Excerpt */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {/* Actions & Star */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleImportant(q.id);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
                      title={q.isImportant ? 'Marked as Important' : 'Mark as Important'}
                      aria-label="Toggle importance"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          q.isImportant ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleOpenEdit(q, e)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit question"
                      aria-label="Edit question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteConfirm(q.id, q.title, e)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete question"
                      aria-label="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer preview */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {q.solution ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Model Solution Available
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">No solution saved yet</span>
                    )}
                  </div>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                    View Solution
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full Question & Solution Viewer Modal */}
      {viewingPYQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span
                    className="font-semibold"
                    style={{ color: getSubject(viewingPYQ.subjectId)?.color || '#4f46e5' }}
                  >
                    {getSubject(viewingPYQ.subjectId)?.name}
                  </span>
                  <span>·</span>
                  <span>{viewingPYQ.unit}</span>
                  <span>·</span>
                  <span className="font-mono">{viewingPYQ.year} Exam</span>
                  <span>·</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {viewingPYQ.questionType} ({viewingPYQ.marks} Marks)
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {viewingPYQ.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleImportant(viewingPYQ.id)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Toggle Important"
                >
                  <Star
                    className={`w-4 h-4 ${
                      viewingPYQ.isImportant ? 'fill-amber-400 text-amber-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => setViewingPYQ(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed">
              {/* Question Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  University Exam Question
                </span>
                <p className="font-medium text-slate-900 dark:text-white whitespace-pre-wrap">
                  {viewingPYQ.question}
                </p>
              </div>

              {/* Solution Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Model Solution & Marking Notes
                  </span>
                </div>

                {viewingPYQ.solution ? (
                  <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {viewingPYQ.solution}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                    No solution notes written yet. Click "Edit Question" to add your answer notes.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">
                {viewingPYQ.isDemo ? 'Demo Question for Study Practice' : 'User Added Question'}
              </span>
              <button
                onClick={() => handleOpenEdit(viewingPYQ)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                Edit Question & Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPYQ ? 'Edit PYQ' : 'Add Previous-Year Question'}
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
                  Question Concept / Topic Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prove that Dijkstra fails on graphs with negative edge weights"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type)}
                      className={`p-2 text-xs rounded-lg border text-center transition-colors ${
                        questionType === type
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Question Text *
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  placeholder="Enter the exact question statement..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model Answer / Solution / Key Concepts
                </label>
                <textarea
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  rows={5}
                  placeholder="Enter step-by-step model solution, derivation steps, or marking tips..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
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
                  {editingPYQ ? 'Save Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
