// ───────── API Adapter ─────────
// All methods call the backend via apiFetch with credentials: "include".
import { apiFetch } from "./httpClient";
import {
  normalizeProposal,
  normalizeProposalSection,
  normalizeAIReview,
  normalizeRubricReview,
  normalizeReviewQueueItem,
  normalizeAdminOverview,
  normalizeAuditLog,
  normalizeLecturer,
  normalizeMilestone,
  normalizeUser,
} from "./normalizers";

async function getJson(url) {
  const res = await apiFetch(url);
  return res.json();
}

async function postJson(url, body) {
  const res = await apiFetch(url, { method: "POST", body: JSON.stringify(body) });
  return res.json();
}

async function patchJson(url, body) {
  const res = await apiFetch(url, { method: "PATCH", body: JSON.stringify(body) });
  return res.json();
}

// ─── Auth ───

export const register = async (payload) => {
  const data = await postJson("/auth/register", payload);
  return normalizeUser(data);
};

export const login = async (email, password) => {
  const data = await postJson("/auth/login", { email, password });
  return normalizeUser(data);
};

export const getMe = async () => {
  const data = await getJson("/auth/me");
  return normalizeUser(data);
};

const refreshSession = async () => {
  const res = await apiFetch("/auth/refresh", { method: "POST" });
  return res.ok;
};

export const logout = async () => {
  try { await apiFetch("/auth/logout", { method: "POST" }); }
  catch { /* swallow */ }
};

const updateMe = async (payload) => {
  const data = await patchJson("/auth/me", payload);
  return normalizeUser(data);
};

// ─── Proposals ───

const getProposals = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.mine) params.set("mine", "true");
  if (filters.student_id) params.set("student_id", filters.student_id);
  if (filters.reviewer_id) params.set("reviewer_id", filters.reviewer_id);
  if (filters.lecturer_id) params.set("lecturer_id", filters.lecturer_id);
  if (filters.research_field) params.set("research_field", filters.research_field);
  const qs = params.toString();
  const data = await getJson(`/proposals${qs ? `?${qs}` : ""}`);
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (data?.items) list = data.items;
  else if (data?.data) list = data.data;
  else if (data?.proposals) list = data.proposals;
  return list.map(normalizeProposal);
};

const createProposal = async (payload) => {
  const body = {
    title: payload.title,
    abstract: payload.abstract,
    research_field: payload.researchField || payload.research_field || payload.field,
    keywords: payload.keywords || [],
  };
  const data = await postJson("/proposals", body);
  return normalizeProposal(data);
};

const getProposalById = async (id) => {
  const data = await getJson(`/proposals/${id}`);
  return normalizeProposal(data);
};

const updateProposal = async (id, payload) => {
  const data = await patchJson(`/proposals/${id}`, payload);
  return normalizeProposal(data);
};

// Reverse mapping: frontend SECTION_TYPES IDs → backend API section keys
const API_SECTION_KEY_MAP = {
  problem: "research_problem",
  question: "research_question",
  literature: "literature_background",
  feasibility: "feasibility_timeline",
  contribution: "expected_contribution",
  ethics: "ethics_risks",
};

const updateProposalSection = async (id, sectionKey, content) => {
  const apikey = API_SECTION_KEY_MAP[sectionKey] || sectionKey;
  const data = await patchJson(`/proposals/${id}/sections/${apikey}`, { content });
  return normalizeProposalSection(data);
};

const submitProposal = async (id) => {
  const data = await postJson(`/proposals/${id}/submit`);
  return normalizeProposal(data);
};

const getProposalSections = async (id) => {
  const data = await getJson(`/proposals/${id}/sections`);
  return (Array.isArray(data) ? data : []).map(normalizeProposalSection);
};

const deleteProposal = async (id) => {
  await apiFetch(`/proposals/${id}`, { method: "DELETE" });
  return { success: true };
};

const getProposalExport = async (id) => {
  return getJson(`/proposals/${id}/export`);
};

const getProposalVersions = async (id) => {
  return getJson(`/proposals/${id}/versions`);
};

// ─── AI Review ───

const getAIFeedback = async (proposalId) => {
  try {
    const data = await getJson(`/proposals/${proposalId}/ai-review`);
    return normalizeAIReview(data);
  } catch { return null; }
};

const runAIFeedback = async (proposalId, provider) => {
  let url = `/proposals/${proposalId}/ai-review`;
  const p = provider || (typeof window !== "undefined" ? localStorage.getItem("srp_ai_provider") : null);
  if (p) url += `?provider=${p}`;
  const data = await postJson(url);
  return normalizeAIReview(data);
};

// ─── Reviews ───

const getReviewQueue = async () => {
  const data = await getJson("/reviews/queue");
  return (Array.isArray(data) ? data : []).map(normalizeReviewQueueItem);
};

