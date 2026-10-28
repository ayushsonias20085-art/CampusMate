import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2
} from 'lucide-react';
import { StudentProfile, AppState } from '../types';
import { exportBackupJSON, validateAndParseBackup } from '../services/storage';

interface ProfileSettingsProps {
  state: AppState;
  onUpdateProfile: (profile: StudentProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetDemoData: () => void;
  onImportBackup: (importedState: AppState) => void;
  onWipeData: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  state,
  onUpdateProfile,
  theme,
  onToggleTheme,
  onResetDemoData,
  onImportBackup,
  onWipeData,
  showToast
}) => {
  const [displayName, setDisplayName] = useState(state.profile.displayName);
  const [semester, setSemester] = useState(state.profile.semester);
  const [branch, setBranch] = useState(state.profile.branch);
  const [collegeName, setCollegeName] = useState(state.profile.collegeName || '');
  const [targetGpa, setTargetGpa] = useState(state.profile.targetGpa || '');

  const [importError, setImportError] = useState<string | null>(null);

  const SEMESTERS = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  const BRANCHES = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Data Science & AI',
    'Chemical Engineering',
    'General Sciences / Humanities'
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('Student display name is required.', 'error');
      return;
    }

    onUpdateProfile({
      displayName: displayName.trim(),
      semester,
      branch,
      collegeName: collegeName.trim(),
      targetGpa: targetGpa.trim()
    });

    showToast('Student profile updated successfully!', 'success');
  };

  const handleExport = () => {
    exportBackupJSON(state);
    showToast('Application backup downloaded as JSON.', 'success');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndParseBackup(content);
      if (result.valid && result.data) {
        setImportError(null);
        if (window.confirm('Importing this backup will replace current local study data. Proceed?')) {
          onImportBackup(result.data);
          showToast('Backup restored successfully!', 'success');
        }
      } else {
        setImportError(result.error || 'Failed to parse backup JSON file.');
        showToast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the default college sample data? Any newly created custom items will be reset.'
      )
    ) {
      onResetDemoData();
      showToast('Default sample study dataset restored.', 'info');
    }
  };

  const handleWipeConfirm = () => {
    if (
      window.confirm(
        'DANGER: This will delete ALL subjects, notes, PYQs, and revision tasks from your browser. Are you sure?'
      )
    ) {
      onWipeData();
      showToast('All local student data has been erased.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header Toolbar */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Student Profile & Storage Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal academic identity, browser-local data backups, and visual themes.
        </p>
      </div>

      {/* 2. Educational Privacy & Storage Notice */}
      <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-amber-950 dark:text-amber-100">
            Client-Side Architecture & Privacy Notice
          </p>
          <p className="leading-relaxed">
            CampusMate operates <strong>100% on browser client-side storage</strong> (HTML5 <code>localStorage</code>). No personal data or study notes are ever transmitted to external cloud servers or databases. This ensures zero latency and total student privacy. We recommend exporting a JSON backup periodically if you use shared computers or clear your browser history.
          </p>
        </div>
      </div>

      {/* 3. Student Profile Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Academic Profile
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target CGPA / Score
              </label>
              <input
                type="text"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                placeholder="e.g. 9.2 / 10.0"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Academic Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Visual Theme Settings */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Interface Theme
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between clean daylight mode and eye-comfort dark mode for late night study.
          </p>
        </div>

        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* 5. Data Backup & Recovery (JSON Export / Import) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Backup & Data Portability
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export all study notes, PYQs, and revision tasks as a single portable JSON file, or restore a previous backup.
          </p>
        </div>

        {importError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export JSON Backup</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors shadow-xs">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 6. Danger Zone: Reset Demo Data / Clear */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/10 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
            Reset & Data Management
          </h2>
          <p className="text-xs text-rose-700/80 dark:text-rose-400 mt-0.5">
            Restore pre-loaded sample university courses or clear local browser storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Sample College Data</span>
          </button>

          <button
            onClick={handleWipeConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Erase All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
