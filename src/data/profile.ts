/**
 * ============================================================================
 *  PROFILE DATA — edit everything about the site from this single file.
 *  Every section reads from here. Keep the structure; change the values.
 * ============================================================================
 */

export const profile = {
  name: "Tauseef Khan",
  shortName: "TAUSEEF.KHAN",
  roles: [
    "Technology Enthusiast",
    "Developer",
    "UI/UX Designer",
    "Software Tester",
    "AI Prompt Engineer",
  ],
  heroIntro:
    "I build digital experiences, explore emerging technologies, and turn ideas into functional, engaging products.",
};

export const heroOrbLabels = [
  "Code",
  "AI",
  "Web",
  "Mobile",
  "UI/UX",
  "Testing",
  "Automation",
];

export const perspective = {
  heading: "My Perspective",
  body: "Technology is more than writing code. It's about understanding problems, designing meaningful experiences, experimenting with new ideas, and continuously learning. I enjoy exploring different areas of technology and combining creativity with technical thinking to build useful digital experiences.",
};

/* -------------------------------------------------------------------------- */
/*  SKILLS                                                                    */
/* -------------------------------------------------------------------------- */

export type SkillGroup = {
  id: string;
  label: string;
  icon: string;
  accent: string;
  skills: { name: string; note: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "development",
    label: "Development",
    icon: "C",
    accent: "#22d3ee",
    skills: [
      { name: "Mobile App Development", note: "Building mobile apps with modern Android tooling and clean structure." },
      { name: "Android Development", note: "Developing Android applications using the Android SDK." },
      { name: "Web Development", note: "Crafting responsive, fast, and accessible websites." },
      { name: "Responsive Website Design", note: "Layouts that adapt beautifully across every screen size." },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: "D",
    accent: "#e879f9",
    skills: [
      { name: "UI/UX Design", note: "Designing intuitive, engaging user experiences." },
      { name: "Interface Design", note: "Clean, modern interfaces with a clear visual hierarchy." },
      { name: "Photo Editing", note: "Enhancing and editing visuals with care and precision." },
      { name: "Visual Design", note: "Using color, typography and layout to communicate clearly." },
    ],
  },
  {
    id: "technology",
    label: "Technology",
    icon: "T",
    accent: "#8b5cf6",
    skills: [
      { name: "AI & Prompt Engineering", note: "Exploring AI tools and crafting effective prompts." },
      { name: "Automation", note: "Automating repetitive tasks to save time and reduce errors." },
      { name: "Software Testing", note: "Finding bugs, thinking in test cases, evaluating usability." },
      { name: "Problem Solving", note: "Breaking problems down and building practical solutions." },
    ],
  },
];

export const tools = [
  "Android SDK",
  "Git",
  "GitHub",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "Termux",
  "AI Tools",
];

/* -------------------------------------------------------------------------- */
/*  PROJECTS — replace the example entries with your real projects.           */
/*  Leave `github` / `demo` empty to hide the button.                         */
/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  technologies: string[];
  contribution: string;
  status: string;
  github?: string;
  demo?: string;
  accent: string;
};

