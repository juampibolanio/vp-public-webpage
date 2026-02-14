import { apiFetch } from './api';
import { normalizePlaces } from '../utils/places-normalizer.js';

export async function getPlaces() {
    try {
        const endpoint = '/places?filters[is_active][$eq]=true&populate=*';
        const response = await apiFetch(endpoint);
        const rawData = Array.isArray(response?.data) ? response.data : [];
        const normalizedData = normalizePlaces(rawData);
        return {
            data: normalizedData,
            error: null
        };

    } catch (error) {
        console.error("[Places Service Error]:", error);
        return {
            data: [],
            error: "No se pudieron cargar los lugares."
        };
    }
}
