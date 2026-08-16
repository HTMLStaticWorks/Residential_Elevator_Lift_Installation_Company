# Residential Elevator & Lift Installation Company HTML Template

A commercial-grade residential vertical mobility template built for ThemeForest, manufacturers, villa developers, and accessibility planners. 

The website uses a technical, safety-focused, and premium design style, representing engineering precision and residential luxury.

---

## 📂 File Structure

```
/
├── index.html                    # Homepage 1 (Architecture-led journey)
├── home-2.html                   # Homepage 2 (Technical/Product-led with Finder)
├── products.html                 # Product Catalog with Category/Capacity Filters
├── product-details.html          # Dynamic Technical Specs Detail View
├── services.html                 # Services Directory & 6-step Timeline
├── maintenance.html              # Preventive Inspections & Support dispatcher UI
├── maintenance-packages.html     # Annual Service Plans Comparison Matrix
├── projects.html                 # Completed Installations Portfolio (with filters)
├── project-details.html          # Dynamic Case Study View
├── contact.html                  # Office locations, map placeholder, and FAQs
├── site-visit.html               # 4-step Site Visit Booking Form Wizard
├── login.html                    # Client portal authentication
├── signup.html                   # Portal project registration
├── 404.html                      # Customized "Out of Shaft Range" error page
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css     # Bootstrap 5 layout & grid only
│   │   ├── style.css             # Main styling system, colors, typography, elements
│   │   ├── dark.css              # Dark theme CSS variable overrides
│   │   └── animations.css        # CSS transitions and micro-interactions
│   │
│   ├── js/
│   │   ├── main.js               # Responsive nav, hamburger toggles, scroll actions
│   │   ├── theme-toggle.js       # Persistent light/dark manager (loads in <head>)
│   │   ├── product-filter.js     # Catalog filter & finder session router
│   │   ├── comparison.js         # Comparison matrix loader and storage
│   │   ├── site-visit.js         # 4-step site visit booking wizard and date picker
│   │   ├── quote-form.js         # General quote forms validators and feedback
│   │   └── animations.js         # GSAP animations and count-up observers
│   │
│   └── images/                   # Optimized photorealistic PNG/JPG assets
│       ├── hero/
│       ├── products/
│       ├── projects/
│       ├── maintenance/
│       └── safety/
└── README.md
```

---

## 🎨 Design System

### Color Palette

| Mode / Element | Variable | Hex Code | Visual Vibe |
|---|---|---|---|
| **Light Mode Primary** | `--primary-navy` | `#0F172A` | Engineering Navy |
| **Light Mode Secondary** | `--secondary-slate` | `#334155` | Slate Grey |
| **Light Mode Accent** | `--accent-blue` | `#2563EB` | Technical Blue |
| **Light Mode Secondary Accent**| `--accent-amber` | `#F59E0B` | Safety Amber |
| **Light Mode Background** | `--bg-light` | `#F8FAFC` | Surface Cool-grey |
| **Dark Mode Background** | `--bg-light` | `#080D18` | Deep Obsidian |
| **Dark Mode Surface** | `--surface-light` | `#111827` | Dark Grey |
| **Dark Mode Card** | `--card-bg` | `#172033` | Rich Steel Blue |
| **Dark Mode Accent** | `--accent-blue` | `#60A5FA` | Tech Sky Blue |

### Typography

* **Headings:** `Manrope` (A clean, modern sans-serif with geometric balance suitable for architecture and real estate).
* **Body text:** `Inter` (Optimized for premium reading clarity on screens of all sizes).
* **Technical Labels & Spec Values:** `IBM Plex Sans` (A technical, industrial font designed to communicate engineering precision).

---

## ⚙️ Interactive Behaviors (JavaScript Modules)

1. **Persistent Theme Toggle (`theme-toggle.js`):** Instantly toggles between light and dark modes. Loads in the `<head>` of all HTML files to evaluate `localStorage` state *before page paint*, preventing any white-screen flicker.
2. **Product Finder Router (`product-filter.js`):** Intercepts search selections on `home-2.html`, saves choices to `sessionStorage`, redirects to `products.html`, and pre-loads matching category filters automatically.
3. **Comparison Matrix (`comparison.js`):** Allows users to flag up to 4 models from the catalog page and compare them on a side-by-side spec grid. Compared list state is kept in `localStorage`.
4. **Site Visit Booking Wizard (`site-visit.js`):** Operates a 4-step wizard. Step 4 generates a dynamic date selection panel showing the next 7 business days (skipping Sundays) and time slots. Includes field validators and custom success feedback modals.
5. **GSAP Animations (`animations.js`):** Sets up scroll triggers for section reveals, image zooms, and statistical count-ups. Gracefully falls back to browser `IntersectionObserver` CSS animations if GSAP is unavailable.

---

## 🛠️ Local Development & Testing

1. Since the product detail and project study templates load specifications dynamically from local data objects using URL search parameters (e.g. `?model=zenith-hydraulic`), pages should be viewed using a local web server to guarantee clean cross-origin script loads.
2. If using **VS Code**, right-click `index.html` and choose **Open with Live Server**.
3. Alternatively, run a local Python HTTP server from the project directory:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.