const getReviewDetail = async (proposalId) => {
  const data = await getJson(`/reviews/${proposalId}`);
  return normalizeProposal(data);
};

const createReviewDecision = async (proposalId, payload) => {
  return postJson(`/reviews/${proposalId}/decision`, payload);
};

// ─── Lecturers ───

const getLecturers = async () => {
  const data = await getJson("/lecturers");
  return (Array.isArray(data) ? data : []).map(normalizeLecturer);
};

const getLecturerById = async (id) => {
  const data = await getJson(`/lecturers/${id}`);
  return normalizeLecturer(data);
};

const getLecturerProposals = async (lecturerId) => {
  const data = await getJson(`/lecturers/${lecturerId}/proposals`);
  const list = Array.isArray(data) ? data : data?.proposals || [];
  const normalized = list.map(normalizeProposal);
  return {
    assigned: normalized.filter((p) => p.assignedLecturerId === lecturerId || p.assigned_lecturer_id === lecturerId),
    suggested: normalized.filter((p) => !p.assignedLecturerId && !p.assigned_lecturer_id),
  };
};

const getLecturerCapacity = async (id) => {
  return getJson(`/lecturers/${id}/capacity`);
};

// ─── Matching ───

const getLecturerMatches = async (proposalId) => {
  const data = await getJson(`/matching/${proposalId}`);
  return Array.isArray(data) ? data : [];
};

const runMatching = async (proposalId) => {
  return postJson(`/matching/${proposalId}/run`);
};

const assignLecturer = async (proposalId, lecturerId) => {
  return postJson(`/matching/${proposalId}/assign`, { lecturer_id: lecturerId });
};

const shortlistLecturer = async (proposalId, lecturerId) => {
  return postJson(`/matching/${proposalId}/shortlist`, { lecturer_id: lecturerId });
};

const rejectMatch = async (proposalId, lecturerId) => {
  return postJson(`/matching/${proposalId}/reject`, { lecturer_id: lecturerId });
};

// ─── Milestones ───

const getProposalMilestones = async (id) => {
  const data = await getJson(`/proposals/${id}/milestones`);
  return (Array.isArray(data) ? data : []).map(normalizeMilestone);
};

const createMilestone = async (id, payload) => {
  return postJson(`/proposals/${id}/milestones`, payload);
};

const updateMilestone = async (milestoneId, payload) => {
  return patchJson(`/milestones/${milestoneId}`, payload);
};

// ─── Admin ───

const getAdminOverview = async () => {
  const data = await getJson("/admin/overview");
  return normalizeAdminOverview(data);
};

const getAdminWorkflow = async () => {
  return getJson("/admin/workflow");
};

const getAdminBottlenecks = async () => {
  return getJson("/admin/bottlenecks");
};

const getAdminReviewerWorkload = async () => {
  return getJson("/admin/reviewer-workload");
};

const getAdminLecturerCapacity = async () => {
  return getJson("/admin/lecturer-capacity");
};

const getAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.action) params.set("action", filters.action);
  if (filters.actor_id) params.set("actor_id", filters.actor_id);
  if (filters.entity_type) params.set("entity_type", filters.entity_type);
  if (filters.limit) params.set("limit", filters.limit);
  if (filters.offset) params.set("offset", filters.offset);
  const qs = params.toString();
  const data = await getJson(`/admin/audit-logs${qs ? `?${qs}` : ""}`);
  return (Array.isArray(data) ? data : []).map(normalizeAuditLog);
};

// ─── Chat Sessions ───

const getChatSessions = async () => {
  const data = await getJson("/chat/sessions");
  return Array.isArray(data) ? data : [];
};

const createChatSession = async (title) => {
  return postJson("/chat/sessions", { title });
};

const getChatMessages = async (sessionId) => {
  const data = await getJson(`/chat/sessions/${sessionId}/messages`);
  return Array.isArray(data) ? data : [];
};

const sendChatMessage = async (sessionId, message) => {
  return postJson(`/chat/sessions/${sessionId}/messages`, { content: message });
};

// ─── User Management ───

const getUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);
  if (filters.faculty) params.set("faculty", filters.faculty);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  const data = await getJson(`/admin/users${qs ? `?${qs}` : ""}`);
  return (Array.isArray(data) ? data : []).map(normalizeUser);
};

const createUser = async (payload) => {
  const data = await postJson("/admin/users", payload);
  return normalizeUser(data);
};

const updateUser = async (id, payload) => {
  const data = await patchJson(`/admin/users/${id}`, payload);
  return normalizeUser(data);
};

const deleteUser = async (id) => {
  await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
  return { success: true };
};

// ─── Faculties ───

const getFaculties = async () => {
  const data = await getJson("/admin/faculties");
  return Array.isArray(data) ? data : [];
};

