// Theme and RTL Toggler JavaScript
(function () {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark-theme');
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('dark-theme');
        });
    } else {
        document.documentElement.classList.remove('dark-theme');
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.remove('dark-theme');
        });
    }

    const savedRTL = localStorage.getItem('rtl');
    if (savedRTL === 'true') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.classList.add('rtl-mode');
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('rtl-mode');
        });
    }
})();

function toggleTheme() {
    const body = document.body;
    const docEl = document.documentElement;
    
    const isDark = body.classList.toggle('dark-theme');
    docEl.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    updateThemeIcons(isDark);
}

// Function to safely check and toggle theme mode
function updateThemeIcons(isDark) {
    const themeIcons = document.querySelectorAll('.theme-toggle-btn i');
    themeIcons.forEach(icon => {
        if (isDark) {
            icon.className = 'fa-solid fa-sun';
            icon.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fa-solid fa-moon';
            icon.setAttribute('aria-label', 'Switch to dark mode');
        }
    });
}

function toggleRTL() {
    const body = document.body;
    const docEl = document.documentElement;
    
    const isRTL = docEl.getAttribute('dir') === 'rtl';
    const nextRTL = !isRTL;
    
    if (nextRTL) {
        docEl.setAttribute('dir', 'rtl');
        docEl.classList.add('rtl-mode');
        body.classList.add('rtl-mode');
    } else {
        docEl.removeAttribute('dir');
        docEl.classList.remove('rtl-mode');
        body.classList.remove('rtl-mode');
    }
    
    localStorage.setItem('rtl', nextRTL ? 'true' : 'false');
    updateRTLButtonState(nextRTL);
}

function updateRTLButtonState(isRTL) {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
        if (isRTL) {
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--accent-blue)';
            btn.style.color = '#FFFFFF';
            btn.style.borderColor = 'var(--accent-blue)';
        } else {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--text-secondary)';
            btn.style.borderColor = 'var(--border-color)';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI state setup
    const isDark = document.body.classList.contains('dark-theme');
    updateThemeIcons(isDark);
    
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    updateRTLButtonState(isRTL);
    
    // Bind click events to theme toggle buttons
    const themeToggleBtn = document.querySelectorAll('.theme-toggle-btn:not(.rtl-toggle-btn)');
    themeToggleBtn.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Bind click events to RTL toggle buttons
    const rtlToggleBtn = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggleBtn.forEach(btn => {
        btn.addEventListener('click', toggleRTL);
    });
});
