const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandomDelay = () => 300 + Math.random() * 500;

import {
  mockUsers,
  mockProposals,
  mockLecturers,
  mockAIFeedback,
  mockRubricReviews,
  mockMatchingSuggestions,
  mockMilestones,
  mockAdminOverview,
} from "./mockData";
import { PROPOSAL_STATUSES, USER_ROLES } from "./constants";

// In-memory storage
let currentUser = null;
let allProposals = structuredClone(mockProposals);
let auditLogs = [];

const addAuditLog = (action, status, details) => {
  auditLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    status,
    details,
    userId: currentUser?.id || "system",
    userName: currentUser?.name || "System",
  });
};

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

const login = async (email, password) => {
  await sleep(getRandomDelay());
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Email hoặc mật khẩu không đúng");
  const { password: _, ...userWithoutPassword } = user;
  currentUser = userWithoutPassword;
  addAuditLog("LOGIN", "success", `User ${email} logged in`);
  return userWithoutPassword;
};

const logout = async () => {
  await sleep(getRandomDelay());
  if (currentUser) addAuditLog("LOGOUT", "success", `User ${currentUser.email} logged out`);
  currentUser = null;
};

const getCurrentUser = async () => {
  await sleep(getRandomDelay());
  return currentUser || null;
};

// ═══════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════

