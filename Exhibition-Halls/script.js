/* ============================================
   EXHIBITION HALLS LOGIC
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const hallsData = [
        {
            id: 'tutankhamun',
            name: 'Tutankhamun Galleries',
            era: 'New Kingdom',
            shortDesc: 'The complete collection of the Boy King, spanning over 5,000 artifacts from his undisturbed tomb.',
            longDesc: 'The Tutankhamun Galleries at the Grand Egyptian Museum showcase the entirety of the treasures found in the tomb of the boy-king in 1922. This collection, arguably the most important archaeological find in history, includes his iconic gold mask, chariots, and everyday objects that reveal the opulence of the 18th Dynasty.',
            image: 'images/tut.png', 
            artifacts: [
                {
                    name: "Tutankhamun's Mask",
                    period: "18th Dynasty",
                    desc: "The iconic funerary mask made of solid gold and inlaid with semi-precious stones.",
                    image: "images/tut.png"
                },
                {
                    name: "Golden Throne",
                    period: "18th Dynasty",
                    desc: "A wooden throne covered in gold leaf, featuring a scene of the king and his queen.",
                    image: "images/golden_throne.png"
                },
                {
                    name: "Ceremonial Chariot",
                    period: "18th Dynasty",
                    desc: "One of the highly decorated chariots used by the Pharaoh during state ceremonies.",
                    image: "images/ceremonial_chariot.png"
                }
            ]
        },
        {
            id: 'grand-hall',
            name: 'Grand Hall',
            era: 'New Kingdom',
            shortDesc: 'Stand beneath the towering presence of Ramses II in this colossal architectural masterpiece.',
            longDesc: 'The Grand Hall is the majestic entrance to the GEM, dominated by the 82-ton, 11-meter-high statue of King Ramses II. This hall serves as a gateway to the museum’s chronological journey, surrounded by colossal architectural elements from various dynasties.',
            image: 'images/grand.png',
            artifacts: [
                {
                    name: "Colossal Ramses II",
                    period: "19th Dynasty",
                    desc: "The centerpiece of the Grand Hall, greeting every visitor with divine authority.",
                    image: "images/grand.png"
                },
                {
                    name: "Granite Column of Merneptah",
                    period: "19th Dynasty",
                    desc: "A massive monolithic red granite column inscribed with the triumphs of King Merneptah.",
                    image: "images/column_merneptah.png"
                },
                {
                    name: "Colossus of a Ptolemaic King",
                    period: "Ptolemaic Period",
                    desc: "A massive red granite statue of a Ptolemaic ruler, showcasing the unique Greco-Egyptian artistic style.",
                    image: "images/ptolemaic_king.png"
                },
                {
                    name: "Colossus of a Ptolemaic Queen",
                    period: "Ptolemaic Period",
                    desc: "A majestic companion statue representing a Ptolemaic queen, carved in high-detail dark granite.",
                    image: "images/ptolemaic_queen.png"
                }
            ]
        },
        {
            id: 'royal-mummies',
            name: 'Royal Mummies Hall',
            era: 'New Kingdom',
            shortDesc: 'A silent tribute to the greatest rulers of the New Kingdom in a uniquely climate-controlled sanctuary.',
            longDesc: 'Designed to mimic the Valley of the Kings, this hall provides a solemn and reverent space for the remains of Egypt’s most powerful rulers. While the famous royal mummies reside at the NMEC, this hall showcases their magnificent sarcophagi, canopic chests, and the funerary equipment that accompanied them to eternity.',
            image: 'images/mummy.png',
            artifacts: [
                {
                    name: "Sarcophagus of Seti I",
                    period: "19th Dynasty",
                    desc: "An exquisitely carved alabaster sarcophagus with translucent scenes from the Book of Gates.",
                    image: "images/sarcophagus_seti.png"
                },
                {
                    name: "Canopic Chest of Queen Hetepheres",
                    period: "4th Dynasty",
                    desc: "A rare calcite chest used to preserve the internal organs of the queen, featuring intricate hieroglyphs.",
                    image: "images/canopic_chest_hetepheres.png"
                },
                {
                    name: "Golden Mask of Psusennes I",
                    period: "21st Dynasty",
                    desc: "A stunning solid gold funerary mask, often called the 'Silver Pharaoh's treasure,' showcasing exquisite craftsmanship.",
                    image: "images/mask_psusennes.png"
                }
            ]
        },
        {
            id: 'daily-life',
            name: 'Daily Life Hall',
            era: 'Middle Kingdom',
            shortDesc: 'Uncover the intimate world of ancient Egyptians through their jewelry, tools, and personal belongings.',
            longDesc: 'Beyond the grandeur of kings, this gallery explores the lives of average Egyptians—farmers, scribes, and artisans. It displays pottery, makeup kits, medical tools, and toys, illustrating a civilization vibrant with human activity.',
            image: 'images/daily.png',
            artifacts: [
                {
                    name: "Senet Game Board",
                    period: "New Kingdom",
                    desc: "The most popular board game of ancient Egypt, symbolizing the passage of the soul into the afterlife.",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
                },
                {
                    name: "Scribe's Palette and Pens",
                    period: "Middle Kingdom",
                    desc: "A wooden palette with ink wells for red and black ink, used by the highly respected class of Egyptian scribes.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    name: "Cosmetic Palette",
                    period: "Predynastic",
                    desc: "Used for grinding pigments for eye paint, a staple of Egyptian beauty culture and ritual.",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
                },
                {
                    name: "Ancient Egyptian Sandals",
                    period: "New Kingdom",
                    desc: "Remarkably preserved sandals woven from papyrus and palm leaves, worn by both elites and commoners.",
                    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
                }
            ]
        },
        {
            id: 'sculpture',
            name: 'Sculpture & Statues Hall',
            era: 'Old Kingdom',
            shortDesc: 'A procession of stone giants representing three thousand years of artistic perfection.',
            longDesc: 'This hall chronologically displays the development of Egyptian sculpture. From the rigid poses of the Old Kingdom to the naturalism of the Amarna period, it houses masterpieces in limestone, basalt, and granite.',
            image: 'images/sculpture.png',
            artifacts: [
                {
                    name: "The Seated Scribe",
                    period: "5th Dynasty",
                    desc: "A highly realistic limestone statue of a scribe in a traditional cross-legged position, capturing a moment of intense focus.",
                    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    name: "Statue of King Khafre",
                    period: "4th Dynasty",
                    desc: "A majestic diorite statue of the pyramid builder, protected by the wings of the falcon god Horus.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    name: "Group Statue of Menkaure",
                    period: "4th Dynasty",
                    desc: "A masterpiece of Egyptian sculpture showing the king accompanied by the goddess Hathor and a local deity.",
                    image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    name: "Bust of Nefertiti (Replica)",
                    period: "Amarna Period",
                    desc: "A stunning representation of the Great Royal Wife of Akhenaten, showcasing the unique realism of the era.",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
                }
            ]
        },
        {
            id: 'predynastic',
            name: 'Pre-Dynastic Period Hall',
            era: 'Old Kingdom',
            shortDesc: 'The dawn of civilization. Explore the origins of the state and the first hieroglyphic writings.',
            longDesc: 'This gallery focuses on the Neolithic and Pre-dynastic cultures (Naqada I-III) that laid the foundation for Pharonic civilization. It features early pottery, flint tools, and the evolution of symbolic representation.',
            image: 'images/predynastic.png',
            artifacts: [
                {
                    name: "Narmer Palette (Replica)",
                    period: "Protodynastic",
                    desc: "A significant archaeological find containing some of the earliest hieroglyphic inscriptions, depicting the unification of Egypt.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    name: "Painted Predynastic Vessel",
                    period: "Naqada II",
                    desc: "Red-on-buff pottery decorated with images of boats, animals, and hunting scenes, predating the unification.",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
                },
                {
                    name: "Ritual Flint Knife",
                    period: "Predynastic",
                    desc: "An expertly crafted flint knife with an intricately carved ivory handle, demonstrating early artistic mastery.",
                    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
                }
            ]
        },
        {
            id: 'afterlife',
            name: 'Beliefs in the Afterlife',
            era: 'New Kingdom',
            shortDesc: 'Journey to the West. Discover the rituals, mummification, and the magic of the afterlife.',
            longDesc: 'Funerary customs were central to ancient Egyptian life. This hall explores mummification, the weighing of the heart ceremony, and the items buried with the deceased to ensure eternal life in the Field of Reeds.',
            image: 'images/afterlife.png',
            artifacts: [
                {
                    name: "Anubis Guardian Statue",
                    period: "New Kingdom",
                    desc: "A life-sized statue of the jackal god Anubis, originally placed at the entrance of the burial chamber to guard the deceased.",
                    image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    name: "Book of the Dead Fragment",
                    period: "New Kingdom",
                    desc: "A papyrus scroll containing protective spells and rituals intended to guide the deceased through the underworld.",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
                },
                {
                    name: "Shabti Figures of Tutankhamun",
                    period: "18th Dynasty",
                    desc: "Small turquoise blue figurines intended to perform manual labor for the king in the afterlife.",
                    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
                }
            ]
        },
        {
            id: 'grecoroman',
            name: 'Greco-Roman Period Hall',
            era: 'Late Period',
            shortDesc: 'The fusion of worlds. Witness the cultural blend of ancient Egypt with Greek and Roman influences.',
            longDesc: 'After Alexander the Great’s conquest, Egypt became a crossroads of cultures. This gallery shows the fascinating hybrid art, where Pharaohs were depicted in Greek styles and Roman emperors adopted Egyptian titles.',
            image: 'images/grecoroman.png',
            artifacts: [
                {
                    name: "Rosetta Stone (Replica)",
                    period: "Ptolemaic Period",
                    desc: "The world-famous basalt slab that provided the key to deciphering ancient Egyptian hieroglyphs.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    name: "Fayum Mummy Portrait",
                    period: "Roman Era",
                    desc: "A remarkably realistic encaustic portrait of a young individual, combining Roman artistic style with Egyptian burial traditions.",
                    image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    name: "Statue of Sarapis",
                    period: "Ptolemaic Era",
                    desc: "A monumental representation of the god Sarapis, a deity created to unify Greek and Egyptian worshippers.",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
                }
            ]
        }
    ];


    // --- DOM ELEMENTS ---
    const hallsGrid = document.getElementById('hallsGrid');
    const artifactsSection = document.getElementById('artifactsSection');
    const artifactsGrid = document.getElementById('artifactsGrid');
    const currentHallName = document.getElementById('currentHallName');
    const currentHallDesc = document.getElementById('currentHallDesc');
    const backToHalls = document.getElementById('backToHalls');
    const eraButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('hallSearch');
    const headerSearch = document.querySelector('.header-right .search-box input');
    const hallsStatus = document.getElementById('hallsStatus');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    const breadcrumbLink = document.getElementById('breadcrumbLink');

    let lastScrollPos = 0;

    // --- FUNCTIONS ---

    // ============================================
    // ANIMATIONS & SCROLL EFFECTS
    // ============================================
    const initAnimations = () => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));
    };

    // ============================================
    // DATA RENDERING
    // ============================================
    const renderHalls = (filterEra = 'all', searchQuery = '') => {
        const filteredHalls = hallsData.filter(hall => {
            const matchesEra = filterEra === 'all' || hall.era === filterEra;
            const matchesSearch = hall.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                hall.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesEra && matchesSearch;
        });

        if (filteredHalls.length === 0) {
            hallsStatus.classList.remove('hidden');
        } else {
            hallsStatus.classList.add('hidden');
        }

        hallsGrid.innerHTML = '';
        filteredHalls.forEach((hall, index) => {
            const card = document.createElement('div');
            card.className = 'hall-card anim-reveal';
            card.style.transitionDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <img src="${hall.image}" alt="${hall.name}" class="hall-card-img">
                <div class="hall-card-info">
                    <h3>${hall.name}</h3>
                    <p>${hall.shortDesc}</p>
                </div>
            `;

            card.addEventListener('click', () => showHallDetails(hall.id));
            hallsGrid.appendChild(card);
        });
        
        // Observe newly rendered cards
        document.querySelectorAll('.anim-reveal').forEach(el => {
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
    };

    // Show Hall Details & Artifacts
    window.showHallDetails = (hallId) => {
        const hall = hallsData.find(h => h.id === hallId);
        if (!hall) return;

        currentHallName.innerText = hall.name;
        currentHallDesc.innerText = hall.longDesc;
        
        artifactsGrid.innerHTML = '';
        hall.artifacts.forEach(art => {
            const artCard = document.createElement('div');
            artCard.className = 'artifact-card anim-reveal';
            artCard.innerHTML = `
                <div class="artifact-img-box">
                    <img src="${art.image}" alt="${art.name}">
                    <button class="favorite-btn" onclick="toggleFavorite(this, event)">
                        <span class="material-symbols-outlined">favorite</span>
                    </button>
                </div>
                <div class="artifact-info">
                    <h4 class="artifact-name">${art.name}</h4>
                    <p class="artifact-desc">${art.desc}</p>
                </div>
                <div class="artifact-actions">
                    <button class="action-btn" onclick="playAudio('${art.name}', event)">
                        <span class="material-symbols-outlined">audiotrack</span>
                        <span>Listen</span>
                    </button>
                    <button class="action-btn">
                        <span class="material-symbols-outlined">view_in_ar</span>
                        <span>3D View</span>
                    </button>
                </div>
            `;
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

        // Update Breadcrumb
        breadcrumbCurrent.innerText = hall.name;
        
        // Toggle Sections
        lastScrollPos = window.scrollY;
        document.querySelectorAll('section').forEach(s => {
            if (!s.classList.contains('header') && !s.id.includes('artifacts') && !s.classList.contains('controls-section')) {
                s.style.display = 'none';
            }
        });
        artifactsSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // return to halls helper
    const returnToHalls = () => {
        if (!artifactsSection.classList.contains('hidden')) {
            artifactsSection.classList.add('hidden');
            document.querySelectorAll('section').forEach(s => s.style.display = 'block');
            window.scrollTo({ top: lastScrollPos, behavior: 'smooth' });
        }
    };

    // Toggle Back to Halls
    backToHalls.addEventListener('click', returnToHalls);
    breadcrumbLink.addEventListener('click', (e) => {
        e.preventDefault();
        returnToHalls();
    });

    // Interaction Handlers
    window.toggleFavorite = (btn, event) => {
        event.stopPropagation();
        btn.classList.toggle('active');
    };

    window.playAudio = (name, event) => {
        event.stopPropagation();
        alert(`Playing historical story for: ${name}... (Text-to-Speech UI)`);
    };

    // Filters and Search
    eraButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            returnToHalls();
            eraButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHalls(btn.dataset.filter, searchInput.value);
        });
    });

    const handleSearch = (val) => {
        returnToHalls();
        const activeEra = document.querySelector('.filter-btn.active').dataset.filter;
        renderHalls(activeEra, val);
        // Sync search inputs
        if (searchInput.value !== val) searchInput.value = val;
        if (headerSearch && headerSearch.value !== val) headerSearch.value = val;
    };

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    if (headerSearch) {
        headerSearch.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // --- INITIAL RENDER ---
    renderHalls();
    initAnimations();

    // ============================================
    // ROYAL ATMOSPHERE (Standardized - Local)
    // ============================================
    function createDust() {
        const container = document.getElementById('dust-container');
        if (!container) return;
        const count = 50;
        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = `${size}px`;
            dust.style.height = `${size}px`;
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            dust.style.opacity = Math.random() * 0.5;
            dust.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            container.appendChild(dust);
        }
    }

    function createShapes() {
        const container = document.getElementById('shapes-container');
        if (!container) return;
        const glyphs = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.fontSize = `${Math.random() * 20 + 20}px`;
            shape.style.animation = `rotateFloat ${Math.random() * 20 + 20}s ease-in-out infinite`;
            container.appendChild(shape);
        }
    }

    createDust();
    createShapes();
});
