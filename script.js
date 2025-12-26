let activeCardId = null;
const originalCardStates = {};

function expandCard(cardId, ghostId) {
    const card = document.getElementById(cardId);
    const ghost = document.getElementById(ghostId);
    const grid = document.getElementById('main-grid');
    const navbar = document.getElementById('navbar');

    if (activeCardId === cardId) return;
    if (activeCardId) {
        const prevGhostId = activeCardId.replace('card', 'ghost');
        closeCard(activeCardId, prevGhostId);
    }

    // Save original state
    originalCardStates[cardId] = card.className;

    // Get positions BEFORE any DOM changes
    const cardRect = card.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    // Calculate position relative to grid
    const startTop = cardRect.top - gridRect.top;
    const startLeft = cardRect.left - gridRect.left;
    const startWidth = cardRect.width;
    const startHeight = cardRect.height;

    // Show ghost to maintain layout
    ghost.classList.remove('hidden');

    // Hide card-2 preview content if expanding card-2
    if (cardId === 'card-2') {
        const preview = document.getElementById('card-2-preview');
        if (preview) {
            preview.style.opacity = '0';
        }
    }

    // Remove grid positioning classes
    const gridClasses = card.className.match(/(col-span-\d+|row-span-\d+|md:col-span-\d+|md:row-span-\d+)/g) || [];
    gridClasses.forEach(cls => card.classList.remove(cls));

    // Remove ALL hover effects and positioning
    const hoverClasses = card.className.match(/hover:[^\s]+/g) || [];
    hoverClasses.forEach(cls => card.classList.remove(cls));
    card.classList.remove('cursor-pointer', 'group', 'relative');

    // Make absolute and set starting position
    card.classList.add('absolute', 'z-40', 'cursor-default');
    card.style.top = startTop + 'px';
    card.style.left = startLeft + 'px';
    card.style.width = startWidth + 'px';
    card.style.height = startHeight + 'px';
    card.style.transition = 'none';

    // Force reflow
    card.offsetHeight;

    // Enable transition and expand
    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    requestAnimationFrame(() => {
        card.style.top = '0px';
        card.style.left = '0px';
        card.style.width = '100%';
        card.style.height = '100%';
    });

    // Scroll grid into view
    const offset = navbar.offsetHeight;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = grid.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset - 10;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });

    // Show details content
    const details = card.querySelector('.details-content');
    if (details) {
        setTimeout(() => {
            details.classList.remove('hidden');
            setTimeout(() => details.classList.remove('opacity-0'), 10);

            // --- ADD THIS BLOCK FOR THE MAP ---
            if (cardId === 'card-7' && typeof google !== 'undefined') {
                // 1. Find the map instance we created (it's stored in the global map variable usually, or we can get it via the DOM)
                // Since we created the map in a module, we can trigger a generic resize event on the window or access the map object if we attached it to window.

                // Simple fix: Trigger a resize event on the window, Google Maps listens to this.
                window.dispatchEvent(new Event('resize'));
            }
            // ----------------------------------

            // If this is card-7 (map card), render the map
            if (cardId === 'card-7' && typeof window.renderMapInCard === 'function') {
                setTimeout(() => {
                    window.renderMapInCard();
                }, 400); // Wait for animation to complete
            }
        }, 200);

        const btn = details.querySelector('.close-btn');
        if (btn) {
            btn.onclick = (e) => {
                e.stopPropagation();
                closeCard(cardId, ghostId);
            };
        }
    }

    activeCardId = cardId;
}

function closeCard(cardId, ghostId) {
    const card = document.getElementById(cardId);
    const ghost = document.getElementById(ghostId);
    const details = card.querySelector('.details-content');

    // Hide details
    if (details) {
        details.classList.add('opacity-0');
        setTimeout(() => details.classList.add('hidden'), 200);
    }

    // Show card-2 preview content again if closing card-2
    if (cardId === 'card-2') {
        const preview = document.getElementById('card-2-preview');
        if (preview) {
            setTimeout(() => {
                preview.style.opacity = '1';
            }, 200);
        }
    }

    setTimeout(() => {
        // Clear inline styles
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.height = '';
        card.style.transition = '';

        // Restore original classes completely
        if (originalCardStates[cardId]) {
            card.className = originalCardStates[cardId];
        }

        // Hide ghost - card returns to normal flow
        ghost.classList.add('hidden');
        activeCardId = null;
    }, 300);
}

// Handle signup form submission
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullName: signupForm.fullName.value,
                age: signupForm.age.value,
                school: signupForm.school.value,
                guardianName: signupForm.guardianName.value,
                guardianPhone: signupForm.guardianPhone.value,
                timestamp: new Date().toISOString()
            };
            
            // Log to console (replace with actual backend call later)
            console.log('New athlete signup:', formData);
            
            // Show success message
            const successMsg = document.getElementById('signup-success');
            signupForm.classList.add('hidden');
            successMsg.classList.remove('hidden');
            
            // Reset form and hide success message after 3 seconds
            setTimeout(() => {
                signupForm.reset();
                signupForm.classList.remove('hidden');
                successMsg.classList.add('hidden');
            }, 3000);
        });
    }
});
