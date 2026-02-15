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
    tagline: "Enterprise-grade digital banking backend with MFA and fraud monitoring.",
    tech: ["Java","Spring Boot","PostgreSQL","Redis","Docker","JWT"],
    highlights: [
      "Multi-factor authentication, RBAC, audit trails",
      "Real-time transaction monitoring & anomaly flags",
      "Idempotent transfers with saga-like safety for consistency"
    ],
    metrics: [
      { label: "Uptime", value: "99.9%" },
      { label: "Avg TX latency", value: "120ms" }
    ],
    liveUrl: "https://demo.nova.example",
    repoUrl: "https://github.com/your/nova-bank-core",
    duration: "2025",
    role: "Backend Engineer",
    responsibilities: [
      "Designed domain model and transactional boundaries",
      "Implemented OAuth2/JWT security and audit logging",
      "Wrote integration tests (Testcontainers) and CI"
    ],
    outcomes: [
      "Secure, scalable core with clean separation of concerns",
      "Reduced fraudulent attempts via rule-based filters"
    ],
    architectureDiagram: "/images/diagrams/nova.png"
  },
  {
    title: "EduSync LMS Backend",
    slug: "edusync-lms",
    category: "backend",
    tagline: "Modular LMS with microservices and student analytics.",
    tech: ["Java","Spring Boot","MongoDB","Kafka","Keycloak","Docker"],
    highlights: [
      "Course, grading, and analytics services decoupled via Kafka",
      "Keycloak SSO/JWT for multi-role access",
      "Async grading pipeline with retry/backoff"
    ],
    metrics: [
      { label: "Throughput", value: "3k req/min" },
      { label: "P95 latency", value: "180ms" }
    ],
    liveUrl: "https://demo.edusync.example",
    repoUrl: "https://github.com/your/edusync-lms",
    duration: "2025",
    role: "Backend Engineer",
    outcomes: [
      "Scalable analytics for educators",
      "Stable under spikes during exam weeks"
    ],
    architectureDiagram: "/images/diagrams/edusync.png"
  },
  {
    title: "CareFlow API",
    slug: "careflow-api",
    category: "backend",
    tagline: "Django REST backend with ML health-risk predictions.",
    tech: ["Python","Django REST","PostgreSQL","Celery","Redis","scikit-learn"],
    highlights: [
      "Secure patient records with field-level permissions",
      "ML inference endpoint with SHAP explanations",
      "Async data import and report generation via Celery"
    ],
    metrics: [
      { label: "AUC (risk model)", value: "0.89" }
    ],
    liveUrl: "https://demo.careflow.example",
    repoUrl: "https://github.com/your/careflow-api",
    role: "Backend + ML",
    architectureDiagram: "/images/diagrams/careflow.png"
  },
  {
    title: "Gatherly",
    slug: "gatherly",
    category: "backend",
    tagline: "Event management API with payments and real-time analytics.",
    tech: ["Node.js","Express","MySQL","Stripe","Docker","JWT"],
    highlights: [
      "Ticketing, attendee management, and check-in webhooks",
      "Stripe integration with webhook signature verification",
      "Admin analytics endpoints (occupancy, revenue, churn)"
    ],
    metrics: [
      { label: "Peak registrations/min", value: "250" }
    ],
    liveUrl: "https://demo.gatherly.example",
    repoUrl: "https://github.com/your/gatherly",
    architectureDiagram: "/images/diagrams/gatherly.png"
  },
  {
    title: "Trackella",
    slug: "trackella",
    category: "backend",
    tagline: "Secure expense tracker API with insights and budgets.",
    tech: ["Node.js","NestJS","MongoDB","JWT","Winston","Docker"],
    highlights: [
      "Aggregation pipelines for category insights",
      "Budget alerts via email worker",
      "Structured logging, request tracing, and rate limiting"
    ],
    metrics: [
      { label: "Insight latency", value: "<200ms" }
    ],
    liveUrl: "https://demo.trackella.example",
    repoUrl: "https://github.com/your/trackella",
    architectureDiagram: "/images/diagrams/trackella.png"
  },
  {
    title: "eFiche Mobile",
    slug: "efiche-mobile",
    category: "frontend",
    tagline: "Mobile app feature development and performance improvements.",
    tech: ["Flutter","Dart"],
    highlights: [
      "Delivered new mobile features with a focus on UX and stability",
      "Optimized screens and flows for smoother performance",
      "Collaborated with product and QA to iterate on feedback"
    ],
    role: "Mobile Developer (Intern)",
    duration: "2026"
  },
  {
    title: "eFiche Web Platform",
    slug: "efiche-web",
    category: "fullstack",
    tagline: "Internal platform for workflows and operations.",
    tech: ["Next.js","Laravel"],
    highlights: [
      "Implemented new web features and workflows",
      "Integrated frontend with backend endpoints",
      "Helped troubleshoot and ship production fixes"
    ],
    role: "Software Engineering Intern",
    duration: "2026"
  },
  {
    title: "eFiche Team Dashboard",
    slug: "efiche-dashboard",
    category: "backend",
    tagline: "Performance analytics API for team dashboards.",
    tech: ["Python","FastAPI"],
    highlights: [
      "Built APIs powering team performance views",
      "Structured analytics endpoints for dashboard insights",
      "Improved stability for reporting workflows"
    ],
    role: "Software Engineering Intern",
    duration: "2026"
  },
  {
    title: "FitSync",
    slug: "fitsync",
    category: "frontend",
    tagline: "Flutter fitness app with goals, tracking, and live sync.",
    tech: ["Flutter","Dart","Firebase Auth","Firestore","Cloud Functions"],
    highlights: [
      "Goal tracking & progress charts",
      "Offline-first with local cache",
      "Push notifications for streaks"
    ],
    liveUrl: "https://demo.fitsync.example",
    repoUrl: "https://github.com/your/fitsync",
    images: ["/images/fitsync-1.png","/images/fitsync-2.png"]
  },
  {
    title: "CareConnect",
    slug: "careconnect",
    category: "frontend",
    tagline: "React Native appointment booking with offline mode.",
    tech: ["React Native","Expo","React Query","SQLite","FCM"],
    highlights: [
      "Book/reschedule with calendar sync",
      "Dark mode + accessibility support",
      "Offline queueing for actions"
    ],
    liveUrl: "https://demo.careconnect.example",
    repoUrl: "https://github.com/your/careconnect",
    images: ["/images/careconnect-1.png"]
  },
  {
    title: "SkillBridge",
    slug: "skillbridge",
    category: "frontend",
    tagline: "Career discovery React app with real-time listings.",
    tech: ["React","Vite","TypeScript","Zustand","WebSocket"],
    highlights: [
      "Live job feed via WebSockets",
      "Saved roles and notes",
      "Responsive, keyboard-first navigation"
    ],
    liveUrl: "https://demo.skillbridge.example",
    repoUrl: "https://github.com/your/skillbridge",
    images: ["/images/skillbridge.png"]
  },
 {
  title: "SafeShop",
  slug: "safeshop",       
  category: "fullstack",
  tagline: "Full‑stack e‑commerce with real‑time chat and AI recommendations/fraud scoring.",
  tech: [
    "React",
    "Vite",
    "Redux Toolkit",
    "TailwindCSS",
    "Node.js",
    "Express",
    "MongoDB",
    "Redis",
    "Socket.IO",
    "FastAPI",
    "Docker",
    "Playwright"
  ],
    highlights: [
    "AI microservice (FastAPI) for product recommendations and fraud scoring",
    "Real-time chat & notifications via WebSocket (Socket.IO)",
    "JWT auth with role-based access and basic rate limiting/helmet",
    "Dockerized multi-service stack (frontend, backend, AI, MongoDB, Redis)"
  ],
    metrics: [
    { "label": "E2E smoke tests", "value": "Chromium + Firefox passing" }
  ],
    liveUrl: "https://demo.safe.shop",
    repoUrl: "https://github.com/your/safeshop",
    architectureDiagram: "/images/diagrams/safeshop.png"  
  },
  {
    title: "CampusConnect",
    slug: "campusconnect",
    category: "fullstack",
    tagline: "Student social platform with real-time chat.",
    tech: ["React","Django","PostgreSQL","WebSockets","Redis"],
    highlights: [
      "Groups, events, and chat with typing indicators",
      "Image uploads + moderation queue",
      "Scalable API and CDN-backed media"
    ],
    liveUrl: "https://demo.campusconnect.example",
    repoUrl: "https://github.com/your/campusconnect",
    architectureDiagram: "/images/diagrams/campusconnect.png"
  },
  {
    title: "SentimentScope",
    slug: "sentimentscope",
    category: "ml",
    tagline: "Transformer-based sentiment & emotion analysis (Kinyarwanda support).",
    tech: ["Python","PyTorch","HuggingFace","FastAPI","Docker"],
    highlights: [
      "Fine-tuned transformer with multilingual tokenizer",
      "REST inference with batching & caching",
      "Confidence scores + calibration"
    ],
    metrics: [
      { label: "F1 (macro)", value: "0.87" }
    ],
    liveUrl: "https://demo.sentimentscope.example",
    repoUrl: "https://github.com/your/sentimentscope"
  },
  {
    title: "FraudGuard ML",
    slug: "fraudguard-ml",
    category: "ml",
    tagline: "Anomaly detection for transactions with imbalanced learning.",
    tech: ["Python","scikit-learn","LightGBM","Pandas","MLflow"],
    highlights: [
      "SMOTE + threshold tuning for precision/recall",
      "Isolation Forest + supervised ensemble",
      "MLflow tracking for experiments"
    ],
    metrics: [
      { label: "ROC-AUC", value: "0.96" },
      { label: "PR-AUC", value: "0.81" }
    ],
    liveUrl: "https://demo.fraudguard.example",
    repoUrl: "https://github.com/your/fraudguard"
  },
  {
    title: "PredictWise",
    slug: "predictwise",
    category: "ml",
    tagline: "Student performance prediction with explainability.",
    tech: ["Python","XGBoost","SHAP","Flask","Pydantic"],
    highlights: [
      "Feature engineering & k-fold CV",
      "SHAP plots for stakeholder trust",
      "Fast REST inference with schema validation"
    ],
    metrics: [
      { label: "Accuracy", value: "92%" },
      { label: "F1", value: "0.90" }
    ],
    liveUrl: "https://demo.predictwise.example",
    repoUrl: "https://github.com/your/predictwise"
  }
];
