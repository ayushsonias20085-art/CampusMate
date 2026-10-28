import { AppState, Subject, Note, PYQuestion, RevisionTask, Exam } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    color: '#4F46E5', // Indigo
    description: 'Linear & non-linear data structures, trees, graphs, sorting, and asymptotic analysis for embedded IoT systems.'
  },
  {
    id: 'sub-2',
    name: 'Microcontrollers & Embedded Systems',
    code: 'IOT301',
    color: '#0284C7', // Sky
    description: 'ESP32 and ARM Cortex-M architecture, GPIO programming, timers, PWM, interrupts, and bare-metal firmware.'
  },
  {
    id: 'sub-3',
    name: 'Sensors, Actuators & Interfacing',
    code: 'IOT302',
    color: '#7C3AED', // Violet
    description: 'Transducers, signal conditioning, ADC/DAC conversion, I2C, SPI, and UART hardware sensor communication.'
  },
  {
    id: 'sub-4',
    name: 'IoT Communication Protocols',
    code: 'IOT303',
    color: '#0D9488', // Teal
    description: 'M2M protocols, MQTT, CoAP, HTTP REST, Zigbee, LoRaWAN, BLE, and gateway architectures.'
  },
  {
    id: 'sub-5',
    name: 'Digital Electronics & Logic Design',
    code: 'EC304',
    color: '#D97706', // Amber
    description: 'Combinational circuits, flip-flops, synchronous counters, finite state machines (FSM), and timing diagrams.'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'MQTT vs HTTP/REST: Bandwidth & Battery Optimization for IoT',
    subjectId: 'sub-4',
    topic: 'IoT Protocols',
    content: `# MQTT vs HTTP/REST in Resource-Constrained IoT

## 1. Core Architectural Differences
- **MQTT (Message Queuing Telemetry Transport)**: Publish-Subscribe paradigm over TCP, designed for lightweight M2M communications with low bandwidth and intermittent connectivity.
- **HTTP / REST**: Request-Response client-server paradigm with substantial HTTP header overhead (~800 bytes vs 2 bytes fixed header in MQTT).

## 2. Why IoT Systems Favor MQTT:
1. **Minimal Packet Overhead**: A minimal MQTT packet header is only **2 bytes**, compared to 500-1000 bytes in standard HTTP request/response headers.
2. **Quality of Service (QoS) Levels**:
   - **QoS 0 (At most once)**: Fire-and-forget; zero retry overhead (suitable for high-frequency telemetry like temperature updates).
   - **QoS 1 (At least once)**: Guaranteed delivery via PUBACK; message may arrive duplicate.
   - **QoS 2 (Exactly once)**: 4-step handshake (PUBLISH -> PUBREC -> PUBREL -> PUBCOMP); zero loss and zero duplicates.
3. **Keep-Alive & Battery Life**: Uses ping packets (PINGREQ/PINGRESP) to keep persistent TCP sockets open without continuous reconnection handshakes.

## 3. Real-World Recommendation
Use **MQTT** on edge sensors publishing telemetry to brokers (e.g. Eclipse Mosquitto, EMQX, AWS IoT Core). Use **HTTP/REST** strictly for bulk firmware uploads (FOTA) or external third-party dashboard APIs.`,
    isFavorite: true,
    isDemo: true,
    createdAt: '2026-10-20T10:30:00.000Z',
    updatedAt: '2026-10-20T10:30:00.000Z'
  },
  {
    id: 'note-2',
    title: 'I2C vs SPI Bus Protocols: Hardware Interfacing & Wire Arbitration',
    subjectId: 'sub-3',
    topic: 'Hardware Bus Protocols',
    content: `# I2C vs SPI Serial Communication Protocols

## 1. I2C (Inter-Integrated Circuit)
- **Lines Required**: Exactly **2 wires** — SDA (Serial Data) and SCL (Serial Clock) + pull-up resistors (typically 4.7kΩ).
- **Addressing**: 7-bit or 10-bit hardware addressing on the bus. Up to 127 devices on a single bus without extra pins.
- **Speed**: Standard (100 kbps), Fast Mode (400 kbps), High Speed (3.4 Mbps).
- **Communication Mode**: Half-duplex. Includes explicit ACK/NACK acknowledge bits.

## 2. SPI (Serial Peripheral Interface)
- **Lines Required**: **4 wires** — MOSI (Master Out Slave In), MISO (Master In Slave Out), SCK (Serial Clock), and SS/CS (Slave Select / Chip Select per device).
- **Addressing**: Pin-based hardware selection via dedicated Chip Select (CS) line for each peripheral.
- **Speed**: Extremely fast, often 10 MHz to 50+ MHz.
- **Communication Mode**: Full-duplex synchronous data streaming. No acknowledgment or flow control.

## 3. IoT Selection Heuristic
- Choose **I2C** when pin count is limited on your microcontroller (e.g. ESP32, STM32) and you need multiple sensors (BME280, MPU6050, OLED display) on the same shared 2 pins.
- Choose **SPI** for high-throughput peripherals like SD cards, graphical TFT LCD screens, and LoRa transceiver modules (SX1278).`,
    isFavorite: true,
    isDemo: true,
    createdAt: '2026-10-22T14:15:00.000Z',
    updatedAt: '2026-10-22T14:15:00.000Z'
  },
  {
    id: 'note-3',
    title: 'ESP32 Deep Sleep Modes & RTC Timers for Microamp Power',
    subjectId: 'sub-2',
    topic: 'Low-Power Microcontrollers',
    content: `# ESP32 Power Optimization & Deep Sleep Architecture

## 1. Operating Power Domains
- **Active Mode**: Wi-Fi + Bluetooth ON, Dual-core CPU running at 240 MHz -> ~160 mA to 260 mA current draw.
- **Modem Sleep Mode**: CPU active, Wi-Fi radio powered off -> ~20 mA to 30 mA.
- **Light Sleep Mode**: CPU clock gated, RTC and peripherals active -> ~0.8 mA.
- **Deep Sleep Mode**: Both CPU cores, Wi-Fi, and main RAM powered down. Only **ULP (Ultra Low Power) coprocessor, RTC controller, and RTC Slow Memory** remain powered -> **~10 µA to 15 µA**.

## 2. Deep Sleep Wakeup Sources:
1. **Timer Wakeup**: \`esp_sleep_enable_timer_wakeup(time_in_us)\` wakes automatically after a configured interval.
2. **External Wakeup (ext0 / ext1)**: Wakes up when a PIR motion sensor or push button triggers a GPIO level change.
3. **Touch Sensor Wakeup**: Capacitive touch pin detection.

## 3. Critical IoT Design Pattern
Store calibration variables or packet sequence counters inside RTC memory (\`RTC_DATA_ATTR int bootCount = 0;\`) so data survives deep sleep cycles without writing to flash EEPROM.`,
    isFavorite: true,
    isDemo: true,
    createdAt: '2026-10-23T09:00:00.000Z',
    updatedAt: '2026-10-23T09:00:00.000Z'
  },
  {
    id: 'note-4',
    title: 'Analog-to-Digital Conversion (ADC): Sampling Rate & Quantization',
    subjectId: 'sub-3',
    topic: 'Sensor Signal Conditioning',
    content: `# ADC Fundamentals for IoT Sensor Nodes

## 1. Nyquist-Shannon Sampling Theorem
To faithfully capture an analog sensor signal without aliasing:
\`\`\`
f_sampling >= 2 * f_max
\`\`\`
If sampling a biomedical pulse sensor with max frequency 25 Hz, the sampling frequency must be at least 50 Hz.

## 2. Quantization Step Size (Resolution)
For an n-bit ADC with reference voltage V_ref:
\`\`\`
Step Size (LSB Voltage) = V_ref / (2^n)
\`\`\`
- Example with 12-bit ADC (ESP32 / STM32) and V_ref = 3.3V:
  \`Step = 3.3V / 4096 = 0.805 mV\` per ADC count.
- Example with 10-bit ADC (Arduino Uno ATmega328P) and V_ref = 5.0V:
  \`Step = 5.0V / 1024 = 4.88 mV\` per count.

## 3. Signal Conditioning Pipeline
Analog Sensor -> Low-Pass Anti-Aliasing Filter -> Instrumentation Amplifier -> ADC -> Digital Filtering (Moving Average / Kalman Filter).`,
    isFavorite: false,
    isDemo: true,
    createdAt: '2026-10-24T16:20:00.000Z',
    updatedAt: '2026-10-24T16:20:00.000Z'
  }
];

