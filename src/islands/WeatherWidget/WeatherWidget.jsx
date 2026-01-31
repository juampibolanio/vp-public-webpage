import './WeatherWidget.css';
import { useEffect, useState } from 'react';
import { getCurrentWeather, getForecast } from '../../services/weather.service';

export default function WeatherWidget() {
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadWeather() {
            try {
                const city = 'Corrientes,AR';

                const currentData = await getCurrentWeather(city);
                const forecastData = await getForecast(city);

                setCurrent(currentData);

                const daily = forecastData.list
                    .filter(item => item.dt_txt.includes('12:00:00'))
                    .slice(0, 5);

                setForecast(daily);
                setError(false);
            } catch (err) {
                setError(true);
            }
        }

        loadWeather();

        const interval = setInterval(loadWeather, 1000 * 60 * 30);

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <div className="weather-sections">Error al cargar el clima</div>;
    }

    if (!current) {
        return <div className="weather-sections">Cargando clima...</div>;
    }

    return (
        <section className="weather-sections">
            <header className="weather__header">
                <h4 className="weather__title">{current.name}</h4>
                <span className="weather__state">
                    {current.weather[0].description.charAt(0).toUpperCase() +
                        current.weather[0].description.slice(1)}
                </span>
            </header>

            <div className="weather__body">
                <div className="weather__stats">
                    <div className="weather__stat">
                        <span className="weather__stat-value">
                            {current.main.humidity}%
                        </span>
                        <span className="weather__stat-label">Humedad</span>
                    </div>

                    <div className="weather__stat">
                        <span className="weather__stat-value">
                            {Math.round(current.wind.speed * 3.6)} km/h
                        </span>
                        <span className="weather__stat-label">Viento</span>
                    </div>

                    <div className="weather__stat">
                        <span className="weather__stat-value">
                            { Math.round(current.main.feels_like) } °
                        </span>
                        <span className="weather__stat-label">Sen. Térmica</span>
                    </div>
                </div>

                <div className="weather__temperature">
                    <div className="weather__temp-icon-container">
                        <img
                            className="weather__temp-icon"
                            src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
                            alt={current.weather[0].description}
                        />
                    </div>

                    <span className="weather__temp-value">
                        {Math.round(current.main.temp)}°
                    </span>

                    <div className="weather__temp-range">
                        <span className="weather__temp-min">
                            Min {Math.round(current.main.temp_min)}°
                        </span>
                        <span className="weather__temp-max">
                            Max {Math.round(current.main.temp_max)}°
                        </span>
                    </div>
                </div>
            </div>

            <footer className="weather__forecast">
                {forecast.map(day => {
                    const date = new Date(day.dt * 1000);
                    const label = date.toLocaleDateString('es-AR', {
                        weekday: 'short',
                    });

                    return (
                        <div className="weather__forecast-day" key={day.dt}>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                alt={day.weather[0].description}
                            />
                            <span className="weather__forecast-label">
                                {label}
                            </span>
                            <span className="weather__forecast-temp">
                                {Math.round(day.main.temp)}°
                            </span>
                        </div>
                    );
                })}
            </footer>
        </section>
    );
}