const createFaculty = async (payload) => {
  return postJson("/admin/faculties", payload);
};

const updateFaculty = async (id, payload) => {
  return patchJson(`/admin/faculties/${id}`, payload);
};

const deleteFaculty = async (id) => {
  await apiFetch(`/admin/faculties/${id}`, { method: "DELETE" });
  return { success: true };
};

// ─── Departments ───

const getDepartments = async (facultyId) => {
  const qs = facultyId ? `?faculty_id=${facultyId}` : "";
  const data = await getJson(`/admin/departments${qs}`);
  return Array.isArray(data) ? data : [];
};

const createDepartment = async (payload) => {
  return postJson("/admin/departments", payload);
};

const updateDepartment = async (id, payload) => {
  return patchJson(`/admin/departments/${id}`, payload);
};

const deleteDepartment = async (id) => {
  await apiFetch(`/admin/departments/${id}`, { method: "DELETE" });
  return { success: true };
};

// ─── Fields of Study ───

const getFieldsOfStudy = async () => {
  const data = await getJson("/admin/fields-of-study");
  return Array.isArray(data) ? data : [];
};

const createFieldOfStudy = async (payload) => {
  return postJson("/admin/fields-of-study", payload);
};

const updateFieldOfStudy = async (id, payload) => {
  return patchJson(`/admin/fields-of-study/${id}`, payload);
};

const deleteFieldOfStudy = async (id) => {
  await apiFetch(`/admin/fields-of-study/${id}`, { method: "DELETE" });
  return { success: true };
};

// ─── Projects ───

const getProjects = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.student_id) params.set("student_id", filters.student_id);
  if (filters.supervisor_id) params.set("supervisor_id", filters.supervisor_id);
  const qs = params.toString();
  const data = await getJson(`/projects${qs ? `?${qs}` : ""}`);
  return Array.isArray(data) ? data : [];
};

const getProjectById = async (id) => {
  return getJson(`/projects/${id}`);
};

const createProject = async (proposalId) => {
  return postJson("/projects", { proposal_id: proposalId });
};

const updateProject = async (id, payload) => {
  return patchJson(`/projects/${id}`, payload);
};

const getProjectMembers = async (id) => {
  const data = await getJson(`/projects/${id}/members`);
  return Array.isArray(data) ? data : [];
};

const addProjectMember = async (id, payload) => {
  return postJson(`/projects/${id}/members`, payload);
};

const removeProjectMember = async (id, memberId) => {
  await apiFetch(`/projects/${id}/members/${memberId}`, { method: "DELETE" });
  return { success: true };
};

const getProjectMilestones = async (id) => {
  const data = await getJson(`/projects/${id}/milestones`);
  return Array.isArray(data) ? data : [];
};

const updateProjectMilestone = async (projectId, milestoneId, payload) => {
  return patchJson(`/projects/${projectId}/milestones/${milestoneId}`, payload);
};

const getProjectReports = async (id) => {
  const data = await getJson(`/projects/${id}/reports`);
  return Array.isArray(data) ? data : [];
};

const uploadProjectReport = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch(`/projects/${id}/reports`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

const getProjectDeliverables = async (id) => {
  const data = await getJson(`/projects/${id}/deliverables`);
  return Array.isArray(data) ? data : [];
};

const uploadProjectDeliverable = async (id, type, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const res = await apiFetch(`/projects/${id}/deliverables`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

// ─── Export ───

export const api = {
  register,
  login,
  getMe,
  refreshSession,
  logout,
  updateMe,
  getProposals,
  createProposal,
  getProposalById,
  updateProposal,
  updateProposalSection,
  submitProposal,
  getProposalSections,
  deleteProposal,
  getProposalExport,
  getProposalVersions,
  getAIFeedback,
  runAIFeedback,
  getReviewQueue,
  getReviewDetail,
  createReviewDecision,
  getLecturers,
  getLecturerById,
  getLecturerProposals,
  getLecturerCapacity,
  getLecturerMatches,
  runMatching,
  assignLecturer,
  shortlistLecturer,
  rejectMatch,
  getProposalMilestones,
  createMilestone,
  updateMilestone,
  getAdminOverview,
  getAdminWorkflow,
  getAdminBottlenecks,
  getAdminReviewerWorkload,
  getAdminLecturerCapacity,
  getAuditLogs,
  getChatSessions,
  createChatSession,
  getChatMessages,
  sendChatMessage,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getFieldsOfStudy,
  createFieldOfStudy,
  updateFieldOfStudy,
  deleteFieldOfStudy,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  getProjectMilestones,
  updateProjectMilestone,
  getProjectReports,
  uploadProjectReport,
  getProjectDeliverables,
  uploadProjectDeliverable,
};
