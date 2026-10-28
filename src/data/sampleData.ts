import { AppState, Subject, Note, PYQuestion, RevisionTask, Exam } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    color: '#4F46E5', // Indigo
    description: 'Core concepts of linear and non-linear data structures, trees, graphs, sorting, and asymptotic complexity.'
  },
  {
    id: 'sub-2',
    name: 'Database Management Systems',
    code: 'CS301',
    color: '#0284C7', // Sky
    description: 'Relational algebra, SQL normalization, indexing, transaction management, and ACID properties.'
  },
  {
    id: 'sub-3',
    name: 'Operating Systems',
    code: 'CS302',
    color: '#7C3AED', // Violet
    description: 'Process scheduling, concurrency, virtual memory, paging algorithms, and deadlocks.'
  },
  {
    id: 'sub-4',
    name: 'Computer Networks',
    code: 'CS401',
    color: '#0D9488', // Teal
    description: 'OSI and TCP/IP stack, routing protocols, flow & congestion control, and application-layer protocols.'
  },
  {
    id: 'sub-5',
    name: 'Theory of Computation',
    code: 'CS402',
    color: '#D97706', // Amber
    description: 'Finite automata, regular expressions, context-free grammars, Turing machines, and decidability.'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'B-Tree vs B+ Tree Indexing in Modern DBMS',
    subjectId: 'sub-2',
    topic: 'Database Indexing',
    content: `# B-Tree vs B+ Tree Indexing

## 1. Key Structural Differences
- In a **B-Tree**, both keys and data pointers are stored in all internal and leaf nodes.
- In a **B+ Tree**, data records/pointers are stored exclusively in the **leaf nodes**. Internal nodes only store routing keys and child page pointers.

## 2. Why Database Engines (MySQL InnoDB, Postgres) Prefer B+ Trees:
1. **Higher Fan-out**: Because internal nodes do not hold data records, each page can store significantly more routing keys. This results in a flatter tree (typically 3-4 levels for millions of rows), minimizing disk I/O operations.
2. **Sequential & Range Scanning**: Leaf nodes in a B+ Tree are connected via a doubly-linked list. Executing a range query (e.g. \`WHERE age BETWEEN 20 AND 30\`) requires finding the start key once, followed by simple linear traversal along the leaf chain.
3. **Consistent Search Latency**: All lookup operations traverse from root to leaf, giving uniform O(log N) depth.

## 3. Asymptotic Complexities
- Search: O(log_B N)
- Insertion: O(log_B N)
- Deletion: O(log_B N)`,
    isFavorite: true,
    isDemo: true,
    createdAt: '2026-10-20T10:30:00.000Z',
    updatedAt: '2026-10-20T10:30:00.000Z'
  },
  {
    id: 'note-2',
    title: 'Dijkstra vs Bellman-Ford Shortest Path Comparison',
    subjectId: 'sub-1',
    topic: 'Graph Algorithms',
    content: `# Single-Source Shortest Path Algorithms

## Dijkstra's Algorithm
- **Paradigm**: Greedy approach with a priority queue (min-heap).
- **Constraint**: Cannot handle graphs with negative edge weights.
- **Time Complexity**: O((V + E) log V) with binary heap.
- **Invariant**: Once a vertex is extracted from the min-heap, its shortest path distance is permanently finalized.

## Bellman-Ford Algorithm
- **Paradigm**: Dynamic Programming with edge relaxation.
- **Capability**: Handles negative edge weights and can detect **negative weight cycles**.
- **Time Complexity**: O(V * E).
- **Core Mechanism**: Relaxes all E edges exactly (V - 1) times. If a further relaxation in the V-th pass still reduces any distance, a reachable negative cycle is present.

## Key Exam Tip
If the exam question mentions "distributed routing protocols" (like RIP), Bellman-Ford is the underlying foundation!`,
    isFavorite: true,
    isDemo: true,
    createdAt: '2026-10-22T14:15:00.000Z',
    updatedAt: '2026-10-22T14:15:00.000Z'
  },
  {
    id: 'note-3',
    title: 'Virtual Memory & Page Replacement: LRU vs FIFO vs Optimal',
    subjectId: 'sub-3',
    topic: 'Memory Management',
    content: `# Virtual Memory Page Replacement Algorithms

## 1. FIFO (First In First Out)
- Replaces the oldest loaded page.
- **Pitfall**: Suffers from **Belady's Anomaly** (increasing the number of page frames can paradoxically increase page faults!).

## 2. Optimal (OPT / Belady's Algorithm)
- Replaces the page that will not be used for the longest duration in the future.
- **Practicality**: Impossible to implement in a real OS because future access sequence is unknown. Used strictly as a theoretical benchmark.

## 3. LRU (Least Recently Used)
- Replaces the page that has not been referenced for the longest period in the past.
- Does not suffer from Belady's Anomaly (it belongs to the class of stack algorithms).
- **Hardware approximations**: Clock (Second-chance) algorithm using reference bits.`,
    isFavorite: false,
    isDemo: true,
    createdAt: '2026-10-23T09:00:00.000Z',
    updatedAt: '2026-10-23T09:00:00.000Z'
  },
  {
    id: 'note-4',
    title: 'TCP 3-Way Handshake & Connection Teardown State Diagram',
    subjectId: 'sub-4',
    topic: 'Transport Layer Protocols',
    content: `# TCP 3-Way Handshake & Teardown

## Connection Establishment
1. **Client -> Server: SYN** (Seq = x)
2. **Server -> Client: SYN + ACK** (Seq = y, Ack = x + 1)
3. **Client -> Server: ACK** (Seq = x + 1, Ack = y + 1)
*Both sides now transition into the ESTABLISHED state.*

## Connection Teardown (4-Way Handshake)
1. Active closer sends **FIN** -> enters FIN_WAIT_1.
2. Passive receiver sends **ACK** -> enters CLOSE_WAIT; Active closer enters FIN_WAIT_2.
3. Passive receiver finishes sending remaining buffer data, then sends **FIN** -> enters LAST_ACK.
4. Active closer sends **ACK** -> enters **TIME_WAIT** (waits 2 * MSL = Maximum Segment Lifetime, typically 120s, to prevent duplicate delayed packets from confusing subsequent connections).`,
    isFavorite: false,
    isDemo: true,
    createdAt: '2026-10-24T16:20:00.000Z',
    updatedAt: '2026-10-24T16:20:00.000Z'
  }
];

