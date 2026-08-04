import os

episodes = [1, 2, 3, 4, 5, 6]
base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"

html_template = """
                                <hr style="margin: 4rem 0 2rem 0; border: 0; border-top: 1px solid #e2e8f0;">
                                <div class="flashcard-section" style="width: 100%; display: flex; flex-direction: column; align-items: center; padding-bottom: 3rem;">
                                    <header class="flashcard-header">
                                        <h2 class="flashcard-title" style="font-size: 2rem;">Episode {ep} Practice</h2>
                                        <p class="flashcard-subtitle">Test your knowledge of this episode's concepts</p>
                                        
                                        <!-- Original top progress bar (hidden in favor of compact bottom controls, but kept for structure if needed) -->
                                        <div class="progress-container hidden">
                                            <div class="progress-labels">
                                                <span class="current-card-label">Card 1</span>
                                                <span class="total-cards-label">10 Cards</span>
                                            </div>
                                            <div class="progress-track">
                                                <div class="progress-bar progress-fill" style="width: 0%;"></div>
                                            </div>
                                        </div>
                                    </header>

                                    <div class="flashcard-main" style="max-width: 800px;">
                                        <div class="flashcard-3d-container" data-episode="ep{ep}">
                                            <div class="flashcard-3d flashcard-element">
                                                <div class="flashcard-face-3d flashcard-front-3d">
                                                    <span class="card-lang-label">English / Concept</span>
                                                    <h2 class="card-front-text" style="font-size: 2.2rem; margin-top: 2rem; text-align: center;">Loading...</h2>
                                                    <p class="card-instruction" style="position: absolute; bottom: 20px;">Tap to flip • Use arrows to navigate</p>
                                                    <button class="card-icon-btn shuffle-card-btn" style="position: absolute; bottom: 15px; right: 50px;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,197.66l-24,24a8,8,0,0,1-11.32-11.32L184.69,196H160a8,8,0,0,1,0-16h32a8,8,0,0,1,8,8v32a8,8,0,0,1-16,0V205.31l-14.34-14.34A8,8,0,0,1,181.66,179.66Zm-24-155.32-24-24a8,8,0,0,0-11.32,11.32L160.69,44H128C88.29,44,56,76.29,56,116v24a8,8,0,0,0,16,0V116c0-30.88,25.12-56,56-56h32.69l-14.35,14.34a8,8,0,0,0,11.32,11.32l24-24A8,8,0,0,0,181.66,42.34Zm-53.66,97.32a8,8,0,0,0-11.31,11.31L134.69,169H128c-30.88,0-56-25.12-56-56V88a8,8,0,0,0-16,0v25c0,39.71,32.29,72,72,72h32.69l-14.35,14.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32Z"></path></svg>
                                                    </button>
                                                    <button class="card-icon-btn audio-card-btn" style="position: absolute; bottom: 15px; right: 15px;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm43.28-111.45a8,8,0,0,1,11.31-1.38,40,40,0,0,1,0,66.38,8,8,0,1,1-9.5-12.79,24,24,0,0,0,0-39.81A8,8,0,0,1,187.28,96.19ZM233.15,70A72,72,0,0,1,233.15,186a8,8,0,1,1-9.56-12.75,56,56,0,0,0,0-90.5A8,8,0,1,1,233.15,70Z"></path></svg>
                                                    </button>
                                                </div>
                                                <div class="flashcard-face-3d flashcard-back-3d">
                                                    <span class="card-lang-label">Deutsch / Answer</span>
                                                    <h2 class="card-back-text" style="font-size: 2.2rem; margin-top: 2rem; text-align: center;">Laden...</h2>
                                                    
                                                    <div class="learning-feedback-controls hidden" style="position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; gap: 1rem;">
                                                        <button class="feedback-btn needs-review-btn">Needs Review</button>
                                                        <button class="feedback-btn got-it-btn">Got It</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="hint-section" style="margin-bottom: 2rem;">
                                            <button class="hint-btn show-hint-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                Show Hint
                                            </button>
                                            <div class="hint-text hint-display hidden"></div>
                                        </div>

                                        <div class="compact-controls-container" style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">
                                            <!-- Navigation -->
                                            <div class="inline-nav" style="display: flex; align-items: center; gap: 1rem;">
                                                <button class="inline-nav-btn prev-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                                                </button>
                                                <span class="inline-progress-text text-neutral-600 font-medium">1 of 10</span>
                                                <button class="inline-nav-btn next-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
                                                </button>
                                            </div>
                                            
                                            <!-- Track Learning Toggle -->
                                            <div class="track-learning-container" style="display: flex; align-items: center; gap: 0.75rem;">
                                                <span class="text-neutral-600 font-medium">Track learning</span>
                                                <label class="toggle-switch">
                                                    <input type="checkbox" id="track-learning-toggle-ep{ep}">
                                                    <span class="slider round"></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="utility-controls hidden">
                                            <button class="util-btn reset-btn">
                                                Reset Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
"""

for ep in episodes:
    file_path = os.path.join(base_dir, f"episode{ep}.html")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will do a robust replace since the old template is large.
    # The old template starts at `<hr style="margin: 4rem 0 2rem 0;` and ends before `</main>` or `<div class="navigation-buttons">`
    # Wait, it's easier to just use regex to replace the whole `.flashcard-section` block including the <hr>
    import re
    # We want to replace everything from the <hr style="margin: 4rem 0 2rem 0; border: 0; border-top: 1px solid #e2e8f0;"> to the closing </div> of flashcard-section
    pattern = r'<hr style="margin: 4rem 0 2rem 0; border: 0; border-top: 1px solid #e2e8f0;">\s*<div class="flashcard-section".*?<!-- flashcard-section ends here -->'
    
    # Since I don't have the exact comment, I'll match until the navigation buttons.
    pattern2 = r'<hr style="margin: 4rem 0 2rem 0; border: 0; border-top: 1px solid #e2e8f0;">\s*<div class="flashcard-section".*?(?=<div class="navigation-buttons">)'
    
    match = re.search(pattern2, content, flags=re.DOTALL)
    if match:
        new_html = html_template.format(ep=ep)
        content = content[:match.start()] + new_html + content[match.end():]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates completed successfully.")
