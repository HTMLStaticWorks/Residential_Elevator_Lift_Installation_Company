// Global UI & Navigation JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const navbar = document.querySelector('.navbar-premium');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.boxShadow = 'var(--shadow-md)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '0.75rem 0';
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case page is refreshed scrolled down

    // 2. Responsive mobile navigation
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuContainer = document.querySelector('.navbar-menu-container');

    if (hamburgerBtn && menuContainer) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = hamburgerBtn.classList.toggle('active');
            menuContainer.classList.toggle('active', isActive);
            hamburgerBtn.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menuContainer.classList.contains('active') && !menuContainer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                menuContainer.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard close (Escape)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuContainer.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                menuContainer.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerBtn.focus();
            }
        });
    }

    // 3. Dropdowns handling (Desktop hover/click vs Tablet/Mobile accordion)
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
        const toggleLink = item.querySelector('.nav-link-premium');
        const dropdownMenu = item.querySelector('.dropdown-menu-premium');

        // Toggle dropdowns on click for mobile/tablet screen sizes
        toggleLink.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault(); // Stop default navigation on mobile
                const isShown = dropdownMenu.classList.contains('show');
                
                // Hide other dropdown menus first
                document.querySelectorAll('.dropdown-menu-premium').forEach(menu => {
                    if (menu !== dropdownMenu) menu.classList.remove('show');
                });

                dropdownMenu.classList.toggle('show', !isShown);
            }
        });

        // Desktop Hover triggers
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.add('show');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.remove('show');
            }
        });
    });

    // Close dropdowns if clicking anywhere outside on desktop
    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 992) {
            dropdownItems.forEach(item => {
                const dropdownMenu = item.querySelector('.dropdown-menu-premium');
                if (dropdownMenu && !item.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    });

    // 4. Lazy loading native polyfill / validation log
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
    } else {
        // Fallback for older browsers (immediate load but alert)
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
});
