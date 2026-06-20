/**
 * HTTP client with httpOnly cookie auth support.
 *
 * - Always sends credentials: "include"
 * - On 401, attempts POST /auth/refresh once, then retries the original request
 * - Never refreshes for auth endpoints (login, register, refresh, logout)
 * - Supports JSON and FormData payloads
 * - No LocalStorage tokens, no Authorization header
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// ─── In-flight GET deduplication ───
// Prevents duplicate requests when React StrictMode double-renders
// or when multiple components fetch the same resource simultaneously.
const inflightRequests = new Map();

// ─── Refresh guard ───

let isRefreshing = false;
let refreshPromise = null;

const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

function shouldAttemptRefresh(url) {
  return !NO_REFRESH_PATHS.some((path) => url.startsWith(path));
}

async function attemptRefresh() {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
    });
  return refreshPromise;
}

// ─── URL builder ───

/**
 * Build a full URL from a relative path.
 * @param {string} path - e.g. "/auth/me"
 * @returns {string} e.g. "http://localhost:8000/api/v1/auth/me"
 */
export function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

// ─── API error ───

export class ApiError extends Error {
  /**
   * @param {number} status  - HTTP status code
   * @param {string} message - Human-readable message
   * @param {*}      [data]  - Optional parsed server error body
   */
  constructor(status, message, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.detail = data; // alias for backward compatibility
  }
}

// ─── Response parser ───

/**
 * Parse a fetch Response into a usable value.
 * - 204 No Content → null
 * - Content-Type includes json → parsed JSON
 * - everything else → text
 *
 * @param {Response} response
 * @returns {Promise<*>}
 */
export async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ─── Error normalizer ───

/**
 * Build a human-readable message from an HTTP error response.
 * Supports FastAPI-style { detail: "..." } and generic { message: "..." } shapes.
 *
 * @param {Response} response
 * @param {*}        [data] - Pre-parsed response body
 * @returns {string}
 */
export function normalizeError(response, data) {
  if (data) {
    return data.detail || data.message || data.error || JSON.stringify(data);
  }
  return response.statusText || "Request failed";
}

// ─── Build headers ───

function buildHeaders(options) {
  const body = options.body;
  const headers = { ...options.headers };

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  return headers;
}

// ─── Main fetch helper ───

/**
 * Make an authenticated API request.
 *
 * @param {string}  path           - Path relative to API_BASE_URL (e.g. "/auth/me")
 * @param {Object}  [opts]         - Standard fetch options
 * @param {number}  [opts.retry]   - Max retry count for transient errors (not 401 — that's handled automatically)
 * @returns {Promise<Response>}
 * @throws {ApiError}
 */
export async function apiFetch(path, opts = {}) {
  const headers = buildHeaders(opts);

  // ── Deduplicate concurrent identical GET requests ──
  const isGet = !opts.method || opts.method === "GET";
  const cacheKey = `${opts.method || "GET"}:${path}:${JSON.stringify(opts.body || null)}`;
  if (isGet && inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const doFetch = () =>
    fetch(buildUrl(path), {
      ...opts,
      credentials: "include",
      headers,
    });

  // Wrap the full fetch logic (including 401 retry) so it can be cached
  const execute = async () => {
    let response;

    try {
      response = await doFetch();
    } catch (err) {
      throw new ApiError(0, "Unable to connect to the server. Please check your connection and try again.", null);
    }

    // ── 401 refresh retry (only for non-auth paths) ──
    if (response.status === 401 && shouldAttemptRefresh(path)) {
      const refreshed = await attemptRefresh();
      if (refreshed) {
        try {
          response = await doFetch();
        } catch {
          throw new ApiError(0, "Unable to connect to the server. Please check your connection and try again.", null);
        }
      }
    }

    // ── Error handling ──
    if (!response.ok) {
      let data;
      try {
        data = await parseResponse(response);
      } catch {
        data = null;
      }
      const message = normalizeError(response, data);
      throw new ApiError(response.status, message, data);
    }

    return response;
  };

  // For GET requests, deduplicate concurrent identical calls
  if (isGet) {
    if (!inflightRequests.has(cacheKey)) {
      const promise = execute().finally(() => inflightRequests.delete(cacheKey));
      inflightRequests.set(cacheKey, promise);
    }
    return inflightRequests.get(cacheKey);
  }

  return execute();
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
