import os

app_js_path = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

missing_code = """const VERB_DATA = [
  { inf: "kommen", en: "come", en3: "comes", irr: false, forms: ["komme", "kommst", "kommt", "kommt", "kommen"] },
  { inf: "gehen", en: "go", en3: "goes", irr: false, forms: ["gehe", "gehst", "geht", "geht", "gehen"] },
  { inf: "machen", en: "do", en3: "does", irr: false, forms: ["mache", "machst", "macht", "macht", "machen"] },
  { inf: "wohnen", en: "live", en3: "lives", irr: false, forms: ["wohne", "wohnst", "wohnt", "wohnt", "wohnen"] },
  { inf: "lieben", en: "love", en3: "loves", irr: false, forms: ["liebe", "liebst", "liebt", "liebt", "lieben"] },
  { inf: "bringen", en: "bring", en3: "brings", irr: false, forms: ["bringe", "bringst", "bringt", "bringt", "bringen"] },
  { inf: "sprechen", en: "speak", en3: "speaks", irr: true, forms: ["spreche", "sprichst", "spricht", "sprecht", "sprechen"] },
  { inf: "kochen", en: "cook", en3: "cooks", irr: false, forms: ["koche", "kochst", "kocht", "kocht", "kochen"] },
  { inf: "fragen", en: "ask", en3: "asks", irr: false, forms: ["frage", "fragst", "fragt", "fragt", "fragen"] },
  { inf: "antworten", en: "reply", en3: "replies", irr: false, forms: ["antworte", "antwortest", "antwortet", "antwortet", "antworten"] },
  { inf: "baden", en: "bathe", en3: "bathes", irr: false, forms: ["bade", "badest", "badet", "badet", "baden"] },
  { inf: "essen", en: "eat", en3: "eats", irr: true, forms: ["esse", "isst", "isst", "esst", "essen"] },
  { inf: "singen", en: "sing", en3: "sings", irr: false, forms: ["singe", "singst", "singt", "singt", "singen"] },
  { inf: "tanzen", en: "dance", en3: "dances", irr: false, forms: ["tanze", "tanzt", "tanzt", "tanzt", "tanzen"] },
  { inf: "arbeiten", en: "work", en3: "works", irr: false, forms: ["arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeiten"] },
  { inf: "sehen", en: "see", en3: "sees", irr: true, forms: ["sehe", "siehst", "sieht", "seht", "sehen"] },
  { inf: "hören", en: "listen", en3: "listens", irr: false, forms: ["höre", "hörst", "hört", "hört", "hören"] },
  { inf: "laufen", en: "run", en3: "runs", irr: true, forms: ["laufe", "läufst", "läuft", "lauft", "laufen"] },
  { inf: "lesen", en: "read", en3: "reads", irr: true, forms: ["lese", "liest", "liest", "lest", "lesen"] },
  { inf: "schreiben", en: "write", en3: "writes", irr: false, forms: ["schreibe", "schreibst", "schreibt", "schreibt", "schreiben"] },
  { inf: "suchen", en: "search", en3: "searches", irr: false, forms: ["suche", "suchst", "sucht", "sucht", "suchen"] },
  { inf: "finden", en: "find", en3: "finds", irr: false, forms: ["finde", "findest", "findet", "findet", "finden"] },
  { inf: "stehen", en: "stand", en3: "stands", irr: false, forms: ["stehe", "stehst", "steht", "steht", "stehen"] },
  { inf: "sitzen", en: "sit", en3: "sits", irr: false, forms: ["sitze", "sitzt", "sitzt", "sitzt", "sitzen"] },
  { inf: "fahren", en: "drive", en3: "drives", irr: true, forms: ["fahre", "fährst", "fährt", "fahrt", "fahren"] },
  { inf: "reisen", en: "travel", en3: "travels", irr: false, forms: ["reise", "reist", "reist", "reist", "reisen"] },
  { inf: "treffen", en: "meet", en3: "meets", irr: true, forms: ["treffe", "triffst", "trifft", "trefft", "treffen"] },
  { inf: "schlafen", en: "sleep", en3: "sleeps", irr: true, forms: ["schlafe", "schläfst", "schläft", "schlaft", "schlafen"] },
  { inf: "lernen", en: "learn", en3: "learns", irr: false, forms: ["lerne", "lernst", "lernt", "lernt", "lernen"] },
  { inf: "lachen", en: "laugh", en3: "laughs", irr: false, forms: ["lache", "lachst", "lacht", "lacht", "lachen"] }
];

const SUBJECTS = [
  { en: "I", de: "ich" },
  { en: "You (informal)", de: "du" },
  { en: ["He", "She", "It"], de: ["er", "sie", "es"] },
  { en: "You (plural)", de: "ihr" },
  { en: ["They", "You (formal)"], de: ["sie", "Sie"] }
];

const generateVerbsDeck = () => {
  const cards = [];
  let subjectIndex = 0;
  let heSheItCycle = 0;
  let theyYouCycle = 0;

  for (let i = 0; i < VERB_DATA.length; i++) {
    const verb = VERB_DATA[i];
    for (let j = 0; j < 4; j++) {
      const sIndex = subjectIndex % 5;
      const subDef = SUBJECTS[sIndex];

      let enSubj, deSubj;
      if (sIndex === 2) {
         enSubj = subDef.en[heSheItCycle % 3];
         deSubj = subDef.de[heSheItCycle % 3];
         heSheItCycle++;
      } else if (sIndex === 4) {
         enSubj = subDef.en[theyYouCycle % 2];
         deSubj = subDef.de[theyYouCycle % 2];
         theyYouCycle++;
      } else {
         enSubj = subDef.en;
         deSubj = subDef.de;
      }

      const enVerb = (sIndex === 2) ? verb.en3 : verb.en;
      const verbForm = verb.forms[sIndex];

      cards.push({
        front: `${enSubj} ${enVerb}`,
        back: `${deSubj} ${verbForm}`,
        hint: `Infinitive: ${verb.inf} ${verb.irr ? '(Irregular)' : ''}`.trim()
      });

      subjectIndex++;
    }
  }
  return cards;
};

"""

if "const VERB_DATA =" not in content:
    content = missing_code + content
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed app.js by prepending VERB_DATA and generateVerbsDeck")
else:
    print("app.js already has VERB_DATA")
