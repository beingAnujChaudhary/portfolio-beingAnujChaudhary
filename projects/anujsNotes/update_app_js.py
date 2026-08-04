import os
import re

app_js_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"
with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace VERB_DATA block
verb_data_replacement = """const VERB_DATA = [
  { inf: "kommen", en: "come", en3: "comes", hi: "आना", irr: false, forms: ["komme", "kommst", "kommt", "kommt", "kommen"] },
  { inf: "gehen", en: "go", en3: "goes", hi: "जाना", irr: false, forms: ["gehe", "gehst", "geht", "geht", "gehen"] },
  { inf: "machen", en: "do/make", en3: "does/makes", hi: "करना/बनाना", irr: false, forms: ["mache", "machst", "macht", "macht", "machen"] },
  { inf: "wohnen", en: "live", en3: "lives", hi: "रहना", irr: false, forms: ["wohne", "wohnst", "wohnt", "wohnt", "wohnen"] },
  { inf: "lieben", en: "love", en3: "loves", hi: "प्यार करना", irr: false, forms: ["liebe", "liebst", "liebt", "liebt", "lieben"] },
  { inf: "bringen", en: "bring", en3: "brings", hi: "लाना", irr: false, forms: ["bringe", "bringst", "bringt", "bringt", "bringen"] },
  { inf: "sprechen", en: "speak", en3: "speaks", hi: "बोलना", irr: true, forms: ["spreche", "sprichst", "spricht", "sprecht", "sprechen"] },
  { inf: "kochen", en: "cook", en3: "cooks", hi: "पकाना", irr: false, forms: ["koche", "kochst", "kocht", "kocht", "kochen"] },
  { inf: "fragen", en: "ask", en3: "asks", hi: "पूछना", irr: false, forms: ["frage", "fragst", "fragt", "fragt", "fragen"] },
  { inf: "antworten", en: "reply", en3: "replies", hi: "उत्तर देना", irr: false, forms: ["antworte", "antwortest", "antwortet", "antwortet", "antworten"] },
  { inf: "baden", en: "bathe", en3: "bathes", hi: "नहाना", irr: false, forms: ["bade", "badest", "badet", "badet", "baden"] },
  { inf: "essen", en: "eat", en3: "eats", hi: "खाना", irr: true, forms: ["esse", "isst", "isst", "esst", "essen"] },
  { inf: "singen", en: "sing", en3: "sings", hi: "गाना", irr: false, forms: ["singe", "singst", "singt", "singt", "singen"] },
  { inf: "tanzen", en: "dance", en3: "dances", hi: "नाचना", irr: false, forms: ["tanze", "tanzt", "tanzt", "tanzt", "tanzen"] },
  { inf: "arbeiten", en: "work", en3: "works", hi: "काम करना", irr: false, forms: ["arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeiten"] },
  { inf: "sehen", en: "see", en3: "sees", hi: "देखना", irr: true, forms: ["sehe", "siehst", "sieht", "seht", "sehen"] },
  { inf: "hören", en: "listen", en3: "listens", hi: "सुनना", irr: false, forms: ["höre", "hörst", "hört", "hört", "hören"] },
  { inf: "laufen", en: "run", en3: "runs", hi: "दौड़ना", irr: true, forms: ["laufe", "läufst", "läuft", "lauft", "laufen"] },
  { inf: "lesen", en: "read", en3: "reads", hi: "पढ़ना", irr: true, forms: ["lese", "liest", "liest", "lest", "lesen"] },
  { inf: "schreiben", en: "write", en3: "writes", hi: "लिखना", irr: false, forms: ["schreibe", "schreibst", "schreibt", "schreibt", "schreiben"] },
  { inf: "suchen", en: "search", en3: "searches", hi: "खोजना", irr: false, forms: ["suche", "suchst", "sucht", "sucht", "suchen"] },
  { inf: "finden", en: "find", en3: "finds", hi: "पाना", irr: false, forms: ["finde", "findest", "findet", "findet", "finden"] },
  { inf: "stehen", en: "stand", en3: "stands", hi: "खड़ा होना", irr: false, forms: ["stehe", "stehst", "steht", "steht", "stehen"] },
  { inf: "sitzen", en: "sit", en3: "sits", hi: "बैठना", irr: false, forms: ["sitze", "sitzt", "sitzt", "sitzt", "sitzen"] },
  { inf: "fahren", en: "drive", en3: "drives", hi: "चलाना", irr: true, forms: ["fahre", "fährst", "fährt", "fahrt", "fahren"] },
  { inf: "reisen", en: "travel", en3: "travels", hi: "यात्रा करना", irr: false, forms: ["reise", "reist", "reist", "reist", "reisen"] },
  { inf: "treffen", en: "meet", en3: "meets", hi: "मिलना", irr: true, forms: ["treffe", "triffst", "trifft", "trefft", "treffen"] },
  { inf: "schlafen", en: "sleep", en3: "sleeps", hi: "सोना", irr: true, forms: ["schlafe", "schläfst", "schläft", "schlaft", "schlafen"] },
  { inf: "lernen", en: "learn", en3: "learns", hi: "सीखना", irr: false, forms: ["lerne", "lernst", "lernt", "lernt", "lernen"] },
  { inf: "lachen", en: "laugh", en3: "laughs", hi: "हंसना", irr: false, forms: ["lache", "lachst", "lacht", "lacht", "lachen"] }
];

const SUBJECTS = [
  { en: "I", de: "ich", hi: "मैं" },
  { en: "You (informal)", de: "du", hi: "तू/तुम" },
  { en: ["He", "She", "It"], de: ["er", "sie", "es"], hi: ["वह", "वह", "यह"] },
  { en: "We", de: "wir", hi: "हम" },
  { en: "You (plural)", de: "ihr", hi: "तुम सब" },
  { en: ["They", "You (formal)"], de: ["sie", "Sie"], hi: ["वे", "आप"] }
];

const generateVerbsDeck = () => {
  const cards = [];
  let subjectIndex = 0;
  let heSheItCycle = 0;
  let theyYouCycle = 0;

  for (let i = 0; i < VERB_DATA.length; i++) {
    const verb = VERB_DATA[i];
    for (let j = 0; j < 4; j++) {
      const sIndex = subjectIndex % 6; // 6 subjects now!
      const subDef = SUBJECTS[sIndex];

      let enSubj, deSubj, hiSubj;
      if (sIndex === 2) { // He, She, It
         enSubj = subDef.en[heSheItCycle % 3];
         deSubj = subDef.de[heSheItCycle % 3];
         hiSubj = subDef.hi[heSheItCycle % 3];
         heSheItCycle++;
      } else if (sIndex === 5) { // They, You (formal)
         enSubj = subDef.en[theyYouCycle % 2];
         deSubj = subDef.de[theyYouCycle % 2];
         hiSubj = subDef.hi[theyYouCycle % 2];
         theyYouCycle++;
      } else {
         enSubj = subDef.en;
         deSubj = subDef.de;
         hiSubj = subDef.hi;
      }

      let enVerb = enSubj === "He" || enSubj === "She" || enSubj === "It" ? verb.en3 : verb.en;
      
      let verbFormIndex;
      if (sIndex === 0) verbFormIndex = 0; // ich
      else if (sIndex === 1) verbFormIndex = 1; // du
      else if (sIndex === 2) verbFormIndex = 2; // er/sie/es
      else if (sIndex === 3) verbFormIndex = 4; // wir (uses plural form)
      else if (sIndex === 4) verbFormIndex = 3; // ihr
      else verbFormIndex = 4; // sie/Sie (uses plural form)

      const verbForm = verb.forms[verbFormIndex];

      cards.push({
        front: `<div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;"><span>${enSubj} ${enVerb}</span><span style="font-size:1.5rem; color:#64748b;">${hiSubj} ${verb.hi}</span></div>`,
        back: `${deSubj} ${verbForm}`,
        hint: `Infinitive: ${verb.inf} (${verb.hi}) ${verb.irr ? '[Irregular]' : ''}`.trim()
      });

      subjectIndex++;
    }
  }
  return cards;
};
"""

content = re.sub(r'const VERB_DATA = \[.*?const generateVerbsDeck = \(\) => \{.*?return cards;\n\};\n', verb_data_replacement, content, flags=re.DOTALL)

# Also fix the TTS speak logic to strip HTML
content = content.replace("speak(flashcards[currentIndex].front, 'en-US');", "speak(flashcards[currentIndex].front.replace(/<[^>]*>?/gm, ''), 'en-US');")
content = content.replace("speak(flashcards[currentIndex].back, 'de-DE');", "speak(flashcards[currentIndex].back.replace(/<[^>]*>?/gm, ''), 'de-DE');")

# Also add frontText.innerHTML instead of textContent since it contains HTML now
content = content.replace("frontText.textContent = card.front;", "frontText.innerHTML = card.front;")
content = content.replace("backText.textContent = card.back;", "backText.innerHTML = card.back;")

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(content)
print("app.js updated with Hindi context.")
