import os
import re

BASE = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]
# Add flashcards.html
episodes.append("../../flashcards.html")

new_flashcard_html = """<div class="flashcard-section" style="width: 100%; display: flex; flex-direction: column; align-items: center; padding-bottom: 2rem;">
                                <header class="flashcard-header" style="text-align:center; margin-bottom:1.5rem; width:100%;">
                                    <h2 class="flashcard-title" style="font-size: 1.8rem; color:var(--text-primary); margin-bottom:0.5rem;">Interactive Flashcards</h2>
                                    <p class="flashcard-subtitle" style="color:var(--text-secondary);">Test your knowledge with spaced repetition.</p>
                                    <div style="display:flex; justify-content:center; align-items:center; gap: 0.6rem; margin-top:1rem;">
                                        <span style="color:#64748b; font-size:0.88rem; font-weight:500;">Track learning</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" class="track-learning-toggle">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </header>

                                <div class="flashcard-main" style="width:100%; max-width:600px; display:flex; flex-direction:column; gap:1rem;">
                                    
                                    <!-- Quizlet-style top control bar -->
                                    <div class="quizlet-top-bar" style="display:flex; justify-content:space-between; align-items:center; background:white; padding:0.75rem 1.5rem; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border:1px solid var(--card-border);">
                                        <button class="icon-btn shuffle-card-btn" title="Shuffle" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.1rem; transition:color 0.2s;">
                                            <i class="fa-solid fa-shuffle"></i>
                                        </button>
                                        <div style="display:flex; align-items:center; gap:1rem; flex:1; margin:0 1.5rem;">
                                            <div class="progress-track" style="flex:1; height:6px; background:var(--bg-secondary); border-radius:3px; overflow:hidden;">
                                                <div class="progress-bar progress-fill" style="height:100%; width:0%; background:var(--accent-color); transition:width 0.3s ease;"></div>
                                            </div>
                                            <span class="inline-progress-text" style="color:var(--text-secondary); font-weight:600; font-size:0.9rem; min-width:40px; text-align:right;">1 / 12</span>
                                        </div>
                                        <button class="icon-btn reset-btn" title="Reset Order" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.1rem; transition:color 0.2s;">
                                            <i class="fa-solid fa-rotate-left"></i>
                                        </button>
                                    </div>

                                    <!-- The 3D Card -->
                                    <div class="flashcard-3d-container" data-episode="ep1" style="width:100%; perspective:1000px; height:380px; margin-top:0.5rem;">
                                        <div class="flashcard-3d flashcard-element" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); cursor:pointer;">
                                            
                                            <!-- FRONT (English/Concept) -->
                                            <div class="flashcard-face-3d flashcard-front-3d" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:white; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.08); border:1px solid var(--card-border); display:flex; flex-direction:column; padding:1.5rem;">
                                                <div style="display:flex; justify-content:space-between; width:100%;">
                                                    <button class="tts-btn tts-en" title="Read Aloud" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.25rem; transition:color 0.2s; padding:0.5rem;">
                                                        <i class="fa-solid fa-volume-high"></i>
                                                    </button>
                                                    <span class="card-lang-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-secondary); font-weight:600;">English / Concept</span>
                                                </div>
                                                <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                                                    <h2 class="card-front-text" style="text-align:center; font-size:2.2rem; font-weight:500; color:var(--text-primary); margin:0;">Loading...</h2>
                                                </div>
                                                <p class="card-instruction" style="text-align:center; color:var(--text-secondary); font-size:0.85rem; margin:0; opacity:0.7;">Tap card to flip</p>
                                            </div>

                                            <!-- BACK (German/Answer) -->
                                            <div class="flashcard-face-3d flashcard-back-3d" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:white; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.08); border:1px solid var(--card-border); display:flex; flex-direction:column; padding:1.5rem; transform:rotateY(180deg);">
                                                <div style="display:flex; justify-content:space-between; width:100%;">
                                                    <button class="tts-btn tts-de" title="Vorlesen" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.25rem; transition:color 0.2s; padding:0.5rem;">
                                                        <i class="fa-solid fa-volume-high"></i>
                                                    </button>
                                                    <span class="card-lang-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#10b981; font-weight:600;">Deutsch / Answer</span>
                                                </div>
                                                <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                                                    <h2 class="card-back-text" style="text-align:center; font-size:2.2rem; font-weight:500; color:#10b981; margin:0;">Laden...</h2>
                                                </div>
                                                
                                                <div class="learning-feedback-controls hidden" style="display:flex; justify-content:center; gap:1rem; margin-top:auto;">
                                                    <button class="feedback-btn needs-review-btn" style="flex:1; padding:0.75rem; border-radius:8px; border:1px solid #f87171; background:white; color:#ef4444; font-weight:600; cursor:pointer; transition:all 0.2s;">Needs Review</button>
                                                    <button class="feedback-btn got-it-btn" style="flex:1; padding:0.75rem; border-radius:8px; border:none; background:#10b981; color:white; font-weight:600; cursor:pointer; transition:all 0.2s;">Got It ✓</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bottom Controls (Hint & Navigation) -->
                                    <div class="quizlet-bottom-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                                        <div class="hint-section">
                                            <button class="hint-btn show-hint-btn" style="background:none; border:1px solid var(--card-border); padding:0.5rem 1rem; border-radius:20px; color:var(--text-secondary); font-size:0.85rem; cursor:pointer; display:flex; align-items:center; gap:0.5rem; transition:all 0.2s;">
                                                <i class="fa-regular fa-lightbulb"></i> Show Hint
                                            </button>
                                            <div class="hint-text hint-display hidden" style="font-size:0.9rem; color:var(--text-secondary); font-style:italic; padding:0.5rem;"></div>
                                        </div>
                                        
                                        <div class="inline-nav" style="display:flex; align-items:center; gap:1rem;">
                                            <button class="inline-nav-btn prev-btn" style="width:44px; height:44px; border-radius:50%; border:1px solid var(--card-border); background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-primary); transition:all 0.2s;">
                                                <i class="fa-solid fa-arrow-left"></i>
                                            </button>
                                            <button class="inline-nav-btn next-btn" style="width:44px; height:44px; border-radius:50%; border:none; background:var(--accent-color); color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;">
                                                <i class="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>"""

