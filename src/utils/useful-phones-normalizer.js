/**
 * Useful Phones Normalizer
 * ------------------------
 * Utility module responsible for transforming raw API data into UI-ready structures.
 *
 * Responsibilities:
 * - Hold the static configuration for categories and assets.
 * - Map raw database records to frontend assets (icons/logos).
 * - Handle specific business logic (splitting phone numbers, special buttons).
 * - Return a clean, nested structure ready for the Astro component loop.
 */


import aguasCorrientes from '../assets/aguas-corrientes-logo.webp';
import anses from '../assets/anses-logo.webp';
import defensaAlConsumidor from '../assets/defensa-al-consumidor-logo.webp';
import dpec from '../assets/dpec-logo.webp';
import hospitalEscuela from '../assets/hospital-escuela-corrientes-logo.webp';
import hospitalVidal from '../assets/hospital-vidal-logo.webp';
import hospitalPerrando from '../assets/hospital-perrando-logo.webp';
import inssep from '../assets/inssep-logo.webp';
import ioscor from '../assets/ioscor-logo.webp';
import ips from '../assets/ips-logo.webp';
import municipalidadCorrientes from '../assets/municipalidad-corrientes-logo.webp';
import pami from '../assets/pami-logo.webp';
import logoChaco from '../assets/logo-chaco.webp';

const ASSET_MAP = {
    'POLICÍA': { icon: 'mdi:shield-outline', tag: 'URGENCIA' },
    'BOMBEROS': { icon: 'mdi:fire', tag: 'URGENCIA' },
    'EMERGENCIA MÉDICA': { icon: 'mdi:ambulance', tag: 'URGENCIA' },
    'VIOLENCIA DE GÉNERO': { icon: 'mdi:alert-decagram-outline', tag: 'ATENCIÓN 24 HS' },
    'Hospital Escuela': { logo: hospitalEscuela.src, subtitle: 'Guardia 24hs' },
    'Hospital Perrando': { logo: hospitalPerrando.src, subtitle: 'Guardia 24hs' },
    'Hospital Vidal': { logo: hospitalVidal.src, subtitle: 'Guardia 24hs' },
    'DPEC': { logo: dpec.src, subtitle: 'Atención 24hs' },
    'Aguas Corrientes': { logo: aguasCorrientes.src, subtitle: 'Reclamos 24hs' },
    'Municipalidad': { logo: municipalidadCorrientes.src, subtitle: '08:00-18:00hs' },
    'ANSES': { logo: anses.src, subtitle: 'Atención 24hs' },
    'PAMI "ESCUCHA"': { logo: pami.src, subtitle: '07:30 - 19:00 (Lunes - Viernes)' },
    'IPS': { logo: ips.src, subtitle: '07:30 - 12:30hs' },
    'IOSCOR': { logo: ioscor.src, subtitle: '07:15 - 12:45 | 13:45 - 19:15' },
    'INSSSEP': { logo: inssep.src, subtitle: '07:30 - 13:00 (Lunes - Viernes)' },
    'Defensa al consumidor': { logo: defensaAlConsumidor.src, subtitle: '07:30 - 12:30hs' },
    'Asistencia Personas Mayores': { logo: logoChaco.src, subtitle: 'Solo Chaco' }
};

/**
 * Configuration: Categories Order
 */
const CATEGORIES_CONFIG = [
    { title: "Emergencias", slug: "EMERGENCY" },
    { title: "Salud Pública", slug: "PUBLIC_HEALTH" },
    { title: "Servicios Públicos", slug: "PUBLIC_SERVICES" },
    { title: "Teléfonos importantes", slug: "IMPORTANT" }
];

/**
 * Transforms a raw array of phone objects from Strapi into grouped categories.
 *
 * @param {Array<any>} rawPhones - The raw data array from the API response.
 * @returns {Array<any>} structured data grouped by category with hydrated assets.
 */
export function normalizeUsefulPhones(rawPhones) {
    if (!Array.isArray(rawPhones)) return [];

    return CATEGORIES_CONFIG.map(catConfig => {
        const phonesInCategory = rawPhones.filter((item) => {
            const attr = item.attributes || item; 
            return attr.category === catConfig.slug;
        });

        const processedCards = phonesInCategory.map((item) => {
            const attr = item.attributes || item;
            
            const assets = ASSET_MAP[attr.name] || {};

            const phoneList = attr.phone
                ? attr.phone.split(',').map((p) => p.trim())
                : [];

            const actions = phoneList.map((num, index) => ({
                label: index === 0 ? "Llamar" : `Llamar ${index + 1}`,
                value: num,
                type: 'orange'
            }));

            if (attr.name === 'IOSCOR') {
                actions.push({ label: 'Sitio-Web', value: 'https://ioscor.gob.ar', type: 'orange' });
            }

            return {
                id: item.id,
                name: attr.name,
                description: attr.description,
                province: attr.province,
                phone: phoneList[0] || '', 
                logo: assets.logo || null,
                icon: assets.icon || null,
                tag: assets.tag || null,
                subtitle: assets.subtitle || null,
                actions: actions
            };
        });

        return {
            categoryTitle: catConfig.title,
            slug: catConfig.slug,
            cards: processedCards
        };
    });
}