import os

path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\style.css"

new_css = """
/* ===== QUIZLET-STYLE FLASHCARD REDESIGN ===== */
.quizlet-top-bar {
    margin-bottom: 0.5rem;
}

.icon-btn:hover {
    color: var(--accent-color) !important;
}

.tts-btn:hover {
    color: var(--accent-color) !important;
    background: var(--bg-secondary);
    border-radius: 8px;
}

.flashcard-3d-container {
    margin-bottom: 0.5rem;
}

.flashcard-element:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.inline-nav-btn:hover {
    transform: scale(1.05);
}

.hint-btn:hover {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

/* Fix text selection */
.card-front-text, .card-back-text {
    user-select: none;
}

/* Ensure progress bar is smooth */
.progress-fill {
    transition: width 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Mermaid Diagram Styling */
.mermaid {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--card-border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    overflow-x: auto;
}
"""

with open(path, "a", encoding="utf-8") as f:
    f.write(new_css)

print("CSS appended to style.css")
