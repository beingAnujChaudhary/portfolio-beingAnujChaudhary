import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  Users,
  Globe,
  MessageSquare,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  Layers,
  Heart,
  Film,
  Compass,
  HelpCircle,
  Search,
  MapPin,
  Star,
  ChevronLeft
} from 'lucide-react';

const speakGerman = (text, rate = 0.92, pitch = 1.0) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = rate;
    utterance.pitch = pitch;
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find((v) => v.lang.startsWith('de'));
    if (deVoice) utterance.voice = deVoice;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
};

const FAMILY_LEXICON = [
  { de: 'der Vater', plural: 'die Väter', mein: 'mein Vater', en: 'Father', gender: 'M', icon: '👨🏻', pair: 'die Mutter' },
  { de: 'die Mutter', plural: 'die Mütter', mein: 'meine Mutter', en: 'Mother', gender: 'F', icon: '👩🏻', pair: 'der Vater' },
  { de: 'die Eltern (Pl.)', plural: 'nur Plural', mein: 'meine Eltern', en: 'Parents', gender: 'PL', icon: '👫🏻', pair: 'Always Plural!' },
  { de: 'der Sohn', plural: 'die Söhne', mein: 'mein Sohn', en: 'Son', gender: 'M', icon: '👦🏻', pair: 'die Tochter' },
  { de: 'die Tochter', plural: 'die Töchter', mein: 'meine Tochter', en: 'Daughter', gender: 'F', icon: '👧🏻', pair: 'der Sohn' },
  { de: 'der Bruder', plural: 'die Brüder', mein: 'mein Bruder', en: 'Brother', gender: 'M', icon: '🧑🏻', pair: 'die Schwester' },
  { de: 'die Schwester', plural: 'die Schwestern', mein: 'meine Schwester', en: 'Sister', gender: 'F', icon: '👱🏻♀️', pair: 'der Bruder' },
  { de: 'die Geschwister (Pl.)', plural: 'nur Plural', mein: 'meine Geschwister', en: 'Siblings (Brothers & Sisters)', gender: 'PL', icon: '👧🏻👦🏻', pair: 'Plural collective noun' },
  { de: 'der Großvater / der Opa', plural: 'die Opas', mein: 'mein Opa', en: 'Grandfather / Grandpa', gender: 'M', icon: '👴🏻', pair: 'die Großmutter / die Oma' },
  { de: 'die Großmutter / die Oma', plural: 'die Omas', mein: 'meine Oma', en: 'Grandmother / Grandma', gender: 'F', icon: '👵🏻', pair: 'der Großvater / der Opa' },
  { de: 'die Großeltern (Pl.)', plural: 'nur Plural', mein: 'meine Großeltern', en: 'Grandparents', gender: 'PL', icon: '👵🏻👴🏻', pair: 'Always Plural!' },
  { de: 'der Enkel', plural: 'die Enkel', mein: 'mein Enkel', en: 'Grandson', gender: 'M', icon: '👦🏼', pair: 'die Enkelin' },
  { de: 'die Enkelin', plural: 'die Enkelinnen', mein: 'meine Enkelin', en: 'Granddaughter', gender: 'F', icon: '👧🏼', pair: 'der Enkel' },
  { de: 'der (Ehe-)Mann', plural: 'die Männer', mein: 'mein Mann', en: 'Husband', gender: 'M', icon: '🤵🏻', pair: 'die (Ehe-)Frau' },
  { de: 'die (Ehe-)Frau', plural: 'die Frauen', mein: 'meine Frau', en: 'Wife', gender: 'F', icon: '👰🏻♀️', pair: 'der (Ehe-)Mann' }
];

const AUDIO_TRACKS = {
  '1.17': {
    title: 'Track 1.17 & 1.19 – Drehbuch-Szene: Herbert & Elvira (Ex. 1 & 3a, S. 17–18)',
    lines: [
      { speaker: 'Herbert', text: 'Elvira!' },
      { speaker: 'Elvira', text: 'Wer ist das? Ist das deine Frau?' },
      { speaker: 'Herbert', text: 'Nein. Das ist meine Mutter.' },
      { speaker: 'Elvira', text: 'Deine Mutter?! Das ist nicht deine Mutter.' },
      { speaker: 'Herbert', text: 'Doch.' },
      { speaker: 'Elvira', text: 'Sie ist nicht sehr alt, hm?' },
      { speaker: 'Herbert', text: 'Doch. Sie ist vierundsiebzig.' },
      { speaker: 'Elvira', text: 'Ach Herbert! Ist das deine Frau?' },
      { speaker: 'Herbert', text: 'Elvira! Bitte!' },
      { speaker: 'Elvira', text: 'Bist du verheiratet?' },
      { speaker: 'Herbert', text: 'Nein, Elvira. Ich bin nicht verheiratet.' },
      { speaker: 'Elvira', text: 'Nein?' }
    ]
  },
  '1.18': {
    title: 'Track 1.18 – Was sagt Mark Poppenreuther? (Ex. 2, Seite 17)',
    lines: [
      {
        speaker: 'Mark (21)',
        text: 'Hallo! Ich bin Mark Poppenreuther. Sehen Sie das Bild hier am Computer? Das sind meine Eltern, Bernd und Olga Poppenreuther.'
      },
      {
        speaker: 'Mark (21)',
        text: 'Meine Eltern sind beide Schauspieler von Beruf. Sie sind verheiratet und leben in Freiburg.'
      },
      {
        speaker: 'Mark (21)',
        text: 'Auch mein Großvater Carl und meine Großmutter Helga sind Schauspieler. Aber meine Schwester Angelica und ich sind keine Schauspieler! Ich bin einundzwanzig und studiere Physik in Stuttgart.'
      }
    ]
  },
  '1.20': {
    title: 'Track 1.20 – Marks Familie im Bildlexikon (Ex. 6a, Seite 19)',
    lines: [
      {
        speaker: 'Mark',
        text: 'Carl und Helga Poppenreuther sind meine Großeltern. Carl ist mein Großvater, also mein Opa, und Helga ist meine Großmutter, meine Oma.'
      },
      {
        speaker: 'Mark',
        text: 'Bernd und Olga Poppenreuther sind meine Eltern. Bernd ist mein Vater und Olga ist meine Mutter.'
      },
      {
        speaker: 'Mark',
        text: 'Und das bin ich, Mark. Angelica ist meine Schwester. Wir sind Geschwister.'
      }
    ]
  },
  '1.21': {
    title: 'Track 1.21 – Ausklang-Lied: „Wo wohnt Winfried?“ (Ex. 1, Seite 24)',
    lines: [
      {
        speaker: 'Lied (Chor)',
        text: 'Wohnt Winfried in Wien? Nein, er wohnt nicht in Wien! Wohnt er in Berlin oder in Schwerin? Nein!'
      },
      {
        speaker: 'Lied (Chor)',
        text: 'Wohnt er in Köln, Bonn, Frankfurt oder Bamberg? Nein! In Stuttgart, München, Freiburg oder Zürich? Nein! Wo wohnt Winfried?'
      }
    ]
  }
};

