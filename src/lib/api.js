// ───────── API Adapter ─────────
// Auth → real backend (via auth.js / httpClient)
// Data → mockApi when NEXT_PUBLIC_USE_MOCK_API=true, real backend when false
import { apiFetch } from "./httpClient";
import { mockApi } from "./mockApi";
import {
  normalizeProposal,
  normalizeProposalSection,
  normalizeAIReview,
  normalizeRubricReview,
  normalizeReviewQueueItem,
  normalizeAdminOverview,
  normalizeAuditLog,
} from "./normalizers";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

// ─── Real API call helpers ───

async function getJson(url) {
  const res = await apiFetch(url);
  return res.json();
}

async function postJson(url, body) {
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

async function patchJson(url, body) {
  const res = await apiFetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─── Dashboard ───

const getDashboardStats = USE_MOCK
  ? mockApi.getDashboardStats
  : async () => {
      try {
        const data = await getJson("/admin/overview");
        const norm = normalizeAdminOverview(data);
        return {
          totalProposals: norm.totalProposals,
          approvedProposals: norm.proposalsByStage?.approved || 0,
          underReview: norm.pendingReviews || 0,
          averageAIScore: norm.averageReadinessScore?.toString() || "0",
          totalLecturers: norm.lecturerCapacity?.length || 0,
          needsRevision: norm.proposalsByStage?.needs_revision || 0,
          completed: norm.proposalsByStage?.completed || 0,
        };
      } catch {
        return {
          totalProposals: 0,
          approvedProposals: 0,
          underReview: 0,
          averageAIScore: "0",
          totalLecturers: 0,
        };
      }
    };

// ─── Proposals ───

// const getProposals = USE_MOCK
//   ? mockApi.getProposals
//   : async (filters = {}) => {
//       const params = new URLSearchParams();
//       if (filters.status) params.set("status", filters.status);
//       const qs = params.toString();
//       const data = await getJson(`/proposals${qs ? `?${qs}` : ""}`);
//       return (Array.isArray(data) ? data : []).map(normalizeProposal);
//     };

const getProposals = USE_MOCK
  ? mockApi.getProposals
  : async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      const qs = params.toString();
      const responseData = await getJson(`/proposals${qs ? `?${qs}` : ""}`);

      // 🔥 Bóc tách Array thông minh, bất chấp Backend trả về dạng nào
      let list = [];
      if (Array.isArray(responseData)) {
        list = responseData; // Dạng trả về trực tiếp [{}, {}]
      } else if (responseData && Array.isArray(responseData.items)) {
        list = responseData.items; // Dạng { items: [] } của FastAPI Pagination
      } else if (responseData && Array.isArray(responseData.data)) {
        list = responseData.data; // Dạng { data: [] }
      } else if (responseData && Array.isArray(responseData.proposals)) {
        list = responseData.proposals; // Dạng { proposals: [] }
      }

      return list.map(normalizeProposal);
    };

const getProposalById = USE_MOCK
  ? mockApi.getProposalById
  : async (id) => {
      const data = await getJson(`/proposals/${id}`);
      return normalizeProposal(data);
    };

const createProposal = USE_MOCK
  ? mockApi.createProposal
  : async (payload, submit = false) => {
      // Backend creates 11 sections automatically — only send core fields
      const body = {
        title: payload.title,
        abstract: payload.abstract,
        research_field:
          payload.researchField || payload.research_field || payload.field,
        keywords: payload.keywords || [],
      };
      const data = await postJson("/proposals", body);
      const proposal = normalizeProposal(data);
      if (!proposal?.id) return proposal;

      // Fill in section content from the form
      const sectionMappings = [
        { key: "research_problem", from: ["problem", "research_problem"] },
        { key: "research_question", from: ["question", "research_question"] },
        { key: "objectives", from: ["objectives"] },
        { key: "literature_background", from: ["literature", "literature_background"] },
        { key: "methodology", from: ["methodology"] },
        { key: "feasibility_timeline", from: ["feasibility", "feasibility_timeline"] },
        { key: "expected_contribution", from: ["contribution", "expected_contribution", "expectedImpact"] },
        { key: "ethics_risks", from: ["ethics", "ethics_risks"] },
        { key: "references", from: ["references"] },
      ];
      const patches = [];
      for (const mapping of sectionMappings) {
        const content = mapping.from.reduce((val, key) => val || payload[key] || "", "");
        if (content.trim()) {
          patches.push(updateProposalSectionFn(proposal.id, mapping.key, content));
        }
      }
      await Promise.allSettled(patches);

      if (submit) {
        try {
          return await postJson(`/proposals/${proposal.id}/submit`);
        } catch {
          // Creation succeeded but submit failed — return created proposal
        }
      }
      return proposal;
    };

const updateProposal = USE_MOCK
  ? mockApi.updateProposal
  : async (id, payload) => {
      const data = await patchJson(`/proposals/${id}`, payload);
      return normalizeProposal(data);
    };

const updateProposalSectionFn = async (id, sectionKey, content) => {
  const data = await patchJson(`/proposals/${id}/sections/${sectionKey}`, { content });
  return normalizeProposalSection(data);
};

const submitProposal = USE_MOCK
  ? mockApi.submitProposal
  : async (id) => {
      const data = await postJson(`/proposals/${id}/submit`);
      return normalizeProposal(data);
    };

const getProposalSections = USE_MOCK
  ? mockApi.getProposalSections
  : async (id) => {
      const data = await getJson(`/proposals/${id}/sections`);
      return (Array.isArray(data) ? data : []).map(normalizeProposalSection);
    };

// ─── AI ───

const getAIFeedback = USE_MOCK
  ? mockApi.getAIFeedback
  : async (proposalId) => {
      try {
        const data = await getJson(`/proposals/${proposalId}/ai-review`);
        return normalizeAIReview(data);
      } catch {
        return null;
      }
    };

const runAIFeedback = USE_MOCK
  ? mockApi.runAIFeedback
  : async (proposalId) => {
      const data = await postJson(`/proposals/${proposalId}/ai-review`);
      return normalizeAIReview(data);
    };

// ─── Rubric ───

const getRubricReview = USE_MOCK
  ? mockApi.getRubricReview
  : async (proposalId) => {
      try {
        const data = await getJson(`/reviews/${proposalId}`);
        // Backend may return { latest_rubric_review: {...} } or the review directly
        const review =
          data.latest_rubric_review || data.latestRubricReview || data;
        return normalizeRubricReview(review);
      } catch {
        return null;
      }
    };

// ─── Review ───

const getReviewQueue = USE_MOCK
  ? mockApi.getReviewQueue
  : async () => {
      const data = await getJson("/reviews/queue");
      return (Array.isArray(data) ? data : []).map(normalizeReviewQueueItem);
    };

const createReviewDecision = USE_MOCK
  ? mockApi.recommendLecturer // fallback — not the right mapping, but keeps mock mode working
  : async (proposalId, payload) => {
      const data = await postJson(`/reviews/${proposalId}/decision`, payload);
      return data;
    };

// ─── Matching / Lecturers ───

const getLecturers = USE_MOCK
  ? async () => (await import("./mockData")).mockLecturers
  : async () => {
      const data = await getJson("/lecturers");
      return Array.isArray(data) ? data : [];
    };

const getLecturerById = USE_MOCK
  ? async (id) => {
      const lecturers = await getLecturers();
      return lecturers.find((l) => l.id === id) || null;
    }
  : async (id) => {
      const data = await getJson(`/lecturers/${id}`);
      return data;
    };

const getLecturerCapacity = USE_MOCK
  ? async (id) => {
      const lecturers = await getLecturers();
      return lecturers.find((l) => l.id === id) || null;
    }
  : async (id) => {
      const data = await getJson(`/lecturers/${id}/capacity`);
      return data;
    };

const getLecturerMatches = USE_MOCK
  ? mockApi.getLecturerMatches
  : async (proposalId) => {
      const data = await getJson(`/matching/${proposalId}`);
      return Array.isArray(data) ? data : [];
    };

const runMatching = USE_MOCK
  ? async (proposalId) => ({ success: true, message: "Mock matching complete" })
  : async (proposalId) => {
      const data = await postJson(`/matching/${proposalId}/run`);
      return data;
    };

const assignLecturer = USE_MOCK
  ? async (proposalId, lecturerId) => ({ success: true, message: "Mock assign complete" })
  : async (proposalId, lecturerId) => {
      const data = await postJson(`/matching/${proposalId}/assign`, { lecturer_id: lecturerId });
      return data;
    };

const shortlistLecturer = USE_MOCK
  ? async (proposalId, lecturerId) => ({ success: true, message: "Mock shortlist complete" })
  : async (proposalId, lecturerId) => {
      const data = await postJson(`/matching/${proposalId}/shortlist`, { lecturer_id: lecturerId });
      return data;
    };

const rejectMatch = USE_MOCK
  ? async (proposalId, lecturerId) => ({ success: true, message: "Mock reject complete" })
  : async (proposalId, lecturerId) => {
      const data = await postJson(`/matching/${proposalId}/reject`, { lecturer_id: lecturerId });
      return data;
    };

// ─── Admin ───

const getAdminOverview = USE_MOCK
  ? mockApi.getAdminOverview
  : async () => {
      const data = await getJson("/admin/overview");
      return normalizeAdminOverview(data);
    };

const getAuditLogs = USE_MOCK
  ? mockApi.getAuditLogs
  : async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.action) params.set("action", filters.action);
      const qs = params.toString();
      const data = await getJson(`/admin/audit-logs${qs ? `?${qs}` : ""}`);
      return (Array.isArray(data) ? data : []).map(normalizeAuditLog);
    };