for file_name in episodes:
    path = os.path.join(BASE, file_name)
    if not os.path.exists(path):
        # Handle flashcards.html which is one directory up
        path = os.path.normpath(os.path.join(BASE, file_name))
        if not os.path.exists(path):
            print(f"Skipping {file_name} (not found)")
            continue

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find where to replace
    # We replace from <div class="flashcard-section" down to the closing </div> of that section.
    # The safest way is regex DOTALL from <div class="flashcard-section" to the first </main> minus the closing divs.
    
    # Actually, a more robust way is to find <div class="flashcard-section" and replace it and everything up to <!-- end flashcard -->
    # Since we don't have an end comment, let's look for <div class="flashcard-section" and end at </main>.
    
    pattern = re.compile(r'<div class="flashcard-section".*?</div>\s*</div>\s*</div>\s*</div>\s*</main>', re.DOTALL)
    
    # Extract episode number for data-episode
    ep_match = re.search(r'episode(\d+)', file_name)
    ep_key = f"ep{ep_match.group(1)}" if ep_match else "ep1"
    
    custom_html = new_flashcard_html.replace('data-episode="ep1"', f'data-episode="{ep_key}"')
    
    # We need to append the closing tags back
    replacement = custom_html + "\n        </main>"
    
    new_content = pattern.sub(replacement, content)
    
    # Update track-learning toggle ID if it was specific
    new_content = new_content.replace('class="track-learning-toggle"', f'class="track-learning-toggle" id="track-learning-toggle-{ep_key}"')
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated flashcard UI in {file_name}")

print("Done.")
