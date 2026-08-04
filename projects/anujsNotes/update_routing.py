import os
import re

app_js_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update initialization to check hash and add dropdown logic
old_init = """    const container = document.querySelector('.flashcard-3d-container');
    if (!container) return;

    const episodeKey = container.getAttribute('data-episode');
    let flashcards = DECKS[episodeKey] || DECKS.ep1;
    let initialFlashcards = [...flashcards];

    let currentIndex = 0;
    let isFlipped = false;
    let showHint = false;

    const storageKey = 'flashcard_state_' + episodeKey;
    const savedState = JSON.parse(localStorage.getItem(storageKey)) || {
        tracking: false,
        currentIndex: 0
    };

    let isTracking = savedState.tracking;"""


new_init = """    const container = document.querySelector('.flashcard-3d-container');
    if (!container) return;

    let episodeKey = container.getAttribute('data-episode');
    
    // Check hash for episode routing (e.g. #ep2)
    const hash = window.location.hash.substring(1);
    if (hash && DECKS[hash]) {
        episodeKey = hash;
        container.setAttribute('data-episode', hash);
    }
    
    // If we are on the main flashcards.html page, inject a dropdown to select episode
    if (window.location.pathname.includes('flashcards.html')) {
        const header = document.querySelector('.flashcard-header');
        if (header && !document.getElementById('deck-selector')) {
            const selectHtml = `
                <div style="margin-top:1rem; margin-bottom: 0.5rem;">
                    <select id="deck-selector" style="padding:0.5rem 1rem; border-radius:8px; border:1px solid var(--card-border); background:white; font-family:inherit; font-size:1rem; color:var(--text-primary); cursor:pointer; outline:none; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <option value="ep1" ${episodeKey === 'ep1' ? 'selected' : ''}>Episode 1: Pronouns & Conjugation (50 cards)</option>
                        <option value="ep2" ${episodeKey === 'ep2' ? 'selected' : ''}>Episode 2: Alphabet & Pronunciation (50 cards)</option>
                        <option value="ep3" ${episodeKey === 'ep3' ? 'selected' : ''}>Episode 3: Numbers & Math (50 cards)</option>
                        <option value="ep4" ${episodeKey === 'ep4' ? 'selected' : ''}>Episode 4: Haben & Sein (50 cards)</option>
                        <option value="ep5" ${episodeKey === 'ep5' ? 'selected' : ''}>Episode 5: 30 Verbs Conjugation (120 cards)</option>
                        <option value="ep6" ${episodeKey === 'ep6' ? 'selected' : ''}>Episode 6: Greetings & Phrases (50 cards)</option>
                    </select>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', selectHtml);
            
            document.getElementById('deck-selector').addEventListener('change', (e) => {
                window.location.hash = e.target.value;
            });
        }
    }

    // Listen for hash changes to re-initialize deck
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && DECKS[newHash]) {
            // Update UI selector if it exists
            const selector = document.getElementById('deck-selector');
            if (selector) selector.value = newHash;
            
            episodeKey = newHash;
            container.setAttribute('data-episode', newHash);
            loadDeck(newHash);
        }
    });

    let flashcards = DECKS[episodeKey] || DECKS.ep1;
    let initialFlashcards = [...flashcards];

    let currentIndex = 0;
    let isFlipped = false;
    let showHint = false;
    
    let storageKey = 'flashcard_state_' + episodeKey;
    let savedState = JSON.parse(localStorage.getItem(storageKey)) || {
        tracking: false,
        currentIndex: 0
    };

    let isTracking = savedState.tracking;"""

content = content.replace(old_init, new_init)

# We need a loadDeck function to handle hash changes
old_savestate = """    function saveState() {"""

new_savestate = """    function loadDeck(key) {
        flashcards = DECKS[key];
        initialFlashcards = [...flashcards];
        storageKey = 'flashcard_state_' + key;
        
        savedState = JSON.parse(localStorage.getItem(storageKey)) || {
            tracking: false,
            currentIndex: 0
        };
        isTracking = savedState.tracking;
        currentIndex = savedState.currentIndex || 0;
        if (currentIndex >= flashcards.length) currentIndex = 0;
        
        if (toggleSwitch) {
            toggleSwitch.checked = isTracking;
        }
        
        renderCard();
    }

    function saveState() {"""

content = content.replace(old_savestate, new_savestate)

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated app.js with routing and deck selection logic")
