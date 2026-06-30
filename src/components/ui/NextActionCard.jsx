"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WORKFLOW_ROLES } from "@/lib/constants";

/**
 * NextActionCard - Shows what the user should do next in the workflow
 * @param {Object} props
 * @param {string} props.currentStatus - Current proposal status
 * @param {string} props.userRole - Current user role
 * @param {Function} props.onAction - Called when user takes action
 * @param {Object} props.proposal - Proposal data
 */
export function NextActionCard({
  currentStatus,
  userRole,
  onAction,
  proposal,
}) {
  const getNextAction = () => {
    switch (currentStatus) {
      case "draft":
        if (userRole === "student") {
          return {
            title: "Submit proposal for review",
            description: "Complete the objectives, methods, and feasibility, then submit the proposal for the committee to begin evaluation.",
            actionLabel: "Submit proposal",
            actionType: "submit",
            urgency: "medium",
            owner: "reviewer",
          };
        }
        break;

      case "submitted":
        if (userRole === "reviewer") {
          return {
            title: "Begin evaluation",
            description: "Review the proposal, use the rubric to evaluate novelty, feasibility, practical application, technique, and presentation.",
            actionLabel: "Review now",
            actionType: "review",
            urgency: "high",
            owner: "reviewer",
          };
        }
        break;

      case "under_review":
        if (userRole === "reviewer") {
          return {
            title: "Make a decision",
            description: "Based on the rubric and AI feedback, decide to approve or request revision.",
            actionLabel: "Decide",
            actionType: "decide",
            urgency: "high",
            owner: "reviewer",
          };
        }
        if (userRole === "student") {
          return {
            title: "Review feedback",
            description: "Check reviewer comments, prepare revisions if needed.",
            actionLabel: "View feedback",
            actionType: "view_feedback",
            urgency: "medium",
            owner: "student",
          };
        }
        break;

      case "needs_revision":
        if (userRole === "student") {
          return {
            title: "Revise proposal",
            description: "Update objectives, methods, feasibility and address the issues identified.",
            actionLabel: "Revise now",
            actionType: "edit",
            urgency: "high",
            owner: "student",
          };
        }
        break;

      case "approved":
        if (userRole === "lecturer") {
          return {
            title: "Assign supervisor",
            description: "Select an appropriate supervisor based on expertise and current advising load.",
            actionLabel: "Assign now",
            actionType: "assign_lecturer",
            urgency: "medium",
            owner: "lecturer",
          };
        }
        break;

      case "rejected":
        if (userRole === "student") {
          return {
            title: "Review rejection reasons",
            description: "Understand the identified weaknesses and consider revising the proposal for resubmission.",
            actionLabel: "View details",
            actionType: "view_details",
            urgency: "low",
            owner: "student",
          };
        }
        break;

      default:
        return null;
    }

    return null;
  };

  const nextAction = getNextAction();

  if (!nextAction) {
    return (
      <Card className="border-dashed border-2 border-hairline bg-soft-stone/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-body-muted">
            No next action required for this role in this state.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: "bg-error/10 border-error/30 text-error",
      medium: "bg-warning/10 border-warning/30 text-warning",
      low: "bg-info/10 border-info/30 text-action-blue",
    };
    return colors[urgency] || colors.low;
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      high: "High priority",
      medium: "Medium priority",
      low: "Low priority",
    };
    return labels[urgency] || urgency;
  };

  return (
    <Card className="border-l-4 border-l-action-blue">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base">Next Action</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                intent="info"
                className="text-xs"
              >
                Owner: {nextAction.owner}
              </Badge>
              <Badge
                intent={nextAction.urgency === "high" ? "danger" : nextAction.urgency === "medium" ? "warning" : "info"}
                className="text-xs"
              >
                {getUrgencyLabel(nextAction.urgency)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-ink">{nextAction.title}</h3>
          <p className="mt-1 text-sm leading-6 text-body-muted">
            {nextAction.description}
          </p>
        </div>

        {proposal && (
          <div className="rounded-lg bg-soft-stone/50 p-3">
            <div className="text-xs text-muted">Proposal info</div>
            <div className="mt-1 flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted">Title:</span> {proposal.title}
              </div>
              <div>
                <span className="text-muted">Field:</span> {proposal.field}
              </div>
              <div>
                <span className="text-muted">AI Score:</span> {proposal.aiScore}/10
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => onAction && onAction(nextAction.actionType, proposal?.id)}
          >
            {nextAction.actionLabel}
          </Button>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => onAction && onAction("view_details", proposal?.id)}
          >
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
