// ============================================
// EDIT PROFILE SCRIPT - TUTORA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const token = localStorage.getItem('token');

    // 1. Auth Check
    if (!token) {
        if (window.handleLogout) window.handleLogout();
        return;
    }

    // 2. Load User Data
    async function loadUserData() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                let user = result.data || result.user || result;
                
                // MOCK DATA SYNC
                const localData = localStorage.getItem(`localProfileData_${user.email}`);
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        user = { ...user, ...parsed };
                    } catch(e) {}
                }
                
                // Populate Fields
                const nameParts = (user.name || '').split(' ');
                document.getElementById('first_name').value = nameParts[0] || '';
                document.getElementById('last_name').value = nameParts.slice(1).join(' ') || '';
                document.getElementById('email').value = user.email || '';
                
                if (user.bio) document.getElementById('bio').value = user.bio;
                
                // Sync Image
                const avatar = user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar');
                if (avatar) {
                    document.getElementById('profileImagePreview').src = avatar;
                    localStorage.setItem('currentAvatar', avatar);
                    if (window.syncGlobalAvatar) window.syncGlobalAvatar();
                }
            } else if (response.status === 401) {
                if (window.handleLogout) window.handleLogout();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    loadUserData();

    // 3. Avatar Preview Handler
    const avatarUpload = document.getElementById('avatarUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');

    if (avatarUpload && profileImagePreview) {
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => profileImagePreview.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Form Submit Handler
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('first_name').value;
            const lastName = document.getElementById('last_name').value;
            const email = document.getElementById('email').value;
            const bio = document.getElementById('bio').value;

            const fullName = `${firstName} ${lastName}`.trim();
            const payload = { name: fullName, email: email, bio: bio };

            // Handle Avatar in payload
            if (profileImagePreview.src && !profileImagePreview.src.includes('unnamed.png')) {
                payload.profileImage = profileImagePreview.src;
                localStorage.setItem('currentAvatar', profileImagePreview.src);
            }

            // SIMULATION: Save to LocalStorage
            localStorage.setItem(`localProfileData_${email}`, JSON.stringify(payload));
            
            // Show Success UI
            const btnSave = document.querySelector('.btn-save');
            const originalText = btnSave.textContent;
            btnSave.textContent = 'Saving...';
            btnSave.disabled = true;

            setTimeout(() => {
                alert('Profile updated successfully!');
                btnSave.textContent = originalText;
                btnSave.disabled = false;
                
                if (window.syncGlobalAvatar) window.syncGlobalAvatar();
                window.location.href = '../Profile/profile.html';
            }, 1000);
        });
    }

    // 5. Shared UI Interactions (Sidebar, Theme)
    // Theme and Sidebar are handled centrally in global-core.js if IDs match.
    // If not, we can keep simple sidebar toggle here.
    const sidebarElement = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('closeSidebar');

    if (mobileBtn && sidebarElement) mobileBtn.onclick = () => sidebarElement.classList.add('active');
    if (closeBtn && sidebarElement) closeBtn.onclick = () => sidebarElement.classList.remove('active');
});
