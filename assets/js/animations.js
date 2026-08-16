// GSAP Animation Engine Setup
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is available in window
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded. Falling back to CSS transitions.');
        fallbackCSSReveals();
        return;
    }

    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Reveal Elements on Scroll
    const revealUpElements = document.querySelectorAll('.reveal-up');
    revealUpElements.forEach(el => {
        gsap.fromTo(el, 
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // 2. Count-up statistics animations
    const countElements = document.querySelectorAll('.count-number');
    countElements.forEach(el => {
        const targetValue = parseInt(el.dataset.target, 10) || 0;
        
        // Setup initial number zero
        el.textContent = '0';

        gsap.to(el, {
            innerHTML: targetValue,
            duration: 2,
            ease: 'power1.out',
            snap: { innerHTML: 1 },
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            onUpdate: function() {
                // Formatting suffixes (+ or %)
                const suffix = el.dataset.suffix || '';
                el.innerHTML = Math.ceil(el.innerHTML) + suffix;
            }
        });
    });

    // 3. Subtle image reveal effect
    const imageReveals = document.querySelectorAll('.image-reveal-wrapper');
    imageReveals.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return;

        gsap.fromTo(img,
            { scale: 1.15, filter: 'blur(4px)' },
            {
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 80%'
                }
            }
        );
    });

    // 4. Hero section parallax (restrained and subtle)
    const heroContent = document.querySelector('.hero-content-block');
    const heroImage = document.querySelector('.hero-image-block');
    if (heroContent && heroImage) {
        gsap.fromTo(heroContent, 
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
        );
        gsap.fromTo(heroImage, 
            { opacity: 0, x: 30, scale: 0.98 },
            { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power2.out' }
        );
    }
});

// Fallback CSS triggers in case CDN load fails or block is isolated
function fallbackCSSReveals() {
    const revealUpElements = document.querySelectorAll('.reveal-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealUpElements.forEach(el => {
        observer.observe(el);
    });

    // Immediately show counts
    const countElements = document.querySelectorAll('.count-number');
    countElements.forEach(el => {
        el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
    });
}
