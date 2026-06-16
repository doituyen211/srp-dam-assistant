// ───────── API Adapter ─────────
// This file provides data methods used by pages and components.
//
// Mock mode (default):  NEXT_PUBLIC_USE_MOCK_API=true
//   Uses in-memory mock data — no backend needed. Ideal for demos and development.
//
// Real API mode:         NEXT_PUBLIC_USE_MOCK_API=false
//   Calls the backend via apiFetch with credentials: "include".
//   Auth (login, register, me, logout) always uses the real backend — see auth.js.
//
// To add a real backend endpoint for a data method:
//   1. Import { apiFetch } from "./httpClient"
//   2. Replace the mockApi delegation with a real apiFetch call
//   3. The existing interface (args → return value) must stay the same

import { mockApi } from "./mockApi";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

// ─── Live API stubs (placeholder — replace mockApi.xxx when backend is ready) ───
// const { apiFetch } = require ? undefined : 0;  // import at top when needed

export const api = {
  // Dashboard
  getDashboardStats: USE_MOCK
    ? mockApi.getDashboardStats
    : mockApi.getDashboardStats, // ← replace with real API call

  // Proposals
  getProposals: USE_MOCK
    ? mockApi.getProposals
    : mockApi.getProposals,
  getProposalById: USE_MOCK
    ? mockApi.getProposalById
    : mockApi.getProposalById,
  createProposal: USE_MOCK
    ? mockApi.createProposal
    : mockApi.createProposal,
  updateProposal: USE_MOCK
    ? mockApi.updateProposal
    : mockApi.updateProposal,
  submitProposal: USE_MOCK
    ? mockApi.submitProposal
    : mockApi.submitProposal,

  // AI
  getAIFeedback: USE_MOCK
    ? mockApi.getAIFeedback
    : mockApi.getAIFeedback,
  runAIFeedback: USE_MOCK
    ? mockApi.runAIFeedback
    : mockApi.runAIFeedback,

  // Rubric
  getRubricReview: USE_MOCK
    ? mockApi.getRubricReview
    : mockApi.getRubricReview,

  // Matching
  getLecturerMatches: USE_MOCK
    ? mockApi.getLecturerMatches
    : mockApi.getLecturerMatches,
  recommendLecturer: USE_MOCK
    ? mockApi.recommendLecturer
    : mockApi.recommendLecturer,

  // Admin
  getAuditLogs: USE_MOCK
    ? mockApi.getAuditLogs
    : mockApi.getAuditLogs,
  getProposalsByRole: USE_MOCK
    ? mockApi.getProposalsByRole
    : mockApi.getProposalsByRole,
  getReviewQueue: USE_MOCK
    ? mockApi.getReviewQueue
    : mockApi.getReviewQueue,
  getAdminOverview: USE_MOCK
    ? mockApi.getAdminOverview
    : mockApi.getAdminOverview,
  getLecturerProposals: USE_MOCK
    ? mockApi.getLecturerProposals
    : mockApi.getLecturerProposals,
  getProposalSections: USE_MOCK
    ? mockApi.getProposalSections
    : mockApi.getProposalSections,
  getProposalMilestones: USE_MOCK
    ? mockApi.getProposalMilestones
    : mockApi.getProposalMilestones,
};

// ───────── Individual exports for convenience ─────────
export const getDashboardStats = api.getDashboardStats;
export const getProposals = api.getProposals;
export const getProposalById = api.getProposalById;
export const createProposal = api.createProposal;
export const updateProposal = api.updateProposal;
export const submitProposal = api.submitProposal;
export const getAIFeedback = api.getAIFeedback;
export const runAIFeedback = api.runAIFeedback;
export const getRubricReview = api.getRubricReview;
export const getLecturerMatches = api.getLecturerMatches;
export const recommendLecturer = api.recommendLecturer;
export const getAuditLogs = api.getAuditLogs;
export const getProposalsByRole = api.getProposalsByRole;
export const getReviewQueue = api.getReviewQueue;
export const getAdminOverview = api.getAdminOverview;
export const getLecturerProposals = api.getLecturerProposals;
export const getProposalSections = api.getProposalSections;
export const getProposalMilestones = api.getProposalMilestones;
