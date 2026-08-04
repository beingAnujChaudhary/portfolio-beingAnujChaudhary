import os
import re

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

link_template = """
                    <!-- LINK TO DEDICATED FLASHCARDS -->
                    <div class="note-card" style="text-align:center; padding: 3rem 2rem; margin-top:2rem; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border:none;">
                        <h2 style="color:#3730a3; font-size:1.8rem; margin-bottom:1rem;">Master this Episode</h2>
                        <p style="color:#4f46e5; margin-bottom:2rem;">Practice with our interactive, full-screen Quizlet-style flashcards!</p>
                        <a href="flashcardforepisode{ep_num}.html" style="display:inline-block; background:#4f46e5; color:white; padding:1rem 2rem; border-radius:12px; font-weight:bold; font-size:1.2rem; text-decoration:none; box-shadow:0 4px 14px rgba(79,70,229,0.4); transition:transform 0.2s;">
                            <i class="fa-solid fa-layer-group" style="margin-right:0.5rem;"></i> Practice Flashcards ➔
                        </a>
                    </div>
                    """

for i in range(1, 7):
    path = os.path.join(base_dir, f"episode{i}.html")
    if not os.path.exists(path): continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace from INLINE FLASHCARD SECTION to </main>
    new_content = re.sub(r'<!-- INLINE FLASHCARD SECTION -->[\s\S]*?(?=</main>)', link_template.format(ep_num=i), content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Updated 6 episodes with dedicated flashcard links.")
