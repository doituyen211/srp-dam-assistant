/**
 * Error tracking and logging utility
 * Currently a safe placeholder - can be replaced with Sentry or similar
 */

/**
 * Capture client error for debugging/monitoring
 * @param {Error} error
 * @param {Object} context additional context
 */
export function captureClientError(error, context = {}) {
  // Safe placeholder - no-op if no DSN configured
  // In production, can integrate with Sentry:
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }

  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[Client Error]", error, context);
  }
}

/**
 * Capture client message for analytics
 * @param {string} message
 * @param {Object} context additional context
 */
export function captureMessage(message, context = {}) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", message, context);
  }
}
