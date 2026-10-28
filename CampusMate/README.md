# CampusMate — AI-Powered Smart Student Study Hub
*College Productivity, Notes Manager, PYQ Library, Revision Planner & Pomodoro Studio*

Built for college student productivity competitions, **CampusMate** is a responsive, client-side academic command center that provides:
- **Subjects & Notes Manager**: Full search, syllabus categorizations, reading time estimates, and one-click plain-text (.txt) exports.
- **Previous-Year Questions (PYQ) Repository**: Subject, unit, year, and question-type filters with verified model solutions.
- **Smart Revision Planner**: Deterministic rule-based priority scheduling with urgency multipliers and deadline countdowns.
- **Exam Countdown**: Automated day calculations, venue details, target grades, and overdue detection.
- **Pomodoro Focus Studio**: 25/5/15 intervals powered by native Web Audio synthesizer chimes with zero external audio assets.
- **Study Analytics**: Real data visual metrics including SVG task distribution donut and weekly study velocity.
- **Student Profile & Portable Backups**: Complete JSON backup export and validated schema restore.

---

## 1. Quick Start Instructions (Windows & Mac)

### Option A: Direct Browser Launch (Zero Installation)
1. Double-click `index.html` in Windows File Explorer or Mac Finder.
2. The application opens directly in your default web browser (Chrome, Edge, Firefox, Brave).
3. All data persists automatically inside your browser's `localStorage`.

### Option B: VS Code with Live Server
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and select the `CampusMate` directory.
3. Install the **Live Server** extension (by Ritwick Dey) from the Extensions marketplace (`Ctrl+Shift+X`).
4. Right-click `index.html` in the Explorer pane and choose **"Open with Live Server"**.
5. Your browser will automatically launch at `http://127.0.0.1:5500/index.html`.

---

## 2. Directory Structure
```
CampusMate/
├── index.html        # Clean semantic HTML5 structure & accessibility tags
├── style.css         # Modern responsive CSS3 with dark mode & tabular typography
├── script.js         # Modular Vanilla JavaScript with local persistence & Web Audio
└── README.md         # Project documentation, architecture notes, and competition guide
```

---

## 3. Key Technical Functions (script.js)
- `loadState()` / `saveState()`: Manages robust JSON serialization to browser `localStorage`.
- `playChime()`: Synthesizes a harmonic multi-frequency chord via the native Web Audio API (`AudioContext`) without requiring external MP3 downloads.
- `calculateSmartWeight(task)`: Implements our deterministic rule-based scheduling queue:
  `Weight = Urgency Score (Overdue: +500, Due Today: +400, <3 Days: +300) + Priority Multiplier (High: +200, Medium: +100)`.
- `downloadNoteAsText()`: Instantiates a client-side Blob URL to export any study note as a clean plain-text file.
- `validateAndParseBackup()`: Verifies structural integrity of JSON backup files before mutating state to prevent corrupt file imports.

---

## 4. Academic Integrity & Technology Disclosure
- **Offline Reliability**: CampusMate runs 100% locally in any browser with zero subscription barriers or cloud dependencies.
- **Deterministic Scheduling**: The Smart Revision Planner explicitly uses mathematical priority-weight scheduling, not non-deterministic generative hallucinations.
- **Zero External Trackers**: Absolute student privacy with zero telemetry.

*CampusMate — Built for Students.*
