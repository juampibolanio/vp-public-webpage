import { apiFetch } from "./api";
import { normalizeContentHubList } from "../utils/content-hub-normalizer";

/**
 * Get content hubs filtered by category.
 */
export async function getContentHubsByCategory(category) {
  const response = await apiFetch(
    `/content-hubs?filters[category][$eq]=${category}&populate=icon&sort=title:asc`,
  );

  return normalizeContentHubList(response);
}
