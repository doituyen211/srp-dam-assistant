"use client";

import { useEffect, useState } from "react";

const ACADEMIC_MESSAGES = {
  default: ["Loading data..."],
  ai: [
    "Analyzing proposal structure",
    "Checking rubric alignment",
    "Reviewing feasibility signals",
    "Preparing advisory feedback",
  ],
  matching: [
    "Analyzing lecturer expertise profiles",
    "Computing topic similarity scores",
    "Evaluating supervision capacity",
    "Preparing match recommendations",
  ],
  review: [
    "Loading proposal queue",
    "Preparing rubric criteria",
    "Organizing review data",
  ],
  dashboard: [
    "Gathering workflow statistics",
    "Computing pipeline metrics",
    "Preparing dashboard overview",
  ],
};

const ROTATION_INTERVAL = 2500;

function getMessages(variant) {
  return ACADEMIC_MESSAGES[variant] || ACADEMIC_MESSAGES.default;
}

/**
 * LoadingState — with rotating academic messages for different contexts
 */
export function LoadingState({
  message,
  variant = "default",
  className = "",
}) {
  const messages = getMessages(variant);
  const initial = message || messages[0];
  const [displayMessage, setDisplayMessage] = useState(initial);

  useEffect(() => {
    if (message || messages.length <= 1) return;
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % messages.length;
      setDisplayMessage(messages[index]);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [message, variant]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8 animate-spin text-primary"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-sm font-medium text-body-muted">
        {displayMessage}
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
