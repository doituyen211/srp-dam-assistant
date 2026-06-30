"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

/**
 * SupervisorMatchingPanel - Shows top lecturer candidates with scores
 * Admin can assign supervisors
 */
export function SupervisorMatchingPanel({ proposalId, proposal, isAdmin, onAssign }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load matches when component mounts
  useState(() => {
    if (!proposalId) return;
    api.getLecturerMatches(proposalId)
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  });

  const handleAssign = async (lecturerId) => {
    setAssigning(lecturerId);
    setError("");
    setMessage("");
    try {
      await api.assignLecturer(proposalId, lecturerId);
      setMessage("Supervisor assigned successfully!");
      onAssign?.();
    } catch (err) {
      setError(err.message || "Failed to assign supervisor.");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <LoadingState message="Loading supervisor matches..." />;

  if (!proposalId) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState title="No proposal selected" description="Select a proposal to see matching supervisors." />
        </CardContent>
      </Card>
    );
  }

  if (proposal?.assignedLecturer || proposal?.assigned_lecturer_id) {
    return (
      <Card>
        <CardHeader><CardTitle>Assigned Supervisor</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-lg border border-success/20 bg-success/5 p-4">
            <p className="text-sm font-medium text-ink">
              {proposal.assignedLecturerName || proposal.assignedLecturer || "Supervisor assigned"}
            </p>
            <p className="mt-1 text-xs text-body-muted">
              This proposal already has an assigned supervisor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervisor Matching</CardTitle>
        <p className="mt-1 text-sm text-body-muted">Top lecturer candidates based on expertise and capacity</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && <Alert type="success" closable>{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        {matches.length === 0 ? (
          <EmptyState
            title="No matching supervisors found"
            description="No supervisors match this proposal's research field and requirements."
          />
        ) : (
          <div className="space-y-3">
            {matches.map((lecturer) => (
              <div key={lecturer.id} className="rounded-lg border border-hairline bg-subdued/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{lecturer.name}</p>
                      {lecturer.matchScore && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {lecturer.matchScore}% match
                        </span>
                      )}
                    </div>
                    {lecturer.title && (
                      <p className="mt-0.5 text-xs text-body-muted">{lecturer.title}</p>
                    )}
                    {lecturer.department && (
                      <p className="text-xs text-muted">{lecturer.department}</p>
                    )}
                    {lecturer.expertise?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lecturer.expertise.map((exp, i) => (
                          <span key={i} className="rounded bg-subdued px-2 py-0.5 text-[10px] text-body-muted">{exp}</span>
                        ))}
                      </div>
                    )}
                    {lecturer.matchReasons?.length > 0 && (
                      <p className="mt-2 text-xs text-body-muted">
                        {lecturer.matchReasons[0]}
                      </p>
                    )}
                    {lecturer.currentLoad !== undefined && lecturer.maxLoad !== undefined && (
                      <p className="mt-1 text-[11px] text-muted">
                        Capacity: {lecturer.currentLoad}/{lecturer.maxLoad} proposals
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={assigning === lecturer.id}
                      disabled={assigning !== null}
                      onClick={() => handleAssign(lecturer.id)}
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
