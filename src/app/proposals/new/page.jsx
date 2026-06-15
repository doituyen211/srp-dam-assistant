"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function NewProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData, submitMode) => {
    setLoading(true);
    setError("");

    try {
      await api.createProposal(
        {
          ...formData,
          studentId: user?.id,
          studentName: user?.name,
        },
        submitMode === "submit",
      );

      router.push("/proposals");
    } catch {
      setError(
        submitMode === "submit"
          ? "Unable to submit proposal. Please check your content and try again."
          : "Unable to save draft. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Proposal Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
            New Research Proposal
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">
            Complete each section with care. Strong proposals clearly define the
            problem, objectives, methodology, and expected contributions.
          </p>
        </div>

        <Link
          href="/proposals"
          className="inline-flex items-center justify-center rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        >
          Back to list
        </Link>
      </div>

      {error && (
        <Alert type="error" title="Unable to create proposal">
          {error}
        </Alert>
      )}

      <ProposalForm onSubmit={handleSubmit} loading={loading} error={null} />
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
      <AppShell>
        <NewProposalContent />
      </AppShell>
    </ProtectedRoute>
  );
}
