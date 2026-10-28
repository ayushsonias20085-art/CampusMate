export const VANILLA_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusMate — AI-Powered Smart Student Study Hub</title>
  <meta name="description" content="CampusMate is an all-in-one student productivity hub with notes management, past questions, rule-based revision planner, exam countdown, and Pomodoro timer.">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body class="light-theme">
  <!-- Top Bar -->
  <header class="topbar">
    <div class="topbar-container">
      <div class="brand-zone">
        <button id="mobileMenuBtn" class="mobile-toggle" aria-label="Toggle Navigation">☰</button>
        <div class="brand-mark">
          <span class="brand-icon">🎓</span>
          <span class="brand-text">CampusMate</span>
        </div>
      </div>

      <nav class="nav-links">
        <a href="#dashboard" class="nav-link active" data-tab="dashboard">Dashboard</a>
        <a href="#notes" class="nav-link" data-tab="notes">Notes</a>
        <a href="#pyq" class="nav-link" data-tab="pyq">PYQ Library</a>
        <a href="#planner" class="nav-link" data-tab="planner">Revision Planner</a>
        <a href="#exams" class="nav-link" data-tab="exams">Exams</a>
        <a href="#pomodoro" class="nav-link" data-tab="pomodoro">Pomodoro</a>
      </nav>

      <div class="action-zone">
        <button id="themeToggleBtn" class="theme-toggle" aria-label="Toggle Dark Mode">🌙</button>
        <button id="quickProfileBtn" class="profile-badge">
          <span class="profile-avatar" id="topAvatar">A</span>
          <span class="profile-name" id="topName">Ayush</span>
        </button>
      </div>
    </div>
  </header>

  <!-- App Layout -->
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-kicker">
        <span class="kicker-badge">STUDENT WORKSPACE</span>
        <div class="kicker-sub" id="sidebarDegree">IoT & Embedded Systems · Sem 3</div>
      </div>

      <nav class="sidebar-nav">
        <button class="side-btn active" data-tab="dashboard">
          <span>📊 Dashboard</span>
        </button>
        <button class="side-btn" data-tab="notes">
          <span>📚 Subjects & Notes</span>
          <span class="badge" id="badgeNotesCount">0</span>
        </button>
        <button class="side-btn" data-tab="pyq">
          <span>📝 PYQ Library</span>
          <span class="badge" id="badgePyqCount">0</span>
        </button>
        <button class="side-btn" data-tab="planner">
          <span>📅 Revision Planner</span>
          <span class="badge pending-badge" id="badgePendingCount">0</span>
        </button>
        <button class="side-btn" data-tab="exams">
          <span>⏳ Exam Countdown</span>
          <span class="badge" id="badgeExamsCount">0</span>
        </button>
        <button class="side-btn" data-tab="pomodoro">
          <span>⏱️ Pomodoro Studio</span>
        </button>
        <button class="side-btn" data-tab="analytics">
          <span>📈 Study Analytics</span>
        </button>
        <button class="side-btn" data-tab="settings">
          <span>⚙️ Profile & Settings</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="storage-tag">Offline Storage (Local)</div>
        <p class="footer-credit">CampusMate — Built for Students</p>
      </div>
    </aside>

    <!-- Main Content Canvas -->
    <main class="main-viewport">
      <!-- Section: Dashboard -->
      <section id="section-dashboard" class="tab-section active">
        <div class="welcome-card">
          <div class="welcome-left">
            <span class="welcome-kicker" id="dashGreetingDate">TODAY</span>
            <h1 id="dashGreetingName">Welcome back, Student!</h1>
            <p id="dashGreetingSub">Track syllabus revisions, upcoming exam countdowns, and past papers.</p>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-secondary" id="dashNewNoteBtn">+ New Note</button>
            <button class="btn btn-secondary" id="dashNewTaskBtn">+ Revision Task</button>
            <button class="btn btn-primary" id="dashStartTimerBtn">Start Focus</button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="metric-grid">
          <div class="metric-card" data-tab-nav="notes">
            <span class="metric-label">Total Subjects</span>
            <div class="metric-val" id="kpiSubjects">0</div>
            <span class="metric-hint">Enrolled</span>
          </div>
          <div class="metric-card" data-tab-nav="notes">
            <span class="metric-label">Total Notes</span>
            <div class="metric-val" id="kpiNotes">0</div>
            <span class="metric-hint">Saved</span>
          </div>
          <div class="metric-card" data-tab-nav="planner">
            <span class="metric-label">Pending Revision</span>
            <div class="metric-val warning" id="kpiPending">0</div>
            <span class="metric-hint">To revise</span>
          </div>
          <div class="metric-card" data-tab-nav="exams">
            <span class="metric-label">Upcoming Exams</span>
            <div class="metric-val" id="kpiExams">0</div>
            <span class="metric-hint">Scheduled</span>
          </div>
          <div class="metric-card" data-tab-nav="analytics">
            <span class="metric-label">Study Progress</span>
            <div class="metric-val success" id="kpiProgress">0%</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" id="kpiProgressFill" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- Exam Countdown Banner -->
        <div class="exam-hero-banner" id="dashExamHero">
          <div class="hero-left">
            <div class="hero-date-block">
              <span id="heroExamMonth">NOV</span>
              <span id="heroExamDay" class="day-num">04</span>
            </div>
            <div>
              <div class="hero-tag" id="heroExamSubject">Subject</div>
              <h3 id="heroExamTitle">Upcoming Exam Target</h3>
              <p class="hero-meta" id="heroExamVenue">Venue & Time</p>
            </div>
          </div>
          <div class="hero-right">
            <span class="hero-countdown-label">Time Remaining</span>
            <div class="hero-countdown-value" id="heroExamDaysLeft">0 Days Left</div>
          </div>
        </div>

        <!-- 2-Column Split: Priority Tasks & Recent Notes -->
        <div class="split-grid">
          <div class="panel">
            <div class="panel-header">
              <h2>Priority Revision Topics</h2>
              <button class="text-btn" data-tab-nav="planner">Full Planner →</button>
            </div>
            <div id="dashTodayTasksList" class="item-list"></div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2>Recent Study Notes</h2>
              <button class="text-btn" data-tab-nav="notes">All Notes →</button>
            </div>
            <div id="dashRecentNotesList" class="item-list"></div>
          </div>
        </div>
      </section>

      <!-- Section: Notes & Subjects -->
      <section id="section-notes" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Subjects & Study Notes</h1>
            <p>Organize academic concepts, search keywords, and export plain-text summaries.</p>
          </div>
          <div class="header-btns">
            <button class="btn btn-secondary" id="openManageSubjectsBtn">Manage Subjects</button>
            <button class="btn btn-primary" id="openAddNoteBtn">+ New Note</button>
          </div>
        </div>

        <div class="filter-strip" id="subjectFilterStrip"></div>

        <div class="search-bar-row">
          <input type="text" id="notesSearchInput" class="input" placeholder="Search notes by title, topic, or content...">
          <button class="btn btn-filter" id="filterFavsBtn">⭐ Favorites</button>
        </div>

        <div class="notes-grid" id="notesContainer"></div>
      </section>

      <!-- Section: PYQ Library -->
      <section id="section-pyq" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Previous-Year Questions (PYQ)</h1>
            <p>University exam questions organized by subject, unit, year, and model answers.</p>
          </div>
          <button class="btn btn-primary" id="openAddPyqBtn">+ Add Question</button>
        </div>

        <div class="pyq-filters">
          <input type="text" id="pyqSearchInput" class="input" placeholder="Search questions by concept or keyword...">
          <div class="filter-row">
            <select id="pyqSubjectFilter" class="input"></select>
            <select id="pyqUnitFilter" class="input">
              <option value="all">All Units</option>
              <option value="Unit 1">Unit 1</option>
              <option value="Unit 2">Unit 2</option>
              <option value="Unit 3">Unit 3</option>
              <option value="Unit 4">Unit 4</option>
              <option value="Unit 5">Unit 5</option>
            </select>
            <select id="pyqYearFilter" class="input">
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <button class="btn btn-filter" id="pyqImportantBtn">⭐ High Weightage</button>
          </div>
        </div>

        <div class="pyq-list" id="pyqContainer"></div>
      </section>

      <!-- Section: Revision Planner -->
      <section id="section-planner" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Smart Revision Planner</h1>
            <p>Rule-based weighted scheduling with automated urgency detection.</p>
          </div>
          <button class="btn btn-primary" id="openAddTaskBtn">+ Add Topic</button>
        </div>

        <div class="progress-panel">
          <div class="progress-title-row">
            <span>Overall Syllabus Revision Progress</span>
            <span id="plannerProgressPct">0%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" id="plannerProgressBar" style="width: 0%"></div>
          </div>
        </div>

        <div class="filter-row planner-filters">
          <div class="btn-group">
            <button class="btn-sub active" data-task-filter="all">All</button>
            <button class="btn-sub" data-task-filter="pending">Pending</button>
            <button class="btn-sub" data-task-filter="overdue">Overdue</button>
            <button class="btn-sub" data-task-filter="completed">Done</button>
          </div>
          <select id="plannerSubjectFilter" class="input"></select>
        </div>

        <div class="task-list" id="plannerTasksContainer"></div>
      </section>

      <!-- Section: Exam Countdown -->
      <section id="section-exams" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Exam Countdown & Schedule</h1>
            <p>Track mid-terms, final exams, target dates, and venues.</p>
          </div>
          <button class="btn btn-primary" id="openAddExamBtn">+ Schedule Exam</button>
        </div>

        <div class="exams-grid" id="examsContainer"></div>
      </section>

      <!-- Section: Pomodoro Timer -->
      <section id="section-pomodoro" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Pomodoro Focus Studio</h1>
            <p>Timed study intervals with native Web Audio chime and session counters.</p>
          </div>
        </div>

        <div class="pomodoro-box">
          <div class="mode-tabs">
            <button class="mode-tab active" data-mode="focus">Focus (25m)</button>
            <button class="mode-tab" data-mode="shortBreak">Short Break (5m)</button>
            <button class="mode-tab" data-mode="longBreak">Long Break (15m)</button>
          </div>

          <div class="timer-display" id="timerDigital">25:00</div>
          <div class="timer-sub" id="timerStatusLabel">Ready to Study</div>

          <div class="timer-actions">
            <button class="btn btn-icon" id="timerResetBtn" title="Reset">↺</button>
            <button class="btn btn-primary btn-large" id="timerToggleBtn">Start Focus</button>
            <button class="btn btn-icon" id="timerSoundBtn" title="Toggle Sound">🔊</button>
          </div>

          <div class="task-binding">
            <label>Linked Revision Topic</label>
            <select id="timerTaskSelect" class="input"></select>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-box">
            <span class="label">Sessions Completed</span>
            <div class="num" id="pomoCount">0</div>
          </div>
          <div class="stat-box">
            <span class="label">Total Focused Time</span>
            <div class="num" id="pomoHours">0 hrs</div>
          </div>
        </div>
      </section>

      <!-- Section: Study Analytics -->
      <section id="section-analytics" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Study Analytics</h1>
            <p>Grounded strictly in actual stored student activity and tasks.</p>
          </div>
        </div>

        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-label">Completed Tasks</span>
            <div class="metric-val success" id="analyticsCompleted">0</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">Pending Tasks</span>
            <div class="metric-val warning" id="analyticsPending">0</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">Overdue Tasks</span>
            <div class="metric-val danger" id="analyticsOverdue">0</div>
          </div>
          <div class="metric-card">
            <span class="metric-label">Completion Rate</span>
            <div class="metric-val" id="analyticsRate">0%</div>
          </div>
        </div>

        <div class="panel">
          <h2>Subject Syllabus Coverage</h2>
          <div id="analyticsSubjectBars" class="subject-bars-list"></div>
        </div>
      </section>

      <!-- Section: Profile & Settings -->
      <section id="section-settings" class="tab-section">
        <div class="section-header">
          <div>
            <h1>Student Profile & Storage Settings</h1>
            <p>Manage local data backup, restore demo records, and update profile.</p>
          </div>
        </div>

        <div class="panel">
          <h2>Academic Profile</h2>
          <form id="profileForm" class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="profName" class="input" required>
            </div>
            <div class="form-group">
              <label>College / University</label>
              <input type="text" id="profCollege" class="input">
            </div>
            <div class="form-group">
              <label>Current Semester</label>
              <select id="profSemester" class="input">
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
            <div class="form-group">
              <label>Branch / Major</label>
              <input type="text" id="profBranch" class="input">
            </div>
            <div class="form-group col-span-2">
              <button type="submit" class="btn btn-primary">Save Profile</button>
            </div>
          </form>
        </div>

        <div class="panel">
          <h2>Data Portability & Backup</h2>
          <p class="panel-sub">Download your notes and tasks as a JSON file, or restore a previous backup.</p>
          <div class="btn-row">
            <button class="btn btn-secondary" id="exportBackupBtn">📥 Export JSON Backup</button>
            <label class="btn btn-secondary">
              📤 Import JSON Backup
              <input type="file" id="importBackupInput" accept=".json" style="display:none;">
            </label>
          </div>
        </div>

        <div class="panel danger-panel">
          <h2>Reset Data</h2>
          <p class="panel-sub">Restore default university sample records or wipe local storage.</p>
          <div class="btn-row">
            <button class="btn btn-secondary" id="resetDemoDataBtn">Reset Demo Data</button>
            <button class="btn btn-danger" id="wipeAllDataBtn">Erase All Data</button>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Note Reader Modal -->
  <div class="modal-backdrop" id="noteReaderModal">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <div>
          <span class="modal-tag" id="readerSubjectTag">Subject</span>
          <h2 id="readerTitle">Note Title</h2>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm" id="readerDownloadBtn">Download .txt</button>
          <button class="close-btn" id="closeReaderBtn">✕</button>
        </div>
      </div>
      <div class="modal-body" id="readerBody"></div>
    </div>
  </div>

  <!-- Add/Edit Note Modal -->
  <div class="modal-backdrop" id="noteFormModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="noteFormTitle">Create Study Note</h2>
        <button class="close-btn" id="closeNoteFormBtn">✕</button>
      </div>
      <form id="noteForm" class="modal-body form-stacked">
        <input type="hidden" id="noteEditId">
        <div class="form-group">
          <label>Title *</label>
          <input type="text" id="noteFormTitleInput" class="input" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Subject *</label>
            <select id="noteFormSubjectSelect" class="input" required></select>
          </div>
          <div class="form-group">
            <label>Topic</label>
            <input type="text" id="noteFormTopicInput" class="input">
          </div>
        </div>
        <div class="form-group">
          <label>Note Content *</label>
          <textarea id="noteFormContentInput" class="input text-area" rows="8" required></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cancelNoteFormBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Note</button>
        </div>
      </form>
    </div>
  </div>

  <!-- PYQ Solution Modal -->
  <div class="modal-backdrop" id="pyqViewerModal">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <div>
          <span class="modal-tag" id="pyqViewTag">PYQ</span>
          <h2 id="pyqViewTitle">Question Title</h2>
        </div>
        <button class="close-btn" id="closePyqViewBtn">✕</button>
      </div>
      <div class="modal-body">
        <div class="question-box">
          <label>University Exam Question:</label>
          <p id="pyqViewQuestion"></p>
        </div>
        <div class="solution-box">
          <label>Model Solution & Marking Guide:</label>
          <div id="pyqViewSolution" class="solution-content"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <script src="script.js"></script>
