/**
 * Guide Procedures Normalizer
 * ---------------------------
 * Utility module responsible for transforming raw Guide data from Strapi into UI-ready objects.
 */

const CATEGORY_MAP = {
    'PROVISIONAL': { 
        label: 'Previsionales', 
        icon: 'mdi:account-group-outline',
        slug: 'PROVISIONAL' 
    },
    'SOCIAL': { 
        label: 'Sociales', 
        icon: 'mdi:hand-heart-outline',
        slug: 'SOCIAL'
    },
    'DOCUMENTATION': { 
        label: 'Documentación', 
        icon: 'mdi:card-account-details-outline',
        slug: 'DOCUMENTATION'
    },
    'HEALTH': { 
        label: 'Salud', 
        icon: 'mdi:hospital-building',
        slug: 'HEALTH'
    },
    'DEFAULT': { 
        label: 'General', 
        icon: 'mdi:file-document-outline',
        slug: 'GENERAL'
    }
};

/**
 * Normalizes a list of raw guide objects from Strapi.
 * @param {Array<any>} rawData - The 'data' array from the Strapi API response.
 * @returns {Array<any>} An array of clean, UI-ready guide objects.
 */
export function normalizeGuideProcedures(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData.map(item => {
        const attr = item.attributes || item; 

        const categoryKey = attr.category || 'DEFAULT';
        const categoryConfig = CATEGORY_MAP[categoryKey] || CATEGORY_MAP['DEFAULT'];

        return {
            id: item.id,
            title: attr.title || 'Sin título',
            description: attr.description || 'Sin descripción disponible.',
            
            url: attr.slug ? `/guia-tramites/${attr.slug}` : '#',
            
            categoryLabel: categoryConfig.label,
            categorySlug: categoryConfig.slug, 
            icon: categoryConfig.icon
        };
    });
}

/**
 * Extracts a list of unique categories available for the filter pills.
 * @returns {Array<object>} Array of objects { label, slug }
 */
export function getAvailableCategories() {
    const categories = Object.values(CATEGORY_MAP).filter(c => c.slug !== 'GENERAL');
    
    return [
        { label: 'Todos', slug: 'ALL' },
        ...categories
    ];
}