export const projects: Project[] = [
  {
    id: "space-research",
    name: "Space Research Platform",
    tagline: "Interactive 3D platform to explore the solar system, exoplanets, asteroids and NASA research data.",
    description:
      "An immersive 3D space research platform. Fly through the solar system, inspect exoplanets and asteroids, and browse real NASA research data — all inside an interactive 3D environment.",
    technologies: ["TypeScript", "React", "Three.js"],
    contribution: "Concept, design and development — built by me.",
    status: "Live",
    github: "https://github.com/Tauseef666-ctrl/PLANET-RESEARCH",
    demo: "https://planet-research.vercel.app/",
    accent: "#60a5fa",
  },
  {
    id: "ecoscore",
    name: "EcoScore",
    tagline: "CBSE Class 12 Economics learning platform — understand concepts, practise smarter, revise faster, score better.",
    description:
      "A focused learning platform for CBSE Class 12 Economics covering Macroeconomics and Indian Economic Development, built to make concepts click and revision efficient.",
    technologies: ["React", "Next.js"],
    contribution: "Concept, design and development — built by me.",
    status: "Live",
    github: "",
    demo: "https://economics-beta.vercel.app/",
    accent: "#fbbf24",
  },
  {
    id: "ninja-slice",
    name: "Ninja Slice",
    tagline: "A Fruit Ninja-style browser game you control with your hands — real-time webcam hand tracking slices the fruit.",
    description:
      "A browser slicing game powered by webcam hand tracking. Your hands become blades — slash flying fruit in real time using MediaPipe hand-tracking, no controller needed.",
    technologies: ["JavaScript", "MediaPipe", "Webcam Tracking"],
    contribution: "Concept, design and development — built by me.",
    status: "Live",
    github: "",
    demo: "https://fruitninja-by.netlify.app/",
    accent: "#fb923c",
  },
  {
    id: "btech-prep",
    name: "CSE Entrance Prep",
    tagline: "Smart study tracker for CSE entrance preparation — organised subjects, progress tracking and revision planning.",
    description:
      "An offline-first study companion for CSE entrance preparation. Track subjects, monitor progress and plan revisions with a clean, distraction-free interface.",
    technologies: ["HTML", "CSS", "JavaScript"],
    contribution: "Concept, design and development — built by me.",
    status: "Live",
    github: "",
    demo: "https://btech-prep.netlify.app/",
    accent: "#34d399",
  },
  {
    id: "luna-ai",
    name: "Luna AI",
    tagline: "Personal AI voice assistant for Windows 11 — offline multilingual voice, 3D avatars with lipsync and task automation.",
    description:
      "A desktop AI voice assistant that works offline-first with English, Hindi and Urdu voice support. Features 3D animated avatars with lipsync, task automation, and both local (Ollama) and cloud modes.",
    technologies: ["Python", "Tauri", "TypeScript", "Ollama"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/luna-ai",
    demo: "",
    accent: "#a78bfa",
  },
  {
    id: "t2s",
    name: "T2S — Study Together",
    tagline: "Three friends, one journey — a group study app with quizzes, shared notes, AI chat, focus timer and exam prep.",
    description:
      "A futuristic group study app built for three Diploma CSE friends. Study groups, subject quizzes, shared notes and resources, an AI chat for core CS subjects, a Pomodoro focus timer and exam preparation — all in one place.",
    technologies: ["React Native", "Expo", "TypeScript"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/T2S",
    demo: "",
    accent: "#f472b6",
  },
  {
    id: "cybersec-hub",
    name: "CyberSec Hub",
    tagline: "Learn cybersecurity from scratch — an Android app with 7 tracks, 39 lessons, a sandboxed terminal and completion certificates.",
    description:
      "A complete cybersecurity learning app for Android. Learners move through structured tracks and lessons, practise inside a safe sandboxed terminal, and earn completion certificates as they progress.",
    technologies: ["Android", "HTML", "Cybersecurity"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/cybersec-hub",
    demo: "",
    accent: "#22d3ee",
  },
  {
    id: "evolve",
    name: "Evolve",
    tagline: "A gamified todo app that reminds you to evolve as a human — set goals, complete tasks, earn XP and level up.",
    description:
      "Evolve turns daily tasks into a game. Completing goals earns experience points and levels, making personal growth something you actually want to keep doing.",
    technologies: ["Kotlin", "Android"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/evolve",
    demo: "",
    accent: "#e879f9",
  },
  {
    id: "ropetyper",
    name: "RopeTyper",
    tagline: "An Android typing game designed to improve your WPM and accuracy through engaging, interactive gameplay.",
    description:
      "A typing game that challenges you across multiple difficulty levels and tracks your progress over time — built to make practising typing genuinely fun.",
    technologies: ["Java", "Android", "Game Design"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/ropetyper",
    demo: "",
    accent: "#8b5cf6",
  },
  {
    id: "python-learn-app",
    name: "Python Learn App",
    tagline: "An interactive Python learning platform for beginners with 23 chapters, real code execution, gamification and a dark hacker UI.",
    description:
      "A beginner-friendly platform that teaches Python through 23 chapters, lets learners run real code, and keeps motivation up with gamification and a sleek dark interface.",
    technologies: ["TypeScript", "Python", "Web Development"],
    contribution: "Author and developer of the project.",
    status: "Open Source",
    github: "https://github.com/Tauseef666-ctrl/python-learn-app",
    demo: "",
    accent: "#3b82f6",
  },
  {
    id: "portfolio",
    name: "This Portfolio",
    tagline: "An interactive 3D representation of my perspective on technology.",
    description:
      "A fully interactive, 3D portfolio built to feel like a continuous digital environment rather than a static page — featuring a live 3D orb, scroll-driven sections and cinematic transitions.",
    technologies: ["React", "TypeScript", "Three.js", "React Three Fiber", "Framer Motion", "Lenis"],
    contribution: "Concept, design, development and 3D interactions — all built by me.",
    status: "Published",
    github: "https://github.com/Tauseef666-ctrl",
    demo: "",
    accent: "#34d399",
  },
];

/* -------------------------------------------------------------------------- */
/*  SOFTWARE TESTING                                                          */
/* -------------------------------------------------------------------------- */

export const testingCapabilities = [
  "Functional Testing",
  "UI Testing",
  "Bug Identification",
  "Usability Testing",
  "Test Case Thinking",
  "User Experience Evaluation",
];

export const testingDemos = [
  { id: "b1", label: "Login flow", detail: "Password field accepted whitespace-only input." },
  { id: "b2", label: "Responsive layout", detail: "Button overlaps text below 360px width." },
  { id: "b3", label: "Empty state", detail: "No message shown when list is empty." },
  { id: "b4", label: "Form validation", detail: "Invalid email passed without a warning." },
  { id: "b5", label: "Navigation", detail: "Menu closes on outside click on mobile." },
];

/* -------------------------------------------------------------------------- */
/*  AI                                                                        */
/* -------------------------------------------------------------------------- */

export const aiInterests = [
  "AI Prompt Engineering",
  "AI-assisted Development",
  "Automation",
  "AI-powered Applications",
  "Experimentation with Emerging AI Tools",
];

/* -------------------------------------------------------------------------- */
/*  ABOUT                                                                     */
/* -------------------------------------------------------------------------- */

export const about = {
  bio: "Technology enthusiast focused on development, design, testing, AI, and experimentation.",
  interests: [
    "Learning new technologies",
    "Building digital projects",
    "Exploring AI",
    "Designing interfaces",
    "Testing applications",
    "Solving technical problems",
    "Experimenting with new ideas",
  ],
};

/* -------------------------------------------------------------------------- */
/*  JOURNEY — my learning path, not employment history.                       */
/* -------------------------------------------------------------------------- */

export const journey = [
  { stage: "Learning", note: "Starting the journey — picking up the fundamentals of technology and programming." },
  { stage: "Experimenting", note: "Trying new tools, languages and ideas to understand how things work." },
  { stage: "Building", note: "Turning ideas into real things — apps, websites and experiments." },
  { stage: "Testing", note: "Evaluating what I build, finding bugs and improving usability." },
  { stage: "Improving", note: "Refining skills, learning from mistakes and iterating on designs." },
  { stage: "Creating", note: "Combining everything to craft polished, functional digital experiences." },
];

/* -------------------------------------------------------------------------- */
/*  CERTIFICATES — real certificates only. Files live in public/certificates/. */
/* -------------------------------------------------------------------------- */

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  file: string;
  verify?: string;
  skills: string[];
  accent: string;
};

export const certificates: Certificate[] = [
  {
    id: "deloitte-cyber",
    title: "Cyber Job Simulation",
    issuer: "Deloitte · Forage",
    date: "Jun 2026",
    file: "certificates/deloitte-cyber-job-simulation.pdf",
    skills: ["Cybersecurity"],
    accent: "#22d3ee",
  },
  {
    id: "deloitte-data",
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte · Forage",
    date: "Jun 2026",
    file: "certificates/deloitte-data-analytics-simulation.pdf",
    skills: ["Data Analysis", "Forensic Technology"],
    accent: "#8b5cf6",
  },
  {
    id: "deloitte-tech",
    title: "Technology Job Simulation",
    issuer: "Deloitte · Forage",
    date: "Jun 2026",
    file: "certificates/deloitte-technology-job-simulation.pdf",
    skills: ["Coding Development"],
    accent: "#3b82f6",
  },
  {
    id: "ibm-generative-ai",
    title: "Generative AI in Action",
    issuer: "IBM SkillsBuild",
    date: "Aug 2026",
    file: "certificates/ibm-generative-ai-in-action.pdf",
    verify: "https://www.credly.com/badges/c5c7ee68-99d4-40a6-a233-5c41fb8ea740",
    skills: ["Generative AI"],
    accent: "#38bdf8",
  },
  {
    id: "ey-microsoft-ai",
    title: "AI Skills Passport",
    issuer: "EY & Microsoft",
    file: "certificates/ey-microsoft-ai-skills-passport.pdf",
    skills: ["Artificial Intelligence", "Employability"],
    accent: "#e879f9",
  },
  {
    id: "indeed-resume",
    title: "How to Make a Resume (With Examples)",
    issuer: "Indeed Career Guide · SkillsBuild",
    date: "Aug 2026",
    file: "certificates/indeed-resume-skillsbuild.pdf",
    skills: ["Career Skills"],
    accent: "#34d399",
  },
  {
    id: "digicoders",
    title: "Training Certificate",
    issuer: "DigiCoders",
    file: "certificates/digicoders-certificate.jpg",
    skills: [],
    accent: "#fbbf24",
  },
];

/* -------------------------------------------------------------------------- */
/*  ACHIEVEMENTS — placeholder slots. Fill them in as you earn them.          */
/*  Never leave fabricated achievements in here.                              */
/* -------------------------------------------------------------------------- */

export const achievements = [
  {
    title: "Open Source Projects",
    hint: "8+ projects published — CyberSec Hub, Luna AI, Space Research Platform, Evolve and more.",
    filled: true,
  },
  {
    title: "Skill Milestones",
    hint: "Android development · Web development · Software testing · AI prompt engineering.",
    filled: true,
  },
  {
    title: "Certifications",
    hint: "7 certificates earned — IBM Generative AI, Deloitte job simulations, EY & Microsoft AI Skills Passport and more.",
    filled: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  CONTACT — leave empty until you add your real profiles.                   */
/*  Never put fake contact information in here.                               */
/* -------------------------------------------------------------------------- */

export const contact = {
  heading: "Let's Build Something",
  note: "Want to collaborate, share an idea, or just talk about technology? My inbox is open.",
  email: "tauseefbrh11@gmail.com",
  github: "https://github.com/Tauseef666-ctrl",
  linkedin: "", // e.g. "https://www.linkedin.com/in/yourname"
  socials: [] as { label: string; href: string }[],
};
