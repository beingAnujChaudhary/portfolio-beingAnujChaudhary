import os

BASE = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

for ep in episodes:
    path = os.path.join(BASE, ep)
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    old_link = 'href="anujs_notes.html"'
    new_link = 'href="../../anujsNotes.html"'
    if old_link in c:
        c = c.replace(old_link, new_link)
        with open(path, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"  Fixed: {ep}")
    else:
        print(f"  OK: {ep}")
print("Done.")
