const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("API error: ", response.status);
        throw new Error(`Error fetching data: ${response.status}`);
    }
    
    return response.json();
}