/**
 * Guide Filter Handler
 * --------------------
 * Maneja la lógica del lado del cliente para filtrar las tarjetas
 * de la guía de trámites sin recargar la página.
 */

export function initGuideFilters() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.guide-card');
    const noResultsMsg = document.getElementById('no-results-msg');

    let currentCategory = 'ALL'; 
    let currentSearch = '';

    const runFilter = () => {
        let visibleCount = 0;

        cards.forEach((card) => {
            const cardCat = card.dataset.category || 'GENERAL';
            const cardTitle = card.dataset.title || '';
            const matchesCategory = currentCategory === 'ALL' || cardCat === currentCategory;
            const matchesSearch = cardTitle.includes(currentSearch);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                });
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget; 
            filterBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            currentCategory = target.dataset.filter || 'ALL';
            runFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            runFilter();
        });
    }
}