import { apiFetch } from "./api";
import { normalizeAuthors } from "../utils/author-normalizer";

/**
 * Get all authors
 */
export async function getAuthors() {
  const response = await apiFetch("/authors?populate=avatar");

  return normalizeAuthors(response.data);
}
