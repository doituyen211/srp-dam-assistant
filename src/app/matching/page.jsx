"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LecturerMatchCard } from "@/components/matching";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";
import { mockLecturers } from "@/lib/mockData";

const allowedRoles = [
  USER_ROLES.ADMIN,
  USER_ROLES.REVIEWER,
  USER_ROLES.LECTURER,
];

const normalizeMatch = (suggestion) => {
  const lecturerId = suggestion.lecturerId || suggestion.id;
  const profile = mockLecturers.find((lecturer) => lecturer.id === lecturerId);
  const expertise =
    profile?.expertise ||
    (Array.isArray(suggestion.expertise)
      ? suggestion.expertise
      : [suggestion.expertise].filter(Boolean));
  const currentLoad = profile?.currentLoad ?? suggestion.currentLoad ?? 0;
  const maxLoad = profile?.maxLoad ?? suggestion.maxLoad ?? 1;
  const isFull = currentLoad >= maxLoad;

  return {
    ...profile,
    ...suggestion,
    id: lecturerId,
    department: profile?.department || suggestion.department || "Chưa cập nhật",
    expertise,
    currentLoad,
    maxLoad,
    matchScore: suggestion.matchScore ?? profile?.matchScore ?? 0,
    reason: suggestion.reason || profile?.reason || "Phù hợp với lĩnh vực đề tài.",
    riskNote:
      suggestion.riskNote ||
      (isFull
        ? "Rủi ro: giảng viên đang đạt hoặc vượt tải hướng dẫn hiện tại."
        : ""),
  };
};

function MatchingPageContent() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState("");
  const [matches, setMatches] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [pendingLecturerId, setPendingLecturerId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canRecommend =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.REVIEWER;

  useEffect(() => {
    let mounted = true;

    const loadProposals = async () => {
      setLoadingProposals(true);
      setError("");

      try {
        const data = await api.getProposals();
        if (!mounted) return;

        const proposalList = Array.isArray(data) ? data : [];
        setProposals(proposalList);
        setSelectedProposalId(proposalList[0]?.id || "");
      } catch {
        if (!mounted) return;
        setError("Không thể tải danh sách đề tài. Vui lòng thử lại sau.");
        setProposals([]);
      } finally {
        if (mounted) {
          setLoadingProposals(false);
        }
      }
    };

    loadProposals();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMatches = async () => {
      if (!selectedProposalId) {
        setMatches([]);
        return;
      }

      setLoadingMatches(true);
      setError("");
      setMessage("");

      try {
        const data = await api.getLecturerMatches(selectedProposalId);
        if (!mounted) return;

        setMatches(Array.isArray(data) ? data.map(normalizeMatch) : []);
      } catch {
        if (!mounted) return;
        setError("Không thể tải gợi ý matching. Vui lòng thử lại.");
        setMatches([]);
      } finally {
        if (mounted) {
          setLoadingMatches(false);
        }
      }
    };

    loadMatches();

    return () => {
      mounted = false;
    };
  }, [selectedProposalId]);

  const proposalOptions = useMemo(() => {
    return proposals.map((proposal) => ({
      value: proposal.id,
      label: proposal.title || proposal.id,
    }));
  }, [proposals]);

  const selectedProposal = proposals.find(
    (proposal) => proposal.id === selectedProposalId,
  );

  const handleRecommend = async (lecturerId) => {
    if (!canRecommend || !selectedProposalId) return;

    setPendingLecturerId(lecturerId);
    setError("");
    setMessage("");

    try {
      const result = await api.recommendLecturer(selectedProposalId, lecturerId);
      setMessage(result?.message || "Đã ghi nhận gợi ý giảng viên.");
    } catch {
      setError("Chưa thể ghi nhận gợi ý giảng viên. Vui lòng thử lại.");
    } finally {
      setPendingLecturerId("");
    }
  };

  if (loadingProposals) {
    return <LoadingState message="Đang tải dữ liệu matching..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="border-slate-900 bg-slate-950 text-white">
        <CardContent className="p-6 md:p-8">
          <p className="text-sm font-medium text-slate-300">
            Lecturer matching
          </p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight md:text-4xl">
            Gợi ý giảng viên hướng dẫn phù hợp
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            Chọn một đề tài để xem danh sách giảng viên được gợi ý theo chuyên
            môn, tải hướng dẫn hiện tại và mức độ phù hợp.
          </p>
        </CardContent>
      </Card>

      <Alert type="warning" title="Lưu ý">
        AI chỉ hỗ trợ đề xuất matching. Quyết định cuối cùng vẫn cần người duyệt
        xem xét bối cảnh học thuật và tải hướng dẫn thực tế.
      </Alert>

      {message && (
        <Alert type="success" title="Gợi ý đã được ghi nhận" closable>
          {message}
        </Alert>
      )}

      {error && (
        <Alert type="error" title="Có lỗi xảy ra">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Chọn đề tài</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Select
            label="Proposal"
            value={selectedProposalId}
            onChange={(event) => setSelectedProposalId(event.target.value)}
            options={proposalOptions}
          />
          {selectedProposalId && (
            <Link
              href={`/proposals/${selectedProposalId}`}
              className="inline-flex items-center justify-center rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              View proposal detail
            </Link>
          )}
        </CardContent>
      </Card>

      {selectedProposal && (
        <Card>
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Đề tài
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {selectedProposal.title}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Lĩnh vực
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {selectedProposal.field || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Sinh viên
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {selectedProposal.studentName || "Chưa cập nhật"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {proposals.length === 0 ? (
        <Card>
          <EmptyState
            icon="📄"
            title="Chưa có đề tài để matching"
            description="Khi có đề xuất trong hệ thống, bạn có thể chọn đề tài và xem gợi ý giảng viên tại đây."
          />
        </Card>
      ) : loadingMatches ? (
        <LoadingState message="Đang tải danh sách giảng viên phù hợp..." />
      ) : matches.length === 0 ? (
        <Card>
          <EmptyState
            icon="🎓"
            title="Chưa có gợi ý matching"
            description="Đề tài này chưa có dữ liệu matching demo. Hãy chọn đề tài khác để xem gợi ý."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((lecturer) => (
            <LecturerMatchCard
              key={lecturer.id}
              lecturer={lecturer}
              canRecommend={canRecommend}
              buttonLabel="Recommend this lecturer"
              loading={pendingLecturerId === lecturer.id}
              onRecommend={handleRecommend}
            />
          ))}
        </div>
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