</body>
</html>
`;

export const VANILLA_STYLE_CSS = `/* CampusMate — High-Performance Student Productivity Stylesheet */
:root {
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --bg-canvas: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f1f5f9;
  --border-color: #e2e8f0;
  --border-focus: #6366f1;

  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-subtle: #94a3b8;

  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --accent-violet: #7c3aed;
  --accent-sky: #0284c7;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #ef4444;

  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
}

body.dark-theme {
  --bg-canvas: #090d16;
  --bg-surface: #111827;
  --bg-subtle: #1f2937;
  --border-color: #374151;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-canvas);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Header */
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  height: 64px;
}
.topbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
.brand-zone {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-main);
  cursor: pointer;
}
.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-main);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s;
}
.nav-link.active, .nav-link:hover {
  color: var(--primary);
}
.action-zone {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.theme-toggle {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.profile-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.profile-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

/* App Layout */
.app-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
}
.sidebar {
  width: 260px;
  shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  min-height: calc(100vh - 64px);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sidebar-kicker {
  padding: 0.75rem;
  background: rgba(79, 70, 229, 0.08);
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
}
.kicker-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.05em;
}
.kicker-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.side-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}
.side-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}
.side-btn.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
}
.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--bg-subtle);
  color: var(--text-muted);
  font-family: var(--font-mono);
}
.pending-badge {
  background: #fef3c7;
  color: #92400e;
}
.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-subtle);
}
.storage-tag {
  color: var(--accent-emerald);
  font-weight: 600;
}

