const CATEGORY_MAP = {
    'COMMUNITY_LIBRARIES': { label: 'Bibliotecas Populares', icon: 'mdi:book-open-page-variant-outline' },
    'SENIOR_CENTERS': { label: 'Centros de Jubilados', icon: 'mdi:account-group-outline' },
    'WORKSHOPS': { label: 'Talleres', icon: 'mdi:hand-heart-outline' },
    'HEALTH_CENTER': { label: 'Centros de Salud', icon: 'mdi:hospital-building' },
    'DEFAULT': { label: 'Servicios', icon: 'mdi:map-marker-radius-outline' }
};

export function normalizePlace(item) {
    if (!item || !item.id) return null;

    const data = item.attributes || item;
    const categoryKey = data.category || 'DEFAULT';
    const config = CATEGORY_MAP[categoryKey] || CATEGORY_MAP.DEFAULT;

    let baseUrl = import.meta.env.PUBLIC_STRAPI_API_URL_IMAGES || 'http://localhost:1337';
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    let imgUrlPath = null;
    if (data.image && data.image.url) {
        imgUrlPath = data.image.url;
    }

    const imageUrl = imgUrlPath ? `${baseUrl}${imgUrlPath}` : null;

    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

    return {
        id: item.id,
        title: data.name || 'Sin nombre',
        category: config.label,
        categoryIcon: config.icon,
        categoryKey,
        coords: hasValidCoords ? [lat, lng] : null,
        address: data.address || 'Dirección no especificada',
        phone: data.phone || null,
        schedule: data.schedule || 'Consultar horarios',
        image: imageUrl
    };
}

export function normalizePlaces(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData
        .map(normalizePlace)
        .filter(Boolean);
}

export function getUniqueCategories(normalizedPlaces) {
    if (!Array.isArray(normalizedPlaces)) return [];

    const categories = new Set();
    const result = [];

    normalizedPlaces.forEach(place => {
        if (!place || !place.categoryKey) return;

        if (!categories.has(place.categoryKey)) {
            categories.add(place.categoryKey);
            result.push({
                name: place.category,
                icon: place.categoryIcon,
                key: place.categoryKey
            });
        }
    });

    return result;
}