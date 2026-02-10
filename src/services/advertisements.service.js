/**
 * Advertisement Service
 * ---------------------
 * Service layer responsible for retrieving advertisement data
 * from the Strapi API.
 *
 * Responsibilities:
 * - Build query parameters required by Strapi.
 * - Fetch advertisement data through the shared API client.
 * - Normalize the API response before exposing it to the frontend.
 *
 * Notes:
 * - Media relations are explicitly populated.
 * - This service returns only normalized data.
 */

import { normalizeAdvertisementResponse } from "../utils/advertisementsNormalizer";
import { apiFetch } from "./api";

/**
 * Retrieve advertisements from the Strapi API.
 *
 * @param {Object} [options]
 * @param {number} [options.limit] - Maximum number of advertisements to retrieve
 *                                  (mapped to Strapi pagination[pageSize])
 *
 * @returns {Promise<Object>} Normalized advertisement response
 * including advertisement list and pagination data.
 */
export async function getAdvertisements({ limit } = {}) {
  const query = new URLSearchParams({
    "populate[media]": "true",
  });

  if (typeof limit === "number") {
    query.set("pagination[pageSize]", String(limit));
    query.set("pagination[page]", "1");
  }

  const response = await apiFetch(
    `/adverstiments?${query.toString()}`
  );

  return normalizeAdvertisementResponse(response);
}
