export async function GET() {
    const BASE_URL = "https://api.openweathermap.org/data/2.5";
    const API_KEY = import.meta.env.OPENWEATHER_API_KEY;

    if (!globalThis.__weatherCache) {
        globalThis.__weatherCache = {
            data: null,
            timestamp: 0,
        };
    }

    const CACHE_DURATION = 1000 * 60 * 30;
    const now = Date.now();

    if (
        globalThis.__weatherCache.data &&
        now - globalThis.__weatherCache.timestamp < CACHE_DURATION
    ) {
        return new Response(JSON.stringify(globalThis.__weatherCache.data), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=1800",
            },
        });
    }

    try {
        const city = "Corrientes,AR";

        const [currentRes, forecastRes] = await Promise.all([
            fetch(
                `${BASE_URL}/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`
            ),
            fetch(
                `${BASE_URL}/forecast?q=${city}&units=metric&lang=es&appid=${API_KEY}`
            ),
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error("Weather fetch failed");
        }

        const current = await currentRes.json();
        const forecastRaw = await forecastRes.json();

        const forecast = forecastRaw.list
            .filter((item) => item.dt_txt.includes("12:00:00"))
            .slice(0, 5);

        const normalized = { current, forecast };

        globalThis.__weatherCache.data = normalized;
        globalThis.__weatherCache.timestamp = now;

        return new Response(JSON.stringify(normalized), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=1800",
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: true }),
            { status: 500 }
        );
    }
}