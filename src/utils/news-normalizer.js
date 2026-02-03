const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES;

/* normalizer single media */

function normalizeSingleMedia(media) {
  if (!media || !media.url) return null;

  return {
    url: PUBLIC_STRAPI_API_URL_IMAGES + media.url,
    alt: media.alternativeText || "",
    width: media.width || null,
    height: media.height || null,
    thumbnail: media.formats?.thumbnail
      ? PUBLIC_STRAPI_API_URL_IMAGES + media.formats.thumbnail.url
      : null,
  };
}

/* multimedia content normalizer for image galleries */
function normalizeMediaGallery(mediaArray) {
  if (!Array.isArray(mediaArray)) return [];

  return mediaArray
    .map(normalizeSingleMedia)
    .filter(Boolean);
}

/* normalizer author */

function normalizeAuthor(author) {
  if (!author) return null;

  return {
    name: author.name,
    avatar: author.avatar
      ? normalizeSingleMedia(author.avatar)
      : null,
  };
}

/* normalizer new detail (slug) */

export function normalizeNewsItem(item) {
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content || "",
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

/* normalizer news list */

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

/* responses */

export function normalizeNewsResponse(response) {
  return {
    news: response.data.map(normalizeNewsListItem),
    pagination: response.meta.pagination,
  };
}
