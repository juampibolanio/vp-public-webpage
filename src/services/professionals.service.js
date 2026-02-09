import { apiFetch } from "./api";
import { normalizeProfessionalArticle } from "../utils/professionals-normalizer";

export async function getProfessionalArticles({
  category,
  page = 1,
  pageSize = 6,
} = {}) {
  if (!category) {
    throw new Error("getProfessionalArticles require a category");
  }

  const endpoint =
    `/articles` +
    `?filters[category][$eq]=${encodeURIComponent(category)}` +
    `&populate=author` +
    `&sort=published_date:desc` +
    `&pagination[page]=${page}` +
    `&pagination[pageSize]=${pageSize}`;

  const response = await apiFetch(endpoint);

  const rawArticles = response?.data ?? [];

  const articles = rawArticles
    .map(normalizeProfessionalArticle)
    .filter(Boolean);

  return {
    articles,
    pagination: response?.meta?.pagination ?? null,
  };
}
