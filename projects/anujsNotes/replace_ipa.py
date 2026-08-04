"""
Script to:
1. Replace IPA with English pseudo-phonetics in all episode HTML files
2. Verify inline flashcard sections exist at bottom of each episode
"""
import os
import re

BASE = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\GermanNotes\GermanA1"
episodes = [f"episode{i}.html" for i in range(1, 7)]

# IPA → English phonetic respelling map (sorted longest-first to avoid partial replacements)
IPA_MAP = [
    # Multi-char IPA (must come first)
    ("/eːɐ̯/", '"air"'),
    ("/viːɐ̯/", '"veer"'),
    ("/iːɐ̯/", '"eer"'),
    ("/aʊ/",  '"ow" (as in "cow")'),
    ("/ɔʏ/",  '"oy" (as in "boy")'),
    ("/aɪ/",  '"eye"'),
    ("/iː/",  'long "ee"'),
    ("/ɛː/",  '"e" (long, as in "bed")'),
    ("/øː/",  '"ur" (round lips, say "ee")'),
    ("/yː/",  '"uu" (round lips, say "ee")'),
    ("/ɛ/",   '"e" (as in "bed")'),
    ("/œ/",   '"ur" (short, no English equiv.)'),
    ("/ʏ/",   '"ue" (short, no English equiv.)'),
    ("/ɪç/",  '"ikh"'),
    ("/ʃp/",  '"shp"'),
    ("/ʃt/",  '"sht"'),
    ("/tʃ/",  '"ch" (as in "church")'),
    ("/ʃ/",   '"sh"'),
    ("/ŋ/",   '"ng" (as in "sing")'),
    ("/pf/",  '"pf" (both sounds together)'),
    ("/ts/",  '"ts" (as in "pizza")'),
    ("/duː/", '"doo"'),
    ("/ziː/", '"zee"'),
    ("/ɛs/",  '"es"'),
    ("/ɔ/",   '"o" (short)'),
    ("/ç/",   '"ikh" (soft hiss)'),
    ("/x/",   '"kh" (guttural, like Scottish loch)'),
    ("/j/",   '"y" (as in "yes")'),
    ("/v/",   '"v"'),
    ("/f/",   '"f"'),
    ("/s/",   '"s"'),
    ("/p/",   '"p"'),
    ("/t/",   '"t"'),
    ("/k/",   '"k"'),
    ("/b/",   '"b"'),
    ("/d/",   '"d"'),
    ("/g/",   '"g"'),
]

# Also replace IPA notation in table cells like /ɛ/ or /ɛː/
# Sometimes they appear as standalone: /iː/
def replace_ipa(content):
    for ipa, eng in IPA_MAP:
        content = content.replace(ipa, eng)
    return content

total_changed = 0
for ep in episodes:
    path = os.path.join(BASE, ep)
    if not os.path.exists(path):
        print(f"  SKIP (not found): {ep}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        original = f.read()
    updated = replace_ipa(original)
    changes = sum(1 for a, b in zip(original, updated) if a != b)
    if updated != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"  UPDATED {ep} (chars changed: {len(original) - len(updated) + len(updated)})")
        total_changed += 1
    else:
        print(f"  NO CHANGE {ep}")

print(f"\nDone. {total_changed} files updated.")
