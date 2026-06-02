
function tCart(key, defaultText) {
    if (window.TutoraLang && typeof window.TutoraLang.getCurrentLang === 'function') {
        const lang = window.TutoraLang.getCurrentLang();
        if (lang === 'ar' && window.CART_AR && window.CART_AR[key]) {
            return window.CART_AR[key];
        }
    }
    return defaultText;
}

window.CART_AR = {
    "empty_cart": "عربة التسوق الخاصة بك فارغة.",
    "return_shop": "العودة للمتجر",
    "item_removed": "تمت إزالة العنصر من العربة",
    "cart_empty_toast": "عربة التسوق فارغة"
};
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTaxes = document.getElementById('cartTaxes');
    const cartTotal = document.getElementById('cartTotal');

    // Render cart items
    function renderCart() {
        let cartItems = JSON.parse(localStorage.getItem('tutora_cart') || '[]');
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--color-muted);">shopping_cart</span>
                    <p>Your cart is empty.</p>
                    <a href="../shop/shop.html"><button class="btn btn-outline" style="margin-top: 1rem;">${tCart("return_shop", "Return to Shop")}</button></a>
                </div>
            `;
            updateSummary(cartItems);
            return;
        }

        cartItems.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            itemEl.innerHTML = `
                <img src="${item.image.startsWith('.') ? '.' + item.image : item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus-btn" data-index="${index}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus-btn" data-index="${index}">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-index="${index}" aria-label="Remove item">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        attachEventListeners(cartItems);
        updateSummary(cartItems);
    }

    function attachEventListeners(cartItems) {
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cartItems[index].quantity += 1;
                localStorage.setItem('tutora_cart', JSON.stringify(cartItems));
                renderCart();
                if (typeof window.updateGlobalCartBadge === 'function') {
                    window.updateGlobalCartBadge();
                }
            });
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                    localStorage.setItem('tutora_cart', JSON.stringify(cartItems));
                    renderCart();
                    if (typeof window.updateGlobalCartBadge === 'function') {
                        window.updateGlobalCartBadge();
                    }
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Find closest remove-btn since click might target the span
                const index = e.target.closest('.remove-btn').getAttribute('data-index');
                cartItems.splice(index, 1);
                localStorage.setItem('tutora_cart', JSON.stringify(cartItems));
                renderCart();
                if (typeof window.updateGlobalCartBadge === 'function') {
                    window.updateGlobalCartBadge();
                }
                
                if (typeof window.showPremiumToast === 'function') {
                    window.showPremiumToast(tCart("item_removed", "Item removed from cart"));
                }
            });
        });
    }

    function updateSummary(cartItems) {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxes = subtotal * 0.05;
        const total = subtotal + taxes;

        cartSubtotal.textContent = '$' + subtotal.toFixed(2);
        cartTaxes.textContent = '$' + taxes.toFixed(2);
        cartTotal.textContent = '$' + total.toFixed(2);
    }

    // Global proceed function
    window.proceedToCheckout = function() {
        let cartItems = JSON.parse(localStorage.getItem('tutora_cart') || '[]');
        if (cartItems.length === 0) {
            if (typeof window.showPremiumToast === 'function') {
                window.showPremiumToast(tCart("cart_empty_toast", "Your cart is empty"), "error");
            } else {
                alert(tCart("cart_empty_toast", "Your cart is empty"));
            }
            return;
        }
        
        // Link to booking/payment
        window.location.href = '../booking/booking.html';
    };

    // Initial render
    renderCart();
});

window.addEventListener('languageChanged', () => { if(typeof renderCart === 'function') renderCart(); });