const AudioTrackPlayer = ({ trackId, speechRate }) => {
  const [showScript, setShowScript] = useState(false);
  const track = AUDIO_TRACKS[trackId];
  if (!track) return null;

  const playAll = () => {
    const combined = track.lines.map((l) => l.text).join(' ... ');
    speakGerman(combined, speechRate);
  };

  return (
    <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={playAll}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Audio {trackId}</span>
          </button>
          <span className="text-sm font-semibold text-indigo-200">{track.title}</span>
        </div>
        <button
          onClick={() => setShowScript(!showScript)}
          className="text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer"
        >
          {showScript ? 'Hide Audio Transcript' : 'Show Audio Transcript & Click-to-Speak Lines'}
        </button>
      </div>

      {showScript && (
        <div className="mt-3 pt-3 border-t border-indigo-800/60 space-y-2">
          {track.lines.map((line, idx) => (
            <div
              key={idx}
              onClick={() => speakGerman(line.text, speechRate)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/75 hover:bg-slate-800 cursor-pointer transition"
            >
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-400 mr-2">{line.speaker}:</span>
                <span className="text-slate-100">{line.text}</span>
              </div>
              <Volume2 className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Chapter3Masterclass() {
  const [activeTab, setActiveTab] = useState('learn');
  const [speechRate, setSpeechRate] = useState(0.92);
  const [completed, setCompleted] = useState({});

  const markDone = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
  };

  // Interactive Family Lexicon Filter
  const [selectedFamIdx, setSelectedFamIdx] = useState(1);

  // --- PAGE 17: EX 1 & 2 STATES ---
  const [ex1Guesses, setEx1Guesses] = useState({ a: '', b: '' });
  const [ex1Checked, setEx1Checked] = useState(false);

  const [ex2Answers, setEx2Answers] = useState({
    a: '', // richtig
    b: '', // richtig
    c: '', // falsch (Freiburg, not Frankfurt)
    d: '', // falsch (Mark & Angelica are not actors)
    e: ''  // richtig
  });
  const [ex2Checked, setEx2Checked] = useState(false);

  // --- PAGE 18: EX 3a, 3b, 4a, 4b, 5a, 5b STATES ---
  const [ex3aTable, setEx3aTable] = useState({
    ichFem: '', // meine
    duFem: ''   // deine
  });
  const [ex3aChecked, setEx3aChecked] = useState(false);
  const [ex3bScenarioIdx, setEx3bScenarioIdx] = useState(0);

  // Ex 4a: W-Frage vs Aussage vs Ja-/Nein-Frage
  const [ex4aVerbs, setEx4aVerbs] = useState({
    wFrage: '',   // ist
    aussage: '',  // ist
    jaNein: ''    // Ist
  });
  const [ex4aChecked, setEx4aChecked] = useState(false);

  // Ex 5a: ja / nein / doch Grammar Chart
  const [ex5aGaps, setEx5aGaps] = useState({
    posNeg: '', // Nein
    negPos: ''  // Doch
  });
  const [ex5aChecked, setEx5aChecked] = useState(false);

  // --- PAGE 19: EX 6a, 6b, 7, 8 STATES ---
  const [ex6aTree, setEx6aTree] = useState({
    carl: '',      // mein Großvater / Opa
    helga: '',     // meine Großmutter / Oma
    bernd: '',     // mein Vater
    olga: '',      // meine Mutter
    eltern: '',    // meine Eltern
    angelica: ''   // meine Schwester
  });
  const [ex6aChecked, setEx6aChecked] = useState(false);
  const [ex6bPerspective, setEx6bPerspective] = useState('Helga');

  // Ex 7: 4 Names Guessing Game
  const [ex7SelectedPerson, setEx7SelectedPerson] = useState(0);
  // Ex 8: Partner Family Interview Builder
  const [ex8Notes, setEx8Notes] = useState({
    relation: 'Bruder',
    pronoun: 'Er',
    possessive: 'mein Bruder',
    name: 'Miguel',
    beruf: 'Ingenieur',
    alter: '31',
    wohnort: 'Palo Alto (Kalifornien)',
    familienstand: 'verheiratet',
    kinder: 'ein Kind (Eliza)'
  });

  // --- PAGE 20: EX 9a, 9b, 9c (SWITZERLAND LANGUAGES & SPRECHEN) ---
  const [swissRegions, setSwissRegions] = useState({
    northCentral: 'Deutsch',
    westGenf: '',
    southTessin: '',
    eastGraubuenden: ''
  });
  const [swissChecked, setSwissChecked] = useState(false);
  const [userLanguages, setUserLanguages] = useState([
    { lang: 'Englisch', level: 'sehr gut' },
    { lang: 'Hindi', level: 'sehr gut' },
    { lang: 'Deutsch', level: 'ein bisschen' }
  ]);
  const [newLangName, setNewLangName] = useState('Spanisch');
  const [newLangLevel, setNewLangLevel] = useState('gut');

  // --- PAGE 21–24: MODUL 1 FINALE STATES ---
  // Page 21: Lesemagazin Corrections (a-f)
  const [leseAnswers, setLeseAnswers] = useState({
    a: 'Paco kommt aus Mexiko.',
    b: '',
    c: '',
    d: '',
    e: '',
    f: ''
  });
  const [leseChecked, setLeseChecked] = useState(false);

  // Page 22: Film-Stationen Clip 1 Regional Greetings
  const [clip1Matches, setClip1Matches] = useState({
    hamburg: '',
    berlin: '',
    muenchen: '',
    wien: '',
    zuerich: ''
  });
  const [clip1Checked, setClip1Checked] = useState(false);

  // Page 23: Heidi Klum Stammbaum
  const [heidiTree, setHeidiTree] = useState({
    ernaBeruf: '',
    guentherArbeitetAls: '',
    heidiBeruf: '',
    heidiHerkunft: '',
    sealBeruf: '',
    sealHerkunft: '',
    wohnort: '',
    kinderCount: ''
  });
  const [heidiChecked, setHeidiChecked] = useState(false);

  // Page 24: Ausklang Detective Puzzle ("Wo wohnt Winfried?")
  const [ausklangNames, setAusklangNames] = useState({
    A: 'Sven Henkenjohann',
    B: '',
    C: '',
    D: '',
    E: '',
    F: ''
  });
  const [winfriedCity, setWinfriedCity] = useState('');
  const [ausklangChecked, setAusklangChecked] = useState(false);

  // --- BONUS ARENA STATES ---
  // Bonus 1: Ja / Nein / Doch Combat Simulator
  const dochQuestions = [
    {
      q: 'Ist das deine Frau? (Fact: No, she is my mother.)',
      isNegQuestion: false,
      realityPositive: false,
      ans: 'Nein',
      fullReply: 'Nein, das ist nicht meine Frau. Das ist meine Mutter.',
      why: 'Positive question ("Ist das...?") + Negative fact → Use NEIN!'
    },
    {
      q: 'Das ist nicht deine Mutter, oder? (Fact: Yes she IS my mother!)',
      isNegQuestion: true,
      realityPositive: true,
      ans: 'Doch',
      fullReply: 'Doch! Das ist meine Mutter.',
      why: 'Negative statement/question ("...nicht deine Mutter?") + Contradicting with a positive fact → Use DOCH!'
    },
    {
      q: 'Sie ist nicht sehr alt, hm? (Fact: She is 74 years old!)',
      isNegQuestion: true,
      realityPositive: true,
      ans: 'Doch',
      fullReply: 'Doch, sie ist 74 Jahre alt!',
      why: 'Negative prompt ("nicht sehr alt") + Contradicting ("she IS 74") → Use DOCH!'
    },
    {
      q: 'Bist du verheiratet? (Fact: Yes, I am married.)',
      isNegQuestion: false,
      realityPositive: true,
      ans: 'Ja',
      fullReply: 'Ja, ich bin verheiratet.',
      why: 'Positive question + Positive agreement → Use JA!'
    },
    {
      q: 'Sprichst du nicht Spanisch? (Fact: No, I do not speak Spanish.)',
      isNegQuestion: true,
      realityPositive: false,
      ans: 'Nein',
      fullReply: 'Nein, ich spreche kein Spanisch.',
      why: 'Negative question + Agreeing that it is negative → Use NEIN!'
    },
    {
      q: 'Kommst du nicht aus Indien? (Fact: Yes, I DO come from India!)',
      isNegQuestion: true,
      realityPositive: true,
      ans: 'Doch',
      fullReply: 'Doch! Ich komme aus Indien.',
      why: 'Negative question ("Kommst du nicht...?") + Contradicting with YES → Use DOCH!'
    }
  ];
  const [dochSelections, setDochSelections] = useState({});
  const [dochChecked, setDochChecked] = useState(false);

  // Bonus 2: mein/meine/dein/deine Gender Sniper
  const possQuestions = [
    { prompt: '(ich) Das ist ___ Mutter.', noun: 'die Mutter (Fem.)', ans: 'meine' },
    { prompt: '(ich) Das ist ___ Vater.', noun: 'der Vater (Mask.)', ans: 'mein' },
    { prompt: '(du) Ist das ___ Frau?', noun: 'die Frau (Fem.)', ans: 'deine' },
    { prompt: '(du) Wie heißt ___ Bruder?', noun: 'der Bruder (Mask.)', ans: 'dein' },
    { prompt: '(ich) Das sind ___ Eltern.', noun: 'die Eltern (Plural)', ans: 'meine' },
    { prompt: '(du) Wo wohnen ___ Großeltern?', noun: 'die Großeltern (Plural)', ans: 'deine' },
    { prompt: '(ich) ___ Opa ist Schauspieler.', noun: 'der Opa (Mask.)', ans: 'Mein' },
    { prompt: '(ich) ___ Schwester heißt Angelica.', noun: 'die Schwester (Fem.)', ans: 'Meine' }
  ];
  const [possAnswers, setPossAnswers] = useState({});
  const [possChecked, setPossChecked] = useState(false);

  const totalTasks = 18;
  const doneCount = Object.keys(completed).length;
  const progressPct = Math.min(100, Math.round((doneCount / totalTasks) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-b border-purple-500/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Back to German Roadmap"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Roadmap</span>
            </a>
            <a
              href="./chapter-1.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 1"
            >
              <span>Lektion 1</span>
            </a>
            <a
              href="./chapter-2.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 2"
            >
              <span>Lektion 2</span>
            </a>
            <a
              href="./chapter-4.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-teal-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 4"
            >
              <span>Lektion 4</span>
            </a>
            <a
              href="../german-a1-notes/index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="A1 Notes & 300 Flashcards"
            >
              <span>300 Cards</span>
            </a>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              L3
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Menschen A1 • Lektion 3 &amp; Modul 1 Finale (Seiten 17–24)
                </span>
                <button
                  onClick={() => setSpeechRate(speechRate === 0.92 ? 0.72 : 0.92)}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold cursor-pointer hover:bg-amber-500/30 transition"
                >
                  {speechRate === 0.92 ? '🐇 Audio: Normal (0.92x)' : '🐢 Audio: Slow Learner (0.72x)'}
                </button>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                Das ist meine Mutter — Family, Languages &amp; Modul 1 Finale
              </h1>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 min-w-[240px]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Award className="w-4 h-4 text-rose-400" /> Chapter 3 Mastery
              </span>
              <span className="text-rose-400">
                {doneCount} / {totalTasks} Completed ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-2 pb-3">
          {[
            { id: 'learn', label: '1. Deep Lesson & 6 Memory Hooks', icon: Brain },
            { id: 'ex1to5', label: '2. Exercises 1–5 (Pages 17–18)', icon: Film },
            { id: 'ex6to9', label: '3. Exercises 6–9 (Pages 19–20)', icon: Users },
            { id: 'modul1', label: '4. Pages 21–24 (Magazin, Film, Heidi, Ausklang)', icon: Compass },
            { id: 'bonus', label: '5. Bonus Memory-Lock Arena', icon: Sparkles },
            { id: 'summary', label: '6. Page 20 Grammar & Cheat Sheet', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-rose-400 text-slate-950 shadow-lg shadow-rose-400/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            <section className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Chapter 3 Story &amp; Core Concepts (Seiten 17–24)
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Mark’s Acting Family, The Secret Word „Doch!“, Possessives &amp; Languages
                  </h2>
                </div>
                <button
                  onClick={() =>
                    speakGerman(
                      'Wer ist das? Ist das deine Frau? Nein, das ist meine Mutter! Das ist nicht deine Mutter? Doch! Sie ist vierundsiebzig. Welche Sprachen sprichst du? Ich spreche sehr gut Deutsch und Englisch.',
                      speechRate
                    )
                  }
                  className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-slate-950 text-sm font-bold px-4 py-2 rounded-xl shadow cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Hear Chapter 3 Key Dialogues
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                In Chapter 3, we meet 21-year-old physics student <strong>Mark Poppenreuther</strong>. He shows us a hilarious theatre/film scene starring his parents (<strong>Bernd and Olga</strong>), where a jealous woman named <strong>Elvira</strong> refuses to believe that a photo on the wall is <strong>Herbert’s mother</strong> and not his wife! Through this comedy, you master <strong>Family Members</strong>, <strong>Possessive Articles</strong> (<em>mein/meine, dein/deine</em>), <strong>Yes/No Questions</strong> (Verb in Position 1!), Germany's famous contradiction word <strong>„Doch!“</strong>, and talking about <strong>Languages</strong> with the vowel-changing verb <em>sprechen</em>.
              </p>

              {/* Interactive Family Bildlexikon (Pages 18-19 Top Margin) */}
              <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interactive Bildlexikon Familie (Pages 18–19 Banner): Click any card to hear &amp; inspect!
                  </span>
                  <span className="text-xs text-slate-400">
                    Color Code: 🔵 der (mein) &bull; 🔴 die (meine) &bull; 🟢 Plural (meine)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
                  {FAMILY_LEXICON.map((fam, idx) => (
                    <button
                      key={fam.de}
                      onClick={() => {
                        setSelectedFamIdx(idx);
                        speakGerman(`${fam.de}. Das ist ${fam.mein}.`, speechRate);
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedFamIdx === idx
                          ? 'bg-purple-900/60 border-amber-400 shadow'
                          : fam.gender === 'M'
                          ? 'bg-sky-950/25 border-sky-500/30 hover:bg-sky-950/40'
                          : fam.gender === 'F'
                          ? 'bg-rose-950/25 border-rose-500/30 hover:bg-rose-950/40'
                          : 'bg-emerald-950/25 border-emerald-500/30 hover:bg-emerald-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{fam.icon}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            fam.gender === 'M'
                              ? 'bg-sky-500/20 text-sky-300'
                              : fam.gender === 'F'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {fam.mein}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white mt-1">{fam.de}</div>
                      <div className="text-[11px] text-slate-400">{fam.en}</div>
                    </button>
                  ))}
                </div>

                {FAMILY_LEXICON[selectedFamIdx] && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <strong className="text-amber-300">{FAMILY_LEXICON[selectedFamIdx].de}</strong>{' '}
                      ({FAMILY_LEXICON[selectedFamIdx].en}) &rarr; Possessive:{' '}
                      <strong className="text-emerald-300">
                        {FAMILY_LEXICON[selectedFamIdx].mein}
                      </strong>{' '}
                      &bull; Counterpart: <span className="text-indigo-300">{FAMILY_LEXICON[selectedFamIdx].pair}</span>
                    </div>
                    <button
                      onClick={() =>
                        speakGerman(
                          FAMILY_LEXICON[selectedFamIdx].gender === 'PL'
                            ? `Das sind ${FAMILY_LEXICON[selectedFamIdx].mein}.`
                            : `Das ist ${FAMILY_LEXICON[selectedFamIdx].mein}.`,
                          speechRate
                        )
                      }
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Hear Full Sentence
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* THE 6 FOREVER MEMORY HOOKS */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-extrabold text-white">
                  6 "Forever Memory Hooks" (Gehirn-Anker) for Chapter 3
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hook 1: mein vs meine */}
                <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold">
                    MEMORY HOOK #1 &bull; POSSESSIVE ARTICLES (S. 18 &amp; 20)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The "Die = E" Echo Rule: Why <em>mein</em> vs. <em>meine</em>?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    How do you know instantly whether to add an <strong>-e</strong> to <code>mein</code> or <code>dein</code>? Just look at the article of the family member:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30">
                      🔵 <strong>Masculine (der)</strong> has NO "-e" &rarr;{' '}
                      <strong className="text-sky-300">mein / dein</strong> (no ending!):
                      <div className="mt-1 font-mono text-white">
                        der Vater &rarr; mein Vater &bull; der Bruder &rarr; dein Bruder &bull; der Opa &rarr; mein Opa
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                      🔴🟢 <strong>Feminine (di<u>e</u>) &amp; Plural (di<u>e</u>)</strong> end in <strong>-e</strong>, so they echo that <strong>-e</strong> onto <strong className="text-rose-300">mein<u>e</u> / dein<u>e</u></strong>!
                      <div className="mt-1 font-mono text-white">
                        di<u>e</u> Mutter &rarr; mein<u>e</u> Mutter &bull; di<u>e</u> Eltern &rarr; mein<u>e</u> Eltern
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hook 2: Ja / Nein / Doch */}
                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">
                    MEMORY HOOK #2 &bull; JA – NEIN – DOCH (S. 18 &amp; 20)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The Superhero Word „Doch!“ (The "Uh-Huh! / Yes It Is!" Shield)
                  </h3>
                  <p className="text-xs text-slate-300">
                    English has a problem: if someone asks negatively, <em>"Isn't that your mother?"</em>, saying "Yes" or "No" is confusing. German solves this with <strong>DOCH</strong>!
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      1️⃣ <strong>Positive Question:</strong> <em>„Ist das deine Frau?“</em><br />
                      &bull; Agree (+) &rarr; <strong className="text-emerald-400">Ja</strong>, das ist meine Frau.<br />
                      &bull; Disagree (–) &rarr; <strong className="text-rose-400">Nein</strong>, das ist nicht meine Frau.
                    </div>
                    <div className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/40">
                      2️⃣ <strong>Negative Question/Statement (contains <em>nicht/kein</em>):</strong><br />
                      <em>„Das ist <u>nicht</u> deine Mutter?“ / „Sie ist <u>nicht</u> sehr alt, hm?“</em><br />
                      &bull; Contradict! ("Yes she IS!") &rarr; <strong className="text-amber-300 text-sm">DOCH!</strong> (Doch, das ist meine Mutter! / Doch, sie ist 74!)<br />
                      &bull; Agree that it's NOT (–) &rarr; <strong className="text-rose-400">Nein</strong>, das ist nicht meine Mutter.
                    </div>
                  </div>
                </div>

                {/* Hook 3: Verb Position 1 vs Position 2 */}
                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                    MEMORY HOOK #3 &bull; QUESTION ARCHITECTURE (S. 18 &amp; 20)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Why the Verb Jumps to Position 1 in Yes/No Questions!
                  </h3>
                  <p className="text-xs text-slate-300">
                    In Chapters 1 &amp; 2, the verb was always in Position 2. What happens when there is NO W-word (<em>Wer, Wie, Woher</em>)? Slot #1 is empty, so the <strong>Verb steps up to Position 1</strong>!
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400">W-Frage (Pos 2):</span> Wer{' '}
                      <strong className="text-amber-300">[ist]</strong> das?
                    </div>
                    <div>
                      <span className="text-slate-400">Aussage (Pos 2):</span> Das{' '}
                      <strong className="text-amber-300">[ist]</strong> meine Mutter.
                    </div>
                    <div className="text-emerald-300 font-bold">
                      <span className="text-slate-400 font-normal">Ja/Nein-Frage (Pos 1!):</span>{' '}
                      <strong className="bg-emerald-500/20 px-1.5 py-0.5 rounded">[Ist]</strong> das deine Frau? /{' '}
                      <strong className="bg-emerald-500/20 px-1.5 py-0.5 rounded">[Bist]</strong> du verheiratet?
                    </div>
                  </div>
                </div>

                {/* Hook 4: Vokalwechsel sprechen */}
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    MEMORY HOOK #4 &bull; VOWEL CHANGE e &rarr; i (S. 20)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The "Singular 2 &amp; 3 Spotlight" in <em>sprechen</em>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Strong verbs like <strong>sprechen</strong> (to speak) change their stem vowel from <strong>e &rarr; i</strong> ONLY in <strong>du</strong> and <strong>er/sie</strong>! Plural (<em>wir, ihr, sie</em>) and <em>ich</em> stay 100% normal:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div>ich spr<strong>e</strong>che</div>
                      <div className="text-amber-300 font-bold">du spr<u>i</u>chst ⚡</div>
                      <div className="text-amber-300 font-bold">er/sie spr<u>i</u>cht ⚡</div>
                    </div>
                    <div>
                      <div>wir spr<strong>e</strong>chen</div>
                      <div>ihr spr<strong>e</strong>cht</div>
                      <div>sie/Sie spr<strong>e</strong>chen</div>
                    </div>
                  </div>
                </div>

                {/* Hook 5: D-A-CH Regional Greetings */}
                <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold">
                    MEMORY HOOK #5 &bull; FILM-STATIONEN COMPASS (S. 22)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The 4-Corner Greeting Compass (North, South, Austria, Switzerland)
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      ⚓ <strong>North Germany (Hamburg):</strong> <strong className="text-sky-300">„Moin, moin!“</strong> (Used all day!)
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      🥨 <strong>South Germany (München) &amp; Austria (Wien):</strong>{' '}
                      <strong className="text-amber-300">„Grüß Gott!“</strong> (formal) &amp;{' '}
                      <strong className="text-amber-300">„Servus!“</strong> (hello &amp; bye!) &amp;{' '}
                      <strong className="text-amber-300">„Auf Wiederschauen!“</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      🏔️ <strong>Switzerland (Zürich):</strong>{' '}
                      <strong className="text-rose-300">„Grüezi!“</strong> (hello) &amp;{' '}
                      <strong className="text-rose-300">„Uf Wiederluege mitenand!“</strong> (goodbye everyone)
                    </div>
                  </div>
                </div>

                {/* Hook 6: Speaking Levels */}
                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold">
                    MEMORY HOOK #6 &bull; LANGUAGE FLUENCY SCALE (S. 20)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The 3 Fluency Steps: <em>sehr gut &bull; gut &bull; ein bisschen</em>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Notice that language names end in <strong>-isch</strong> (<em>Englisch, Spanisch, Französisch, Italienisch, Russisch, Indisch/Hindi</em>) EXCEPT <strong>Deutsch</strong>!
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div
                      onClick={() => speakGerman('Ich spreche sehr gut Englisch.', speechRate)}
                      className="bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-emerald-400"
                    >
                      ⭐⭐⭐ <strong>sehr gut</strong> (very well): <em>„Ich spreche sehr gut Englisch.“</em>
                    </div>
                    <div
                      onClick={() => speakGerman('Ich spreche gut Deutsch.', speechRate)}
                      className="bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-amber-400"
                    >
                      ⭐⭐ <strong>gut</strong> (well): <em>„Ich spreche gut Deutsch.“</em>
                    </div>
                    <div
                      onClick={() => speakGerman('Ich spreche ein bisschen Spanisch.', speechRate)}
                      className="bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-sky-400"
                    >
                      ⭐ <strong>ein bisschen</strong> (a little bit): <em>„Ich spreche ein bisschen Spanisch.“</em>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('ex1to5')}
                className="flex items-center gap-2 bg-rose-400 hover:bg-rose-300 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer transition"
              >
                <span>Start Textbook Exercises 1–5 (Pages 17–18)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === 'ex1to5' && (
          <div className="space-y-8">
            {/* EXERCISE 1 & 2 (Page 17) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Seite 17 • Übung 1 &amp; 2 (Tracks 1.17 &amp; 1.18)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    1 &amp; 2. Das ist meine Mutter — Mark Poppenreuther (21) &amp; Seine Eltern
                  </h3>
                </div>
                {completed.ex1_2 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.17" speechRate={speechRate} />

              {/* Exercise 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-indigo-300 text-sm">
                  1) Sehen Sie das Foto an, hören Sie (Track 1.17) und kreuzen Sie an.
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  {[
                    {
                      key: 'a',
                      text: 'a) Die Frau auf dem Bild ist Herberts Mutter.',
                      correct: 'glaube ich'
                    },
                    {
                      key: 'b',
                      text: 'b) Die Frau auf dem Bild ist Herberts Frau.',
                      correct: 'glaube ich nicht'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                    >
                      <span className="font-semibold text-white">{item.text}</span>
                      <div className="flex gap-2">
                        {['glaube ich', 'glaube ich nicht'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setEx1Guesses({ ...ex1Guesses, [item.key]: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              ex1Guesses[item.key] === opt
                                ? 'bg-indigo-600 border-indigo-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {ex1Guesses[item.key] === opt ? '☒ ' : '☐ '} {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  2) Was sagt Mark (21)? Hören Sie (Track 1.18) und kreuzen Sie an: richtig oder falsch?
                </h4>
                <AudioTrackPlayer trackId="1.18" speechRate={speechRate} />

                <div className="space-y-2 text-xs sm:text-sm">
                  {[
                    {
                      key: 'a',
                      text: 'a) Das sind meine Eltern.',
                      ans: 'richtig',
                      note: 'Yes! Bernd & Olga on the screen are Mark’s parents.'
                    },
                    {
                      key: 'b',
                      text: 'b) Sie sind Schauspieler.',
                      ans: 'richtig',
                      note: 'Yes! Both parents are actors.'
                    },
                    {
                      key: 'c',
                      text: 'c) Sie leben in Frankfurt.',
                      ans: 'falsch',
                      note: 'Falsch! His parents live in Freiburg (as we also see in Ausklang S. 24!).'
                    },
                    {
                      key: 'd',
                      text: 'd) Meine Schwester, mein Opa und ich sind auch Schauspieler.',
                      ans: 'falsch',
                      note: 'Falsch! His Opa Carl is an actor, but Mark and his sister Angelica are NOT actors.'
                    },
                    {
                      key: 'e',
                      text: 'e) Ich studiere Physik.',
                      ans: 'richtig',
                      note: 'Richtig! Mark is 21 and studies physics in Stuttgart.'
                    }
                  ].map((row) => (
                    <div
                      key={row.key}
                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-white">{row.text}</span>
                        {ex2Checked && (
                          <div
                            className={`text-xs mt-0.5 ${
                              ex2Answers[row.key] === row.ans
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {ex2Answers[row.key] === row.ans ? '✓ ' : `✗ (${row.ans}) `}
                            {row.note}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {['richtig', 'falsch'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setEx2Answers({ ...ex2Answers, [row.key]: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              ex2Answers[row.key] === opt
                                ? 'bg-amber-400 border-amber-300 text-slate-950'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setEx1Checked(true);
                    setEx2Checked(true);
                    markDone('ex1_2');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Exercises 1 &amp; 2
                </button>
              </div>
            </section>

            {/* EXERCISE 3, 4 & 5 (Page 18) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Seite 18 • Übung 3a, 3b, 4a, 4b, 5a &amp; 5b (Track 1.19)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    3–5. Drehbuch „Ich bin nicht verheiratet“, Wortstellung &amp; „ja – nein – doch“
                  </h3>
                </div>
                {completed.ex3_5 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 3a: Drehbuch & Possessivartikel Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-300 uppercase mb-2">
                    3a) Drehbuch-Ausschnitt (Click any line to hear it acted out!)
                  </div>
                  {AUDIO_TRACKS['1.17'].lines.map((l, i) => (
                    <div
                      key={i}
                      onClick={() => speakGerman(l.text, speechRate)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-indigo-300 uppercase mr-2">{l.speaker}:</strong>
                        <span className="text-slate-100">{l.text}</span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* 3a Grammar Box + 3b Acting Simulator */}
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
                    <h4 className="font-bold text-indigo-300 text-sm">
                      3a) GRAMMATIK: Ergänzen Sie die Tabelle (mein / meine / dein / deine)
                    </h4>
                    <table className="w-full text-xs sm:text-sm bg-slate-900 rounded-xl overflow-hidden border-collapse">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300 text-left">
                          <th className="p-2.5">Pronomen</th>
                          <th className="p-2.5">Maskulin (der)</th>
                          <th className="p-2.5">Feminin (die)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-bold text-amber-300">ich</td>
                          <td className="p-2.5 text-sky-300 font-bold">mein Mann</td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ex3aTable.ichFem}
                              onChange={(e) =>
                                setEx3aTable({ ...ex3aTable, ichFem: e.target.value })
                              }
                              placeholder="mein...?"
                              className="w-20 bg-slate-950 border border-rose-400 rounded px-2 py-0.5 text-rose-300 font-bold text-center mr-1"
                            />
                            Mutter
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-amber-300">du</td>
                          <td className="p-2.5 text-sky-300 font-bold">dein Vater</td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ex3aTable.duFem}
                              onChange={(e) =>
                                setEx3aTable({ ...ex3aTable, duFem: e.target.value })
                              }
                              placeholder="dein...?"
                              className="w-20 bg-slate-950 border border-rose-400 rounded px-2 py-0.5 text-rose-300 font-bold text-center mr-1"
                            />
                            Frau
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {ex3aChecked && (
                      <div className="text-xs font-bold text-emerald-400">
                        {ex3aTable.ichFem.trim().toLowerCase() === 'meine' &&
                        ex3aTable.duFem.trim().toLowerCase() === 'deine'
                          ? '✓ Perfekt! meine Mutter & deine Frau (both end in -e!)'
                          : 'Correct: meine Mutter & deine Frau.'}
                      </div>
                    )}
                  </div>

                  {/* 3b: Jetzt sind Sie selbst Schauspieler */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-300 text-sm">
                      3b) Jetzt sind Sie selbst Schauspieler! Spielen Sie ähnliche Dialoge:
                    </h4>
                    <div className="flex gap-2">
                      {[
                        {
                          label: '1: deine Frau / meine Oma (82)',
                          q: 'Wer ist das? Ist das deine Frau?',
                          a: 'Nein! Das ist meine Oma.',
                          q2: 'Deine Oma?! Das ist nicht deine Oma. Sie ist nicht sehr alt, hm?',
                          a2: 'Doch! Sie ist zweiundachtzig!'
                        },
                        {
                          label: '2: dein Mann / mein Vater (68)',
                          q: 'Wer ist das? Ist das dein Mann?',
                          a: 'Nein! Das ist mein Vater.',
                          q2: 'Dein Vater?! Das ist nicht dein Vater!',
                          a2: 'Doch! Er ist achtundsechzig!'
                        },
                        {
                          label: '3: dein Mann / mein Opa (79)',
                          q: 'Wer ist das? Ist das dein Mann?',
                          a: 'Nein! Das ist mein Opa.',
                          q2: 'Dein Opa?! Das ist nicht dein Opa!',
                          a2: 'Doch! Er ist neunundsiebzig!'
                        }
                      ].map((sc, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setEx3bScenarioIdx(idx);
                            speakGerman(`${sc.q} ... ${sc.a} ... ${sc.q2} ... ${sc.a2}`, speechRate);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                            ex3bScenarioIdx === idx
                              ? 'bg-amber-400 text-slate-950 border-amber-300'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          Scene {idx + 1}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div>
                        <strong>● A:</strong>{' '}
                        {
                          [
                            'Wer ist das? Ist das deine Frau?',
                            'Wer ist das? Ist das dein Mann?',
                            'Wer ist das? Ist das dein Mann?'
                          ][ex3bScenarioIdx]
                        }
                      </div>
                      <div>
                        <strong>▲ B:</strong>{' '}
                        {
                          [
                            'Nein. Das ist meine Oma.',
                            'Nein. Das ist mein Vater.',
                            'Nein. Das ist mein Opa.'
                          ][ex3bScenarioIdx]
                        }
                      </div>
                      <div className="text-amber-300">
                        <strong>● A:</strong>{' '}
                        {
                          [
                            'Deine Oma?! Das ist nicht deine Oma!',
                            'Dein Vater?! Das ist nicht dein Vater!',
                            'Dein Opa?! Das ist nicht dein Opa!'
                          ][ex3bScenarioIdx]
                        }
                      </div>
                      <div className="text-emerald-300 font-bold">
                        <strong>▲ B:</strong> Doch!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4a & 5a Grammar Boxes Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 4a */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-indigo-300 text-sm">
                    4a) Wortstellung: Ergänzen Sie das Verb „ist“ (Position 2 vs. Position 1!)
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg">
                      <span className="text-slate-400 font-bold w-28">W-Frage:</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        <span>Wer</span>
                        <input
                          type="text"
                          value={ex4aVerbs.wFrage}
                          onChange={(e) =>
                            setEx4aVerbs({ ...ex4aVerbs, wFrage: e.target.value })
                          }
                          placeholder="verb"
                          className="w-16 bg-slate-950 border border-amber-400 rounded px-2 py-0.5 text-center text-amber-300 font-bold"
                        />
                        <span>das?</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg">
                      <span className="text-slate-400 font-bold w-28">Aussage:</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        <span>Das</span>
                        <input
                          type="text"
                          value={ex4aVerbs.aussage}
                          onChange={(e) =>
                            setEx4aVerbs({ ...ex4aVerbs, aussage: e.target.value })
                          }
                          placeholder="verb"
                          className="w-16 bg-slate-950 border border-amber-400 rounded px-2 py-0.5 text-center text-amber-300 font-bold"
                        />
                        <span>meine Mutter.</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold w-28">Ja/Nein-Frage:</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={ex4aVerbs.jaNein}
                          onChange={(e) =>
                            setEx4aVerbs({ ...ex4aVerbs, jaNein: e.target.value })
                          }
                          placeholder="Verb (Pos 1)"
                          className="w-20 bg-slate-950 border border-emerald-400 rounded px-2 py-0.5 text-center text-emerald-300 font-bold"
                        />
                        <span>das deine Frau?</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5a */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-amber-300 text-sm">
                    5a) GRAMMATIK: Ergänzen Sie „Nein“ und „Doch“
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-white">Ist das deine Frau?</div>
                      <div className="text-emerald-400 font-bold">➕ Ja.</div>
                      <div className="flex items-center gap-1">
                        <span className="text-rose-400 font-bold">➖</span>
                        <select
                          value={ex5aGaps.posNeg}
                          onChange={(e) =>
                            setEx5aGaps({ ...ex5aGaps, posNeg: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                        >
                          <option value="">-- ? --</option>
                          <option value="Nein.">Nein.</option>
                          <option value="Doch.">Doch.</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 space-y-2">
                      <div className="font-bold text-white">
                        Ist das <span className="underline text-amber-300">nicht</span> deine Mutter?
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-400 font-bold">➕</span>
                        <select
                          value={ex5aGaps.negPos}
                          onChange={(e) =>
                            setEx5aGaps({ ...ex5aGaps, negPos: e.target.value })
                          }
                          className="bg-slate-950 border border-amber-400 rounded px-2 py-1 text-amber-300 font-bold"
                        >
                          <option value="">-- ? --</option>
                          <option value="Doch.">Doch.</option>
                          <option value="Nein.">Nein.</option>
                        </select>
                      </div>
                      <div className="text-rose-400 font-bold">➖ Nein.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setEx3aChecked(true);
                    setEx4aChecked(true);
                    setEx5aChecked(true);
                    markDone('ex3_5');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check All Page 18 Exercises (3a, 4a, 5a)
                </button>
                <button
                  onClick={() => {
                    setEx3aTable({ ichFem: 'meine', duFem: 'deine' });
                    setEx4aVerbs({ wFrage: 'ist', aussage: 'ist', jaNein: 'Ist' });
                    setEx5aGaps({ posNeg: 'Nein.', negPos: 'Doch.' });
                    markDone('ex3_5');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Auto-Fill Page 18 Solutions
                </button>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'ex6to9' && (
          <div className="space-y-8">
            {/* EXERCISE 6a & 6b: Marks Familie (Page 19) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Seite 19 • Übung 6a &amp; 6b (Track 1.20)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    6. Marks Familie — Interactive Poppenreuther Stammbaum (Family Tree)
                  </h3>
                </div>
                {completed.ex6 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.20" speechRate={speechRate} />

              {/* Visual Family Tree of Mark Poppenreuther */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-6">
                <div className="text-xs font-bold text-amber-300 uppercase text-center">
                  6a) Ergänzen Sie die Familienmitglieder aus Marks Perspektive („ich = Mark“):
                </div>

                {/* Generation 1: Grandparents */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-sky-500/30 text-center space-y-1.5">
                    <div className="text-lg">👴🏻🎭</div>
                    <div className="font-bold text-white text-sm">Carl Poppenreuther</div>
                    <select
                      value={ex6aTree.carl}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, carl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-sky-300 font-bold"
                    >
                      <option value="">-- Choose relation --</option>
                      <option value="mein Großvater / Opa">mein Großvater / Opa</option>
                      <option value="mein Vater">mein Vater</option>
                      <option value="meine Oma">meine Oma</option>
                    </select>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-rose-500/30 text-center space-y-1.5">
                    <div className="text-lg">👵🏻🎭</div>
                    <div className="font-bold text-white text-sm">Helga Poppenreuther</div>
                    <select
                      value={ex6aTree.helga}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, helga: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-rose-300 font-bold"
                    >
                      <option value="">-- Choose relation --</option>
                      <option value="meine Großmutter / Oma">meine Großmutter / Oma</option>
                      <option value="meine Mutter">meine Mutter</option>
                      <option value="meine Schwester">meine Schwester</option>
                    </select>
                  </div>

                  <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 text-center">
                    <div className="text-xs text-slate-400">Plural (Carl + Helga):</div>
                    <div className="text-sm font-extrabold text-emerald-300 mt-1">
                      = meine Großeltern
                    </div>
                  </div>
                </div>

                {/* Generation 2: Parents */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-800">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-sky-500/30 text-center space-y-1.5">
                    <div className="text-lg">👨🏻🎭</div>
                    <div className="font-bold text-white text-sm">Bernd Poppenreuther</div>
                    <select
                      value={ex6aTree.bernd}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, bernd: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-sky-300 font-bold"
                    >
                      <option value="">-- Choose relation --</option>
                      <option value="mein Vater">mein Vater</option>
                      <option value="mein Bruder">mein Bruder</option>
                      <option value="mein Opa">mein Opa</option>
                    </select>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-rose-500/30 text-center space-y-1.5">
                    <div className="text-lg">👩🏼🎭</div>
                    <div className="font-bold text-white text-sm">Olga Poppenreuther</div>
                    <select
                      value={ex6aTree.olga}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, olga: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-rose-300 font-bold"
                    >
                      <option value="">-- Choose relation --</option>
                      <option value="meine Mutter">meine Mutter</option>
                      <option value="meine Oma">meine Oma</option>
                      <option value="meine Schwester">meine Schwester</option>
                    </select>
                  </div>

                  <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 text-center space-y-1.5">
                    <div className="text-xs text-slate-400">Plural (Bernd + Olga):</div>
                    <select
                      value={ex6aTree.eltern}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, eltern: e.target.value })}
                      className="w-full bg-slate-950 border border-emerald-500/50 rounded-lg p-1.5 text-xs text-emerald-300 font-bold"
                    >
                      <option value="">-- Plural? --</option>
                      <option value="meine Eltern">meine Eltern</option>
                      <option value="meine Geschwister">meine Geschwister</option>
                    </select>
                  </div>
                </div>

                {/* Generation 3: Mark & Angelica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-800">
                  <div className="bg-amber-500/20 p-3.5 rounded-xl border border-amber-400 text-center">
                    <div className="text-lg">🧑🏻🔬</div>
                    <div className="font-black text-white text-sm">Mark (21)</div>
                    <div className="text-xs font-bold text-amber-300 mt-1">= ich</div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-rose-500/30 text-center space-y-1.5">
                    <div className="text-lg">👱🏻♀️</div>
                    <div className="font-bold text-white text-sm">Angelica</div>
                    <select
                      value={ex6aTree.angelica}
                      onChange={(e) => setEx6aTree({ ...ex6aTree, angelica: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-rose-300 font-bold"
                    >
                      <option value="">-- Choose relation --</option>
                      <option value="meine Schwester">meine Schwester</option>
                      <option value="meine Tochter">meine Tochter</option>
                      <option value="meine Mutter">meine Mutter</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setEx6aChecked(true);
                        markDone('ex6');
                      }}
                      className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
                    >
                      Check Family Tree (6a)
                    </button>
                    <button
                      onClick={() =>
                        setEx6aTree({
                          carl: 'mein Großvater / Opa',
                          helga: 'meine Großmutter / Oma',
                          bernd: 'mein Vater',
                          olga: 'meine Mutter',
                          eltern: 'meine Eltern',
                          angelica: 'meine Schwester'
                        })
                      }
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-xl text-xs cursor-pointer"
                    >
                      Fill All Relations
                    </button>
                  </div>
                </div>
              </div>

              {/* 6b: Perspective Switcher (Spielen Sie Helga, Bernd oder Angelica) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-indigo-300 text-sm">
                  6b) Was sagen andere Familienmitglieder? Spielen Sie Helga, Bernd oder Angelica!
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      name: 'Helga (Oma)',
                      speech:
                        'Ich bin Helga. Carl ist mein Mann. Unser Sohn heißt Bernd und Olga ist seine Frau. Mark ist mein Enkel und Angelica ist meine Enkelin!'
                    },
                    {
                      name: 'Bernd (Vater)',
                      speech:
                        'Ich heiße Bernd. Carl und Helga sind meine Eltern. Olga ist meine Frau. Wir haben zwei Kinder: Mark ist mein Sohn und Angelica ist meine Tochter.'
                    },
                    {
                      name: 'Angelica (Schwester)',
                      speech:
                        'Hallo, ich bin Angelica! Bernd und Olga sind meine Eltern. Mark ist mein Bruder. Und Carl und Helga sind meine Großeltern!'
                    }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setEx6bPerspective(p.name);
                        speakGerman(p.speech, speechRate);
                        markDone('ex6b');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                        ex6bPerspective === p.name
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Speak as {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* EXERCISE 7 & 8 (Page 19) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ex 7 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 19 • Übung 7
                  </span>
                  <h4 className="font-bold text-white text-base">
                    7. Vier Namen auf einem Zettel: Wer sind die Personen?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click a name on the note (`Ewa, Frank, Tobias, Hilde`) to practice the guessing dialogue:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        name: 'Ewa',
                        wrong: 'deine Schwester',
                        right: 'meine Freundin',
                        dialog:
                          'Ist Ewa deine Schwester? Nein, Ewa ist nicht meine Schwester. Ist sie deine Freundin? Ja, das ist richtig! Ewa ist meine Freundin.'
                      },
                      {
                        name: 'Frank',
                        wrong: 'dein Bruder',
                        right: 'mein Kollege',
                        dialog:
                          'Ist Frank dein Bruder? Nein, Frank ist nicht mein Bruder. Ist er dein Kollege? Ja, das stimmt! Frank ist mein Kollege.'
                      },
                      {
                        name: 'Tobias',
                        wrong: 'dein Vater',
                        right: 'mein Partner',
                        dialog:
                          'Ist Tobias dein Vater? Nein, Tobias ist nicht mein Vater. Ist er dein Partner? Ja, genau!'
                      },
                      {
                        name: 'Hilde',
                        wrong: 'deine Mutter',
                        right: 'meine Oma',
                        dialog:
                          'Ist Hilde deine Mutter? Nein, sie ist nicht meine Mutter. Ist sie deine Oma? Ja, Hilde ist meine Oma!'
                      }
                    ].map((p, i) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setEx7SelectedPerson(i);
                          speakGerman(p.dialog, speechRate);
                          markDone('ex7');
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          ex7SelectedPerson === i
                            ? 'bg-amber-400/20 border-amber-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="font-extrabold text-amber-300 text-sm">📌 {p.name}</div>
                        <div className="text-[11px] text-slate-400">✗ {p.wrong}</div>
                        <div className="text-[11px] text-emerald-300">✓ {p.right}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ex 8: Familiengeschichten */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seite 19 • Übung 8
                  </span>
                  <h4 className="font-bold text-white text-base">
                    8. Familiengeschichten: Interview &amp; Notizen
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Familienmitglied:</label>
                      <select
                        value={ex8Notes.relation}
                        onChange={(e) => {
                          const rel = e.target.value;
                          const isFem = ['Schwester', 'Mutter', 'Oma', 'Tochter'].includes(rel);
                          setEx8Notes({
                            ...ex8Notes,
                            relation: rel,
                            pronoun: isFem ? 'Sie' : 'Er',
                            possessive: isFem ? `meine ${rel}` : `mein ${rel}`
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-bold"
                      >
                        <option value="Bruder">Bruder</option>
                        <option value="Schwester">Schwester</option>
                        <option value="Vater">Vater</option>
                        <option value="Mutter">Mutter</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Name:</label>
                      <input
                        type="text"
                        value={ex8Notes.name}
                        onChange={(e) => setEx8Notes({ ...ex8Notes, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-amber-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Beruf:</label>
                      <input
                        type="text"
                        value={ex8Notes.beruf}
                        onChange={(e) => setEx8Notes({ ...ex8Notes, beruf: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200">
                    „Das ist <strong>{ex8Notes.possessive}</strong>. {ex8Notes.pronoun} heißt{' '}
                    <strong>{ex8Notes.name}</strong> und ist <strong>{ex8Notes.beruf}</strong> von Beruf. {ex8Notes.pronoun} ist {ex8Notes.alter} Jahre alt und lebt in {ex8Notes.wohnort}.“
                  </div>
                  <button
                    onClick={() => {
                      speakGerman(
                        `Das ist ${ex8Notes.possessive}. ${ex8Notes.pronoun} heißt ${ex8Notes.name} und ist ${ex8Notes.beruf} von Beruf.`,
                        speechRate
                      );
                      markDone('ex8');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Speak Family Story
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 9a, 9b, 9c (Page 20: Ein Land - viele Sprachen) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Seite 20 • Mini-Projekt Übung 9a, 9b &amp; 9c
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    9. Ein Land – viele Sprachen (Die Schweiz &amp; Verb „sprechen“)
                  </h3>
                </div>
                {completed.ex9 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 9a: Interactive Map of Switzerland's 4 Official Languages */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  9a) Wo in der Schweiz spricht man welche Sprache? Ordnen Sie die 4 offiziellen Sprachen zu (Auflösung Seite 75):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      key: 'northCentral',
                      region: 'Nord- & Zentral-Schweiz (Basel, Zürich, Bern)',
                      pct: '~63%',
                      correct: 'Deutsch'
                    },
                    {
                      key: 'westGenf',
                      region: 'Westschweiz / Romandie (Genf, Lausanne)',
                      pct: '~23%',
                      correct: 'Französisch'
                    },
                    {
                      key: 'southTessin',
                      region: 'Südschweiz / Tessin (Lugano)',
                      pct: '~8%',
                      correct: 'Italienisch'
                    },
                    {
                      key: 'eastGraubuenden',
                      region: 'Südostschweiz / Graubünden (Teile)',
                      pct: '~0.5%',
                      correct: 'Rätoromanisch'
                    }
                  ].map((reg) => (
                    <div
                      key={reg.key}
                      className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="text-xs font-bold text-amber-300">{reg.region}</div>
                      <div className="text-[11px] text-slate-400">Population share: {reg.pct}</div>
                      <select
                        value={swissRegions[reg.key]}
                        onChange={(e) =>
                          setSwissRegions({ ...swissRegions, [reg.key]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-bold"
                      >
                        <option value="">-- Sprache wählen --</option>
                        <option value="Deutsch">Deutsch</option>
                        <option value="Französisch">Französisch</option>
                        <option value="Italienisch">Italienisch</option>
                        <option value="Rätoromanisch">Rätoromanisch</option>
                      </select>
                      {swissChecked && (
                        <div className="text-xs font-bold">
                          {swissRegions[reg.key] === reg.correct ? (
                            <span className="text-emerald-400">✓ {reg.correct}</span>
                          ) : (
                            <span className="text-rose-400">✗ ({reg.correct})</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSwissChecked(true);
                    markDone('ex9');
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Swiss Language Map (9a)
                </button>
              </div>

              {/* 9b & 9c: Welche Sprachen sprechen Sie? */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-emerald-300 text-sm">
                  9b &amp; 9c) Welche Sprachen sprechen Sie? Build Your Multilingual Profile:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Deutsch',
                    'Englisch',
                    'Spanisch',
                    'Französisch',
                    'Italienisch',
                    'Russisch',
                    'Hindi',
                    'Polnisch',
                    'Niederländisch',
                    'Schwedisch',
                    'Türkisch',
                    'Ungarisch'
                  ].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setNewLangName(lang);
                        speakGerman(lang, speechRate);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                        newLangName === lang
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={newLangLevel}
                    onChange={(e) => setNewLangLevel(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-bold"
                  >
                    <option value="sehr gut">sehr gut (very well)</option>
                    <option value="gut">gut (well)</option>
                    <option value="ein bisschen">ein bisschen (a little bit)</option>
                  </select>
                  <button
                    onClick={() => {
                      const sentence = `Ich spreche ${newLangLevel} ${newLangName}.`;
                      speakGerman(sentence, speechRate);
                      setUserLanguages([
                        ...userLanguages,
                        { lang: newLangName, level: newLangLevel }
                      ]);
                      markDone('ex9b');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> + Add &amp; Speak: „Ich spreche {newLangLevel} {newLangName}“
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'modul1' && (
          <div className="space-y-8">
            {/* PAGE 21: LESEMAGAZIN "DAS BIN ICH" */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 21 • LESEMAGAZIN „DAS BIN ICH“
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Page 21: Paco &amp; Sein Bruder Miguel • Nicole &amp; Ihr Bruder Florian
                  </h3>
                </div>
                {completed.p21 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* Reading Texts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2 text-xs leading-relaxed">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-300 text-sm">
                      ♎ 1. Paco Rodriguez (23) &amp; Bruder Miguel (31)
                    </span>
                    <button
                      onClick={() =>
                        speakGerman(
                          'Ich heiße Paco Rodriguez. Ich bin 23 Jahre alt und komme aus Mexiko. Ich wohne in München und studiere Biochemie. Das ist mein Bruder Miguel. Er ist 31 und lebt in den USA, in Kalifornien. Er ist Ingenieur bei SunTex. Miguels Frau heißt Patricia und arbeitet als Krankenschwester. Das Baby ist meine Nichte Eliza.',
                          speechRate
                        )
                      }
                      className="text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                  <p className="text-slate-300">
                    „Ich heiße <strong>Paco Rodriguez</strong>. Ich bin 23 Jahre alt und komme aus <strong>Mexiko</strong>. Ich wohne in <strong>München</strong> und <strong>studiere Biochemie</strong>. Ich bin nicht verheiratet und meine Hobbys sind Skaten und Fotografie. Mein Sternzeichen ist Waage.“
                  </p>
                  <p className="text-slate-300">
                    „Das ist mein Bruder <strong>Miguel</strong>. Er ist 31. Er lebt in den USA, in Kalifornien. Er ist Ingenieur und arbeitet bei SunTex in Palo Alto. Miguel ist <strong>verheiratet</strong> und hat ein Kind. Miguels Frau heißt <strong>Patricia</strong>. Sie ist 27 und arbeitet als <strong>Krankenschwester</strong>. Das Baby ist meine Nichte Eliza.“
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2 text-xs leading-relaxed">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-300 text-sm">
                      ♈ 2. Nicole Moser (22) &amp; Bruder Florian (24)
                    </span>
                    <button
                      onClick={() =>
                        speakGerman(
                          'Ich heiße Nicole Moser. Ich bin 22 Jahre alt und komme aus Österreich. Meine Heimatstadt ist Wien. Zurzeit lebe und studiere ich aber in München. Das ist mein Bruder Florian. Er ist 24 und lebt zurzeit in Spanien. Er spricht vier Fremdsprachen perfekt: Englisch, Französisch, Spanisch und Italienisch.',
                          speechRate
                        )
                      }
                      className="text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                  <p className="text-slate-300">
                    „Ich heiße <strong>Nicole Moser</strong>. Ich bin 22 Jahre alt und komme aus Österreich. Meine Heimatstadt ist <strong>Wien</strong>. Zurzeit lebe und <strong>studiere ich aber in München</strong>. Ich bin nicht verheiratet. Meine Hobbys sind Kochen, Musik machen und Singen. Mein Sternzeichen ist Widder.“
                  </p>
                  <p className="text-slate-300">
                    „Das ist mein Bruder <strong>Florian</strong>. Er ist 24 und lebt zurzeit in Spanien. Er spricht <strong>vier Fremdsprachen</strong> perfekt: Englisch, Französisch, Spanisch und Italienisch. Florian studiert Business Management in Barcelona.“
                  </p>
                </div>
              </div>

              {/* Ex 1 on Page 21: Korrigieren Sie die Sätze */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-indigo-300 text-sm">
                  1) Lesen Sie die Texte und korrigieren Sie die falschen Sätze (a–f):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    {
                      key: 'a',
                      wrong: 'a) Paco kommt aus Spanien.',
                      correct: 'Paco kommt aus Mexiko.'
                    },
                    {
                      key: 'b',
                      wrong: 'b) Paco ist arbeitslos.',
                      correct: 'Paco ist Student / studiert Biochemie.'
                    },
                    {
                      key: 'c',
                      wrong: 'c) Miguel ist geschieden.',
                      correct: 'Miguel ist verheiratet.'
                    },
                    {
                      key: 'd',
                      wrong: 'd) Patricia arbeitet als Verkäuferin.',
                      correct: 'Patricia arbeitet als Krankenschwester.'
                    },
                    {
                      key: 'e',
                      wrong: 'e) Nicole kommt aus Graz und studiert in Wien.',
                      correct: 'Nicole kommt aus Wien und studiert in München.'
                    },
                    {
                      key: 'f',
                      wrong: 'f) Florian spricht zwei Fremdsprachen.',
                      correct: 'Florian spricht vier Fremdsprachen.'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5"
                    >
                      <div className="text-rose-400 line-through">{item.wrong}</div>
                      <select
                        value={leseAnswers[item.key]}
                        onChange={(e) =>
                          setLeseAnswers({ ...leseAnswers, [item.key]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-emerald-300 font-bold"
                      >
                        <option value="">-- Choose correct sentence --</option>
                        <option value={item.correct}>{item.correct}</option>
                        <option value="Er wohnt in Berlin.">Er wohnt in Berlin.</option>
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setLeseChecked(true);
                    markDone('p21');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Page 21 Corrections
                </button>
              </div>
            </section>

            {/* PAGE 22: FILM-STATIONEN (Clips 1-3) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase">
                  Seite 22 • FILM-STATIONEN (Clips 1–3)
                </span>
                <h3 className="text-xl font-bold text-white">
                  Page 22: Regional Greetings Map (Moin, Grüezi, Grüß Gott, Servus)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  {
                    city: 'Norddeutschland (Hamburg)',
                    greeting: 'Moin, moin!',
                    farewell: 'Tschüs!'
                  },
                  {
                    city: 'Berlin / Mitteldeutschland',
                    greeting: 'Hallo! / Guten Tag!',
                    farewell: 'Auf Wiedersehen! / Tschüs!'
                  },
                  {
                    city: 'München & Wien (Süddeutschland & Österreich)',
                    greeting: 'Grüß Gott! / Servus!',
                    farewell: 'Auf Wiederschauen! / Servus!'
                  },
                  {
                    city: 'Zürich (Schweiz)',
                    greeting: 'Grüezi!',
                    farewell: 'Uf Wiederluege mitenand!'
                  }
                ].map((reg) => (
                  <div
                    key={reg.city}
                    onClick={() =>
                      speakGerman(`${reg.greeting} ... ${reg.farewell}`, speechRate)
                    }
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-sky-500/50 cursor-pointer space-y-1.5"
                  >
                    <div className="font-bold text-sky-300">{reg.city}</div>
                    <div className="text-white font-extrabold text-sm">👋 {reg.greeting}</div>
                    <div className="text-amber-300 font-semibold">🚪 {reg.farewell}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* PAGE 23: PROJEKT LANDESKUNDE - HEIDI KLUM */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Seite 23 • PROJEKT LANDESKUNDE
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Page 23: Heidi Klum — Biografie &amp; Stammbaum ergänzen
                  </h3>
                </div>
                {completed.p23 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                „<strong>Heidi Klum</strong> ist die Tochter von <strong>Erna und Günther Klum</strong> und kommt aus <strong>Deutschland</strong> (Bergisch Gladbach). Heidi Klums Vater ist Chemiefacharbeiter. Jetzt arbeitet er aber als <strong>Manager</strong> von Heidi Klum. Erna Klum ist von Beruf <strong>Friseurin</strong>, aber sie arbeitet nicht mehr. Heidi Klum ist <strong>Model und Moderatorin</strong>. Seal ist von Beruf <strong>Sänger</strong> und kommt aus <strong>London</strong>. Heidi Klum hat <strong>vier Kinder</strong> (Leni, Henry, Johan, Lou). Die Familie wohnt zurzeit <strong>in den USA</strong>.“
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-300">Mutter: Erna Klum</div>
                  <div>Beruf: <strong className="text-white">Friseurin</strong> (arbeitet nicht mehr)</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-300">Vater: Günther Klum</div>
                  <div>Beruf: Chemiefacharbeiter</div>
                  <div>arbeitet als: <strong className="text-white">Manager</strong></div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-300">Heidi Klum</div>
                  <div>Beruf: <strong className="text-white">Model &amp; Moderatorin</strong></div>
                  <div>Herkunft: <strong className="text-white">Deutschland (Bergisch Gladbach)</strong></div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-300">Seal &amp; 4 Kinder</div>
                  <div>Seal: <strong className="text-white">Sänger aus London</strong></div>
                  <div>Wohnort: <strong className="text-white">in den USA</strong></div>
                  <div>Kinder: <strong className="text-white">Leni, Henry, Johan, Lou</strong></div>
                </div>
              </div>
              <button
                onClick={() => {
                  speakGerman(
                    'Meine Person heißt Heidi Klum. Sie kommt aus Deutschland und ist Model und Moderatorin. Die Eltern heißen Erna und Günther Klum. Der Vater arbeitet als Manager. Sie hat vier Kinder: Leni, Henry, Johan und Lou.',
                    speechRate
                  );
                  markDone('p23');
                }}
                className="bg-rose-400 hover:bg-rose-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Hear Full Heidi Klum Presentation (Ex. 2b)
              </button>
            </section>

            {/* PAGE 24: AUSKLANG - "WO WOHNT WINFRIED?" DETECTIVE PUZZLE */}
            <section className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 24 • AUSKLANG (Track 1.21) — Modul 1 Detective Mystery
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Page 24: „Wo wohnt Winfried?“ — Recall Chapters 1–3 to Crack the 7-Letter Code!
                  </h3>
                </div>
                {completed.p24 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Mystery Solved!
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.21" speechRate={speechRate} />

              <div className="space-y-2 text-xs">
                {[
                  {
                    id: 'A',
                    clue: 'wohnt in Berlin und arbeitet als IT-Spezialist bei Galaxynet.',
                    person: 'Sven Henkenjohann',
                    letterRule: 'Letter #1 = Nachname Buchstabe 1 → H'
                  },
                  {
                    id: 'B',
                    clue: 'kommt aus Mexiko und wohnt in München.',
                    person: 'Paco Rodriguez',
                    letterRule: 'Letter #2 = Vorname Buchstabe 2 → A'
                  },
                  {
                    id: 'C',
                    clue: 'ist 21 und studiert in Stuttgart.',
                    person: 'Mark Poppenreuther',
                    letterRule: 'Letter #3 = Vorname Buchstabe 1 → M'
                  },
                  {
                    id: 'D',
                    clue: 'ist Architekt und wohnt in Bonn.',
                    person: 'Markus Bäuerlein',
                    letterRule: 'Letter #4 = Nachname Buchstabe 1 → B'
                  },
                  {
                    id: 'E',
                    clue: 'ist Journalistin und lebt in Köln.',
                    person: 'Barbara Meinhardt-Bäuerlein',
                    letterRule: 'Letter #5 = Nachname Buchstabe 12 → U'
                  },
                  {
                    id: 'F',
                    clue: 'ist verheiratet, arbeitet als Schauspielerin und lebt in Freiburg.',
                    person: 'Olga Poppenreuther',
                    letterRule: 'Letter #6 = Nachname Buchstabe 7 (R) & Letter #7 = Vorname Buchstabe 3 (G)'
                  }
                ].map((row) => (
                  <div
                    key={row.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-black text-amber-400 mr-2">{row.id}:</span>
                      <strong className="text-emerald-300 mr-2">{row.person}</strong>
                      <span className="text-slate-300">{row.clue}</span>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded text-indigo-300">
                      {row.letterRule}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm font-bold text-white">
                  2b) Wie heißt die Stadt? (1=H, 2=A, 3=M, 4=B, 5=U, 6=R, 7=G):
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={winfriedCity}
                    onChange={(e) => setWinfriedCity(e.target.value)}
                    placeholder="H _ _ _ _ _ _"
                    className="bg-slate-900 border border-amber-400 rounded-xl px-4 py-2 text-amber-300 font-black uppercase tracking-widest text-center w-44"
                  />
                  <button
                    onClick={() => {
                      setWinfriedCity('HAMBURG');
                      setAusklangChecked(true);
                      speakGerman('Winfried wohnt in Hamburg!', speechRate);
                      markDone('p24');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Reveal &amp; Speak Solution
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'bonus' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-rose-500/20 via-purple-950 to-amber-500/20 border border-rose-500/40 rounded-2xl p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Extra High-Retention Drills
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Chapter 3 Bonus Memory-Lock Arena
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Master the two biggest exam topics in Chapter 3: choosing between <strong>Ja / Nein / Doch</strong> and matching <strong>mein / meine / dein / deine</strong> without hesitation.
              </p>
            </div>

            {/* BONUS DRILL 1: JA / NEIN / DOCH */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Bonus Drill #1: The „Ja – Nein – Doch“ Reflex Trainer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dochQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
                  >
                    <div className="text-xs sm:text-sm font-bold text-white">{item.q}</div>
                    <div className="flex gap-2">
                      {['Ja', 'Nein', 'Doch'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setDochSelections({ ...dochSelections, [idx]: opt });
                            if (opt === item.ans) speakGerman(item.fullReply, speechRate);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            dochSelections[idx] === opt
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {dochChecked && (
                      <div
                        className={`text-xs font-semibold ${
                          dochSelections[idx] === item.ans
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {dochSelections[idx] === item.ans ? '✓ ' : `✗ (${item.ans}) `}
                        {item.why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setDochChecked(true);
                  markDone('bonus1');
                }}
                className="bg-rose-400 hover:bg-rose-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Check All Ja / Nein / Doch Answers
              </button>
            </section>

            {/* BONUS DRILL 2: Possessivartikel Sniper */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Bonus Drill #2: Possessivartikel Sniper (mein • meine • dein • deine)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {possQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{item.prompt}</div>
                      <div className="text-[11px] text-slate-400">{item.noun}</div>
                    </div>
                    <div className="flex gap-1">
                      {['mein', 'meine', 'dein', 'deine'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setPossAnswers({ ...possAnswers, [idx]: opt });
                            speakGerman(item.prompt.replace('___', opt).replace(/\((.*?)\)\s*/, ''), speechRate);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                            possAnswers[idx]?.toLowerCase() === opt
                              ? 'bg-amber-400 border-amber-300 text-slate-950'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setPossChecked(true);
                  markDone('bonus2');
                }}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Check Possessive Articles
              </button>
            </section>
          </div>
        )}

        {}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Modul 1 • Seite 20 Official Reference
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                GRAMMATIK &amp; KOMMUNIKATION (Click Any Row to Hear It!)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GRAMMATIK COLUMN */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  GRAMMATIK (Seite 20)
                </h3>

                {/* Possessivartikel */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    Possessivartikel mein / dein
                  </h4>
                  <table className="w-full text-xs sm:text-sm bg-slate-950 rounded-xl overflow-hidden border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200 text-left">
                        <th className="p-2.5">Pronomen</th>
                        <th className="p-2.5">maskulin (der)</th>
                        <th className="p-2.5">feminin (die)</th>
                        <th className="p-2.5">Plural (die)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr
                        onClick={() =>
                          speakGerman('ich: mein Bruder, meine Schwester, meine Eltern', speechRate)
                        }
                        className="hover:bg-slate-900 cursor-pointer"
                      >
                        <td className="p-2.5 font-bold text-amber-300">ich &rarr;</td>
                        <td className="p-2.5 text-sky-300 font-semibold">mein Bruder</td>
                        <td className="p-2.5 text-rose-300 font-semibold">meine Schwester</td>
                        <td className="p-2.5 text-emerald-300 font-semibold">meine Eltern</td>
                      </tr>
                      <tr
                        onClick={() =>
                          speakGerman('du: dein Bruder, deine Schwester, deine Eltern', speechRate)
                        }
                        className="hover:bg-slate-900 cursor-pointer"
                      >
                        <td className="p-2.5 font-bold text-amber-300">du &rarr;</td>
                        <td className="p-2.5 text-sky-300 font-semibold">dein Bruder</td>
                        <td className="p-2.5 text-rose-300 font-semibold">deine Schwester</td>
                        <td className="p-2.5 text-emerald-300 font-semibold">deine Eltern</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verb sprechen mit Vokalwechsel */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    Verb sprechen: Konjugation mit Vokalwechsel (e &rarr; i)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="space-y-1">
                      <div onClick={() => speakGerman('ich spreche', speechRate)} className="cursor-pointer hover:text-amber-300">
                        ich <strong>spreche</strong>
                      </div>
                      <div onClick={() => speakGerman('du sprichst', speechRate)} className="cursor-pointer text-amber-300 font-bold">
                        du <u>sprichst</u>
                      </div>
                      <div onClick={() => speakGerman('er sie spricht', speechRate)} className="cursor-pointer text-amber-300 font-bold">
                        er/sie <u>spricht</u>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div onClick={() => speakGerman('wir sprechen', speechRate)} className="cursor-pointer hover:text-amber-300">
                        wir <strong>sprechen</strong>
                      </div>
                      <div onClick={() => speakGerman('ihr sprecht', speechRate)} className="cursor-pointer hover:text-amber-300">
                        ihr <strong>sprecht</strong>
                      </div>
                      <div onClick={() => speakGerman('sie sprechen', speechRate)} className="cursor-pointer hover:text-amber-300">
                        sie/Sie <strong>sprechen</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOMMUNIKATION COLUMN */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  KOMMUNIKATION (Seite 20)
                </h3>

                {[
                  {
                    title: 'Familie (Talking About Family)',
                    items: [
                      'Das sind meine Eltern. / Das ist meine Mutter.',
                      'Ist Ewa deine Schwester? → Nein, Ewa ist nicht meine Schwester. Ewa ist meine Freundin.'
                    ]
                  },
                  {
                    title: 'ja / nein / doch (Answering Positive & Negative Questions)',
                    items: [
                      'Ist das deine Frau? → Ja, (das ist meine Frau). / Nein, (das ist nicht meine Frau).',
                      'Das ist nicht deine Frau? → Doch, (das ist meine Frau). / Nein, (das ist nicht meine Frau).'
                    ]
                  },
                  {
                    title: 'Sprachkenntnisse (Talking About Languages)',
                    items: [
                      'Welche Sprachen sprechen Sie / sprichst du?',
                      'Ich spreche (sehr gut / gut / ein bisschen) Deutsch und Englisch.'
                    ]
                  }
                ].map((sec, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                  >
                    <div className="text-xs font-bold uppercase text-indigo-300">{sec.title}</div>
                    {sec.items.map((line, idx) => (
                      <div
                        key={idx}
                        onClick={() => speakGerman(line.replace('→', '...'), speechRate)}
                        className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 text-xs sm:text-sm"
                      >
                        <span className="text-slate-100 font-medium">{line}</span>
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
