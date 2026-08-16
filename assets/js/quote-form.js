// Quote Request Form Validation and Submission JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const quoteForms = document.querySelectorAll('.quote-request-form');

    quoteForms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Core validations
            let isFormValid = true;
            const requiredInputs = form.querySelectorAll('[required]');

            requiredInputs.forEach(input => {
                const parent = input.closest('.mb-3') || input.parentElement;
                
                if (input.value.trim() === '') {
                    isFormValid = false;
                    input.style.borderColor = 'var(--error-red)';
                } else {
                    input.style.borderColor = 'var(--border-color)';
                }

                // Email validation checks
                if (input.type === 'email' && input.value.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        isFormValid = false;
                        input.style.borderColor = 'var(--error-red)';
                    }
                }

                // Phone numbers validation checks
                if (input.type === 'tel' && input.value.trim() !== '') {
                    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
                    if (!phoneRegex.test(input.value.trim())) {
                        isFormValid = false;
                        input.style.borderColor = 'var(--error-red)';
                    }
                }
            });

            if (!isFormValid) {
                // Render form validation error notification (inline/alert)
                let errorBanner = form.querySelector('.form-error-banner');
                if (!errorBanner) {
                    errorBanner = document.createElement('div');
                    errorBanner.className = 'form-error-banner alert alert-danger mt-3 py-2 px-3';
                    errorBanner.style.fontSize = '0.85rem';
                    errorBanner.innerHTML = '<i class="fa-solid fa-circle-exclamation me-2"></i> Please correct the highlighted fields before submitting.';
                    form.appendChild(errorBanner);
                }
                return;
            }

            // If valid, simulate submission
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Quote...';

            // Remove error banners if any
            const existingBanner = form.querySelector('.form-error-banner');
            if (existingBanner) existingBanner.remove();

            setTimeout(() => {
                const name = form.querySelector('[name="name"]')?.value || 'Client';
                const email = form.querySelector('[name="email"]')?.value || '';
                
                // Show dynamic success modal
                const overlay = document.createElement('div');
                overlay.className = 'form-feedback-overlay active';
                overlay.innerHTML = `
                    <div class="form-feedback-modal animate-scale-up">
                        <div class="form-feedback-icon success">
                            <i class="fa-solid fa-envelope-circle-check"></i>
                        </div>
                        <h3 class="text-primary font-heading fw-bold mb-3">Quote Request Submitted!</h3>
                        <p class="text-secondary mb-4">Thank you, ${name}. Our engineering estimation department has received your design preferences and will email a preliminary layout proposal to <strong class="text-primary">${email}</strong> within 1 business day.</p>
                        <button class="btn-premium btn-premium-primary w-100" id="close-quote-success-btn">Continue exploring</button>
                    </div>
                `;

                document.body.appendChild(overlay);

                document.getElementById('close-quote-success-btn').addEventListener('click', () => {
                    overlay.remove();
                });

                // Reset buttons and input values
                form.reset();
                submitBtn.removeAttribute('disabled');
                submitBtn.innerHTML = originalBtnText;

            }, 1500);
        });

        // Clear error highlights when user edits fields
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = 'var(--border-color)';
                const banner = form.querySelector('.form-error-banner');
                if (banner) banner.remove();
            });
        });
    });
});