// ─── Role-based helpers ───

const getProposalsByRole = USE_MOCK
  ? mockApi.getProposalsByRole
  : async (userId, role) => {
      // Backend filters by auth automatically — just get all proposals
      const data = await getJson("/proposals");
      return (Array.isArray(data) ? data : []).map(normalizeProposal);
    };

const getLecturerProposals = USE_MOCK
  ? mockApi.getLecturerProposals
  : async (lecturerId) => {
      const data = await getJson(`/lecturers/${lecturerId}/proposals`);
      const list = Array.isArray(data) ? data : data?.proposals || [];
      return { assigned: list.filter((p) => p.assignedLecturerId === lecturerId), suggested: list.filter((p) => !p.assignedLecturerId) };
    };

const recommendLecturerFn = USE_MOCK
  ? mockApi.recommendLecturer
  : async (proposalId, lecturerId) => {
      // Alias for assign — keeps backward compatibility with matching page
      return assignLecturer(proposalId, lecturerId);
    };

const deleteProposal = USE_MOCK
  ? mockApi.updateProposal // soft fallback — mock doesn't have delete
  : async (id) => {
      await apiFetch(`/proposals/${id}`, { method: "DELETE" });
      return { success: true };
    };

const getProposalMilestones = USE_MOCK
  ? mockApi.getProposalMilestones
  : async (id) => {
      const data = await getJson(`/proposals/${id}/milestones`);
      return Array.isArray(data) ? data : [];
    };

