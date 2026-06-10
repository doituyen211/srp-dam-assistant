"use client";

import { useState, useCallback } from "react";
import { captureClientError } from "@/lib/sentry";

/**
 * useAsyncAction - Helper hook for managing async operations
 * Tracks loading state, error, and execution
 *
 * @param {Function} asyncFn async function to execute
 * @param {Object} options error handling options
 * @returns {Object} { execute, loading, error, reset }
 */
export const useAsyncAction = (asyncFn, options = {}) => {
  const { onError = null, throwError = true } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute the async function
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        const errorMessage = err.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

        setError(errorMessage);
        captureClientError(err, { context: "async_action_error" });

        if (onError) {
          onError(errorMessage);
        }

        if (throwError) {
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, onError, throwError],
  );

  /**
   * Reset error state
   */
  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    reset,
  };
};
