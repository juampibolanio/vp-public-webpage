import { apiFetch } from './api';
import { normalizeUsefulPhones } from '../utils/useful-phones-normalizer';

export async function getUsefulPhones() {
    try {
        const response = await apiFetch(
            '/useful-phones?pagination[pageSize]=100&sort=priority:asc&populate=image'
    );

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
