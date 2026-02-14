import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPlaces.css';
import logoIcon from '../../assets/home-icon.webp';
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

/**
 * @param {Object} props
 * @param {any[]} [props.initialPlaces]
 * @param {any[]} [props.initialCategories]
 */
export default function MapPlacesIsland({ initialPlaces = [], initialCategories = [] }) {
    const [filterText, setFilterText] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});
    const filteredPlaces = useMemo(() => {
        return initialPlaces.filter(place => {
            const matchesSearch = place.title.toLowerCase().includes(filterText.toLowerCase());
            const matchesCategory = activeCategory === 'all' || place.categoryKey === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialPlaces, filterText, activeCategory]);

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return;

        const map = L.map(mapRef.current, { zoomControl: false }).setView([-27.451, -58.986], 13);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            maxZoom: 20
        }).addTo(map);

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        const defaultIcon = L.divIcon({
            className: 'custom-pin',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee7923" width="48px" height="48px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const activeIcon = L.divIcon({
            className: 'custom-pin-active',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#47A641" width="64px" height="64px" style="filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.4));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
            iconSize: [55, 55],
            iconAnchor: [27, 55]
        });

        Object.keys(markersRef.current).forEach(id => {
            const idNum = Number(id);
            if (!filteredPlaces.find(p => p.id === idNum)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        filteredPlaces.forEach(place => {
            if (place.coords && !markersRef.current[place.id]) {
                const marker = L.marker(place.coords, { icon: defaultIcon }).addTo(map);
                
                marker.on('click', () => {
                    handlePlaceSelect(place.id, place.coords);
                });

                markersRef.current[place.id] = marker;
            }
        });

        Object.keys(markersRef.current).forEach(key => {
            const marker = markersRef.current[key];
            const isSelected = Number(key) === selectedPlaceId;
            marker.setIcon(isSelected ? activeIcon : defaultIcon);
            marker.setZIndexOffset(isSelected ? 1000 : 0);
        });

    }, [filteredPlaces, selectedPlaceId]);

    const handlePlaceSelect = (id, coords) => {
        setSelectedPlaceId(id);
        const map = mapInstance.current;
        if (map && coords) {
            const isMobile = window.innerWidth <= 768;
            const offsetLng = isMobile ? coords[1] : coords[1] + 0.003;
            map.flyTo([coords[0], offsetLng], 15, { animate: true, duration: 1.2 });
        }
    };

    const activePlace = initialPlaces.find(p => p.id === selectedPlaceId);

    const getCategoryIcon = (iconName) => {
        return ICON_MAP[iconName] || ICON_MAP['default'];
    };

    return (
        <section className="map-section">
            <div className="map-header">
                <img src={logoIcon.src} alt="Logo Vivir Plenamente" className="header-icon-img" />
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
                        {filteredPlaces.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                                No se encontraron lugares.
                            </div>
                        )}
                        {filteredPlaces.map(place => (
                            <div 
                                key={place.id}
                                className={`place-card ${selectedPlaceId === place.id ? 'is-active' : ''}`}
                                onClick={() => handlePlaceSelect(place.id, place.coords)}
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
                    <div id="leaflet-map-island" ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }}></div>
                    
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
                                            <Icon path={mdiMapMarkerOutline} size={0.7} color="var(--color-optional-text)"/>
                                            <span>{activePlace.address}</span>
                                        </div>
                                        <div className="data-row">
                                            <Icon path={mdiClockTimeFourOutline} size={0.7} color="var(--color-optional-text)"/>
                                            <span>{activePlace.schedule}</span>
                                        </div>
                                    </div>

                                    <div className="popup-actions">
                                        {activePlace.phone ? (
                                                <button className="btn-call" onClick={() => window.location.href=`tel:${activePlace.phone}`}>
                                                Llamar
                                                </button>
                                        ) : (
                                            <button className="btn-call" disabled style={{opacity: 0.5}}>Sin tel</button>
                                        )}
                                        <button className="btn-go" 
                                            disabled={!activePlace.coords}
                                            style={{ opacity: activePlace.coords ? 1 : 0.5 }}
                                            onClick={() => {
                                                if(activePlace.coords) {
                                                    const url = `http://googleusercontent.com/maps.google.com/maps?q=${activePlace.coords[0]},${activePlace.coords[1]}`;
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