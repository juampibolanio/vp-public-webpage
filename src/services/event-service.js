/**
 * Event Service
 * -------------
 * Service layer responsible for retrieving event / training data
 * from the Strapi API.
 *
 * Responsibilities:
 * - Fetch paginated events.
 * - Fetch a single event by slug.
 * - Populate media and author relations.
 * - Return only normalized data structures.
 */

import { apiFetch } from "./api";
import {
  normalizeEventListItem,
  normalizeEventDetail,
} from "../utils/event-normalizer";

/**
 * Retrieve paginated events.
 *
 * @param {Object} options - Pagination options.
 * @param {number} options.page - Current page number.
 * @param {number} options.pageSize - Number of items per page.
 * @returns {Promise<Object>} Normalized events and pagination data.
 */
export async function getEvents({ page = 1, pageSize = 10 } = {}) {
  const response = await apiFetch(
    `/events` +
      `?populate[media]=true` +
      `&populate[author]=true` +
      `&sort=start_date:asc` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}`,
  );

  return {
    events: response.data.map(normalizeEventListItem),
    pagination: response.meta.pagination,
  };
}

/**
 * Retrieve a single event by its slug.
 *
 * @param {string} slug - Event slug.
 * @returns {Promise<Object|null>} Normalized event detail or null if not found.
 */
export async function getEventBySlug(slug) {
  const response = await apiFetch(
    `/events` +
      `?filters[slug][$eq]=${slug}` +
      `&populate[media]=true` +
      `&populate[author]=true`,
  );

  const event = response.data?.[0];
  if (!event) return null;

  return normalizeEventDetail(event);
}
