import os
import re

path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update selectors at the top of DOMContentLoaded
old_selectors = """    const hintBtn = document.querySelector('.show-hint-btn');
    const hintText = document.querySelector('.hint-text');
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-card-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const progressText = document.querySelector('.inline-progress-text');"""

new_selectors = """    const hintBtn = document.querySelector('.show-hint-btn');
    const hintText = document.querySelector('.hint-text');
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-card-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const progressText = document.querySelector('.inline-progress-text');
    const progressBar = document.querySelector('.progress-fill');
    
    const ttsEnBtn = document.querySelector('.tts-en');
    const ttsDeBtn = document.querySelector('.tts-de');"""

content = content.replace(old_selectors, new_selectors)

# 2. Update renderCard function to handle progress bar
old_render = """        progressText.textContent = `${currentIndex + 1} of ${flashcards.length}`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;"""

new_render = """        progressText.textContent = `${currentIndex + 1} / ${flashcards.length}`;
        if(progressBar) {
            progressBar.style.width = `${((currentIndex + 1) / flashcards.length) * 100}%`;
        }

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;
        
        // Stop any currently playing audio when card changes
        window.speechSynthesis.cancel();"""

content = content.replace(old_render, new_render)

# 3. Add TTS logic and prevent flip on TTS click
old_flip_listener = """    flashcard.addEventListener('click', (e) => {
        if(e.target.closest('.feedback-btn') || e.target.closest('.card-icon-btn')) return;
        toggleFlip();
    });"""

new_flip_listener = """    // TTS Functionality
    function speak(text, lang) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Stop current
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        // Adjust for more natural voice if possible
        utterance.rate = 0.9; 
        window.speechSynthesis.speak(utterance);
    }

    if (ttsEnBtn) {
        ttsEnBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].front, 'en-US');
        });
    }

    if (ttsDeBtn) {
        ttsDeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].back, 'de-DE');
        });
    }

    flashcard.addEventListener('click', (e) => {
        if(e.target.closest('.feedback-btn') || e.target.closest('.card-icon-btn') || e.target.closest('.tts-btn')) return;
        toggleFlip();
    });"""

content = content.replace(old_flip_listener, new_flip_listener)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated app.js successfully.")