const getDashboardStats = async () => {
  await sleep(getRandomDelay());
  return {
    totalProposals: allProposals.length,
    approvedProposals: allProposals.filter((p) => p.status === PROPOSAL_STATUSES.APPROVED).length,
    underReview: allProposals.filter((p) => p.status === PROPOSAL_STATUSES.UNDER_REVIEW).length,
    averageAIScore: (allProposals.reduce((sum, p) => sum + p.readinessScore, 0) / allProposals.length).toFixed(1),
    totalLecturers: mockLecturers.length,
    needsRevision: allProposals.filter((p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION).length,
    completed: allProposals.filter((p) => p.status === PROPOSAL_STATUSES.COMPLETED).length,
  };
};

// ═══════════════════════════════════════════
// PROPOSALS
// ═══════════════════════════════════════════

const getProposals = async (filters = {}) => {
  await sleep(getRandomDelay());
  let results = allProposals;
  if (filters.status) results = results.filter((p) => p.status === filters.status);
  if (filters.field) results = results.filter((p) => p.researchField === filters.field);
  return results;
};

const getProposalById = async (proposalId) => {
  await sleep(getRandomDelay());
  const proposal = allProposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Không tìm thấy đề tài");
  return proposal;
};

const createProposal = async (data, submit = false) => {
  await sleep(getRandomDelay());
  const newProposal = {
    id: `prop-${Date.now()}`,
    ...data,
    status: submit ? PROPOSAL_STATUSES.SUBMITTED : PROPOSAL_STATUSES.DRAFT,
    currentStage: submit ? 3 : 1,
    readinessScore: 0,
    aiConfidence: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submittedAt: submit ? new Date().toISOString() : null,
    version: 1,
    riskFlags: [],
    missingItems: [],
    nextAction: submit ? "Đang chờ reviewer" : "Hoàn thiện đề cương",
    sections: [],
  };
  allProposals.push(newProposal);
  addAuditLog("CREATE_PROPOSAL", "success", `Proposal created: ${newProposal.id}`);
  return newProposal;
};

const updateProposal = async (proposalId, data) => {
  await sleep(getRandomDelay());
  const proposal = allProposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Không tìm thấy đề tài");
  const updated = { ...proposal, ...data, updatedAt: new Date().toISOString() };
  const index = allProposals.findIndex((p) => p.id === proposalId);
  allProposals[index] = updated;
  addAuditLog("UPDATE_PROPOSAL", "success", `Proposal updated: ${proposalId}`);
  return updated;
};

const submitProposal = async (proposalId) => {
  await sleep(getRandomDelay());
  const proposal = allProposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Không tìm thấy đề tài");
  const updated = {
    ...proposal,
    status: PROPOSAL_STATUSES.SUBMITTED,
    currentStage: 3,
    updatedAt: new Date().toISOString(),
    submittedAt: proposal.submittedAt || new Date().toISOString(),
    nextAction: "Reviewer đánh giá",
  };
  const index = allProposals.findIndex((p) => p.id === proposalId);
  allProposals[index] = updated;
  addAuditLog("SUBMIT_PROPOSAL", "success", `Proposal submitted: ${proposalId}`);
  return updated;
};

// ═══════════════════════════════════════════
// AI FEEDBACK
// ═══════════════════════════════════════════

const getAIFeedback = async (proposalId) => {
  await sleep(getRandomDelay());
  const feedback = mockAIFeedback.find((f) => f.proposalId === proposalId);
  return feedback || null;
};

const runAIFeedback = async (proposalId) => {
  await sleep(800);
  const proposal = allProposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Không tìm thấy đề tài");
  const feedback = {
    id: `fb-${Date.now()}`,
    proposalId,
    timestamp: new Date().toISOString(),
    overallReadiness: Math.round((Math.random() * 40 + 60) * 10) / 10,
    confidence: Math.round((0.6 + Math.random() * 0.35) * 100) / 100,
    strengths: [
      "Vấn đề được định nghĩa rõ ràng",
      "Phương pháp nghiên cứu khoa học",
      "Có tiềm năng ứng dụng thực tế",
    ],
    issues: [
      { severity: "medium", category: "literature", description: "Cần bổ sung tài liệu cập nhật" },
      { severity: "low", category: "ethics", description: "Phân tích đạo đức còn sơ sài" },
    ],
    suggestedRevisions: [
      { section: "literature", instruction: "Bổ sung tài liệu tham khảo 5 năm gần đây" },
      { section: "ethics", instruction: "Mở rộng phần đạo đức nghiên cứu" },
    ],
    limitations: "Đánh giá dựa trên nội dung đề cương. Quyết định cuối cùng thuộc về hội đồng.",
    advisoryNotice: "Phản hồi này chỉ mang tính chất tham khảo. Quyết định cuối cùng thuộc về hội đồng đánh giá.",
  };
  addAuditLog("RUN_AI_FEEDBACK", "success", `AI feedback generated: ${proposalId}`);
  return feedback;
};

// ═══════════════════════════════════════════
// RUBRIC REVIEWS
// ═══════════════════════════════════════════

const getRubricReview = async (proposalId) => {
  await sleep(getRandomDelay());
  const review = mockRubricReviews.find((r) => r.proposalId === proposalId);
  return review || null;
};

// ═══════════════════════════════════════════
// LECTURER MATCHING
// ═══════════════════════════════════════════

const getLecturerMatches = async (proposalId) => {
  await sleep(getRandomDelay());
  const matching = mockMatchingSuggestions.find((m) => m.proposalId === proposalId);
  return matching?.suggestedLecturers || [];
};

const recommendLecturer = async (proposalId, lecturerId) => {
  await sleep(getRandomDelay());
  const proposal = allProposals.find((p) => p.id === proposalId);
  const lecturer = mockLecturers.find((l) => l.id === lecturerId);
  if (!proposal || !lecturer) throw new Error("Không tìm thấy đề tài hoặc giảng viên");
  addAuditLog("RECOMMEND_LECTURER", "success", `Lecturer ${lecturer.name} recommended for proposal ${proposalId}`);
  return { success: true, message: `${lecturer.name} được gợi ý cho đề tài` };
};

// ═══════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════

const getAuditLogs = async (filters = {}) => {
  await sleep(getRandomDelay());
  let results = auditLogs;
  if (filters.action) results = results.filter((log) => log.action === filters.action);
  return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// ═══════════════════════════════════════════
// NEW — PROPOSALS BY ROLE
// ═══════════════════════════════════════════

const getProposalsByRole = async (userId, role) => {
  await sleep(getRandomDelay());
  if (role === USER_ROLES.STUDENT) {
    return allProposals.filter((p) => p.studentId === userId);
  }
  if (role === USER_ROLES.LECTURER) {
    return allProposals.filter((p) => p.assignedLecturer === userId);
  }
  return allProposals;
};

// ═══════════════════════════════════════════
// NEW — REVIEW QUEUE
// ═══════════════════════════════════════════

const getReviewQueue = async () => {
  await sleep(getRandomDelay());
  const reviewableStatuses = [
    PROPOSAL_STATUSES.SUBMITTED,
    PROPOSAL_STATUSES.UNDER_REVIEW,
    PROPOSAL_STATUSES.NEEDS_REVISION,
  ];
  return allProposals
    .filter((p) => reviewableStatuses.includes(p.status))
    .map((p) => {
      const rubric = mockRubricReviews.find((r) => r.proposalId === p.id);
      return { ...p, rubric: rubric || null };
    });
};

// ═══════════════════════════════════════════
// NEW — ADMIN OVERVIEW
// ═══════════════════════════════════════════

const getAdminOverview = async () => {
  await sleep(getRandomDelay());
  const overview = structuredClone(mockAdminOverview);
  overview.totalProposals = allProposals.length;
  overview.averageReadinessScore = (allProposals.reduce((sum, p) => sum + (p.readinessScore || 0), 0) / Math.max(allProposals.length, 1)).toFixed(1);
  const counts = {};
  Object.values(PROPOSAL_STATUSES).forEach((s) => { counts[s] = 0; });
  allProposals.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });
  overview.proposalsByStage = counts;
  overview.bottlenecks = [];

  const submittedNoReview = allProposals.filter((p) => p.status === PROPOSAL_STATUSES.SUBMITTED).length;
  if (submittedNoReview > 0) overview.bottlenecks.push({ label: "Chờ reviewer", count: submittedNoReview, description: `Đề tài đã gửi nhưng chưa có reviewer.` });

  const needsRevision = allProposals.filter((p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION).length;
  if (needsRevision > 0) overview.bottlenecks.push({ label: "Cần chỉnh sửa", count: needsRevision, description: `Đề tài đang chờ sinh viên chỉnh sửa.` });

  const fullLoad = mockLecturers.filter((l) => l.currentLoad >= l.maxLoad).length;
  if (fullLoad > 0) overview.bottlenecks.push({ label: "GVHD đầy tải", count: fullLoad, description: `Giảng viên đã đạt tối đa sức chứa.` });

  return overview;
};

// ═══════════════════════════════════════════
// NEW — LECTURER PROPOSALS
// ═══════════════════════════════════════════

const getLecturerProposals = async (lecturerId) => {
  await sleep(getRandomDelay());
  const proposals = allProposals.filter((p) => p.assignedLecturer === lecturerId);
  const suggestions = mockMatchingSuggestions
    .filter((m) => m.suggestedLecturers.some((s) => s.lecturerId === lecturerId))
    .map((m) => {
      const proposal = allProposals.find((p) => p.id === m.proposalId);
      const match = m.suggestedLecturers.find((s) => s.lecturerId === lecturerId);
      return { ...proposal, matchScore: match?.matchScore, matchReason: match?.reason };
    })
    .filter(Boolean);
  return { assigned: proposals, suggested: suggestions };
};

// ═══════════════════════════════════════════
// NEW — PROPOSAL SECTIONS
// ═══════════════════════════════════════════

const getProposalSections = async (proposalId) => {
  await sleep(getRandomDelay());
  const proposal = allProposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Không tìm thấy đề tài");
  return proposal.sections || [];
};

// ═══════════════════════════════════════════
// NEW — PROPOSAL MILESTONES
// ═══════════════════════════════════════════

const getProposalMilestones = async (proposalId) => {
  await sleep(getRandomDelay());
  return mockMilestones.filter((m) => m.proposalId === proposalId);
};

// ═══════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════

export const mockApi = {
  // Auth
  login,
  logout,
  getCurrentUser,

  // Dashboard
  getDashboardStats,

  // Proposals (existing)
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  submitProposal,

  // Proposals (new)
  getProposalsByRole,
  getReviewQueue,
  getAdminOverview,
  getLecturerProposals,
  getProposalSections,
  getProposalMilestones,

  // AI
  getAIFeedback,
  runAIFeedback,

  // Rubric
  getRubricReview,

  // Matching
  getLecturerMatches,
  recommendLecturer,

  // Audit
  getAuditLogs,
};
