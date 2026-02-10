const PUBLIC_STRAPI_API_URL_IMAGES = import.meta.env
  .PUBLIC_STRAPI_API_URL_IMAGES;

export function normalizeAuthors(authors) {
  if (!Array.isArray(authors)) return [];
  
  return authors.map((author) => {
    return {
      id: author.id,
      name: author.name,
      role: author.role,
      avatar: author.avatar
        ? {
            url: PUBLIC_STRAPI_API_URL_IMAGES + author.avatar.url,
            alt:
              author.avatar.alternativeText ||
              author.name,
          }
        : null,
    };
  });
}
