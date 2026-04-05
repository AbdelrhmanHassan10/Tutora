document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // THEME MANAGEMENT
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    let isDark = localStorage.getItem('theme') !== 'light';

    function updateTheme() {
        if (isDark) {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
        }
    }

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateTheme();
    });

    updateTheme(); // Init theme

    // ============================================
    // SIDEBAR MANAGEMENT
    // ============================================
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // ============================================
    // NOTIFICATION COMPONENT
    // ============================================
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        
        let icon = 'check_circle';
        if (type === 'error') icon = 'error';

        notif.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(notif);

        // trigger animation
        setTimeout(() => notif.classList.add('show'), 10);

        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3000);
    }

    // ============================================
    // API CONFIGURATION
    // ============================================
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';

    // ============================================
    // FETCH USER DATA (GET /api/auth/me)
    // ============================================
    async function loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to edit your profile', 'error');
            setTimeout(() => { window.location.href = '../2.login/code.html'; }, 2000);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                let user = result.data || result.user || result;
                
                // --- MOCK FRONTEND LOCALSTORAGE ---
                const localProfile = localStorage.getItem('localProfileData');
                if (localProfile) {
                    try {
                        const parsedMock = JSON.parse(localProfile);
                        user = { ...user, ...parsedMock };
                    } catch(e) {}
                }
                
                // Assuming user has 'name' which is full name, split into first/last
                const nameParts = (user.name || '').split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Populate Fields
                document.getElementById('first_name').value = firstName;
                document.getElementById('last_name').value = lastName;
                if (user.email) {
                    document.getElementById('email').value = user.email;
                }
                if (user.profileImage) {
                    document.getElementById('profileImagePreview').src = user.profileImage;
                }
            } else {
                showNotification('Failed to load user profile.', 'error');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showNotification('An error occurred while loading profile', 'error');
        }
    }

    // Execute load
    loadUserData();

    // ============================================
    // PROFILE AVATAR PREVIEW HANDLER
    // ============================================
    const avatarUpload = document.getElementById('avatarUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');

    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImagePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // ============================================
    // FORM SUBMIT INTERCEPTOR (Simulate Update)
    // ============================================
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) return;

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;

        const fullName = `${firstName} ${lastName}`.trim();

        // Construct update payload
        const payload = {
            name: fullName,
            email: email,
            bio: bio
        };

        // Save locally for frontend simulation until API is ready
        if (profileImagePreview.src && !profileImagePreview.src.includes('unnamed.png')) {
            payload.profileImage = profileImagePreview.src;
        }
        localStorage.setItem('localProfileData', JSON.stringify(payload));

        // NOTE: The update API (PUT) does not exist yet. 
        // We will mock the behavior for now.
        console.log('Sending Profile Update:', payload);
        
        // Mock successful save
        const btnSave = document.querySelector('.btn-save');
        const originalText = btnSave.textContent;
        btnSave.textContent = 'Saving...';
        btnSave.disabled = true;

        setTimeout(() => {
            showNotification('Profile updated successfully!', 'success');
            btnSave.textContent = originalText;
            btnSave.disabled = false;
            
            // Redirect back to profile page after 1.5 seconds
            setTimeout(() => {
                window.location.href = '../Profile/profile.html';
            }, 1500);
        }, 1200);

        // IF THE API IS READY, UNCOMMENT THIS SECTION:
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showNotification('Profile updated successfully!', 'success');
            } else {
                const data = await response.json();
                showNotification(data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Update Error:', error);
            showNotification('An error occurred during update', 'error');
        }
        */
    });
});
