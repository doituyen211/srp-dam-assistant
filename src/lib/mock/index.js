// ───────── Mock API Interceptor ─────────
// Wraps mock store functions into the same interface as the real api object

import {
  mockAuth,
  mockProposals,
  mockAIReview,
  mockReviews,
  mockLecturers,
  mockMatching,
  mockProjects,
  mockChat,
  mockAdmin,
  mockUsers,
  mockFaculties,
  mockDepartments,
  mockFieldsOfStudy,
} from "./store";

/**
 * Check if mock mode is enabled
 * NEXT_PUBLIC_* env vars are inlined at build time, so they work in both SSR and client
 */
export function isMockMode() {
  return process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
}

/**
 * Create a mock API object that matches the real api interface
 */
export function createMockApi() {
  return {
    // ─── Auth ───
    register: (payload) => mockAuth.register(payload),
    login: (email, password) => mockAuth.login(email, password),
    getMe: () => mockAuth.getMe(),
    refreshSession: async () => true,
    logout: () => mockAuth.logout(),
    updateMe: (payload) => mockAuth.updateMe(payload),

    // ─── Proposals ───
    getProposals: (filters) => mockProposals.list(filters),
    createProposal: (payload) => mockProposals.create(payload),
    getProposalById: (id) => mockProposals.getById(id),
    updateProposal: (id, payload) => mockProposals.update(id, payload),
    updateProposalSection: (id, sectionKey, content) => mockProposals.updateSection(id, sectionKey, content),
    submitProposal: (id) => mockProposals.submit(id),
    getProposalSections: async () => [],
    deleteProposal: (id) => mockProposals.remove(id),
    getProposalExport: async () => ({}),
    getProposalVersions: async () => [],

    // ─── AI Review ───
    getAIFeedback: (id) => mockAIReview.get(id),
    runAIFeedback: (id) => mockAIReview.run(id),

    // ─── Reviews ───
    getReviewQueue: () => mockReviews.getQueue(),
    getReviewDetail: async (id) => mockProposals.getById(id),
    createReviewDecision: (id, payload) => mockReviews.createDecision(id, payload),

    // ─── Lecturers ───
    getLecturers: () => mockLecturers.list(),
    getLecturerById: (id) => mockLecturers.getById(id),
    getLecturerProposals: async () => ({ assigned: [], suggested: [] }),
    getLecturerCapacity: async () => ({}),

    // ─── Matching ───
    getLecturerMatches: (id) => mockMatching.getMatches(id),
    runMatching: async () => ({ success: true }),
    assignLecturer: (id, lecturerId) => mockMatching.assign(id, lecturerId),
    shortlistLecturer: async () => ({ success: true }),
    rejectMatch: async () => ({ success: true }),

    // ─── Milestones ───
    getProposalMilestones: async () => [],
    createMilestone: async () => ({}),
    updateMilestone: async () => ({}),

    // ─── Admin ───
    getAdminOverview: () => mockAdmin.getOverview(),
    getAdminWorkflow: async () => ({}),
    getAdminBottlenecks: async () => [],
    getAdminReviewerWorkload: async () => ({}),
    getAdminLecturerCapacity: async () => [],
    getAuditLogs: () => mockAdmin.getAuditLogs(),

    // ─── Chat ───
    getChatSessions: () => mockChat.getSessions(),
    createChatSession: (title) => mockChat.createSession(title),
    getChatMessages: (id) => mockChat.getMessages(id),
    sendChatMessage: (id, msg) => mockChat.sendMessage(id, msg),

    // ─── User Management ───
    getUsers: (filters) => mockUsers.list(filters),
    createUser: (payload) => mockUsers.create(payload),
    updateUser: (id, payload) => mockUsers.update(id, payload),
    deleteUser: (id) => mockUsers.remove(id),

    // ─── Faculties ───
    getFaculties: () => mockFaculties.list(),
    createFaculty: (payload) => mockFaculties.create(payload),
    updateFaculty: (id, payload) => mockFaculties.update(id, payload),
    deleteFaculty: (id) => mockFaculties.remove(id),

    // ─── Departments ───
    getDepartments: (facultyId) => mockDepartments.list(facultyId),
    createDepartment: (payload) => mockDepartments.create(payload),
    updateDepartment: async () => ({}),
    deleteDepartment: (id) => mockDepartments.remove(id),

    // ─── Fields of Study ───
    getFieldsOfStudy: () => mockFieldsOfStudy.list(),
    createFieldOfStudy: (payload) => mockFieldsOfStudy.create(payload),
    updateFieldOfStudy: async () => ({}),
    deleteFieldOfStudy: (id) => mockFieldsOfStudy.remove(id),

    // ─── Projects ───
    getProjects: () => mockProjects.list(),
    getProjectById: (id) => mockProjects.getById(id),
    createProject: async () => ({}),
    updateProject: async () => ({}),
    getProjectMembers: (id) => mockProjects.getMembers(id),
    addProjectMember: async () => ({}),
    removeProjectMember: async () => ({ success: true }),
    getProjectMilestones: (id) => mockProjects.getMilestones(id),
    updateProjectMilestone: async () => ({}),
    getProjectReports: (id) => mockProjects.getReports(id),
    uploadProjectReport: async () => ({}),
    getProjectDeliverables: (id) => mockProjects.getDeliverables(id),
    uploadProjectDeliverable: async () => ({}),
  };
}