const createMilestone = USE_MOCK
  ? async (id, payload) => ({ id: `ms-${Date.now()}`, ...payload })
  : async (id, payload) => {
      const data = await postJson(`/proposals/${id}/milestones`, payload);
      return data;
    };

const updateMilestone = USE_MOCK
  ? async (milestoneId, payload) => payload
  : async (milestoneId, payload) => {
      const data = await patchJson(`/milestones/${milestoneId}`, payload);
      return data;
    };

// ─── Pricing Plans CRUD (super_admin) ───

const getPricingPlans = USE_MOCK
  ? async () => {
      const { MOCK_PRICING_PLANS } = await import("./constants");
      return MOCK_PRICING_PLANS.filter((p) => !p.deleted_at);
    }
  : async () => {
      const data = await getJson("/pricing/plans");
      return Array.isArray(data) ? data : [];
    };

const createPricingPlan = USE_MOCK
  ? async (payload) => ({ id: `plan_${Date.now()}`, ...payload, featured: false, is_custom: false, deleted_at: null })
  : async (payload) => {
      const data = await postJson("/pricing/plans", payload);
      return data;
    };

const updatePricingPlan = USE_MOCK
  ? async (id, payload) => ({ id, ...payload })
  : async (id, payload) => {
      const data = await patchJson(`/pricing/plans/${id}`, payload);
      return data;
    };

