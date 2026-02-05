/**
 * Weather API service
 * -------------------
 * Utility functions to interact with the OpenWeatherMap API.
 *
 * - Uses metric units.
 * - Responses are localized to Spanish.
 * - API key is read from Astro public environment variables.
 */

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.PUBLIC_OPENWEATHER_API_KEY;

/**
 * Fetches current weather data for a given city.
 *
 * @param {string} city - City name (e.g. "Corrientes", "Buenos Aires").
 * @returns {Promise<Object>} Current weather data from OpenWeatherMap.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getCurrentWeather(city) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error("Error obteniendo clima actual");
  }

  return res.json();
}

/**
 * Fetches weather forecast data for a given city.
 *
 * - Returns a 5-day forecast with data in 3-hour intervals.
 *
 * @param {string} city - City name (e.g. "Corrientes", "Buenos Aires").
 * @returns {Promise<Object>} Forecast data from OpenWeatherMap.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getForecast(city) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&lang=es&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error("Error obteniendo pronóstico");
  }

  return res.json();
}
