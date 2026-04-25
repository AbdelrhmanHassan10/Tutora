// ============================================
// ADVANCED 3D MODEL SCRIPT - interactive explorer
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
    const playBtn = document.querySelector(".play-btn");
    const favBtn = document.querySelector(".btn-collection");
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    // 1. Navigation and Sidebar Toggle (Royal Superstar Sync)
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Dropdown Toggle for Mobile Menu
    const dropdownToggle = document.querySelector('.mobile-menu .dropdown-toggle');
    const dropdownItems = document.querySelector('.mobile-menu .dropdown-items');
    
    if (dropdownToggle && dropdownItems) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownToggle.classList.toggle('active');
            dropdownItems.classList.toggle('show');
            
            // Toggle icon
            const icon = dropdownToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = dropdownItems.classList.contains('show') ? 'expand_less' : 'expand_more';
            }
        });
    }

    // Close menu when clicking links
    if (mobileMenu) {
        mobileMenu.querySelectorAll('.menu-link, .dropdown-item').forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', closeMenu);
            }
        });
    }

    let currentAudio = null;

    // 1. URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const artifactId = urlParams.get('id') || "4"; // Default to 4 (Golden Mask)

    // 2. AI Voice Narration (TTS)
    if (playBtn) {
        playBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            const lang = localStorage.getItem("language") || "en";

            if (!token) {
                alert("🔐 Please login to experience the AI storyteller.");
                window.location.href = "../2.login/code.html";
                return;
            }

            const icon = playBtn.querySelector(".material-icons-outlined");

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio = null;
                icon.textContent = "play_arrow";
                playBtn.classList.remove("playing");
                return;
            }

            // Visual feedback
            icon.textContent = "sync";
            playBtn.classList.add("loading");

            try {
                const response = await fetch(`${API_URL}/ai/text-to-speech`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ statueId: parseInt(artifactId), language: lang })
                });

                const data = await response.json();

                if (response.ok && (data.audioUrl || data.url)) {
                    currentAudio = new Audio(data.audioUrl || data.url);
                    currentAudio.play();
                    icon.textContent = "stop";
                    playBtn.classList.add("playing");
                    
                    currentAudio.onended = () => {
                        icon.textContent = "play_arrow";
                        playBtn.classList.remove("playing");
                        currentAudio = null;
                    };
                } else {
                    alert(data.message || "Tortara is gathering more history. Please try again soon.");
                    icon.textContent = "play_arrow";
                }
            } catch (error) {
                console.error("TTS Error:", error);
                alert("⚠️ Connection to the neural storyteller failed.");
                icon.textContent = "play_arrow";
            } finally {
                playBtn.classList.remove("loading");
            }
        });
    }

    // 3. Favorites Logic
    if (favBtn) {
        favBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                window.location.href = "../2.login/code.html";
                return;
            }

            try {
                const res = await fetch(`${API_URL}/favorites`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ artifactId: parseInt(artifactId) }),
                });

                if (res.ok) {
                    favBtn.innerHTML = '<span class="material-icons-outlined">check</span> Added to Collection';
                    favBtn.disabled = true;
                    favBtn.style.opacity = '0.7';
                } else {
                    const data = await res.json();
                    alert(data.message || "Failed to add to favorites");
                }
            } catch (error) {
                console.error(error);
                alert("Connection failed");
            }
        });
    }

    // 4. Accordion Logic
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. Scroll Animations (Fixed Visibility)
    const animElements = document.querySelectorAll('.anim-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    animElements.forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // ROYAL ATMOSPHERE & INTERACTION
    // ============================================

    // 1. Royal Dust Particles System
    function createDust() {
        const container = document.getElementById('dust-container');
        if (!container) return;
        
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 15 + 15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.bottom = `-10px`;
            particle.style.animation = `floatDust ${duration}s linear ${delay}s infinite`;
            
            container.appendChild(particle);
        }
    }

    // 2. Royal Geometric Shapes
    function createShapes() {
        const container = document.getElementById('shapes-container');
        if (!container) return;
        
        const shapes = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
        for (let i = 0; i < 12; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 25 + 25;
            const delay = Math.random() * -20;
            
            shape.style.left = `${posX}%`;
            shape.style.top = `${posY}%`;
            shape.style.animation = `rotateFloat ${duration}s ease-in-out ${delay}s infinite`;
            
            container.appendChild(shape);
        }
    }

    // 3. 3D Viewer Tilt Logic
    const viewer = document.querySelector('.viewer-display');
    const viewerImg = document.querySelector('.viewer-img');

    if (viewer && viewerImg) {
        viewer.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = viewer.getBoundingClientRect();
            const mouseX = (e.clientX - left) / width - 0.5;
            const mouseY = (e.clientY - top) / height - 0.5;
            
            viewerImg.style.transform = `scale(1.1) rotateY(${mouseX * 15}deg) rotateX(${mouseY * -15}deg) translateZ(30px)`;
        });
        
        viewer.addEventListener('mouseleave', () => {
            viewerImg.style.transform = `scale(1) rotateY(0) rotateX(0) translateZ(0)`;
        });
    }

    // Initialize Atmosphere
    createDust();
    createShapes();

    console.log('✓ Advanced 3D Explorer & Royal Atmosphere Initialized');
});
