import os

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

for ep in episodes:
    path = os.path.join(base_dir, ep)
    if not os.path.exists(path): continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    content = content.replace(
        '<span class="card-lang-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#10b981; font-weight:600;">Deutsch / Answer</span>',
        '<span class="card-lang-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#c7d2fe; font-weight:600;">Deutsch / Answer</span>'
    )
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
