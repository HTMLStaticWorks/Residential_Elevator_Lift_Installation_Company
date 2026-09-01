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

        if (!toggleLink || !dropdownMenu) return;

        // Toggle dropdowns on click for mobile/tablet screen sizes (<= 1024px)
        toggleLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault(); // Stop default navigation on mobile/tablet drawer
                const isShown = dropdownMenu.classList.contains('show');
                
                // Hide other dropdown menus first
                document.querySelectorAll('.dropdown-menu-premium').forEach(menu => {
                    if (menu !== dropdownMenu) menu.classList.remove('show');
                });

                dropdownMenu.classList.toggle('show', !isShown);
                toggleLink.setAttribute('aria-expanded', !isShown);
            }
        });

        // Desktop Hover triggers (> 1024px)
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                dropdownMenu.classList.add('show');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1024) {
                dropdownMenu.classList.remove('show');
            }
        });
    });

    // Close dropdowns if clicking anywhere outside on desktop (> 1024px)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 1024) {
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

    // 5. Back to Top Button with Scroll Progress
    const backToTopContainer = document.createElement('div');
    backToTopContainer.id = 'back-to-top-container';
    backToTopContainer.className = 'back-to-top-container';
    backToTopContainer.innerHTML = `
        <svg class="progress-ring" width="48" height="48">
            <circle class="progress-ring__circle-bg" stroke="var(--border-color)" stroke-width="3" fill="transparent" r="21" cx="24" cy="24"/>
            <circle class="progress-ring__circle" stroke="var(--accent-blue)" stroke-width="3" fill="transparent" r="21" cx="24" cy="24" stroke-dasharray="131.95" stroke-dashoffset="131.95"/>
        </svg>
        <button class="back-to-top-btn" aria-label="Scroll back to top">
            <i class="fa-solid fa-arrow-up"></i>
        </button>
    `;
    document.body.appendChild(backToTopContainer);

    const progressCircle = backToTopContainer.querySelector('.progress-ring__circle');
    const backToTopBtn = backToTopContainer.querySelector('.back-to-top-btn');
    const circumference = 2 * Math.PI * 21; // ~131.95

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            const offset = circumference - (scrollPercent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        } else {
            progressCircle.style.strokeDashoffset = circumference;
        }

        if (scrollTop > 300) {
            backToTopContainer.classList.add('visible');
        } else {
            backToTopContainer.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Trigger once in case page starts scrolled down

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. Mobile Menu Theme Toggle Text Removal
    const mobileThemeBtn = document.getElementById('theme-toggle-mobile');
    if (mobileThemeBtn) {
        const icon = mobileThemeBtn.querySelector('i');
        if (icon) {
            mobileThemeBtn.innerHTML = '';
            mobileThemeBtn.appendChild(icon);
            icon.className = icon.className.replace('me-2', '');
        }
    }

    // 7. Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.password-toggle-btn');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wrapper = button.closest('.password-field-wrapper');
            if (!wrapper) return;
            const input = wrapper.querySelector('input');
            const icon = button.querySelector('i');
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    button.setAttribute('aria-label', 'Hide password');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    button.setAttribute('aria-label', 'Show password');
                }
            }
        });
    });
});

