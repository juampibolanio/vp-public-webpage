/**
 * Guide Procedures Service
 * ------------------------
 * Service module responsible for fetching Guide data from the CMS.
 */

import { apiFetch } from './api';
import { normalizeGuideProcedures } from '../utils/guide-procedures-normalizer';

/**
 * Fetches all published guides from Strapi.
 * @returns {Promise<{data: any[], error: string | null}>} 
 */
export async function getGuideProcedures() {
    try {
        const endpoint = '/guides?pagination[pageSize]=100&sort=title:asc&populate=*';
        
        const response = await apiFetch(endpoint);
        const rawData = response.data || [];

        const normalizedData = normalizeGuideProcedures(rawData);

        return { data: normalizedData, error: null };

    } catch (error) {
        console.error("GuideProcedures Service Error:", error);
        return { 
            data: [], 
            error: "No se pudieron cargar los trámites. Por favor intente más tarde." 
        };
    }
}