export function initMapFilters(markers = {}, map = null) {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.place-card');
    const noResultsMsg = document.getElementById('noResultsMessage');

    let currentCategory = 'all';
    let currentSearch = '';

    const runFilter = () => {
        let visibleCount = 0;

        cards.forEach((card) => {
            const cardId = card.dataset.id;
            const cardCat = card.dataset.category;
            
            const titleEl = card.querySelector('h4');
            const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : '';
            const matchesCategory = currentCategory === 'all' || cardCat === currentCategory;
            const matchesSearch = cardTitle.includes(currentSearch);
            const isVisible = matchesCategory && matchesSearch;

            if (isVisible) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }

            if (markers && markers[cardId] && map) {
                if (isVisible) {
                    if (!map.hasLayer(markers[cardId])) {
                        markers[cardId].addTo(map);
                    }
                } else {
                    markers[cardId].remove(); 
                }
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            currentCategory = target.dataset.filter || 'all';
            if (searchInput) currentSearch = searchInput.value.toLowerCase().trim();
            runFilter();
        });
    });

    if (searchInput) {
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);

        newInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            runFilter();
        });
    }
}