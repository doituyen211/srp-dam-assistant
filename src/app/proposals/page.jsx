"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalCard } from "@/components/proposal/ProposalCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  PROPOSAL_STATUSES,
  STATUS_LABELS,
  USER_ROLES,
  ACADEMIC_ROLE_LABELS,
} from "@/lib/constants";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

function ProposalsContent() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getProposals();
        if (!mounted) return;
        setProposals(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setError("Unable to load proposal list. Please try again.");
        setProposals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const roleScopedProposals = useMemo(() => {
    if (user?.role === USER_ROLES.STUDENT) {
      return proposals.filter((p) => p.studentId === user.id || p.student_id === user.id);
    }
    return proposals;
  }, [proposals, user]);

  const filteredProposals = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return roleScopedProposals
      .filter((p) => {
        const matchesStatus = status === "all" || p.status === status;
        const haystack = [p.title, p.researchField || p.field, p.studentName, ...(p.keywords || [])]
          .filter(Boolean).join(" ").toLowerCase();
        return matchesStatus && (!keyword || haystack.includes(keyword));
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [roleScopedProposals, search, status]);

  const hasFilters = search.trim() || status !== "all";
  const isStudent = user?.role === USER_ROLES.STUDENT;

  if (loading) return <LoadingState variant="default" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            {ACADEMIC_ROLE_LABELS[user?.role] || "User"} Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">Research Proposals</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">
            {roleScopedProposals.length === 0
              ? "No proposals yet. Create your first research proposal to get started."
              : `${roleScopedProposals.length} proposals`}
          </p>
        </div>
        {isStudent && (
          <Link href="/proposals/new"><Button variant="primary">+ New Proposal</Button></Link>
        )}
      </div>

      {error && <Alert type="error" title="Unable to load data">{error}</Alert>}

      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_260px]">
          <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, field, keywords..." />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value || "all")} options={statusOptions} />
        </CardContent>
      </Card>

      {filteredProposals.length === 0 ? (
        <Card>
          <EmptyState
            title={hasFilters ? "No matching proposals found" : "No proposals yet"}
            description={hasFilters ? "Try adjusting your keywords or filters." : "Create a research proposal to get started."}
            action={!hasFilters && isStudent ? <Link href="/proposals/new"><Button variant="primary">Create First Proposal</Button></Link> : null}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProposalsContent />
      </AppShell>
    </ProtectedRoute>
  );
}
