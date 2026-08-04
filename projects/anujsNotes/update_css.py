import os

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

for ep in episodes:
    path = os.path.join(base_dir, ep)
    if not os.path.exists(path): continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Front container
    content = content.replace(
        "background:white; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.08); border:1px solid var(--card-border);",
        "background:white; border-radius:24px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1); border:2px solid #f1f5f9;"
    )
    # Back container
    content = content.replace(
        "background:white; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.08); border:1px solid var(--card-border); display:flex; flex-direction:column; padding:1.5rem; transform:rotateY(180deg);",
        "background:#4f46e5; border-radius:24px; box-shadow:0 10px 25px -5px rgba(79,70,229,0.3); border:2px solid #6366f1; display:flex; flex-direction:column; padding:1.5rem; transform:rotateY(180deg);"
    )
    # Back TTS button text color
    content = content.replace(
        '<button class="tts-btn tts-de" title="Vorlesen" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.25rem; transition:color 0.2s; padding:0.5rem;">',
        '<button class="tts-btn tts-de" title="Vorlesen" style="background:none; border:none; cursor:pointer; color:white; font-size:1.25rem; transition:color 0.2s; padding:0.5rem; opacity: 0.8;">'
    )
    # Front large text
    content = content.replace(
        "font-size:2.2rem; font-weight:500; color:var(--text-primary); margin:0;",
        "font-size:3rem; font-weight:700; color:#1e293b; margin:0;"
    )
    # Back large text
    content = content.replace(
        "font-size:2.2rem; font-weight:500; color:#10b981; margin:0;",
        "font-size:3rem; font-weight:700; color:white; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);"
    )
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
