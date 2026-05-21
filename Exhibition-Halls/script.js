/* ============================================
   EXHIBITION HALLS LOGIC
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const hallsData = [
    {
        id: 'grand-hall',
        name: 'Grand Hall (Atrium)',
        era: 'New Kingdom',
        shortDesc: 'Stand beneath the towering presence of Ramses II in this colossal architectural masterpiece.',
        longDesc: 'The Grand Hall is the majestic entrance to the GEM, dominated by the 82-ton, 11-meter-high statue of King Ramses II. This hall serves as a gateway to the museum’s chronological journey, surrounded by colossal architectural elements from various dynasties.',
        image: 'images/grand.png',
        artifacts: [
            { id: "ramses-colossus", name: "Colossal Ramses II", period: "19th Dynasty", desc: "The centerpiece of the Grand Hall, greeting every visitor with divine authority.", image: "images/grand.png" },
            { id: "merneptah-column", name: "Granite Column of Merneptah", period: "19th Dynasty", desc: "A massive monolithic red granite column inscribed with triumphs.", image: "images/column_merneptah.png" },
            { id: "ptolemaic-king", name: "Colossus of a Ptolemaic King", period: "Ptolemaic Period", desc: "A monumental statue retrieved from the Mediterranean sea.", image: "images/ptolemaic_king.png" },
            { id: "ptolemaic-queen", name: "Colossus of a Ptolemaic Queen", period: "Ptolemaic Period", desc: "A massive statue of a queen depicted in traditional Egyptian style.", image: "images/ptolemaic_queen.png" },
            { id: "victory-stele", name: "Victory Stele of Merneptah", period: "19th Dynasty", desc: "Also known as the Israel Stele, this massive black granite slab commemorates King Merneptah's military victories and contains the earliest known mention of 'Israel'.", image: "images/Victory Stele of Merneptah.png" },
            { id: "senusret-statue", name: "Statue of Senusret I", period: "12th Dynasty", desc: "A beautifully preserved seated colossus of the great Middle Kingdom pharaoh, showcasing the refined artistic style of the 12th Dynasty.", image: "images/Statue of Senusret I.png" }
        ]
    },
    {
        id: 'predynastic',
        name: 'Gallery 01: Pre-Dynastic & Early Dynastic',
        era: 'Old Kingdom',
        shortDesc: 'The dawn of civilization. Explore the earliest artifacts that paved the way for the Pharaohs.',
        longDesc: 'Before the pyramids were built, early Egyptians were already creating exquisite pottery, weapons, and ceremonial palettes. This gallery showcases the foundational era of Egyptian civilization before the unification of the Two Lands.',
        image: 'images/predynastic.png',
        artifacts: [
            { name: "Narmer Palette", period: "Early Dynastic", desc: "A historically vital shield-shaped palette depicting the unification of Upper and Lower Egypt.", image: "images/artifacts/narmer_palette.jpg" },
            { name: "Painted Predynastic Vessel", period: "Naqada II", desc: "A pottery jar beautifully decorated with flamingos and Nile boats.", image: "images/artifacts/painted_predynastic_vessel.jpg" },
            { name: "Ritual Flint Knife", period: "Naqada III", desc: "An exceptionally crafted ceremonial knife with an ivory handle.", image: "images/artifacts/ritual_flint_knife.jpg" },
            { name: "Battlefield Palette", period: "Naqada III", desc: "A ceremonial slate palette depicting lions and battle captives.", image: "images/artifacts/battlefield_palette.jpg" },
            { name: "Bull Palette", period: "Naqada III", desc: "A fragment of a ceremonial palette showing a bull trampling a human.", image: "images/artifacts/bull_palette.jpg" },
            { name: "Hunters Palette", period: "Naqada III", desc: "An intricately carved palette showing warriors hunting wild animals.", image: "images/artifacts/hunters_palette.jpg" }
        ]
    },
    {
        id: 'sculpture',
        name: 'Gallery 02: Old Kingdom Sculpture',
        era: 'Old Kingdom',
        shortDesc: 'Marvel at the lifelike masterpieces that immortalized the builders of the pyramids.',
        longDesc: 'The Old Kingdom is renowned for its breathtaking statuary. This gallery features masterpieces of royal and private sculpture, demonstrating the Egyptians\' early mastery over hard stones and their quest for eternal life.',
        image: 'images/sculpture.png',
        artifacts: [
            { name: "The Seated Scribe", period: "5th Dynasty", desc: "A remarkably lifelike statue of a scribe with penetrating crystal eyes.", image: "images/artifacts/the_seated_scribe.jpg" },
            { id: "ra-hotep-scribe", name: "The Royal Scribe Ra-Hotep", period: "4th Dynasty", desc: "A masterful stone-carved portrait of one of the Old Kingdom's highest intellectual officials.", image: "images/sculpture.png" },
            { name: "Statue of King Khafre", period: "4th Dynasty", desc: "A majestic diorite statue of the builder of the second pyramid of Giza.", image: "images/artifacts/statue_of_king_khafre.jpg" },
            { name: "Group Statue of Menkaure", period: "4th Dynasty", desc: "A stunning triad showing King Menkaure flanked by two deities.", image: "images/artifacts/group_statue_of_menkaure.jpg" },
            { name: "Rahotep and Nofret", period: "4th Dynasty", desc: "Beautifully painted limestone statues of a prince and his wife, retaining their original colors.", image: "images/artifacts/rahotep_and_nofret.jpg" },
            { name: "Kaaper", period: "5th Dynasty", desc: "Also known as Sheikh el-Beled, a highly realistic wooden statue.", image: "images/artifacts/kaaper.jpg" },
            { name: "Statue of Djoser", period: "3rd Dynasty", desc: "The oldest known life-size Egyptian statue, depicting the builder of the Step Pyramid.", image: "images/artifacts/statue_of_djoser.jpg" }
        ]
    },
    {
        id: 'old-kingdom-beliefs',
        name: 'Gallery 03: Old Kingdom Beliefs',
        era: 'Old Kingdom',
        shortDesc: 'Uncover the religious foundation and early funerary practices of ancient Egypt.',
        longDesc: 'Beliefs in the afterlife took physical form during the Old Kingdom. This gallery displays the earliest funerary texts, reserve heads, and magical objects intended to ensure the deceased\'s survival in the next world.',
        image: 'images/old-kingdom-beliefs.png',
        artifacts: [
            { id: "pyramid-texts", name: "Pyramid Texts Fragment", period: "Old Kingdom", desc: "The oldest known religious texts, carved to guide the king to the afterlife.", image: "images/artifacts/pyramid_texts_fragment.jpg" },
            { id: "reserve-head", name: "Reserve Head", period: "4th Dynasty", desc: "A mysterious limestone head, likely a substitute for the deceased's real head.", image: "images/artifacts/reserve_head.jpg" },
            { id: "false-door", name: "False Door Stele", period: "Old Kingdom", desc: "A magical portal for the Ka (soul) to receive offerings in the tomb.", image: "images/artifacts/false_door_stele.jpg" },
            { id: "hetepheres-bed", name: "Hetepheres I Bed", period: "4th Dynasty", desc: "A reconstructed golden canopy bed belonging to the mother of Khufu.", image: "images/artifacts/hetepheres_i_bed.jpg" },
            { id: "ptah-sokar-osiris", name: "Ptah-Sokar-Osiris figure", period: "Old Kingdom", desc: "A wooden statuette representing the synthesized funerary deity, ensuring protection and rebirth in the afterlife.", image: "images/artifacts/ptah_sokar_osiris.png" },
            { id: "khufu-ship", name: "Khufu Ship", period: "4th Dynasty", desc: "An intact full-size solar bark from the Giza pyramid complex.", image: "images/artifacts/khufu_ship.jpg" }
        ]
    },
    {
        id: 'daily-life',
        name: 'Gallery 04: Middle Kingdom Society',
        era: 'Middle Kingdom',
        shortDesc: 'A golden age of literature, arts, and the lives of ordinary citizens.',
        longDesc: 'The Middle Kingdom is considered the classical age of Egyptian culture. Step into the daily lives of ancient Egyptians through their intricate jewelry, tools, cosmetics, and fascinating recreational games.',
        image: 'images/daily.png',
        artifacts: [
            { id: "senet-board", name: "Senet Game Board", period: "Middle Kingdom", desc: "An ancient board game that held deep religious and recreational significance.", image: "images/artifacts/senet_board_ai.png" },
            { id: "meshti-governor", name: "Meshti the Governor", period: "Middle Kingdom", desc: "An exquisite alabaster statue showing the refined bureaucratic status of the Middle Kingdom.", image: "images/daily.png" },
            { id: "union-kheper", name: "Union of Kheper-ka-Ra-Seneb", period: "Middle Kingdom", desc: "A rare depiction of high-ranking officials unified in eternal service.", image: "images/daily.png" },
            { id: "sobek-nakht", name: "The Voice of Sobek-Nakht", period: "Middle Kingdom", desc: "A narrative journey into the life of a Middle Kingdom noble.", image: "images/daily.png" },
            { name: "Scribe's Palette", period: "Middle Kingdom", desc: "A wooden palette complete with ink wells and reed brushes used by scribes.", image: "images/artifacts/scribes_palette_ai.png" },
            { name: "Cosmetic Palette", period: "Middle Kingdom", desc: "Used for grinding malachite and galena for eye makeup.", image: "images/artifacts/cosmetic_palette.jpg" },
            { name: "Ancient Egyptian Sandals", period: "Middle Kingdom", desc: "Woven papyrus and palm leaf sandals for daily wear.", image: "images/artifacts/ancient_egyptian_sandals.jpg" },
            { name: "Pectoral of Senusret II", period: "12th Dynasty", desc: "A masterpiece of cloisonné jewelry from the Lahun treasure.", image: "images/artifacts/pectoral_senusret_ai.png" },
            { name: "William the Hippopotamus", period: "12th Dynasty", desc: "A famous faience hippopotamus statuette decorated with marsh flora.", image: "images/artifacts/william_hippo_ai.png" }
        ]
    },
    {
        id: 'middle-kingdom-kingship',
        name: 'Gallery 05: Middle Kingdom Kingship',
        era: 'Middle Kingdom',
        shortDesc: 'See the humanized, somber faces of the Middle Kingdom Pharaohs.',
        longDesc: 'Unlike the divine, idealized statues of the Old Kingdom, Middle Kingdom royal portraits display unprecedented realism. Look into the tired, burdened faces of kings who ruled during an era of profound political change.',
        image: 'images/middle-kingdom-kingship.png',
        artifacts: [
            { name: "Head of Senusret III", period: "12th Dynasty", desc: "Famous for its realistic, somber facial expression portraying the burden of rule.", image: "images/artifacts/senusret_iii_head_ai.png" },
            { name: "Statue of Amenemhat III", period: "12th Dynasty", desc: "A striking statue of the king with prominent cheekbones and heavy eyelids.", image: "images/artifacts/amenemhat_iii_statue_ai.png" },
            { name: "Osiride Pillar of Senusret I", period: "12th Dynasty", desc: "A pillar showing the king in the form of Osiris, the god of the dead.", image: "images/artifacts/osiride_pillar_ai.png" },
            { name: "Sphinx of Amenemhat III", period: "12th Dynasty", desc: "A uniquely stylized sphinx featuring a lion's mane instead of the traditional royal headdress.", image: "images/artifacts/sphinx_amenemhat_ai.png" },
            { name: "Block Statue of Senusret-senebefny", period: "12th Dynasty", desc: "An early example of a block statue, providing large surfaces for inscriptions.", image: "images/artifacts/block_statue_ai.png" },
            { name: "Mentuhotep II Statue", period: "11th Dynasty", desc: "A painted sandstone statue of the king who reunited Egypt.", image: "images/artifacts/mentuhotep_ii_statue_ai.png" }
        ]
    },
    {
        id: 'new-kingdom-society',
        name: 'Gallery 07: New Kingdom Society',
        era: 'New Kingdom',
        shortDesc: 'Experience the wealth, cosmopolitan life, and vivid culture of the Empire.',
        longDesc: 'During the New Kingdom, Egypt became a global empire. This gallery showcases the unprecedented wealth, luxurious lifestyles, vibrant fashion, and advanced tools used by the society that thrived along the Nile.',
        image: 'images/new-kingdom-society.png',
        artifacts: [
            { id: "ostracon-sketch", name: "Ostracon with a Sketch", period: "New Kingdom", desc: "A piece of limestone used as a sketchpad by an ancient artisan.", image: "images/artifacts/ostracon_sketch_ai.png" },
            { id: "bakenkhonsu-priest", name: "Priest Bakenkhonsu", period: "19th Dynasty", desc: "The high priest of Amun who served under Ramses the Great.", image: "images/new-kingdom-society.png" },
            { id: "nobleman-chair", name: "Nobleman's Chair", period: "18th Dynasty", desc: "An elegantly crafted wooden chair with ebony and ivory inlays, showing the luxury of the elite.", image: "images/artifacts/nobleman_chair.png" },
            { id: "floral-collar", name: "Floral Collar", period: "New Kingdom", desc: "A broad collar (Usekh) made of faience beads simulating real flowers.", image: "images/artifacts/floral_collar.jpg" },
            { id: "sistrum", name: "Sistrum", period: "New Kingdom", desc: "A sacred musical rattle used in religious ceremonies, particularly for Hathor.", image: "images/artifacts/sistrum.jpg" },
            { id: "shabti-box", name: "Shabti Box", period: "New Kingdom", desc: "A painted wooden box used to store the magical servant figurines, decorated with scenes of the afterlife.", image: "images/artifacts/shabti_box.png" },
            { id: "papyrus-ani", name: "Papyrus of Ani", period: "19th Dynasty", desc: "One of the most beautifully illustrated scrolls of the Book of the Dead, featuring the Weighing of the Heart.", image: "images/artifacts/papyrus_ani.png" }
        ]
    },
    {
        id: 'imperial-kingship',
        name: 'Gallery 08: Imperial Kingship',
        era: 'New Kingdom',
        shortDesc: 'Behold the mighty warrior pharaohs and the revolutionary Amarna period.',
        longDesc: 'This gallery focuses on the most famous pharaohs in history—from Thutmose III, the Napoleon of Egypt, to the controversial "heretic king" Akhenaten. Witness the evolution of imperial art and power.',
        image: 'images/imperial-kingship.png',
        artifacts: [
            { id: "thutmose-statue", name: "Statue of Thutmose III", period: "18th Dynasty", desc: "A schist statue of Egypt's greatest military commander.", image: "images/artifacts/thutmose_statue.png" },
            { id: "thutmose-triad", name: "Sacred Triad of Thutmose I", period: "18th Dynasty", desc: "A monumental representation of the early New Kingdom's divine authority.", image: "images/imperial-kingship.png" },
            { id: "kadesh-relief", name: "Relief of the Battle of Kadesh", period: "19th Dynasty", desc: "A deeply carved relief showing Ramses II charging into battle on his chariot.", image: "images/artifacts/relief_of_the_battle_of_kadesh.jpg" },
            { id: "hatshepsut-sphinx", name: "Seated Sphinx of Hatshepsut", period: "18th Dynasty", desc: "The female pharaoh depicted as a powerful sphinx.", image: "images/artifacts/seated_sphinx_of_hatshepsut.jpg" },
            { id: "memnon-fragment", name: "Colossi of Memnon fragment", period: "18th Dynasty", desc: "A massive piece of quartzite from the statues of Amenhotep III.", image: "images/artifacts/memnon_fragment.png" },
            { id: "akhenaten-statue", name: "Statue of Akhenaten", period: "18th Dynasty", desc: "A colossal statue from Karnak displaying the radical Amarna art style.", image: "images/artifacts/statue_of_akhenaten.jpg" },
            { id: "nefertiti-bust", name: "Nefertiti Bust", period: "18th Dynasty", desc: "A stunningly realistic stucco-coated limestone bust of the Great Royal Wife.", image: "images/artifacts/nefertiti_bust.jpg" }
        ]
    },
    {
        id: 'afterlife',
        name: 'Gallery 09: Beliefs in the Afterlife',
        era: 'New Kingdom',
        shortDesc: 'Journey through the perilous underworld as ancient Egyptians envisioned it.',
        longDesc: 'To achieve eternal life, an Egyptian had to pass through the treacherous Duat. Here you will find the magical amulets, intricate sarcophagi, and the Books of the Netherworld designed to protect the soul.',
        image: 'images/afterlife.png',
        artifacts: [
            { id: "anubis-guardian", name: "Anubis Guardian Statue", period: "New Kingdom", desc: "A jackal statue of Anubis, the god of embalming, guarding the dead.", image: "images/artifacts/anubis_guardian_statue.jpg" },
            { id: "afterlife-book", name: "Book of the Dead Fragment", period: "New Kingdom", desc: "A papyrus scroll containing spells to navigate the dangers of the underworld.", image: "images/artifacts/book_of_the_dead_fragment.jpg" },
            { id: "canopic-jars-afterlife", name: "Canopic Jars", period: "New Kingdom", desc: "Four alabaster jars used to store and protect the mummified organs.", image: "images/artifacts/canopic_jars.jpg" },
            { id: "weighing-heart-afterlife", name: "Weighing of the Heart Papyrus", period: "New Kingdom", desc: "An illustration of the ultimate judgment before Osiris.", image: "images/artifacts/weighing_heart.png" },
            { id: "heart-scarab", name: "Heart Scarab", period: "New Kingdom", desc: "An amulet placed over the heart to prevent it from testifying against the deceased.", image: "images/artifacts/heart_scarab.jpg" },
            { id: "mummy-cartonnage", name: "Mummy Cartonnage", period: "New Kingdom", desc: "A painted casing made of layers of linen and plaster to cover the mummy.", image: "images/artifacts/mummy_cartonnage.png" }
        ]
    },
    {
        id: 'tutankhamun',
        name: 'Special: Tutankhamun Galleries',
        era: 'New Kingdom',
        shortDesc: 'The complete, unedited collection of the boy king’s legendary treasures.',
        longDesc: `
            <p style="margin-bottom: 2rem;">For the first time since their discovery in 1922, over 5,000 artifacts from the tomb of King Tutankhamun are displayed together. Experience the gold, the mystery, and the legacy of the boy pharaoh.</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 2rem;">
                <div class="staircase-feature">
                    <div class="feature-icon-wrapper">
                        <span class="material-symbols-outlined">diamond</span>
                    </div>
                    <span class="feature-text">The Complete Collection (5,000+ Pieces)</span>
                </div>
                <div class="staircase-feature">
                    <div class="feature-icon-wrapper">
                        <span class="material-symbols-outlined">history_edu</span>
                    </div>
                    <span class="feature-text">The Legacy of the Boy Pharaoh</span>
                </div>
            </div>
        `,
        image: 'images/tut.png',
        artifacts: [
            { id: "tut-mask", name: "Tutankhamun's Mask", period: "18th Dynasty", desc: "The iconic 11kg solid gold death mask inlaid with semi-precious stones.", image: "images/artifacts/tut_mask.png" },
            { id: "tut-throne", name: "Golden Throne", period: "18th Dynasty", desc: "A wooden throne covered in gold foil, depicting Tutankhamun and his wife Ankhesenamun.", image: "images/artifacts/tut_throne.png" },
            { id: "tut-chariot", name: "Ceremonial Chariot", period: "18th Dynasty", desc: "An ornate ceremonial chariot made from wood and gold leaf.", image: "images/artifacts/tut_chariot.png" },
            { id: "tut-shrine", name: "Golden Shrine", period: "18th Dynasty", desc: "The outermost of four gilded shrines that protected the king's sarcophagus.", image: "images/artifacts/tut_shrine.png" },
            { id: "anubis-shrine", name: "Anubis Shrine", period: "18th Dynasty", desc: "A jackal figure of Anubis mounted on a portable gilded shrine.", image: "images/artifacts/anubis_shrine.png" },
            { id: "tut-pectoral", name: "Pectoral with Solar Scarab", period: "18th Dynasty", desc: "A complex piece of jewelry symbolizing the sun god's journey.", image: "images/artifacts/tut_pectoral.png" }
        ]
    },
    {
        id: 'royal-mummies',
        name: 'Special: Royal Mummies Hall',
        era: 'New Kingdom',
        shortDesc: 'Stand face-to-face with the legendary rulers of the New Kingdom.',
        longDesc: 'A solemn, respectful environment housing the preserved bodies of Egypt’s greatest pharaohs and queens. Discover the sophisticated mummification techniques that allowed them to survive millennia.',
        image: 'images/mummy.png',
        artifacts: [
            { id: "seti-sarcophagus", name: "Sarcophagus of Seti I", period: "19th Dynasty", desc: "An alabaster sarcophagus carved with intricate spells from the Book of Gates.", image: "images/artifacts/sarcophagus_of_seti_i.jpg" },
            { id: "seqenenre-mummy", name: "Mummy of Seqenenre Tao II", period: "17th Dynasty", desc: "The 'Martyr King' whose battle wounds tell the story of the struggle against the Hyksos.", image: "images/artifacts/seqenenre_mummy.png" },
            { id: "hatshepsut-mummy", name: "Mummy of Hatshepsut", period: "18th Dynasty", desc: "The remains of the powerful female pharaoh, identified by a missing tooth.", image: "images/artifacts/mummy_of_hatshepsut.jpg" },
            { id: "seti-mummy", name: "Mummy of Seti I", period: "19th Dynasty", desc: "One of the most perfectly preserved and noble-looking mummies ever discovered.", image: "images/artifacts/seti_mummy.png" },
            { id: "tiye-mummy", name: "Mummy of Queen Tiye", period: "18th Dynasty", desc: "The 'Elder Lady' mummy, famous for her beautifully preserved long hair.", image: "images/artifacts/tiye_mummy.png" },
            { id: "merneptah-sarcophagus", name: "Sarcophagus of Merneptah", period: "19th Dynasty", desc: "The outermost granite sarcophagus of Ramses II's successor.", image: "images/artifacts/sarcophagus_of_merneptah.jpg" }
        ]
    },
    {
        id: 'grecoroman',
        name: 'Gallery 12: Greco-Roman Period',
        era: 'Greco-Roman',
        shortDesc: 'The fusion of worlds. Witness the cultural blend of ancient Egypt with Greek and Roman influences.',
        longDesc: 'After Alexander the Great’s conquest, Egypt became a crossroads of cultures. This gallery shows the fascinating hybrid art, where Pharaohs were depicted in Greek styles and Roman emperors adopted Egyptian titles.',
        image: 'images/grecoroman.png',
        artifacts: [
            { id: "rosetta-replica-gr", name: "Rosetta Stone Replica", period: "Ptolemaic Period", desc: "The world-famous basalt slab that provided the key to deciphering hieroglyphs.", image: "images/artifacts/rosetta_stone.png" },
            { id: "fayum-portrait-gr", name: "Fayum Mummy Portrait", period: "Roman Era", desc: "A remarkably realistic encaustic portrait combining Roman art with Egyptian traditions.", image: "images/artifacts/fayum_portrait.png" },
            { id: "sarapis-statue-gr", name: "Statue of Sarapis", period: "Ptolemaic Period", desc: "A syncretic deity blending Osiris and Apis with Greek gods.", image: "images/artifacts/sarapis_statue.png" },
            { id: "pompeys-pillar", name: "Pompeys Pillar", period: "Roman Era", desc: "A massive Roman triumphal column from Alexandria.", image: "images/artifacts/pompeys_pillar.png" },
            { id: "crocodile-mummy", name: "Crocodile Mummy", period: "Greco-Roman", desc: "A mummified crocodile honoring the god Sobek.", image: "images/artifacts/crocodile_mummy.png" },
            { id: "roman-emperor-pharaoh", name: "Roman Emperor as Pharaoh", period: "Roman Era", desc: "A statue depicting a Roman ruler in traditional Egyptian pharaonic dress.", image: "images/artifacts/roman_pharaoh.png" }
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
        currentHallDesc.innerHTML = hall.longDesc;
        
        artifactsGrid.innerHTML = '';
        hall.artifacts.forEach(art => {
            const artCard = document.createElement('div');
            artCard.className = 'artifact-card anim-reveal';
            
            const periodText = (art.period || hall.era).toUpperCase();
            
            artCard.innerHTML = `
                <div class="artifact-img-box">
                    <img src="${art.image}" alt="${art.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop';">
                    <button class="favorite-btn" onclick="toggleFavorite(this, event)">
                        <span class="material-symbols-outlined">favorite_border</span>
                    </button>
                </div>
                <div class="artifact-info">
                    <span class="artifact-period">${periodText}</span>
                    <h4 class="artifact-name">${art.name}</h4>
                    <p class="artifact-desc">${art.desc}</p>
                </div>
                <div class="artifact-actions">
                    <div class="artifact-location">
                        <span class="material-symbols-outlined">location_on</span>
                        <span>${hall.name}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; width: 100%; margin-top: 1rem;">
                        <button class="details-btn" style="flex: 1;" onclick="viewArtifact('${hall.id}', '${art.name.replace(/'/g, "\\'")}')">
                            <span>DETAILS</span>
                        </button>
                        <button class="details-btn ar-btn" style="flex: 1; background: linear-gradient(135deg, #40e0d0 0%, #d4af37 100%); color: #000; border: none;" onclick="window.location.href='../advanced 3D model/advanced-3D.html?id=${art.id || art.name.toLowerCase().replace(/\s+/g, '-')}'">
                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">view_in_ar</span>
                            <span>AR</span>
                        </button>
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

    // --- NAVIGATION LOGIC ---
    window.viewArtifact = (hallId, artName) => {
        const hall = hallsData.find(h => h.id === hallId);
        if (!hall) return;
        
        const art = hall.artifacts.find(a => a.name === artName);
        if (!art) return;

        // Determine a plausible material based on the name or hall
        const material = art.name.toLowerCase().includes('gold') ? 'Solid Gold' : 
                         art.name.toLowerCase().includes('granite') ? 'Red Granite' :
                         art.name.toLowerCase().includes('statue') ? 'Diorite' : 'Limestone';

        // Prepare data for Artifact-show page
        const artifactData = {
            id: art.id || 'custom',
            title: art.name,
            dynasty: art.period || hall.era,
            period: hall.era,
            image: art.image.startsWith('http') ? art.image : `../Exhibition-Halls/${art.image}`,
            introHeading: "The Masterpiece Revealed",
            introText: `${art.desc} This remarkable piece is a testament to the artistic excellence of the ${hall.era}. ${hall.longDesc.substring(0, 150)}...`,
            detailsHeading: "Historical Context & Artistry",
            detailsText: `Currently housed in ${hall.name}, this object serves as a vital window into ${hall.shortDesc.toLowerCase()}. Its intricate details and preserved state provide scholars with invaluable insights into the religious and social life of ancient Egyptians during this period.`,
            stats: [
                { label: "Material", value: material },
                { label: "Gallery", value: hall.name },
                { label: "Period", value: art.period || hall.era },
                { label: "Discovery", value: "Excavated near Giza" }
            ],
            quote: `The discovery of such a well-preserved ${art.name.toLowerCase()} marks a significant milestone in our understanding of ${hall.era} society.`,
            quoteAuthor: "Egyptian Antiquities Service"
        };

        sessionStorage.setItem('currentArtifact', JSON.stringify(artifactData));
        window.location.href = `../Artifact-show/code.html?id=${art.id || 'custom'}`;
    };

    // ============================================
    // ROYAL ATMOSPHERE (Standardized - Local)
    // ============================================
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        
        if (!dustContainer || !shapesContainer) return;

        // Create 50 dust particles for optimized performance
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 2 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            
            const duration = Math.random() * 8 + 12;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s infinite linear ${delay}s`;
            
            dustContainer.appendChild(particle);
        }
    }

    initRoyalAtmosphere();
});

