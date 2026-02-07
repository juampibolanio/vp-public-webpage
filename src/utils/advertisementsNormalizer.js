/**
 * Media & Advertisement Normalizer
 * --------------------------------
 * Utility functions to normalize media assets and advertisement data
 * coming from the Strapi API.
 *
 * Responsibilities:
 * - Normalize media objects with format prioritization.
 * - Guarantee a usable image URL regardless of available formats.
 * - Normalize advertisement entities for frontend consumption.
 * - Normalize paginated advertisement responses.
 *
 * Notes:
 * - All media URLs are resolved using the public Strapi assets base URL.
 * - Media normalization prefers optimized formats when available.
 * - All functions are pure and side-effect free.
 */

const PUBLIC_STRAPI_API_URL_IMAGES =
  import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize a Strapi media object.
 *
 * Strategy:
 * - Prefer optimized formats in the following order:
 *   medium → large → small → thumbnail → original
 * - Always return a usable image URL for rendering.
 *
 * @param {Object|null} media - Raw media object from Strapi.
 * @returns {Object|null} Normalized media object or null if invalid.
 */
export function normalizeMedia(media) {
  if (!media || !media.url) return null;

  const formats = media.formats || {};

  const preferred =
    formats.medium ||
    formats.large ||
    formats.small ||
    formats.thumbnail ||
    null;

  return {
    url: PUBLIC_STRAPI_API_URL_IMAGES + (preferred?.url || media.url),
    originalUrl: PUBLIC_STRAPI_API_URL_IMAGES + media.url,
    alt: media.alternativeText || media.name || "",
    width: preferred?.width || media.width || null,
    height: preferred?.height || media.height || null,
    formats: {
      thumbnail: formats.thumbnail
        ? PUBLIC_STRAPI_API_URL_IMAGES + formats.thumbnail.url
        : null,
      small: formats.small
        ? PUBLIC_STRAPI_API_URL_IMAGES + formats.small.url
        : null,
      medium: formats.medium
        ? PUBLIC_STRAPI_API_URL_IMAGES + formats.medium.url
        : null,
      large: formats.large
        ? PUBLIC_STRAPI_API_URL_IMAGES + formats.large.url
        : null,
    },
  };
}

/**
 * Normalize an advertisement entity.
 *
 * Converts raw Strapi advertisement data into a stable
 * frontend-friendly structure.
 *
 * @param {Object} item - Raw advertisement object from Strapi.
 * @returns {Object} Normalized advertisement.
 */
export function normalizeAdvertisement(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    link: item.link,
    place: item.place,
    isActive: item.is_active,
    media: Array.isArray(item.media)
      ? normalizeMedia(item.media[0])
      : normalizeMedia(item.media),
  };
}

/**
 * Normalize a paginated Strapi advertisement response.
 *
 * @param {Object} response - Raw Strapi API response.
 * @returns {Object} Normalized response with advertisement list and pagination.
 */
export function normalizeAdvertisementResponse(response) {
  return {
    advertisements: response.data.map(normalizeAdvertisement),
    pagination: response.meta.pagination,
  };
}
