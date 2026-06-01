document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
    const eventGrid = document.querySelector('.event-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    let allEvents = [];
    let currentFilter = 'All Events';

    const STATIC_EVENTS = [
        { title: "The Golden King: Artifacts of a Legend", titleKey: "evt.c1_title", descKey: "evt.c1_desc", locKey: "evt.c1_loc", badgeKey: "evt.c1_badge", dateKey: "evt.c1_date", category: "Exhibitions", date: "2023-10-12", description: "A rare collection of personal jewelry and protective amulets recovered from the royal valley.", image: "../gettyimages-2177866414-612x612.jpg", location: "Gallery 4 • Premium", badge: "Selling Fast" },
        { title: "Papyrus Making Workshop", titleKey: "evt.c2_title", descKey: "evt.c2_desc", locKey: "evt.c2_loc", badgeKey: "evt.c2_badge", dateKey: "evt.c2_date", category: "Workshops", date: "Every Saturday", description: "Learn the ancient art of paper production using Nile River reeds under expert guidance.", image: "../gettyimages-2245643012-594x594.jpg", location: "Education Center", badge: "Selling Fast" },
        { title: "Sphinx Sound & Light Show", titleKey: "evt.c3_title", descKey: "evt.c3_desc", locKey: "evt.c3_loc", badgeKey: "evt.c3_badge", dateKey: "evt.c3_date", category: "Cultural Nights", date: "Nightly • 8:00 PM", description: "A spectacular journey through 5,000 years of history projected onto the ancient monuments.", image: "../10.jpg", location: "Main Plaza • Outdoor", badge: "Selling Fast" },
        { title: "Ramses the Great: Life & Legacy", titleKey: "evt.c4_title", descKey: "evt.c4_desc", locKey: "evt.c4_loc", badgeKey: "evt.c4_badge", category: "Exhibitions", date: "Permanent Collection", description: "Dedicated to Egypt's longest-reigning pharaoh, featuring the colossal statue from Memphis.", image: "../the-grand-egyptian-museum-fully-opens-completing-gizas-new-cultural-landmark_4.jpg", location: "Atrium • Historic", badge: "Selling Fast" },
        { title: "Egyptian Hieroglyphs 101", titleKey: "evt.c5_title", descKey: "evt.c5_desc", locKey: "evt.c5_loc", badgeKey: "evt.c5_badge", dateKey: "evt.c5_date", category: "Workshops", date: "Nov 05 • 2:00 PM", description: "An introductory lecture on deciphering the sacred carvings of the Old Kingdom.", image: "../pexels-meryemmeva-35270037.jpg", location: "Library Wing", badge: "Selling Fast" },
        { title: "Nile Sunset Jazz Sessions", titleKey: "evt.c6_title", descKey: "evt.c6_desc", locKey: "evt.c6_loc", badgeKey: "evt.c6_badge", dateKey: "evt.c6_date", category: "Cultural Nights", date: "Nov 10 • 6:30 PM", description: "Enjoy contemporary jazz fusion as the sun sets over the pyramids from our garden terrace.", image: "../the-grand-egyptian-museum-fully-opens-completing-gizas-new-cultural-landmark_7.jpg", location: "Museum Gardens", badge: "Selling Fast" },
        { title: "The Grand Discovery Tour", titleKey: "evt.c7_title", descKey: "evt.c7_desc", locKey: "evt.c7_loc", badgeKey: "evt.c7_badge", dateKey: "evt.c7_date", category: "Exhibitions", date: "Every Friday", description: "Join our expert archaeologists on an exclusive behind-the-scenes look at newly excavated pharaonic treasures.", image: "../8.jpg", location: "The Grand Hall", badge: "Exclusive" },
        { title: "Ancient Board Games Tournament", titleKey: "evt.c8_title", descKey: "evt.c8_desc", locKey: "evt.c8_loc", dateKey: "evt.c8_date", category: "Workshops", date: "Dec 01 • 9:00 AM", description: "Challenge yourself and learn the rules of Senet and Mehen in this interactive historical gaming event.", image: "../the-grand-egyptian-museum-fully-opens-completing-gizas-new-cultural-landmark_4.jpg", location: "Children's Museum" },
        { title: "Sunrise Yoga by the Pyramids", titleKey: "evt.c9_title", descKey: "evt.c9_desc", locKey: "evt.c9_loc", badgeKey: "evt.c9_badge", dateKey: "evt.c9_date", category: "Workshops", date: "Sunday • 5:30 AM", description: "Find inner peace with a guided yoga session facing the Great Pyramids at dawn.", image: "../10.jpg", location: "Outdoor Terrace", badge: "Limited" }
    ];

    function renderEvents() {
        if (!eventGrid) return;
        eventGrid.innerHTML = '';
        
        const filtered = allEvents.filter(evt => {
            const filterText = currentFilter.toLowerCase().trim();
            if (filterText === 'all events') return true;
            return evt.category && evt.category.toLowerCase().trim() === filterText;
        });

        if (filtered.length === 0) {
            eventGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #b3b3b3;">No events found in this category.</div>`;
            return;
        }

        filtered.forEach(event => {
            let dateDisplay = event.date;
            if (event.date && !isNaN(Date.parse(event.date))) {
                const dateObj = new Date(event.date);
                dateDisplay = dateObj.toLocaleDateString('en-US', { 
                    month: 'short', day: '2-digit', year: 'numeric' 
                });
            }

            const card = document.createElement('div');
            card.className = 'event-card'; // Removed reveal class to fix visibility
            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${event.badge ? `<div class="badge-selling" ${event.badgeKey ? 'data-i18n="' + event.badgeKey + '"' : ''}>${event.badge}</div>` : ''}
                    <button class="btn-favorite">
                        <span class="material-symbols-outlined" style="font-size: 1.25rem">favorite</span>
                    </button>
                    <div class="card-image" style="background-image: url('${event.image || '../museum.png'}')"></div>
                </div>
                <div class="card-body">
                    <div class="event-date">
                        <span class="material-symbols-outlined" style="font-size: 1rem">calendar_month</span>
                        <span ${event.dateKey ? 'data-i18n="' + event.dateKey + '"' : ''}>${dateDisplay}</span>
                    </div>
                    <h3 class="event-title" ${event.titleKey ? 'data-i18n="' + event.titleKey + '"' : ''}>${event.title}</h3>
                    <p class="event-desc" ${event.descKey ? 'data-i18n="' + event.descKey + '"' : ''}>${event.description || ''}</p>
                    <div class="card-footer">
                        <span class="event-location">
                            <span class="material-symbols-outlined" style="font-size: 1rem">location_on</span>
                            <span ${event.locKey ? 'data-i18n="' + event.locKey + '"' : ''}>${event.location || 'Main Hall'}</span>
                        </span>
                        <button class="btn-details">
                            <span data-i18n="evt.btn_view_details">View Details</span>
                            <span class="material-symbols-outlined" style="font-size: 1rem">arrow_forward</span>
                        </button>
                    </div>
                </div>
            `;
            eventGrid.appendChild(card);
        });
        
        if (window.TutoraLang && typeof window.TutoraLang.applyTranslations === 'function') {
            window.TutoraLang.applyTranslations();
        }
    }

    async function initializeEvents() {
        try {
            const res = await fetch(`${API_URL}/events`);
            let dynamicEvents = [];
            if (res.ok) {
                const data = await res.json();
                const fetched = (Array.isArray(data) ? data : (data.events || data.data || []));
                dynamicEvents = fetched.map(evt => ({
                    ...evt,
                    badge: "New Event",
                    location: evt.location || "Main Atrium",
                    image: evt.image || evt.imageUrl || '../museum.png'
                }));
            }
            
            allEvents = [...dynamicEvents, ...STATIC_EVENTS];
            renderEvents();
        } catch (error) {
            console.warn('Failed to load dynamic events, showing static only.', error);
            allEvents = STATIC_EVENTS;
            renderEvents();
        }
    }

    // Tab Filtering
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter || tab.textContent.trim();
            renderEvents();
        });
    });

    initializeEvents();
});
