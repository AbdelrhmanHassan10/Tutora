/* ============================================
   EXHIBITION HALLS LOGIC
   ============================================ */

/* GALLERY ENGINE V2.0 - MUSEUM GRADE DESIGN LOADED */
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
                    id: "6643b109558a239478145f07",
                    name: "Tutankhamun's Mask",
                    period: "18th Dynasty",
                    material: "Solid Gold & Lapis Lazuli",
                    desc: "This world-famous funerary mask is crafted from two layers of high-karat gold, inlaid with lapis lazuli, carnelian, and turquoise. It was designed to protect the king's spirit (Ka) and ensure his recognition in the afterlife, weighing over 10 kilograms of solid gold.",
                    image: "images/tut.png"
                },
                {
                    id: "golden-throne",
                    name: "Golden Throne",
                    period: "18th Dynasty",
                    material: "Gold-covered Wood",
                    desc: "A masterpiece of Amarna-style art, this wooden throne is encased in gold leaf and decorated with silver, glass, and semi-precious stones. The backrest depicts an intimate scene of Queen Ankhesenamun anointing King Tutankhamun under the life-giving rays of the Aten.",
                    image: "images/golden_throne.png"
                },
                {
                    id: "6643b109558a239478145f09",
                    name: "Ceremonial Chariot",
                    period: "18th Dynasty",
                    material: "Gilded Wood & Leather",
                    desc: "One of the six chariots found in the tomb's antechamber, this state chariot is light, fast, and covered in gold foil. Its intricate decorations show the Pharaoh as a warrior-king, crushing Egypt's enemies under his wheels in a display of divine power.",
                    image: "images/ceremonial_chariot.png"
                },
                {
                    id: "tut-fan",
                    name: "Golden Fan (Flabellum)",
                    period: "18th Dynasty",
                    material: "Gilded Wood",
                    desc: "A semi-circular fan found in the burial chamber, once held 42 ostrich feathers. The scenes on the gold foil show the king hunting ostriches in the desert to provide feathers for this very fan.",
                    image: "images/golden_fan.png"
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
                    id: "ramses-colossus",
                    name: "Colossal Ramses II",
                    period: "19th Dynasty",
                    material: "Red Granite",
                    desc: "Standing 11 meters tall and weighing 82 tons, this red granite giant was discovered in Memphis. It now stands in the Great Atrium of the GEM, precisely oriented so that the sun illuminates the king's face twice a year during the solar alignment event.",
                    image: "images/grand.png"
                },
                {
                    id: "column-merneptah",
                    name: "Granite Column of Merneptah",
                    period: "19th Dynasty",
                    material: "Red Granite",
                    desc: "This 5.6-meter-high monolithic red granite column originally stood in the temple of Ptah at Memphis. It is inscribed with the titles of Ramses II's son, King Merneptah, celebrating his military victories and divine favor.",
                    image: "images/column_merneptah.png"
                },
                {
                    id: "ptolemaic-king",
                    name: "Colossus of a Ptolemaic King",
                    period: "Ptolemaic Period",
                    material: "Red Granite",
                    desc: "Recovered from the waters of Alexandria, this massive red granite statue represents a Ptolemaic ruler dressed as a traditional Egyptian Pharaoh, bridging the gap between Hellenistic leadership and ancient Egyptian tradition.",
                    image: "images/ptolemaic_king.png"
                },
                {
                    id: "ptolemaic-queen",
                    name: "Colossus of a Ptolemaic Queen",
                    period: "Ptolemaic Period",
                    material: "Dark Granite",
                    desc: "Carved with exceptional detail in dark granite, this statue represents a queen of the Ptolemaic dynasty. The queen holds a double cornucopia, a Greek symbol of fertility and abundance, while wearing a traditional Egyptian tripartite wig.",
                    image: "images/ptolemaic_queen.png"
                },
                {
                    id: "victory-stele",
                    name: "Victory Stele of Amenhotep III",
                    period: "18th Dynasty",
                    material: "Black Granite",
                    desc: "A massive slab of black granite inscribed with the many triumphs and construction projects of Amenhotep III. It reflects the peak of New Kingdom power and artistic grandeur.",
                    image: "images/victory_stele.png"
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
                    id: "sarcophagus-seti",
                    name: "Sarcophagus of Seti I",
                    period: "19th Dynasty",
                    material: "Alabaster",
                    desc: "Carved from a single block of translucent alabaster, this sarcophagus is a masterpiece of New Kingdom art. Its interior and exterior are covered in delicate hieroglyphic inscriptions and scenes from the 'Book of Gates', once inlaid with blue copper-sulfate.",
                    image: "images/sarcophagus_seti.png"
                },
                {
                    id: "canopic-hetepheres",
                    name: "Canopic Chest of Queen Hetepheres",
                    period: "4th Dynasty",
                    material: "Calcite",
                    desc: "Found in a secret shaft near the Great Pyramid, this calcite (alabaster) chest is one of the oldest and most important funerary objects known. It contains four compartments that once held the viscera of the queen, protected by the divine will.",
                    image: "images/canopic_chest_hetepheres.png"
                },
                {
                    id: "mask-psusennes",
                    name: "Golden Mask of Psusennes I",
                    period: "21st Dynasty",
                    material: "Solid Gold",
                    desc: "A stunning rival to Tutankhamun's treasure, this solid gold mask from the 'Silver Pharaoh' was found in the royal necropolis at Tanis. It reflects the resilience and craftsmanship of the Third Intermediate Period, symbolizing the king's eternal divine nature.",
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
                    id: "senet-board",
                    name: "Senet Game Board",
                    period: "New Kingdom",
                    material: "Ivory & Ebony",
                    desc: "Senet was the most popular strategy game in ancient Egypt. This ivory-inlaid box served both as a game for leisure and a symbolic ritual representing the journey of the Ba (soul) through the trials of the underworld to reach eternal peace.",
                    image: "images/senet_board.png"
                },
                {
                    id: "scribe-palette",
                    name: "Scribe's Palette and Pens",
                    period: "Middle Kingdom",
                    material: "Wood",
                    desc: "The hallmark of the intellectual class, this wooden palette contains depressions for black (carbon) and red (ochre) ink. It belonged to a scribe who played a vital role in the administration, tax collection, and religious documentation of the state.",
                    image: "images/scribe_palette.png"
                },
                {
                    id: "cosmetic-palette",
                    name: "Cosmetic Palette",
                    period: "Predynastic",
                    material: "Siltstone",
                    desc: "Even before the Pharaohs, Egyptians valued beauty and ritual. This siltstone palette was used to grind green malachite or black galena into eye paint, which served both as protection against the desert sun and as a spiritual ward against evil.",
                    image: "images/cosmetic_palette.png"
                },
                {
                    id: "ancient-sandals",
                    name: "Ancient Egyptian Sandals",
                    period: "New Kingdom",
                    material: "Papyrus & Palm Leaf",
                    desc: "Woven with incredible precision from papyrus fibers and palm leaves, these sandals offer a glimpse into the sophisticated fashion of the New Kingdom. Such items were often buried with their owners to ensure comfort in the afterlife.",
                    image: "images/ancient_sandals.png"
                },
                {
                    id: "makeup-kit",
                    name: "Royal Makeup Kit",
                    period: "Middle Kingdom",
                    material: "Cedar wood, Ivory & Copper",
                    desc: "A luxury vanity box containing bronze mirrors, obsidian jars for oils, and copper applicators for eye paint. It belonged to a noblewoman, showcasing the high standards of hygiene and beauty in the Middle Kingdom.",
                    image: "images/makeup_kit.png"
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
                    id: "statue-1",
                    name: "The Seated Scribe",
                    period: "5th Dynasty",
                    material: "Painted Limestone",
                    desc: "Unearthed at Saqqara, this painted limestone statue is legendary for its realism. Unlike the idealized statues of Pharaohs, the scribe is shown with a soft physique, high cheekbones, and attentive rock-crystal eyes, eternally prepared to record the words of the gods.",
                    image: "images/seated_scribe.png"
                },
                {
                    id: "khafre-statue",
                    name: "Statue of King Khafre",
                    period: "4th Dynasty",
                    material: "Diorite",
                    desc: "Carved from extremely hard dark diorite, this statue depicts the builder of the second pyramid at Giza. The king sits on a throne flanked by lions, while the falcon god Horus perches behind his head, spreading his wings in a gesture of divine protection and unity.",
                    image: "images/khafre_statue.png"
                },
                {
                    id: "menkaure-statue",
                    name: "Group Statue of Menkaure",
                    period: "4th Dynasty",
                    material: "Greywacke",
                    desc: "This greywacke triad shows King Menkaure standing between the goddess Hathor and a personification of an Egyptian province (nome). It exemplifies the perfection of Old Kingdom artistic proportions and the intimate relationship between the monarch and the divine.",
                    image: "images/menkaure_statue.png"
                },
                {
                    id: "nefertiti-bust",
                    name: "Bust of Nefertiti (Replica)",
                    period: "Amarna Period",
                    material: "Painted Limestone",
                    desc: "This world-renowned bust captures the 'Great Royal Wife' of the heretic king Akhenaten. Known for its graceful neck and perfect symmetry, the original was found in the workshop of the sculptor Thutmose, serving as a model for royal portraiture during the Amarna revolution.",
                    image: "images/nefertiti_bust.png"
                },
                {
                    id: "djoser-statue",
                    name: "Statue of King Djoser",
                    period: "3rd Dynasty",
                    material: "Limestone",
                    desc: "The oldest life-size Egyptian statue known, found in a small chamber (Serdab) next to the Step Pyramid. The king's eyes are focused upward, looking toward the eternal stars through two small holes in the chamber wall.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
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
                    id: "narmer-palette",
                    name: "Narmer Palette (Replica)",
                    period: "Protodynastic",
                    material: "Siltstone",
                    desc: "Considered the first historical document in the world, this palette commemorates the unification of Upper and Lower Egypt under King Narmer. It establishes the artistic conventions—such as hierarchical scale and registers—that would define Egyptian art for the next 3,000 years.",
                    image: "images/narmer_palette.png"
                },
                {
                    id: "predynastic-vessel",
                    name: "Painted Predynastic Vessel",
                    period: "Naqada II",
                    material: "Pottery (Clay)",
                    desc: "This Gerzean pottery vessel is decorated with ochre-red paint depicting multi-oared boats, mountain ranges, and flamingos. It illustrates the importance of the Nile as a highway for trade and communication even before the dawn of the Pharaonic state.",
                    image: "images/predynastic_vessel.png"
                },
                {
                    id: "flint-knife",
                    name: "Ritual Flint Knife",
                    period: "Predynastic",
                    material: "Flint & Ivory",
                    desc: "Known as the Gebel el-Arak knife style, this object features a ripple-flaked flint blade of incredible sharpness. The ivory handle is carved with microscopic detail, showing complex battle scenes and mythological motifs, reflecting early Mesopotamian influence.",
                    image: "images/flint_knife.png"
                },
                {
                    id: "terracotta-figure",
                    name: "Terra-cotta Female Figure",
                    period: "Naqada I",
                    material: "Terra-cotta",
                    desc: "A stylized female figure with upraised arms, likely representing a dancer or a goddess. This early form of sculptural expression showcases the beginning of the spiritual and artistic journey of the Nile Valley inhabitants.",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
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
                    id: "anubis-statue",
                    name: "Anubis Guardian Statue",
                    period: "New Kingdom",
                    material: "Gilded Wood & Resin",
                    desc: "This recumbent jackal represents the god of mummification and the protector of tombs. Carved from wood and covered in black resin, Anubis was the 'Lord of the Sacred Land' who guided the deceased through the hall of Maat to their final judgment.",
                    image: "images/anubis_guardian.png"
                },
                {
                    id: "6643b109558a239478145f0c",
                    name: "Book of the Dead Fragment",
                    period: "New Kingdom",
                    material: "Papyrus",
                    desc: "This papyrus scroll fragment is a personalized collection of hymns, spells, and instructions to help the deceased navigate the dangers of the Duat (underworld). It includes the critical 'negative confession' needed to pass the weighing of the heart.",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
                },
                {
                    id: "shabti-tut",
                    name: "Shabti Figures of Tutankhamun",
                    period: "18th Dynasty",
                    material: "Blue Faience",
                    desc: "These blue faience figurines were magical workers for the afterlife. Each is inscribed with a spell from the Book of the Dead, ensuring that if the king were called upon to perform any manual labor in the next world, the shabti would stand and say, 'Here I am!'",
                    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    id: "mummy-mask",
                    name: "Gilded Mummy Mask",
                    period: "Late Period",
                    material: "Cartonnage & Gold Leaf",
                    desc: "A stunning mask made of cartonnage (layers of linen and plaster) and covered in gold leaf. It served to preserve the features of the deceased and provide them with a divine, incorruptible face for eternity.",
                    image: "images/mummy_mask.png"
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
                    id: "6643b109558a239478145f0a",
                    name: "Rosetta Stone (Replica)",
                    period: "Ptolemaic Era",
                    material: "Granodiorite",
                    desc: "The key to deciphering ancient Egyptian hieroglyphs. This high-fidelity replica represents the original stele inscribed with a decree in three scripts: Hieroglyphic, Demotic, and Ancient Greek, which allowed scholars to finally unlock the secrets of the Pharaohs.",
                    image: "images/rosetta_stone.png"
                },
                {
                    id: "fayum-portrait",
                    name: "Fayum Mummy Portrait",
                    period: "Roman Era",
                    material: "Encaustic on Wood",
                    desc: "These encaustic-on-wood paintings represent a unique cultural crossroads. While the subjects were mummified in the Egyptian tradition, their portraits were painted in a realistic Roman style, providing the most vivid glimpses we have of the people who lived 2,000 years ago.",
                    image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
                },
                {
                    id: "sarapis-statue",
                    name: "Statue of Sarapis",
                    period: "Ptolemaic Era",
                    material: "Marble",
                    desc: "Sarapis was a synthetic deity created by Ptolemy I to unite his Greek and Egyptian subjects. This statue combines the physical appearance of the Greek Zeus with the spiritual attributes of the Egyptian Osiris and Apis, symbolizing the multicultural peak of the era.",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
                },
                {
                    id: "alexander-statue",
                    name: "Bust of Alexander the Great",
                    period: "Early Ptolemaic",
                    material: "Marble",
                    desc: "A marble portrait of the Macedonian conqueror who founded Alexandria and was crowned Pharaoh. It captures his characteristic 'anastole' (upward-sweeping hair) and intense gaze, marking the beginning of a new chapter in Egyptian history.",
                    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
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
                <div class="arrow-icon">
                    <span class="material-symbols-outlined">arrow_forward</span>
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
                    <p class="artifact-period-label">${art.period || hall.era}</p>
                    <h3 class="artifact-name">${art.name}</h3>
                    <div class="artifact-meta-tags">
                        <span class="meta-tag material-tag">
                            <span class="material-symbols-outlined">diamond</span>
                            ${art.material || 'Various Materials'}
                        </span>
                    </div>
                    <p class="artifact-desc">${art.desc}</p>
                    
                    <div class="card-footer-divider"></div>
                    
                        <div class="artifact-card-footer">
                            <div class="artifact-location">
                                <span class="material-symbols-outlined">location_on</span>
                                <span>${hall.name}</span>
                            </div>
                            <div class="footer-actions">
                                <button class="view-3d-btn" title="View in 3D">
                                    <span class="material-symbols-outlined">view_in_ar</span>
                                </button>
                                <div class="arrow-icon-link" onclick="window.location.href='../Artifact-show/code.html?id=${art.id || ''}'">
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                        </div>
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
});
