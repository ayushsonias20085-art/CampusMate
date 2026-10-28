/**
 * CampusMate — Standalone Client-Side Application Engine
 * Pure Vanilla JavaScript | Zero External Dependencies | LocalStorage Persistence
 */

(function () {
  'use strict';

  // --- Initial State and Sample Data ---
  const INITIAL_DATA = {
    profile: {
      displayName: 'Alex Rivers',
      semester: 'Semester 5',
      branch: 'Computer Science & Engineering',
      collegeName: 'National Institute of Technology'
    },
    subjects: [
      { id: 'sub-1', name: 'Data Structures & Algorithms', code: 'CS201', color: '#4F46E5' },
      { id: 'sub-2', name: 'Database Management Systems', code: 'CS301', color: '#0284C7' },
      { id: 'sub-3', name: 'Operating Systems', code: 'CS302', color: '#7C3AED' },
      { id: 'sub-4', name: 'Computer Networks', code: 'CS401', color: '#0D9488' }
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
        return `
          <div class="panel" style="margin-bottom: 0;">
            <div style="font-size:0.75rem; color:${sub ? sub.color : '#4f46e5'}; font-weight:600;">${sub ? sub.code : 'CS'} · ${n.topic}</div>
            <h3 style="margin: 0.5rem 0; font-size: 1rem;">${n.title}</h3>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">${n.content.slice(0, 100)}...</p>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
              <button class="btn btn-secondary btn-sm" onclick="window.viewNote('${n.id}')">Read Full Note</button>
              <button class="btn btn-secondary btn-sm" onclick="window.downloadNote('${n.id}')">Download .txt</button>
            </div>
          </div>
        `;
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
    a.download = note.title.replace(/\s+/g, '_') + '.txt';
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
