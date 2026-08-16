// Multi-step Site Visit Booking Wizard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const wizardForm = document.getElementById('site-visit-form');
    if (!wizardForm) return;

    const steps = Array.from(document.querySelectorAll('.form-step-panel'));
    const indicators = Array.from(document.querySelectorAll('.step-indicator'));
    const nextButtons = document.querySelectorAll('.btn-wizard-next');
    const prevButtons = document.querySelectorAll('.btn-wizard-prev');
    const dateGrid = document.getElementById('custom-date-picker-grid');
    const timeSlots = document.querySelectorAll('.time-slot-card');
    const selectedDateInput = document.getElementById('selected-date');
    const selectedTimeInput = document.getElementById('selected-time');
    const submitBtn = document.getElementById('btn-wizard-submit');

    let currentStep = 0;

    // 1. Setup Custom Date Picker for next 7 days
    const setupDatePicker = () => {
        if (!dateGrid) return;
        dateGrid.innerHTML = '';
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        let count = 0;
        let daysAdded = 0;

        while (daysAdded < 7) {
            const date = new Date();
            date.setDate(date.getDate() + count);
            count++;

            // Skip Sundays since company is closed for site visits
            if (date.getDay() === 0) continue;

            const dayName = daysOfWeek[date.getDay()];
            const dayNum = date.getDate();
            const monthName = months[date.getMonth()];
            const year = date.getFullYear();
            const formattedDate = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

            const dateItem = document.createElement('div');
            dateItem.className = 'date-picker-item';
            dateItem.dataset.date = formattedDate;
            dateItem.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="day-number">${dayNum}</span>
                <span class="day-name" style="font-size: 0.6rem;">${monthName}</span>
            `;

            dateItem.addEventListener('click', () => {
                document.querySelectorAll('.date-picker-item').forEach(item => item.classList.remove('selected'));
                dateItem.classList.add('selected');
                selectedDateInput.value = formattedDate;
                validateCurrentStep();
            });

            dateGrid.appendChild(dateItem);
            daysAdded++;
        }
    };

    setupDatePicker();

    // 2. Setup Time Slot triggers
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTimeInput.value = slot.dataset.time;
            validateCurrentStep();
        });
    });

    // 3. Radio Cards logic (Property type, installation status, lift type)
    const radioCards = document.querySelectorAll('.form-radio-card');
    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            const container = card.closest('.form-radio-card-grid') || card.parentElement;
            container.querySelectorAll('.form-radio-card').forEach(c => {
                c.classList.remove('selected');
                const radio = c.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
            });

            card.classList.add('selected');
            const targetRadio = card.querySelector('input[type="radio"]');
            if (targetRadio) {
                targetRadio.checked = true;
                // Trigger change event if needed
                const event = new Event('change', { bubbles: true });
                targetRadio.dispatchEvent(event);
            }
            validateCurrentStep();
        });
    });

    // 4. Input validation utilities
    const validateField = (input) => {
        if (!input.required) return true;

        if (input.type === 'radio') {
            const name = input.name;
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return !!checked;
        }

        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(input.value.trim());
        }

        if (input.type === 'tel') {
            const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
            return phoneRegex.test(input.value.trim());
        }

        return input.value.trim().length > 0;
    };

    const validateCurrentStep = () => {
        const panel = steps[currentStep];
        const inputs = Array.from(panel.querySelectorAll('input, select, textarea'));
        
        let stepValid = true;

        // Check text/select inputs
        inputs.forEach(input => {
            const parent = input.closest('.mb-3') || input.parentElement;
            const errorMsg = parent.querySelector('.field-error-msg') || document.createElement('span');

            if (!validateField(input)) {
                stepValid = false;
                if (input.classList.contains('form-control-premium')) {
                    input.style.borderColor = 'var(--error-red)';
                }
            } else {
                if (input.classList.contains('form-control-premium')) {
                    input.style.borderColor = 'var(--border-color)';
                }
            }
        });

        // Special check for date and time selections on step 3 (0-indexed 3 is step 4)
        if (currentStep === 3) {
            if (!selectedDateInput.value || !selectedTimeInput.value) {
                stepValid = false;
            }
        }

        // Toggle Next button disable status
        const currentNextBtn = panel.querySelector('.btn-wizard-next') || submitBtn;
        if (currentNextBtn) {
            if (stepValid) {
                currentNextBtn.removeAttribute('disabled');
                currentNextBtn.style.opacity = '1';
            } else {
                currentNextBtn.setAttribute('disabled', 'true');
                currentNextBtn.style.opacity = '0.6';
            }
        }

        return stepValid;
    };

    // Attach step validators on keyboard typing or select changes
    wizardForm.addEventListener('input', validateCurrentStep);
    wizardForm.addEventListener('change', validateCurrentStep);

    // 5. Navigation handling
    const updateWizardUI = () => {
        steps.forEach((panel, idx) => {
            panel.classList.toggle('active', idx === currentStep);
        });

        indicators.forEach((indicator, idx) => {
            indicator.classList.remove('active', 'completed');
            if (idx === currentStep) {
                indicator.classList.add('active');
            } else if (idx < currentStep) {
                indicator.classList.add('completed');
            }
        });

        validateCurrentStep();
    };

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                currentStep = Math.min(currentStep + 1, steps.length - 1);
                updateWizardUI();
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep = Math.max(currentStep - 1, 0);
            updateWizardUI();
        });
    });

    // Run initial validations on step 0
    updateWizardUI();

    // 6. Simulation of Form Submission
    wizardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;

        // Show spinner / loading feedback
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        setTimeout(() => {
            // Retrieve values for details rendering
            const clientName = document.getElementById('client-name').value;
            const clientEmail = document.getElementById('client-email').value;
            const clientPhone = document.getElementById('client-phone').value;
            const propertyType = document.querySelector('input[name="finder-app"]:checked')?.value || 'Residential';
            const dateStr = selectedDateInput.value;
            const timeStr = selectedTimeInput.value;

            // Build success feedback overlay modal
            const overlay = document.createElement('div');
            overlay.className = 'form-feedback-overlay active';
            overlay.innerHTML = `
                <div class="form-feedback-modal animate-scale-up">
                    <div class="form-feedback-icon success">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 class="text-primary font-heading fw-bold mb-3">Site Assessment Scheduled!</h3>
                    <p class="text-secondary mb-4">Hello ${clientName}, our vertical mobility engineer is scheduled to evaluate your home for a lift installation.</p>
                    
                    <div class="text-start bg-light p-3 rounded mb-4" style="border: 1px solid var(--border-color); font-size: 0.85rem; font-family: var(--font-tech);">
                        <div class="mb-1"><strong class="text-primary">Date:</strong> ${dateStr}</div>
                        <div class="mb-1"><strong class="text-primary">Time Slot:</strong> ${timeStr}</div>
                        <div class="mb-1"><strong class="text-primary">Property Type:</strong> ${propertyType}</div>
                        <div class="mb-1"><strong class="text-primary">Contact:</strong> ${clientPhone} | ${clientEmail}</div>
                    </div>
                    
                    <button class="btn-premium btn-premium-primary w-100" id="close-success-btn">Return to Homepage</button>
                </div>
            `;
            
            document.body.appendChild(overlay);

            document.getElementById('close-success-btn').addEventListener('click', () => {
                overlay.remove();
                window.location.href = 'index.html';
            });

            // Reset form
            wizardForm.reset();
            currentStep = 0;
            updateWizardUI();
            
            submitBtn.removeAttribute('disabled');
            submitBtn.innerHTML = 'Request Site Visit';

        }, 1500);
    });
});
