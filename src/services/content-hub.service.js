/**
 * Content Hub Service
 * -------------------
 * Service layer responsible for retrieving content hub data
 * from the Strapi API.
 *
 * Responsibilities:
 * - Fetch content hubs filtered by category.
 * - Fetch a single content hub by slug.
 * - Ensure required relations (icons) are populated.
 * - Return only normalized data structures to the frontend.
 *
 * Notes:
 * - Results are sorted alphabetically by title when applicable.
 * - This service does not expose raw Strapi responses.
 */

import { apiFetch } from "./api";
import {
  normalizeContentHubList,
  normalizeContentHub,
} from "../utils/content-hub-normalizer";

/**
 * Retrieve content hubs filtered by category.
 *
 * @param {string} category - Content hub category identifier.
 * @returns {Promise<Object>} Normalized list of content hubs.
 */
export async function getContentHubsByCategory(category) {
  const response = await apiFetch(
    `/content-hubs?filters[category][$eq]=${category}&populate=icon&sort=title:asc`,
  );

  return normalizeContentHubList(response);
}

/**
 * Retrieve a single content hub by its slug.
 *
 * @param {string} slug - Content hub slug.
 * @returns {Promise<Object|null>} Normalized content hub or null if not found.
 */
export async function getContentHubBySlug(slug) {
  const response = await apiFetch(
    `/content-hubs?filters[slug][$eq]=${slug}&populate[icon]=true`,
  );

  const hub = response.data?.[0];
  if (!hub) return null;

  return normalizeContentHub(hub);
}
