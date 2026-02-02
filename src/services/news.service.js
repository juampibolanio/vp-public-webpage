import { apiFetch } from "./api";
import { normalizeNewsResponse } from "../utils/news-normalizer";

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
