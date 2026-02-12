/**
 * Article Normalizer
 * ------------------
 * Utility functions to normalize article-related data coming from the Strapi API.
 *
 * Responsibilities:
 * - Normalize media objects and resolve public asset URLs.
 * - Normalize author data into a stable frontend-friendly shape.
 * - Normalize articles for both list (hub/card) and detail views.
 * - Decouple frontend data contracts from Strapi response structures.
 *
 * Notes:
 * - All media URLs are prefixed with the public Strapi assets base URL.
 * - Defensive checks are applied to avoid runtime errors.
 * - This module contains only pure functions.
 */

const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env
  .PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize a single media object.
 *
 * @param {Object|null} media - Raw media object from Strapi.
 * @returns {Object|null} Normalized media object or null if invalid.
 */
function normalizeSingleMedia(media) {
  if (!media || !media.url) return null;

  return {
    url: PUBLIC_STRAPI_API_URL_IMAGES + media.url,
    alt: media.alternativeText || "",
    width: media.width || null,
    height: media.height || null,
    mime: media.mime || null, // 👈 IMPORTANTE
    thumbnail: media.formats?.thumbnail
      ? PUBLIC_STRAPI_API_URL_IMAGES + media.formats.thumbnail.url
      : null,
  };
}


/**
 * Normalize author data.
 *
 * @param {Object|null} author - Raw author object from Strapi.
 * @returns {Object|null} Normalized author object or null.
 */
function normalizeAuthor(author) {
  if (!author) return null;

  return {
    name: author.name,
    avatar: author.avatar ? normalizeSingleMedia(author.avatar) : null,
  };
}

/**
 * Normalize an article for hub listing views (card-based layouts).
 *
 * Optimized representation:
 * - Excludes full content
 * - Uses only the first media item as cover image
 *
 * @param {Object} item - Raw article object from Strapi.
 * @returns {Object} Normalized article list item.
 */
export function normalizeArticleListItem(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    articleType: item.article_type,
    publishedDate: item.published_date,
    cover: normalizeSingleMedia(item.media?.[0]),
    author: normalizeAuthor(item.author),
  };
}

/**
 * Normalize a full article for detail pages.
 *
 * Complete representation:
 * - Includes full content blocks
 * - Includes all associated media assets
 * - Includes target audience metadata
 *
 * @param {Object} item - Raw article object from Strapi.
 * @returns {Object} Normalized article detail object.
 */
export function normalizeArticleDetail(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content || [],
    category: item.category,
    articleType: item.article_type,
    targetAudience: item.target_audience,
    publishedDate: item.published_date,
    media: Array.isArray(item.media)
      ? item.media.map(normalizeSingleMedia)
      : [],
    author: normalizeAuthor(item.author),
  };
}
