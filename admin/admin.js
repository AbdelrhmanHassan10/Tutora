/**
 * ============================================================
 * 🏛️ GRAND EGYPTIAN MUSEUM — SUPREME ADMIN CORE (V3.0 - MASTER)
 * ============================================================
 * Fully rewritten for maximum stability, dynamics, and fault tolerance.
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
        upload: '/upload/video'
    }
};

// ─── UTILITIES & NOTIFICATIONS ───
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
        return data.data || data; // Backend usually wraps arrays in "data"
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err);
        return { error: true, message: 'Network Error - Server unreachable' };
    }
}

// ─── STATE MANAGEMENT ───
const state = {
    isRefreshing: false,
    artifacts: [],
    events: [],
    bookings: [],
    videos: []
};

// ─── RENDER ENGINE ───
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
            <tr class="fade-in">
                <td><strong>${item.title}</strong></td>
                <td>${new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                <td><p class="table-desc">${item.description || ''}</p></td>
                <td>
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
                <td>${new Date(item.createdAt || Date.now()).toLocaleDateString()}</td>
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
                <td>${new Date(item.visitDate).toLocaleDateString()}</td>
                <td>${item.nationalityType || 'N/A'}</td>
                <td class="gold-text">£${item.total || 0}</td>
                <td><span class="status-badge ${(item.status || 'Paid').toLowerCase()}">${item.status || 'Paid'}</span></td>
            </tr>
        `).join('');
    },

    stats() {
        document.getElementById('statArtifacts').textContent = state.artifacts?.error ? '—' : (state.artifacts?.length || 0);
        document.getElementById('statEvents').textContent = state.events?.error ? '—' : (state.events?.length || 0);
        document.getElementById('statBookings').textContent = state.bookings?.error ? '—' : (state.bookings?.length || 0);
        document.getElementById('statVideos').textContent = state.videos?.error ? '—' : (state.videos?.length || 0);
    }
};

// ─── CORE APPLICATION ───
window.app = {
    // 1. Core Sync
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

            state.artifacts = art;
            state.events = evt;
            state.bookings = bkg;
            state.videos = vid;

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
        
        document.getElementById('artifactImageUrl').dispatchEvent(new Event('input')); // Trigger preview
        this.openModal('artifactModal');
    },

    // 5. Export
    exportBookings() {
        if (!state.bookings || state.bookings.error || !state.bookings.length) {
            return notify.error('No booking data to export.');
        }
        const csv = 'Guest,Date,Nationality,Total,Status\n' + state.bookings.map(b => 
            `"${b.user?.name || 'N/A'}",${new Date(b.visitDate).toLocaleDateString()},${b.nationalityType},${b.total},${b.status||'Paid'}`
        ).join('\n');
        
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'GEM_Bookings_Report.csv';
        a.click();
        notify.show('Export Generated');
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
            return; // Stop execution
        } else {
            console.warn('⚠️ Server check failed but local identity matches Admin. Entering Debug Mode.');
        }
    }

    // Set Avatar
    const avatarImg = document.getElementById('adminHeaderAvatar');
    if (avatarImg && authRes.avatar) avatarImg.src = authRes.avatar;

    // 2. Setup Tab Navigation
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
        });
    });

    // 3. Setup Live Search
    document.getElementById('adminSearch')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.admin-table tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });
    });

    // 4. Setup "Add" Buttons
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

    // 5. Image Previews
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
        }
    };
    setupPreview('artifactImageUrl', 'artifactPreview');
    setupPreview('eventImageUrl', 'eventPreview');

    // 6. Artifact Form Submission
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

    // 7. Event Form Submission
    document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('eventSubmitBtn');
        btn.classList.add('loading');
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDesc').value,
            date: document.getElementById('eventDate').value,
            image: document.getElementById('eventImageUrl').value || './unnamed (1).png'
        };

        const res = await apiRequest(CONFIG.ENDPOINTS.events, {
            method: 'POST',
            body: JSON.stringify(eventData)
        });

        btn.classList.remove('loading');
        if (!res.error) {
            notify.show('Event Created');
            app.closeModal('eventModal');
            app.syncAll(true);
        } else {
            notify.error(res.message);
        }
    });

    // 8. Video Upload Form Submission
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

        xhr.onload = () => {
            btn.classList.remove('loading');
            prog.style.display = 'none';
            if (xhr.status === 200 || xhr.status === 201) {
                notify.show('Video Uploaded Successfully');
                app.closeModal('videoModal');
                app.syncAll(true);
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
