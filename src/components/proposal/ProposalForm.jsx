"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import {
  FIELDS_OF_STUDY,
  SECTION_TYPES,
} from "@/lib/constants";

const SECTION_MIN_LENGTHS = {
  abstract: 50,
  problem: 50,
  question: 30,
  objectives: 30,
  literature: 50,
  methodology: 50,
  feasibility: 30,
  contribution: 30,
  ethics: 20,
  references: 20,
};

const SECTION_PLACEHOLDERS = {
  abstract: "Summarize your research: problem, methodology, expected outcomes...",
  problem: "Describe the real-world context, research gap, and why this matters...",
  question: "List 2-4 specific, measurable research questions...",
  objectives: "List 2-4 specific objectives. Each should start with an action verb (Analyze, Build, Evaluate)...",
  literature: "Review key prior work. Identify gaps your research fills. Include recent (5-year) sources...",
  methodology: "Describe your theoretical framework, tools, data sources, experimental process, and evaluation methods...",
  feasibility: "Assess data availability, technology readiness, timeline, resources, and potential risks...",
  contribution: "Describe expected outputs (paper, product, dataset) and academic/societal impact...",
  ethics: "Address privacy, consent, data protection, and any ethical approval needed...",
  references: "List references in proper academic format...",
};

function SectionField({ id, label, value, onChange, error, required }) {
  const minLength = SECTION_MIN_LENGTHS[id] || 0;
  const placeholder = SECTION_PLACEHOLDERS[id] || "";
  const charCount = value.length;
  const isBelowMin = charCount > 0 && charCount < minLength;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <label className="text-sm font-medium text-ink" htmlFor={id}>
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
        <span
          className={`font-mono text-xs ${
            isBelowMin
              ? "text-warning"
              : charCount >= minLength
                ? "text-success"
                : "text-muted"
          }`}
        >
          {charCount}
          {minLength > 0 && (
            <>
              {" / "}
              {minLength}
            </>
          )}
        </span>
      </div>

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        required={required}
        className="min-h-[120px] w-full resize-y rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-subdued disabled:text-muted"
      />

      {id === "title" && value.length >= 3 && (
        <div className="rounded border border-info/20 bg-info-bg px-3 py-2">
          <p className="text-xs text-info">
            <strong>Quick check:</strong> {value.split(" ").length} words.{" "}
            {value.length < 30
              ? "Consider adding more context about scope and method."
              : value.length > 150
                ? "Title may be long — consider shortening."
                : "Good title length."}
          </p>
        </div>
      )}

      {error && <span className="text-xs text-danger">{error}</span>}
      {isBelowMin && (
        <span className="text-xs text-warning">
          Add {minLength - charCount} more characters to meet minimum.
        </span>
      )}

      {minLength > 0 && !error && !isBelowMin && (
        <div className="rounded bg-subdued/50 px-3 py-1.5">
          <p className="text-xs leading-5 text-body-muted">
            {placeholder}
          </p>
        </div>
      )}
    </div>
  );
}

export function ProposalForm({
  initialData = {},
  onSubmit,
  loading = false,
  error = null,
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    researchField: initialData.researchField || initialData.field || "",
    abstract: initialData.abstract || "",
    problem: initialData.problem || "",
    question: initialData.question || "",
    objectives: initialData.objectives || "",
    literature: initialData.literature || "",
    methodology: initialData.methodology || "",
    feasibility: initialData.feasibility || "",
    contribution: initialData.contribution || initialData.expectedImpact || "",
    ethics: initialData.ethics || "",
    references: initialData.references || "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const requiredFields = SECTION_TYPES.filter((s) => s.required).map((s) => s.id);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    else if (formData.title.trim().length < 10)
      errors.title = "Title must be at least 10 characters";
    if (!formData.researchField) errors.researchField = "Research field is required";
    if (!formData.abstract.trim()) errors.abstract = "Abstract is required";
    else if (formData.abstract.trim().length < 50)
      errors.abstract = "Abstract must be at least 50 characters";
    if (!formData.problem.trim()) errors.problem = "Problem statement is required";
    else if (formData.problem.trim().length < 50)
      errors.problem = "Problem statement must be at least 50 characters";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (submitMode) => {
    if (!validateForm()) return;
    onSubmit(formData, submitMode);
  };

  const fieldOptions = FIELDS_OF_STUDY.map((f) => ({ value: f, label: f }));

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Left: section navigation */}
      <div className="hidden lg:block">
        <div className="sticky top-20 space-y-1 rounded border border-hairline bg-canvas p-3 shadow-card">
          <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
            Sections
          </p>
          {SECTION_TYPES.map((sectionDef) => {
            const value = formData[sectionDef.id];
            const hasContent = value?.trim().length > 0;
            return (
              <a
                key={sectionDef.id}
                href={`#section-${sectionDef.id}`}
                className="flex items-center gap-2 rounded px-3 py-1.5 text-xs text-body-muted transition-colors hover:bg-subdued hover:text-ink"
              >
                <span
                  className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                    hasContent ? "bg-success" : "bg-muted"
                  }`}
                />
                <span className="truncate">{sectionDef.label}</span>
                {sectionDef.required && (
                  <span className="ml-auto text-danger">*</span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Right: main form content */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              {initialData.id ? "Edit Proposal" : "New Research Proposal"}
            </CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Complete all required sections. Each section includes guidance and
              minimum length requirements to help you write a strong proposal.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-7">
          {error && <Alert type="error">{error}</Alert>}

          {!initialData.id && (
            <Alert type="info" title="Academic Guidance">
              A strong proposal answers: (1) <strong>Why</strong> is this
              important? (2) <strong>What</strong> do you aim to achieve? (3)
              <strong> How</strong> will you do it? (4){" "}
              <strong>Is it feasible</strong>? Write clearly and cite relevant
              literature.
            </Alert>
          )}

          {/* Meta fields */}
          <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]" id="section-title">
            <SectionField
              id="title"
              label="Proposal Title"
              value={formData.title}
              onChange={handleChange}
              error={validationErrors.title}
              required
            />

            <Select
              label="Research Field"
              name="researchField"
              value={formData.researchField}
              onChange={handleChange}
              error={validationErrors.researchField}
              options={fieldOptions}
              required
            />
          </div>

          {/* Core academic sections */}
          <div className="space-y-6">
            <div className="border-b border-card-border pb-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                Research Proposal Body
              </p>
            </div>

            {SECTION_TYPES.filter((s) => s.id !== "title").map((sectionDef) => (
              <div key={sectionDef.id} id={`section-${sectionDef.id}`}>
                <SectionField
                  id={sectionDef.id}
                  label={sectionDef.label}
                  value={formData[sectionDef.id] || ""}
                  onChange={handleChange}
                  error={validationErrors[sectionDef.id]}
                  required={sectionDef.required}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => handleSubmit("draft")}
              loading={loading}
              disabled={loading}
              className="sm:min-w-32"
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit("submit")}
              loading={loading}
              disabled={loading}
              className="sm:min-w-36"
            >
              Submit Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
