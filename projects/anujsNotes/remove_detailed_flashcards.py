import os
import re

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

# Also update anujsNotes.html sidebar
anujs_notes_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\anujsNotes.html"

# Pattern to remove from sidebar: <li style="margin-top:1rem;"><a href="../../flashcards.html" ...> All Flashcards</a></li>
sidebar_pattern1 = re.compile(r'<li style="margin-top:1rem;"><a href="\.\./\.\./flashcards\.html"([^>]+)>.*?All Flashcards</a></li>', re.DOTALL)
sidebar_pattern2 = re.compile(r'<li style="margin-top:1rem;"><a href="flashcards\.html"([^>]+)>.*?All Flashcards</a></li>', re.DOTALL)
sidebar_pattern3 = re.compile(r'<li[^>]*><a href="flashcards\.html"[^>]*>Detailed Flashcards</a></li>', re.DOTALL)

# Pattern to remove from navigation-buttons: <a href="../../flashcards.html#epX" class="nav-btn primary">🃏 Episode X Flashcards</a>
nav_btn_pattern = re.compile(r'<a href="\.\./\.\./flashcards\.html[^"]*" class="nav-btn primary">.*?Flashcards.*?</a>', re.DOTALL)

# 1. Update all episodes
for ep in episodes:
    path = os.path.join(base_dir, ep)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove sidebar link
        content = sidebar_pattern1.sub('', content)
        # Remove nav btn
        content = nav_btn_pattern.sub('', content)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned {ep}")

# 2. Update anujsNotes.html
if os.path.exists(anujs_notes_path):
    with open(anujs_notes_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = sidebar_pattern2.sub('', content)
    content = sidebar_pattern3.sub('', content)
    
    with open(anujs_notes_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Cleaned anujsNotes.html")

# 3. Delete flashcards.html
flashcards_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\flashcards.html"
if os.path.exists(flashcards_path):
    os.remove(flashcards_path)
    print("Deleted flashcards.html")

