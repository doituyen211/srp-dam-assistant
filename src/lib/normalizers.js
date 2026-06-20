// ───────── Data normalizers ─────────
// Maps backend snake_case → frontend camelCase
// Preserves original fields so both are accessible.
// Missing/undefined fields never crash — they default to null/[]/0.

function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeys(obj, mapper) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => mapKeys(item, mapper));
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = obj[key];
    const mapped = mapper(key);
    if (mapped !== key) {
      result[mapped] = obj[key];
    }
  }
  return result;
}

/**
 * Convert a single object's snake_case keys to camelCase.
 * Nested objects and arrays are recursively converted.
 */
export function snakeToCamel(obj) {
  return mapKeys(obj, (key) => toCamel(key));
}

// ─── Individual normalizers ───

export function normalizeUser(raw) {
  if (!raw) return null;
  const data = raw.user || raw;
  if (!data || !data.id) return null;
  const camel = snakeToCamel(data);
  return {
    id: camel.id,
    tenant_id: camel.tenant_id || camel.tenantId || null,
    tenantId: camel.tenantId || camel.tenant_id || null,
    email: camel.email,
    name: camel.name,
    role: camel.role,
    faculty: camel.faculty || null,
    department: camel.department || null,
    title: camel.title || null,
    is_active: camel.is_active ?? camel.isActive ?? true,
    isActive: camel.isActive ?? camel.is_active ?? true,
    is_verified: camel.is_verified ?? camel.isVerified ?? false,
    isVerified: camel.isVerified ?? camel.is_verified ?? false,
    memberships: camel.memberships || [],
  };
}

export function normalizeTenant(raw) {
  if (!raw) return null;
  const camel = snakeToCamel(raw);
  return {
    ...camel,
    id: camel.id,
    name: camel.name,
    display_name: camel.display_name || camel.displayName || camel.name,
    displayName: camel.displayName || camel.display_name || camel.name,
    domain: camel.domain || null,
  };
}

export function normalizeProposal(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id,
    title: c.title || "",
    abstract: c.abstract || "",
    studentName: c.studentName || c.student_name || "",
    student_name: c.student_name || c.studentName || "",
    studentId: c.studentId || c.student_id || null,
    student_id: c.student_id || c.studentId || null,
    researchField: c.researchField || c.research_field || c.field || "",
    research_field: c.research_field || c.researchField || c.field || "",
    field: c.field || c.researchField || c.research_field || "",
    status: c.status || "draft",
    currentStage: c.currentStage ?? c.current_stage ?? null,
    current_stage: c.current_stage ?? c.currentStage ?? null,
    readinessScore: c.readinessScore ?? c.readiness_score ?? c.aiScore ?? 0,
    readiness_score: c.readiness_score ?? c.readinessScore ?? c.aiScore ?? 0,
    aiScore: c.aiScore ?? c.ai_score ?? c.readinessScore ?? 0,
    aiConfidence: c.aiConfidence ?? c.ai_confidence ?? 0,
    ai_confidence: c.ai_confidence ?? c.aiConfidence ?? 0,
    keywords: c.keywords || [],
    createdAt: c.createdAt || c.created_at || null,
    created_at: c.created_at || c.createdAt || null,
    updatedAt: c.updatedAt || c.updated_at || null,
    updated_at: c.updated_at || c.updatedAt || null,
    submittedAt: c.submittedAt || c.submitted_at || null,
    submitted_at: c.submitted_at || c.submittedAt || null,
    deadline: c.deadline || null,
    assignedReviewer: c.assignedReviewer || c.assigned_reviewer || null,
    assigned_reviewer: c.assigned_reviewer || c.assignedReviewer || null,
    assignedReviewerId: c.assignedReviewerId || c.assigned_reviewer_id || null,
    assigned_reviewer_id: c.assigned_reviewer_id || c.assignedReviewerId || null,
    assignedLecturer: c.assignedLecturer || c.assigned_lecturer || null,
    assigned_lecturer: c.assigned_lecturer || c.assignedLecturer || null,
    assignedLecturerId: c.assignedLecturerId || c.assigned_lecturer_id || null,
    assigned_lecturer_id: c.assigned_lecturer_id || c.assignedLecturerId || null,
    nextAction: c.nextAction || c.next_action || null,
    next_action: c.next_action || c.nextAction || null,
    missingItems: c.missingItems || c.missing_items || [],
    missing_items: c.missing_items || c.missingItems || [],
    riskFlags: c.riskFlags || c.risk_flags || [],
    risk_flags: c.risk_flags || c.riskFlags || [],
    version: c.version ?? 1,
    sections: (c.sections || []).map(normalizeProposalSection),
    statusHistory: c.statusHistory || c.status_history || [],
    status_history: c.status_history || c.statusHistory || [],
    latestAiReview: c.latestAiReview || c.latest_ai_review || null,
    latest_ai_review: c.latest_ai_review || c.latestAiReview || null,
    latestRubricReview: c.latestRubricReview || c.latest_rubric_review || null,
    latest_rubric_review: c.latest_rubric_review || c.latestRubricReview || null,
  };
}

