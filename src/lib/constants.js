// ───────── User Roles ─────────
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  STUDENT: "student",
  REVIEWER: "reviewer",
  ADMIN: "admin",
  LECTURER: "lecturer",
};

// ───────── Proposal Statuses (10 stages) ─────────
export const PROPOSAL_STATUSES = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  NEEDS_REVISION: "needs_revision",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUPERVISOR_ASSIGNED: "supervisor_assigned",
  PROJECT_ACTIVE: "project_active",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const WORKFLOW_STAGES = [
  { status: "draft", label: "Draft", order: 1 },
  { status: "submitted", label: "Submitted", order: 2 },
  { status: "under_review", label: "Under Review", order: 3 },
  { status: "needs_revision", label: "Needs Revision", order: 4 },
  { status: "approved", label: "Approved", order: 5 },
  { status: "rejected", label: "Rejected", order: 6 },
  { status: "supervisor_assigned", label: "Supervisor Assigned", order: 7 },
  { status: "project_active", label: "Project Active", order: 8 },
  { status: "in_progress", label: "In Progress", order: 9 },
  { status: "completed", label: "Completed", order: 10 },
];

export const WORKFLOW_TRANSITIONS = {
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["needs_revision", "approved"],
  needs_revision: ["submitted", "under_review"],
  approved: ["supervisor_assigned"],
  rejected: [],
  supervisor_assigned: ["project_active"],
  project_active: ["in_progress"],
  in_progress: ["completed", "needs_revision"],
  completed: [],
};

export const WORKFLOW_ROLES = {
  draft: "student",
  submitted: "reviewer",
  under_review: "reviewer",
  needs_revision: "student",
  approved: "lecturer",
  rejected: "reviewer",
  supervisor_assigned: "lecturer",
  in_progress: "lecturer",
  completed: "lecturer",
};

export const STATUS_LABELS = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  needs_revision: "Needs Revision",
  approved: "Approved",
  rejected: "Rejected",
  supervisor_assigned: "Supervisor Assigned",
  project_active: "Project Active",
  in_progress: "In Progress",
  completed: "Completed",
};

export const STATUS_COLORS = {
  draft: "slate",
  submitted: "blue",
  under_review: "amber",
  needs_revision: "orange",
  approved: "green",
  rejected: "red",
  supervisor_assigned: "teal",
  project_active: "indigo",
  in_progress: "indigo",
  completed: "emerald",
};

// ───────── Project Statuses ─────────
export const PROJECT_STATUSES = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const PROJECT_STATUS_LABELS = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export const PROJECT_STATUS_COLORS = {
  not_started: "slate",
  in_progress: "blue",
  completed: "emerald",
};

// ───────── Deliverable Types ─────────
export const DELIVERABLE_TYPES = [
  { id: "software", label: "Software", icon: "code" },
  { id: "dataset", label: "Dataset", icon: "database" },
  { id: "paper", label: "Paper", icon: "document" },
  { id: "presentation", label: "Presentation", icon: "presentation" },
  { id: "poster", label: "Poster", icon: "image" },
  { id: "patent", label: "Patent", icon: "shield" },
  { id: "book", label: "Book", icon: "book" },
];

// ───────── Report Statuses ─────────
export const REPORT_STATUSES = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  REVIEWED: "reviewed",
};

export const REPORT_STATUS_LABELS = {
  draft: "Draft",
  submitted: "Submitted",
  reviewed: "Reviewed",
};

// ───────── Proposal Sections ─────────
export const SECTION_TYPES = [
  { id: "title", label: "Title", required: true },
  { id: "abstract", label: "Abstract / Synopsis", required: true },
  { id: "problem", label: "Research Problem", required: true },
  { id: "question", label: "Research Questions", required: true },
  { id: "objectives", label: "Objectives", required: true },
  { id: "literature", label: "Literature Review", required: true },
  { id: "methodology", label: "Methodology", required: true },
  { id: "feasibility", label: "Feasibility & Timeline", required: true },
  { id: "contribution", label: "Expected Contribution", required: true },
  { id: "ethics", label: "Ethics / Risks", required: false },
  { id: "references", label: "References", required: true },
];

export const SECTION_HEALTH = {
  STRONG: "strong",
  NEEDS_EVIDENCE: "needs_evidence",
  WEAK: "weak",
  MISSING: "missing",
};

export const SECTION_HEALTH_LABELS = {
  strong: "Strong",
  needs_evidence: "Needs Evidence",
  weak: "Weak",
  missing: "Missing",
};

