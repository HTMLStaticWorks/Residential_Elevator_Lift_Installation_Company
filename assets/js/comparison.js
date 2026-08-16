// Elevator Models Technical Data
const ELEVATOR_MODELS = {
    'apex-glass': {
        id: 'apex-glass',
        name: 'Apex Panoramic Glass',
        category: 'Villa Lifts',
        image: 'assets/images/products/apex_glass.png',
        capacity: '400 kg (4–5 persons)',
        stops: 'Up to 5 stops',
        speed: '0.15 m/s - 0.3 m/s',
        drive: 'Gearless MRL Traction',
        installation: 'Requires shallow pit (50mm) or ramp',
        space: '1200 x 1200 mm shaft',
        cabin: 'Panoramic curved glass, structural steel',
        application: 'Luxury villas, central stairwells'
    },
    'zenith-hydraulic': {
        id: 'zenith-hydraulic',
        name: 'Zenith Hydraulic Villa Lift',
        category: 'Villa Lifts',
        image: 'assets/images/products/zenith_hydraulic.png',
        capacity: '450 kg (5–6 persons)',
        stops: 'Up to 4 stops',
        speed: '0.15 m/s',
        drive: 'Eco-Hydraulic pump unit',
        installation: 'Standard shaft pit (100mm)',
        space: '1400 x 1400 mm shaft',
        cabin: 'Custom wood veneer panels, LED accent lines',
        application: 'Multi-level estates, quiet residential comfort'
    },
    'aero-compact': {
        id: 'aero-compact',
        name: 'Aero Ultra-Compact Lift',
        category: 'Compact Lifts',
        image: 'assets/images/products/aero_compact.png',
        capacity: '250 kg (2–3 persons)',
        stops: 'Up to 3 stops',
        speed: '0.15 m/s',
        drive: 'Pneumatic Vacuum system',
        installation: 'Zero pit required (flat floor)',
        space: '950 mm circular footprint',
        cabin: 'Polycarbonate clear panoramic wrap, alloy frames',
        application: 'Existing houses, tight staircases, retrofits'
    },
    'horizon-platform': {
        id: 'horizon-platform',
        name: 'Horizon Platform Lift',
        category: 'Accessibility Lifts',
        image: 'assets/images/products/horizon_platform.png',
        capacity: '340 kg (Wheelchair + 1 passenger)',
        stops: 'Up to 3 stops',
        speed: '0.15 m/s',
        drive: 'Screw and Nut drive',
        installation: 'Zero pit (ramp) or 50mm pit',
        space: '1250 x 1560 mm footprint',
        cabin: 'Open cabin platform, high protective barriers',
        application: 'Accessibility upgrades, elderly mobility support'
    },
    'optima-mrl': {
        id: 'optima-mrl',
        name: 'Optima Machine-Room-Less Lift',
        category: 'MRL Lifts',
        image: 'assets/images/products/optima_mrl.png',
        capacity: '630 kg (8 persons)',
        stops: 'Up to 6 stops',
        speed: '0.4 m/s',
        drive: 'Gearless Traction Drive',
        installation: 'Requires standard pit (200mm)',
        space: '1500 x 1600 mm shaft',
        cabin: 'Hairline Stainless Steel, full wall mirror',
        application: 'High-end apartments, duplex units, large luxury estates'
    },
    'verde-eco': {
        id: 'verde-eco',
        name: 'Verde Eco-Regenerative Lift',
        category: 'Compact Lifts',
        image: 'assets/images/products/verde_eco.png',
        capacity: '320 kg (3–4 persons)',
        stops: 'Up to 4 stops',
        drive: 'Regenerative Traction Drive',
        speed: '0.2 m/s',
        installation: 'Shallow pit (100mm)',
        space: '1100 x 1150 mm shaft',
        cabin: 'Sustainably sourced bamboo paneling, smart controls',
        application: 'Eco-conscious houses, energy grid feeding units'
    }
};

// Compare Operations Local Storage Key
const COMPARE_KEY = 'compare_lift_list';