export function normalizeProposalSection(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id,
    section_id: c.section_id || c.id,
    label: c.label || "",
    content: c.content || "",
    health: c.health || c.status || "missing",
    status: c.status || c.health || "missing",
    aiComment: c.aiComment || c.ai_comment || null,
    ai_comment: c.ai_comment || c.aiComment || null,
    rubricHint: c.rubricHint || c.rubric_hint || null,
    rubric_hint: c.rubric_hint || c.rubricHint || null,
    order: c.order ?? 0,
  };
}

export function normalizeAIReview(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id,
    proposalId: c.proposalId || c.proposal_id || null,
    proposal_id: c.proposal_id || c.proposalId || null,
    overallReadiness: c.overallReadiness ?? c.overall_readiness ?? c.score ?? 0,
    overall_readiness: c.overall_readiness ?? c.overallReadiness ?? c.score ?? 0,
    score: c.score ?? c.overallReadiness ?? c.overall_readiness ?? 0,
    confidence: c.confidence ?? 0,
    strengths: c.strengths || [],
    issues: c.issues || c.weaknesses || [],
    weaknesses: c.weaknesses || c.issues || [],
    suggestedRevisions: c.suggestedRevisions || c.suggested_revisions || c.suggestions || [],
    suggested_revisions: c.suggested_revisions || c.suggestedRevisions || c.suggestions || [],
    suggestions: c.suggestions || c.suggestedRevisions || c.suggested_revisions || [],
    summary: c.summary || c.summary || "",
    limitations: c.limitations || "",
    timestamp: c.timestamp || c.createdAt || c.created_at || null,
    advisoryNotice: c.advisoryNotice || c.advisory_notice || "AI review is advisory only.",
    advisory_notice: c.advisory_notice || c.advisoryNotice || "AI review is advisory only.",
  };
}

export function normalizeRubricReview(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id,
    proposalId: c.proposalId || c.proposal_id || null,
    proposal_id: c.proposal_id || c.proposalId || null,
    reviewer: c.reviewer || c.reviewer_name || "",
    reviewer_name: c.reviewer_name || c.reviewer || "",
    reviewerId: c.reviewerId || c.reviewer_id || null,
    reviewer_id: c.reviewer_id || c.reviewerId || null,
    timestamp: c.timestamp || c.createdAt || c.created_at || null,
    totalScore: c.totalScore ?? c.total_score ?? 0,
    total_score: c.total_score ?? c.totalScore ?? 0,
    criteria: (c.criteria || []).map(normalizeRubricCriterion),
    comments: c.comments || c.comment || "",
    comment: c.comment || c.comments || "",
    decision: c.decision || null,
  };
}

function normalizeRubricCriterion(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id || c.name,
    name: c.name || c.label,
    label: c.label || c.name,
    score: c.score ?? 0,
    maxScore: c.maxScore ?? c.max_score ?? 10,
    max_score: c.max_score ?? c.maxScore ?? 10,
    description: c.description || "",
    aiObservation: c.aiObservation || c.ai_observation || null,
    ai_observation: c.ai_observation || c.aiObservation || null,
    reviewerComment: c.reviewerComment || c.reviewer_comment || null,
    reviewer_comment: c.reviewer_comment || c.reviewerComment || null,
  };
}

export function normalizeReviewQueueItem(raw) {
  const proposal = normalizeProposal(raw);
  const rubric = raw?.rubric ? normalizeRubricReview(raw.rubric) : null;
  return { ...proposal, rubric };
}

export function normalizeAdminOverview(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  const stageCounts = c.proposalsByStage || c.proposals_by_stage || {};
  return {
    ...raw,
    ...c,
    totalProposals: c.totalProposals ?? c.total_proposals ?? 0,
    total_proposals: c.total_proposals ?? c.totalProposals ?? 0,
    proposalsByStage: stageCounts,
    proposals_by_stage: stageCounts,
    pendingReviews: c.pendingReviews ?? c.pending_reviews ?? 0,
    pending_reviews: c.pending_reviews ?? c.pendingReviews ?? 0,
    overdueMilestones: c.overdueMilestones ?? c.overdue_milestones ?? 0,
    overdue_milestones: c.overdue_milestones ?? c.overdueMilestones ?? 0,
    averageReadinessScore: c.averageReadinessScore ?? c.average_readiness_score ?? 0,
    average_readiness_score: c.average_readiness_score ?? c.averageReadinessScore ?? 0,
    reviewerWorkload: c.reviewerWorkload || c.reviewer_workload || {},
    reviewer_workload: c.reviewer_workload || c.reviewerWorkload || {},
    lecturerCapacity: c.lecturerCapacity || c.lecturer_capacity || [],
    lecturer_capacity: c.lecturer_capacity || c.lecturerCapacity || [],
    bottlenecks: c.bottlenecks || [],
  };
}

export function normalizeAuditLog(raw) {
  if (!raw) return null;
  const c = snakeToCamel(raw);
  return {
    ...raw,
    ...c,
    id: c.id,
    timestamp: c.timestamp || c.createdAt || c.created_at || null,
    action: c.action || "",
    status: c.status || "",
    details: c.details || c.detail || "",
    detail: c.detail || c.details || "",
    userId: c.userId || c.user_id || null,
    user_id: c.user_id || c.userId || null,
    userName: c.userName || c.user_name || "System",
    user_name: c.user_name || c.userName || "System",
  };
}
