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
 * @returns {Promise<Object>} Normalized advertisement response
 * including advertisement list and pagination data.
 */
export async function getAdvertisements() {
  const query = new URLSearchParams({
    "populate[media]": "true",
  });

  const response = await apiFetch(
    `/adverstiments?${query.toString()}`
  );

  return normalizeAdvertisementResponse(response);
}
