import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  Presentation,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { VANILLA_INDEX_HTML, VANILLA_STYLE_CSS, VANILLA_SCRIPT_JS, PROJECT_README } from '../data/standaloneCode';

export const CompetitionKit: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pitch' | 'qa' | 'about' | 'code'>('pitch');
  const [activeCodeFile, setActiveCodeFile] = useState<'index.html' | 'style.css' | 'script.js' | 'README.md'>('index.html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getCodeContent = () => {
    switch (activeCodeFile) {
      case 'index.html':
        return VANILLA_INDEX_HTML;
      case 'style.css':
        return VANILLA_STYLE_CSS;
      case 'script.js':
        return VANILLA_SCRIPT_JS;
      case 'README.md':
        return PROJECT_README;
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCurrentFile = () => {
    const content = getCodeContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = activeCodeFile;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZipOrFiles = () => {
    // Sequentially download the 4 files
    const files = [
      { name: 'index.html', content: VANILLA_INDEX_HTML },
      { name: 'style.css', content: VANILLA_STYLE_CSS },
      { name: 'script.js', content: VANILLA_SCRIPT_JS },
      { name: 'README.md', content: PROJECT_README }
    ];

    files.forEach((f, idx) => {
      setTimeout(() => {
        const blob = new Blob([f.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, idx * 250);
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Kit Hero */}
      <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Award className="w-4 h-4" />
              <span>College Source-Code Competition Pack</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              CampusMate — Presentation & Source Kit
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Everything required to present, defend, and run CampusMate in a college competition or hackathon.
            </p>
          </div>

          <button
            onClick={handleDownloadAllZipOrFiles}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download All 4 Source Files</span>
          </button>
        </div>
      </div>

      {/* 2. Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSection('pitch')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSection === 'pitch'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>3-Min Presentation Pitch</span>
        </button>

        <button
          onClick={() => setActiveSection('qa')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSection === 'qa'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Judge Q&A Defense</span>
        </button>

        <button
          onClick={() => setActiveSection('about')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSection === 'about'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Problem & Architecture</span>
        </button>

        <button
          onClick={() => setActiveSection('code')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSection === 'code'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Standalone Source Explorer</span>
        </button>
      </div>

      {/* Section 1: 3-Minute Presentation Pitch */}
      {activeSection === 'pitch' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Presentation className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>3-Minute Competition Demo Script</span>
            </h2>
            <button
              onClick={() => handleCopy('pitch-script', PITCH_TEXT)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copiedKey === 'pitch-script' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Script!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Script</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <span>[0:00 - 0:45] Minute 1: The Problem & Vision</span>
                <span>Opening Hook</span>
              </div>
              <p>
                "Respected judges and fellow engineers, every semester, college students face cognitive overload: fragmented WhatsApp class groups for notes, PDF folders of past university questions with missing answers, and frantic cramming before exam deadlines. Existing tools are either bloated enterprise apps or require expensive subscriptions. We built <strong>CampusMate</strong> — an all-in-one, privacy-first, lightweight smart student productivity hub that runs 100% offline in any browser."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <span>[0:45 - 2:00] Minute 2: Live Core Feature Walkthrough</span>
                <span>The Working Mechanisms</span>
              </div>
              <p>
                "Let us demonstrate the core workflow:
                <br />1. <strong>Notes & Subject Hub:</strong> Students organize revision notes with full-text search, reading estimates, and one-click plain-text download.
                <br />2. <strong>Previous Year Questions (PYQ) Repository:</strong> Filtered by subject, syllabus unit, year, and question type with verified model solutions.
                <br />3. <strong>Rule-Based Revision Planner:</strong> Rather than relying on unreliable black-box LLMs that hallucinate dates, CampusMate employs a deterministic priority queue weighing exam urgency and priority levels.
                <br />4. <strong>Pomodoro Focus Studio:</strong> Built-in study intervals with synthesized audio chimes generated via the Web Audio API without any external dependencies."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <span>[2:00 - 3:00] Minute 3: Architecture, Privacy & Impact</span>
                <span>Closing Statement</span>
              </div>
              <p>
                "Architecturally, CampusMate has zero external backend dependencies: no database to maintain, zero subscription cost, and complete data privacy using validated JSON import/export and browser storage. It gives every student an instant, reliable digital command center. Thank you, and we welcome your questions!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Judge Q&A Defense */}
      {activeSection === 'qa' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Judges Defense & Technical Q&A</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated technical responses to common evaluation and defense questions.
            </p>
          </div>

          <div className="space-y-3">
            {QA_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-xs sm:text-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 font-mono">
                    Q{idx + 1}:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.q}
                  </span>
                </div>
                <div className="pl-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Answer: </span>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: About Project & Architecture */}
      {activeSection === 'about' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>1. Problem Statement</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                College students struggle with fragmented study materials: notes are lost across chat apps, previous year exam papers lack reliable solutions, and students lack structured daily revision scheduling. Cloud-only tools frequently fail due to spotty campus Wi-Fi or paywalled features.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2. The CampusMate Solution</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                CampusMate unifies course notes, past questions with marking guides, an exam countdown radar, a rule-based revision planner, and an offline Pomodoro timer into a responsive, single-page application with zero server requirements.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-600" />
                <span>3. Key Innovation & Distinction</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero telemetry, zero cloud lock-in, and 100% offline operational independence. Auditory cues use native browser Web Audio synthesis, and scheduling relies on deterministic priority algorithms instead of unpredictable generative hallucinations.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>4. Future Roadmap & Scope</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Future planned enhancements include PWA offline caching with service workers, peer-to-peer WebRTC encrypted notes sharing across study groups, and optional local AI semantic search via WebGPU / ONNX runtime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Standalone Code Explorer */}
      {activeSection === 'code' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Standalone Code Explorer (CampusMate/ Directory)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect, copy, or download the four standalone submission files directly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(`file-${activeCodeFile}`, getCodeContent())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                {copiedKey === `file-${activeCodeFile}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCurrentFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {activeCodeFile}</span>
              </button>
            </div>
          </div>

          {/* File switcher tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {(['index.html', 'style.css', 'script.js', 'README.md'] as const).map((filename) => (
              <button
                key={filename}
                onClick={() => setActiveCodeFile(filename)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeCodeFile === filename
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{filename}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Area */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {getCodeContent()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

const PITCH_TEXT = `Project Name: CampusMate — AI-Powered Smart Student Study Hub
Duration: 3 Minutes
College Source-Code Competition Pitch

[0:00 - 0:45] The Problem & Motivation
Respected judges, college students face chronic cognitive overload. Between WhatsApp study groups, unorganized PDF notes, and conflicting exam schedules, students lose up to 40% of their study time simply organizing materials. Most commercial tools either demand high recurring subscriptions or break completely without reliable internet access. We designed CampusMate to solve this: an all-in-one, privacy-first, responsive digital hub that runs instantly in any web browser without needing API keys or a remote server.

[0:45 - 2:00] Live Feature Demonstration
1. Subjects & Notes Manager: Lets students categorize concepts, search across notes instantaneously, and export readable plain-text revision summaries with one click.
2. PYQ Repository: Consolidates past university exam questions with unit, year, and mark filters, alongside step-by-step model answers.
3. Smart Revision Planner: Uses a transparent, deterministic priority queue that weighs exam proximity and priority levels rather than unpredictable black-box generative models.
4. Exam Countdown & Pomodoro Studio: Features synchronized countdown calculations and an interval timer powered by native Web Audio synthesizer chimes.

[2:00 - 3:00] Architecture, Privacy & Impact
CampusMate is 100% self-contained. All data is managed locally via HTML5 localStorage with schema-validated JSON backup and restore. There is zero latency, zero telemetry, and zero subscription barrier. Thank you!`;

const QA_ITEMS = [
  {
    q: 'Why did you choose localStorage over a cloud database like Firebase or MongoDB?',
    a: 'For college students studying in libraries or transit with spotty Wi-Fi, local client-side storage guarantees sub-millisecond response latency, 100% offline uptime, and absolute privacy. Furthermore, CampusMate includes full JSON export/import for easy portability across devices.'
  },
  {
    q: 'How does the "Smart Revision Planner" determine which topics to suggest first?',
    a: 'Rather than using a black-box LLM that can hallucinate dates or fail offline, CampusMate uses a deterministic rule-based priority queue: Weight = Urgency Score (Overdue: +500, Due Today: +400, <3 Days: +300) + Priority Multiplier (High: +200, Medium: +100). This guarantees predictable, reliable revision scheduling.'
  },
  {
    q: 'How does the Pomodoro timer produce chime sounds without external audio MP3 files?',
    a: 'It uses the native Web Audio API (window.AudioContext) to synthesize a harmonic chord (C5, E5, G5, C6) dynamically using oscillator nodes and exponential gain curves. This prevents 404 network errors and keeps the codebase fully hermetic.'
  },
  {
    q: 'How do you handle data validation and corrupted JSON during backup imports?',
    a: 'The storage service runs a strict JSON schema validator before mutating the application state. It verifies that root keys (subjects, notes, tasks, exams, profile) exist and are structured arrays with correct properties. If malformed, it reports an informative error message without altering existing data.'
  },
  {
    q: 'What is the future scope of CampusMate?',
    a: 'Our roadmap includes Progressive Web App (PWA) service worker installation, encrypted WebRTC peer-to-peer note sharing between study groups, and an optional local WebGPU-based model for semantic search without cloud APIs.'
  }
];