export const INITIAL_PYQS: PYQuestion[] = [
  {
    id: 'pyq-1',
    title: 'Explain MQTT Architecture, Topics, and Quality of Service (QoS 0, 1, 2)',
    subjectId: 'sub-4',
    unit: 'Unit 3',
    year: 2024,
    questionType: 'Long Answer',
    marks: 10,
    question: 'Describe the publish-subscribe architecture of MQTT. Detail how MQTT topic hierarchies and wildcards (+ and #) work. Compare the transmission handshakes of QoS 0, QoS 1, and QoS 2 with timing flow diagrams.',
    solution: `Model Answer & Solution:
1. MQTT Architecture:
   - Three key components: Publisher (sensors), Broker (central server/hub like Mosquitto), and Subscriber (dashboards, cloud databases).
   - Decoupled in time, space, and synchronization.
2. Topic Hierarchies:
   - Structured using forward slashes: "campus/buildingA/floor3/temperature".
   - Wildcards:
     * '+' matches exactly one topic level: "campus/buildingA/+/temperature".
     * '#' matches multiple levels hierarchically: "campus/buildingA/#".
3. Quality of Service (QoS) Handshakes:
   - QoS 0 (At most once): 1 packet. Client sends PUBLISH. No ACK.
   - QoS 1 (At least once): 2 packets. Client sends PUBLISH(PacketID); Broker responds with PUBACK(PacketID). If timeout occurs, message retransmitted with DUP flag.
   - QoS 2 (Exactly once): 4-step handshake preventing duplicates:
     Client -> PUBLISH -> Broker
     Client <- PUBREC  <- Broker
     Client -> PUBREL  -> Broker
     Client <- PUBCOMP <- Broker`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-18T11:00:00.000Z'
  },
  {
    id: 'pyq-2',
    title: 'Compare I2C and SPI buses: Pin Count, Arbitration, and Throughput',
    subjectId: 'sub-3',
    unit: 'Unit 2',
    year: 2023,
    questionType: 'Long Answer',
    marks: 10,
    question: 'Provide an exhaustive comparison between I2C and SPI serial communication buses in embedded IoT systems. Discuss clock synchronization, multi-master arbitration, line overhead, and power consumption.',
    solution: `Model Answer & Solution:
1. Pin Count & Topology:
   - I2C: Exactly 2 pins (SDA, SCL). Open-drain with external pull-ups.
   - SPI: 3 shared lines (MOSI, MISO, SCK) + 1 Chip Select (CS) line per peripheral. For N devices: (3 + N) pins required.
2. Data Rates:
   - I2C: 100 kbps (Standard), 400 kbps (Fast), up to 3.4 Mbps (High Speed).
   - SPI: Easily 10 Mbps to 80 Mbps, limited only by clock slew and PCB trace length.
3. Duplexity:
   - I2C: Half-duplex (data flows either transmit or receive on single SDA wire).
   - SPI: Full-duplex (simultaneous write on MOSI and read on MISO).
4. Multi-Master Arbitration:
   - I2C has built-in hardware collision detection via wired-AND clock stretching and bit-by-bit arbitration.
   - SPI lacks standard multi-master arbitration; external multiplexing logic is needed.
Conclusion: I2C is ideal for sensor hubs with many low-speed nodes; SPI is mandatory for high-throughput display/RF transceivers.`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-19T13:40:00.000Z'
  },
  {
    id: 'pyq-3',
    title: 'Battery Lifetime Calculation for ESP32 LoRa Sensor Node in Deep Sleep',
    subjectId: 'sub-2',
    unit: 'Unit 4',
    year: 2024,
    questionType: 'Numerical',
    marks: 5,
    question: 'An IoT sensor node is powered by a 2400 mAh Li-ion battery. The node wakes up once every 5 minutes (300 seconds), stays active for 3 seconds drawing 120 mA while reading sensors and transmitting a LoRa packet, and sleeps for the remaining 297 seconds drawing 15 µA in deep sleep. Calculate the average current consumption and estimated operational battery lifetime in days.',
    solution: `Step-by-Step Numerical Solution:
1. Cycle Parameters:
   - Total Cycle Time T_cycle = 300 s
   - Active Time T_active = 3 s
   - Active Current I_active = 120 mA
   - Sleep Time T_sleep = 297 s
   - Sleep Current I_sleep = 15 µA = 0.015 mA

2. Average Current Consumption (I_avg):
   I_avg = (I_active * T_active + I_sleep * T_sleep) / T_cycle
   I_avg = (120 mA * 3 s + 0.015 mA * 297 s) / 300 s
   I_avg = (360 + 4.455) / 300
   I_avg = 364.455 / 300 = 1.2148 mA

3. Operational Lifetime:
   - Usable Battery Capacity = 2400 mAh * 0.85 (accounting for 15% discharge inefficiency) = 2040 mAh
   - Lifetime in Hours = 2040 mAh / 1.2148 mA = 1679.28 hours
   - Lifetime in Days = 1679.28 / 24 = 70.0 days (~2.3 months)
Conclusion: The IoT node will operate continuously for approximately 70 days.`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-21T08:30:00.000Z'
  },
  {
    id: 'pyq-4',
    title: 'Design a 4-Bit Synchronous Binary Up-Counter using J-K Flip Flops',
    subjectId: 'sub-5',
    unit: 'Unit 3',
    year: 2023,
    questionType: 'Long Answer',
    marks: 10,
    question: 'Design a 4-bit synchronous binary up-counter using positive edge-triggered J-K flip-flops. Draw the state transition table, derive the simplified J and K excitation equations using Karnaugh Maps, and sketch the complete circuit logic diagram.',
    solution: `Model Answer & Solution:
1. Flip-Flop States: Q3, Q2, Q1, Q0 (Q0 is LSB, Q3 is MSB).
2. Excitation Table for JK Flip-Flop:
   0 -> 0 : J=0, K=X
   0 -> 1 : J=1, K=X
   1 -> 0 : J=X, K=1
   1 -> 1 : J=X, K=0

3. Derived Simplified Boolean Equations via K-Maps:
   - For FF0: J0 = 1, K0 = 1 (Toggles on every single clock edge)
   - For FF1: J1 = Q0, K1 = Q0 (Toggles when Q0 = 1)
   - For FF2: J2 = Q1 * Q0, K2 = Q1 * Q0 (Toggles when both Q1 and Q0 = 1)
   - For FF3: J3 = Q2 * Q1 * Q0, K3 = Q2 * Q1 * Q0 (Toggles when Q2, Q1, and Q0 are all 1)

4. Circuit Implementation:
   - Common synchronous clock line connected to the CLK input of all 4 flip-flops simultaneously.
   - AND gates are used to cascade product terms (Q0 -> Q1*Q0 -> Q2*Q1*Q0) to eliminate asynchronous ripple propagation delay.`,
    isImportant: true,
    isDemo: true,
    createdAt: '2026-10-22T10:00:00.000Z'
  }
];

