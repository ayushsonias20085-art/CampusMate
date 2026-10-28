import React, { useState, useMemo } from 'react';
import {
  CalendarCheck2,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  X,
  Filter,
  Flame,
  Check,
  TrendingUp,
  Info
} from 'lucide-react';
import { Subject, RevisionTask, TaskPriority } from '../types';

interface RevisionPlannerProps {
  subjects: Subject[];
  tasks: RevisionTask[];
  onSaveTask: (task: Partial<RevisionTask> & { id?: string }) => void;
  onDeleteTask: (id: string) => void;
  onToggleTaskComplete: (id: string) => void;
}

export const RevisionPlanner: React.FC<RevisionPlannerProps> = ({
  subjects,
  tasks,
  onSaveTask,
  onDeleteTask,
  onToggleTaskComplete
}) => {
  // Filters & State
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [smartSortMode, setSmartSortMode] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RevisionTask | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [topic, setTopic] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const todayMs = new Date().setHours(0, 0, 0, 0);

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  // Calculate days left for a task
  const getDaysLeft = (deadlineStr: string) => {
    const deadlineMs = new Date(deadlineStr).getTime();
    return Math.ceil((deadlineMs - todayMs) / (1000 * 60 * 60 * 24));
  };

  // Rule-based weight calculation for smart study suggestions
  const calculateSmartWeight = (task: RevisionTask): number => {
    if (task.isCompleted) return -1000;
    const daysLeft = getDaysLeft(task.deadline);
    let weight = 0;

    // Overdue tasks get highest priority boost
    if (daysLeft < 0) weight += 500 + Math.abs(daysLeft) * 10;
    else if (daysLeft === 0) weight += 400; // Due today
    else if (daysLeft <= 2) weight += 300 - daysLeft * 30; // Due within 2 days
    else if (daysLeft <= 7) weight += 150 - daysLeft * 10;
    else weight += Math.max(0, 50 - daysLeft);

    // Priority multiplier
    if (task.priority === 'High') weight += 200;
    else if (task.priority === 'Medium') weight += 100;
    else weight += 50;

    return weight;
  };

  // Filtered & sorted tasks
  const processedTasks = useMemo(() => {
    let list = tasks.filter((task) => {
      const daysLeft = getDaysLeft(task.deadline);
      const isOverdue = !task.isCompleted && daysLeft < 0;

      if (filterSubjectId !== 'all' && task.subjectId !== filterSubjectId) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      if (filterStatus === 'pending' && task.isCompleted) return false;
      if (filterStatus === 'completed' && !task.isCompleted) return false;
      if (filterStatus === 'overdue' && !isOverdue) return false;

      return true;
    });

    if (smartSortMode) {
      list.sort((a, b) => calculateSmartWeight(b) - calculateSmartWeight(a));
    } else {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    return list;
  }, [tasks, filterSubjectId, filterStatus, filterPriority, smartSortMode]);

  // Overall stats
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = totalCount - completedCount;
  const overdueCount = tasks.filter((t) => !t.isCompleted && getDaysLeft(t.deadline) < 0).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Open Add
  const handleOpenAdd = () => {
    setEditingTask(null);
    setSubjectId(subjects[0]?.id || '');
    setTopic('');
    setPriority('High');
    // Default deadline 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDeadline(d.toISOString().split('T')[0]);
    setEstimatedHours(2);
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (task: RevisionTask) => {
    setEditingTask(task);
    setSubjectId(task.subjectId);
    setTopic(task.topic);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setEstimatedHours(task.estimatedHours || 2);
    setNotes(task.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setFormError('Topic or chapter name is required.');
      return;
    }
    if (!subjectId) {
      setFormError('Please select a subject.');
      return;
    }
    if (!deadline) {
      setFormError('Valid revision target deadline is required.');
      return;
    }

    onSaveTask({
      id: editingTask ? editingTask.id : undefined,
      subjectId,
      topic: topic.trim(),
      priority,
      deadline,
      estimatedHours: Number(estimatedHours) || 2,
      notes: notes.trim(),
      isCompleted: editingTask ? editingTask.isCompleted : false
    });

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = (id: string, topicName: string) => {
    if (window.confirm(`Delete revision task: "${topicName}"?`)) {
      onDeleteTask(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Smart Revision Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Rule-based weighted scheduling with automated urgency detection and priority queuing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSmartSortMode(!smartSortMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              smartSortMode
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Sort by deterministic urgency and priority rules"
          >
            <Flame className={`w-3.5 h-3.5 ${smartSortMode ? 'text-indigo-600 fill-indigo-500' : ''}`} />
            <span>Smart Priority Mode</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Transparent Algorithm Notice */}
      <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
        <p className="leading-relaxed">
          <span className="font-semibold">Scheduling Engine Disclosure:</span> CampusMate calculates revision order using a transparent, rule-based algorithmic priority queue: <code>Weight = Urgency Score (Overdue: +500, Due Today: +400, &lt;3 Days: +300) + Priority Multiplier (High: +200, Med: +100)</code>. No non-deterministic black-box LLM scheduling is used.
        </p>
      </div>

      {/* 2. Overall Progress & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revision Topics</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Topics</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Topics</span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overdue Topics</span>
          <div className={`mt-2 text-2xl font-bold font-mono tabular-nums ${overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
            {overdueCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Overall Syllabus Revision Progress
          </span>
          <span className="font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
            {progressPct}% ({completedCount} of {totalCount} completed)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'overdue'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        <select
          value={filterSubjectId}
          onChange={(e) => setFilterSubjectId(e.target.value)}
          className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} - {s.name}
            </option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* 4. Task List */}
      {processedTasks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CalendarCheck2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No revision tasks in this view
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Add topics or change your status/priority filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedTasks.map((task) => {
            const subject = getSubject(task.subjectId);
            const daysLeft = getDaysLeft(task.deadline);
            const isOverdue = !task.isCompleted && daysLeft < 0;
            const isDueToday = !task.isCompleted && daysLeft === 0;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.isCompleted
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80'
                    : isOverdue
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : isDueToday
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left check and details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    aria-label={task.isCompleted ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="font-semibold"
                        style={{ color: subject?.color || '#4f46e5' }}
                      >
                        {subject?.code || 'CS'} · {subject?.name || 'Subject'}
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
                      {task.estimatedHours && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimatedHours} hrs est.
                          </span>
                        </>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-bold text-slate-900 dark:text-white leading-snug ${
                        task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.topic}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right deadline badge & actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] font-mono tabular-nums text-slate-400">
                      Target: {task.deadline}
                    </div>
                    {task.isCompleted ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Completed
                      </span>
                    ) : isOverdue ? (
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? 'day' : 'days'} overdue
                      </span>
                    ) : isDueToday ? (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        Due Today!
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {daysLeft} days remaining
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(task.id, task.topic)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete task"
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

      {/* 5. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingTask ? 'Edit Revision Task' : 'Add Revision Task'}
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
                  Revision Topic / Chapter *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Graph Traversals: BFS, DFS and Topological Sort"
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
                    Revision Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="High">High (High Weightage / Exam Soon)</option>
                    <option value="Medium">Medium (Standard Revision)</option>
                    <option value="Low">Low (Supplementary Topic)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Deadline *
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Study Hours
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    max="40"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Notes / References
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Solve LeetCode problems 207 and 210, re-read textbook chapter 4..."
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
                  {editingTask ? 'Save Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
