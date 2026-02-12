/**
 * News Service
 * ------------
 * Service layer responsible for fetching news data from the Strapi API.
 *
 * Responsibilities:
 * - Build optimized API queries for different news use cases.
 * - Delegate HTTP requests to the apiFetch utility.
 * - Normalize API responses using dedicated normalizers.
 *
 * This layer:
 * - Does NOT handle UI concerns.
 * - Does NOT expose raw Strapi responses to the frontend.
 * - Acts as a single source of truth for news-related API access.
 */

import { apiFetch } from "./api";
import {
  normalizeNewsItem,
  normalizeNewsListItem,
  normalizeNewsResponse,
} from "../utils/news-normalizer";

/**
 * Fetch paginated list of news.
 *
 * Optimized for list views:
 * - Fetches only required fields.
 * - Uses first media item as cover image.
 * - Returns normalized list and pagination metadata.
 *
 * @param {Object} [options]
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.pageSize=5] - Number of items per page.
 * @returns {Promise<{ news: Array<Object>, pagination: Object }>}
 */
export async function getNews({ page = 1, pageSize = 5 } = {}) {
  const query = new URLSearchParams({
    "fields[0]": "title",
    "fields[1]": "slug",
    "fields[2]": "excerpt",
    "fields[3]": "published_date",
    "fields[4]": "category",
    "fields[5]": "region",

    "populate[media]": "true",
    "populate[author][fields][0]": "name",
    "populate[author][populate][avatar]": "true",

    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "published_date:desc",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  return normalizeNewsResponse(response);
}

/**
 * Fetch a single news item by slug.
 *
 * Used for detail pages:
 * - Fetches full content.
 * - Includes full media gallery and author avatar.
 *
 * @param {string} slug - Unique slug of the news item.
 * @returns {Promise<Object|null>} Normalized news item or null if not found.
 */
export async function getNewBySlug(slug) {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,

    "populate[media]": "true",
    "populate[author][populate][avatar]": "true",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  if (!response?.data?.length) {
    return null;
  }

  return normalizeNewsItem(response.data[0]);
}

/**
 * Fetch related news items.
 *
 * Criteria:
 * - Excludes the current news item by slug.
 * - Optionally filters by category.
 * - Limits the number of results.
 *
 * @param {Object} options
 * @param {Object|null} options.category - Category object ({ label, slug }).
 * @param {string} options.excludeSlug - Slug to exclude from results.
 * @param {number} [options.limit=3] - Maximum number of related items.
 * @returns {Promise<Array<Object>>} Array of normalized related news items.
 */
export async function getRelatedNews({
  category,
  excludeSlug,
  limit = 3,
}) {
  const query = new URLSearchParams({
    "filters[slug][$ne]": excludeSlug,

    ...(category && {
      "filters[category][$eq]": category.label,
    }),

    "pagination[pageSize]": limit,

    "fields[0]": "title",
    "fields[1]": "slug",
    "fields[2]": "category",

    "populate[media]": "true",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  if (!response?.data?.length) {
    return [];
  }
  
  return response.data.map(normalizeNewsListItem);
}

/**
 * Fetches a paginated list of news filtered by category.
 *
 * Requests only the required fields for news listings and includes
 * basic relations such as media and author.
 *
 * @async
 * @function getNewsByCategory
 *
 * @param {Object} options
 * @param {string} options.category - News category (Strapi Enum value).
 * @param {number} [options.page=1] - Current page number.
 * @param {number} [options.pageSize=5] - Items per page.
 *
 * @returns {Promise<Object>} Normalized response containing:
 * - `news`: Array of news items.
 * - `pagination`: Pagination metadata.
 */
export async function getNewsByCategory({ category, page = 1, pageSize = 5 }) {
  const params = {
    "fields[0]": "title",
    "fields[1]": "slug",
    "fields[2]": "excerpt",
    "fields[3]": "published_date",
    "fields[4]": "category",
    "fields[5]": "region",

    "populate[media]": "true",
    "populate[author][fields][0]": "name",
    "populate[author][populate][avatar]": "true",

    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "published_date:desc",
  };

  if (category) {
    params["filters[category][$eq]"] = category;
  }

  const query = new URLSearchParams(params);
  const response = await apiFetch(`/news?${query.toString()}`);

  return normalizeNewsResponse(response);
}