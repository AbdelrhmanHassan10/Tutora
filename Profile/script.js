// ============================================
// PROFILE SCRIPT - TUTORA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
    const token = localStorage.getItem('token');

    // 1. Auth check and redirection for private page
    if (!token) {
        window.location.href = '../2.login/code.html';
        return;
    }

    // 2. Fetch User Profile
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                let user = data.user || data;
                
                // Load local mock data if exists (for simulation)
                const localData = localStorage.getItem(`localProfileData_${user.email}`);
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        user = { ...parsed, ...user }; // Server data takes priority
                    } catch(e) {}
                }
                
                updateProfileUI(user);
                initAvatarSelection(user);
            } else if (response.status === 401) {
                if (window.handleLogout) window.handleLogout();
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    // 3. Update UI with User Data
    function updateProfileUI(user) {
        if (!user) return;
        
        // Update names in profile and header
        document.querySelectorAll('.profile-name').forEach(el => el.textContent = user.name || 'Explorer');
        const headerName = document.querySelector('.user-info span:not(.user-level)');
        if (headerName) headerName.textContent = user.name || 'Explorer';

        // Show Admin link if role is admin
        const adminLink = document.getElementById('adminLink');
        if (adminLink && user.role === 'admin') {
            adminLink.style.display = 'flex';
        }

        // Standardize Bio if present
        const bioText = document.querySelector('.profile-title');
        if (bioText && user.bio) { bioText.innerHTML = `<span data-i18n="profile.pharaonic_historian">${user.bio}</span>`; }

        // Update Join Date in Hero Section
        if (user.createdAt) {
            const date = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const heroJoinDate = document.getElementById('profile-join-date');
            if (heroJoinDate) {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                const dateOpts = { month: 'long', year: 'numeric' };
                const formattedDate = new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', dateOpts);
                const prefix = lang === 'ar' ? 'انضم في ' : 'Joined ';
                heroJoinDate.removeAttribute('data-i18n');
                heroJoinDate.innerHTML = `${prefix}${formattedDate}`;
                
                // Add listener to update date dynamically when language changes
                document.addEventListener('languageChanged', (e) => {
                    const newLang = e.detail.language || localStorage.getItem('preferredLanguage') || 'en';
                    const newFormattedDate = new Date(user.createdAt).toLocaleDateString(newLang === 'ar' ? 'ar-EG' : 'en-US', dateOpts);
                    const newPrefix = newLang === 'ar' ? 'انضم في ' : 'Joined ';
                    heroJoinDate.innerHTML = `${newPrefix}${newFormattedDate}`;
                });
            }
        }

        // Sync and Display Avatar
        const avatar = user.avatar || user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar');
        if (avatar) {
            localStorage.setItem('currentAvatar', avatar);
            if (window.syncGlobalAvatar) window.syncGlobalAvatar();
        }
    }

    // 4. Logout Handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (window.handleLogout) window.handleLogout();
        };
    }

    // 5. Sidebar Navigation Toggle
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.onclick = () => sidebar.classList.add('active');
    }
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.onclick = () => sidebar.classList.remove('active');
    }

    // 6. Fetch and Display Bookings
    async function fetchUserBookings() {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const bookings = Array.isArray(data) ? data : (data.data || []);
                updateBookingsUI(bookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    function updateBookingsUI(bookings) {
        const listContainer = document.getElementById('bookingsList');
        if (!listContainer) return;
        if (bookings.length === 0) {
            listContainer.innerHTML = '<p class="empty-state" style="padding: 1rem; color: #a0a0a0;">No bookings yet.</p>';
            return;
        }
        
        let html = '';
        bookings.forEach(b => {
             let itemsTotal = 0;
             if (b.tickets && Array.isArray(b.tickets)) {
                 itemsTotal = b.tickets.reduce((acc, tk) => acc + (tk.quantity || 0), 0);
             } else if (b.items && Array.isArray(b.items)) {
                 itemsTotal = b.items.reduce((acc, tk) => acc + (tk.quantity || 0), 0);
             }
             const visitDateObj = b.visitDate || b.date || b.createdAt;
             const visitDate = visitDateObj ? new Date(visitDateObj).toLocaleDateString() : 'N/A';
             
             html += `
             <div class="visit-card" style="margin-bottom: 20px;">
                <div class="visit-image">
                    <img src="../111.png" alt="GEM">
                </div>
                <div class="visit-content">
                    <div class="visit-header">
                        <span class="visit-badge">${b.status || 'Confirmed'}</span>
                        <h3 class="visit-title">${b.ticketType || 'Grand Egyptian Museum Entry'}</h3>
                        <p class="visit-subtitle">${itemsTotal} Visitors</p>
                    </div>
                    <div class="visit-details">
                        <div class="detail-item">
                            <span class="detail-label">Date</span>
                            <span class="detail-value">${visitDate}</span>
                        </div>
                    </div>
                    <div class="visit-footer">
                        <a href="../success/success.html">
                            <button class="btn btn-primary">VIEW TICKET</button>
                        </a>
                    </div>
                </div>
             </div>`;
        });
        listContainer.innerHTML = html;
    }

    // 7. Fetch and Display Favorites
    async function fetchUserFavorites() {
        try {
            const [favsResponse, countResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/favorites/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/favorites/count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            if (favsResponse.ok) {
                const data = await favsResponse.json();
                const favs = Array.isArray(data) ? data : (data.data || data.favorites || []);
                updateFavoritesUI(favs);
            }
            
            // Use real API count for stats accuracy
            if (countResponse.ok) {
                const countData = await countResponse.json();
                const artifactsStat = document.getElementById('artifacts-stat');
                if (artifactsStat) artifactsStat.textContent = countData.count || countData.data || 0;
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    function updateFavoritesUI(favorites) {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;
        if (favorites.length === 0) {
            carousel.innerHTML = '<p class="empty-state" style="padding: 1rem; color: #a0a0a0;">No saved treasures yet.</p>';
            return;
        }
        
        carousel.innerHTML = '';
        favorites.forEach(fav => {
            const art = fav.artifact || fav;
            if(!art) return;
            const title = art.title || art.name || "Artifact";
            const imageUrl = art.image || art.imageUrl || "./unnamed (1).png";
            const id = art._id || art.id;
            
            carousel.innerHTML += `
                <div class="artifact-card">
                    <div class="artifact-image">
                        <img src="${imageUrl}" alt="Artifact">
                        <button class="wishlist-btn" style="color:red;"><span class="material-symbols-outlined">favorite</span></button>
                    </div>
                    <a href="../Artifact-show/code.html?id=${id}" style="text-decoration:none;">
                        <h3 class="artifact-name">${title}</h3>
                    </a>
                </div>`;
        });

    }

    // 8. Avatar Selection Logic
    function initAvatarSelection(user) {
        if (!user) return;
        const avatarOptions = document.querySelectorAll('.avatar-option');
        const heroAvatar = document.querySelector('.profile-image');
        const headerAvatar = document.querySelector('.user-avatar img');
        
        // Get current avatar (prioritize user specific)
        const currentAvatar = user.avatar || user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar') || './profile-placeholder.svg';
        
        // Set active state in collection
        avatarOptions.forEach(option => {
            const avatarPath = option.getAttribute('data-avatar');
            const cleanPath = avatarPath.split('/').pop();
            const cleanCurrent = currentAvatar.split('/').pop();
            
            if (cleanCurrent === cleanPath) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
            
            option.addEventListener('click', async () => {
                const selectedAvatar = option.getAttribute('data-avatar');
                
                // Update active state
                avatarOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update User-Specific LocalStorage (for offline fallback)
                const localKey = `localProfileData_${user.email}`;
                const localData = JSON.parse(localStorage.getItem(localKey) || '{}');
                localData.profileImage = selectedAvatar;
                localStorage.setItem(localKey, JSON.stringify(localData));
                
                // Update Global Auth bridge
                localStorage.setItem('currentAvatar', selectedAvatar);
                
                // Update UI elements immediately
                if (heroAvatar) heroAvatar.src = selectedAvatar;
                if (headerAvatar) headerAvatar.src = selectedAvatar;
                
                // Trigger global sync
                if (window.syncGlobalAvatar) {
                    window.syncGlobalAvatar();
                }

                // --- SYNC WITH SERVER (Unify across devices) ---
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/me`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ profileImage: selectedAvatar })
                    });

                    if (response.ok) {
                        if (window.showPremiumToast) {
                            window.showPremiumToast('Profile identity synced across all devices!', 'success');
                        }
                    } else {
                        console.error('Server sync failed');
                    }
                } catch (error) {
                    console.error('Network error during sync:', error);
                }
            });
        });
    }

    // Initial Load - Note: initAvatarSelection is now called inside fetchUserProfile
    fetchUserProfile();
    fetchUserBookings();
    fetchUserFavorites();

    // 9. Share Status Modal Logic
    const shareBtn = document.getElementById('shareStatusBtn');
    const shareModal = document.getElementById('shareStatusModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const copyLinkBtn = document.getElementById('copyShareLink');

    const toggleModal = (show) => {
        if (!shareModal) return;
        if (show) {
            // Update Modal Content before showing
            const name = document.querySelector('.profile-name').textContent;
            const avatar = document.querySelector('.profile-image').src;
            const artCount = document.getElementById('artifacts-stat').textContent;
            const exhCount = document.getElementById('exhibitions-stat').textContent;
            const joinDateText = document.getElementById('profile-join-date')?.textContent.replace('Joined ', '') || 'Dec 2022';

            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-avatar').src = avatar;
            document.getElementById('modal-artifacts').textContent = artCount;
            document.getElementById('modal-exhibitions').textContent = exhCount;
            
            const modalIssued = document.getElementById('modal-issued-date');
            if (modalIssued) modalIssued.textContent = `Issued: ${joinDateText}`;

            shareModal.classList.add('active');
        } else {
            shareModal.classList.remove('active');
        }
    };

    if (shareBtn) shareBtn.onclick = () => toggleModal(true);
    if (closeShareModal) closeShareModal.onclick = () => toggleModal(false);
    if (modalOverlay) modalOverlay.onclick = () => toggleModal(false);

    if (copyLinkBtn) {
        copyLinkBtn.onclick = async () => {
            const name = document.querySelector('.profile-name').textContent;
            let avatar = document.querySelector('.profile-image').src;
            
            // Re-optimize: Finalize short link preference
            // If it's a data: URL (custom upload), we fallback to the default explorer icon to keep link TINY
            if (avatar.startsWith('data:')) {
                avatar = 'unnamed.png'; 
            } else {
                avatar = avatar.split('/').pop();
            }

            const artCount = document.getElementById('artifacts-stat').textContent;
            const exhCount = document.getElementById('exhibitions-stat').textContent;

            const shareData = {
                n: name,
                a: avatar,
                c: artCount,
                e: exhCount
            };

            const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
            
            // Fix file:// protocol for local testing shareability
            const baseUrl = window.location.origin === 'null' || !window.location.origin 
                            ? window.location.href.split('profile.html')[0] 
                            : window.location.origin + window.location.pathname.replace('profile.html', '');
            
            const shareUrl = `${baseUrl}id.html?e=${encoded}`;
            
            const shareTitle = `${name}'s Official Explorer Status`;
            const shareText = `Check out my pharaonic achievements and artifacts discovered at the Grand Egyptian Museum!`;

            // Try Native Share First (Makes it a real clickable link with preview)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: shareUrl
                    });
                    if (window.showPremiumToast) window.showPremiumToast('Passport shared successfully!', 'success');
                } catch (err) {
                    console.log('Share cancelled or failed', err);
                }
            } else {
                // Fallback to Clipboard (Standard method)
                navigator.clipboard.writeText(shareUrl).then(() => {
                    if (window.showPremiumToast) {
                        window.showPremiumToast('Compact Official Link copied!', 'success');
                    } else {
                        alert('Official Link copied!');
                    }
                });
            }
        };
    }

    // --- Carousel Scroll Indicator Logic ---
    const carousel = document.querySelector('.carousel-container');
    const thumb = document.querySelector('.scroll-thumb');
    const track = document.querySelector('.scroll-track');

    if (carousel && thumb && track) {
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
            const scrollPercentage = (scrollLeft / scrollWidth);
            
            const maxMove = track.clientWidth - thumb.clientWidth;
            const currentMove = scrollPercentage * maxMove;
            
            thumb.style.transform = `translateX(${currentMove}px)`;
        });
        
        // Initial positioning
        thumb.style.transition = 'transform 0.1s ease-out';
    }

    // ============================================
    // NOTIFICATIONS SYSTEM
    // ============================================
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const notifBadge = document.getElementById('notifBadge');
    const notifList = document.getElementById('notifList');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    if (notifBtn && notifDropdown) {
        // Toggle dropdown
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                notifDropdown.classList.remove('active');
            }
        });

        // Prevent closing when clicking inside the dropdown
        notifDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const loadNotifications = () => {
            const localUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = localUser._id;
            const userEmail = localUser.email;
            
            if (!userId) return;

            // Get global notifications
            const globalNotifs = JSON.parse(localStorage.getItem('gem_global_notifications') || '[]');
            
            // Filter notifications meant for this user or broadcasts
            const myNotifs = globalNotifs.filter(n => {
                if (!n.recipientId) return true; // broadcast
                return n.recipientId === userId || n.recipientId === userEmail; // direct
            });

            // Get read state
            const readNotifs = JSON.parse(localStorage.getItem(`gem_read_notifications_${userId}`) || '[]');
            
            let unreadCount = 0;
            
            if (myNotifs.length === 0) {
                notifList.innerHTML = '<div class="notif-empty">No notifications</div>';
                notifBadge.style.display = 'none';
                return;
            }

            notifList.innerHTML = '';
            myNotifs.forEach(n => {
                const isRead = readNotifs.includes(n._id);
                if (!isRead) unreadCount++;

                const div = document.createElement('div');
                div.className = `notif-item type-${n.type || 'info'} ${isRead ? 'read' : 'unread'}`;
                
                const dateObj = new Date(n.createdAt);
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                div.innerHTML = `
                    <div class="notif-item-header">
                        <span class="notif-title">${n.title}</span>
                        <span class="notif-date">${dateStr}</span>
                    </div>
                    <p class="notif-msg">${n.message}</p>
                `;

                // Mark specific notification as read
                div.addEventListener('click', () => {
                    if (!isRead) {
                        readNotifs.push(n._id);
                        localStorage.setItem(`gem_read_notifications_${userId}`, JSON.stringify(readNotifs));
                        loadNotifications();
                    }
                });

                notifList.appendChild(div);
            });

            if (unreadCount > 0) {
                notifBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                notifBadge.style.display = 'flex';
            } else {
                notifBadge.style.display = 'none';
            }
        };

        // Mark all as read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = localUser._id;
                const globalNotifs = JSON.parse(localStorage.getItem('gem_global_notifications') || '[]');
                const myNotifs = globalNotifs.filter(n => !n.recipientId || n.recipientId === userId || n.recipientId === localUser.email);
                
                const allIds = myNotifs.map(n => n._id);
                localStorage.setItem(`gem_read_notifications_${userId}`, JSON.stringify(allIds));
                loadNotifications();
            });
        }

        // Initialize
        loadNotifications();
        
        // Listen for updates from admin tab
        window.addEventListener('storage', (e) => {
            if (e.key === 'gem_global_notifications') {
                loadNotifications();
            }
        });
    }
});

