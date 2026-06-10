"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { FIELDS_OF_STUDY } from "@/lib/constants";

/**
 * ProposalForm - Form to create/edit proposal
 * @param {Object} props
 * @param {Object} props.initialData - Initial proposal data (optional)
 * @param {Function} props.onSubmit - Called with (formData, submitMode)
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 */
export function ProposalForm({
  initialData = {},
  onSubmit,
  loading = false,
  error = null,
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    field: initialData.field || "",
    problem: initialData.problem || "",
    objectives: initialData.objectives || "",
    methodology: initialData.methodology || "",
    feasibility: initialData.feasibility || "",
    expectedImpact: initialData.expectedImpact || "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Validate required fields
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Tiêu đề là bắt buộc";
    if (!formData.field) errors.field = "Lĩnh vực là bắt buộc";
    if (!formData.problem.trim())
      errors.problem = "Phát biểu vấn đề là bắt buộc";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (submitMode) => {
    if (!validateForm()) return;
    onSubmit(formData, submitMode);
  };

  const fieldOptions = FIELDS_OF_STUDY.map((field) => ({
    value: field,
    label: field,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData.id ? "Chỉnh sửa đề tài" : "Tạo đề tài mới"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <Alert type="error">{error}</Alert>}

        {/* Title */}
        <Input
          label="Tiêu đề đề tài"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={validationErrors.title}
          placeholder="Nhập tiêu đề đề tài..."
          required
        />

        {/* Field */}
        <Select
          label="Lĩnh vực nghiên cứu"
          name="field"
          value={formData.field}
          onChange={handleChange}
          error={validationErrors.field}
          options={fieldOptions}
          required
        />

        {/* Problem */}
        <Textarea
          label="Phát biểu vấn đề"
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          error={validationErrors.problem}
          placeholder="Mô tả vấn đề cần giải quyết..."
          rows={4}
          required
        />

        {/* Objectives */}
        <Textarea
          label="Mục tiêu"
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          placeholder="Các mục tiêu của đề tài..."
          rows={4}
        />

        {/* Methodology */}
        <Textarea
          label="Phương pháp nghiên cứu"
          name="methodology"
          value={formData.methodology}
          onChange={handleChange}
          placeholder="Phương pháp, công cụ, cách tiếp cận..."
          rows={4}
        />

        {/* Feasibility */}
        <Textarea
          label="Tính khả thi"
          name="feasibility"
          value={formData.feasibility}
          onChange={handleChange}
          placeholder="Đánh giá tính khả thi, nguồn lực, thời gian..."
          rows={3}
        />

        {/* Expected Impact */}
        <Textarea
          label="Kết quả kỳ vọng"
          name="expectedImpact"
          value={formData.expectedImpact}
          onChange={handleChange}
          placeholder="Đầu ra, tác động dự kiến..."
          rows={3}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => handleSubmit("draft")}
            loading={loading}
            disabled={loading}
          >
            Lưu nháp
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit("submit")}
            loading={loading}
            disabled={loading}
          >
            Gửi đề tài
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
