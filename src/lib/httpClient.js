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
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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

// ─── API error ───

export class ApiError extends Error {
  /**
   * @param {number} status  - HTTP status code
   * @param {string} message - Human-readable message
   * @param {*}      [detail] - Optional parsed server error body
   */
  constructor(status, message, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

// ─── Build headers ───

function buildHeaders(options) {
  const body = options.body;
  const headers = { ...options.headers };

  // If the body is FormData, let the browser set Content-Type (includes boundary)
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  return headers;
}

// ─── Main fetch helper ───

/**
 * @param {string}  url     - Path relative to API_BASE_URL (e.g. "/auth/me")
 * @param {Object}  [opts]  - Standard fetch options
 * @param {string}  [opts.method]
 * @param {Object|FormData} [opts.body]
 * @param {Object}  [opts.headers]
 * @returns {Promise<Response>}
 * @throws {ApiError} On non-2xx responses (with parsed server detail when possible)
 */
export async function apiFetch(url, opts = {}) {
  const headers = buildHeaders(opts);

  const doFetch = () =>
    fetch(`${API_BASE_URL}${url}`, {
      ...opts,
      credentials: "include",
      headers,
    });

  let response = await doFetch();

  // ── 401 refresh retry (only for non-auth paths) ──
  if (response.status === 401 && shouldAttemptRefresh(url)) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      response = await doFetch();
    }
  }

  // ── Error handling ──
  if (!response.ok) {
    let detail;
    try {
      detail = await response.clone().json();
    } catch {
      // response body is not JSON — that's fine
    }
    const message =
      detail?.detail || detail?.message || response.statusText || "Request failed";
    throw new ApiError(response.status, message, detail);
  }

  return response;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
