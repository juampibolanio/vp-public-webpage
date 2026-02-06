import { apiFetch } from "./api";
import {
  normalizeContentHubList,
  normalizeContentHub,
} from "../utils/content-hub-normalizer";

/**
 * Get content hubs filtered by category.
 */
export async function getContentHubsByCategory(category) {
  const response = await apiFetch(
    `/content-hubs?filters[category][$eq]=${category}&populate=icon&sort=title:asc`,
  );

  return normalizeContentHubList(response);
}

export async function getContentHubBySlug(slug) {
  const response = await apiFetch(
    `/content-hubs?filters[slug][$eq]=${slug}&populate[icon]=true`,
  );

  const hub = response.data?.[0];
  if (!hub) return null;

  return normalizeContentHub(hub);
}
