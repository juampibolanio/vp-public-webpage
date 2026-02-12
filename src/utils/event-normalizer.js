import { formatDate } from "./date";

const BASE_URL = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/**
 * Build absolute URL safely
 */
function buildUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

/**
 * Normalize media (image or video)
 */
function normalizeMedia(media) {
  if (!media) return [];

  const items = Array.isArray(media) ? media : [media];

  return items.map((item) => {
    const isVideo = item.mime?.startsWith("video");
    const isImage = item.mime?.startsWith("image");

    return {
      id: item.id,
      type: isVideo ? "video" : isImage ? "image" : "file",
      mime: item.mime,
      url: buildUrl(item.url),
      thumbnail:
        item.formats?.thumbnail?.url
          ? buildUrl(item.formats.thumbnail.url)
          : null,
      alt: item.alternativeText || "",
      width: item.width ?? null,
      height: item.height ?? null,
    };
  });
}

/**
 * Normalize event for list views
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
 * Normalize event for detail view
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
