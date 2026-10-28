import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  FileText,
  FolderPlus,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Subject, Note } from '../types';
import { downloadNoteAsText } from '../services/storage';

interface NotesManagerProps {
  subjects: Subject[];
  notes: Note[];
  onSaveNote: (note: Partial<Note> & { id?: string }) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onSaveSubject: (subject: Partial<Subject> & { id?: string }) => void;
  onDeleteSubject: (subjectId: string) => void;
  selectedNoteToView?: Note | null;
  onCloseViewModal?: () => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  subjects,
  notes,
  onSaveNote,
  onDeleteNote,
  onToggleFavorite,
  onSaveSubject,
  onDeleteSubject,
  selectedNoteToView,
  onCloseViewModal
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Note Modal (Create / Edit)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubjectId, setNoteSubjectId] = useState('');
  const [noteTopic, setNoteTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteError, setNoteError] = useState('');

  // Subject Modal (Manage Subjects)
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectColor, setSubjectColor] = useState('#4F46E5');
  const [subjectDesc, setSubjectDesc] = useState('');
  const [subjectError, setSubjectError] = useState('');

  // Note Reader Modal
  const [viewingNote, setViewingNote] = useState<Note | null>(selectedNoteToView || null);

  // Sync external note to view if provided
  React.useEffect(() => {
    if (selectedNoteToView) {
      setViewingNote(selectedNoteToView);
    }
  }, [selectedNoteToView]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = selectedSubjectId === 'all' || note.subjectId === selectedSubjectId;
      const matchesFav = !onlyFavorites || note.isFavorite;

      return matchesSearch && matchesSubject && matchesFav;
    });
  }, [notes, searchQuery, selectedSubjectId, onlyFavorites]);

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  // Open Add Note
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteSubjectId(subjects[0]?.id || '');
    setNoteTopic('');
    setNoteContent('');
    setNoteError('');
    setIsNoteModalOpen(true);
  };

  // Open Edit Note
  const handleOpenEditNote = (note: Note, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteSubjectId(note.subjectId);
    setNoteTopic(note.topic);
    setNoteContent(note.content);
    setNoteError('');
    setIsNoteModalOpen(true);
    if (viewingNote?.id === note.id) {
      setViewingNote(null);
    }
  };

  // Save Note with validation
  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      setNoteError('Note title is required.');
      return;
    }
    if (!noteSubjectId) {
      setNoteError('Please select a subject.');
      return;
    }
    if (!noteContent.trim()) {
      setNoteError('Note content cannot be empty.');
      return;
    }

    onSaveNote({
      id: editingNote ? editingNote.id : undefined,
      title: noteTitle.trim(),
      subjectId: noteSubjectId,
      topic: noteTopic.trim() || 'General',
      content: noteContent.trim(),
      isFavorite: editingNote ? editingNote.isFavorite : false,
      isDemo: false
    });

    setIsNoteModalOpen(false);
  };

  // Open Subject Modal
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectName('');
    setSubjectCode('');
    setSubjectColor('#4F46E5');
    setSubjectDesc('');
    setSubjectError('');
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectName(sub.name);
    setSubjectCode(sub.code);
    setSubjectColor(sub.color);
    setSubjectDesc(sub.description || '');
    setSubjectError('');
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setSubjectError('Subject name is required.');
      return;
    }
    if (!subjectCode.trim()) {
      setSubjectError('Subject code is required (e.g. CS201).');
      return;
    }

    onSaveSubject({
      id: editingSubject ? editingSubject.id : undefined,
      name: subjectName.trim(),
      code: subjectCode.trim().toUpperCase(),
      color: subjectColor,
      description: subjectDesc.trim()
    });

    setIsSubjectModalOpen(false);
  };

  // Delete subject confirmation
  const handleDeleteSubjectConfirm = (subId: string, subName: string) => {
    const relatedNotesCount = notes.filter((n) => n.subjectId === subId).length;
    const warning = relatedNotesCount > 0
      ? `Deleting "${subName}" will also remove ${relatedNotesCount} note(s) and any related tasks. Are you sure?`
      : `Delete subject "${subName}"?`;
    if (window.confirm(warning)) {
      onDeleteSubject(subId);
      if (selectedSubjectId === subId) setSelectedSubjectId('all');
    }
  };

  // Delete note confirmation
  const handleDeleteNoteConfirm = (noteId: string, noteTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
      onDeleteNote(noteId);
      if (viewingNote?.id === noteId) setViewingNote(null);
    }
  };

  const calculateReadingStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { words, minutes };
  };

  const COLOR_PALETTES = ['#4F46E5', '#0284C7', '#7C3AED', '#0D9488', '#D97706', '#E11D48', '#2563EB', '#059669'];

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Subjects & Study Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize notes by subject, search topic concepts, and export clean revision sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddSubject}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Manage Subjects</span>
          </button>
          <button
            onClick={handleOpenAddNote}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* 2. Subjects Horizontal Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Subjects ({notes.length})
        </button>

        {subjects.map((sub) => {
          const count = notes.filter((n) => n.subjectId === sub.id).length;
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 border ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-200 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
              <span>{sub.name}</span>
              <span className="text-[11px] font-mono text-slate-400">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, topic, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
            onlyFavorites
              ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 font-semibold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : ''}`} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* 4. Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No notes found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            {searchQuery || onlyFavorites || selectedSubjectId !== 'all'
              ? 'Try adjusting your search query or subject filters.'
              : 'Get started by creating your first study note.'}
          </p>
          <button
            onClick={handleOpenAddNote}
            className="mt-4 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            Create New Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const subject = getSubject(note.subjectId);
            const { words, minutes } = calculateReadingStats(note.content);

            return (
              <div
                key={note.id}
                onClick={() => setViewingNote(note)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Header: Subject, Demo tag, Favorite toggle */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: subject?.color || '#4f46e5' }}
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {subject?.code || 'SUB'}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-slate-500 truncate max-w-[120px]">
                        {note.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {note.isDemo && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          Demo
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(note.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                        title={note.isFavorite ? 'Remove from favorites' : 'Mark favorite'}
                        aria-label="Toggle favorite"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            note.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Body Preview */}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {note.content.replace(/[#*`]/g, '').slice(0, 160)}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>{minutes} min read</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{words} words</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadNoteAsText(
                          note.title,
                          subject?.name || 'Subject',
                          note.topic,
                          note.content
                        );
                      }}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Download as .txt"
                      aria-label="Download plain text note"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleOpenEditNote(note, e)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Edit note"
                      aria-label="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteNoteConfirm(note.id, note.title, e)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Full Note Reader Modal */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span
                    className="font-semibold"
                    style={{ color: getSubject(viewingNote.subjectId)?.color || '#4f46e5' }}
                  >
                    {getSubject(viewingNote.subjectId)?.name || 'Subject'}
                  </span>
                  <span>·</span>
                  <span>{viewingNote.topic}</span>
                  {viewingNote.isDemo && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">Sample Note</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {viewingNote.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleFavorite(viewingNote.id)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Toggle Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      viewingNote.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() =>
                    downloadNoteAsText(
                      viewingNote.title,
                      getSubject(viewingNote.subjectId)?.name || 'Subject',
                      viewingNote.topic,
                      viewingNote.content
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                  title="Download as Plain Text"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={() => {
                    setViewingNote(null);
                    onCloseViewModal?.();
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Formatted Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {viewingNote.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Created {new Date(viewingNote.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span className="font-mono">{calculateReadingStats(viewingNote.content).words} words</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditNote(viewingNote)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  Edit Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Create / Edit Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingNote ? 'Edit Study Note' : 'Create New Study Note'}
              </h2>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNoteSubmit} className="mt-4 space-y-4">
              {noteError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{noteError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. B-Tree vs B+ Tree Indexing in Modern DBMS"
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
                    value={noteSubjectId}
                    onChange={(e) => setNoteSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic / Sub-Concept
                  </label>
                  <input
                    type="text"
                    value={noteTopic}
                    onChange={(e) => setNoteTopic(e.target.value)}
                    placeholder="e.g. Database Indexing, Unit 3"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Content *
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={8}
                  placeholder="Enter detailed notes, definitions, theorems, code snippets, or revision points..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Manage Subjects Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingSubject ? 'Edit Subject' : 'Add Academic Subject'}
              </h2>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of existing subjects if not actively editing a specific one */}
            {!editingSubject && subjects.length > 0 && (
              <div className="my-4 max-h-40 overflow-y-auto space-y-2 pr-1">
                <p className="text-xs font-semibold text-slate-500">Existing Subjects:</p>
                {subjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="font-semibold">{s.code}</span>
                      <span className="text-slate-500 truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSubject(s)}
                        className="p-1 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubjectConfirm(s.id, s.name)}
                        className="p-1 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveSubjectSubmit} className="mt-4 space-y-4">
              {subjectError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                  {subjectError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="CS302"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSubjectColor(color)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        subjectColor === color ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {subjectColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Syllabus Topics
                </label>
                <input
                  type="text"
                  value={subjectDesc}
                  onChange={(e) => setSubjectDesc(e.target.value)}
                  placeholder="Optional syllabus summary or course focus..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
