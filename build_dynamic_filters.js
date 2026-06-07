const fs = require('fs');
const path = require('path');

const collectionDir = path.join(__dirname, 'collection');
const htmlFile = path.join(collectionDir, 'collection.html');
const jsFile = path.join(collectionDir, 'main.js');
const cssFile = path.join(collectionDir, 'style.css');

// 1. Update HTML
if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');

    const htmlReplacements = [
        {
            regex: /<button class="filter-btn" id="dynastyFilterBtn">[\s\S]*?<\/button>/,
            replacement: `
            <div class="filter-dropdown" id="dynastyDropdownWrapper">
                <button class="filter-btn" id="dynastyFilterBtn">
                    <span class="material-symbols-outlined" style="font-size: 1rem">crown</span>
                    <span>Dynasty</span>
                    <span class="material-symbols-outlined arrow-icon" style="font-size: 1rem">keyboard_arrow_down</span>
                </button>
                <div class="filter-dropdown-menu">
                    <div class="filter-options-scroll" id="dynastyFilterOptions"></div>
                    <div class="filter-actions">
                        <button class="apply-filter-btn" onclick="applyFilter('dynasty')">Apply</button>
                    </div>
                </div>
            </div>`
        },
        {
            regex: /<button class="filter-btn" id="materialFilterBtn">[\s\S]*?<\/button>/,
            replacement: `
            <div class="filter-dropdown" id="materialDropdownWrapper">
                <button class="filter-btn" id="materialFilterBtn">
                    <span class="material-symbols-outlined" style="font-size: 1rem">diamond</span>
                    <span>Material</span>
                    <span class="material-symbols-outlined arrow-icon" style="font-size: 1rem">keyboard_arrow_down</span>
                </button>
                <div class="filter-dropdown-menu">
                    <div class="filter-options-scroll" id="materialFilterOptions"></div>
                    <div class="filter-actions">
                        <button class="apply-filter-btn" onclick="applyFilter('material')">Apply</button>
                    </div>
                </div>
            </div>`
        },
        {
            regex: /<button class="filter-btn" id="siteFilterBtn">[\s\S]*?<\/button>/,
            replacement: `
            <div class="filter-dropdown" id="siteDropdownWrapper">
                <button class="filter-btn" id="siteFilterBtn">
                    <span class="material-symbols-outlined" style="font-size: 1rem">location_on</span>
                    <span>Discovery Site</span>
                    <span class="material-symbols-outlined arrow-icon" style="font-size: 1rem">keyboard_arrow_down</span>
                </button>
                <div class="filter-dropdown-menu">
                    <div class="filter-options-scroll" id="siteFilterOptions"></div>
                    <div class="filter-actions">
                        <button class="apply-filter-btn" onclick="applyFilter('site')">Apply</button>
                    </div>
                </div>
            </div>`
        },
        {
            regex: /<button class="filter-btn" id="galleryFilterBtn">[\s\S]*?<\/button>/,
            replacement: `
            <div class="filter-dropdown" id="galleryDropdownWrapper">
                <button class="filter-btn" id="galleryFilterBtn">
                    <span class="material-symbols-outlined" style="font-size: 1rem">photo_library</span>
                    <span>Gallery</span>
                    <span class="material-symbols-outlined arrow-icon" style="font-size: 1rem">keyboard_arrow_down</span>
                </button>
                <div class="filter-dropdown-menu">
                    <div class="filter-options-scroll" id="galleryFilterOptions"></div>
                    <div class="filter-actions">
                        <button class="apply-filter-btn" onclick="applyFilter('gallery')">Apply</button>
                    </div>
                </div>
            </div>`
        }
    ];

    htmlReplacements.forEach(rep => {
        if (!html.includes('id="dynastyDropdownWrapper"')) {
            html = html.replace(rep.regex, rep.replacement);
        }
    });

    fs.writeFileSync(htmlFile, html);
    console.log("HTML updated.");
}

