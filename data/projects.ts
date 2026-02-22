export type Category = "backend" | "frontend" | "fullstack" | "ml";

export type Metric = { label: string; value: string };
export type Highlight = string;

export type Project = {
  title: string;
  slug: string;
  category: Category;
  tagline: string;
  tech: string[];
  highlights: Highlight[];
  metrics?: Metric[];
  liveUrl?: string;
  swaggerUrl?: string;
  repoUrl?: string;
  caseStudy?: string;
  images?: string[];
  role?: string;
  team?: string;
  duration?: string;
  responsibilities?: string[];
  outcomes?: string[];
  architectureDiagram?: string;
};

export const projects: Project[] = [
  {
    title: "NOVA Bank Core",
    slug: "nova-bank-core",
    category: "backend",
    tagline: "API-first digital banking backend with secure transaction flows and auditability.",
    tech: ["Java","Spring Boot","PostgreSQL","Spring Security","JWT","Docker"],
    highlights: [
      "Role-based access for ADMIN, CUSTOMER, and AUDITOR with JWT authentication",
      "Transfer idempotency, account freeze controls, and CSV statements",
      "Audit and fraud oversight endpoints with Swagger-documented APIs"
    ],
    swaggerUrl: "https://github.com/OdileDuhirimana/NovaBank#swagger--api-docs",
    repoUrl: "https://github.com/OdileDuhirimana/NovaBank"
  },
  {
    title: "EduSync LMS Backend",
    slug: "edusync-lms",
    category: "backend",
    tagline: "Modular LMS backend scaffold using a Spring Boot multi-service architecture.",
    tech: ["Java","Spring Boot","Spring Cloud Gateway","Maven","Docker","MongoDB"],
    highlights: [
      "Separate services for auth, users, courses, enrollment, grading, and analytics",
      "Gateway-first API design with OpenAPI docs and Dockerized local orchestration",
      "Render blueprint support for multi-service deployment"
    ],
    swaggerUrl: "https://github.com/OdileDuhirimana/EduSync#whats-included-now",
    repoUrl: "https://github.com/OdileDuhirimana/EduSync"
  },
  {
    title: "CareFlow API",
    slug: "careflow-api",
    category: "backend",
    tagline: "Django REST healthcare API with explainable triage scoring and hospital workflows.",
    tech: ["Python","Django","Django REST Framework","PostgreSQL","SimpleJWT","Docker"],
    highlights: [
      "Explainable triage assessment with stored risk history and high-risk alerts",
      "End-to-end care operations: admissions, beds, referrals, labs, and medication orders",
      "Workflow automation with domain events plus analytics and CSV exports"
    ],
    swaggerUrl: "https://github.com/OdileDuhirimana/CareFlow#key-endpoints",
    repoUrl: "https://github.com/OdileDuhirimana/CareFlow"
  },
  {
    title: "Gatherly",
    slug: "gatherly",
    category: "backend",
    tagline: "Event management API with ticketing, payments, safety tooling, and compliance endpoints.",
    tech: ["Node.js","Express","Sequelize","MySQL/PostgreSQL","Stripe","Docker"],
    highlights: [
      "Waitlist auto-promotion, scholarship workflows, and signed QR anti-fraud check-ins",
      "Risk scoring for purchases with refund policy previews and alert queues",
      "Privacy/compliance APIs with consent logs, retention jobs, and outbox retries"
    ],
    swaggerUrl: "https://github.com/OdileDuhirimana/Gatherly#api-docs-and-collection",
    repoUrl: "https://github.com/OdileDuhirimana/Gatherly"
  },
  {
    title: "Trackella API",
    slug: "trackella",
    category: "backend",
    tagline: "Personal finance backend focused on insights, planning automation, and deployment reliability.",
    tech: ["Node.js","Express","MySQL","JWT","Swagger","Docker"],
    highlights: [
      "Financial health scoring and anomaly detection endpoints for spending behavior",
      "Savings goals and recurring expense automation with due-item processing",
      "Data portability exports plus liveness/readiness checks and graceful shutdown"
    ],
    swaggerUrl: "https://github.com/OdileDuhirimana/Trackella#api-docs",
    repoUrl: "https://github.com/OdileDuhirimana/Trackella"
  },
  {
    title: "Vitals CareOps",
    slug: "vitals-careops",
    category: "fullstack",
    tagline: "Healthcare operations platform for enrollments, attendance, and medication dispensation.",
    tech: ["Next.js","TypeScript","NestJS","TypeORM","PostgreSQL","JWT","Swagger"],
    highlights: [
      "Role-based access control for Admin, Healthcare Staff, and Guest users",
      "Duplicate-prevention logic for medication collection using bucketed unique constraints",
      "Program analytics and activity audit trails for operational visibility"
    ],
    metrics: [
      { label: "Seeded records", value: "120 patients" },
      { label: "Roles", value: "3 RBAC levels" }
    ],
    liveUrl: "https://github.com/OdileDuhirimana/health-tracker#deployment",
    repoUrl: "https://github.com/OdileDuhirimana/health-tracker"
  },
  {
    title: "CampusConnect",
    slug: "campusconnect",
    category: "fullstack",
    tagline: "Campus social platform with modular Django APIs and real-time student interactions.",
    tech: ["React","Redux Toolkit","Django REST Framework","Django Channels","JWT","WebSockets"],
    highlights: [
      "Modular apps for posts, events, clubs, chats, stories, polls, groups, and marketplace",
      "Real-time communication and notifications via Channels-based socket infrastructure",
      "Role-aware social workflows for students, club admins, and campus admins"
    ],
    liveUrl: "https://github.com/OdileDuhirimana/CampusConnect/tree/main/frontend",
    repoUrl: "https://github.com/OdileDuhirimana/CampusConnect"
  },
  {
    title: "SafeShop",
    slug: "safeshop",
    category: "fullstack",
    tagline: "AI-assisted e-commerce platform with real-time features and seller intelligence.",
    tech: ["React","Vite","Node.js","Express","MongoDB","Redis","FastAPI","Socket.IO"],
    highlights: [
      "AI concierge, price-watch alerts, and checkout savings optimization",
      "Trust scoring and inventory forecasting for seller-side operational insights",
      "Integrated order lifecycle, returns flow, and event-driven notifications"
    ],
    liveUrl: "https://github.com/OdileDuhirimana/SafeShop#quick-start-docker",
    repoUrl: "https://github.com/OdileDuhirimana/SafeShop"
  },
  {
    title: "SkillBridge",
    slug: "skillbridge",
    category: "fullstack",
    tagline: "Career ecosystem for jobs and internships with AI guidance and real-time collaboration.",
    tech: ["React","Node.js","Express","MongoDB","Socket.IO","Tailwind CSS","OpenAI"],
    highlights: [
      "AI-driven job discovery, resume analysis, and career mentor workflows",
      "Real-time recruiter-candidate messaging with application lifecycle tracking",
      "Gamification and analytics dashboards for both candidates and employers"
    ]
  },
  {
    title: "FitSync",
    slug: "fitsync",
    category: "frontend",
    tagline: "Flutter fitness app with real-time sync, progress analytics, and AI-style coaching.",
    tech: ["Flutter","Dart","Firebase Auth","Firestore","Firebase Messaging","TensorFlow Lite"],
    highlights: [
      "Workout tracking with live sync and goal-based progress visualization",
      "Offline-first logging using local storage with background cloud synchronization",
      "Streak systems, wellness journaling, and personalized recommendation flows"
    ]
  },
  {
    title: "CareConnect Mobile",
    slug: "careconnect",
    category: "frontend",
    tagline: "Cross-platform healthcare companion app for appointments, records, and wellness.",
    tech: ["React Native","Expo","Firebase Auth","Firestore","FCM","Gemini API"],
    highlights: [
      "Appointment booking, doctor discovery, and real-time availability updates",
      "In-app chat, reminders, and digital prescription/document workflows",
      "AI symptom checker and wellness tracking experiences"
    ]
  },
  {
    title: "SentiAna",
    slug: "sentiana",
    category: "ml",
    tagline: "Emotion intelligence API for sentiment, toxicity, sarcasm, and domain-aware analysis.",
    tech: ["Python","FastAPI","Transformers","PyTorch","Redis","Docker"],
    highlights: [
      "Multi-label emotion inference with toxicity and sarcasm detection pipelines",
      "WebSocket streaming and timeline APIs for real-time conversational monitoring",
      "Domain modules for support, reviews, social safety, and mental-health signals"
    ]
  },
  {
    title: "FraudGuard ML",
    slug: "fraudguard-ml",
    category: "ml",
    tagline: "Transaction fraud scoring API with MFA challenge flows and audit tooling.",
    tech: ["Python","FastAPI","SQLAlchemy","PyJWT","NumPy","Docker"],
    highlights: [
      "Risk scoring endpoints with alert tracking for suspicious transaction behavior",
      "OTP challenge flow for high-risk transaction verification",
      "Admin role management and audit log endpoints for operational oversight"
    ]
  },
  {
    title: "PredictWise",
    slug: "predictwise",
    category: "ml",
    tagline: "Student success intelligence platform combining ML predictions with actionable dashboards.",
    tech: ["Python","Flask","Scikit-learn","XGBoost","SHAP","React"],
    highlights: [
      "Prediction and drift detection APIs with observability and rate limiting controls",
      "Digital twin, wellness, voice-analysis, gamification, and alerts modules",
      "Analytics/report endpoints for class, subject, and school-level interventions"
    ]
  }
];