export const INITIAL_PYQS: PYQuestion[] = [
  {
    id: 'pyq-1',
    title: 'Prove that Dijkstra fails on graphs with negative edge weights',
    subjectId: 'sub-1',
    unit: 'Unit 4',
    year: 2024,
    questionType: 'Long Answer',
    marks: 10,
    question: 'Explain the working of Dijkstra algorithm. Provide a counterexample graph demonstrating why Dijkstra algorithm produces incorrect shortest path distances when negative edge weights are present.',
    solution: `Model Answer & Solution:
1. Working Principle: Dijkstra maintains a set of visited vertices whose shortest path distance from source S is finalized, using a greedy choice via Min-Heap.
2. Counterexample:
Consider vertices A, B, C:
- Edge (A, B) = 3
- Edge (A, C) = 5
- Edge (B, C) = -4
Start node: A.
Dijkstra selects node B (dist=3) and marks B visited, then selects C (dist=5) and marks C visited.
However, path A -> B -> C has total weight 3 + (-4) = -1, which is strictly less than direct path A -> C (5).
Because Dijkstra greedily assumes visited nodes cannot be relaxed further by negative shortcuts, it fails to update distance(C) to -1.
Conclusion: For graphs with negative edge weights, Bellman-Ford algorithm must be used instead.`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-18T11:00:00.000Z'
  },
  {
    id: 'pyq-2',
    title: 'Explain 3NF vs BCNF with functional dependency examples',
    subjectId: 'sub-2',
    unit: 'Unit 2',
    year: 2023,
    questionType: 'Long Answer',
    marks: 10,
    question: 'Define 3rd Normal Form (3NF) and Boyce-Codd Normal Form (BCNF). What condition must hold in BCNF that is relaxed in 3NF? Give a concrete relation exhibiting the difference.',
    solution: `Model Answer & Solution:
- 3NF Definition: For every non-trivial functional dependency X -> Y:
  1. Either X is a superkey, OR
  2. Y is a prime attribute (part of any candidate key).
- BCNF Definition: For every non-trivial functional dependency X -> Y:
  - X MUST be a superkey (no relaxation for prime attributes).

Concrete Example:
Relation R(Student, Subject, Teacher)
Candidate Keys: (Student, Subject)
Functional Dependencies:
1. (Student, Subject) -> Teacher
2. Teacher -> Subject
Analysis:
- Teacher is NOT a superkey.
- But in dependency (Teacher -> Subject), Subject is a prime attribute.
- Therefore, relation R is in 3NF!
- However, relation R is NOT in BCNF because Teacher is not a superkey.
Decomposition to BCNF: R1(Teacher, Subject) and R2(Student, Teacher).`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-19T13:40:00.000Z'
  },
  {
    id: 'pyq-3',
    title: 'Explain the 4 Necessary Conditions for Deadlock in OS',
    subjectId: 'sub-3',
    unit: 'Unit 3',
    year: 2023,
    questionType: 'Short Answer',
    marks: 5,
    question: 'State and briefly explain the four Coffman conditions that must hold simultaneously for a system deadlock to occur.',
    solution: `Model Answer:
For a deadlock to arise, all four Coffman conditions must hold concurrently:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).
2. Hold and Wait: A process must currently be holding at least one resource and requesting additional resources held by other processes.
3. No Preemption: Resources cannot be forcibly confiscated from a process; they can only be released voluntarily after the process finishes.
4. Circular Wait: A closed chain of processes exists such that P0 is waiting for a resource held by P1, P1 is waiting for P2, and Pn is waiting for P0.
To prevent deadlocks, the operating system designs protocols that break at least one of these four conditions.`,
    isImportant: false,
    isDemo: true,
    createdAt: '2026-10-21T08:30:00.000Z'
  },
  {
    id: 'pyq-4',
    title: 'Subnetting Calculation: Find network address and broadcast IP',
    subjectId: 'sub-4',
    unit: 'Unit 3',
    year: 2024,
    questionType: 'Numerical',
    marks: 5,
    question: 'Given the IP address 192.168.10.138 with subnet mask /27, calculate: (a) Subnet Mask in dotted decimal, (b) Network Address, (c) First and Last Usable Host IP, (d) Directed Broadcast Address.',
    solution: `Step-by-step Numerical Solution:
1. Subnet Mask /27:
   - Binary: 11111111.11111111.11111111.11100000
   - Dotted Decimal: 255.255.255.224
2. Block Size:
   - 256 - 224 = 32 hosts per subnet.
   - Host bits = 32 - 27 = 5 bits (2^5 = 32).
3. Finding Subnet Range for 138:
   - Subnet increments: 0, 32, 64, 96, 128, 160...
   - 138 falls in subnet 128 (between 128 and 159).
4. Answers:
   (a) Subnet Mask: 255.255.255.224
   (b) Network Address: 192.168.10.128
   (c) Usable Host Range: 192.168.10.129 to 192.168.10.158
   (d) Directed Broadcast: 192.168.10.159`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-22T10:00:00.000Z'
  }
];

