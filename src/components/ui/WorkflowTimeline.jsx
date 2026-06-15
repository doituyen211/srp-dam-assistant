"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WORKFLOW_STAGES, WORKFLOW_TRANSITIONS, WORKFLOW_ROLES } from "@/lib/constants";

/**
 * WorkflowTimeline - Visualizes academic workflow stages
 * @param {Object} props
 * @param {string} props.currentStatus - Current proposal status
 * @param {string} props.userRole - Current user role
 * @param {Array} props.milestones - Array of milestone objects
 */
export function WorkflowTimeline({
  currentStatus = "draft",
  userRole = "student",
  milestones = [],
}) {
  const getStageByStatus = (status) => {
    return WORKFLOW_STAGES.find((stage) => stage.status === status);
  };

  const currentStage = getStageByStatus(currentStatus);
  const currentStageOrder = currentStage?.order || 0;

  const getStatusColor = (stage) => {
    const stageColorMap = {
      draft: "slate",
      submitted: "blue",
      under_review: "amber",
      needs_revision: "orange",
      approved: "green",
      rejected: "red",
    };
    return stageColorMap[stage.status] || "default";
  };

  const getStatusIntent = (stage) => {
    const intentMap = {
      draft: "default",
      submitted: "info",
      under_review: "warning",
      needs_revision: "warning",
      approved: "success",
      rejected: "danger",
    };
    return intentMap[stage.status] || "default";
  };

  const getRoleBadgeColor = (role) => {
    const roleColorMap = {
      student: "slate",
      reviewer: "blue",
      admin: "purple",
      lecturer: "green",
    };
    return roleColorMap[role] || "default";
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      student: "Sinh viên",
      reviewer: "Reviewer",
      admin: "Admin",
      lecturer: "Giảng viên",
    };
    return roleLabels[role] || role;
  };

  const getNextPossibleStatuses = (currentStatus) => {
    return WORKFLOW_TRANSITIONS[currentStatus] || [];
  };

  const getNextOwnerRole = (status) => {
    return WORKFLOW_ROLES[status] || null;
  };

  const getMilestoneForStatus = (status) => {
    return milestones.find((m) => m.status === status);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Workflow Timeline</CardTitle>
        <p className="mt-1 text-sm text-body-muted">
          Luồng công việc học thuật từ bản nháp đến hoàn thành
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-hairline" />

          <div className="space-y-8">
            {WORKFLOW_STAGES.map((stage, index) => {
              const isCompleted = stage.order < currentStageOrder;
              const isCurrent = stage.status === currentStatus;
              const isUpcoming = stage.order > currentStageOrder;
              const milestone = getMilestoneForStatus(stage.status);
              const nextOwner = getNextOwnerRole(stage.status);
              const nextStatuses = getNextPossibleStatuses(stage.status);

              return (
                <div
                  key={stage.status}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="absolute left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-canvas bg-white">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isCompleted
                          ? "bg-success"
                          : isCurrent
                            ? "bg-action-blue"
                            : "bg-muted"
                      }`}
                    />
                  </div>

                  <div
                    className={`w-5/12 ${index % 2 === 0 ? "pr-6" : "pl-6"} ${index % 2 === 0 ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`rounded-lg border p-4 transition-all duration-200 ${isCurrent
                          ? "border-action-blue bg-pale-blue shadow-md"
                          : isCompleted
                            ? "border-hairline bg-canvas"
                            : "border-hairline bg-soft-stone/30 opacity-60"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-sm font-medium ${isCurrent
                              ? "text-action-blue"
                              : isCompleted
                                ? "text-ink"
                                : "text-body-muted"
                            }`}
                        >
                          {stage.label}
                        </h3>
                        <Badge
                          intent={getStatusIntent(stage)}
                          className="text-xs"
                        >
                          {stage.status.toUpperCase()}
                        </Badge>
                      </div>

                      {milestone && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">Tiến độ</span>
                            <span className="font-medium text-ink">
                              {milestone.progress || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft-stone">
                            <div
                              className="h-full rounded-full bg-action-blue transition-all"
                              style={{ width: `${milestone.progress || 0}%` }}
                            />
                          </div>
                          {milestone.dueDate && (
                            <div className="text-xs text-muted">
                              Hạn: {new Date(milestone.dueDate).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                        </div>
                      )}

                      {nextOwner && (
                        <div className="mt-3 rounded-lg bg-soft-stone/50 p-2">
                          <div className="text-xs text-muted">Người sở hữu tiếp theo</div>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              intent={getRoleBadgeColor(nextOwner)}
                              className="text-xs"
                            >
                              {getRoleLabel(nextOwner)}
                            </Badge>
                            <span className="text-xs text-body-muted">
                              Quyết định tiếp theo
                            </span>
                          </div>
                        </div>
                      )}

                      {nextStatuses.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs text-muted">Có thể chuyển đến</div>
                          <div className="flex flex-wrap gap-1">
                            {nextStatuses.map((nextStatus) => {
                              const nextStage = getStageByStatus(nextStatus);
                              return (
                                <Badge
                                  key={nextStatus}
                                  intent={getStatusIntent(nextStage)}
                                  className="text-xs"
                                >
                                  {nextStage?.label}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
