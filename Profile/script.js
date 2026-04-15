// ============================================
// PROFILE SCRIPT - TUTORA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
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
                        user = { ...user, ...parsed };
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

        // Standardize Bio if present
        const bioText = document.querySelector('.profile-title');
        if (bioText && user.bio) bioText.textContent = user.bio;

        // Update Join Date in Hero Section
        if (user.createdAt) {
            const date = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const heroJoinDate = document.getElementById('profile-join-date');
            if (heroJoinDate) heroJoinDate.textContent = `Joined ${date}`;
        }

        // Sync and Display Avatar
        const avatar = user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar');
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
        const listContainer = document.querySelector('.left-column');
        if (!listContainer || bookings.length === 0) return;
        
        let html = `<div class="section-header"><h2 class="section-title">My Bookings</h2></div>`;
        bookings.forEach(b => {
             const itemsTotal = (b.items || []).reduce((acc, item) => acc + item.quantity, 0);
             const visitDate = b.date || b.createdAt ? new Date(b.date || b.createdAt).toLocaleDateString() : 'N/A';
             const totalAmount = b.totalPrice || b.totalAmount || 0;
             
             html += `
             <div class="visit-card" style="margin-bottom: 20px;">
                 <div class="visit-image"><img src="../111.png" alt="GEM"></div>
                 <div class="visit-content">
                     <div class="visit-header">
                         <span class="visit-badge" style="background:#10b981;">${b.status || 'Confirmed'}</span>
                         <h3 class="visit-title">Museum Booking</h3>
                     </div>
                     <div class="visit-details">
                         <div class="detail-item"><span class="detail-label">Date</span><span class="detail-value">${visitDate}</span></div>
                         <div class="detail-item"><span class="detail-label">Tickets</span><span class="detail-value">${itemsTotal}</span></div>
                     </div>
                     <div class="visit-footer">
                         <span class="price-tag" style="color:#ecb613;">$${totalAmount}</span>
                         <a href="../success/success.html"><button class="btn btn-primary">VIEW TICKET</button></a>
                     </div>
                 </div>
             </div>`;
        });
        listContainer.innerHTML = html;

        // Update Explorer Stats: Exhibitions Toured
        const exhibitionStat = document.getElementById('exhibitions-stat');
        if (exhibitionStat) exhibitionStat.textContent = bookings.length;
    }

    // 7. Fetch and Display Favorites
    async function fetchUserFavorites() {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const favs = Array.isArray(data) ? data : (data.data || data.favorites || []);
                updateFavoritesUI(favs);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    function updateFavoritesUI(favorites) {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel || favorites.length === 0) return;
        
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

        // Update Explorer Stats: Artifacts Viewed
        const artifactsStat = document.getElementById('artifacts-stat');
        if (artifactsStat) artifactsStat.textContent = favorites.length;
    }

    // 8. Avatar Selection Logic
    function initAvatarSelection(user) {
        if (!user) return;
        const avatarOptions = document.querySelectorAll('.avatar-option');
        const heroAvatar = document.querySelector('.profile-image');
        const headerAvatar = document.querySelector('.user-avatar img');
        
        // Get current avatar (prioritize user specific)
        const currentAvatar = user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar') || './profile-placeholder.svg';
        
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
            
            option.addEventListener('click', () => {
                const selectedAvatar = option.getAttribute('data-avatar');
                
                // Update active state
                avatarOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update User-Specific LocalStorage
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

            const encoded = btoa(JSON.stringify(shareData));
            
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
});
