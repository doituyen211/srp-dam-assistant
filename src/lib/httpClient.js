/**
 * HTTP client with httpOnly cookie auth support.
 *
 * - Always sends credentials: "include"
 * - On 401, attempts POST /auth/refresh once, then retries the original request
 * - Uses _retry flag to prevent infinite refresh loops
 * - Never refreshes for auth endpoints (login, register, refresh, logout)
 * - Supports JSON and FormData payloads
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

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

export function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

// ─── API error ───

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.detail = data;
  }
}

// ─── Response parser ───

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
 * @param {string}  path           - Path relative to API_BASE_URL
 * @param {Object}  [opts]         - Standard fetch options
 * @param {boolean} [opts._retry]  - Internal flag to prevent infinite refresh loops
 * @returns {Promise<Response>}
 * @throws {ApiError}
 */
export async function apiFetch(path, opts = {}) {
  const headers = buildHeaders(opts);
  const isRetry = opts._retry === true;

  const doFetch = () =>
    fetch(buildUrl(path), {
      ...opts,
      credentials: "include",
      headers,
    });

  let response;

  try {
    response = await doFetch();
  } catch (err) {
    throw new ApiError(0, "Unable to connect to the server. Please check your connection and try again.", null);
  }

  // ── 401 refresh retry (only for non-auth paths, only once) ──
  if (response.status === 401 && shouldAttemptRefresh(path) && !isRetry) {
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
      data = await parseResponse(response.clone());
    } catch {
      data = null;
    }
    const message = normalizeError(response, data);
    throw new ApiError(response.status, message, data);
  }

  return response;
}
