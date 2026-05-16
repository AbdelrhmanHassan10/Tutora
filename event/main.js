document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    
    // ============================================
    class RoyalAtmosphere {
        constructor() {
            this.shapesContainer = document.getElementById('shapes-container');
            this.cursorGlow = document.getElementById('cursorGlow');
            this.scrollProgress = document.getElementById('scrollProgress');
            this.init();
        }

        init() {
            if (this.dustContainer) this.if (this.shapesContainer) this.createShapes();
            this.initCursorGlow();
            this.initScrollEffects();
            this.initRevealOnScroll();
        }

        createDust() {
            </span>
                                    <button class="btn-details">
                                        View Details <span class="material-symbols-outlined" style="font-size: 1.1rem">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        `;
                        eventGrid.appendChild(card);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    }

    fetchEvents();

    console.log('✓ Royal Event Experience Initialized');
});