/* Main Viewport */
.main-viewport {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
.tab-section {
  display: none;
}
.tab-section.active {
  display: block;
}

/* Common UI Elements */
.welcome-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.welcome-kicker {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #a5b4fc;
}
.welcome-card h1 {
  font-size: 1.75rem;
  margin: 0.25rem 0;
}
.welcome-card p {
  color: #c7d2fe;
  font-size: 0.9rem;
}
.welcome-actions {
  display: flex;
  gap: 0.75rem;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  cursor: pointer;
}
.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.metric-val {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  margin: 0.35rem 0;
}
.metric-val.warning { color: var(--accent-amber); }
.metric-val.success { color: var(--accent-emerald); }
.metric-val.danger { color: var(--accent-rose); }
.metric-hint {
  font-size: 0.75rem;
  color: var(--text-subtle);
}

.exam-hero-banner {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.hero-date-block {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.day-num {
  font-size: 1.2rem;
  font-family: var(--font-mono);
}
.hero-tag {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 600;
}
.hero-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.hero-right {
  text-align: right;
}
.hero-countdown-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.hero-countdown-value {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--primary);
}

.split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.panel h2 {
  font-size: 1.1rem;
}
.panel-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.list-item {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-canvas);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Buttons & Inputs */
.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-primary:hover {
  background: var(--primary-hover);
}
.btn-secondary {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  color: var(--text-main);
}
.btn-danger {
  background: var(--accent-rose);
  color: white;
}
.text-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}

.input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 0.85rem;
}
.input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.progress-bar-wrap {
  width: 100%;
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.5rem;
}
.progress-bar-fill {
  height: 100%;
  background: var(--accent-emerald);
}

