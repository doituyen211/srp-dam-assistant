"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STATUS_LABELS, FIELDS_OF_STUDY } from "@/lib/constants";

const statusFilters = [
  { value: "all", label: "All Statuses" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const fieldFilters = [
  { value: "all", label: "All Fields" },
  ...FIELDS_OF_STUDY.map((f) => ({ value: f, label: f })),
];

const urgencyOptions = [
  { value: "all", label: "Any Deadline" },
  { value: "urgent", label: "Urgent (< 7 days)" },
  { value: "soon", label: "Soon (7-30 days)" },
  { value: "normal", label: "Normal (> 30 days)" },
];

const riskOptions = [
  { value: "all", label: "Any Risk Level" },
  { value: "high", label: "High Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "low", label: "Low Risk" },
];

/**
 * ReviewQueueFilters — Filter bar for review queue
 */
export function ReviewQueueFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  fieldFilter,
  onFieldChange,
  urgencyFilter,
  onUrgencyChange,
  riskFilter,
  onRiskChange,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        label="Search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Title, student, keywords..."
      />
      <Select
        label="Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value || "all")}
        options={statusFilters}
      />
      <Select
        label="Field"
        value={fieldFilter}
        onChange={(e) => onFieldChange(e.target.value || "all")}
        options={fieldFilters}
      />
      <Select
        label="Deadline"
        value={urgencyFilter}
        onChange={(e) => onUrgencyChange(e.target.value || "all")}
        options={urgencyOptions}
      />
      <Select
        label="Risk"
        value={riskFilter}
        onChange={(e) => onRiskChange(e.target.value || "all")}
        options={riskOptions}
      />
    </div>
  );
}
