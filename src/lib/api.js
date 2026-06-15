// API Adapter - currently uses mock implementation
// Can be replaced with real backend API later
import { mockApi } from "./mockApi";

export const api = mockApi;

// Export individual methods for convenience
export const login = api.login;
export const logout = api.logout;
export const getCurrentUser = api.getCurrentUser;
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
