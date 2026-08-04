import re

filepath = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the broken lines between const DECKS = { and ep2: [
pattern = re.compile(r'const DECKS = \{.*?ep2: \[', re.DOTALL)
content = pattern.sub('const DECKS = {\n    ep1: generateVerbsDeck(),\n    ep2: [', content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("app.js fixed")
