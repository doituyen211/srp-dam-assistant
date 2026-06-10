// Utility: simulate network delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomDelay = () => 300 + Math.random() * 500; // 300-800ms

import {
  mockUsers,
  mockProposals,
  mockLecturers,
  mockAIFeedback,
  mockRubricReviews,
  mockMatchingSuggestions,
  mockMilestones,
} from "./mockData";
import { PROPOSAL_STATUSES } from "./constants";

// In-memory storage for session & created proposals
let currentUser = null;
let allProposals = structuredClone(mockProposals); // deep copy
let auditLogs = [];

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} user object (without password)
 */
const login = async (email, password) => {
  await sleep(getRandomDelay());

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const { password: _, ...userWithoutPassword } = user;
  currentUser = userWithoutPassword;
  addAuditLog("LOGIN", "success", `User ${email} logged in`);
  return userWithoutPassword;
};

/**
 * Logout
 */
const logout = async () => {
  await sleep(getRandomDelay());
  if (currentUser) {
    addAuditLog("LOGOUT", "success", `User ${currentUser.email} logged out`);
  }
  currentUser = null;
};

/**
 * Get current session user
 */
const getCurrentUser = async () => {
  await sleep(getRandomDelay());
  return currentUser || null;
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async () => {
  await sleep(getRandomDelay());

  return {
    totalProposals: allProposals.length,
    approvedProposals: allProposals.filter(
      (p) => p.status === PROPOSAL_STATUSES.APPROVED,
    ).length,
    underReview: allProposals.filter(
      (p) => p.status === PROPOSAL_STATUSES.UNDER_REVIEW,
    ).length,
    averageAIScore: (
      allProposals.reduce((sum, p) => sum + p.aiScore, 0) / allProposals.length
    ).toFixed(1),
    totalLecturers: mockLecturers.length,
  };
};

/**
 * Get all proposals (with optional filtering)
 */
const getProposals = async (filters = {}) => {
  await sleep(getRandomDelay());

  let results = allProposals;

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters.field) {
    results = results.filter((p) => p.field === filters.field);
  }

  return results;
};

/**
 * Get proposal by ID
 */
const getProposalById = async (proposalId) => {
  await sleep(getRandomDelay());

  const proposal = allProposals.find((p) => p.id === proposalId);

  if (!proposal) {
    throw new Error("Không tìm thấy đề tài");
  }

  return proposal;
};

/**
 * Create proposal
 * @param {Object} data proposal data
 * @param {boolean} submit whether to submit or save as draft
 */
const createProposal = async (data, submit = false) => {
  await sleep(getRandomDelay());

  const newProposal = {
    id: `prop-${Date.now()}`,
    ...data,
    status: submit ? PROPOSAL_STATUSES.SUBMITTED : PROPOSAL_STATUSES.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiScore: 0,
  };

  allProposals.push(newProposal);
  addAuditLog(
    "CREATE_PROPOSAL",
    "success",
    `Proposal created: ${newProposal.id}`,
  );

  return newProposal;
};

/**
 * Update proposal
 */
const updateProposal = async (proposalId, data) => {
  await sleep(getRandomDelay());

  const proposal = allProposals.find((p) => p.id === proposalId);

  if (!proposal) {
    throw new Error("Không tìm thấy đề tài");
  }

  const updated = {
    ...proposal,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const index = allProposals.findIndex((p) => p.id === proposalId);
  allProposals[index] = updated;

  addAuditLog("UPDATE_PROPOSAL", "success", `Proposal updated: ${proposalId}`);

  return updated;
};

/**
 * Submit proposal
 */
const submitProposal = async (proposalId) => {
  await sleep(getRandomDelay());

  const proposal = allProposals.find((p) => p.id === proposalId);

  if (!proposal) {
    throw new Error("Không tìm thấy đề tài");
  }

  const updated = {
    ...proposal,
    status: PROPOSAL_STATUSES.SUBMITTED,
    updatedAt: new Date().toISOString(),
  };

  const index = allProposals.findIndex((p) => p.id === proposalId);
  allProposals[index] = updated;

  addAuditLog(
    "SUBMIT_PROPOSAL",
    "success",
    `Proposal submitted: ${proposalId}`,
  );

  return updated;
};

/**
 * Get AI feedback for proposal
 */
const getAIFeedback = async (proposalId) => {
  await sleep(getRandomDelay());

  const feedback = mockAIFeedback.find((f) => f.proposalId === proposalId);

  return feedback || mockAIFeedback[0]; // fallback
};

/**
 * Run AI feedback (simulate AI processing)
 */
const runAIFeedback = async (proposalId) => {
  await sleep(800); // longer delay for AI simulation

  const proposal = allProposals.find((p) => p.id === proposalId);

  if (!proposal) {
    throw new Error("Không tìm thấy đề tài");
  }

  // Mock AI feedback generation
  const feedback = {
    id: `fb-${Date.now()}`,
    proposalId,
    timestamp: new Date().toISOString(),
    score: Math.round((Math.random() * 40 + 60) * 10) / 10, // 6.0 - 10.0
    strengths: [
      "Vấn đề được định nghĩa rõ ràng",
      "Phương pháp nghiên cứu khoa học",
      "Có tiềm năng ứng dụng thực tế",
    ],
    weaknesses: ["Cần làm rõ timeline", "Thiếu phân tích chi phí"],
    suggestions: [
      "Thêm chi tiết về kiến trúc hệ thống",
      "Đưa ra benchmark so sánh",
      "Chuẩn bị dataset đầy đủ",
    ],
  };

  addAuditLog(
    "RUN_AI_FEEDBACK",
    "success",
    `AI feedback generated: ${proposalId}`,
  );

  return feedback;
};

/**
 * Get rubric review for proposal
 */
const getRubricReview = async (proposalId) => {
  await sleep(getRandomDelay());

  const review = mockRubricReviews.find((r) => r.proposalId === proposalId);

  return review || null;
};

/**
 * Get lecturer matches for proposal
 */
const getLecturerMatches = async (proposalId) => {
  await sleep(getRandomDelay());

  const matching = mockMatchingSuggestions.find(
    (m) => m.proposalId === proposalId,
  );

  return matching?.suggestedLecturers || [];
};

/**
 * Recommend lecturer for proposal
 */
const recommendLecturer = async (proposalId, lecturerId) => {
  await sleep(getRandomDelay());

  const proposal = allProposals.find((p) => p.id === proposalId);
  const lecturer = mockLecturers.find((l) => l.id === lecturerId);

  if (!proposal || !lecturer) {
    throw new Error("Không tìm thấy đề tài hoặc giảng viên");
  }

  addAuditLog(
    "RECOMMEND_LECTURER",
    "success",
    `Lecturer ${lecturer.name} recommended for proposal ${proposalId}`,
  );

  return {
    success: true,
    message: `${lecturer.name} được gợi ý cho đề tài`,
    auditLog: auditLogs[auditLogs.length - 1],
  };
};

/**
 * Get audit logs
 */
const getAuditLogs = async (filters = {}) => {
  await sleep(getRandomDelay());

  let results = auditLogs;

  if (filters.action) {
    results = results.filter((log) => log.action === filters.action);
  }

  // Return sorted by timestamp descending
  return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Helper to add audit log
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

// Export mock API
export const mockApi = {
  login,
  logout,
  getCurrentUser,
  getDashboardStats,
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  submitProposal,
  getAIFeedback,
  runAIFeedback,
  getRubricReview,
  getLecturerMatches,
  recommendLecturer,
  getAuditLogs,
};
