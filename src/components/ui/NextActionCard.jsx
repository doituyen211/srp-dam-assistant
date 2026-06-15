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
            title: "Gửi đề tài để xét duyệt",
            description: "Hoàn thiện mục tiêu, phương pháp và tính khả thi, sau đó gửi đề tài để hội đồng bắt đầu đánh giá.",
            actionLabel: "Gửi đề tài",
            actionType: "submit",
            urgency: "medium",
            owner: "reviewer",
          };
        }
        break;

      case "submitted":
        if (userRole === "reviewer") {
          return {
            title: "Bắt đầu đánh giá",
            description: "Xem xét đề tài, sử dụng rubric để đánh giá tính mới lạ, khả thi, ứng dụng thực tế, kỹ thuật và trình bày.",
            actionLabel: "Đánh giá ngay",
            actionType: "review",
            urgency: "high",
            owner: "reviewer",
          };
        }
        break;

      case "under_review":
        if (userRole === "reviewer") {
          return {
            title: "Đưa ra quyết định",
            description: "Dựa trên rubric và phản hồi AI, quyết định phê duyệt hoặc yêu cầu chỉnh sửa.",
            actionLabel: "Quyết định",
            actionType: "decide",
            urgency: "high",
            owner: "reviewer",
          };
        }
        if (userRole === "student") {
          return {
            title: "Xem xét phản hồi",
            description: "Kiểm tra nhận xét từ reviewer, chuẩn bị chỉnh sửa nếu cần thiết.",
            actionLabel: "Xem phản hồi",
            actionType: "view_feedback",
            urgency: "medium",
            owner: "student",
          };
        }
        break;

      case "needs_revision":
        if (userRole === "student") {
          return {
            title: "Chỉnh sửa đề tài",
            description: "Cập nhật mục tiêu, phương pháp, tính khả thi và giải quyết các vấn đề được chỉ ra.",
            actionLabel: "Chỉnh sửa ngay",
            actionType: "edit",
            urgency: "high",
            owner: "student",
          };
        }
        break;

      case "approved":
        if (userRole === "lecturer") {
          return {
            title: "Phân công hướng dẫn",
            description: "Chọn giảng viên hướng dẫn phù hợp dựa trên chuyên môn và tải hướng dẫn hiện tại.",
            actionLabel: "Phân công ngay",
            actionType: "assign_lecturer",
            urgency: "medium",
            owner: "lecturer",
          };
        }
        break;

      case "rejected":
        if (userRole === "student") {
          return {
            title: "Xem xét lý do rejection",
            description: "Hiểu các điểm yếu được chỉ ra và cân nhắc chỉnh sửa đề tài để gửi lại.",
            actionLabel: "Xem chi tiết",
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
            Không có hành động tiếp theo được yêu cầu cho vai trò này ở trạng thái này.
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
      high: "Ưu tiên cao",
      medium: "Ưu tiên trung bình",
      low: "Ưu tiên thấp",
    };
    return labels[urgency] || urgency;
  };

  return (
    <Card className="border-l-4 border-l-action-blue">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base">Hành động tiếp theo</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                intent="info"
                className="text-xs"
              >
                Người sở hữu: {nextAction.owner}
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
            <div className="text-xs text-muted">Thông tin đề tài</div>
            <div className="mt-1 flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted">Tiêu đề:</span> {proposal.title}
              </div>
              <div>
                <span className="text-muted">Lĩnh vực:</span> {proposal.field}
              </div>
              <div>
                <span className="text-muted">Điểm AI:</span> {proposal.aiScore}/10
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
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
