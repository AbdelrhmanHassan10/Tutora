const fs = require('fs');

let content = fs.readFileSync('Exhibition-Halls/script.js', 'utf8');

// I will find the start of showHallDetails and end of it.
const startStr = "    // Show Hall Details & Artifacts";
const endStr = "        // Update Breadcrumb";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

const correctFunction = `    // Show Hall Details & Artifacts
    window.showHallDetails = (hallId) => {
        const hall = hallsData.find(h => h.id === hallId);
        if (!hall) return;

        currentHallName.setAttribute('data-i18n', 'exhibition.halls.' + hall.id + '.name');
        currentHallName.innerText = typeof window.t === 'function' ? window.t('exhibition.halls.' + hall.id + '.name') || hall.name : hall.name;
        
        currentHallDesc.setAttribute('data-i18n-html', 'exhibition.halls.' + hall.id + '.longDesc');
        currentHallDesc.innerHTML = typeof window.t === 'function' ? window.t('exhibition.halls.' + hall.id + '.longDesc') || hall.longDesc : hall.longDesc;
        
        artifactsGrid.innerHTML = '';
        hall.artifacts.forEach(art => {
            const artCard = document.createElement('div');
            artCard.className = 'artifact-card anim-reveal';
            
            const periodText = (art.period || hall.era).toUpperCase();
            const artId = art.id || art.name.replace(/\\s+/g, '_');
            
            artCard.innerHTML = \`
                <div class="artifact-img-box">
                    <img src="\${art.image}" alt="\${art.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop';">
                    <button class="favorite-btn" onclick="toggleFavorite(this, event)">
                        <span class="material-symbols-outlined">favorite_border</span>
                    </button>
                </div>
                <div class="artifact-info">
                    <span class="artifact-period">\${periodText}</span>
                    <h4 class="artifact-name" data-i18n="exhibition.artifacts.\${artId}.name">\${typeof window.t === "function" ? window.t("exhibition.artifacts."+artId+".name") || art.name : art.name}</h4>
                    <p class="artifact-desc" data-i18n="exhibition.artifacts.\${artId}.desc">\${typeof window.t === "function" ? window.t("exhibition.artifacts."+artId+".desc") || art.desc : art.desc}</p>
                </div>
                <div class="artifact-actions">
                    <div class="artifact-location">
                        <span class="material-symbols-outlined">location_on</span>
                        <span>\${hall.name}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; width: 100%; margin-top: 1rem;">
                        <button class="details-btn" style="flex: 1;" onclick="viewArtifact('\${hall.id}', '\${art.name.replace(/'/g, "\\\\'")}')">
                            <span>DETAILS</span>
                        </button>
                        <button class="details-btn ar-btn" style="flex: 1; background: linear-gradient(135deg, #40e0d0 0%, #d4af37 100%); color: #000; border: none;" onclick="window.location.href='../advanced 3D model/advanced-3D.html?id=\${art.id || art.name.toLowerCase().replace(/\\s+/g, '-')}'">
                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">view_in_ar</span>
                            <span>AR</span>
                        </button>
                    </div>
                </div>
            \`;
            artifactsGrid.appendChild(artCard);
        });

        // Observe new artifacts
        document.querySelectorAll('.artifact-card').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(el);
        });

`;

content = content.substring(0, startIdx) + correctFunction + content.substring(endIdx);
fs.writeFileSync('Exhibition-Halls/script.js', content);
