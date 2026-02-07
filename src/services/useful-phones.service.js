/**
 * Useful Phones Service
 * ---------------------
 * Service module responsible for data fetching orchestration.
 *
 * Responsibilities:
 * - Execute the HTTP request to the Strapi API.
 * - Delegate data transformation to the normalizer utility.
 * - Handle high-level error reporting.
 *
 * Dependencies:
 * - apiFetch (Network layer)
 * - normalizeUsefulPhones (Transformation layer)
 */

import { apiFetch } from './api';
import { normalizeUsefulPhones } from '../utils/useful-phones-normalizer';

/**
 * Retrieves the list of useful phones and returns them in a grouped, UI-ready format.
 *
 * @returns {Promise<{data: any[], error: string | null}>} 
 * Object containing the normalized data array or an error message.
 */
export async function getUsefulPhones() {
    try {
        const response = await apiFetch('/useful-phones?pagination[pageSize]=100&sort=name:asc');
        const rawData = response.data || [];

        const normalizedData = normalizeUsefulPhones(rawData);

        return { data: normalizedData, error: null };

    } catch (error) {
        console.error("UsefulPhones Service Error:", error);
        return { 
            data: [], 
            error: "Hubo un problema cargando la información. Por favor intente más tarde." 
        };
    }
}