// ───────── Rubric Criteria (8 criteria) ─────────
export const RUBRIC_CRITERIA = [
  {
    id: "problem_clarity",
    label: "Problem Clarity",
    description: "Is the research problem clearly defined with context and research gap?",
    maxScore: 10,
  },
  {
    id: "literature_grounding",
    label: "Literature Grounding",
    description: "Is the topic grounded in relevant theoretical framework and references?",
    maxScore: 10,
  },
  {
    id: "question_quality",
    label: "Research Question Quality",
    description: "Are the research questions specific, researchable, and meaningful?",
    maxScore: 10,
  },
  {
    id: "methodology_fit",
    label: "Methodology Fit",
    description: "Is the proposed methodology appropriate for the research questions and objectives?",
    maxScore: 10,
  },
  {
    id: "feasibility",
    label: "Feasibility",
    description: "Is the research feasible in terms of resources, time, data, and skills?",
    maxScore: 10,
  },
  {
    id: "contribution",
    label: "Expected Contribution",
    description: "Does the research offer new contributions to the field or practical applications?",
    maxScore: 10,
  },
  {
    id: "ethics_risks",
    label: "Ethics & Risks",
    description: "Have ethical issues and risks been adequately considered?",
    maxScore: 10,
  },
  {
    id: "writing_quality",
    label: "Writing Quality",
    description: "Is the proposal clearly written, well-structured, and academically sound?",
    maxScore: 10,
  },
];

// ───────── AI Readiness Levels ─────────
export const READINESS_LEVELS = [
  { id: "strong", label: "Strong", minScore: 8, color: "success" },
  { id: "moderate", label: "Moderate", minScore: 6, color: "warning" },
  { id: "weak", label: "Weak", minScore: 4, color: "danger" },
  { id: "incomplete", label: "Incomplete", minScore: 0, color: "muted" },
];

// ───────── Risk Flags ─────────
export const RISK_FLAGS = [
  { id: "scope_too_broad", label: "Scope Too Broad", severity: "high" },
  { id: "missing_data", label: "Missing Data", severity: "high" },
  { id: "weak_methodology", label: "Weak Methodology", severity: "medium" },
  { id: "ethics_concern", label: "Ethics Concern", severity: "high" },
  { id: "timeline_unrealistic", label: "Unrealistic Timeline", severity: "medium" },
  { id: "budget_concern", label: "Budget Concern", severity: "low" },
  { id: "supervisor_capacity", label: "Supervisor Capacity", severity: "medium" },
];

// ───────── Milestone Types ─────────
export const MILESTONE_TYPES = [
  { id: "proposal_approved", label: "Proposal Approved", order: 1 },
  { id: "supervisor_assigned", label: "Supervisor Assigned", order: 2 },
  { id: "literature_review", label: "Literature Review", order: 3 },
  { id: "methodology_finalized", label: "Methodology Finalized", order: 4 },
  { id: "data_collection", label: "Data Collection", order: 5 },
  { id: "analysis_complete", label: "Analysis Complete", order: 6 },
  { id: "final_report", label: "Final Report", order: 7 },
  { id: "presentation", label: "Presentation / Defense", order: 8 },
];

// ───────── Academic Titles ─────────
export const LECTURER_TITLES = [
  "Lecturer",
  "Senior Lecturer",
  "Associate Professor",
  "Professor",
];

// ───────── Faculties & Departments ─────────
export const FACULTIES = [
  "Faculty of Information Technology",
  "Faculty of Electronic Engineering",
  "Faculty of Data Science",
  "Faculty of Business Administration",
  "Faculty of Basic Sciences",
];

export const DEPARTMENTS = [
  "Computer Science Dept",
  "Engineering Dept",
  "Basic Sciences Dept",
  "Business Administration Dept",
];

// ───────── Fields of Study ─────────
export const FIELDS_OF_STUDY = [
  "Computer Science",
  "Software Engineering",
  "Information Systems",
  "Artificial Intelligence",
  "Information Security",
  "Data Science",
  "Computer Networks",
  "Multimedia Technology",
];

// ───────── Academic Terms ─────────
export const ACADEMIC_TERMS = [
  { id: "2025A", label: "Semester 1, 2025-2026" },
  { id: "2025B", label: "Semester 2, 2025-2026" },
  { id: "2025C", label: "Summer Semester, 2025-2026" },
  { id: "2026A", label: "Semester 1, 2026-2027" },
  { id: "2026B", label: "Semester 2, 2026-2027" },
];

export const CURRENT_TERM = "2026A";

// ───────── Role Labels ─────────
export const ACADEMIC_ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Lecturer",
};

// ───────── Role check utility ─────────
export const hasRole = (user, allowedRoles) => {
  if (!user) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};
