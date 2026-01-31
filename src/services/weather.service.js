const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.PUBLIC_OPENWEATHER_API_KEY;

export async function getCurrentWeather(city) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error("Error obteniendo clima actual");
  }

  return res.json();
}

export async function getForecast(city) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&lang=es&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error("Error obteniendo pronóstico");
  }

  return res.json();
}
