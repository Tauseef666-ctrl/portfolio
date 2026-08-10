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
/*  ACHIEVEMENTS — placeholder slots. Fill them in as you earn them.          */
/*  Never leave fabricated achievements in here.                              */
/* -------------------------------------------------------------------------- */

export const achievements = [
  {
    title: "Open Source Projects",
    hint: "4 projects published on GitHub — CyberSec Hub, Evolve, RopeTyper and Python Learn App.",
    filled: true,
  },
  {
    title: "Skill Milestones",
    hint: "Android development · Web development · Software testing · AI prompt engineering.",
    filled: true,
  },
  {
    title: "Certifications",
    hint: "Add your certifications here as you earn them — name, issuer, year.",
    filled: false,
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