function getCompareList() {
    const data = localStorage.getItem(COMPARE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCompareList(list) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    // Trigger comparison count sync
    syncCompareBadges();
}

function addToCompare(modelId) {
    const list = getCompareList();
    if (list.includes(modelId)) return { success: false, msg: 'Product already added to comparison.' };
    if (list.length >= 4) return { success: false, msg: 'You can compare up to 4 models at a time.' };
    
    list.push(modelId);
    saveCompareList(list);
    return { success: true, msg: 'Product added to comparison.' };
}

function removeFromCompare(modelId) {
    let list = getCompareList();
    list = list.filter(id => id !== modelId);
    saveCompareList(list);
    return { success: true, msg: 'Product removed from comparison.' };
}

function syncCompareBadges() {
    const list = getCompareList();
    const badges = document.querySelectorAll('.compare-count-badge');
    badges.forEach(badge => {
        badge.textContent = list.length;
        badge.style.display = list.length > 0 ? 'inline-block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncCompareBadges();

    // 1. Listen for catalog comparison button clicks
    const compareButtons = document.querySelectorAll('.btn-add-compare');
    compareButtons.forEach(btn => {
        const modelId = btn.dataset.modelId;
        const list = getCompareList();
        
        // Update button states on load
        if (list.includes(modelId)) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Compared';
            btn.classList.add('btn-premium-primary');
            btn.classList.remove('btn-premium-outline');
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentList = getCompareList();
            
            if (currentList.includes(modelId)) {
                // Remove it
                removeFromCompare(modelId);
                btn.innerHTML = '<i class="fa-solid fa-scale-balanced"></i> Compare';
                btn.classList.add('btn-premium-outline');
                btn.classList.remove('btn-premium-primary');
            } else {
                // Add it
                const result = addToCompare(modelId);
                if (result.success) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Compared';
                    btn.classList.add('btn-premium-primary');
                    btn.classList.remove('btn-premium-outline');
                } else {
                    alert(result.msg);
                }
            }
        });
    });

    // 2. Render comparison matrix on comparison UI blocks (e.g. index/home-2 comparison sections)
    const renderComparisonMatrix = () => {
        const tableBody = document.getElementById('comparison-table-body');
        const compareEmptyState = document.getElementById('compare-empty-state');
        const comparisonGridWrapper = document.getElementById('comparison-grid-wrapper');

        if (!tableBody) return;

        const list = getCompareList();

        if (list.length === 0) {
            if (compareEmptyState) compareEmptyState.style.display = 'block';
            if (comparisonGridWrapper) comparisonGridWrapper.style.display = 'none';
            return;
        }

        if (compareEmptyState) compareEmptyState.style.display = 'none';
        if (comparisonGridWrapper) comparisonGridWrapper.style.display = 'block';

        // Headers
        const headerRow = document.getElementById('comparison-header-row');
        headerRow.innerHTML = '<th class="feature-title">Model Attributes</th>';
        
        list.forEach(modelId => {
            const m = ELEVATOR_MODELS[modelId];
            if (!m) return;
            headerRow.innerHTML += `
                <th class="product-header text-center">
                    <img src="${m.image}" alt="${m.name}" class="img-fluid mb-2">
                    <div class="product-name mb-2">${m.name}</div>
                    <div class="badge bg-primary tech-label mb-2">${m.category}</div>
                    <div>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2 remove-compare-item" data-model-id="${m.id}" style="font-size: 0.75rem;">
                            <i class="fa-solid fa-trash-can"></i> Remove
                        </button>
                    </div>
                </th>
            `;
        });

        // Specs rows mappings
        const specsKeys = [
            { label: 'Load Capacity', key: 'capacity' },
            { label: 'Travel Stops', key: 'stops' },
            { label: 'Travel Speed', key: 'speed' },
            { label: 'Drive Mechanism', key: 'drive' },
            { label: 'Installation Pit', key: 'installation' },
            { label: 'Required Shaft Size', key: 'space' },
            { label: 'Interior Finishes', key: 'cabin' },
            { label: 'Best Configuration For', key: 'application' }
        ];

        tableBody.innerHTML = '';
        specsKeys.forEach(rowDef => {
            let rowHtml = `<tr><td class="feature-title">${rowDef.label}</td>`;
            list.forEach(modelId => {
                const m = ELEVATOR_MODELS[modelId];
                if (m) {
                    rowHtml += `<td>${m[rowDef.key]}</td>`;
                }
            });
            rowHtml += '</tr>';
            tableBody.innerHTML += rowHtml;
        });

        // Add CTAs row at bottom
        let ctaRowHtml = `<tr><td class="feature-title">Next Action</td>`;
        list.forEach(modelId => {
            ctaRowHtml += `
                <td>
                    <a href="product-details.html?model=${modelId}" class="btn-premium btn-premium-primary w-100 py-2 fs-7 mb-2 text-center" style="font-size: 0.8rem;">
                        View Specifications
                    </a>
                    <a href="site-visit.html?ref=${modelId}" class="btn-premium btn-premium-outline w-100 py-2 fs-7 text-center" style="font-size: 0.8rem;">
                        Book Site Visit
                    </a>
                </td>
            `;
        });
        ctaRowHtml += '</tr>';
        tableBody.innerHTML += ctaRowHtml;

        // Re-bind remove buttons inside comparison tables
        document.querySelectorAll('.remove-compare-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const modelId = btn.dataset.modelId;
                removeFromCompare(modelId);
                renderComparisonMatrix();
                
                // Sync catalog buttons if user is on same page
                const catBtn = document.querySelector(`.btn-add-compare[data-model-id="${modelId}"]`);
                if (catBtn) {
                    catBtn.innerHTML = '<i class="fa-solid fa-scale-balanced"></i> Compare';
                    catBtn.classList.add('btn-premium-outline');
                    catBtn.classList.remove('btn-premium-primary');
                }
            });
        });
    };

    // Run matrix build
    renderComparisonMatrix();
});
