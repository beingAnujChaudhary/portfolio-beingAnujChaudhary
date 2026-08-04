import re

app_js_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add getPhonetic function if it doesn't exist
phonetic_func = """
function getPhonetic(germanStr) {
    let s = germanStr.toLowerCase();
    
    // Pronouns
    s = s.replace(/ich/g, 'ikh');
    s = s.replace(/du /g, 'doo ');
    s = s.replace(/er /g, 'air ');
    s = s.replace(/sie /g, 'zee ');
    s = s.replace(/es /g, 'es ');
    s = s.replace(/wir /g, 'veer ');
    s = s.replace(/ihr /g, 'eer ');
    
    // Vowels & Consonants
    s = s.replace(/ei/g, 'eye');
    s = s.replace(/ie/g, 'ee');
    s = s.replace(/sch/g, 'sh');
    s = s.replace(/ch/g, 'kh');
    s = s.replace(/w/g, 'v');
    s = s.replace(/v/g, 'f');
    s = s.replace(/j/g, 'y');
    s = s.replace(/z/g, 'ts');
    s = s.replace(/ß/g, 'ss');
    s = s.replace(/ä/g, 'ay');
    s = s.replace(/ö/g, 'ur');
    s = s.replace(/ü/g, 'oo');
    
    // Basic verb endings
    s = s.replace(/e$/g, 'uh');
    
    return s;
}
"""

if "function getPhonetic" not in content:
    content = content.replace("const generateVerbsDeck = () => {", phonetic_func + "\nconst generateVerbsDeck = () => {")

# Update generateVerbsDeck card back
old_back_str = "back: `${deSubj} ${verbForm}`,"
new_back_str = """back: `<div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;"><span>${deSubj} ${verbForm}</span><span style="font-size:1.5rem; color:#a5b4fc;">[${getPhonetic(deSubj + ' ' + verbForm)}]</span></div>`,"""
content = content.replace(old_back_str, new_back_str)

# Also need to make sure the tts handles the HTML on the back properly.
# The user wants TTS ONLY for the German side, so removing the English TTS button from HTML is already done.
# But wait, earlier I replaced back TTS with `.replace(/<[^>]*>?/gm, '')`.
# It will read: `ich komme [ikh kom-uh]`.
# We don't want the TTS to read the phonetic bracket aloud!
# So we should only read the original German string.
# Wait, if the HTML is:
# `<div ...><span>ich komme</span><span ...>[ikh kommuh]</span></div>`
# Replacing HTML tags leaves: `ich komme[ikh kommuh]`
# Let's fix the TTS string in app.js.

old_speak_de = "speak(flashcards[currentIndex].back.replace(/<[^>]*>?/gm, ''), 'de-DE');"
# To fix this, I can store the pure text in `card.backText` when creating the card.
content = content.replace(old_speak_de, "speak(flashcards[currentIndex].backText || flashcards[currentIndex].back.replace(/<[^>]*>?/gm, ''), 'de-DE');")

# In generateVerbsDeck, add backText property.
old_push = "cards.push({"
new_push = "cards.push({ backText: `${deSubj} ${verbForm}`,"
content = content.replace(old_push, new_push)

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated app.js with phonetics and backText for TTS.")
