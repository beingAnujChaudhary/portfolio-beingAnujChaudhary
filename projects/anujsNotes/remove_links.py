import os
import re

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

# 1. Update sidebars in episode files
for ep in episodes:
    path = os.path.join(base_dir, ep)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove the All Flashcards link from sidebar
        content = re.sub(r'<li[^>]*>\s*<a href="\.\./\.\./flashcards\.html"[^>]*>.*?</a>\s*</li>', '', content, flags=re.DOTALL)
        
        # In case the link is styled differently
        content = re.sub(r'<a href="\.\./\.\./flashcards\.html"[^>]*>All Flashcards.*?</a>', '', content, flags=re.DOTALL)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {ep}")

# 2. Update anujsNotes.html sidebar
anujs_notes_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\anujsNotes.html"
if os.path.exists(anujs_notes_path):
    with open(anujs_notes_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove the Detailed Flashcards button from the header / main content area
    content = re.sub(r'<a href="\./flashcards\.html"[^>]*>.*?Detailed Flashcards.*?</a>', '', content, flags=re.DOTALL)
    
    # Remove from sidebar
    content = re.sub(r'<li[^>]*>\s*<a href="\./flashcards\.html"[^>]*>.*?</a>\s*</li>', '', content, flags=re.DOTALL)
    
    with open(anujs_notes_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated anujsNotes.html")

# 3. Clean up app.js of the "flashcards.html" specific code
app_js_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"
if os.path.exists(app_js_path):
    with open(app_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove the block: if (window.location.pathname.includes('flashcards.html')) { ... }
    # Let's just use regex for it
    block_pattern = re.compile(r'\s*// If we are on the main flashcards\.html page.*?}\s*}', re.DOTALL)
    content = block_pattern.sub('', content)
    
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated app.js")
