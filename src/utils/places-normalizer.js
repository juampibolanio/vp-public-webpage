
const CATEGORY_MAP = {
    'COMMUNITY_LIBRARIES': { label: 'Bibliotecas Populares', icon: 'mdi:book-open-page-variant-outline' },
    'SENIOR_CENTERS': { label: 'Centros de Jubilados', icon: 'mdi:account-group-outline' },
    'WORKSHOPS': { label: 'Talleres', icon: 'mdi:hand-heart-outline' },
    'HEALTH_CENTER': { label: 'Centros de Salud', icon: 'mdi:hospital-building' },
    'DEFAULT': { label: 'Servicios', icon: 'mdi:map-marker-radius-outline' }
};


export function normalizePlace(item) {
    if (!item) return null;
    
    const data = item.attributes || item;
    
    const categoryKey = data.category || 'DEFAULT';
    const config = CATEGORY_MAP[categoryKey] || CATEGORY_MAP['DEFAULT'];

    let baseUrl = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES || 'http://localhost:1337';
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    let imgUrlPath = null;
    
    if (data.image && data.image.url) {
        imgUrlPath = data.image.url;
    }

    const imageUrl = imgUrlPath ? `${baseUrl}${imgUrlPath}` : null;

    return {
        id: item.id,
        title: data.name,
        category: config.label,
        categoryIcon: config.icon,
        categoryKey: categoryKey,
        coords: [data.latitude || 0, data.longitude || 0], 
        address: data.address || 'Dirección no especificada',
        phone: data.phone,
        schedule: data.schedule || 'Consultar horarios',
        image: imageUrl, 
    };
}

export function normalizePlaces(rawData) {
    if (!Array.isArray(rawData)) return [];
    return rawData.map(normalizePlace);
}

export function getUniqueCategories(normalizedPlaces) {
    const categories = new Set();
    const result = [];
    
    normalizedPlaces.forEach(place => {
        if (!categories.has(place.category)) {
            categories.add(place.category);
            result.push({
                name: place.category,
                icon: place.categoryIcon,
                key: place.categoryKey
            });
        }
    });
    return result;
}