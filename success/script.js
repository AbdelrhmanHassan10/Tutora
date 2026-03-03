// ============================================
// DARK MODE TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    updateThemeIcon();
} else {
    body.classList.add('dark-mode');
}

// Toggle dark mode
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();

    // Rotation animation
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

function updateThemeIcon() {
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? 'light_mode' : 'dark_mode';
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

const copyBtn = document.querySelector('.copy-btn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const textToCopy = copyBtn.getAttribute('data-copy');

        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show feedback
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="material-symbols-outlined">check</span>';
            copyBtn.style.color = '#D4AF37';

            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.color = '#999999';
            }, 2000);

            console.log('Copied to clipboard:', textToCopy);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
}

// ============================================
// DOWNLOAD TICKET BUTTON
// ============================================

const downloadBtn = document.querySelector('.btn-primary');

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        console.log('Download ticket clicked');

        // Add loading animation
        downloadBtn.style.opacity = '0.7';
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">hourglass_empty</span> Generating...';

        // Simulate download
        setTimeout(() => {
            downloadBtn.style.opacity = '1';
            downloadBtn.innerHTML = '<span class="material-symbols-outlined">check</span> Downloaded!';
            downloadBtn.style.backgroundColor = '#40E0D0';

            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.backgroundColor = '#D4AF37';
            }, 2000);
        }, 1500);
    });
}

// ============================================
// SEARCH BUTTON
// ============================================

const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        console.log('Search clicked');

        // Pulse animation
        searchBtn.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            searchBtn.style.animation = '';
        }, 500);
    });
}

// ============================================
// USER PROFILE INTERACTION
// ============================================

const userProfile = document.querySelector('.user-profile');

if (userProfile) {
    userProfile.addEventListener('click', () => {
        console.log('User profile clicked');

        // Scale animation
        userProfile.style.transform = 'scale(0.9)';
        setTimeout(() => {
            userProfile.style.transform = 'scale(1)';
        }, 150);
    });

    userProfile.addEventListener('mouseenter', () => {
        userProfile.style.transform = 'scale(1.05)';
    });

    userProfile.addEventListener('mouseleave', () => {
        userProfile.style.transform = 'scale(1)';
    });
}

// ============================================
// RETURN TO HOME BUTTON
// ============================================

const returnBtn = document.querySelector('.btn-secondary');
const body = document.body;

if (returnBtn) {
    returnBtn.addEventListener('click', (e) => {
        e.preventDefault(); // يمنع السلوك الافتراضي لو الزر inside a <a> مثلا
        console.log('Return to home clicked');

        // Fade out animation
        body.style.transition = 'opacity 0.3s ease';
        body.style.opacity = '0';

        setTimeout(() => {
            // هنا نروح للصفحة الرئيسية
            window.location.href = '/index.html';
        }, 300); // بعد ما ينتهي الفيد
    });
}


// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'D' to toggle dark mode
    if (e.key === 'd' || e.key === 'D') {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    }

    // Press 'C' to copy booking reference
    if ((e.key === 'c' || e.key === 'C') && copyBtn) {
        copyBtn.click();
    }

    // Press 'Enter' to download ticket
    if (e.key === 'Enter' && downloadBtn) {
        downloadBtn.click();
    }
});

// ============================================
// ANIMATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .btn {
        transition: all 0.3s ease;
    }

    .btn:active {
        transform: scale(0.95);
    }

    .search-btn,
    .theme-toggle {
        transition: all 0.3s ease;
    }

    .search-btn:active,
    .theme-toggle:active {
        transform: scale(0.9);
    }

    .copy-btn {
        transition: all 0.3s ease;
    }

    .copy-btn:active {
        transform: scale(0.9);
    }

    .user-profile {
        transition: all 0.3s ease;
    }

    .user-profile:active {
        transform: scale(0.95);
    }

    .booking-card {
        transition: all 0.3s ease;
    }

    .booking-card:hover {
        border-color: rgba(212, 175, 55, 0.4);
    }

    .summary-row {
        transition: all 0.3s ease;
    }

    .summary-row:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// ============================================
// SCROLL ANIMATIONS
// ============================================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    console.log('✓ Success page loaded successfully');
    console.log('🌙 Dark mode available - press D or click theme toggle');
    console.log('📋 Press C to copy booking reference');
    console.log('⬇️ Press Enter to download ticket');

    // Fade in animation
    body.style.animation = 'fadeIn 0.6s ease-out';
});

// ============================================
// PRINT FUNCTIONALITY
// ============================================

function printTicket() {
    console.log('Printing ticket...');
    window.print();
}

// ============================================
// SHARE FUNCTIONALITY
// ============================================

function shareBooking() {
    const bookingRef = 'GEM-2024-889';
    const shareText = `I just booked my visit to The Grand Egyptian Museum! Booking Reference: ${bookingRef}`;

    if (navigator.share) {
        navigator.share({
            title: 'Grand Egyptian Museum Booking',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        console.log('Share not supported');
    }
}

// ============================================
// DYNAMIC CONTENT UPDATE
// ============================================

function updateBookingDetails(details) {
    const nameElement = document.querySelector('.summary-value:nth-of-type(2)');
    const ticketElement = document.querySelector('.summary-value:nth-of-type(3)');
    const dateElement = document.querySelector('.summary-value:nth-of-type(4)');
    const priceElement = document.querySelector('.total-price');

    if (nameElement && details.name) nameElement.textContent = details.name;
    if (ticketElement && details.ticketType) ticketElement.textContent = details.ticketType;
    if (dateElement && details.dateTime) dateElement.textContent = details.dateTime;
    if (priceElement && details.price) priceElement.textContent = details.price;
}

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

function handleResize() {
    const width = window.innerWidth;
    console.log('Window width:', width);
}

window.addEventListener('resize', handleResize);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ All scripts initialized');

    // Add smooth transitions to all elements
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime + 'ms');
    });
}

// ============================================
// EASTER EGGS
// ============================================

let easterEggCount = 0;

document.addEventListener('click', (e) => {
    if (e.target.closest('.success-icon')) {
        easterEggCount++;
        if (easterEggCount === 5) {
            console.log('🎉 You found an easter egg!');
            document.body.style.filter = 'hue-rotate(45deg)';
            setTimeout(() => {
                document.body.style.filter = 'hue-rotate(0deg)';
            }, 500);
            easterEggCount = 0;
        }
    }
});

// ============================================
// CONFETTI ANIMATION (Optional)
// ============================================

function createConfetti() {
    const confettiPiece = document.createElement('div');
    confettiPiece.style.position = 'fixed';
    confettiPiece.style.width = '10px';
    confettiPiece.style.height = '10px';
    confettiPiece.style.backgroundColor = '#D4AF37';
    confettiPiece.style.borderRadius = '50%';
    confettiPiece.style.left = Math.random() * window.innerWidth + 'px';
    confettiPiece.style.top = '-10px';
    confettiPiece.style.pointerEvents = 'none';
    confettiPiece.style.zIndex = '5';

    document.body.appendChild(confettiPiece);

    let top = -10;
    let left = parseFloat(confettiPiece.style.left);
    let velocity = Math.random() * 3 + 2;

    const animate = () => {
        top += velocity;
        left += (Math.random() - 0.5) * 2;
        confettiPiece.style.top = top + 'px';
        confettiPiece.style.left = left + 'px';
        confettiPiece.style.opacity = 1 - (top / window.innerHeight);

        if (top < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            confettiPiece.remove();
        }
    };

    animate();
}

// Trigger confetti on page load
window.addEventListener('load', () => {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 50);
    }
});