export const INITIAL_TASKS: RevisionTask[] = [
  {
    id: 'task-1',
    subjectId: 'sub-2',
    topic: 'Interfacing DHT22 and I2C OLED Display with ESP32',
    priority: 'High',
    deadline: '2026-10-29',
    isCompleted: false,
    estimatedHours: 2.5,
    notes: 'Implement Adafruit SSD1306 and DHT sensor libraries; test temperature reading refresh cycle.'
  },
  {
    id: 'task-2',
    subjectId: 'sub-4',
    topic: 'MQTT PubSubClient library & Mosquitto Broker integration',
    priority: 'High',
    deadline: '2026-10-30',
    isCompleted: false,
    estimatedHours: 3,
    notes: 'Test QoS 0 vs QoS 1 telemetry publish over campus Wi-Fi and subscribe using Python test client.'
  },
  {
    id: 'task-3',
    subjectId: 'sub-5',
    topic: 'Modulo-16 Synchronous Up-Counter K-Map & Circuit Design',
    priority: 'Medium',
    deadline: '2026-11-02',
    isCompleted: false,
    estimatedHours: 2,
    notes: 'Review JK flip-flop excitation tables and resolve hazard states in transition equations.'
  },
  {
    id: 'task-4',
    subjectId: 'sub-1',
    topic: 'Graph BFS & Dijkstra algorithm implementation in C++',
    priority: 'High',
    deadline: '2026-10-28',
    isCompleted: true,
    completedAt: '2026-10-27T15:00:00.000Z',
    estimatedHours: 2.5,
    notes: 'Completed priority queue implementation and shortest routing path simulation.'
  },
  {
    id: 'task-5',
    subjectId: 'sub-3',
    topic: '12-bit ADC Quantization step & SNR numerical problems',
    priority: 'Medium',
    deadline: '2026-11-05',
    isCompleted: false,
    estimatedHours: 2,
    notes: 'Practice Nyquist sampling calculations and instrumentation op-amp gain formulas.'
  },
  {
    id: 'task-6',
    subjectId: 'sub-1',
    topic: 'Binary Search Tree (BST) insertion, search & balance properties',
    priority: 'Low',
    deadline: '2026-11-08',
    isCompleted: true,
    completedAt: '2026-10-26T18:00:00.000Z',
    estimatedHours: 2,
    notes: 'Verified in-order traversal yields sorted order; analyzed O(log N) average depth.'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    name: 'Microcontrollers & Embedded Systems Mid-Term (IOT301)',
    subjectId: 'sub-2',
    examDate: '2026-11-04',
    time: '10:00 AM',
    location: 'Hall 3, IoT Academic Block',
    targetScore: '92+',
    notes: 'Covers ESP32 core architecture, GPIO registers, hardware timers, interrupts, and deep sleep modes.'
  },
  {
    id: 'exam-2',
    name: 'IoT Hardware Interfacing Practical Lab Exam (IOT302)',
    subjectId: 'sub-3',
    examDate: '2026-11-09',
    time: '02:00 PM',
    location: 'IoT Hardware Lab 104',
    targetScore: 'Full marks in circuit wiring & code',
    notes: 'Hands-on interfacing: I2C OLED display, DHT22 sensor, ADC light sensor, and serial telemetry.'
  },
  {
    id: 'exam-3',
    name: 'Data Structures & Algorithms Semester Evaluation (CS201)',
    subjectId: 'sub-1',
    examDate: '2026-11-16',
    time: '09:30 AM',
    location: 'Auditorium Hall B',
    targetScore: '88+',
    notes: 'Emphasis on Trees, Heaps, Graph traversals, and dynamic programming algorithms.'
  },
  {
    id: 'exam-4',
    name: 'IoT Communication Protocols Quiz 2 (IOT303)',
    subjectId: 'sub-4',
    examDate: '2026-10-31',
    time: '11:15 AM',
    location: 'Room 204',
    targetScore: '25/25',
    notes: 'MQTT message frames, QoS handshakes, CoAP observe model, and LoRaWAN classes (A, B, C).'
  }
];

export const INITIAL_STATE: AppState = {
  profile: {
    displayName: 'Ayush Kumar',
    semester: 'Semester 3',
    branch: 'Internet of Things (IoT)',
    collegeName: 'National Institute of Technology',
    targetGpa: '9.4 / 10.0'
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
