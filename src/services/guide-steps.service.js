import { apiFetch } from './api';
import { normalizeGuideDetail } from '../utils/guide-steps-normalizer';

/**
 * @param {string} slug 
 */
export async function getGuideBySlug(slug) {
    try {

        const endpoint = `/guides?filters[slug][$eq]=${slug}&populate=*`;
        const response = await apiFetch(endpoint);
        const data = response.data || [];

        if (data.length === 0) {
            return { data: null, error: 'Trámite no encontrado' };
        }

        const item = data[0];
        const normalizedGuide = normalizeGuideDetail(item);
        return { data: normalizedGuide, error: null };

    } catch (error) {
        console.error("[Service Error] getGuideBySlug failed:", error);
        return { data: null, error: "Error de conexión con el servidor." };
    }
}


export async function getAllGuideSlugs() {
    try {
        const response = await apiFetch('/guides?fields[0]=slug&pagination[pageSize]=100');
        const rawData = response.data || [];

        return rawData.map(item => {
            const attributes = item.attributes || item; 
            return {
                params: { slug: attributes.slug }
            };
        });
    } catch (error) {
        console.error("[Service Error] getAllGuideSlugs failed:", error);
        return [];
    }
}