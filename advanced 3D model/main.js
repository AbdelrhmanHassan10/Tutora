// ============================================
// ADVANCED 3D MODEL SCRIPT - PRO VERSION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Elements
    const mainImg = document.getElementById('mainImage');
    const mainVid = document.getElementById('mainVideo');
    const overlay = document.querySelector('.viewer-overlay');
    const playMainBtn = document.querySelector('.play-main-btn');
    
    // Progress Bar Elements
    const progressBar = document.querySelector('.video-progress');
    const progressFilled = document.querySelector('.progress-filled');
    const currentTimeEl = document.querySelector('.current-time');
    const durationTimeEl = document.querySelector('.duration-time');
    const controlsBar = document.querySelector('.video-controls-bar');

    // 2. URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentArtifactId = urlParams.get('id') || "tut-mask";

    // 3. Complete 13 Artifacts Mapping with Dynamic Descriptions
    const ARTIFACT_MAPPING = {
        "tut-mask": {
            name: "Golden Mask of Tutankhamun",
            dynasty: "18th Dynasty",
            id: "GEM-4402",
            desc: "Examine the world's most iconic masterpiece in sub-millimeter detail. Our AI storytelling engine recreates the burial rites through spatial audio and 3D reconstruction.",
            narrative: "Discover the journey from the Valley of the Kings to the Grand Egyptian Museum. Narrated by lead archaeologists.",
            material: "High-purity gold (22.5 carats), lapis lazuli from Afghanistan, and obsidian from the Red Sea coast.",
            insights: "Neural analysis reveals the mask was likely crafted in three distinct stages, combining rare alloys for eternal preservation.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Eternal_Mask_of_Tutankhamun_720p_caption_lvqxdw.mp4",
            image: "../suzi-kim-AVUvVdVKcSg-unsplash.jpg"
        },
        "ramses-colossus": {
            name: "Colossus of Ramses II",
            dynasty: "19th Dynasty",
            id: "GEM-1102",
            desc: "The monumental colossus of Ramses the Great. This 80-ton masterpiece has been digitally preserved to show the intricate details of Pharaonic authority.",
            narrative: "Trace the relocation of this massive statue from Memphis to the GEM entrance hall. A feat of modern engineering.",
            material: "Carved from a single block of red granite, transported over 500 miles down the Nile.",
            insights: "The statue's symmetry is near-perfect, suggesting advanced geometric knowledge by 19th Dynasty architects.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Eternal_Authority_of_Ramesses_II_720p_caption_tihhjj.mp4",
            image: "../ramesses-ii.webp"
        },
        "hatshepsut-mummy": {
            name: "Mummy of Hatshepsut",
            dynasty: "18th Dynasty",
            id: "GEM-3301",
            desc: "Experience the legacy of the Woman King. This 3D narrative explores the reign of Hatshepsut and her contributions to trade and art.",
            narrative: "Explore the discovery of KV60 and the identification of Egypt's greatest female Pharaoh through DNA analysis.",
            material: "Preserved using high-quality natron and resin, wrapped in fine linen inscribed with divine spells.",
            insights: "CT scans reveal Hatshepsut's health records, including her diet and the medical secrets of the 18th Dynasty.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/Hatshepsut__The_Woman_King_720p_caption_zrc5gd.mp4",
            image: "../Exhibition-Halls/images/artifacts/mummy_of_hatshepsut.jpg"
        },
        "thutmose-statue": {
            name: "Statue of Thutmose III",
            dynasty: "18th Dynasty",
            id: "GEM-5509",
            desc: "The Napoleon of Egypt. Thutmose III's legacy is captured here through cinematic reconstruction, showcasing the warrior king's divine power.",
            narrative: "The 17 military campaigns of Thutmose III, visualized through spatial mapping and historical artifacts.",
            material: "Fine crystalline limestone, polished to a mirror finish to represent the king's divine radiance.",
            insights: "Isotopic testing of the stone traces its origin to the Tura quarries, used exclusively for royal monuments.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Eternal_King__Thutmose_III_720p_caption_kbudjq.mp4",
            image: "../Exhibition-Halls/images/artifacts/thutmose_statue.png"
        },
        "statue-1": {
            name: "The Seated Scribe",
            dynasty: "5th Dynasty",
            id: "GEM-7721",
            desc: "The wisdom of the ages. Watch as the Seated Scribe's world comes to life through our AI-driven historical storytelling.",
            narrative: "Uncover the importance of literacy and bureaucracy in the Old Kingdom, narrated through the scribe's own perspective.",
            material: "Painted limestone with crystal, magnesite, and copper eyes that track the viewer from any angle.",
            insights: "Spectral imaging shows the original pigments were made from malachite and desert ochre.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Wisdom_of_the_Scribe_720p_caption_f6ihha.mp4",
            image: "../collection/The Seated Scribewebp.webp"
        },
        "meshti-governor": {
            name: "Meshti the Governor",
            dynasty: "Middle Kingdom",
            id: "GEM-2210",
            desc: "Alabaster reconstruction of a high-ranking Middle Kingdom official, revealing the bureaucratic excellence of the era.",
            narrative: "The daily life of a provincial governor, managing the grain and gold of the Middle Kingdom.",
            material: "Translucent Egyptian alabaster (calcite), carved with extreme precision to show garment details.",
            insights: "AI analysis of the facial features suggests a realistic portrait of the governor in his late fifties.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/Meshti__The_Alabaster_Governor_720p_caption_vxpxsp.mp4",
            image: "../Meshti the Governor.png"
        },
        "bakenkhonsu-priest": {
            name: "Priest Bakenkhonsu",
            dynasty: "19th Dynasty",
            id: "GEM-8832",
            desc: "Neural story of the High Priest of Amun under Ramses II, capturing the spiritual essence of the New Kingdom.",
            narrative: "The ritual duties within the Temple of Karnak, from dawn prayers to the secrets of the Holy of Holies.",
            material: "Dark grey basalt, one of the hardest stones used by ancient Egyptians to ensure eternal life.",
            insights: "The inscriptions on the back pillar reveal the priest's 70-year career serving three successive kings.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Eternal_Priest__Bakenkhonsu_III_720p_caption_of7atp.mp4",
            image: "../Priest Bakenkhonsu.png"
        },
        "sekhmet-statue": {
            name: "Statue of Sekhmet",
            dynasty: "New Kingdom",
            id: "GEM-6603",
            desc: "3D narrative of the lioness goddess of war and healing, exploring her dual nature in Egyptian mythology.",
            narrative: "The pacification of Sekhmet and her transformation into Bastet, protecting the Pharaoh in battle.",
            material: "Granodiorite from Aswan, textured to represent the lioness's fur and the goddess's divine power.",
            insights: "This statue was one of 730 commissioned by Amenhotep III to protect his funerary temple.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Wisdom_of_Sekhmet_720p_caption_vlrsvi.mp4",
            image: "../Statue of Sekhmet.webp"
        },
        "ra-hotep-scribe": {
            name: "Scribe Ra-Hotep",
            dynasty: "Old Kingdom",
            id: "GEM-1204",
            desc: "Wisdom of the stone. A rare portrait of a royal scribe, capturing the intellectual elite of the Pyramid Age.",
            narrative: "The education of a royal scribe and the sacred art of hieroglyphs in the 4th Dynasty court.",
            material: "Quartzite and copper inlays create a lifelike gaze that has fascinated archaeologists for decades.",
            insights: "The posture of Ra-Hotep is mathematically aligned with the golden ratio of Old Kingdom art.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/Wisdom_of_the_Stone__The_Royal_Scribe_Ra-Hotep_720p_caption_kqlkqm.mp4",
            image: "../Ra-Hotep.jfif"
        },
        "isis-legacy": {
            name: "The Legacy of Isis",
            dynasty: "Mythological",
            id: "GEM-9901",
            desc: "The divine magic of Isis. Explore the mythology of the Great Enchantress and her role in the resurrection of Osiris.",
            narrative: "The search for Osiris and the nursing of Horus in the Delta marshes, a cornerstone of Egyptian faith.",
            material: "Bronze with gold leaf gilding, representing the indestructible flesh of the gods.",
            insights: "The chemical composition of the bronze reveals advanced metallurgical techniques from the Late Period.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Legacy_of_Isis_720p_caption_hjgqbx.mp4",
            image: "../Statue-of-Isis-of-Coptos.webp"
        },
        "thutmose-triad": {
            name: "Triad of Thutmose I",
            dynasty: "18th Dynasty",
            id: "GEM-5501",
            desc: "The sacred triad of Thutmose I, Amun-Ra, and Mut. A masterpiece of New Kingdom theology and art.",
            narrative: "The divine selection of Thutmose I and the establishment of the Thutmosid dynasty's power.",
            material: "Red quartzite from Gebel el-Ahmar, known as the 'Sun Stone' for its vibrant color.",
            insights: "Virtual reconstruction shows the triad was originally placed to catch the first rays of the winter solstice.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Sacred_Triad_of_Thutmose_I_720p_caption_rcpohs.mp4",
            image: "../Triad-of-Ramesses-II-with-Amun-and-Mut.webp"
        },
        "kheper-ka-merit": {
            name: "Union of Kheper-ka-Ra",
            dynasty: "Middle Kingdom",
            id: "GEM-2215",
            desc: "The eternal union of Kheper-ka-Ra-Seneb and Merit. A rare family portrait showing the social values of the 12th Dynasty.",
            narrative: "The domestic life and marriage customs of the Middle Kingdom elite, revealed through their shared tomb.",
            material: "Soft cedar wood covered in painted plaster, preserved perfectly by the desert climate.",
            insights: "Micro-scans show the artist used over 15 different types of natural pigments for the clothing.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Union_of_Kheper-ka-Ra-Seneb_and_Merit_720p_caption_t9zj1m.mp4",
            image: "../Union of Kheper-ka-Ra.png"
        },
        "sobek-nakht": {
            name: "Voice of Sobek-Nakht",
            dynasty: "13th Dynasty",
            id: "GEM-1302",
            desc: "The voice of the Middle Kingdom. An introspective study of a high official during a transitional period of history.",
            narrative: "The political challenges of the 13th Dynasty and the preservation of culture during times of change.",
            material: "Steatite (Soapstone), allowing for incredibly fine detail in the facial expression and jewelry.",
            insights: "The style represents a bridge between the idealism of the 12th Dynasty and 13th Dynasty realism.",
            video: "https://res.cloudinary.com/dxhwv4y3f/video/upload/The_Voice_of_Sobek-Nakht_720p_caption_xttlso.mp4",
            image: "../Sobek-Nakht.png"
        }
    };

    // 4. Update UI Function (Dynamic Content)
    function updateArtifactUI(id) {
        const data = ARTIFACT_MAPPING[id] || ARTIFACT_MAPPING["tut-mask"];
        currentArtifactId = id;
        
        // Update Main Info
        document.querySelector('.artifact-name').textContent = data.name;
        document.querySelector('.dynasty-tag').textContent = data.dynasty;
        document.querySelector('.catalog-id').textContent = `ID: ${data.id}`;
        document.querySelector('.artifact-desc').textContent = data.desc;

        // Update Accordion Content
        const accordionContents = document.querySelectorAll('.accordion-content p');
        if (accordionContents.length >= 3) {
            accordionContents[0].textContent = data.narrative || "Discover the journey of this masterpiece through history.";
            accordionContents[1].textContent = data.material || "Crafted with ancient techniques using premium materials.";
            accordionContents[2].textContent = data.insights || "AI analysis provides deep insights into its historical significance.";
        }
        
        // Update Media
        if (data.video) {
            mainImg.style.display = 'none';
            mainVid.style.display = 'block';
            mainVid.src = data.video;
            mainVid.load();
            mainVid.muted = true;
            
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';

            mainVid.play().catch(() => {});
        } else {
            mainVid.style.display = 'none';
            mainImg.style.display = 'block';
            mainImg.src = data.image;
            overlay.style.opacity = '1';
        }

        // Reset Progress Bar
        if(progressBar) progressBar.value = 0;
        if(progressFilled) progressFilled.style.width = '0%';
        if(currentTimeEl) currentTimeEl.textContent = '00:00';

        // Highlight Active Card
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.id === id) card.classList.add('active');
        });
    }

    // Time Formatter
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 5. Video Progress Logic
    if (mainVid) {
        mainVid.addEventListener('timeupdate', () => {
            const progress = (mainVid.currentTime / mainVid.duration) * 100;
            if (progressBar) progressBar.value = progress;
            if (progressFilled) progressFilled.style.width = `${progress}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(mainVid.currentTime);
        });

        mainVid.addEventListener('loadedmetadata', () => {
            if (durationTimeEl) durationTimeEl.textContent = formatTime(mainVid.duration);
        });

        if (progressBar) {
            progressBar.addEventListener('input', () => {
                const time = (progressBar.value / 100) * mainVid.duration;
                mainVid.currentTime = time;
            });
        }
    }

    // 6. Render Gallery Section
    function renderGallery() {
        const galleryContainer = document.getElementById('artifactGallery');
        if (!galleryContainer) return;

        Object.keys(ARTIFACT_MAPPING).forEach(id => {
            const data = ARTIFACT_MAPPING[id];
            const card = document.createElement('div');
            card.className = `gallery-card ${id === currentArtifactId ? 'active' : ''}`;
            card.dataset.id = id;
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${data.image}" alt="${data.name}">
                    <div class="play-overlay"><span class="material-symbols-outlined">play_circle</span></div>
                </div>
                <div class="card-info">
                    <h3>${data.name}</h3>
                    <p>${data.dynasty}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                updateArtifactUI(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            galleryContainer.appendChild(card);
        });
    }

    // 7. Interaction Listeners
    if (playMainBtn) {
        playMainBtn.addEventListener('click', () => {
            mainVid.muted = false;
            mainVid.play();
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        });
    }

    // Video/Image Click Logic
    function togglePlayback() {
        if (!mainVid.paused) {
            mainVid.pause();
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';
        } else {
            mainVid.muted = false;
            mainVid.play();
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    }

    if (mainVid) mainVid.addEventListener('click', togglePlayback);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('play-btn-container')) {
                togglePlayback();
            }
        });
    }

    // Accordion Logic
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            document.querySelectorAll('.accordion-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // 8. 3D Tilt
    const viewerDisplay = document.querySelector('.viewer-display');
    if (viewerDisplay) {
        viewerDisplay.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = viewerDisplay.getBoundingClientRect();
            const mouseX = (e.clientX - left) / width - 0.5;
            const mouseY = (e.clientY - top) / height - 0.5;
            const activeEl = mainVid.style.display === 'none' ? mainImg : mainVid;
            if (activeEl) {
                activeEl.style.transform = `scale(1.05) rotateY(${mouseX * 10}deg) rotateX(${mouseY * -10}deg) translateZ(20px)`;
            }
        });
        viewerDisplay.addEventListener('mouseleave', () => {
            const activeEl = mainVid.style.display === 'none' ? mainImg : mainVid;
            if (activeEl) activeEl.style.transform = `scale(1) rotateY(0) rotateX(0) translateZ(0)`;
        });
    }

    // 9. Scroll Animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.anim-on-scroll').forEach(el => revealObserver.observe(el));

    // Initialize
    renderGallery();
    updateArtifactUI(currentArtifactId);
});
