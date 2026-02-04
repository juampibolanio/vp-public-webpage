import { normalizeAdvertisementResponse } from "../utils/advertisementsNormalizer";
import { apiFetch } from "./api";

export async function getAdvertisements() {

    const query = new URLSearchParams({
        "populate[media]": "true",
    })

    const response = await apiFetch(`/adverstiments?${query.toString()}`);

    return normalizeAdvertisementResponse(response);
}