document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const token = localStorage.getItem('token' );

    // 1. التحقق من التوكن وتوجيه المستخدم إذا لم يكن مسجلاً
    if (!token) {
        window.location.href = '../2.login/code.html';
        return;
    }

    // 2. دالة جلب بيانات المستخدم من الـ API
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                let user = data.user || data;
                
                // --- MOCK FRONTEND LOCALSTORAGE (Since PUT API is not ready) ---
                const localProfile = localStorage.getItem('localProfileData');
                if (localProfile) {
                    try {
                        const parsedMock = JSON.parse(localProfile);
                        user = { ...user, ...parsedMock };
                    } catch(e) {}
                }
                
                updateProfileUI(user);
            } else {
                // إذا انتهت صلاحية التوكن
                localStorage.removeItem('token');
                window.location.href = '../2.login/code.html';
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showNotification('Failed to load profile data.', 'error');
        }
    }

    // 3. تحديث عناصر الواجهة بالبيانات الحقيقية
    function updateProfileUI(user) {
        if (!user) return;

        // تحديث الاسم في الهيدر وفي قسم الـ Hero
        const nameElements = document.querySelectorAll('.profile-name, .user-info span:not(.user-level)');
        nameElements.forEach(el => {
            el.textContent = user.name || 'Explorer';
        });

        // تحديث الإيميل وتاريخ الانضمام في قسم المعلومات
        const infoValues = document.querySelectorAll('.info-value');
        if (infoValues.length >= 1) {
            infoValues[0].textContent = user.email || 'N/A';
        }
        if (infoValues.length >= 2) {
            const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'October 2023';
            infoValues[1].textContent = joinDate;
        }

        // تحديث الصورة الشخصية إذا كانت موجودة في البيانات
        if (user.profileImage) {
            const avatarImgs = document.querySelectorAll('.user-avatar img, .profile-image');
            avatarImgs.forEach(img => img.src = user.profileImage);
        }
    }

    // 4. تفعيل زر تسجيل الخروج (Logout)
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '../2.login/code.html';
            }, 1000);
        });
    }

    // 5. تفعيل تبديل الوضع الليلي والنهاري (Theme Toggle)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.innerHTML = isLight ? '<span class="material-symbols-outlined">dark_mode</span>' : '<span class="material-symbols-outlined">light_mode</span>';
        });

        // تحميل الوضع المفضل المحفوظ
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
        }
    }

    // 6. نظام التنبيهات البسيط
    function showNotification(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed; top:20px; right:20px; padding:15px 25px; border-radius:8px; color:white; z-index:2000; font-weight:bold; background:${type==='success'?'#10b981':'#ef4444'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // 7. جلب حجوزات المستخدم
    async function fetchUserBookings() {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
        
        let html = `
            <div class="section-header">
                <h2 class="section-title">Upcoming Visits / My History</h2>
            </div>
        `;

        bookings.forEach(b => {
             const itemsTotal = (b.items || []).reduce((acc, item) => acc + item.quantity, 0);
             const visitDate = b.date || b.createdAt ? new Date(b.date || b.createdAt).toLocaleDateString() : 'N/A';
             const totalAmount = b.totalPrice || b.totalAmount || b.amount || 0;
             
             html += `
             <div class="visit-card" style="margin-bottom: 20px;">
                 <div class="visit-image">
                     <img src="../111.png" alt="GEM">
                 </div>
                 <div class="visit-content">
                     <div class="visit-header">
                         <span class="visit-badge" style="background:#10b981; padding: 4px 8px; border-radius:4px; font-size:12px;">${b.status || 'Confirmed'}</span>
                         <h3 class="visit-title">Museum Booking</h3>
                         <p class="visit-subtitle">Booking ID: ${b._id || b.id || 'N/A'}</p>
                     </div>
                     <div class="visit-details">
                         <div class="detail-item">
                             <span class="detail-label">Date</span>
                             <span class="detail-value">${visitDate}</span>
                         </div>
                         <div class="detail-item">
                             <span class="detail-label">Tickets</span>
                             <span class="detail-value">${itemsTotal}</span>
                         </div>
                     </div>
                     <div class="visit-footer">
                         <span style="color:#ecb613; font-weight:bold">$${totalAmount}</span>
                         <a href="../success/success.html"><button class="btn btn-primary" style="padding: 6px 12px; font-size:12px;">VIEW TICKET</button></a>
                     </div>
                 </div>
             </div>
             `;
        });
        
        listContainer.innerHTML = html;
    }

    // 8. جلب مفضلات المستخدم وعرضها
    async function fetchUserFavorites() {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/my`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
            const period = art.period || art.dynasty || "Unknown Period";
            const id = art._id || art.id || fav.artifactId || fav._id;
            
            carousel.innerHTML += `
                <div class="artifact-card">
                    <div class="artifact-image">
                        <img src="${imageUrl}" alt="Artifact">
                        <button class="wishlist-btn" style="color:red;"><span class="material-symbols-outlined">favorite</span></button>
                    </div>
                    <a href="../Artifact-show/code.html?id=${id}" style="text-decoration:none;">
                        <h3 class="artifact-name" style=" color: #ecb613; ">${title}</h3>
                        <p class="artifact-period">${period}</p>
                    </a>
                </div>
            `;
        });
    }

    // تشغيل الجلب عند التحميل
    fetchUserProfile();
    fetchUserBookings();
    fetchUserFavorites();
});// جلب العناصر
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileCloseBtn = document.querySelector('.mobile-close-btn');

// فتح Sidebar
mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('active'); // يظهر الـSidebar
});

// غلق Sidebar
mobileCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('active'); // يخفي الـSidebar
});

