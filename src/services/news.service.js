import { apiFetch } from "./api";
import {
  normalizeNewsItem,
  normalizeNewsResponse,
} from "../utils/news-normalizer";

/* get all news (list news) */
export async function getNews({ page = 1, pageSize = 5 } = {}) {
  const query = new URLSearchParams({
    "fields[0]": "title",
    "fields[1]": "slug",
    "fields[2]": "excerpt",
    "fields[3]": "published_date",
    "fields[4]": "category",
    "fields[5]": "region",

    "populate[media]": "true",
    "populate[author][fields][0]": "name",
    "populate[author][populate][avatar]": "true",

    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "published_date:desc",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  return normalizeNewsResponse(response);
}

/* get new by slug (just a news) */
export async function getNewBySlug(slug) {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,

    "populate[media]": "true",
    "populate[author][populate][avatar]": "true",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  if (!response?.data?.length) {
    return null;
  }

  return normalizeNewsItem(response.data[0]);
}

/* get a list of related news */
export async function getRelatedNews({
  category,
  excludeSlug,
  limit = 3,
}) {
  const query = new URLSearchParams({
    "filters[slug][$ne]": excludeSlug,

    ...(category && {
      "filters[category][$eq]": category.label,
    }),

    "pagination[pageSize]": limit,

    "fields[0]": "title",
    "fields[1]": "slug",
    "fields[2]": "category",

    "populate[media]": "true",
  });

  const response = await apiFetch(`/news?${query.toString()}`);

  if (!response?.data?.length) {
    return [];
  }

  return response.data.map(normalizeNewsItem);
}