// ───────── User Roles ─────────
export const USER_ROLES = {
  STUDENT: "student",
  REVIEWER: "reviewer",
  ADMIN: "admin",
  LECTURER: "lecturer",
};

// ───────── Proposal Statuses (10 stages) ─────────
export const PROPOSAL_STATUSES = {
  DRAFT: "draft",
  AI_PRE_CHECK: "ai_pre_check",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  NEEDS_REVISION: "needs_revision",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUPERVISOR_ASSIGNED: "supervisor_assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const WORKFLOW_STAGES = [
  { status: "draft", label: "Bản nháp", order: 1 },
  { status: "ai_pre_check", label: "AI Pre-check", order: 2 },
  { status: "submitted", label: "Đã gửi", order: 3 },
  { status: "under_review", label: "Đang xét duyệt", order: 4 },
  { status: "needs_revision", label: "Cần sửa", order: 5 },
  { status: "approved", label: "Phê duyệt", order: 6 },
  { status: "rejected", label: "Bị từ chối", order: 7 },
  { status: "supervisor_assigned", label: "Đã phân công GVHD", order: 8 },
  { status: "in_progress", label: "Đang thực hiện", order: 9 },
  { status: "completed", label: "Hoàn thành", order: 10 },
];

export const WORKFLOW_TRANSITIONS = {
  draft: ["ai_pre_check"],
  ai_pre_check: ["submitted"],
  submitted: ["under_review"],
  under_review: ["needs_revision", "approved"],
  needs_revision: ["submitted", "under_review"],
  approved: ["supervisor_assigned"],
  rejected: [],
  supervisor_assigned: ["in_progress"],
  in_progress: ["completed", "needs_revision"],
  completed: [],
};

export const WORKFLOW_ROLES = {
  draft: "student",
  ai_pre_check: "student",
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
  draft: "Nháp",
  ai_pre_check: "AI Pre-check",
  submitted: "Đã gửi",
  under_review: "Đang xét duyệt",
  needs_revision: "Cần sửa",
  approved: "Phê duyệt",
  rejected: "Bị từ chối",
  supervisor_assigned: "Phân công GVHD",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
};

export const STATUS_COLORS = {
  draft: "slate",
  ai_pre_check: "purple",
  submitted: "blue",
  under_review: "amber",
  needs_revision: "orange",
  approved: "green",
  rejected: "red",
  supervisor_assigned: "teal",
  in_progress: "indigo",
  completed: "emerald",
};

// ───────── Proposal Sections ─────────
export const SECTION_TYPES = [
  { id: "title", label: "Tiêu đề", required: true },
  { id: "abstract", label: "Tóm tắt / Synopsis", required: true },
  { id: "problem", label: "Vấn đề nghiên cứu", required: true },
  { id: "question", label: "Câu hỏi nghiên cứu", required: true },
  { id: "objectives", label: "Mục tiêu", required: true },
  { id: "literature", label: "Cơ sở lý thuyết", required: true },
  { id: "methodology", label: "Phương pháp nghiên cứu", required: true },
  { id: "feasibility", label: "Tính khả thi & tiến độ", required: true },
  { id: "contribution", label: "Đóng góp dự kiến", required: true },
  { id: "ethics", label: "Đạo đức / Rủi ro", required: false },
  { id: "references", label: "Tài liệu tham khảo", required: true },
];

export const SECTION_HEALTH = {
  STRONG: "strong",
  NEEDS_EVIDENCE: "needs_evidence",
  WEAK: "weak",
  MISSING: "missing",
};

export const SECTION_HEALTH_LABELS = {
  strong: "Tốt",
  needs_evidence: "Cần bổ sung dẫn chứng",
  weak: "Yếu",
  missing: "Thiếu",
};

// ───────── Rubric Criteria (8 criteria) ─────────
export const RUBRIC_CRITERIA = [
  {
    id: "problem_clarity",
    label: "Tính rõ ràng của vấn đề",
    description: "Vấn đề nghiên cứu có được định nghĩa rõ ràng, có bối cảnh và khoảng trống nghiên cứu không?",
    maxScore: 10,
  },
  {
    id: "literature_grounding",
    label: "Cơ sở lý thuyết",
    description: "Đề tài có được đặt trên nền tảng lý thuyết và tài liệu tham khảo phù hợp không?",
    maxScore: 10,
  },
  {
    id: "question_quality",
    label: "Chất lượng câu hỏi nghiên cứu",
    description: "Câu hỏi nghiên cứu có cụ thể, có thể nghiên cứu được và có ý nghĩa không?",
    maxScore: 10,
  },
  {
    id: "methodology_fit",
    label: "Tính phù hợp của phương pháp",
    description: "Phương pháp đề xuất có phù hợp với câu hỏi và mục tiêu nghiên cứu không?",
    maxScore: 10,
  },
  {
    id: "feasibility",
    label: "Tính khả thi",
    description: "Đề tài có khả thi về nguồn lực, thời gian, dữ liệu và kỹ năng không?",
    maxScore: 10,
  },
  {
    id: "contribution",
    label: "Đóng góp dự kiến",
    description: "Đề tài có đóng góp mới cho lĩnh vực hoặc ứng dụng thực tiễn không?",
    maxScore: 10,
  },
  {
    id: "ethics_risks",
    label: "Đạo đức & Rủi ro",
    description: "Các vấn đề đạo đức và rủi ro đã được xem xét đầy đủ chưa?",
    maxScore: 10,
  },
  {
    id: "writing_quality",
    label: "Chất trình bày",
    description: "Đề tài được trình bày rõ ràng, có cấu trúc và đúng chuẩn học thuật không?",
    maxScore: 10,
  },
];

