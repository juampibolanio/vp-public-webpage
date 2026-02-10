import { initMapFilters } from './map-filter-handler.js';

let map = null;
let markers = {}; 
let currentActiveId = null; 

export function initMapLogic(places) {
    const mapElement = document.getElementById('leaflet-map');
    
    if (!mapElement || typeof window.L === 'undefined') return;
    const L = window.L;

    if (map) {
        map.off();
        map.remove();
        map = null;
        markers = {};
        currentActiveId = null;
    }

    setTimeout(() => {
        map = L.map('leaflet-map', { zoomControl: false }).setView([-27.451, -58.986], 13);
        
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

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
            iconAnchor: [27, 55],
            popupAnchor: [0, -55]
        });

        if (Array.isArray(places)) {
            places.forEach(place => {
                if (place && place.coords && place.coords[0] && place.coords[1]) {
                    const marker = L.marker(place.coords, { icon: defaultIcon }).addTo(map);
                    
                    marker.defaultIcon = defaultIcon;
                    marker.activeIcon = activeIcon;

                    marker.on('click', () => {
                        handleSelection(place, marker);
                    });

                    markers[place.id] = marker;
                }
            });
        }

        map.invalidateSize();
        initMapFilters(markers, map);

    }, 100);

    setupListEvents(places);
    
    const closeBtn = document.getElementById('btnClosePopup');
    if (closeBtn) {
        const newBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newBtn, closeBtn);
        
        newBtn.addEventListener('click', () => {
            document.getElementById('mapPopup').classList.add('hidden');
            resetAllMarkers(); 
        });
    }
}

function handleSelection(place, marker = null) {
    if (!place) return;

    const targetMarker = marker || markers[place.id];

    updatePopup(place);
    highlightListCard(place.id);

    if (targetMarker && map) {
        resetAllMarkers();

        targetMarker.setIcon(targetMarker.activeIcon);
        targetMarker.setZIndexOffset(1000); 
        currentActiveId = place.id;

        const isMobile = window.innerWidth <= 768;
        let targetLat = place.coords[0];
        let targetLng = place.coords[1];

        if (!isMobile) {
                targetLng = targetLng + 0.003; 
        }

        map.flyTo([targetLat, targetLng], 15, { animate: true, duration: 1.2 });
    }
}

function resetAllMarkers() {
    Object.values(markers).forEach(m => {
        m.setIcon(m.defaultIcon);
        m.setZIndexOffset(0); 
    });
    currentActiveId = null;
}

function setupListEvents(places) {
    const cards = document.querySelectorAll('.place-card');
    cards.forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        newCard.addEventListener('click', () => {
            const id = parseInt(newCard.dataset.id);
            const place = Array.isArray(places) ? places.find(p => p.id === id) : null;
            
            if (place) {
                handleSelection(place); 
            }
        });
    });
}

function updatePopup(place) {
    const popup = document.getElementById('mapPopup');
    const imgContainer = document.getElementById('popupImageContainer');
    const imgElement = document.getElementById('popupImg');
    
    const btnCall = document.getElementById('btnCall');
    const btnGo = document.getElementById('btnGo');
    
    const setText = (id, txt) => { 
        const el = document.getElementById(id); 
        if(el) el.textContent = txt || ''; 
    };

    if (place.image) {
        if(imgElement) imgElement.src = place.image;
        if(imgContainer) imgContainer.style.display = 'block';
    } else {
        if(imgContainer) imgContainer.style.display = 'none';
    }

    setText('popupTitle', place.title);
    setText('popupCategory', place.category);
    setText('popupAddress', place.address);
    setText('popupSchedule', place.schedule);

    if (btnCall) {
        btnCall.onclick = null;
        if (place.phone) {
            btnCall.style.opacity = '1';
            btnCall.style.cursor = 'pointer';
            btnCall.disabled = false;
            btnCall.onclick = () => window.open(`tel:${place.phone}`, '_self');
        } else {
            btnCall.style.opacity = '0.5';
            btnCall.style.cursor = 'not-allowed';
            btnCall.disabled = true;
        }
    }

    if (btnGo) {
        btnGo.onclick = null;
        btnGo.onclick = () => {
            if (place.coords) {
                const [lat, lng] = place.coords;
                const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                window.open(url, '_blank');
            }
        };
    }

    popup.classList.remove('hidden');
}

function highlightListCard(id) {
    document.querySelectorAll('.place-card').forEach(c => c.classList.remove('is-active'));
    const activeCard = document.querySelector(`.place-card[data-id="${id}"]`);
    if (activeCard) {
        activeCard.classList.add('is-active');
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}