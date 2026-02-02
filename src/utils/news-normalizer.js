const STRAPI_MEDIA_URL = import.meta.env.PUBLIC_STRAPI_API_URL;
const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

function normalizeMedia(mediaArray) {
  if (!mediaArray || mediaArray.length === 0) return null;

  const media = mediaArray[0];

  return {
    url: PUBLIC_STRAPI_API_URL_IMAGES + media.url,
    alt: media.alternativeText || "",
    width: media.width,
    height: media.height,
    thumbnail: media.formats?.thumbnail
      ? PUBLIC_STRAPI_API_URL_IMAGES + media.formats.thumbnail.url
      : null,
  };
}

function normalizeAuthor(author) {
  if (!author) return null;

  return {
    name: author.name,
    avatar: author.avatar
      ? {
          url: PUBLIC_STRAPI_API_URL_IMAGES + author.avatar.url,
          alt: author.avatar.alternativeText || author.name,
        }
      : null,
  };
}

export function normalizeNewsItem(item) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    region: item.region,
    publishedDate: item.published_date,
    media: normalizeMedia(item.media),
    author: normalizeAuthor(item.author),
  };
}

export function normalizeNewsResponse(response) {
  return {
    news: response.data.map(normalizeNewsItem),
    pagination: response.meta.pagination,
  };
}
