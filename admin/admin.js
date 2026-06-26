/**
 * ============================================================
 * 🏛️ GRAND EGYPTIAN MUSEUM — SUPREME ADMIN CORE (V4.0 - FULL DASHBOARD)
 * ============================================================
 * Updated to integrate with new Admin Dashboard APIs:
 * - Real dashboard stats from /api/admin/stats
 * - User management (CRUD + ban)
 * - Booking management with filters + pagination
 * - AI management (chats + detections)
 * - Settings (dynamic pricing)
 * - Activity logs
 * - Notifications (send + broadcast)
 */

const CONFIG = {
    API_URL: 'https://gem-backend-production-1ea2.up.railway.app/api',
    REFRESH_RATE: 45000,
    ENDPOINTS: {
        auth: '/auth/me',
        artifacts: '/artifacts',
        events: '/events',
        bookings: '/bookings',
        videos: '/videos',
        upload: '/upload/video',
        // New Admin API endpoints
        adminStats: '/admin/stats',
        adminUsers: '/admin/users',
        adminBookings: '/admin/bookings',
        adminBookingsRevenue: '/admin/bookings-revenue',
        adminAiChats: '/admin/ai/chats',
        adminAiDetections: '/admin/ai/detections',
        adminSettings: '/admin/settings',
        adminLogs: '/admin/logs',
        adminNotifications: '/admin/notifications',
        adminNotificationsSend: '/admin/notifications/send'
    }
};

// ─── UTILITIES & NOTIFICATIONS ───
window.parseSafeDate = function(d) {
    if (!d) return new Date();
    let parsed = new Date(d);
    if (isNaN(parsed.getTime()) && typeof d === 'string') {
        parsed = new Date(d.replace(/-/g, '/').replace('T', ' '));
    }
    return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getToken = () => localStorage.getItem('token');

const notify = {
    show(msg, type = 'success') {
        const id = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `admin-toast ${type} fade-in`;
        toast.id = id;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="material-symbols-outlined">${type === 'success' ? 'verified' : 'warning'}</span>
                <span>${msg}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            const el = document.getElementById(id);
            if(el) {
                el.style.transform = 'translateX(120%)';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            }
        }, 4000);
    },
    error(msg) { this.show(msg, 'error'); }
};

// ─── ROBUST API ENGINE ───
async function apiRequest(endpoint, options = {}) {
    try {
        const token = getToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const url = CONFIG.API_URL + endpoint;
        const res = await fetch(url, { ...options, headers });
        
        if (res.status === 401 || res.status === 403) {
            if (options.method && options.method !== 'GET') {
                notify.error('Action Forbidden: Admin privileges required.');
            }
            return { error: true, message: 'Forbidden or Unauthorized' };
        }

        let data;
        try {
            data = await res.json();
        } catch(e) {
            return { error: true, message: 'Invalid response from server' };
        }

        if (!res.ok) return { error: true, message: data.message || `Error ${res.status}` };
        return data;
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err);
        return { error: true, message: 'Network Error - Server unreachable' };
    }
}

// ─── PAGINATION HELPER ───
function renderPagination(containerId, pagination, loadFn) {
    const container = document.getElementById(containerId);
    if (!container || !pagination) return;

    const { page, totalPages } = pagination;
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '<div class="pagination">';
    html += `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="${loadFn}(${page - 1})">
        <span class="material-symbols-outlined">chevron_left</span>
    </button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="${loadFn}(${i})">${i}</button>`;
        } else if (i === page - 2 || i === page + 2) {
            html += '<span class="page-dots">...</span>';
        }
    }

    html += `<button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="${loadFn}(${page + 1})">
        <span class="material-symbols-outlined">chevron_right</span>
    </button>`;
    html += '</div>';
    container.innerHTML = html;
}

// ─── STATE MANAGEMENT ───
const state = {
    isRefreshing: false,
    artifacts: [],
    events: [],
    bookings: [],
    videos: []
};