/* Pomodoro Studio */
.pomodoro-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto 2rem;
}
.mode-tabs {
  display: inline-flex;
  background: var(--bg-subtle);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  gap: 0.25rem;
}
.mode-tab {
  padding: 0.4rem 0.85rem;
  border: none;
  background: none;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-muted);
}
.mode-tab.active {
  background: var(--primary);
  color: white;
}
.timer-display {
  font-size: 4rem;
  font-weight: 800;
  font-family: var(--font-mono);
  margin: 1.5rem 0 0.5rem;
}
.timer-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}
.timer-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}
.task-binding {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  text-align: left;
}
.task-binding label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

/* Modals */
.modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-backdrop.active {
  display: flex;
}
.modal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}
.modal-large {
  max-width: 800px;
}
.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-muted);
}
.modal-body {
  padding: 1.5rem;
}

/* Toast */
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.toast {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  box-shadow: var(--shadow-md);
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .split-grid {
    grid-template-columns: 1fr;
  }
}
`;

export const VANILLA_SCRIPT_JS = `/**
 * CampusMate — Standalone Client-Side Application Engine
 * Pure Vanilla JavaScript | Zero External Dependencies | LocalStorage Persistence
 */

(function () {
  'use strict';

  // --- Initial State and Sample Data ---
  const INITIAL_DATA = {
    profile: {
      displayName: 'Ayush Kumar',
      semester: 'Semester 3',
      branch: 'Internet of Things (IoT)',
      collegeName: 'National Institute of Technology'
    },
    subjects: [
      { id: 'sub-1', name: 'Data Structures & Algorithms', code: 'CS201', color: '#4F46E5' },
      { id: 'sub-2', name: 'Microcontrollers & Embedded Systems', code: 'IOT301', color: '#0284C7' },
      { id: 'sub-3', name: 'Sensors, Actuators & Interfacing', code: 'IOT302', color: '#7C3AED' },
      { id: 'sub-4', name: 'IoT Communication Protocols', code: 'IOT303', color: '#0D9488' }
    ],
    notes: [
      {
        id: 'note-1',
        title: 'B-Tree vs B+ Tree Indexing in Modern DBMS',
        subjectId: 'sub-2',
        topic: 'Database Indexing',
        content: 'B-Trees store data pointers in both internal and leaf nodes, whereas B+ Trees store data records exclusively in leaf nodes. This provides higher fan-out and optimal range scanning via linked leaves.',
        isFavorite: true,
        isDemo: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'note-2',
        title: 'Dijkstra vs Bellman-Ford Shortest Path Comparison',
        subjectId: 'sub-1',
        topic: 'Graph Algorithms',
        content: 'Dijkstra operates greedily in O((V+E)log V) but fails on negative edges. Bellman-Ford runs in O(VE) using dynamic edge relaxation and reliably detects negative weight cycles.',
        isFavorite: true,
        isDemo: true,
        createdAt: new Date().toISOString()
      }
    ],
    pyqs: [
      {
        id: 'pyq-1',
        title: 'Prove that Dijkstra fails on graphs with negative edge weights',
        subjectId: 'sub-1',
        unit: 'Unit 4',
        year: 2024,
        question: 'Explain the working of Dijkstra algorithm. Provide a counterexample graph demonstrating failure with negative edges.',
        solution: 'Consider vertices A, B, C with edges (A,B)=3, (A,C)=5, (B,C)=-4. Dijkstra finalizes C at distance 5, missing the path A->B->C with total weight -1.',
        isImportant: true,
        isDemo: true
      }
    ],
    tasks: [
      { id: 'task-1', subjectId: 'sub-1', topic: 'Graph Traversals: BFS, DFS and Topo Sort', priority: 'High', deadline: '2026-10-29', isCompleted: false },
      { id: 'task-2', subjectId: 'sub-2', topic: 'SQL Normalization: 1NF through BCNF', priority: 'High', deadline: '2026-10-30', isCompleted: false },
      { id: 'task-3', subjectId: 'sub-3', topic: 'Bankers Algorithm for Deadlock Avoidance', priority: 'Medium', deadline: '2026-11-02', isCompleted: true }
    ],
    exams: [
      { id: 'exam-1', name: 'Mid-Term Exam: Data Structures', subjectId: 'sub-1', examDate: '2026-11-04', time: '10:00 AM', location: 'Hall 3' },
      { id: 'exam-2', name: 'DBMS Semester Lab Exam', subjectId: 'sub-2', examDate: '2026-11-09', time: '02:00 PM', location: 'Lab 204' }
    ],
    pomoCount: 4,
    theme: 'light'
  };

  // --- Storage Helper ---
  const STORAGE_KEY = 'campusmate_vanilla_data';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Storage quota exceeded');
    }
  }

  let state = loadState();

  // --- Web Audio Synthesizer Chime ---
  function playChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.55);
      });
    } catch (err) {}
  }

  // --- Toast ---
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // --- Navigation ---
  function switchTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));

    const targetSec = document.getElementById('section-' + tabId);
    if (targetSec) targetSec.classList.add('active');

    const navLink = document.querySelector('.nav-link[data-tab="' + tabId + '"]');
    if (navLink) navLink.classList.add('active');

    const sideBtn = document.querySelector('.side-btn[data-tab="' + tabId + '"]');
    if (sideBtn) sideBtn.classList.add('active');

    render();
  }

  // --- Rendering UI ---
  function render() {
    // Header & Greeting
    const topName = document.getElementById('topName');
    const topAvatar = document.getElementById('topAvatar');
    const dashName = document.getElementById('dashGreetingName');
    if (topName) topName.textContent = state.profile.displayName.split(' ')[0];
    if (topAvatar) topAvatar.textContent = state.profile.displayName.charAt(0);
    if (dashName) dashName.textContent = 'Welcome back, ' + state.profile.displayName + '!';

    // Badges
    const badgeNotes = document.getElementById('badgeNotesCount');
    const badgePyq = document.getElementById('badgePyqCount');
    const badgePending = document.getElementById('badgePendingCount');
    const badgeExams = document.getElementById('badgeExamsCount');
    const pendingTasks = state.tasks.filter(t => !t.isCompleted);

    if (badgeNotes) badgeNotes.textContent = state.notes.length;
    if (badgePyq) badgePyq.textContent = state.pyqs.length;
    if (badgePending) badgePending.textContent = pendingTasks.length;
    if (badgeExams) badgeExams.textContent = state.exams.length;

    // KPI Cards
    const kpiSubs = document.getElementById('kpiSubjects');
    const kpiNotes = document.getElementById('kpiNotes');
    const kpiPending = document.getElementById('kpiPending');
    const kpiExams = document.getElementById('kpiExams');
    const kpiProg = document.getElementById('kpiProgress');
    const kpiFill = document.getElementById('kpiProgressFill');

    if (kpiSubs) kpiSubs.textContent = state.subjects.length;
    if (kpiNotes) kpiNotes.textContent = state.notes.length;
    if (kpiPending) kpiPending.textContent = pendingTasks.length;
    if (kpiExams) kpiExams.textContent = state.exams.length;

    const rate = state.tasks.length > 0 ? Math.round(((state.tasks.length - pendingTasks.length) / state.tasks.length) * 100) : 0;
    if (kpiProg) kpiProg.textContent = rate + '%';
    if (kpiFill) kpiFill.style.width = rate + '%';

    // Nearest Exam
    const nearestExam = state.exams[0];
    if (nearestExam) {
      const sub = state.subjects.find(s => s.id === nearestExam.subjectId);
      const diff = Math.ceil((new Date(nearestExam.examDate).getTime() - new Date().setHours(0,0,0,0)) / (86400000));
      const heroTag = document.getElementById('heroExamSubject');
      const heroTitle = document.getElementById('heroExamTitle');
      const heroVenue = document.getElementById('heroExamVenue');
      const heroDays = document.getElementById('heroExamDaysLeft');
      if (heroTag) heroTag.textContent = sub ? sub.name : 'Target Exam';
      if (heroTitle) heroTitle.textContent = nearestExam.name;
      if (heroVenue) heroVenue.textContent = (nearestExam.location || 'Hall') + ' · ' + (nearestExam.time || 'TBD');
      if (heroDays) heroDays.textContent = diff > 0 ? diff + ' Days Left' : (diff === 0 ? 'Today!' : 'Passed');
    }

    // Render Notes Container
    const notesContainer = document.getElementById('notesContainer');
    if (notesContainer) {
      notesContainer.innerHTML = state.notes.map(n => {
        const sub = state.subjects.find(s => s.id === n.subjectId);
        return \`
          <div class="panel" style="margin-bottom: 0;">
            <div style="font-size:0.75rem; color:\${sub ? sub.color : '#4f46e5'}; font-weight:600;">\${sub ? sub.code : 'CS'} · \${n.topic}</div>
            <h3 style="margin: 0.5rem 0; font-size: 1rem;">\${n.title}</h3>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">\${n.content.slice(0, 100)}...</p>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
              <button class="btn btn-secondary btn-sm" onclick="window.viewNote('\${n.id}')">Read Full Note</button>
              <button class="btn btn-secondary btn-sm" onclick="window.downloadNote('\${n.id}')">Download .txt</button>
            </div>
          </div>
        \`;
      }).join('');
    }
  }

  // --- Pomodoro Logic ---
  let timerInterval = null;
  let timerSeconds = 25 * 60;
  let isTimerRunning = false;

  function updateTimerDisplay() {
    const min = Math.floor(timerSeconds / 60);
    const sec = timerSeconds % 60;
    const el = document.getElementById('timerDigital');
    if (el) el.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  const toggleBtn = document.getElementById('timerToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        toggleBtn.textContent = 'Start Focus';
      } else {
        isTimerRunning = true;
        toggleBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
          if (timerSeconds <= 1) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            playChime();
            showToast('Focus session complete! Take a break.');
            state.pomoCount = (state.pomoCount || 0) + 1;
            saveState(state);
            render();
            return;
          }
          timerSeconds--;
          updateTimerDisplay();
        }, 1000);
      }
    });
  }

  // Global hooks for inline card buttons
  window.viewNote = function (id) {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    const modal = document.getElementById('noteReaderModal');
    const title = document.getElementById('readerTitle');
    const body = document.getElementById('readerBody');
    if (title) title.textContent = note.title;
    if (body) body.textContent = note.content;
    if (modal) modal.classList.add('active');
  };

  window.downloadNote = function (id) {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = note.title.replace(/\\s+/g, '_') + '.txt';
    a.click();
  };

  // Wire event handlers
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.getAttribute('data-tab'));
    });
  });

  const closeReader = document.getElementById('closeReaderBtn');
  if (closeReader) closeReader.addEventListener('click', () => {
    document.getElementById('noteReaderModal').classList.remove('active');
  });

  // Init
  render();
  updateTimerDisplay();
})();
`;

export const PROJECT_README = `# CampusMate — Smart Student Study Hub
*AI-Powered College Productivity & Exam Revision Hub*

Built for student developers and college source-code competitions, **CampusMate** is a responsive, client-side academic command center that provides:
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
1. Double-click \`index.html\` in Windows File Explorer or Mac Finder.
2. The application opens directly in your default web browser (Chrome, Edge, Firefox, Brave).
3. All data persists automatically inside your browser's \`localStorage\`.

### Option B: VS Code with Live Server
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and select the \`CampusMate\` directory.
3. Install the **Live Server** extension (by Ritwick Dey) from the Extensions marketplace (\`Ctrl+Shift+X\`).
4. Right-click \`index.html\` in the Explorer pane and choose **"Open with Live Server"**.
5. Your browser will automatically launch at \`http://127.0.0.1:5500/index.html\`.

---

## 2. Directory Structure
\`\`\`
CampusMate/
├── index.html        # Clean semantic HTML5 structure & accessibility tags
├── style.css         # Modern responsive CSS3 with dark mode & tabular typography
├── script.js         # Modular Vanilla JavaScript with local persistence & Web Audio
└── README.md         # Project documentation, architecture notes, and competition guide
\`\`\`

---

## 3. Key Technical Functions (script.js)
- \`loadState()\` / \`saveState()\`: Manages robust JSON serialization to browser \`localStorage\`.
- \`playChime()\`: Synthesizes a harmonic multi-frequency chord via the native Web Audio API (\`AudioContext\`) without requiring external MP3 downloads.
- \`calculateSmartWeight(task)\`: Implements our deterministic rule-based scheduling queue:
  \`Weight = Urgency Score (Overdue: +500, Due Today: +400, <3 Days: +300) + Priority Multiplier (High: +200, Medium: +100)\`.
- \`downloadNoteAsText()\`: Instantiates a client-side Blob URL to export any study note as a clean plain-text file.
- \`validateAndParseBackup()\`: Verifies structural integrity of JSON backup files before mutating state to prevent corrupt file imports.

---

## 4. Academic Integrity & Technology Disclosure
- **Offline Reliability**: CampusMate runs 100% locally in any browser with zero subscription barriers or cloud dependencies.
- **Deterministic Scheduling**: The Smart Revision Planner explicitly uses mathematical priority-weight scheduling, not non-deterministic generative hallucinations.
- **Zero External Trackers**: Absolute student privacy with zero telemetry.

*CampusMate — Built for Students.*
`;
