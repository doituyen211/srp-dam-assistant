// ───────── In-Memory Data Store with CRUD ─────────
// Supports all entities with basic create/read/update/delete

import {
  seedUsers,
  seedProposals,
  seedLecturers,
  seedProjects,
  seedFaculties,
  seedDepartments,
  seedFieldsOfStudy,
  seedChatSessions,
  seedAuditLogs,
  seedProjectMembers,
  seedProjectMilestones,
  seedProjectReports,
  seedProjectDeliverables,
  seedRubricReview,
} from "./data";

// ─── State ───
let currentUser = null;
let users = [...seedUsers];
let proposals = [...seedProposals];
let lecturers = [...seedLecturers];
let projects = [...seedProjects];
let faculties = [...seedFaculties];
let departments = [...seedDepartments];
let fieldsOfStudy = [...seedFieldsOfStudy];
let chatSessions = [...seedChatSessions];
let auditLogs = [...seedAuditLogs];
let projectMembers = { ...seedProjectMembers };
let projectMilestones = { ...seedProjectMilestones };
let projectReports = { ...seedProjectReports };
let projectDeliverables = { ...seedProjectDeliverables };
let nextId = 100;

function generateId(prefix = "") {
  nextId++;
  return `${prefix}${nextId}`;
}

// ─── Auth ───

export const mockAuth = {
  async register(payload) {
    const user = {
      id: generateId("u"),
      name: payload.name,
      email: payload.email,
      role: payload.role || "student",
      faculty: payload.faculty || "",
      department: payload.department || "",
      title: null,
    };
    users.push(user);
    currentUser = user;
    return user;
  },

  async login(email, password) {
    const user = users.find((u) => u.email === email);
    if (!user) throw { status: 401, message: "Invalid email or password" };
    currentUser = user;
    return user;
  },

  async getMe() {
    if (!currentUser) throw { status: 401, message: "Not authenticated" };
    return currentUser;
  },

  async logout() {
    currentUser = null;
    return true;
  },

  async updateMe(payload) {
    if (!currentUser) throw { status: 401, message: "Not authenticated" };
    Object.assign(currentUser, payload);
    return currentUser;
  },
};

// ─── Proposals ───

export const mockProposals = {
  async list(filters = {}) {
    let list = [...proposals];
    if (filters.status) list = list.filter((p) => p.status === filters.status);
    if (filters.mine === "true" && currentUser) {
      list = list.filter((p) => p.studentId === currentUser.id);
    }
    if (filters.student_id) list = list.filter((p) => p.studentId === filters.student_id);
    if (filters.research_field) list = list.filter((p) => p.researchField === filters.research_field);
    return list;
  },

  async getById(id) {
    const p = proposals.find((p) => p.id === id);
    if (!p) throw { status: 404, message: "Proposal not found" };
    return p;
  },

  async create(payload) {
    const proposal = {
      id: generateId("p"),
      title: payload.title,
      abstract: payload.abstract || "",
      studentName: payload.studentName || currentUser?.name || "Student",
      studentId: payload.studentId || currentUser?.id,
      researchField: payload.researchField || "",
      status: "draft",
      readinessScore: 0,
      aiConfidence: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keywords: payload.keywords || [],
      version: 1,
      sections: [],
      statusHistory: [],
    };
    proposals.push(proposal);
    return proposal;
  },

  async update(id, payload) {
    const idx = proposals.findIndex((p) => p.id === id);
    if (idx === -1) throw { status: 404, message: "Proposal not found" };
    Object.assign(proposals[idx], payload, { updatedAt: new Date().toISOString() });
    return proposals[idx];
  },

  async updateSection(id, sectionKey, content) {
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) throw { status: 404, message: "Proposal not found" };
    const sectionIdx = proposal.sections.findIndex((s) => s.key === sectionKey || s.id === sectionKey);
    const health = content.length > 300 ? "strong" : content.length > 100 ? "needs_evidence" : content.length > 0 ? "weak" : "missing";
    if (sectionIdx >= 0) {
      proposal.sections[sectionIdx].content = content;
      proposal.sections[sectionIdx].health = health;
    } else {
      proposal.sections.push({ id: sectionKey, key: sectionKey, label: sectionKey, content, health });
    }
    proposal.updatedAt = new Date().toISOString();
    return proposal.sections[sectionIdx] || proposal.sections[proposal.sections.length - 1];
  },

  async submit(id) {
    const idx = proposals.findIndex((p) => p.id === id);
    if (idx === -1) throw { status: 404, message: "Proposal not found" };
    proposals[idx].status = "submitted";
    proposals[idx].submittedAt = new Date().toISOString();
    proposals[idx].updatedAt = new Date().toISOString();
    return proposals[idx];
  },

  async remove(id) {
    const idx = proposals.findIndex((p) => p.id === id);
    if (idx === -1) throw { status: 404, message: "Proposal not found" };
    proposals.splice(idx, 1);
    return { success: true };
  },
};

// ─── AI Review ───

export const mockAIReview = {
  async get(proposalId) {
    return {
      id: generateId("ai"),
      proposalId,
      overallReadiness: 7.5,
      score: 7.5,
      confidence: 0.85,
      strengths: ["Clear problem definition", "Good methodology choice", "Feasible timeline"],
      issues: ["Missing ethics section", "Could strengthen literature review"],
      suggestedRevisions: ["Add ethics considerations", "Expand literature review with recent papers"],
      summary: "Good proposal with clear objectives. Needs minor revisions.",
      timestamp: new Date().toISOString(),
    };
  },

  async run(proposalId) {
    return this.get(proposalId);
  },
};

// ─── Reviews ───