const deletePricingPlan = USE_MOCK
  ? async (id) => ({ success: true, deleted_at: new Date().toISOString() })
  : async (id) => {
      await apiFetch(`/pricing/plans/${id}`, { method: "DELETE" });
      return { success: true };
    };

// ─── LLM Pricing (super_admin) ───

const getLlmPricing = USE_MOCK
  ? async () => {
      const { LLM_PRICE_CONFIG } = await import("./constants");
      return { ...LLM_PRICE_CONFIG };
    }
  : async () => {
      const data = await getJson("/pricing/llm");
      return data;
    };

const updateLlmPricing = USE_MOCK
  ? async (payload) => ({ success: true, ...payload })
  : async (payload) => {
      const data = await patchJson("/pricing/llm", payload);
      return data;
    };

// ─── Tenant Subscriptions (super_admin view) ───

const getMockSubscriptions = USE_MOCK
  ? async () => {
      const { MOCK_SUBSCRIPTIONS } = await import("./constants");
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_SUBSCRIPTIONS;
    }
  : async () => {
      const { MOCK_SUBSCRIPTIONS } = await import("./constants");
      return MOCK_SUBSCRIPTIONS;
    };

const createTenant = async (payload) => {
  const { onboardTenant } = await import("./tenant");
  return onboardTenant(payload);
};

// ─── Notifications ───

const getNotifications = USE_MOCK
  ? async () => {
      const { MOCK_NOTIFICATIONS } = await import("./constants");
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_NOTIFICATIONS.map((n) => ({ ...n }));
    }
  : async () => {
      const data = await getJson("/notifications");
      return Array.isArray(data) ? data : [];
    };

const dismissNotification = USE_MOCK
  ? async (id) => ({ success: true })
  : async (id) => {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      return { success: true };
    };

const dismissAllNotifications = USE_MOCK
  ? async () => ({ success: true })
  : async () => {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      return { success: true };
    };

// ─── Export ───

export const api = {
  getDashboardStats,
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  updateProposalSection: updateProposalSectionFn,
  submitProposal,
  getAIFeedback,
  runAIFeedback,
  getRubricReview,
  getLecturerMatches,
  getLecturers,
  getLecturerById,
  getLecturerCapacity,
  recommendLecturer: recommendLecturerFn,
  runMatching,
  assignLecturer,
  shortlistLecturer,
  getMockSubscriptions,
  createTenant,
  rejectMatch,
  getAuditLogs,
  getProposalsByRole,
  getReviewQueue,
  getAdminOverview,
  getLecturerProposals,
  getProposalSections,
  getProposalMilestones,
  createMilestone,
  updateMilestone,
  createReviewDecision,
  getPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getLlmPricing,
  updateLlmPricing,
  getNotifications,
  dismissNotification,
  dismissAllNotifications,
};

// ─── Individual exports ───

export const getDashboardStatsFn = api.getDashboardStats;
export const getProposalsFn = api.getProposals;
export const getProposalByIdFn = api.getProposalById;
export const createProposalFn = api.createProposal;
export const updateProposalFn = api.updateProposal;
export const submitProposalFn = api.submitProposal;
export const getAIFeedbackFn = api.getAIFeedback;
export const runAIFeedbackFn = api.runAIFeedback;
export const getRubricReviewFn = api.getRubricReview;
export const getLecturerMatchesFn = api.getLecturerMatches;

export const getAuditLogsFn = api.getAuditLogs;
export const getProposalsByRoleFn = api.getProposalsByRole;
export const getReviewQueueFn = api.getReviewQueue;
export const getAdminOverviewFn = api.getAdminOverview;
export const getLecturerProposalsFn = api.getLecturerProposals;
export const getProposalSectionsFn = api.getProposalSections;
export const getProposalMilestonesFn = api.getProposalMilestones;
export const createReviewDecisionFn = api.createReviewDecision;
