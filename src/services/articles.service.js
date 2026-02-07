/**
 * Article Service
 * ---------------
 * Service layer responsible for retrieving article data
 * from the Strapi API.
 *
 * Responsibilities:
 * - Fetch articles filtered by hub slug with pagination support.
 * - Fetch a single article by slug.
 * - Ensure media and author relations are populated.
 * - Return only normalized data structures to the frontend.
 *
 * Notes:
 * - Articles are sorted by publication date (descending).
 * - This service does not expose raw Strapi responses.
 */

import { apiFetch } from "./api";
import {
  normalizeArticleDetail,
  normalizeArticleListItem,
} from "../utils/article-normalizer";

/**
 * Retrieve paginated articles belonging to a specific hub.
 *
 * @param {string} hubSlug - Slug of the content hub.
 * @param {Object} options - Pagination options.
 * @param {number} options.page - Current page number.
 * @param {number} options.pageSize - Number of items per page.
 * @returns {Promise<Object>} Normalized articles and pagination data.
 */
export async function getArticlesByHubSlug(
  hubSlug,
  { page = 1, pageSize = 10 } = {},
) {
  const response = await apiFetch(
    `/articles` +
      `?filters[hub][slug][$eq]=${hubSlug}` +
      `&populate[media]=true` +
      `&populate[author][populate][avatar]=true` +
      `&sort=published_date:desc` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}`,
  );

  return {
    articles: response.data.map(normalizeArticleListItem),
    pagination: response.meta.pagination,
  };
}

/**
 * Retrieve a single article by its slug.
 *
 * @param {string} slug - Article slug.
 * @returns {Promise<Object|null>} Normalized article detail or null if not found.
 */
export async function getArticleBySlug(slug) {
  const response = await apiFetch(
    `/articles` +
      `?filters[slug][$eq]=${slug}` +
      `&populate[media]=true` +
      `&populate[author][populate][avatar]=true`,
  );

  const article = response.data?.[0];
  if (!article) return null;

  return normalizeArticleDetail(article);
}
