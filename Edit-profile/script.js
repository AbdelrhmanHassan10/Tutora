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

    // Define Adjust visibility of the "Adjust Selection" button
    const updateAdjustButtonVisibility = () => {
        const adjustBtn = document.getElementById('adjustCurrentAvatar');
        const preview = document.getElementById('profileImagePreview');
        if (adjustBtn && preview) {
            const currentSrc = preview.src;
            if (currentSrc && !currentSrc.includes('unnamed.png')) {
                adjustBtn.style.display = 'block';
            } else {
                adjustBtn.style.display = 'none';
            }
        }
    };

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
                    if (typeof updateAdjustButtonVisibility === 'function') updateAdjustButtonVisibility();
                }
            } else if (response.status === 401) {
                if (window.handleLogout) window.handleLogout();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    loadUserData();

    // 3. Avatar Preview & Cropper Handler
    const avatarUpload = document.getElementById('avatarUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const cropModal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const confirmCrop = document.getElementById('confirmCrop');
    const cancelCrop = document.getElementById('cancelCrop');
    const closeCropModal = document.getElementById('closeCropModal');
    let cropper = null;

    if (avatarUpload && profileImagePreview) {
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Safety limit 30MB
                const maxSizeMB = 30;
                if (file.size > maxSizeMB * 1024 * 1024) {
                    if(window.showPremiumToast) window.showPremiumToast(`File is too large! Maximum ${maxSizeMB}MB allowed.`, 'error');
                    else alert(`File is too large! Maximum ${maxSizeMB}MB allowed.`);
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    imageToCrop.src = e.target.result;
                    cropModal.classList.add('active');
                    
                    if (cropper) cropper.destroy();
                    
                    // Initialize Cropper after modal is shown to avoid layout issues
                    setTimeout(() => {
                        cropper = new Cropper(imageToCrop, {
                            aspectRatio: 1,
                            viewMode: 1,
                            guides: true,
                            background: false,
                            autoCropArea: 0.8,
                            responsive: true,
                            checkOrientation: false
                        });
                    }, 100);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const closeCrop = () => {
        cropModal.classList.remove('active');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        avatarUpload.value = '';
    };

    if (cancelCrop) cancelCrop.onclick = closeCrop;
    if (closeCropModal) closeCropModal.onclick = closeCrop;

    if (confirmCrop) {
        confirmCrop.onclick = () => {
            if (!cropper) return;
            
            const canvas = cropper.getCroppedCanvas({
                width: 512,
                height: 512,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
            
            profileImagePreview.src = canvas.toDataURL('image/jpeg', 0.9);
            closeCrop();
            updateAdjustButtonVisibility();
            if(window.showPremiumToast) window.showPremiumToast('Artifact image adjusted successfully!', 'success');
        };
    }

    // Toggle button visibility on page load
    updateAdjustButtonVisibility();

    // Re-adjust current image logic
    const adjustBtn = document.getElementById('adjustCurrentAvatar');
    if (adjustBtn) {
        adjustBtn.onclick = () => {
            const currentSrc = profileImagePreview.src;
            if (currentSrc && !currentSrc.includes('unnamed.png')) {
                imageToCrop.src = currentSrc;
                cropModal.classList.add('active');
                
                if (cropper) cropper.destroy();
                
                setTimeout(() => {
                    cropper = new Cropper(imageToCrop, {
                        aspectRatio: 1,
                        viewMode: 1,
                        guides: true,
                        background: false,
                        autoCropArea: 1, // Start with everything visible for adjustment
                        responsive: true,
                        checkOrientation: false
                    });
                }, 100);
            }
        };
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
                const msg = 'Profile updated successfully!';
                if (window.showPremiumToast) {
                    window.showPremiumToast(msg, 'success');
                } else {
                    alert(msg);
                }
                
                btnSave.textContent = originalText;
                btnSave.disabled = false;
                
                if (window.syncGlobalAvatar) window.syncGlobalAvatar();
                
                // Slightly longer delay so the toast is seen before redirect
                setTimeout(() => {
                    window.location.href = '../Profile/profile.html';
                }, 1500);
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
