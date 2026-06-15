"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LecturerMatchCard } from "@/components/matching";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES, WORKFLOW_STAGES } from "@/lib/constants";
import { mockLecturers } from "@/lib/mockData";

const allowedRoles = [
  USER_ROLES.ADMIN,
  USER_ROLES.REVIEWER,
  USER_ROLES.LECTURER,
];

const normalizeMatch = (suggestion) => {
  const lecturerId = suggestion.lecturerId || suggestion.id;
  const profile = mockLecturers.find((l) => l.id === lecturerId);
  const currentLoad = profile?.currentLoad ?? suggestion.currentLoad ?? 0;
  const maxLoad = profile?.maxLoad ?? suggestion.maxLoad ?? 1;
  const isFull = currentLoad >= maxLoad;

  return {
    ...profile,
    ...suggestion,
    id: lecturerId,
    department: profile?.department || suggestion.department || "",
    expertise: profile?.expertise || [],
    currentLoad,
    maxLoad,
    matchScore: suggestion.matchScore ?? profile?.matchScore ?? 0,
    scoreBreakdown: suggestion.scoreBreakdown || profile?.scoreBreakdown || {},
    matchReasons: suggestion.matchReasons || (suggestion.reason ? [suggestion.reason] : profile?.matchReasons || []),
    riskNote: suggestion.riskNote || (isFull ? "Lecturer is at full capacity." : ""),
    risks: suggestion.risks || profile?.risks || (isFull ? [{ type: "capacity", label: "Lecturer has reached maximum supervision capacity.", severity: "high" }] : []),
  };
};

