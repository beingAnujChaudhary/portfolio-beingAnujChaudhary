"""
Final cleanup:
1. Rename "IPA" column headers to "Sound (Phonetic)"
2. Fix remaining slash-notation like /w/ in text
3. Fix episode1 pronoun table IPA column
"""
import os
import re

BASE = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

replacements = [
    # Column header fixes
    ("<th>IPA</th>", "<th>Sounds Like</th>"),
    ("<th>IPA</th><th>Example</th>", "<th>Sounds Like</th><th>Example</th>"),
    # Remaining IPA slash patterns not caught before
    ("/w/", '"w"'),
    ("/n/", '"n"'),
    ("/m/", '"m"'),
    ("/l/", '"l"'),
    ("/r/", '"r"'),
    ("/h/", '"h"'),
    ("/a/", '"a"'),
    ("/e/", '"e"'),
    ("/i/", '"i"'),
    ("/o/", '"o"'),
    ("/u/", '"u"'),
    # Episode 1 pronoun table IPA column header
    ("<th>IPA</th>", "<th>Sounds Like</th>"),
]

for ep in episodes:
    path = os.path.join(BASE, ep)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  CLEANED: {ep}")
    else:
        print(f"  OK: {ep}")

print("Done.")
