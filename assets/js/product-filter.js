// Product Catalog Filtering and Finder JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-catalog-grid');
    const filterButtons = document.querySelectorAll('.filter-btn-premium');
    const capacityFilter = document.getElementById('filter-capacity');
    const driveFilter = document.getElementById('filter-drive');
    
    // Check if we are on the Products page
    const isProductsPage = !!productGrid;

    // Apply active filter state
    const filterProducts = () => {
        if (!isProductsPage) return;

        const activeCategoryButton = document.querySelector('.filter-btn-premium.active');
        const selectedCategory = activeCategoryButton ? activeCategoryButton.dataset.filter : 'all';
        const selectedCapacity = capacityFilter ? capacityFilter.value : 'all';
        const selectedDrive = driveFilter ? driveFilter.value : 'all';

        const cards = productGrid.querySelectorAll('.product-card-col');

        cards.forEach(card => {
            const cardCategory = card.dataset.category; // e.g. villa, compact, accessibility, hydraulic, mrl
            const cardCapacity = card.dataset.capacity; // e.g. 2-3, 4-5, 6+
            const cardDrive = card.dataset.drive; // e.g. hydraulic, mrl, traction, vacuum

            let matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
            let matchesCapacity = (selectedCapacity === 'all' || cardCapacity === selectedCapacity);
            let matchesDrive = (selectedDrive === 'all' || cardDrive === selectedDrive);

            if (matchesCategory && matchesCapacity && matchesDrive) {
                card.style.display = 'block';
                card.classList.remove('animate-fade-up');
                // Force layout recalculation for transition trigger
                void card.offsetWidth;
                card.classList.add('animate-fade-up');
            } else {
                card.style.display = 'none';
            }
        });
        
        // Handle empty state
        const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
        let emptyState = document.getElementById('catalog-empty-state');
        if (visibleCards.length === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.id = 'catalog-empty-state';
                emptyState.className = 'col-12 text-center py-5';
                emptyState.innerHTML = `
                    <i class="fa-solid fa-circle-info text-muted fs-1 mb-3"></i>
                    <h4 class="text-primary font-heading fw-bold">No Models Match Your Filters</h4>
                    <p class="text-secondary">Try resetting your filter selections or contact our engineering team for custom sizes.</p>
                    <button class="btn-premium btn-premium-outline mt-3" id="reset-catalog-filters">Reset Filters</button>
                `;
                productGrid.appendChild(emptyState);
                document.getElementById('reset-catalog-filters').addEventListener('click', resetAllFilters);
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    };

    const resetAllFilters = () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const allBtn = Array.from(filterButtons).find(btn => btn.dataset.filter === 'all');
        if (allBtn) allBtn.classList.add('active');

        if (capacityFilter) capacityFilter.value = 'all';
        if (driveFilter) driveFilter.value = 'all';

        filterProducts();
    };

    // Category Tabs click listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts();
        });
    });

    // Dropdown filter changes
    if (capacityFilter) capacityFilter.addEventListener('change', filterProducts);
    if (driveFilter) driveFilter.addEventListener('change', filterProducts);

    // 5. Interactive Product Finder integration
    const finderForm = document.getElementById('product-finder-form');
    if (finderForm) {
        finderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const application = document.querySelector('input[name="finder-app"]:checked')?.value || 'all';
            const capacity = document.getElementById('finder-capacity')?.value || 'all';
            const installation = document.getElementById('finder-install')?.value || 'all';
            
            // Save finder choices to sessionStorage
            sessionStorage.setItem('finder_category', application);
            sessionStorage.setItem('finder_capacity', capacity);
            sessionStorage.setItem('finder_installation', installation);
            
            // Redirect to products catalog
            window.location.href = 'products.html';
        });
    }

    // On products.html load, restore selections from Finder if they exist
    if (isProductsPage) {
        const savedCategory = sessionStorage.getItem('finder_category');
        const savedCapacity = sessionStorage.getItem('finder_capacity');

        if (savedCategory || savedCapacity) {
            if (savedCategory && savedCategory !== 'all') {
                filterButtons.forEach(btn => {
                    if (btn.dataset.filter === savedCategory) {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            }
            if (savedCapacity && savedCapacity !== 'all' && capacityFilter) {
                capacityFilter.value = savedCapacity;
            }

            // Clear session values so refreshing the catalog page doesn't lock user choice
            sessionStorage.removeItem('finder_category');
            sessionStorage.removeItem('finder_capacity');
            sessionStorage.removeItem('finder_installation');

            filterProducts();
        }
    }
});