// 2. Update JS
if (fs.existsSync(jsFile)) {
    let js = fs.readFileSync(jsFile, 'utf8');

    // Replace event listeners
    const oldListeners = `document.getElementById('dynastyFilterBtn')?.addEventListener('click', () => openFilterModal('dynastyModal'));
    document.getElementById('materialFilterBtn')?.addEventListener('click', () => openFilterModal('materialModal'));
    document.getElementById('siteFilterBtn')?.addEventListener('click', () => openFilterModal('siteModal'));
    document.getElementById('galleryFilterBtn')?.addEventListener('click', () => openFilterModal('galleryModal'));`;

    const newListeners = `
    const filterWrappers = ['dynasty', 'material', 'site', 'gallery'];
    filterWrappers.forEach(type => {
        const btn = document.getElementById(type + 'FilterBtn');
        const wrapper = document.getElementById(type + 'DropdownWrapper');
        if (btn && wrapper) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                filterWrappers.forEach(t => {
                    if (t !== type) {
                        document.getElementById(t + 'DropdownWrapper')?.classList.remove('active');
                    }
                });
                wrapper.classList.toggle('active');
            });
            wrapper.querySelector('.filter-dropdown-menu')?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener('click', () => {
        filterWrappers.forEach(t => {
            document.getElementById(t + 'DropdownWrapper')?.classList.remove('active');
        });
    });`;

    js = js.replace(oldListeners, newListeners);

    // Replace populateFilterModal logic
    const oldPopulate = `const isChecked = STATE.filters[filterType].includes(option);
            const div = document.createElement('div');
            div.className = 'filter-option';
            div.innerHTML = \`
                      <input type="checkbox" id="\${filterType}_\${option}" value="\${option}" 
                             \${isChecked ? 'checked' : ''} data-filter-type="\${filterType}">
                      <label for="\${filterType}_\${option}">\${option}</label>
                  \`;
            container.appendChild(div);`;

    const newPopulate = `const isChecked = STATE.filters[filterType].includes(option);
            const div = document.createElement('label');
            div.className = 'filter-option-custom';
            div.innerHTML = \`
                <input type="checkbox" id="\${filterType}_\${option}" value="\${option}" 
                       \${isChecked ? 'checked' : ''} data-filter-type="\${filterType}">
                <span class="custom-checkbox"></span>
                <span class="option-label">\${option}</span>
            \`;
            container.appendChild(div);`;

    js = js.replace(oldPopulate, newPopulate);

    // Replace applyFilter closing logic
    const oldApply = `window.closeFilterModal(filterType + 'Modal');`;
    const newApply = `const wrapper = document.getElementById(filterType + 'DropdownWrapper');
        if (wrapper) wrapper.classList.remove('active');`;
    
    js = js.replace(oldApply, newApply);

    fs.writeFileSync(jsFile, js);
    console.log("JS updated.");
}

// 3. Update CSS
if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');

    if (!css.includes('.filter-dropdown {')) {
        const newCSS = `
/* ============================================
   DYNAMIC FILTER DROPDOWNS
   ============================================ */
.filter-dropdown {
    position: relative;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: var(--col-muted, #94a3b8);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 8px;
}

.filter-btn .arrow-icon {
    transition: transform 0.3s ease;
    margin-left: auto;
}

.filter-dropdown.active .filter-btn .arrow-icon {
    transform: rotate(180deg);
    color: var(--col-accent, #f2d00d);
}

.filter-dropdown.active .filter-btn {
    color: var(--col-accent, #f2d00d);
    background: rgba(242, 208, 13, 0.1);
}

body.light .filter-dropdown.active .filter-btn {
    color: #8e7341;
    background: rgba(142, 115, 65, 0.1);
}

.filter-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 250px;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(242, 208, 13, 0.2);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 100;
}

body.light .filter-dropdown-menu {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(142, 115, 65, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filter-dropdown.active .filter-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.filter-options-scroll {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 0.5rem;
    margin-bottom: 1rem;
}

.filter-options-scroll::-webkit-scrollbar {
    width: 6px;
}
.filter-options-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}
.filter-options-scroll::-webkit-scrollbar-thumb {
    background: var(--col-accent, #f2d00d);
    border-radius: 4px;
}
body.light .filter-options-scroll::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}
body.light .filter-options-scroll::-webkit-scrollbar-thumb {
    background: #8e7341;
}

.filter-option-custom {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease;
}

.filter-option-custom:hover {
    background: rgba(255, 255, 255, 0.05);
}
body.light .filter-option-custom:hover {
    background: rgba(0, 0, 0, 0.05);
}

.filter-option-custom input[type="checkbox"] {
    display: none;
}

.custom-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
}

body.light .custom-checkbox {
    border: 2px solid rgba(0, 0, 0, 0.2);
}

.filter-option-custom input[type="checkbox"]:checked + .custom-checkbox {
    background: var(--col-accent, #f2d00d);
    border-color: var(--col-accent, #f2d00d);
}

body.light .filter-option-custom input[type="checkbox"]:checked + .custom-checkbox {
    background: #8e7341;
    border-color: #8e7341;
}

.custom-checkbox::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 8px;
    border: solid #000;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
}

body.light .custom-checkbox::after {
    border-color: #fff;
}

.filter-option-custom input[type="checkbox"]:checked + .custom-checkbox::after {
    opacity: 1;
}

.option-label {
    color: #fff;
    font-size: 0.9rem;
}

body.light .option-label {
    color: #333;
}

.filter-actions {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
}

body.light .filter-actions {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.apply-filter-btn {
    background: var(--premium-gradient, linear-gradient(135deg, #f2d00d 0%, #b8960e 100%));
    color: #000;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.apply-filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(242, 208, 13, 0.4);
}

body.light .apply-filter-btn {
    background: linear-gradient(135deg, #8e7341 0%, #68522b 100%);
    color: #fff;
}
body.light .apply-filter-btn:hover {
    box-shadow: 0 4px 15px rgba(142, 115, 65, 0.4);
}

@media (max-width: 768px) {
    .filter-dropdown {
        width: 100%;
    }
    .filter-dropdown-menu {
        position: static;
        width: 100%;
        margin-top: 0.5rem;
        box-shadow: none;
        transform: translateY(0);
        display: none;
        opacity: 1;
        visibility: visible;
        border: none;
        background: rgba(0,0,0,0.2);
    }
    body.light .filter-dropdown-menu {
        background: rgba(0,0,0,0.03);
        border: none;
    }
    .filter-dropdown.active .filter-dropdown-menu {
        display: block;
    }
}
`;
        
        css += newCSS;
        fs.writeFileSync(cssFile, css);
        console.log("CSS updated.");
    }
}
