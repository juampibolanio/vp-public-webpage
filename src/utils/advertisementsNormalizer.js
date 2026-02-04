const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize a Strapi media object.
 *
 * Strategy:
 * - Prefer `medium` → `large` → `small` → `thumbnail` → original
 * - Always return a usable image URL
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
            : normalizeMedia(item.media)
    }
}

export function normalizeAdvertisementResponse(response) {
    return {
        advertisements: response.data.map(normalizeAdvertisement),
        pagination: response.meta.pagination,
    };
}