const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env
  .PUBLIC_STRAPI_API_URL_IMAGES;

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

function normalizeAuthor(author) {
  if (!author) return null;

  return {
    name: author.name,
    avatar: author.avatar ? normalizeSingleMedia(author.avatar) : null,
  };
}

/**
 * Normalize article for hub listing (card view).
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
 * Normalize full article (detail page).
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
