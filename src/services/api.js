const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;
const PUBLIC_STRAPI_API_TOKEN = import.meta.env.PUBLIC_STRAPI_API_TOKEN;

export async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLIC_STRAPI_API_TOKEN}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        console.error("API error: ", response.status);
        throw new Error(`Error fetching data: ${response.status}`);
    }

    return response.json();
}