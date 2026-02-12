const CATEGORIES_CONFIG = [
    { title: "Emergencias", slug: "EMERGENCY" },
    { title: "Salud Pública", slug: "PUBLIC_HEALTH" },
    { title: "Servicios Públicos", slug: "PUBLIC_SERVICES" },
    { title: "Teléfonos importantes", slug: "IMPORTANT" }
];

const STRAPI_BASE_URL = import.meta.env.PUBLIC_STRAPI_API_URL.replace('/api', '');

export function normalizeUsefulPhones(rawPhones) {
    if (!Array.isArray(rawPhones)) return [];

    return CATEGORIES_CONFIG.map(catConfig => {
        const phonesInCategory = rawPhones.filter((item) => {
        const attr = item.attributes || item;
        const category = typeof attr.category === 'object'
            ? attr.category?.slug
            : attr.category;

        return category === catConfig.slug;
    });

    const processedCards = phonesInCategory.map((item) => {
        const attr = item.attributes || item;

        const rawPhoneList = attr.phone
            ? attr.phone.split(',').map(p => p.trim())
            : [];

        const actions = rawPhoneList.map((num, index) => {
            const cleanValue = num.replace(/[^\d+]/g, '');
            return {
            label: index === 0 ? "Llamar" : `Llamar ${index + 1}`,
            displayValue: num,
            linkValue: cleanValue,
            type: 'orange'
            };
        });

        return {
            id: item.id,
            name: attr.name,
            description: attr.description,
            province: attr.province,
            phone: rawPhoneList[0] || '',
            logo: attr.image?.url
                ? STRAPI_BASE_URL + attr.image.url
                : null,
            tag: attr.tag || null,
            subtitle: attr.subtitle || null,
            actions
        };
    });

    return {
        categoryTitle: catConfig.title,
        slug: catConfig.slug,
        cards: processedCards
    };
    });
}
