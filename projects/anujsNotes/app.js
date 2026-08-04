const VERB_DATA = [
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

      cards.push({ backText: `${deSubj} ${verbForm}`,
        front: `<div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;"><span>${enSubj} ${enVerb}</span><span style="font-size:1.5rem; color:#64748b;">${hiSubj} ${verb.hi}</span></div>`,
        back: `<div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;"><span>${deSubj} ${verbForm}</span><span style="font-size:1.5rem; color:#a5b4fc;">[${getPhonetic(deSubj + ' ' + verbForm)}]</span></div>`,
        hint: `Infinitive: ${verb.inf} (${verb.hi}) ${verb.irr ? '[Irregular]' : ''}`.trim()
      });

      subjectIndex++;
    }
  }
  return cards;
};

const DECKS = {
    ep1: generateVerbsDeck(),
    ep2: [
        { front: 'W sounds like...', back: 'v', hint: 'Like in "Wasser" or "wir"' },
        { front: 'V sounds like...', back: 'f (usually)', hint: 'Like in "Vater" or "Vogel"' },
        { front: 'J sounds like...', back: 'y', hint: 'Like in "ja" or "Jahr"' },
        { front: 'Z sounds like...', back: 'ts', hint: 'Like in "zehn" or "Zeit"' },
        { front: 'S (at start of word) sounds like...', back: 'z', hint: 'Like in "Sonne" or "singen"' },
        { front: 'S (at end of word) sounds like...', back: 's', hint: 'Like in "Haus" or "Maus"' },
        { front: 'ß (Eszett) sounds like...', back: 'ss', hint: 'Like in "heißen" or "Fuß"' },
        { front: 'ei sounds like...', back: '"eye"', hint: 'Like in "mein", "dein", "nein"' },
        { front: 'ie sounds like...', back: 'long "ee"', hint: 'Like in "Liebe", "sie", "wie"' },
        { front: 'eu sounds like...', back: '"oy"', hint: 'Like in "neu", "Europa", "Euro"' },
        { front: 'äu sounds like...', back: '"oy"', hint: 'Like in "Häuser", "Mäuse"' },
        { front: 'au sounds like...', back: '"ow"', hint: 'Like in "Haus", "Maus", "blau"' },
        { front: 'ä (A-Umlaut) sounds like...', back: 'eh (like in "bed")', hint: 'Like in "Käse", "Mädchen"' },
        { front: 'ö (O-Umlaut) sounds like...', back: 'er (without the r)', hint: 'Make "ee" sound with round lips. Like "schön"' },
        { front: 'ü (U-Umlaut) sounds like...', back: 'ew', hint: 'Make "ee" sound with tight round lips. Like "fünf"' },
        { front: 'ch (after a, o, u, au) sounds like...', back: 'hard throat sound (loch)', hint: 'Like in "Buch", "auch", "machen"' },
        { front: 'ch (after e, i, ä, ö, ü, eu, äu) sounds like...', back: 'soft hissing sound (huge)', hint: 'Like in "ich", "mich", "dich"' },
        { front: 'sch sounds like...', back: 'sh', hint: 'Like in "Schule", "schön", "schlafen"' },
        { front: 'st (at start of word/syllable) sounds like...', back: 'sht', hint: 'Like in "Stadt", "stehen"' },
        { front: 'sp (at start of word/syllable) sounds like...', back: 'shp', hint: 'Like in "spielen", "Sport"' },
        { front: 'tion (at end of word) sounds like...', back: 'tsi-ohn', hint: 'Like in "Information", "Station"' },
        { front: 'ig (at end of word) sounds like...', back: 'ikh', hint: 'Like in "zwanzig", "richtig"' },
        { front: 'R (at start of word) sounds like...', back: 'guttural trill (from throat)', hint: 'Like in "rot", "Reise"' },
        { front: 'R (at end of word) sounds like...', back: 'vocalized (like short "a")', hint: 'Like in "Vater", "Bruder", "wir"' },
        { front: 'A sounds like...', back: 'ah', hint: 'Like in "Apfel", "Mann"' },
        { front: 'E sounds like...', back: 'eh', hint: 'Like in "Elefant", "essen"' },
        { front: 'I sounds like...', back: 'ee', hint: 'Like in "Igel", "Insel"' },
        { front: 'O sounds like...', back: 'oh', hint: 'Like in "Opa", "oft"' },
        { front: 'U sounds like...', back: 'oo', hint: 'Like in "Uhr", "und"' },
        { front: 'B (at end of word) sounds like...', back: 'p', hint: 'Like in "gelb", "Dieb"' },
        { front: 'D (at end of word) sounds like...', back: 't', hint: 'Like in "Hund", "Bad"' },
        { front: 'G (at end of word) sounds like...', back: 'k', hint: 'Like in "Tag", "Zug"' },
        { front: 'Qu sounds like...', back: 'kv', hint: 'Like in "Qualität", "Quatsch"' },
        { front: 'Ph sounds like...', back: 'f', hint: 'Like in "Physik", "Foto"' },
        { front: 'Th sounds like...', back: 't (no "th" sound in German)', hint: 'Like in "Theater", "Thema"' },
        { front: 'C (before a, o, u) sounds like...', back: 'k', hint: 'Like in "Computer", "Café"' },
        { front: 'C (before e, i, ä, ö) sounds like...', back: 'ts', hint: 'Like in "Cent", "circa"' },
        { front: 'Y (in middle of word) sounds like...', back: 'ü', hint: 'Like in "Typ", "System"' },
        { front: 'X sounds like...', back: 'ks', hint: 'Like in "Max", "Axt"' },
        { front: 'Tsch sounds like...', back: 'ch (like in "church")', hint: 'Like in "Tschüss", "Deutsch"' },
        { front: 'M sounds like...', back: 'm', hint: 'Like in "Mutter"' },
        { front: 'N sounds like...', back: 'n', hint: 'Like in "Natur"' },
        { front: 'L sounds like...', back: 'l', hint: 'Like in "Liebe"' },
        { front: 'K sounds like...', back: 'k', hint: 'Like in "Kind"' },
        { front: 'P sounds like...', back: 'p', hint: 'Like in "Papa"' },
        { front: 'T sounds like...', back: 't', hint: 'Like in "Tante"' },
        { front: 'H (at start) sounds like...', back: 'h', hint: 'Like in "Hallo"' },
        { front: 'H (after vowel) sounds like...', back: 'silent (lengthens vowel)', hint: 'Like in "sehen", "gehen"' },
        { front: 'F sounds like...', back: 'f', hint: 'Like in "Fisch"' },
        { front: 'G (at start) sounds like...', back: 'g', hint: 'Like in "gut"' }
    ],
    ep3: [
        { front: '0', back: 'null', hint: 'Number' },
        { front: '1', back: 'eins', hint: 'Number' },
        { front: '2', back: 'zwei', hint: 'Number' },
        { front: '3', back: 'drei', hint: 'Number' },
        { front: '4', back: 'vier', hint: 'Number' },
        { front: '5', back: 'fünf', hint: 'Number' },
        { front: '6', back: 'sechs', hint: 'Number' },
        { front: '7', back: 'sieben', hint: 'Number' },
        { front: '8', back: 'acht', hint: 'Number' },
        { front: '9', back: 'neun', hint: 'Number' },
        { front: '10', back: 'zehn', hint: 'Number' },
        { front: '11', back: 'elf', hint: 'Number' },
        { front: '12', back: 'zwölf', hint: 'Number' },
        { front: '13', back: 'dreizehn', hint: '3 + 10' },
        { front: '14', back: 'vierzehn', hint: '4 + 10' },
        { front: '15', back: 'fünfzehn', hint: '5 + 10' },
        { front: '16', back: 'sechzehn', hint: 'drops the s from sechs' },
        { front: '17', back: 'siebzehn', hint: 'drops the en from sieben' },
        { front: '18', back: 'achtzehn', hint: '8 + 10' },
        { front: '19', back: 'neunzehn', hint: '9 + 10' },
        { front: '20', back: 'zwanzig', hint: 'Tens' },
        { front: '21', back: 'einundzwanzig', hint: '1 and 20' },
        { front: '22', back: 'zweiundzwanzig', hint: '2 and 20' },
        { front: '23', back: 'dreiundzwanzig', hint: '3 and 20' },
        { front: '24', back: 'vierundzwanzig', hint: '4 and 20' },
        { front: '25', back: 'fünfundzwanzig', hint: '5 and 20' },
        { front: '30', back: 'dreißig', hint: 'Uses ß instead of z' },
        { front: '31', back: 'einunddreißig', hint: '1 and 30' },
        { front: '40', back: 'vierzig', hint: 'Tens' },
        { front: '42', back: 'zweiundvierzig', hint: '2 and 40' },
        { front: '50', back: 'fünfzig', hint: 'Tens' },
        { front: '55', back: 'fünfundfünfzig', hint: '5 and 50' },
        { front: '60', back: 'sechzig', hint: 'drops s from sechs' },
        { front: '70', back: 'siebzig', hint: 'drops en from sieben' },
        { front: '80', back: 'achtzig', hint: 'Tens' },
        { front: '90', back: 'neunzig', hint: 'Tens' },
        { front: '100', back: 'hundert', hint: 'Hundreds' },
        { front: '101', back: 'hunderteins', hint: '100 + 1' },
        { front: '200', back: 'zweihundert', hint: '2 + 100' },
        { front: '1000', back: 'tausend', hint: 'Thousands' },
        { front: 'plus (+)', back: 'plus', hint: 'Math' },
        { front: 'minus (-)', back: 'minus', hint: 'Math' },
        { front: 'times (x)', back: 'mal', hint: 'Math' },
        { front: 'divided by (/)', back: 'durch', hint: 'Math' },
        { front: 'equals (=)', back: 'ist / macht', hint: 'Math' },
        { front: '1 + 1 = 2', back: 'eins plus eins ist zwei', hint: 'Math phrase' },
        { front: '10 - 5 = 5', back: 'zehn minus fünf ist fünf', hint: 'Math phrase' },
        { front: '3 x 4 = 12', back: 'drei mal vier ist zwölf', hint: 'Math phrase' },
        { front: '20 / 2 = 10', back: 'zwanzig durch zwei ist zehn', hint: 'Math phrase' },
        { front: 'How old are you?', back: 'Wie alt bist du?', hint: 'Age question' }
    ],
    ep4: [
        { front: 'I am', back: 'ich bin', hint: 'sein (to be)' },
        { front: 'You are (informal)', back: 'du bist', hint: 'sein (to be)' },
        { front: 'He is', back: 'er ist', hint: 'sein (to be)' },
        { front: 'She is', back: 'sie ist', hint: 'sein (to be)' },
        { front: 'It is', back: 'es ist', hint: 'sein (to be)' },
        { front: 'We are', back: 'wir sind', hint: 'sein (to be)' },
        { front: 'You all are', back: 'ihr seid', hint: 'sein (to be)' },
        { front: 'They are', back: 'sie sind', hint: 'sein (to be)' },
        { front: 'You are (formal)', back: 'Sie sind', hint: 'sein (to be)' },
        { front: 'I have', back: 'ich habe', hint: 'haben (to have)' },
        { front: 'You have (informal)', back: 'du hast', hint: 'haben (to have)' },
        { front: 'He has', back: 'er hat', hint: 'haben (to have)' },
        { front: 'She has', back: 'sie hat', hint: 'haben (to have)' },
        { front: 'It has', back: 'es hat', hint: 'haben (to have)' },
        { front: 'We have', back: 'wir haben', hint: 'haben (to have)' },
        { front: 'You all have', back: 'ihr habt', hint: 'haben (to have)' },
        { front: 'They have', back: 'sie haben', hint: 'haben (to have)' },
        { front: 'You have (formal)', back: 'Sie haben', hint: 'haben (to have)' },
        { front: 'My name is... (I am called)', back: 'Ich heiße...', hint: 'Self-introduction' },
        { front: 'My name is... (My name is)', back: 'Mein Name ist...', hint: 'Self-introduction' },
        { front: 'I am... (I am Anuj)', back: 'Ich bin...', hint: 'Self-introduction' },
        { front: 'What is your name? (informal)', back: 'Wie heißt du?', hint: 'Asking name' },
        { front: 'What is your name? (formal)', back: 'Wie heißen Sie?', hint: 'Asking name' },
        { front: 'I am from India', back: 'Ich komme aus Indien', hint: 'Origin' },
        { front: 'I am from Germany', back: 'Ich komme aus Deutschland', hint: 'Origin' },
        { front: 'Where do you come from? (informal)', back: 'Woher kommst du?', hint: 'Asking origin' },
        { front: 'Where do you come from? (formal)', back: 'Woher kommen Sie?', hint: 'Asking origin' },
        { front: 'I live in Berlin', back: 'Ich wohne in Berlin', hint: 'Residence' },
        { front: 'Where do you live? (informal)', back: 'Wo wohnst du?', hint: 'Asking residence' },
        { front: 'Where do you live? (formal)', back: 'Wo wohnen Sie?', hint: 'Asking residence' },
        { front: 'I speak English and German', back: 'Ich spreche Englisch und Deutsch', hint: 'Languages' },
        { front: 'What do you speak? (informal)', back: 'Was sprichst du?', hint: 'Asking languages' },
        { front: 'What do you speak? (formal)', back: 'Was sprechen Sie?', hint: 'Asking languages' },
        { front: 'I am a student (male)', back: 'Ich bin Student', hint: 'Profession' },
        { front: 'I am a student (female)', back: 'Ich bin Studentin', hint: 'Profession' },
        { front: 'I am a teacher (male)', back: 'Ich bin Lehrer', hint: 'Profession' },
        { front: 'I am a teacher (female)', back: 'Ich bin Lehrerin', hint: 'Profession' },
        { front: 'What is your profession? (informal)', back: 'Was bist du von Beruf?', hint: 'Asking profession' },
        { front: 'What is your profession? (formal)', back: 'Was sind Sie von Beruf?', hint: 'Asking profession' },
        { front: 'I am 25 years old', back: 'Ich bin 25 Jahre alt', hint: 'Age' },
        { front: 'I have a car', back: 'Ich habe ein Auto', hint: 'Possession' },
        { front: 'I have time', back: 'Ich habe Zeit', hint: 'Possession' },
        { front: 'I am hungry', back: 'Ich habe Hunger', hint: 'Idiom (I have hunger)' },
        { front: 'I am thirsty', back: 'Ich habe Durst', hint: 'Idiom (I have thirst)' },
        { front: 'I am right', back: 'Ich habe Recht', hint: 'Idiom (I have right)' },
        { front: 'I am afraid', back: 'Ich habe Angst', hint: 'Idiom (I have fear)' },
        { front: 'I am tired', back: 'Ich bin müde', hint: 'State' },
        { front: 'The weather is nice', back: 'Das Wetter ist schön', hint: 'Description' },
        { front: 'We are here', back: 'Wir sind hier', hint: 'Location' },
        { front: 'The book is interesting', back: 'Das Buch ist interessant', hint: 'Description' }
    ],
    ep5: generateVerbsDeck(),
    ep6: [
        { front: 'Good morning!', back: 'Guten Morgen!', hint: 'Greeting (until ~10am)' },
        { front: 'Good day! / Hello!', back: 'Guten Tag!', hint: 'Greeting (all day)' },
        { front: 'Good evening!', back: 'Guten Abend!', hint: 'Greeting (after 6pm)' },
        { front: 'Good night!', back: 'Gute Nacht!', hint: 'Leaving for bed' },
        { front: 'Hello! (informal)', back: 'Hallo!', hint: 'Common greeting' },
        { front: 'Hi! (informal)', back: 'Hi!', hint: 'Casual greeting' },
        { front: 'Greetings! (Southern Germany)', back: 'Grüß Gott!', hint: 'Regional greeting' },
        { front: 'Hello! (Switzerland/South)', back: 'Servus!', hint: 'Regional greeting' },
        { front: 'Hello! (Northern Germany)', back: 'Moin!', hint: 'Regional greeting' },
        { front: 'Goodbye! (formal)', back: 'Auf Wiedersehen!', hint: 'Farewell' },
        { front: 'Bye! (informal)', back: 'Tschüss!', hint: 'Casual farewell' },
        { front: 'See you later!', back: 'Bis später!', hint: 'Farewell' },
        { front: 'See you soon!', back: 'Bis bald!', hint: 'Farewell' },
        { front: 'See you tomorrow!', back: 'Bis morgen!', hint: 'Farewell' },
        { front: 'Have a nice day!', back: 'Schönen Tag noch!', hint: 'Polite farewell' },
        { front: 'Have a nice weekend!', back: 'Schönes Wochenende!', hint: 'Polite farewell' },
        { front: 'How are you? (formal)', back: 'Wie geht es Ihnen?', hint: 'Asking well-being' },
        { front: 'How are you? (informal)', back: 'Wie geht es dir?', hint: 'Asking well-being' },
        { front: 'How\'s it going? (casual)', back: 'Wie geht\'s?', hint: 'Short form' },
        { front: 'I am doing well', back: 'Mir geht es gut', hint: 'Response' },
        { front: 'Good, thanks', back: 'Gut, danke', hint: 'Short response' },
        { front: 'Very good', back: 'Sehr gut', hint: 'Response' },
        { front: 'Not so good', back: 'Nicht so gut', hint: 'Response' },
        { front: 'Bad', back: 'Schlecht', hint: 'Response' },
        { front: 'So-so', back: 'Es geht', hint: 'Response' },
        { front: 'And you? (formal)', back: 'Und Ihnen?', hint: 'Return question' },
        { front: 'And you? (informal)', back: 'Und dir?', hint: 'Return question' },
        { front: 'Please', back: 'Bitte', hint: 'Politeness' },
        { front: 'Thank you', back: 'Danke', hint: 'Gratitude' },
        { front: 'Thank you very much', back: 'Danke schön / Vielen Dank', hint: 'Gratitude' },
        { front: 'You are welcome', back: 'Bitte schön / Gern geschehen', hint: 'Response to thanks' },
        { front: 'Excuse me', back: 'Entschuldigung', hint: 'Getting attention / minor apology' },
        { front: 'I am sorry', back: 'Es tut mir leid', hint: 'Apology' },
        { front: 'No problem', back: 'Kein Problem', hint: 'Reassurance' },
        { front: 'Yes', back: 'Ja', hint: 'Agreement' },
        { front: 'No', back: 'Nein', hint: 'Disagreement' },
        { front: 'Maybe', back: 'Vielleicht', hint: 'Uncertainty' },
        { front: 'I don\'t know', back: 'Ich weiß (es) nicht', hint: 'Lack of knowledge' },
        { front: 'I understand', back: 'Ich verstehe', hint: 'Comprehension' },
        { front: 'I don\'t understand', back: 'Ich verstehe nicht', hint: 'Lack of comprehension' },
        { front: 'Do you speak English? (formal)', back: 'Sprechen Sie Englisch?', hint: 'Question' },
        { front: 'Do you speak English? (informal)', back: 'Sprichst du Englisch?', hint: 'Question' },
        { front: 'Please speak slowly', back: 'Bitte sprechen Sie langsam', hint: 'Request' },
        { front: 'Could you repeat that?', back: 'Können Sie das bitte wiederholen?', hint: 'Request' },
        { front: 'What does ... mean?', back: 'Was bedeutet ...?', hint: 'Asking for meaning' },
        { front: 'How do you say ... in German?', back: 'Wie sagt man ... auf Deutsch?', hint: 'Asking for translation' },
        { front: 'Cheers!', back: 'Prost!', hint: 'Drinking' },
        { front: 'Enjoy your meal!', back: 'Guten Appetit!', hint: 'Eating' },
        { front: 'Bless you!', back: 'Gesundheit!', hint: 'After someone sneezes' },
        { front: 'Welcome!', back: 'Willkommen!', hint: 'Greeting' }
    ],
    ep_ml1: [
        { front: 'What is Machine Learning?', back: 'Systems that improve at a task by learning patterns from experience/data.', hint: 'Core definition' },
        { front: 'Supervised Learning', back: 'Learning from labeled data (Data + Known answers).', hint: 'Learning paradigm' },
        { front: 'Unsupervised Learning', back: 'Finding structure in data without externally supplied target labels.', hint: 'Learning paradigm' },
        { front: 'Regression', back: 'Predicting a numeric/continuous quantity (e.g. price).', hint: 'Supervised task' },
        { front: 'Classification', back: 'Predicting discrete categories or labels (e.g. spam/not spam).', hint: 'Supervised task' },
        { front: 'Feature', back: 'An input variable used by the model.', hint: 'Vocabulary' },
        { front: 'Label / Target', back: 'The output variable the model is trying to predict.', hint: 'Vocabulary' },
        { front: 'Parameter', back: 'A value optimized/learned automatically during training.', hint: 'Vocabulary' },
        { front: 'Hyperparameter', back: 'A configuration value set manually before training.', hint: 'Vocabulary' },
        { front: 'Overfitting', back: 'Model learns noise in training data; performs poorly on unseen data (High Variance).', hint: 'Model performance' },
        { front: 'Underfitting', back: 'Model is too simple to capture underlying patterns (High Bias).', hint: 'Model performance' },
        { front: 'Data Leakage', back: 'When training accidentally uses information unavailable at prediction time.', hint: 'Common ML error' },
        { front: 'Batch Learning', back: 'Training offline on a fixed, static snapshot of data.', hint: 'Training mode' },
        { front: 'Online Learning', back: 'Updating a model incrementally as new data arrives.', hint: 'Training mode' },
        { front: 'Precision', back: 'Of all predicted positives, how many were truly positive? (TP / (TP + FP))', hint: 'Evaluation metric' },
        { front: 'Recall (Sensitivity)', back: 'Of all actual positives, how many did the model catch? (TP / (TP + FN))', hint: 'Evaluation metric' },
        { front: 'F1 Score', back: 'The harmonic mean of precision and recall.', hint: 'Evaluation metric' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.flashcard-3d-container');
    if (!container) return;

    let episodeKey = container.getAttribute('data-episode');
    
    // Check hash for episode routing (e.g. #ep2)
    const hash = window.location.hash.substring(1);
    if (hash && DECKS[hash]) {
        episodeKey = hash;
        container.setAttribute('data-episode', hash);
    }

    // Listen for hash changes to re-initialize deck
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && DECKS[newHash]) {
            // Update UI selector if it exists
            const selector = document.getElementById('deck-selector');
            if (selector) selector.value = newHash;
            
            episodeKey = newHash;
            container.setAttribute('data-episode', newHash);
            loadDeck(newHash);
        }
    });

    let flashcards = DECKS[episodeKey] || DECKS.ep1;
    let initialFlashcards = [...flashcards];

    let currentIndex = 0;
    let isFlipped = false;
    let showHint = false;
    
    let storageKey = 'flashcard_state_' + episodeKey;
    let savedState = JSON.parse(localStorage.getItem(storageKey)) || {
        tracking: false,
        currentIndex: 0
    };

    let isTracking = savedState.tracking;
    currentIndex = savedState.currentIndex || 0;
    if (currentIndex >= flashcards.length) currentIndex = 0;

    const flashcard = document.querySelector('.flashcard-element');
    const frontText = document.querySelector('.card-front-text');
    const backText = document.querySelector('.card-back-text');
    const hintBtn = document.querySelector('.show-hint-btn');
    const hintText = document.querySelector('.hint-text');
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-card-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const progressText = document.querySelector('.inline-progress-text');
    const progressBar = document.querySelector('.progress-fill');
    
    const ttsEnBtn = document.querySelector('.tts-en');
    const ttsDeBtn = document.querySelector('.tts-de');
    
    // Fallback to class selector if specific ID is not found (useful for flashcards.html)
    let toggleSwitch = document.querySelector(`#track-learning-toggle-${episodeKey}`) || document.querySelector('.track-learning-toggle');
    const feedbackControls = document.querySelector('.learning-feedback-controls');
    const gotItBtn = document.querySelector('.got-it-btn');
    const needsReviewBtn = document.querySelector('.needs-review-btn');

    if (toggleSwitch) {
        toggleSwitch.checked = isTracking;
        toggleSwitch.addEventListener('change', (e) => {
            isTracking = e.target.checked;
            saveState();
            renderCard();
        });
    }

    function loadDeck(key) {
        flashcards = DECKS[key];
        initialFlashcards = [...flashcards];
        storageKey = 'flashcard_state_' + key;
        
        savedState = JSON.parse(localStorage.getItem(storageKey)) || {
            tracking: false,
            currentIndex: 0
        };
        isTracking = savedState.tracking;
        currentIndex = savedState.currentIndex || 0;
        if (currentIndex >= flashcards.length) currentIndex = 0;
        
        // Re-evaluate toggleSwitch in case it depends on the key
        toggleSwitch = document.querySelector(`#track-learning-toggle-${key}`) || document.querySelector('.track-learning-toggle');
        
        if (toggleSwitch) {
            toggleSwitch.checked = isTracking;
        }
        
        renderCard();
    }

    function saveState() {
        localStorage.setItem(storageKey, JSON.stringify({
            tracking: isTracking,
            currentIndex: currentIndex
        }));
    }

    function renderCard() {
        const card = flashcards[currentIndex];
        frontText.innerHTML = card.front;
        backText.innerHTML = card.back;
        hintText.textContent = card.hint || 'No hint available';
        
        progressText.textContent = `${currentIndex + 1} / ${flashcards.length}`;
        if(progressBar) {
            progressBar.style.width = `${((currentIndex + 1) / flashcards.length) * 100}%`;
        }

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;
        
        // Stop any currently playing audio when card changes
        window.speechSynthesis.cancel();

        isFlipped = false;
        flashcard.style.transform = 'rotateY(0deg)';
        showHint = false;
        hintBtn.style.display = 'flex';
        hintText.classList.add('hidden');
        feedbackControls.classList.add('hidden');
        
        saveState();
    }

    function toggleFlip() {
        isFlipped = !isFlipped;
        flashcard.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        
        if (isTracking && isFlipped) {
            feedbackControls.classList.remove('hidden');
        } else {
            feedbackControls.classList.add('hidden');
        }
    }

    // TTS Functionality
    function speak(text, lang) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Stop current
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        // Adjust for more natural voice if possible
        utterance.rate = 0.9; 
        window.speechSynthesis.speak(utterance);
    }

    if (ttsEnBtn) {
        ttsEnBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].front.replace(/<[^>]*>?/gm, ''), 'en-US');
        });
    }

    if (ttsDeBtn) {
        ttsDeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].backText || flashcards[currentIndex].back.replace(/<[^>]*>?/gm, ''), 'de-DE');
        });
    }

    flashcard.addEventListener('click', (e) => {
        if(e.target.closest('.feedback-btn') || e.target.closest('.card-icon-btn') || e.target.closest('.tts-btn')) return;
        toggleFlip();
    });

    hintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showHint = true;
        hintBtn.style.display = 'none';
        hintText.classList.remove('hidden');
    });

    const goToNext = () => {
        if (currentIndex < flashcards.length - 1) {
            isFlipped = false;
            flashcard.style.transform = 'rotateY(0deg)';
            feedbackControls.classList.add('hidden');
            setTimeout(() => {
                currentIndex++;
                renderCard();
            }, 150);
        }
    };

    nextBtn.addEventListener('click', goToNext);

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            isFlipped = false;
            flashcard.style.transform = 'rotateY(0deg)';
            feedbackControls.classList.add('hidden');
            setTimeout(() => {
                currentIndex--;
                renderCard();
            }, 150);
        }
    });
    
    gotItBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToNext();
    });
    
    needsReviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentCard = flashcards.splice(currentIndex, 1)[0];
        flashcards.push(currentCard);
        
        isFlipped = false;
        flashcard.style.transform = 'rotateY(0deg)';
        feedbackControls.classList.add('hidden');
        setTimeout(() => {
            if (currentIndex >= flashcards.length) {
                currentIndex = flashcards.length - 1;
            }
            renderCard();
        }, 150);
    });

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flashcards = [...flashcards].sort(() => Math.random() - 0.5);
            currentIndex = 0;
            renderCard();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            flashcards = [...initialFlashcards];
            currentIndex = 0;
            renderCard();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goToNext();
        else if (e.key === 'ArrowLeft') prevBtn.click();
        else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            toggleFlip();
        }
    });

    // Initial render
    renderCard();
});
