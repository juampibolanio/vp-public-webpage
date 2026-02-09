import { formatDate } from "./date";

const PUBLIC_STRAPI_API_URL_IMAGES =
  import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Normalize media (single or multiple).
 * Strapi v5 returns media as an object or an array.
 */
function normalizeMedia(media) {
  if (!media) return [];

  const items = Array.isArray(media) ? media : [media];

  return items.map((item) => ({
    url: PUBLIC_STRAPI_API_URL_IMAGES + item.url,
    alt: item.alternativeText || "",
    width: item.width ?? null,
    height: item.height ?? null,
  }));
}

/**
 * Normalize event for list views (cards, grids, pagination).
 */
export function normalizeEventListItem(event) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventType: event.event_type,
    modality: event.modality,
    startDate: event.start_date ? formatDate(event.start_date) : null,
    endDate: event.end_date ? formatDate(event.end_date) : null,
    location: event.location,
    organizer: event.organizer,
    targetAudience: event.target_audience,
    media: normalizeMedia(event.media),
  };
}

/**
 * Normalize event for detail view.
 */
export function normalizeEventDetail(event) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    content: event.content,
    eventType: event.event_type,
    modality: event.modality,
    startDate: event.start_date,
    endDate: event.end_date,
    location: event.location,
    organizer: event.organizer,
    targetAudience: event.target_audience,
    author: event.author
      ? {
          id: event.author.id,
          name: event.author.name,
        }
      : null,
    media: normalizeMedia(event.media),
  };
}