function AdminMatchingView({ user }) {
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState("");
  const [matches, setMatches] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingProposals(true);
      try {
        const data = await api.getProposals();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setProposals(list);
        setSelectedProposalId(list[0]?.id || "");
      } catch {
        if (!mounted) return;
        setError("Unable to load proposals.");
      } finally {
        if (mounted) setLoadingProposals(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProposalId) return;
    let mounted = true;
    api
      .getLecturerMatches(selectedProposalId)
      .then((data) => {
        if (mounted) setMatches(Array.isArray(data) ? data.map(normalizeMatch) : []);
      })
      .catch(() => {
        if (mounted) setError("Unable to load matches.");
      });
    return () => {
      mounted = false;
    };
  }, [selectedProposalId]);

  const proposalOptions = useMemo(
    () =>
      proposals.map((p) => ({
        value: p.id,
        label: `${p.title?.slice(0, 60) || "Untitled"}${p.studentName ? ` — ${p.studentName}` : ""}`,
      })),
    [proposals],
  );

  const selectedProposal = proposals.find((p) => p.id === selectedProposalId);

  const handleAction = async (lecturerId, actionType) => {
    if (!selectedProposalId) return;
    setPendingId(`${lecturerId}:${actionType}`);
    setError("");
    setMessage("");
    try {
      const result = await api.recommendLecturer(selectedProposalId, lecturerId);
      const labels = {
        assign: "Lecturer assigned to this proposal.",
        shortlist: "Lecturer shortlisted.",
        reject: "Suggestion rejected.",
      };
      setMessage(result?.message || labels[actionType] || "Action recorded.");
    } catch {
      setError("Unable to record action.");
    } finally {
      setPendingId("");
    }
  };

  if (loadingProposals) {
    return <LoadingState variant="matching" />;
  }

  return (
    <div className="space-y-6">
      {/* Proposal selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Proposal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Select
            label="Proposal"
            value={selectedProposalId}
            onChange={(e) => setSelectedProposalId(e.target.value)}
            options={proposalOptions}
          />
          {selectedProposalId && (
            <Link
              href={`/proposals/${selectedProposalId}`}
              className="inline-flex items-center justify-center rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued"
            >
              View proposal detail
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Proposal context */}
      {selectedProposal && (
        <Card accent="info">
          <CardHeader>
            <CardTitle>Proposal Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Title
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {selectedProposal.title}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Student
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {selectedProposal.studentName}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Field
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {selectedProposal.researchField || selectedProposal.field}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Stage
                </p>
                <div className="mt-0.5">
                  <ProposalStatusBadge status={selectedProposal.status} />
                </div>
              </div>
            </div>

            {/* Keywords */}
            {selectedProposal.keywords?.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Keywords
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedProposal.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded border border-hairline bg-subdued px-2 py-0.5 text-xs text-body-muted"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {message && (
        <Alert type="success" title="Action recorded" closable>
          {message}
        </Alert>
      )}
      {error && <Alert type="error">{error}</Alert>}

      {/* Match cards */}
      {proposals.length === 0 ? (
        <Card>
          <EmptyState
            title="No proposals available"
            description="Proposals need to be submitted before matching can begin."
          />
        </Card>
      ) : matches.length === 0 ? (
        <Card>
          <EmptyState
            title="No matching suggestions"
            description="No supervisor matches found for this proposal. Try selecting a different proposal."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((lecturer) => (
            <LecturerMatchCard
              key={lecturer.id}
              lecturer={lecturer}
              canAdmin
              loading={pendingId.startsWith(lecturer.id)}
              onAssign={(id) => handleAction(id, "assign")}
              onShortlist={(id) => handleAction(id, "shortlist")}
              onReject={(id) => handleAction(id, "reject")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LecturerMatchingView({ user }) {
  const [assignedProposals, setAssignedProposals] = useState([]);
  const [suggestedProposals, setSuggestedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = await api.getLecturerProposals(user.id);
        if (!mounted) return;
        setAssignedProposals(result.assigned || []);
        setSuggestedProposals(result.suggested || []);
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const lecturerProfile = mockLecturers.find((l) => l.id === user.id);
  const loadPct = lecturerProfile
    ? Math.round((lecturerProfile.currentLoad / lecturerProfile.maxLoad) * 100)
    : 0;

  if (loading) {
    return <LoadingState variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      {/* Lecturer supervision overview */}
      {lecturerProfile && (
        <Card accent="info">
          <CardHeader>
            <CardTitle>Your Supervision Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Current Load
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {lecturerProfile.currentLoad}
                  <span className="text-lg text-body-muted">
                    /{lecturerProfile.maxLoad}
                  </span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Assigned Proposals
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {assignedProposals.length}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Suggested Matches
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {suggestedProposals.length}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-body-muted">Supervision Capacity</span>
                <span
                  className={`font-mono text-sm font-medium ${
                    loadPct >= 100
                      ? "text-danger"
                      : loadPct >= 75
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {loadPct}%
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-subdued">
                <div
                  className={`h-full rounded-full ${
                    loadPct >= 100
                      ? "bg-danger"
                      : loadPct >= 75
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                  style={{ width: `${Math.min(loadPct, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <Alert type="success" closable>
          {message}
        </Alert>
      )}

      {/* Suggested proposals */}
      {suggestedProposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested for You</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              These proposals match your expertise. You can indicate interest to
              help the assignment decision.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded border border-hairline bg-canvas p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-ink">
                        {proposal.title}
                      </h3>
                      <span className="font-mono text-xs text-muted">
                        Match: {proposal.matchScore?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-body-muted">
                      {proposal.studentName} ·{" "}
                      {proposal.researchField || proposal.field}
                    </p>
                    {proposal.matchReason && (
                      <p className="mt-1 rounded bg-info-bg/30 px-2 py-1 text-xs text-info">
                        {proposal.matchReason}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/proposals/${proposal.id}`}
                    className="flex-shrink-0 rounded border border-hairline px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-subdued"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Assigned proposals */}
      {assignedProposals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between rounded border border-hairline p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {proposal.title}
                  </p>
                  <p className="text-xs text-body-muted">
                    {proposal.studentName} ·{" "}
                    {proposal.researchField || proposal.field}
                  </p>
                </div>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="flex-shrink-0 rounded border border-hairline px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-subdued"
                >
                  View
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No proposals assigned yet"
              description="When proposals are matched to you, they will appear here."
            />
          </CardContent>
        </Card>
      )}

      {/* Suggested match cards */}
      {suggestedProposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Supervisor Match Suggestions</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Based on your expertise profile and current capacity.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedProposals.map((proposal) => {
                // Build a lecturer object from profile
                const profile = mockLecturers.find((l) => l.id === user.id);
                const matchLecturer = {
                  ...profile,
                  id: proposal.id,
                  name: profile?.name || user.name,
                  matchScore: proposal.matchScore || 0,
                  matchReasons: proposal.matchReason ? [proposal.matchReason] : [],
                };
                return (
                  <LecturerMatchCard
                    key={proposal.id}
                    lecturer={matchLecturer}
                    isLecturerView
                    onAcceptInterest={() => {
                      setMessage("Interest recorded. Admin will be notified.");
                    }}
                    onDeclineInterest={() => {
                      setMessage("Declined. This suggestion will be removed.");
                    }}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MatchingPageContent() {
  const { user } = useAuth();
  const isLecturer = user?.role === USER_ROLES.LECTURER;
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.REVIEWER;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {isLecturer ? "Supervisor View" : "Supervisor Matching"}
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              {isLecturer
                ? "Your Supervision Opportunities"
                : "Supervisor Assignment"}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">
              {isLecturer
                ? "Review proposals that match your expertise and indicate your availability."
                : "AI suggests possible supervisors based on expertise, capacity, and prior supervision. The final assignment decision is made by an authorized administrator."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI advisory banner */}
      <HumanInLoopBanner />

      {/* Role-specific content */}
      {isLecturer ? (
        <LecturerMatchingView user={user} />
      ) : (
        <AdminMatchingView user={user} />
      )}
    </div>
  );
}

export default function MatchingPage() {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppShell>
        <MatchingPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
