import { AppState } from '../types';
import { INITIAL_STATE } from '../data/sampleData';

const STORAGE_KEY = 'campusmate_studyhub_v1';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw);
    // Basic structural verification
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.subjects) &&
      Array.isArray(parsed.notes) &&
      Array.isArray(parsed.tasks) &&
      Array.isArray(parsed.exams) &&
      parsed.profile
    ) {
      return {
        profile: {
          ...INITIAL_STATE.profile,
          ...parsed.profile
        },
        subjects: parsed.subjects || INITIAL_STATE.subjects,
        notes: parsed.notes || INITIAL_STATE.notes,
        pyqs: Array.isArray(parsed.pyqs) ? parsed.pyqs : INITIAL_STATE.pyqs,
        tasks: parsed.tasks || INITIAL_STATE.tasks,
        exams: parsed.exams || INITIAL_STATE.exams,
        pomodoroSessionsCount: typeof parsed.pomodoroSessionsCount === 'number' ? parsed.pomodoroSessionsCount : 0,
        pomodoroSettings: {
          ...INITIAL_STATE.pomodoroSettings,
          ...(parsed.pomodoroSettings || {})
        },
        theme: parsed.theme === 'dark' ? 'dark' : 'light'
      };
    }
    return INITIAL_STATE;
  } catch (error) {
    console.error('Failed to load CampusMate state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function saveAppState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save CampusMate state to localStorage:', error);
    return false;
  }
}

export function exportBackupJSON(state: AppState) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `campusmate-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateAndParseBackup(jsonString: string): { valid: boolean; data?: AppState; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'JSON file does not contain a valid root object.' };
    }
    if (!Array.isArray(parsed.subjects)) {
      return { valid: false, error: 'Backup is missing the subjects list.' };
    }
    if (!Array.isArray(parsed.notes)) {
      return { valid: false, error: 'Backup is missing the notes list.' };
    }
    if (!Array.isArray(parsed.tasks)) {
      return { valid: false, error: 'Backup is missing the revision tasks list.' };
    }
    if (!Array.isArray(parsed.exams)) {
      return { valid: false, error: 'Backup is missing the exams list.' };
    }
    if (!parsed.profile || typeof parsed.profile.displayName !== 'string') {
      return { valid: false, error: 'Backup is missing valid student profile data.' };
    }

    const state: AppState = {
      profile: {
        displayName: parsed.profile.displayName || 'Student',
        semester: parsed.profile.semester || 'Semester 1',
        branch: parsed.profile.branch || 'Engineering',
        collegeName: parsed.profile.collegeName || '',
        targetGpa: parsed.profile.targetGpa || ''
      },
      subjects: parsed.subjects,
      notes: parsed.notes,
      pyqs: Array.isArray(parsed.pyqs) ? parsed.pyqs : [],
      tasks: parsed.tasks,
      exams: parsed.exams,
      pomodoroSessionsCount: typeof parsed.pomodoroSessionsCount === 'number' ? parsed.pomodoroSessionsCount : 0,
      pomodoroSettings: {
        focusDuration: parsed.pomodoroSettings?.focusDuration || 25,
        shortBreak: parsed.pomodoroSettings?.shortBreak || 5,
        longBreak: parsed.pomodoroSettings?.longBreak || 15,
        soundEnabled: parsed.pomodoroSettings?.soundEnabled ?? true
      },
      theme: parsed.theme === 'dark' ? 'dark' : 'light'
    };

    return { valid: true, data: state };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON file format.';
    return { valid: false, error: message };
  }
}

/**
 * 100% offline synthesizer chime using the Web Audio API
 * Plays a pleasant three-tone completion chord.
 */
export function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.65);
    });
  } catch (e) {
    // Non-critical audio fallback
    console.warn('AudioContext playback error:', e);
  }
}

/**
 * Download a note as a plain-text (.txt) file
 */
export function downloadNoteAsText(title: string, subjectName: string, topic: string, content: string) {
  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileContent = `=========================================
CAMPUSMATE STUDY NOTES
=========================================
Title:   ${title}
Subject: ${subjectName}
Topic:   ${topic}
Date:    ${new Date().toLocaleDateString()}
=========================================

${content}
`;
  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${cleanTitle}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
