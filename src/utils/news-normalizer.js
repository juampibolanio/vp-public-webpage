/**
 * News Normalizer
 * ----------------
 * Utility functions to normalize news-related data coming from Strapi API.
 *
 * Responsibilities:
 * - Normalize media objects (single and gallery).
 * - Normalize author data.
 * - Normalize news items for list and detail views.
 * - Decouple frontend data structures from Strapi response format.
 *
 * Notes:
 * - All media URLs are prefixed with the public Strapi assets base URL.
 * - Defensive checks are applied to avoid runtime errors.
 */

const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize a single media object.
 *
 * @param {Object|null} media - Raw media object from Strapi.
 * @returns {Object|null} Normalized media object or null if invalid.
 */
function normalizeSingleMedia(media) {
  if (!media || !media.url) return null;

  const fullUrl = PUBLIC_STRAPI_API_URL_IMAGES + media.url;
  const mime = media.mime || "";

  const isVideo = mime.startsWith("video/");
  const isImage = mime.startsWith("image/");

  return {
    type: isVideo ? "video" : "image",
    provider: isVideo ? "file" : undefined,
    src: fullUrl,
    alt: media.alternativeText || "",
    mime,
    width: media.width || null,
    height: media.height || null,
    thumbnail:
      isImage && media.formats?.thumbnail
        ? PUBLIC_STRAPI_API_URL_IMAGES + media.formats.thumbnail.url
        : null,
  };
}

/**
 * Normalize an array of media items (image gallery).
 *
 * @param {Array} mediaArray - Array of raw media objects.
 * @returns {Array<Object>} Normalized media gallery.
 */
function normalizeMediaGallery(mediaArray) {
  if (!Array.isArray(mediaArray)) return [];

  return mediaArray
    .map(normalizeSingleMedia)
    .filter(Boolean);
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
    avatar: author.avatar
      ? normalizeSingleMedia(author.avatar)
      : null,
  };
}

/**
 * Normalize a full news item (used for detail view by slug).
 *
 * @param {Object} item - Raw news item from Strapi.
 * @returns {Object} Normalized news item.
 */
export function normalizeNewsItem(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content || null,
    content_html: item.content_html || null,
    category: item.category
      ? {
          label: item.category,
          slug: item.category.toLowerCase(),
        }
      : null,
    publishedDate: item.published_date,
    media: normalizeMediaGallery(item.media),
    author: normalizeAuthor(item.author),
  };
}

/**
 * Normalize a news item for list views.
 *
 * Optimized version:
 * - Uses only the first media item as cover image.
 * - Excludes full content.
 *
 * @param {Object} item - Raw news item from Strapi.
 * @returns {Object} Normalized news list item.
 */
export function normalizeNewsListItem(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    region: item.region,
    publishedDate: item.published_date,
    media: normalizeSingleMedia(item.media?.[0]),
    author: normalizeAuthor(item.author),
  };
}

/**
 * Normalize Strapi paginated news response.
 *
 * @param {Object} response - Raw Strapi API response.
 * @returns {Object} Normalized response with news list and pagination data.
 */
export function normalizeNewsResponse(response) {
  return {
    news: response.data.map(normalizeNewsListItem),
    pagination: response.meta.pagination,
  };
}
