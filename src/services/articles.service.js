import { apiFetch } from "./api";
import { normalizeArticleDetail, normalizeArticleListItem } from "../utils/article-normalizer";

export async function getArticlesByHubSlug(
  hubSlug,
  { page = 1, pageSize = 10 } = {},
) {
  const response = await apiFetch(
    `/articles` +
      `?filters[hub][slug][$eq]=${hubSlug}` +
      `&populate[media]=true` +
      `&populate[author][populate][avatar]=true` +
      `&sort=published_date:desc` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}`,
  );

  return {
    articles: response.data.map(normalizeArticleListItem),
    pagination: response.meta.pagination,
  };
}

export async function getArticleBySlug(slug) {
  const response = await apiFetch(
    `/articles` +
      `?filters[slug][$eq]=${slug}` +
      `&populate[media]=true` +
      `&populate[author][populate][avatar]=true`,
  );

  const article = response.data?.[0];
  if (!article) return null;

  return normalizeArticleDetail(article);
}
