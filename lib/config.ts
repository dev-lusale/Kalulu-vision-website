// ============================================================
// KALULU VISION — Central Configuration
// Edit this file to update all prices, contact details, and
// payment information across the entire application.
// ============================================================

export const SITE_CONFIG = {
  name: "KALULU VISION",
  tagline: "Innovate. Empower. Transform.",
  description:
    "Practical technology training designed to help you develop real-world digital skills and build solutions for the future.",
  email: "bernardlusale20@gmail.com",
  /** WhatsApp number in international format — no spaces, no + */
  whatsappNumber: "260972079994",
  year: 2026,
} as const;

// ── Subscription Plans ────────────────────────────────────────
export type PlanId = "weekly" | "monthly" | "one-on-one";

export interface Plan {
  id: PlanId;
  label: string;
  price: number; // ZMW (Kwacha)
  durationDays: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "weekly",
    label: "Weekly",
    price: 150,
    durationDays: 7,
    description: "7 days of full access",
    features: [
      "7 days of access",
      "All course materials",
      "WhatsApp support",
      "Certificate on completion",
    ],
  },
  {
    id: "monthly",
    label: "Monthly",
    price: 450,
    durationDays: 30,
    description: "30 days of full access",
    features: [
      "30 days of access",
      "All course materials",
      "Priority WhatsApp support",
      "Certificate on completion",
      "Project feedback",
    ],
    highlighted: true,
  },
  {
    id: "one-on-one",
    label: "1-on-1 Training",
    price: 800,
    durationDays: 30,
    description: "Personalised one-on-one training",
    features: [
      "30 days personalised access",
      "Dedicated instructor",
      "Custom learning schedule",
      "Direct mentorship",
      "Project guidance",
      "Certificate on completion",
    ],
  },
];

// ── Courses ───────────────────────────────────────────────────
export type CourseId =
  | "programming"
  | "web-development"
  | "ai-ml"
  | "data-analytics"
  | "automation"
  | "iot-embedded"
  | "custom";

export interface SubTopic {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface Course {
  id: CourseId;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  icon: string; // emoji icon
  /** If present, tapping the card shows a sub-topic picker before enrolling */
  subTopics?: SubTopic[];
}

export const COURSES: Course[] = [
  {
    id: "programming",
    title: "Programming",
    subtitle: "Python • Java • JavaScript • C++ & more",
    description:
      "Master the fundamentals of software development. Choose your language and build real applications from day one.",
    topics: ["Python", "Java", "JavaScript", "C++", "OOP", "Data Structures"],
    icon: "💻",
    subTopics: [
      {
        id: "python",
        label: "Python",
        description: "Scripting, automation, data science & general-purpose development.",
        icon: "🐍",
      },
      {
        id: "java",
        label: "Java",
        description: "OOP fundamentals, Android basics & enterprise application development.",
        icon: "☕",
      },
      {
        id: "javascript",
        label: "JavaScript",
        description: "Browser scripting, DOM manipulation, Node.js & modern ES6+ features.",
        icon: "🟨",
      },
      {
        id: "cpp",
        label: "C++",
        description: "Systems programming, memory management, algorithms & competitive coding.",
        icon: "⚡",
      },
      {
        id: "csharp",
        label: "C#",
        description: ".NET development, desktop applications & game development with Unity.",
        icon: "💠",
      },
      {
        id: "php",
        label: "PHP",
        description: "Server-side web development, WordPress & database-driven applications.",
        icon: "🐘",
      },
      {
        id: "kotlin",
        label: "Kotlin",
        description: "Modern Android app development and JVM-based applications.",
        icon: "🎯",
      },
      {
        id: "other",
        label: "Other / Not Sure",
        description: "Tell us what you want to learn — we will design a curriculum for you.",
        icon: "💬",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    subtitle: "HTML • CSS • React",
    description:
      "Design and build modern, responsive web applications using the latest front-end and full-stack technologies.",
    topics: ["HTML", "CSS", "JavaScript", "React", "Next.js", "REST APIs"],
    icon: "🌐",
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & ML",
    subtitle: "AI • Machine Learning • Projects",
    description:
      "Explore AI fundamentals, machine learning models, and build intelligent applications with practical projects.",
    topics: [
      "AI Fundamentals",
      "Machine Learning",
      "Neural Networks",
      "Python AI Libraries",
      "Practical Projects",
    ],
    icon: "🤖",
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    subtitle: "Analysis • Visualization • Statistics",
    description:
      "Transform raw data into actionable insights using analytics tools, visualisation libraries, and statistical methods.",
    topics: [
      "Data Analysis",
      "Visualisation",
      "Statistics",
      "Excel/Sheets",
      "Python Pandas",
      "Dashboards",
    ],
    icon: "📊",
  },
  {
    id: "automation",
    title: "Automation",
    subtitle: "Task & Workflow Automation",
    description:
      "Automate repetitive tasks, build workflow automation solutions, and dramatically boost your productivity.",
    topics: [
      "Python Scripting",
      "Task Automation",
      "Workflow Design",
      "Web Scraping",
      "Scheduling",
    ],
    icon: "⚙️",
  },
  {
    id: "iot-embedded",
    title: "IoT & Embedded Systems",
    subtitle: "Microcontrollers • Sensors • Connected Devices",
    description:
      "Design and program embedded systems, connect sensors, and build smart IoT solutions for the real world.",
    topics: [
      "Arduino",
      "Raspberry Pi",
      "Sensors & Actuators",
      "C/C++",
      "IoT Protocols",
      "Connected Systems",
    ],
    icon: "🔌",
  },
  {
    id: "custom",
    title: "Custom / One-on-One Training",
    subtitle: "Tailored to your goals",
    description:
      "Get a personalised training programme designed specifically around your learning goals, schedule, and skill level.",
    topics: [
      "Any Technology",
      "Custom Curriculum",
      "Flexible Schedule",
      "Direct Mentorship",
    ],
    icon: "🎯",
  },
];

// ── Learning Modes ────────────────────────────────────────────
export type LearningMode = "online" | "physical" | "one-on-one";

export const LEARNING_MODES: { value: LearningMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "physical", label: "Physical (In-person)" },
  { value: "one-on-one", label: "One-on-One" },
];

// ── Payment Details ───────────────────────────────────────────
export const PAYMENT_DETAILS = {
  momo: {
    provider: "MTN Mobile Money",
    number: "+260 768 205 108",
    name: "Bernard Lusale",
  },
  bank: {
    bankName: "Zanaco Bank",
    accountName: "Bernard Lusale",
    accountNumber: "7735876100101",
    branch: "Zambia National Commercial Bank",
    swiftCode: "ZNCOZMLU",
  },
} as const;

// ── Admin ─────────────────────────────────────────────────────
/** Change this in production — use env var ADMIN_PASSWORD */
export const ADMIN_EMAIL = "admin@kaluluvision.com";