export const mockReviews = {
  async getQueue() {
    return proposals.filter((p) =>
      p.status === "submitted" || p.status === "under_review" || p.status === "needs_revision"
    );
  },

  async createDecision(proposalId, payload) {
    const idx = proposals.findIndex((p) => p.id === proposalId);
    if (idx === -1) throw { status: 404, message: "Proposal not found" };
    proposals[idx].status = payload.decision === "approved" ? "approved" :
      payload.decision === "rejected" ? "rejected" : "needs_revision";
    proposals[idx].updatedAt = new Date().toISOString();
    return { success: true };
  },
};

// ─── Lecturers ───

export const mockLecturers = {
  async list() { return [...lecturers]; },
  async getById(id) { return lecturers.find((l) => l.id === id) || null; },
};

// ─── Matching ───

export const mockMatching = {
  async getMatches(proposalId) {
    return lecturers.slice(0, 3).map((l, i) => ({
      ...l,
      matchScore: 95 - i * 5,
      matchReasons: ["Expertise match", "Available capacity"],
    }));
  },
  async assign(proposalId, lecturerId) {
    const idx = proposals.findIndex((p) => p.id === proposalId);
    if (idx >= 0) proposals[idx].assignedLecturer = lecturerId;
    return { success: true };
  },
};

// ─── Projects ───

export const mockProjects = {
  async list() { return [...projects]; },
  async getById(id) { return projects.find((p) => p.id === id) || null; },
  async getMembers(id) { return projectMembers[id] || []; },
  async getMilestones(id) { return projectMilestones[id] || []; },
  async getReports(id) { return projectReports[id] || []; },
  async getDeliverables(id) { return projectDeliverables[id] || []; },
};

// ─── Chat ───

export const mockChat = {
  async getSessions() { return [...chatSessions]; },
  async createSession(title) {
    const session = { id: generateId("cs"), title, messages: [], createdAt: new Date().toISOString() };
    chatSessions.push(session);
    return session;
  },
  async getMessages(sessionId) {
    const session = chatSessions.find((s) => s.id === sessionId);
    return session?.messages || [];
  },
  async sendMessage(sessionId, content) {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) throw { status: 404, message: "Session not found" };
    session.messages.push({ role: "user", content });
    const aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: [
      { type: "research_direction", title: "Research Direction", items: [
        { id: "d1", label: "Data Analysis", description: "Apply quantitative methods" },
        { id: "d2", label: "System Development", description: "Build a decision-support tool" },
      ]},
    ]};
    session.messages.push(aiMsg);
    return aiMsg;
  },
};

// ─── Admin ───

export const mockAdmin = {
  async getOverview() {
    const stageCounts = {};
    proposals.forEach((p) => { stageCounts[p.status] = (stageCounts[p.status] || 0) + 1; });
    return {
      totalProposals: proposals.length,
      proposalsByStage: stageCounts,
      pendingReviews: proposals.filter((p) => p.status === "submitted" || p.status === "under_review").length,
      overdueMilestones: 0,
      averageReadinessScore: proposals.length ? proposals.reduce((s, p) => s + (p.readinessScore || 0), 0) / proposals.length : 0,
      reviewerWorkload: { "Tran Thi Bich": 2 },
      lecturerCapacity: lecturers.map((l) => ({ id: l.id, name: l.name, currentLoad: l.currentLoad, maxLoad: l.maxLoad })),
      bottlenecks: [],
    };
  },

  async getAuditLogs() { return [...auditLogs]; },
};

// ─── User Management ───

export const mockUsers = {
  async list(filters = {}) {
    let list = [...users];
    if (filters.role) list = list.filter((u) => u.role === filters.role);
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword));
    }
    return list;
  },

  async create(payload) {
    const user = { id: generateId("u"), ...payload };
    users.push(user);
    return user;
  },

  async update(id, payload) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw { status: 404, message: "User not found" };
    Object.assign(users[idx], payload);
    return users[idx];
  },

  async remove(id) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw { status: 404, message: "User not found" };
    users.splice(idx, 1);
    return { success: true };
  },
};

// ─── Faculties ───

export const mockFaculties = {
  async list() { return [...faculties]; },
  async create(payload) {
    const f = { id: generateId("f"), ...payload };
    faculties.push(f);
    return f;
  },
  async update(id, payload) {
    const idx = faculties.findIndex((f) => f.id === id);
    if (idx === -1) throw { status: 404, message: "Not found" };
    Object.assign(faculties[idx], payload);
    return faculties[idx];
  },
  async remove(id) {
    const idx = faculties.findIndex((f) => f.id === id);
    if (idx === -1) throw { status: 404, message: "Not found" };
    faculties.splice(idx, 1);
    return { success: true };
  },
};

// ─── Departments ───

export const mockDepartments = {
  async list(facultyId) {
    let list = [...departments];
    if (facultyId) list = list.filter((d) => d.facultyId === facultyId);
    return list;
  },
  async create(payload) {
    const d = { id: generateId("d"), ...payload };
    departments.push(d);
    return d;
  },
  async remove(id) {
    const idx = departments.findIndex((d) => d.id === id);
    if (idx === -1) throw { status: 404, message: "Not found" };
    departments.splice(idx, 1);
    return { success: true };
  },
};

// ─── Fields of Study ───

export const mockFieldsOfStudy = {
  async list() { return [...fieldsOfStudy]; },
  async create(payload) {
    const f = { id: generateId("fs"), ...payload };
    fieldsOfStudy.push(f);
    return f;
  },
  async remove(id) {
    const idx = fieldsOfStudy.findIndex((f) => f.id === id);
    if (idx === -1) throw { status: 404, message: "Not found" };
    fieldsOfStudy.splice(idx, 1);
    return { success: true };
  },
};
