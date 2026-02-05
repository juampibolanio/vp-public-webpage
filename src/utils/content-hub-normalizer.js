/**
 * Content Hub Normalizer
 * ---------------------
 * Normalizes content hub data coming from Strapi API.
 */

const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env
  .PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize hub icon media.
 */
function normalizeHubIcon(media) {
  if (!media || !media.url) return null;

  return {
    url: PUBLIC_STRAPI_API_URL_IMAGES + media.url,
    alt: media.alternativeText || "",
    width: media.width || null,
    height: media.height || null,
  };
}

/**
 * Normalize a single content hub.
 */
export function normalizeContentHub(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    description: item.description,
    category: item.category,
    icon: normalizeHubIcon(item.icon),
  };
}

/**
 * Normalize a list of content hubs.
 */
export function normalizeContentHubList(response) {
  return response.data.map(normalizeContentHub);
}
