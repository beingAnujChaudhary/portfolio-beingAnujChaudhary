import os
import re

BASE = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

new_sidebar = """<aside class="sidebar">
            <div class="logo">
                <h1>Anuj's Notes</h1>
            </div>
            <nav class="nav-menu">
                <h2 style="margin-top:0.5rem; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">Main Hub</h2>
                <ul id="subject-list">
                    <li><a href="../../anujsNotes.html" style="text-decoration:none;color:inherit;display:block;"><i class="fa-solid fa-house" style="width:20px;"></i> Overview</a></li>
                </ul>

                <h2 style="margin-top:1.5rem; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">German A1</h2>
                <ul id="subject-list">
                    <!-- EPISODE_LINKS -->
                </ul>
            </nav>
        </aside>"""

# Dynamic generation of episode links to preserve the 'active' class
def get_episode_links(current_ep_num):
    links = []
    titles = ["Ep 1: Pronouns", "Ep 2: Alphabet", "Ep 3: Numbers", "Ep 4: Haben & Sein", "Ep 5: 30 Verbs", "Ep 6: Greetings"]
    for i in range(1, 7):
        active = ' class="active"' if i == current_ep_num else ''
        links.append(f'<li{active}><a href="episode{i}.html" style="text-decoration:none;color:inherit;display:block;">{titles[i-1]}</a></li>')
    # Add flashcards link
    links.append('<li style="margin-top:1rem;"><a href="../../flashcards.html" style="text-decoration:none;color:inherit;display:block;"><i class="fa-solid fa-layer-group" style="width:20px;"></i> All Flashcards</a></li>')
    return "\n                    ".join(links)

for ep_num in range(1, 7):
    path = os.path.join(BASE, f"episode{ep_num}.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the <aside> block
    sidebar_pattern = re.compile(r'<aside class="sidebar">.*?</aside>', re.DOTALL)
    
    sidebar_content = new_sidebar.replace("<!-- EPISODE_LINKS -->", get_episode_links(ep_num))
    
    new_content = sidebar_pattern.sub(sidebar_content, content)
    
    # Also add FontAwesome if missing
    if "font-awesome" not in new_content:
        new_content = new_content.replace('<link rel="stylesheet" href="../../style.css">', '<link rel="stylesheet" href="../../style.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">')
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated sidebar in episode{ep_num}.html")
