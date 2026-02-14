import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPlaces.css';
import Icon from '@mdi/react';
import {
    mdiMagnify,
    mdiApps,
    mdiMapMarker,
    mdiClose,
    mdiMapMarkerOutline,
    mdiClockTimeFourOutline,
    mdiBookOpenPageVariantOutline,
    mdiAccountGroupOutline,
    mdiHandHeartOutline,
    mdiHospitalBuilding,
    mdiMapMarkerRadiusOutline
} from '@mdi/js';

const ICON_MAP = {
    'mdi:book-open-page-variant-outline': mdiBookOpenPageVariantOutline,
    'mdi:account-group-outline': mdiAccountGroupOutline,
    'mdi:hand-heart-outline': mdiHandHeartOutline,
    'mdi:hospital-building': mdiHospitalBuilding,
    'mdi:map-marker-radius-outline': mdiMapMarkerRadiusOutline,
    'default': mdiMapMarker
};

const defaultIcon = L.divIcon({
    className: 'custom-pin',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee7923" width="48px" height="48px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const activeIcon = L.divIcon({
    className: 'custom-pin-active',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#47A641" width="64px" height="64px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [55, 55],
    iconAnchor: [27, 55]
});

function FlyToPlace({ coords }) {
    const map = useMap();

    if (coords) {
        const isMobile = window.innerWidth <= 768;
        const offsetLng = isMobile ? coords[1] : coords[1] + 0.003;
        map.flyTo([coords[0], offsetLng], 15, { animate: true, duration: 1.2 });
    }

    return null;
}

export default function MapPlacesIsland({ initialPlaces = [], initialCategories = [] }) {
    const [filterText, setFilterText] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    const filteredPlaces = useMemo(() => {
        return initialPlaces.filter(place => {
            const matchesSearch = place.title.toLowerCase().includes(filterText.toLowerCase());
            const matchesCategory = activeCategory === 'all' || place.categoryKey === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialPlaces, filterText, activeCategory]);

    const activePlace = initialPlaces.find(p => p.id === selectedPlaceId);

    const getCategoryIcon = (iconName) => {
        return ICON_MAP[iconName] || ICON_MAP['default'];
    };

    return (
        <section className="map-section">
            <div className="map-header">
                <img src="/assets/home-icon.webp" alt="Logo Vivir Plenamente" className="header-icon-img" />
                <h2>Mapa de Actividades y Servicios</h2>
            </div>

            <div className="map-container">
                <aside className="map-sidebar">
                    <div className="search-bar">
                        <span className="search-icon">
                            <Icon path={mdiMagnify} size={1} />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar lugares..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    <div className="categories-row">
                        <button
                            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            <div className="cat-icon-box">
                                <Icon path={mdiApps} size={0.9} />
                            </div>
                            <span>Todos</span>
                        </button>

                        {initialCategories.map(cat => (
                            <button
                                key={cat.key}
                                className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                <div className="cat-icon-box">
                                    <Icon path={getCategoryIcon(cat.icon)} size={0.9} />
                                </div>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="places-list">
                        {filteredPlaces.map(place => (
                            <div
                                key={place.id}
                                className={`place-card ${selectedPlaceId === place.id ? 'is-active' : ''}`}
                                onClick={() => setSelectedPlaceId(place.id)}
                            >
                                <div className="place-img-placeholder">
                                    <div className="placeholder-icon-container">
                                        <Icon path={getCategoryIcon(place.categoryIcon)} size={1.2} />
                                    </div>
                                </div>
                                <div className="place-info">
                                    <h4>{place.title}</h4>
                                    <p>{place.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <div className="map-visual-area">
                    <MapContainer
                        center={[-27.451, -58.986]}
                        zoom={13}
                        zoomControl={false}
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                    >
                        <TileLayer
                            attribution="© OpenStreetMap © CARTO"
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {filteredPlaces.map(place => (
                            place.coords && (
                                <Marker
                                    key={place.id}
                                    position={place.coords}
                                    icon={place.id === selectedPlaceId ? activeIcon : defaultIcon}
                                    eventHandlers={{
                                        click: () => setSelectedPlaceId(place.id)
                                    }}
                                />
                            )
                        ))}

                        {activePlace?.coords && <FlyToPlace coords={activePlace.coords} />}
                    </MapContainer>

                    <div className={`map-popup-card ${activePlace ? '' : 'hidden'}`}>
                        {activePlace && (
                            <>
                                {activePlace.image && (
                                    <div className="popup-image">
                                        <img src={activePlace.image} alt={activePlace.title} />
                                    </div>
                                )}
                                <div className="popup-content">
                                    <span className="popup-category">{activePlace.category}</span>
                                    <h3>{activePlace.title}</h3>

                                    <div className="popup-data">
                                        <div className="data-row">
                                            <Icon path={mdiMapMarkerOutline} size={0.7} />
                                            <span>{activePlace.address}</span>
                                        </div>
                                        <div className="data-row">
                                            <Icon path={mdiClockTimeFourOutline} size={0.7} />
                                            <span>{activePlace.schedule}</span>
                                        </div>
                                    </div>

                                    <div className="popup-actions">
                                        {activePlace.phone ? (
                                            <button className="btn-call" onClick={() => window.location.href = `tel:${activePlace.phone}`}>
                                                Llamar
                                            </button>
                                        ) : (
                                            <button className="btn-call" disabled style={{ opacity: 0.5 }}>Sin tel</button>
                                        )}
                                        <button className="btn-go"
                                            disabled={!activePlace.coords}
                                            style={{ opacity: activePlace.coords ? 1 : 0.5 }}
                                            onClick={() => {
                                                if (activePlace.coords) {
                                                    const [lat, lng] = activePlace.coords;
                                                    const url = `https://www.google.com/maps?q=${lat},${lng}`;
                                                    window.open(url, '_blank');
                                                }
                                            }}>Ir
                                        </button>
                                    </div>
                                    <button className="btn-close-popup" onClick={() => setSelectedPlaceId(null)}>
                                        <Icon path={mdiClose} size={0.8} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}