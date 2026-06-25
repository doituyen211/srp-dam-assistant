export const mockReviewQueue = [
  { id: "prop-001", title: "Queue Proposal", studentName: "Student A", status: "submitted", readinessScore: 7.5, researchField: "AI" },
];

export const mockRubricReview = {
  id: "rubric-001",
  proposalId: "prop-001",
  reviewer: "Reviewer B",
  totalScore: 8.0,
  total_score: 8.0,
  criteria: [
    { id: "problem_clarity", name: "Problem Clarity", label: "Problem Clarity", score: 8, maxScore: 10, max_score: 10, aiObservation: "Clear", reviewerComment: "Well defined" },
    { id: "methodology_fit", name: "Methodology Fit", label: "Methodology Fit", score: 7, maxScore: 10, max_score: 10, aiObservation: "Adequate", reviewerComment: "Could be stronger" },
  ],
  comments: "Good overall proposal.",
};
