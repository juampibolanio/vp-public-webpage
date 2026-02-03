/**
 * formatDate
 * ----------
 * Formats a date string into a human-readable Spanish (Argentina) format.
 *
 * Output format:
 * - day (numeric)
 * - month (full name)
 * - year (numeric)
 *
 * Example:
 * - Input:  "2025-08-28"
 * - Output: "28 de agosto de 2025"
 *
 * @param {string} dateString - ISO date string or any valid Date-compatible string.
 * @returns {string} Formatted date string in `es-AR` locale.
 */
export function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
