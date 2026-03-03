/**
 * API Fetch Utility
 * -----------------
 * Centralized HTTP helper for communicating with the Strapi API.
 *
 * Responsibilities:
 * - Prefix all requests with the base API URL.
 * - Apply default headers.
 * - Handle basic HTTP error checking.
 *
 * This utility:
 * - Does NOT normalize responses.
 * - Does NOT handle authentication.
 * - Returns parsed JSON responses.
 */

const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;

/**
 * Perform an HTTP request against the Strapi API.
 *
 * @param {string} endpoint - API endpoint (relative to base URL).
 * @param {RequestInit} [options={}] - Fetch options (method, body, headers, etc.).
 * @returns {Promise<any>} Parsed JSON response.
 * @throws {Error} When the HTTP response is not OK.
 */
export async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    console.error("API error:", response.status);
    throw new Error(`Error fetching data: ${response.status}`);
  }

  return response.json();
}