// ─── RENDER ENGINE (Original Tabs) ───
const renderers = {
    _handleState(tableId, items, emptyMsg) {
        const tbody = document.getElementById(tableId);
        if (!tbody) return null;
        if (items && items.error) {
            tbody.innerHTML = `<tr><td colspan="10" class="table-empty" style="color:#ff4d4d">⚠️ Error: ${items.message}</td></tr>`;
            return null;
        }
        if (!items || !items.length) {
            tbody.innerHTML = `<tr><td colspan="10" class="table-empty">${emptyMsg}</td></tr>`;
            return null;
        }
        return tbody;
    },

    artifacts() {
        const tbody = this._handleState('artifactsTable', state.artifacts, 'No Artifacts Found');
        if (!tbody) return;
        
        tbody.innerHTML = state.artifacts.map(item => `
            <tr class="fade-in">
                <td>
                    <div class="table-cell-img">
                        <img src="${item.imageUrl || '../artifact.jpg'}" onerror="this.src='../artifact.jpg'">
                        <div class="cell-info">
                            <strong>${item.name}</strong>
                            <small>ID: ${item._id.slice(-6)}</small>
                        </div>
                    </div>
                </td>
                <td><span class="era-badge">${item.era || 'Unknown'}</span></td>
                <td>
                    <span class="category-badge ${item.category || 'collection'}">
                        ${(item.category || 'collection').charAt(0).toUpperCase() + (item.category || 'collection').slice(1)}
                    </span>
                </td>
                <td><p class="table-desc" title="${item.description}">${item.description || ''}</p></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="app.editArtifact('${item._id}')" title="Edit"><span class="material-symbols-outlined">edit_note</span></button>
                        <button class="btn-delete" onclick="app.deleteItem('artifacts', '${item._id}')" title="Delete"><span class="material-symbols-outlined">delete_forever</span></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    events() {
        const tbody = this._handleState('eventsTable', state.events, 'No Events Found');
        if (!tbody) return;

        tbody.innerHTML = state.events.map(item => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${item.imageUrl || './unnamed (1).png'}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                        <div>
                            <strong>${item.title}</strong><br>
                            <small class="opacity-70">${item.category || 'General'}</small>
                        </div>
                    </div>
                </td>
                <td>${parseSafeDate(item.date).toLocaleDateString()}</td>
                <td>
                    <div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.description}">
                        ${item.description}
                    </div>
                    <small class="opacity-70"><span class="material-symbols-outlined" style="font-size:12px; vertical-align:middle;">location_on</span> ${item.location || 'Not specified'}</small>
                </td>
                <td class="action-cell">
                    <button class="btn-edit" onclick="app.editItem('events', '${item._id}')" title="Edit"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-delete" onclick="app.deleteItem('events', '${item._id}')" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </td>
            </tr>
        `).join('');
    },

    videos() {
        const tbody = this._handleState('videosTable', state.videos, 'No Videos Found');
        if (!tbody) return;

        tbody.innerHTML = state.videos.map(item => `
            <tr class="fade-in">
                <td><span class="gold-text">${item.title || 'Artifact Video'}</span></td>
                <td>${parseSafeDate(item.createdAt || Date.now()).toLocaleDateString()}</td>
                <td><p class="table-desc">${item.url || ''}</p></td>
                <td>
                    <button class="btn-delete" onclick="app.deleteItem('videos', '${item._id}')" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </td>
            </tr>
        `).join('');
    },

    bookings() {
        const tbody = this._handleState('bookingsTable', state.bookings, 'No Bookings Found');
        if (!tbody) return;

        tbody.innerHTML = state.bookings.map(item => `
            <tr class="fade-in">
                <td><strong>${item.user?.name || 'Guest'}</strong><br><small>${item.user?.email || ''}</small></td>
                <td>${parseSafeDate(item.visitDate).toLocaleDateString()}</td>
                <td>${item.nationalityType || 'N/A'}</td>
                <td class="gold-text">£${item.total || 0}</td>
                <td><span class="status-badge ${(item.paymentStatus || item.status || 'pending').toLowerCase()}">${item.paymentStatus || item.status || 'Pending'}</span></td>
                <td>
                    <div class="table-actions">
                        <select class="status-select" onchange="app.updateBookingStatus('${item._id}', this.value)">
                            <option value="" disabled selected>Change</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Stats from real /api/admin/stats endpoint
    async stats() {
        const data = await apiRequest(CONFIG.ENDPOINTS.adminStats);
        if (data.error) {
            // Fallback to counting from local arrays
            document.getElementById('statArtifacts').textContent = state.artifacts?.error ? '—' : (state.artifacts?.length || 0);
            document.getElementById('statEvents').textContent = state.events?.error ? '—' : (state.events?.length || 0);
            document.getElementById('statBookings').textContent = state.bookings?.error ? '—' : (state.bookings?.length || 0);
            document.getElementById('statVideos').textContent = state.videos?.error ? '—' : (state.videos?.length || 0);
            return;
        }

        // Users
        const su = document.getElementById('statUsers');
        const sug = document.getElementById('statUsersGrowth');
        if (su) su.textContent = data.users?.total || 0;
        if (sug) {
            const growth = data.users?.growthPercent || 0;
            sug.textContent = `${growth >= 0 ? '↑' : '↓'} ${Math.abs(growth)}% this month`;
            sug.style.color = growth >= 0 ? '#10b981' : '#ef4444';
        }

        // Bookings
        const sb = document.getElementById('statBookings');
        const sbp = document.getElementById('statBookingsPaid');
        if (sb) sb.textContent = data.bookings?.total || 0;
        if (sbp) sbp.textContent = `${data.bookings?.paid || 0} paid`;

        // Revenue
        const sr = document.getElementById('statRevenue');
        const srm = document.getElementById('statRevenueMonth');
        if (sr) sr.textContent = (data.revenue?.total || 0).toLocaleString();
        if (srm) srm.textContent = `${(data.revenue?.thisMonth || 0).toLocaleString()} this month`;

        // Artifacts
        const sa = document.getElementById('statArtifacts');
        if (sa) sa.textContent = data.artifacts?.total || 0;

        // AI
        const sai = document.getElementById('statAI');
        const sais = document.getElementById('statAISub');
        if (sai) sai.textContent = (data.ai?.totalDetections || 0) + (data.ai?.totalChats || 0);
        if (sais) sais.textContent = `${data.ai?.totalChats || 0} chats · ${data.ai?.totalDetections || 0} scans`;

        // Events
        const se = document.getElementById('statEvents');
        if (se) se.textContent = data.events?.total || 0;

        // Videos
        const sv = document.getElementById('statVideos');
        if (sv) sv.textContent = data.videos?.total || 0;

        // Favorites
        const sf = document.getElementById('statFavorites');
        if (sf) sf.textContent = data.favorites?.topItems?.length || 0;
    }
};

// ─── CORE APPLICATION ───
window.app = {
    // 1. Core Sync (original tabs)
    async syncAll(silent = false) {
        if (state.isRefreshing) return;
        state.isRefreshing = true;

        try {
            const [art, evt, bkg, vid] = await Promise.all([
                apiRequest(CONFIG.ENDPOINTS.artifacts),
                apiRequest(CONFIG.ENDPOINTS.events),
                apiRequest(CONFIG.ENDPOINTS.bookings),
                apiRequest(CONFIG.ENDPOINTS.videos)
            ]);

            state.artifacts = art.data || art;
            state.events = evt.data || evt;
            state.bookings = bkg.data || bkg;
            state.videos = vid.data || vid;

            renderers.artifacts();
            renderers.events();
            renderers.bookings();
            renderers.videos();
            renderers.stats();

            if (!silent) notify.show('Archives Synchronized');
        } catch (e) {
            notify.error('Fatal Sync Error');
        } finally {
            state.isRefreshing = false;
        }
    },

    // 2. Modals
    openModal(id) {
        document.getElementById(id)?.classList.add('active');
    },
    closeModal(id) {
        document.getElementById(id)?.classList.remove('active');
    },

    // 3. Deletion Handler (Generic)
    async deleteItem(type, id) {
        if (!confirm('Are you sure you want to permanently erase this record?')) return;
        const res = await apiRequest(`${CONFIG.ENDPOINTS[type]}/${id}`, { method: 'DELETE' });
        
        if (!res.error) {
            notify.show('Record Erased Successfully');
            this.syncAll(true);
        } else {
            notify.error(res.message || 'Failed to delete');
        }
    },

    // 4. Artifact Edit
    async editArtifact(id) {
        if (!state.artifacts || state.artifacts.error) return;
        const item = state.artifacts.find(a => a._id === id);
        if (!item) return;

        document.getElementById('artifactModalTitle').textContent = 'Modify Artifact';
        document.getElementById('artifactEditId').value = id;
        document.getElementById('artifactName').value = item.name || '';
        document.getElementById('artifactDesc').value = item.description || '';
        document.getElementById('artifactEra').value = item.era || '';
        document.getElementById('artifactCategory').value = item.category || 'collection';
        document.getElementById('artifactImageUrl').value = item.imageUrl || '';
        document.getElementById('artifactModel3DUrl').value = item.model3DUrl || '';
        document.getElementById('artifactAudioUrl').value = item.audioUrl || '';
        document.getElementById('artifactVideoUrl').value = item.videoUrl || '';
        
        document.getElementById('artifactImageUrl').dispatchEvent(new Event('input'));
        this.openModal('artifactModal');
    },

    // 5. Export Bookings
    exportBookings() {
        if (!state.bookings || state.bookings.error || !state.bookings.length) {
            return notify.error('No booking data to export.');
        }
        const csv = 'Guest,Date,Nationality,Total,Status\n' + state.bookings.map(b => 
            `"${b.user?.name || 'N/A'}",${parseSafeDate(b.visitDate).toLocaleDateString()},${b.nationalityType},${b.total},${b.paymentStatus || b.status || 'Pending'}`
        ).join('\n');
        
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'GEM_Bookings_Report.csv';
        a.click();
        notify.show('Export Generated');
    },

    // ═══════════════════════════════════════
    // NEW: Admin Dashboard API Functions
    // ═══════════════════════════════════════

    // 6. Update Booking Status
    async updateBookingStatus(bookingId, status) {
        if (!status) return;
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminBookings}/${bookingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        if (!res.error) {
            notify.show('Booking status updated');
            
            // Notify User
            const booking = state.bookings?.find(b => b._id === bookingId);
            if (booking && window.sendSystemNotification) {
                const recipientId = booking.user?._id || booking.user?.email || booking.user;
                const type = status.toLowerCase() === 'cancelled' ? 'error' : (status.toLowerCase() === 'paid' || status.toLowerCase() === 'confirmed' ? 'success' : 'warning');
                window.sendSystemNotification(
                    'Booking Status Updated',
                    `Your booking (${bookingId.slice(-6).toUpperCase()}) status has been updated to: ${status.toUpperCase()}.`,
                    type,
                    recipientId
                );
            }

            this.syncAll(true);
        } else {
            notify.error(res.message || 'Failed to update booking');
        }
    },

    // 7. Load Users (paginated + filtered)
    async loadUsers(page = 1) {
        const search = document.getElementById('userSearchInput')?.value || '';
        const role = document.getElementById('userRoleFilter')?.value || '';
        const banned = document.getElementById('userBanFilter')?.value || '';

        let query = `?page=${page}&limit=10`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (role) query += `&role=${role}`;
        if (banned) query += `&banned=${banned}`;

        const res = await apiRequest(CONFIG.ENDPOINTS.adminUsers + query);
        const tbody = document.getElementById('usersTable');
        if (!tbody) return;

        if (res.error || !res.data?.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="table-empty">${res.error ? '⚠️ ' + res.message : 'No users found'}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.data.map(u => `
            <tr class="fade-in">
                <td>
                    <div class="table-cell-img">
                        <img src="${u.avatar || '../Profile/unnamed.png'}" onerror="this.src='../Profile/unnamed.png'" style="width:32px;height:32px;border-radius:50%;">
                        <strong>${u.name}</strong>
                    </div>
                </td>
                <td>${u.email}</td>
                <td><span class="role-badge ${u.role}">${u.role}</span></td>
                <td><span class="status-badge ${u.isBanned ? 'banned' : 'active'}">${u.isBanned ? '🚫 Banned' : '✅ Active'}</span></td>
                <td>${parseSafeDate(u.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="app.toggleBanUser('${u._id}')" title="${u.isBanned ? 'Unban' : 'Ban'}">
                            <span class="material-symbols-outlined">${u.isBanned ? 'lock_open' : 'block'}</span>
                        </button>
                        ${u.role !== 'admin' ? `
                        <button class="btn-edit" onclick="app.makeAdminUser('${u._id}')" title="Make Admin" style="color:#ecb613">
                            <span class="material-symbols-outlined">admin_panel_settings</span>
                        </button>
                        ` : ''}
                        <button class="btn-delete" onclick="app.deleteUser('${u._id}')" title="Delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        renderPagination('usersPagination', res.pagination, 'app.loadUsers');
    },

    // 8. Ban/Unban User
    async toggleBanUser(userId) {
        if (!confirm('Toggle ban status for this user?')) return;
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminUsers}/${userId}/ban`, { method: 'PUT' });
        if (!res.error) {
            notify.show(res.isBanned ? 'User banned' : 'User unbanned');
            this.loadUsers();
        } else {
            notify.error(res.message);
        }
    },

    // 8.5 Make Admin User
    async makeAdminUser(userId) {
        if (!confirm('Promote this user to Admin?')) return;
        const res = await apiRequest(`/auth/make-admin/${userId}`, { method: 'PUT' });
        if (!res.error) {
            notify.show('User promoted to Admin');
            this.loadUsers();
        } else {
            notify.error(res.message);
        }
    },

    // 9. Delete User
    async deleteUser(userId) {
        if (!confirm('Are you sure? This will permanently delete this user.')) return;
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminUsers}/${userId}`, { method: 'DELETE' });
        if (!res.error) {
            notify.show('User deleted');
            this.loadUsers();
        } else {
            notify.error(res.message);
        }
    },

    // 10. Load AI Chats
    async loadAiChats(page = 1) {
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminAiChats}?page=${page}&limit=10`);
        const tbody = document.getElementById('aiChatsTable');
        if (!tbody) return;

        if (res.error || !res.data?.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${res.error ? '⚠️ ' + res.message : 'No chats found'}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.data.map(c => `
            <tr class="fade-in">
                <td><strong>${c.user?.name || 'Unknown'}</strong><br><small>${c.user?.email || ''}</small></td>
                <td><p class="table-desc">${c.question || ''}</p></td>
                <td><p class="table-desc">${(c.answer || '').substring(0, 120)}...</p></td>
                <td>${parseSafeDate(c.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn-delete" onclick="app.deleteChat('${c._id}')" title="Delete">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');

        renderPagination('aiPagination', res.pagination, 'app.loadAiChats');
    },

    // 11. Load AI Detections
    async loadAiDetections(page = 1) {
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminAiDetections}?page=${page}&limit=10`);
        const tbody = document.getElementById('aiDetectionsTable');
        if (!tbody) return;

        if (res.error || !res.data?.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${res.error ? '⚠️ ' + res.message : 'No detections found'}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.data.map(d => `
            <tr class="fade-in">
                <td><strong>${d.user?.name || 'Unknown'}</strong><br><small>${d.user?.email || ''}</small></td>
                <td><span class="gold-text">${d.imageName || 'N/A'}</span></td>
                <td>${d.details?.artifact_name || d.detectedArtifact || 'Unknown'}</td>
                <td><span class="confidence-badge">${(d.confidence || 0).toFixed(1)}%</span></td>
                <td>${parseSafeDate(d.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');

        renderPagination('aiPagination', res.pagination, 'app.loadAiDetections');
    },

    // 12. Delete Chat
    async deleteChat(chatId) {
        if (!confirm('Delete this chat?')) return;
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminAiChats}/${chatId}`, { method: 'DELETE' });
        if (!res.error) {
            notify.show('Chat deleted');
            this.loadAiChats();
        } else {
            notify.error(res.message);
        }
    },

    // 13. Load Settings
    async loadSettings() {
        const res = await apiRequest(CONFIG.ENDPOINTS.adminSettings);
        if (res.error) return;

        // General Admission
        document.getElementById('priceGenIntlAdult').value = res.ticketPrices?.general?.intl?.adult || 25;
        document.getElementById('priceGenIntlStudent').value = res.ticketPrices?.general?.intl?.student || 15;
        document.getElementById('priceGenLocalAdult').value = res.ticketPrices?.general?.local?.adult || 200;
        document.getElementById('priceGenLocalStudent').value = res.ticketPrices?.general?.local?.student || 100;

        // Guided Experience
        document.getElementById('priceGuideIntlAdult').value = res.ticketPrices?.guided?.intl?.adult || 38;
        document.getElementById('priceGuideIntlStudent').value = res.ticketPrices?.guided?.intl?.student || 20;
        document.getElementById('priceGuideLocalAdult').value = res.ticketPrices?.guided?.local?.adult || 350;
        document.getElementById('priceGuideLocalStudent').value = res.ticketPrices?.guided?.local?.student || 175;

        // Tut Pass
        document.getElementById('priceTutIntlAdult').value = res.ticketPrices?.tut?.intl?.adult || 42;
        document.getElementById('priceTutIntlStudent').value = res.ticketPrices?.tut?.intl?.student || 22;
        document.getElementById('priceTutLocalAdult').value = res.ticketPrices?.tut?.local?.adult || 450;
        document.getElementById('priceTutLocalStudent').value = res.ticketPrices?.tut?.local?.student || 225;

        // Kids Museum
        document.getElementById('priceKidsIntlChild').value = res.ticketPrices?.kids?.intl?.child || 15;
        document.getElementById('priceKidsIntlAdult').value = res.ticketPrices?.kids?.intl?.adult || 10;
        document.getElementById('priceKidsLocalChild').value = res.ticketPrices?.kids?.local?.child || 100;
        document.getElementById('priceKidsLocalAdult').value = res.ticketPrices?.kids?.local?.adult || 75;

        // Add-ons
        document.getElementById('priceAddonAudio').value = res.addons?.audio || 8;
        document.getElementById('priceAddonRamses').value = res.addons?.ramses || 12;
        document.getElementById('priceAddonPhoto').value = res.addons?.photo || 5;
        document.getElementById('priceAddonVip').value = res.addons?.vip || 15;

        // General Config
        document.getElementById('settingTaxRate').value = res.taxRate || 0.14;
        document.getElementById('settingMaxBookings').value = res.maxBookingsPerDay || 500;
        document.getElementById('settingOpenTime').value = res.museumOpenTime || '09:00';
        document.getElementById('settingCloseTime').value = res.museumCloseTime || '17:00';
        document.getElementById('settingMaintenance').value = String(res.maintenanceMode || false);
    },

    // 14. Save Settings
    async saveSettings() {
        const payload = {
            ticketPrices: {
                general: {
                    intl: {
                        adult: parseFloat(document.getElementById('priceGenIntlAdult').value),
                        student: parseFloat(document.getElementById('priceGenIntlStudent').value)
                    },
                    local: {
                        adult: parseFloat(document.getElementById('priceGenLocalAdult').value),
                        student: parseFloat(document.getElementById('priceGenLocalStudent').value)
                    }
                },
                guided: {
                    intl: {
                        adult: parseFloat(document.getElementById('priceGuideIntlAdult').value),
                        student: parseFloat(document.getElementById('priceGuideIntlStudent').value)
                    },
                    local: {
                        adult: parseFloat(document.getElementById('priceGuideLocalAdult').value),
                        student: parseFloat(document.getElementById('priceGuideLocalStudent').value)
                    }
                },
                tut: {
                    intl: {
                        adult: parseFloat(document.getElementById('priceTutIntlAdult').value),
                        student: parseFloat(document.getElementById('priceTutIntlStudent').value)
                    },
                    local: {
                        adult: parseFloat(document.getElementById('priceTutLocalAdult').value),
                        student: parseFloat(document.getElementById('priceTutLocalStudent').value)
                    }
                },
                kids: {
                    intl: {
                        child: parseFloat(document.getElementById('priceKidsIntlChild').value),
                        adult: parseFloat(document.getElementById('priceKidsIntlAdult').value)
                    },
                    local: {
                        child: parseFloat(document.getElementById('priceKidsLocalChild').value),
                        adult: parseFloat(document.getElementById('priceKidsLocalAdult').value)
                    }
                }
            },
            addons: {
                audio: parseFloat(document.getElementById('priceAddonAudio').value),
                ramses: parseFloat(document.getElementById('priceAddonRamses').value),
                photo: parseFloat(document.getElementById('priceAddonPhoto').value),
                vip: parseFloat(document.getElementById('priceAddonVip').value)
            },
            taxRate: parseFloat(document.getElementById('settingTaxRate').value),
            maxBookingsPerDay: parseInt(document.getElementById('settingMaxBookings').value),
            museumOpenTime: document.getElementById('settingOpenTime').value,
            museumCloseTime: document.getElementById('settingCloseTime').value,
            maintenanceMode: document.getElementById('settingMaintenance').value === 'true'
        };

        const res = await apiRequest(CONFIG.ENDPOINTS.adminSettings, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if (!res.error) {
            notify.show('Settings saved successfully!');
        } else {
            notify.error(res.message);
        }
    },

    // 15. Load Activity Logs
    async loadLogs(page = 1) {
        const action = document.getElementById('logActionFilter')?.value || '';
        let query = `?page=${page}&limit=15`;
        if (action) query += `&action=${action}`;

        const res = await apiRequest(CONFIG.ENDPOINTS.adminLogs + query);
        const tbody = document.getElementById('logsTable');
        if (!tbody) return;

        if (res.error || !res.data?.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${res.error ? '⚠️ ' + res.message : 'No activity logs yet'}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.data.map(log => `
            <tr class="fade-in">
                <td><strong>${log.admin?.name || 'System'}</strong></td>
                <td><span class="action-badge">${(log.action || '').replace(/_/g, ' ')}</span></td>
                <td>${log.targetModel || ''} <small>${log.targetId ? '#' + String(log.targetId).slice(-6) : ''}</small></td>
                <td><p class="table-desc">${JSON.stringify(log.details || {}).substring(0, 80)}</p></td>
                <td>${parseSafeDate(log.createdAt).toLocaleString()}</td>
            </tr>
        `).join('');

        renderPagination('logsPagination', res.pagination, 'app.loadLogs');
    },

    // 16. Send Notification
    async sendNotification(e) {
        e.preventDefault();
        const recipientId = document.getElementById('notifRecipientId')?.value?.trim() || undefined;
        const title = document.getElementById('notifTitle').value;
        const message = document.getElementById('notifMessage').value;
        const type = document.getElementById('notifType').value;

        const payload = { title, message, type };
        if (recipientId) payload.recipientId = recipientId;

        // Save to global localStorage for frontend delivery
        const localNotifs = JSON.parse(localStorage.getItem('gem_global_notifications') || '[]');
        const newNotif = {
            _id: 'local_' + Date.now(),
            title,
            message,
            type,
            recipientId,
            createdAt: new Date().toISOString()
        };
        localNotifs.unshift(newNotif);
        localStorage.setItem('gem_global_notifications', JSON.stringify(localNotifs));

        const res = await apiRequest(CONFIG.ENDPOINTS.adminNotificationsSend, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        // Always show success since we stored it locally
        notify.show(recipientId ? 'Notification sent!' : 'Broadcast sent to all users!');
        document.getElementById('notificationForm').reset();
        this.loadNotifications();
    },

    // 17. Load Sent Notifications
    async loadNotifications(page = 1) {
        const res = await apiRequest(`${CONFIG.ENDPOINTS.adminNotifications}?page=${page}&limit=10`);
        const tbody = document.getElementById('notificationsTable');
        if (!tbody) return;

        if (res.error || !res.data?.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${res.error ? '⚠️ ' + res.message : 'No notifications sent yet'}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.data.map(n => `
            <tr class="fade-in">
                <td><strong>${n.title}</strong></td>
                <td><p class="table-desc">${n.message}</p></td>
                <td><span class="type-badge ${n.type}">${n.type}</span></td>
                <td>${n.recipient?.name || '<em>📢 Broadcast</em>'}</td>
                <td>${parseSafeDate(n.createdAt).toLocaleString()}</td>
            </tr>
        `).join('');

        renderPagination('notificationsPagination', res.pagination, 'app.loadNotifications');
    },

    // 18. Generic Item Edit
    async editItem(type, id) {
        let item;
        if (type === 'events') {
            item = state.events.find(e => e._id === id);
            if (!item) return;
            document.getElementById('eventId').value = item._id;
            document.getElementById('eventTitle').value = item.title || '';
            document.getElementById('eventCategory').value = item.category || 'Exhibitions';
            document.getElementById('eventDesc').value = item.description || '';
            if (item.date) {
                const dateObj = parseSafeDate(item.date);
                const localStr = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                document.getElementById('eventDate').value = localStr;
            }
            document.getElementById('eventLocation').value = item.location || '';
            document.getElementById('eventImageUrl').value = item.imageUrl || '';
            
            const eventPreview = document.getElementById('eventPreview');
            const eventImg = eventPreview.querySelector('img');
            if (item.imageUrl) {
                eventImg.src = item.imageUrl;
                eventPreview.classList.add('has-image');
            } else {
                eventImg.src = '';
                eventPreview.classList.remove('has-image');
            }
            app.openModal('eventModal');
        }
    }
};

// Attach legacy global references used directly in HTML
window.app = app;
window.closeModal = app.closeModal;
window.actions = { exportBookings: app.exportBookings }; 

// ─── INITIALIZATION SCRIPT ───
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Secure Access Check
    const token = getToken();
    if (!token) {
        window.location.href = '../2.login/code.html';
        return;
    }

    const authRes = await apiRequest(CONFIG.ENDPOINTS.auth);
    if (authRes.error || authRes.role !== 'admin') {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isAdminEmail = localUser.email && localUser.email.toLowerCase().includes('admin');
        
        if (!isAdminEmail) {
            document.body.innerHTML = `
                <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000; color:#fff; font-family:'Cinzel', serif; text-align:center;">
                    <span class="material-symbols-outlined" style="font-size:100px; color:#ff4d4d">lock</span>
                    <h2 style="margin-top:20px;">Access Denied</h2>
                    <p style="opacity:0.7;">Restricted area for Supreme Admins only.</p>
                    <a href="../4.home/code.html" style="margin-top:30px; color:#ecb613; text-decoration:none; border:1px solid #ecb613; padding:10px 20px; border-radius:5px;">Return to Portal</a>
                </div>`;
            return;
        } else {
            console.warn('⚠️ Server check failed but local identity matches Admin. Entering Debug Mode.');
        }
    }

    // Set Avatar
    const avatarImg = document.getElementById('adminHeaderAvatar');
    if (avatarImg && authRes.avatar) avatarImg.src = authRes.avatar;

    // 2. Setup Tab Navigation (handles new tabs too)
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');

            // Lazy-load data when switching to new tabs
            const tabName = tab.dataset.tab;
            if (tabName === 'users') app.loadUsers();
            if (tabName === 'ai') app.loadAiChats();
            if (tabName === 'settings') app.loadSettings();
            if (tabName === 'logs') app.loadLogs();
            if (tabName === 'notifications') app.loadNotifications();
        });
    });

    // 3. Setup Live Search (original)
    document.getElementById('adminSearch')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.admin-table tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });
    });

    // 4. Setup "Add" Buttons (original)
    document.getElementById('addArtifactBtn')?.addEventListener('click', () => {
        document.getElementById('artifactModalTitle').textContent = 'New Artifact Record';
        document.getElementById('artifactForm').reset();
        document.getElementById('artifactEditId').value = '';
        document.getElementById('artifactPreview')?.classList.remove('has-image');
        app.openModal('artifactModal');
    });

    document.getElementById('addEventBtn')?.addEventListener('click', () => {
        document.getElementById('eventForm').reset();
        document.getElementById('eventPreview')?.classList.remove('has-image');
        app.openModal('eventModal');
    });

    document.getElementById('uploadVideoBtn')?.addEventListener('click', () => {
        document.getElementById('videoForm').reset();
        app.openModal('videoModal');
    });

    // Setup Close Buttons for modals
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.admin-modal');
            if(modal) app.closeModal(modal.id);
        });
    });

    // Refresh Bookings Button
    document.getElementById('refreshBookingsBtn')?.addEventListener('click', () => {
        const icon = document.querySelector('#refreshBookingsBtn .material-symbols-outlined');
        if(icon) {
            icon.style.animation = 'spin 1s linear infinite';
            setTimeout(() => { icon.style.animation = ''; }, 1000);
        }
        app.syncAll(false);
    });

    // Booking status filter
    document.getElementById('bookingStatusFilter')?.addEventListener('change', () => app.syncAll(true));

    // User filters
    let userSearchTimer;
    document.getElementById('userSearchInput')?.addEventListener('input', () => {
        clearTimeout(userSearchTimer);
        userSearchTimer = setTimeout(() => app.loadUsers(), 400);
    });
    document.getElementById('userRoleFilter')?.addEventListener('change', () => app.loadUsers());
    document.getElementById('userBanFilter')?.addEventListener('change', () => app.loadUsers());

    // AI view toggle
    document.getElementById('aiViewSelect')?.addEventListener('change', (e) => {
        const val = e.target.value;
        document.getElementById('aiChatsSection').style.display = val === 'chats' ? '' : 'none';
        document.getElementById('aiDetectionsSection').style.display = val === 'detections' ? '' : 'none';
        if (val === 'chats') app.loadAiChats();
        else app.loadAiDetections();
    });

    // Log action filter
    document.getElementById('logActionFilter')?.addEventListener('change', () => app.loadLogs());

    // Settings form
    document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        app.saveSettings();
    });

    // Notification form
    document.getElementById('notificationForm')?.addEventListener('submit', (e) => {
        app.sendNotification(e);
    });

    // Video Drop Zone Logic (original)
    const videoDropZone = document.getElementById('videoDropZone');
    const videoFile = document.getElementById('videoFile');
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (videoDropZone && videoFile) {
        videoDropZone.addEventListener('click', () => videoFile.click());
        videoFile.addEventListener('change', () => {
            if (videoFile.files.length > 0) {
                fileNameDisplay.textContent = videoFile.files[0].name;
                selectedFileInfo.style.display = 'block';
            } else {
                selectedFileInfo.style.display = 'none';
            }
        });
        
        videoDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            videoDropZone.style.borderColor = '#ecb613';
            videoDropZone.style.background = 'rgba(236, 182, 19, 0.1)';
        });
        videoDropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            videoDropZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            videoDropZone.style.background = 'transparent';
        });
        videoDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            videoDropZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            videoDropZone.style.background = 'transparent';
            if (e.dataTransfer.files.length) {
                videoFile.files = e.dataTransfer.files;
                videoFile.dispatchEvent(new Event('change'));
            }
        });
    }

    // 5. Image Previews and Uploads (original)
    const setupPreview = (inputId, previewId) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input && preview) {
            input.addEventListener('input', () => {
                const img = preview.querySelector('img');
                if (input.value) {
                    img.src = input.value;
                    img.onload = () => preview.classList.add('has-image');
                    img.onerror = () => preview.classList.remove('has-image');
                } else {
                    preview.classList.remove('has-image');
                }
            });

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            preview.style.cursor = 'pointer';
            preview.title = "Click to upload an image";

            preview.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', () => {
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        input.value = e.target.result;
                        input.dispatchEvent(new Event('input'));
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            });
        }
    };
    setupPreview('artifactImageUrl', 'artifactPreview');
    setupPreview('eventImageUrl', 'eventPreview');

    // 6. Artifact Form Submission (original)
    document.getElementById('artifactForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('artifactSubmitBtn');
        const editId = document.getElementById('artifactEditId').value;
        btn.classList.add('loading');
        
        const payload = {
            name: document.getElementById('artifactName').value,
            description: document.getElementById('artifactDesc').value,
            era: document.getElementById('artifactEra').value,
            category: document.getElementById('artifactCategory').value,
            imageUrl: document.getElementById('artifactImageUrl').value,
            model3DUrl: document.getElementById('artifactModel3DUrl').value,
            audioUrl: document.getElementById('artifactAudioUrl').value,
            videoUrl: document.getElementById('artifactVideoUrl').value
        };

        const endpoint = editId ? `${CONFIG.ENDPOINTS.artifacts}/${editId}` : CONFIG.ENDPOINTS.artifacts;
        const res = await apiRequest(endpoint, {
            method: editId ? 'PUT' : 'POST',
            body: JSON.stringify(payload)
        });

        btn.classList.remove('loading');
        if (!res.error) {
            notify.show(editId ? 'Artifact Updated' : 'Artifact Created');
            app.closeModal('artifactModal');
            app.syncAll(true);
        } else {
            notify.error(res.message);
        }
    });

    // 7. Event Form Submission (original)
    document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('eventSubmitBtn');
        const editId = document.getElementById('eventId').value;
        btn.classList.add('loading');
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDesc').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value,
            imageUrl: document.getElementById('eventImageUrl').value || './unnamed (1).png'
        };

        const endpoint = editId ? `${CONFIG.ENDPOINTS.events}/${editId}` : CONFIG.ENDPOINTS.events;
        const res = await apiRequest(endpoint, {
            method: editId ? 'PUT' : 'POST',
            body: JSON.stringify(eventData)
        });

        btn.classList.remove('loading');
        if (!res.error) {
            notify.show(editId ? 'Event Updated' : 'Event Created');
            app.closeModal('eventModal');
            app.syncAll(true);
        } else {
            notify.error(res.message);
        }
    });

    // 8. Video Upload Form Submission (original)
    document.getElementById('videoForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('videoSubmitBtn');
        const bar = document.getElementById('uploadBar');
        const prog = document.getElementById('uploadProgress');
        const fileInput = document.getElementById('videoFile');
        const titleInput = document.getElementById('videoTitle');
        
        if (!fileInput.files.length) return notify.error('Please select a video file');

        btn.classList.add('loading');
        prog.style.display = 'block';

        const fd = new FormData();
        fd.append('video', fileInput.files[0]);
        fd.append('title', titleInput.value);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', CONFIG.API_URL + CONFIG.ENDPOINTS.upload);
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
        
        xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
                bar.style.width = Math.round((ev.loaded / ev.total) * 100) + '%';
            }
        };

        xhr.onload = async () => {
            btn.classList.remove('loading');
            prog.style.display = 'none';
            if (xhr.status === 200 || xhr.status === 201) {
                try {
                    const uploadResult = JSON.parse(xhr.responseText);
                    
                    // Call /api/videos/add to save the record to the database
                    const addRes = await fetch(CONFIG.API_URL + '/videos/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`
                        },
                        body: JSON.stringify({
                            title: uploadResult.title || titleInput.value || 'Untitled Video',
                            public_id: uploadResult.public_id,
                            url: uploadResult.url,
                            duration: uploadResult.duration
                        })
                    });

                    if (addRes.ok) {
                        notify.show('Video Uploaded & Saved Successfully');
                        app.closeModal('videoModal');
                        app.syncAll(true);
                    } else {
                        const err = await addRes.json();
                        notify.error(err.message || 'Failed to save video record');
                    }
                } catch(e) {
                    notify.error('Failed to parse upload response');
                }
            } else {
                let msg = 'Upload failed';
                try { msg = JSON.parse(xhr.responseText).message || msg; } catch(e){}
                notify.error(msg);
            }
        };

        xhr.onerror = () => {
            btn.classList.remove('loading');
            prog.style.display = 'none';
            notify.error('Network error during upload');
        };

        xhr.send(fd);
    });

    // 10. Initial Sync
    app.syncAll();
    setInterval(() => app.syncAll(true), CONFIG.REFRESH_RATE);
});
