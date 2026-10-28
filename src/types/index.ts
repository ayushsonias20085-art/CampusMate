export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  content: string;
  isFavorite: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'Long Answer' | 'Short Answer' | 'Numerical' | 'Conceptual' | '2-Mark' | '10-Mark';

export interface PYQuestion {
  id: string;
  title: string;
  subjectId: string;
  unit: string;
  year: number;
  questionType: QuestionType;
  marks: number;
  question: string;
  solution: string;
  isImportant: boolean;
  isDemo?: boolean;
  createdAt: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface RevisionTask {
  id: string;
  subjectId: string;
  topic: string;
  priority: TaskPriority;
  deadline: string; // YYYY-MM-DD
  isCompleted: boolean;
  completedAt?: string;
  estimatedHours: number;
  notes?: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  targetScore?: string;
  notes?: string;
}

export interface StudentProfile {
  displayName: string;
  semester: string;
  branch: string;
  collegeName: string;
  targetGpa: string;
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
}

export interface AppState {
  profile: StudentProfile;
  subjects: Subject[];
  notes: Note[];
  pyqs: PYQuestion[];
  tasks: RevisionTask[];
  exams: Exam[];
  pomodoroSessionsCount: number;
  pomodoroSettings: PomodoroSettings;
  theme: 'light' | 'dark';
}