// ───────── AI Readiness Levels ─────────
export const READINESS_LEVELS = [
  { id: "strong", label: "Sẵn sàng", minScore: 8, color: "success" },
  { id: "moderate", label: "Cần cải thiện", minScore: 6, color: "warning" },
  { id: "weak", label: "Yếu", minScore: 4, color: "danger" },
  { id: "incomplete", label: "Chưa đủ", minScore: 0, color: "muted" },
];

// ───────── Risk Flags ─────────
export const RISK_FLAGS = [
  { id: "scope_too_broad", label: "Phạm vi quá rộng", severity: "high" },
  { id: "missing_data", label: "Thiếu dữ liệu", severity: "high" },
  { id: "weak_methodology", label: "Phương pháp chưa rõ", severity: "medium" },
  { id: "ethics_concern", label: "Vấn đề đạo đức", severity: "high" },
  { id: "timeline_unrealistic", label: "Tiến độ không khả thi", severity: "medium" },
  { id: "budget_concern", label: "Vấn đề kinh phí", severity: "low" },
  { id: "supervisor_capacity", label: "Sức chứa GVHD", severity: "medium" },
];

// ───────── Milestone Types ─────────
export const MILESTONE_TYPES = [
  { id: "proposal_approved", label: "Đề tài được duyệt", order: 1 },
  { id: "supervisor_assigned", label: "Phân công GVHD", order: 2 },
  { id: "literature_review", label: "Tổng quan tài liệu", order: 3 },
  { id: "methodology_finalized", label: "Hoàn thiện phương pháp", order: 4 },
  { id: "data_collection", label: "Thu thập dữ liệu", order: 5 },
  { id: "analysis_complete", label: "Phân tích dữ liệu", order: 6 },
  { id: "final_report", label: "Báo cáo cuối kỳ", order: 7 },
  { id: "presentation", label: "Bảo vệ / Trình bày", order: 8 },
];

// ───────── Academic Titles ─────────
export const LECTURER_TITLES = [
  "Giảng viên",
  "Giảng viên chính",
  "Phó Giáo sư",
  "Giáo sư",
];

// ───────── Faculties & Departments ─────────
export const FACULTIES = [
  "Khoa Công nghệ Thông tin",
  "Khoa Kỹ thuật Điện tử",
  "Khoa Khoa học Dữ liệu",
  "Khoa Quản trị Kinh doanh",
  "Khoa Khoa học Cơ bản",
];

export const DEPARTMENTS = [
  "Khoa CNTT",
  "Khoa Kỹ thuật",
  "Khoa Khoa học cơ bản",
  "Khoa Quản trị kinh doanh",
];

// ───────── Fields of Study ─────────
export const FIELDS_OF_STUDY = [
  "Khoa học máy tính",
  "Kỹ thuật phần mềm",
  "Hệ thống thông tin",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Khoa học dữ liệu",
  "Mạng máy tính",
  "Công nghệ đa phương tiện",
];

// ───────── Academic Terms ─────────
export const ACADEMIC_TERMS = [
  { id: "2025A", label: "Học kỳ 1, 2025-2026" },
  { id: "2025B", label: "Học kỳ 2, 2025-2026" },
  { id: "2025C", label: "Học kỳ Hè, 2025-2026" },
  { id: "2026A", label: "Học kỳ 1, 2026-2027" },
  { id: "2026B", label: "Học kỳ 2, 2026-2027" },
];

export const CURRENT_TERM = "2026A";

export const ACADEMIC_ROLE_LABELS = {
  [USER_ROLES.STUDENT]: "Sinh viên",
  [USER_ROLES.REVIEWER]: "Phản biện",
  [USER_ROLES.ADMIN]: "Quản trị",
  [USER_ROLES.LECTURER]: "Giảng viên",
};

export const ACADEMIC_ROLE_ENGLISH = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Lecturer",
};

export const ACADEMIC_DEPARTMENTS = {
  research_office: "Phòng Quản lý Nghiên cứu",
  academic_affairs: "Phòng Đào tạo",
  faculty_office: "Văn phòng Khoa",
};