export const INITIAL_TASKS: RevisionTask[] = [
  {
    id: 'task-1',
    subjectId: 'sub-1',
    topic: 'Graph Traversals: BFS, DFS and Topological Sort',
    priority: 'High',
    deadline: '2026-10-29',
    isCompleted: false,
    estimatedHours: 3,
    notes: 'Solve LeetCode topological sort problems and practice cycle detection in directed graphs.'
  },
  {
    id: 'task-2',
    subjectId: 'sub-2',
    topic: 'SQL Normalization: 1NF through BCNF practice questions',
    priority: 'High',
    deadline: '2026-10-30',
    isCompleted: false,
    estimatedHours: 2.5,
    notes: 'Revise decomposition lossless join and dependency preservation proofs.'
  },
  {
    id: 'task-3',
    subjectId: 'sub-3',
    topic: 'Banker’s Algorithm for Deadlock Avoidance',
    priority: 'Medium',
    deadline: '2026-11-02',
    isCompleted: false,
    estimatedHours: 2,
    notes: 'Practice safety algorithm matrix calculations and resource request allocation.'
  },
  {
    id: 'task-4',
    subjectId: 'sub-4',
    topic: 'Subnetting and CIDR address calculation exercises',
    priority: 'High',
    deadline: '2026-10-28',
    isCompleted: true,
    completedAt: '2026-10-27T15:00:00.000Z',
    estimatedHours: 2,
    notes: 'Completed numerical exercises from Kurose & Ross Chapter 4.'
  },
  {
    id: 'task-5',
    subjectId: 'sub-5',
    topic: 'Pumping Lemma proofs for Non-Regular Languages',
    priority: 'Medium',
    deadline: '2026-11-05',
    isCompleted: false,
    estimatedHours: 3,
    notes: 'Focus on languages L = {0^n 1^n | n >= 0} and Palindrome verification.'
  },
  {
    id: 'task-6',
    subjectId: 'sub-1',
    topic: 'AVL Trees & Red-Black Tree Rotation properties',
    priority: 'Low',
    deadline: '2026-11-08',
    isCompleted: true,
    completedAt: '2026-10-26T18:00:00.000Z',
    estimatedHours: 2,
    notes: 'Summarized single and double rotations with balancing factor logic.'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    name: 'Mid-Term Theory Exam: Data Structures & Algorithms',
    subjectId: 'sub-1',
    examDate: '2026-11-04',
    time: '10:00 AM',
    location: 'Hall 3, Academic Block A',
    targetScore: '90+',
    notes: 'Covers Units 1 to 4: Asymptotic notations, Trees, Heaps, and Graph algorithms.'
  },
  {
    id: 'exam-2',
    name: 'Database Management Systems Semester Lab Exam',
    subjectId: 'sub-2',
    examDate: '2026-11-09',
    time: '02:00 PM',
    location: 'Computer Lab 204',
    targetScore: 'Full marks in query design',
    notes: 'PostgreSQL schema creation, triggers, stored procedures, and index optimization.'
  },
  {
    id: 'exam-3',
    name: 'Operating Systems End-Term Evaluation',
    subjectId: 'sub-3',
    examDate: '2026-11-16',
    time: '09:30 AM',
    location: 'Auditorium Hall B',
    targetScore: '85+',
    notes: 'Heavy emphasis on synchronization semaphores and virtual memory paging.'
  },
  {
    id: 'exam-4',
    name: 'Computer Networks Quiz 2',
    subjectId: 'sub-4',
    examDate: '2026-10-31',
    time: '11:15 AM',
    location: 'Room 108',
    targetScore: '25/25',
    notes: 'Subnetting, TCP congestion window phases (Slow Start, Congestion Avoidance).'
  }
];

export const INITIAL_STATE: AppState = {
  profile: {
    displayName: 'Alex Rivers',
    semester: 'Semester 5',
    branch: 'Computer Science & Engineering',
    collegeName: 'National Institute of Technology',
    targetGpa: '9.2 / 10.0'
  },
  subjects: INITIAL_SUBJECTS,
  notes: INITIAL_NOTES,
  pyqs: INITIAL_PYQS,
  tasks: INITIAL_TASKS,
  exams: INITIAL_EXAMS,
  pomodoroSessionsCount: 4,
  pomodoroSettings: {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true
  },
  theme: 'light'
};
