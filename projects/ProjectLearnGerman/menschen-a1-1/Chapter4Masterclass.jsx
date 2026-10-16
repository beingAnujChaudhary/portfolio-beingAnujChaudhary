import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  Lightbulb,
  ArrowRight,
  Layers,
  Sofa,
  Euro,
  ShoppingBag,
  Hash,
  MessageCircle,
  Footprints,
  Smile,
  RefreshCw,
  HelpCircle
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

const bigNumberToGerman = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n) || n < 0) return '';
  if (n === 1000000) return 'eine Million';
  const under100 = (val) => {
    const ones = [
      '',
      'eins',
      'zwei',
      'drei',
      'vier',
      'fünf',
      'sechs',
      'sieben',
      'acht',
      'neun',
      'zehn',
      'elf',
      'zwölf',
      'dreizehn',
      'vierzehn',
      'fünfzehn',
      'sechzehn',
      'siebzehn',
      'achtzehn',
      'neunzehn'
    ];
    const tens = {
      20: 'zwanzig',
      30: 'dreißig',
      40: 'vierzig',
      50: 'fünfzig',
      60: 'sechzig',
      70: 'siebzig',
      80: 'achtzig',
      90: 'neunzig'
    };
    if (val < 20) return ones[val];
    const o = val % 10;
    const t = val - o;
    if (o === 0) return tens[t];
    const oneWord = o === 1 ? 'ein' : ones[o];
    return `${oneWord}und${tens[t]}`;
  };

  const under1000 = (val) => {
    if (val === 0) return '';
    if (val < 100) return under100(val);
    const h = Math.floor(val / 100);
    const rem = val % 100;
    const hPrefix =
      h === 1
        ? 'einhundert'
        : `${['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'][h]}hundert`;
    return `${hPrefix}${under100(rem)}`;
  };

  if (n === 0) return 'null';
  if (n < 1000) return under100(n);
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const tPrefix =
    thousands === 1 ? 'eintausend' : `${under1000(thousands)}tausend`;
  return `${tPrefix}${under1000(rest)}`;
};

const FURNITURE_LEXICON = [
  {
    noun: 'der Tisch',
    bare: 'Tisch',
    article: 'der',
    pronoun: 'er',
    en: 'Table',
    icon: '🪑',
    price: 1478,
    adj: 'modern, aber sehr teuer',
    hook: '🔵 Masculine (der → er): Think of the strong carpenter building DER Tisch!'
  },
  {
    noun: 'der Stuhl',
    bare: 'Stuhl',
    article: 'der',
    pronoun: 'er',
    en: 'Chair',
    icon: '🪑',
    price: 79,
    adj: 'praktisch',
    hook: '🔵 Masculine (der → er): Tisch & Stuhl are best friends—both are DER!'
  },
  {
    noun: 'der Sessel',
    bare: 'Sessel',
    article: 'der',
    pronoun: 'er',
    en: 'Armchair',
    icon: '🛋️',
    price: 349,
    adj: 'sehr bequem und schön',
    hook: '🔵 Masculine (der → er): Nouns ending in -el (der Sessel) are almost always DER!'
  },
  {
    noun: 'der Schrank',
    bare: 'Schrank',
    article: 'der',
    pronoun: 'er',
    en: 'Cabinet / Wardrobe',
    icon: '🚪',
    price: 650,
    adj: 'groß und praktisch',
    hook: '🔵 Masculine (der → er): Tall, heavy storage giant = DER Schrank!'
  },
  {
    noun: 'der Teppich',
    bare: 'Teppich',
    article: 'der',
    pronoun: 'er',
    en: 'Carpet / Rug',
    icon: '🧶',
    price: 129,
    adj: 'schön und günstig',
    hook: '🔵 Masculine (der → er): Nouns ending in -ich (der Teppich) are always DER!'
  },
  {
    noun: 'das Bett',
    bare: 'Bett',
    article: 'das',
    pronoun: 'es',
    en: 'Bed',
    icon: '🛏️',
    price: 890,
    adj: 'zu groß (oder sehr gut!)',
    hook: '🟢 Neuter (das → es): Flat, cozy resting objects (das Bett, das Sofa, das Bild) are DAS!'
  },
  {
    noun: 'das Bild',
    bare: 'Bild',
    article: 'das',
    pronoun: 'es',
    en: 'Picture / Painting',
    icon: '🖼️',
    price: 95,
    adj: 'modern und schön',
    hook: '🟢 Neuter (das → es): DAS Bild hangs on the wall!'
  },
  {
    noun: 'das Sofa',
    bare: 'Sofa',
    article: 'das',
    pronoun: 'es',
    en: 'Sofa (also: die Couch)',
    icon: '🛋️',
    price: 1150,
    adj: 'sehr modern',
    hook: '🟢/🔴 Dual Trick: International word "das Sofa" is neuter (es), while "die Couch" is feminine (sie)!'
  },
  {
    noun: 'die Lampe',
    bare: 'Lampe',
    article: 'die',
    pronoun: 'sie',
    en: 'Lamp',
    icon: '💡',
    price: 119,
    adj: 'günstig (ein Sonderangebot!)',
    hook: '🔴 Feminine (die → sie): Ends in "-e" (die Lamp-e) → 90% of German nouns ending in -e are DIE!'
  },
  {
    noun: 'die Couch',
    bare: 'Couch',
    article: 'die',
    pronoun: 'sie',
    en: 'Couch',
    icon: '🛋️',
    price: 999,
    adj: 'wirklich schön',
    hook: '🔴 Feminine (die → sie): die Couch = sie!'
  }
];

const AUDIO_TRACKS = {
  '1.22': {
    title: 'Track 1.22 – Sibylle & Artur im Möbelhaus (Ex. 2, Seite 25)',
    lines: [
      {
        speaker: 'Sibylle',
        text: 'Schau mal, Artur! Der Tisch hier ist wirklich schön! Und sehr modern!'
      },
      {
        speaker: 'Artur',
        text: 'Ja, der Tisch ist nicht schlecht. Und er ist auch praktisch.'
      },
      {
        speaker: 'Artur',
        text: 'Und wie findest du das Bett hier? Das Bett ist super, oder?'
      },
      {
        speaker: 'Sibylle',
        text: 'Hm, nein. Ich finde, das Bett ist zu groß!'
      }
    ]
  },
  '1.23': {
    title: 'Track 1.23 – Das ist aber teuer! Beratungsgespräch (Ex. 3a & 3b, Seite 26)',
    lines: [
      { speaker: 'Verkäufer (1)', text: 'Brauchen Sie Hilfe?' },
      { speaker: 'Sibylle (2)', text: 'Ja, bitte. Wie viel kostet denn der Tisch?' },
      { speaker: 'Verkäufer (3)', text: 'Der Tisch kostet eintausendvierhundertachtundsiebzig Euro.' },
      { speaker: 'Sibylle (4)', text: 'Das ist aber sehr teuer!' },
      { speaker: 'Verkäufer (5)', text: 'Finden Sie?' },
      { speaker: 'Sibylle (6)', text: 'Ja. Das ist zu teuer!' },
      { speaker: 'Sibylle (7)', text: 'Was kostet die Lampe?' },
      {
        speaker: 'Verkäufer (8)',
        text: 'Die Lampe kostet nur einhundertneunzehn Euro. Das ist sehr günstig. Ein Sonderangebot.'
      },
      { speaker: 'Sibylle (9)', text: 'Die Lampe ist wirklich sehr schön und nicht teuer!' },
      {
        speaker: 'Verkäufer (10)',
        text: 'Sie kommt aus Italien. Der Designer heißt Enzo Carotti.'
      }
    ]
  },
  '1.25': {
    title: 'Track 1.25 – Die Zahlenschlange 100 bis 1.000.000 (Ex. 5, Seite 27)',
    lines: [
      {
        speaker: 'Sprecher',
        text: 'hundert ... zweihundert ... dreihundert ... dreihunderteinundfünfzig ... sechshunderteinundfünfzig'
      },
      {
        speaker: 'Sprecher',
        text: 'tausend ... zehntausend ... hunderttausend ... achthundertsiebenundneunzigtausend ... achthundertachtundneunzigtausend ... eine Million!'
      }
    ]
  },
  '1.26-28': {
    title: 'Tracks 1.26–1.28 – Wie viel kostet das? Preis-Diktat (Ex. 6a, Seite 27)',
    lines: [
      {
        speaker: 'Hörtext 1 (Track 1.26)',
        text: 'Entschuldigung, was kostet der Stuhl? – Der Stuhl kostet neunundfünfzig Euro neunzig (59,90 €).'
      },
      {
        speaker: 'Hörtext 2 (Track 1.27)',
        text: 'Wie viel kostet das Sofa? – Das Sofa ist ein Sonderangebot: Es kostet nur vierhundertneunundneunzig Euro (499 €).'
      },
      {
        speaker: 'Hörtext 3 (Track 1.28)',
        text: 'Und was kostet die Postkarte hier? – Sie kostet nur fünfundachtzig Cent (0,85 €).'
      }
    ]
  },
  '1.29': {
    title: 'Track 1.29 – Sprechtraining: Bitte oder Danke? (Ex. 10, Seite 28)',
    lines: [
      { speaker: 'Dialog A', text: 'Brauchen Sie Hilfe? – Ja, bitte.' },
      { speaker: 'Dialog B', text: 'Kaffee? – Nein, danke.' },
      { speaker: 'Dialog C', text: 'Das macht dann neun Euro fünfundneunzig, bitte.' },
      { speaker: 'Dialog D', text: 'Wie bitte?' },
      { speaker: 'Dialog E', text: 'Vielen Dank! – Bitte!' }
    ]
  }
};

const AudioTrackPlayer = ({ trackId, speechRate }) => {
  const [showScript, setShowScript] = useState(false);
  const track = AUDIO_TRACKS[trackId];
  if (!track) return null;

  const playAll = () => {
    const fullText = track.lines.map((l) => l.text).join(' ... ');
    speakGerman(fullText, speechRate);
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
          {showScript ? 'Hide Audio Transcript' : 'Show Transcript & Click-to-Speak Lines'}
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

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [speechRate, setSpeechRate] = useState(0.92);
  const [completed, setCompleted] = useState({});

  const markDone = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
  };

  // Selected Furniture Item in Tab 1 Showroom
  const [selectedFurnIdx, setSelectedFurnIdx] = useState(0);

  // --- PAGE 25: EX 1 & 2 STATES ---
  const [ex2Matches, setEx2Matches] = useState({
    sibylleTisch: '', // schön & modern
    arturTisch: '',   // nicht schlecht & praktisch
    sibylleBett: '',  // zu groß
    arturBett: ''     // gut / bequem
  });
  const [ex2Checked, setEx2Checked] = useState(false);

  // --- PAGE 26: EX 3a, 3b, 3c & 4a, 4b STATES ---
  const [ex3aGaps, setEx3aGaps] = useState({
    tischPrice: 'A', // € 1.478
    tischAdj: '',    // D (Das ist teuer!)
    lampePrice: '',  // B (€ 119)
    lampeAdj: ''     // C (Das ist billig!)
  });
  const [ex3aChecked, setEx3aChecked] = useState(false);

  const ex3bRows = [
    {
      id: 'a',
      text: 'Ja, bitte. Wie viel kostet denn der Tisch?',
      correctSpeaker: 'SIBYLLE',
      correctOrder: '2'
    },
    {
      id: 'b',
      text: 'Brauchen Sie Hilfe?',
      correctSpeaker: 'VERKÄUFER',
      correctOrder: '1'
    },
    {
      id: 'c',
      text: 'Der Tisch kostet 1478 Euro.',
      correctSpeaker: 'VERKÄUFER',
      correctOrder: '3'
    },
    {
      id: 'd',
      text: 'Ja. Das ist zu teuer!',
      correctSpeaker: 'SIBYLLE',
      correctOrder: '6'
    },
    {
      id: 'e',
      text: 'Das ist aber sehr teuer!',
      correctSpeaker: 'SIBYLLE',
      correctOrder: '4'
    },
    {
      id: 'f',
      text: 'Finden Sie?',
      correctSpeaker: 'VERKÄUFER',
      correctOrder: '5'
    },
    {
      id: 'g',
      text: 'Sie kommt aus Italien. Der Designer heißt Enzo Carotti.',
      correctSpeaker: 'VERKÄUFER',
      correctOrder: '10'
    },
    {
      id: 'h',
      text: 'Was kostet die Lampe?',
      correctSpeaker: 'SIBYLLE',
      correctOrder: '7'
    },
    {
      id: 'i',
      text: 'Die Lampe kostet nur 119 Euro. Das ist sehr günstig. Ein Sonderangebot.',
      correctSpeaker: 'VERKÄUFER',
      correctOrder: '8'
    },
    {
      id: 'j',
      text: 'Die Lampe ist wirklich sehr schön und nicht teuer!',
      correctSpeaker: 'SIBYLLE',
      correctOrder: '9'
    }
  ];
  const [ex3bSpeakers, setEx3bSpeakers] = useState({ a: 'SIBYLLE', b: 'VERKÄUFER' });
  const [ex3cOrders, setEx3cOrders] = useState({ b: '1', c: '3' });
  const [ex3bChecked, setEx3bChecked] = useState(false);

  // Ex 4a & 4b: der, das, die & Artikeltanz
  const [ex4aArticles, setEx4aArticles] = useState({
    Sessel: 'der',
    Bett: 'das',
    Lampe: 'die',
    Bild: '',
    Stuhl: '',
    Sofa: '',
    Couch: '',
    Tisch: '',
    Schrank: '',
    Teppich: ''
  });
  const [ex4aChecked, setEx4aChecked] = useState(false);
  const [danceCurrentIdx, setDanceCurrentIdx] = useState(0);
  const [danceFeedback, setDanceFeedback] = useState(null);
  const [danceScore, setDanceScore] = useState(0);

  // --- PAGE 27: EX 5, 6a, 6b, 7a, 7b, 8a, 8b, 9 STATES ---
  const [ex5Snake, setEx5Snake] = useState({
    n200: '',
    n300: '',
    n651: '',
    n100k: '',
    n898k: ''
  });
  const [ex5Checked, setEx5Checked] = useState(false);
  const [customBigNum, setCustomBigNum] = useState(1478);

  // Ex 6a Price Diktat
  const [ex6aPrices, setEx6aPrices] = useState({
    p1: '', // 59,90
    p2: '', // 499
    p3: ''  // 0,85
  });
  const [ex6aChecked, setEx6aChecked] = useState(false);

  // Ex 7a Pronouns er, es, sie
  const [ex7aLampChoice, setEx7aLampChoice] = useState(''); // Sie
  const [ex7aTable, setEx7aTable] = useState({
    tisch: 'er',
    bett: '',
    lampe: ''
  });
  const [ex7aChecked, setEx7aChecked] = useState(false);

  // Ex 8a & 8b Fridolins Möbel
  const [ex8aProblems, setEx8aProblems] = useState({
    bett: '',
    stuhl: '',
    lampe: 'zu teuer'
  });
  const [ex8aChecked, setEx8aChecked] = useState(false);
  const [ex8bDifficulty, setEx8bDifficulty] = useState('okay');

  // Ex 9 Evaluation Simulator (etwas bewerten)
  const [ex9ItemIdx, setEx9ItemIdx] = useState(0);
  const [ex9Opinion, setEx9Opinion] = useState('wirklich sehr schön');

  // --- PAGE 28: EX 10 & 11 (BITTE ODER DANKE) ---
  const [ex10Gaps, setEx10Gaps] = useState({
    A: 'bitte',
    B: '',
    C: '',
    D: '',
    E: ''
  });
  const [ex10Checked, setEx10Checked] = useState(false);

  // --- BONUS ARENA STATES ---
  const [pronounQuizAnswers, setPronounQuizAnswers] = useState({});
  const [pronounQuizChecked, setPronounQuizChecked] = useState(false);

  const totalTasks = 16;
  const doneCount = Object.keys(completed).length;
  const progressPct = Math.min(100, Math.round((doneCount / totalTasks) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border-b border-teal-500/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-teal-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
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
              href="./chapter-3.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 3"
            >
              <span>Lektion 3</span>
            </a>
            <a
              href="../german-a1-notes/index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="A1 Notes & 300 Flashcards"
            >
              <span>300 Cards</span>
            </a>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              L4
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  Menschen A1 • Modul 2 • Lektion 4 (Seiten 25–28)
                </span>
                <button
                  onClick={() => setSpeechRate(speechRate === 0.92 ? 0.72 : 0.92)}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold cursor-pointer hover:bg-amber-500/30 transition"
                >
                  {speechRate === 0.92 ? '🐇 Audio: Normal (0.92x)' : '🐢 Audio: Slow Learner (0.72x)'}
                </button>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                Der Tisch ist schön! — Furniture, Articles (der/das/die), Pronouns & Prices
              </h1>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 min-w-[240px]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Award className="w-4 h-4 text-teal-400" /> Chapter 4 Mastery
              </span>
              <span className="text-teal-400">
                {doneCount} / {totalTasks} Completed ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-2 pb-3">
          {[
            { id: 'learn', label: '1. Showroom & 6 Memory Hooks', icon: Brain },
            { id: 'ex1to4', label: '2. Exercises 1–4 & Artikeltanz (S. 25–26)', icon: Sofa },
            { id: 'ex5to9', label: '3. Exercises 5–9 & Fridolin (S. 27)', icon: Euro },
            { id: 'ex10to11', label: '4. Exercises 10–11 & Grammar (S. 28)', icon: Layers },
            { id: 'bonus', label: '5. Bonus Memory-Lock Arena', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20'
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
        {/* =====================================================================
            TAB 1: DEEP LESSON, INTERACTIVE SHOWROOM & 6 MEMORY HOOKS
           ===================================================================== */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            <section className="bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Welcome to Modul 2 • Lektion 4 (Seiten 25–28)
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Sibylle & Artur Go Furniture Shopping: „Der Tisch ist schön!“
                  </h2>
                </div>
                <button
                  onClick={() =>
                    speakGerman(
                      'Brauchen Sie Hilfe? Ja, bitte. Wie viel kostet denn der Tisch? Er kostet eintausendvierhundertachtundsiebzig Euro. Das ist aber sehr teuer! Und was kostet die Lampe? Sie kostet nur einhundertneunzehn Euro. Das ist ein Sonderangebot!',
                      speechRate
                    )
                  }
                  className="flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-sm font-bold px-4 py-2 rounded-xl shadow cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Hear Chapter 4 Core Dialogue
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                In Chapter 4, we join <strong>Sibylle and Artur</strong> in a furniture store. For the first time, we unlock Germany’s famous <strong>3 Grammatical Genders for Things</strong>: <strong className="text-sky-400">🔵 der (masculine → er)</strong>, <strong className="text-emerald-400">🟢 das (neuter → es)</strong>, and <strong className="text-rose-400">🔴 die (feminine → sie)</strong>. You will also learn how to ask for and state <strong>prices in Euros and Cents</strong>, count from <strong>100 to 1,000,000</strong>, evaluate items with adjectives (<em>zu teuer, sehr günstig, nicht schlecht</em>), and master the 4 meanings of <strong>„bitte“</strong>!
              </p>

              {/* Interactive Furniture Bildlexikon (Pages 26-27 Banner + Ex 1) */}
              <div className="bg-slate-950/90 border border-teal-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interactive Bildlexikon Möbel (Pages 25–27): Click any furniture card to hear Article + Pronoun + Price!
                  </span>
                  <span className="text-xs text-slate-400">
                    🔵 der (er) • 🟢 das (es) • 🔴 die (sie)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
                  {FURNITURE_LEXICON.map((item, idx) => (
                    <button
                      key={item.noun}
                      onClick={() => {
                        setSelectedFurnIdx(idx);
                        speakGerman(
                          `${item.noun}. ${item.pronoun.toUpperCase()} kostet ${item.price} Euro.`,
                          speechRate
                        );
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedFurnIdx === idx
                          ? 'bg-teal-900/60 border-amber-400 shadow'
                          : item.article === 'der'
                          ? 'bg-sky-950/30 border-sky-500/30 hover:bg-sky-950/50'
                          : item.article === 'das'
                          ? 'bg-emerald-950/30 border-emerald-500/30 hover:bg-emerald-950/50'
                          : 'bg-rose-950/30 border-rose-500/30 hover:bg-rose-950/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{item.icon}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.article === 'der'
                              ? 'bg-sky-500/20 text-sky-300'
                              : item.article === 'das'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {item.article} → {item.pronoun}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-white mt-1">{item.noun}</div>
                      <div className="text-xs text-slate-400">
                        {item.en} • €{item.price}
                      </div>
                    </button>
                  ))}
                </div>

                {FURNITURE_LEXICON[selectedFurnIdx] && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <div>
                        <strong className="text-amber-300">
                          {FURNITURE_LEXICON[selectedFurnIdx].noun}
                        </strong>{' '}
                        ({FURNITURE_LEXICON[selectedFurnIdx].en}) → Pronoun:{' '}
                        <strong className="text-teal-300 uppercase">
                          {FURNITURE_LEXICON[selectedFurnIdx].pronoun}
                        </strong>{' '}
                        („{FURNITURE_LEXICON[selectedFurnIdx].pronoun.charAt(0).toUpperCase() +
                          FURNITURE_LEXICON[selectedFurnIdx].pronoun.slice(1)}{' '}
                        kostet {FURNITURE_LEXICON[selectedFurnIdx].price} Euro.“)
                      </div>
                      <div className="text-xs text-slate-300">
                        {FURNITURE_LEXICON[selectedFurnIdx].hook}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        speakGerman(
                          `Wie viel kostet ${FURNITURE_LEXICON[selectedFurnIdx].noun}? ${FURNITURE_LEXICON[selectedFurnIdx].pronoun} kostet ${FURNITURE_LEXICON[selectedFurnIdx].price} Euro. Ich finde, ${FURNITURE_LEXICON[selectedFurnIdx].pronoun} ist ${FURNITURE_LEXICON[selectedFurnIdx].adj}.`,
                          speechRate
                        )
                      }
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-4 h-4" /> Hear Full Showroom Dialogue
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
                  6 "Forever Memory Hooks" (Gehirn-Anker) for Chapter 4
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hook 1: Color-Coding & Furniture Gender Grouping */}
                <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold">
                    MEMORY HOOK #1 • FURNITURE ARTICLES (S. 26 & 28)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The "5-3-2 Room Rule" for <em>der, das, die</em>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Instead of memorizing random genders, group the 10 textbook furniture words into 3 vivid visual teams:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30">
                      🔵 <strong>Team DER (The 5 Upright / Floor Giants):</strong>{' '}
                      <strong className="text-sky-300">
                        der Tisch, der Stuhl, der Sessel, der Schrank, der Teppich
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                      🟢 <strong>Team DAS (The 3 Cozy / Flat Squares):</strong>{' '}
                      <strong className="text-emerald-300">
                        das Bett, das Sofa, das Bild
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30">
                      🔴 <strong>Team DIE (The 2 Elegant Ladies):</strong>{' '}
                      <strong className="text-rose-300">
                        die Lampe
                      </strong>{' '}
                      (ends in <em>-e</em>!) &{' '}
                      <strong className="text-rose-300">die Couch</strong>
                    </div>
                  </div>
                </div>

                {/* Hook 2: Personalpronomen er / es / sie */}
                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">
                    MEMORY HOOK #2 • PRONOUN ECHO (S. 27 & 28)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Why a Table is "He" (<em>er</em>) and a Lamp is "She" (<em>sie</em>)!
                  </h3>
                  <p className="text-xs text-slate-300">
                    In English, every object is "it". In German, objects keep their grammatical gender! Look at the last letters of the article—they echo directly into the pronoun:
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-sky-300">
                      🔵 d<strong>er</strong> Tisch → <strong>er</strong> („<strong>Er</strong> kostet 1478 Euro.“)
                    </div>
                    <div className="text-emerald-300">
                      🟢 da<strong>s</strong> Bett → e<strong>s</strong> („<strong>Es</strong> ist zu groß.“)
                    </div>
                    <div className="text-rose-300">
                      🔴 d<strong>ie</strong> Lampe → s<strong>ie</strong> („<strong>Sie</strong> kommt aus Italien.“)
                    </div>
                  </div>
                </div>

                {/* Hook 3: Speaking Prices in Euro & Cent */}
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    MEMORY HOOK #3 • PRICES & NUMBERS (S. 27)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The "Euro-In-The-Middle" Price Tag Trick
                  </h3>
                  <p className="text-xs text-slate-300">
                    Notice two things on German price tags: they use a <strong>comma</strong> (`9,99 €`) instead of a decimal point, and when speaking, the word <strong>„Euro“</strong> sits right on the comma!
                  </p>
                  <div className="space-y-1.5 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      🏷️ <strong>9,99 €</strong> →{' '}
                      <span className="text-emerald-300 font-bold">„neun Euro neunundneunzig“</span>{' '}
                      (You drop the word "Cent"!)
                    </div>
                    <div>
                      🏷️ <strong>0,50 €</strong> →{' '}
                      <span className="text-amber-300 font-bold">„fünfzig Cent“</span>
                    </div>
                    <div>
                      🏷️ <strong>1.478 €</strong> → Written as ONE glued word:{' '}
                      <span className="text-sky-300 font-mono">
                        (ein)tausendvierhundertachtundsiebzig Euro
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hook 4: Adjectives & Intensifiers (sehr / zu / aber) */}
                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold">
                    MEMORY HOOK #4 • EVALUATING ITEMS (S. 25, 27 & 28)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The 3 Flavor Boosters: <em>sehr</em> vs. <em>zu</em> vs. <em>aber</em>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      ✨ <strong>sehr</strong> = <em>very</em> (positive or neutral boost):<br />
                      <span className="text-emerald-300">„Die Lampe ist sehr günstig / sehr schön.“</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      ⚠️ <strong>zu</strong> = <em>too</em> (a problem! Like Fridolin's furniture on S. 27):<br />
                      <span className="text-rose-300">
                        „Das Bett ist <strong>zu</strong> kurz! Der Stuhl ist <strong>zu</strong> klein! Der Tisch ist <strong>zu</strong> teuer!“
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      😲 <strong>aber</strong> (inside a sentence) = <em>really / sure is (surprise!)</em>:<br />
                      <span className="text-amber-300">„Das ist <strong>aber</strong> teuer!“</span> (Wow, that sure is expensive!)
                    </div>
                  </div>
                </div>

                {/* Hook 5: The 4 Faces of "Bitte" */}
                <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold">
                    MEMORY HOOK #5 • SWISS ARMY WORD „BITTE“ (S. 28)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    One Word, 4 Meanings: The „Bitte“ Chameleon
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      1️⃣ <strong>Yes, please!</strong><br />
                      <em>„Brauchen Sie Hilfe?“ – „Ja, <strong>bitte</strong>.“</em>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      2️⃣ <strong>Please (polite request):</strong><br />
                      <em>„Das macht 9 Euro 95, <strong>bitte</strong>.“</em>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      3️⃣ <strong>Pardon? / Excuse me?</strong><br />
                      <em>„Wie <strong>bitte</strong>?“</em>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      4️⃣ <strong>You're welcome!</strong><br />
                      <em>„Vielen Dank!“ – „<strong>Bitte</strong>!“</em>
                    </div>
                  </div>
                </div>

                {/* Hook 6: Adjective Antonym Pairs */}
                <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold">
                    MEMORY HOOK #6 • OPPOSITES MAGNET (S. 25–27)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    6 Essential Opposite Pairs (Click any pair to hear!)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      ['gut', 'schlecht', 'good ↔ bad'],
                      ['groß', 'klein', 'big ↔ small'],
                      ['teuer', 'billig / günstig', 'expensive ↔ cheap'],
                      ['lang', 'kurz', 'long ↔ short'],
                      ['schwer', 'leicht', 'hard/heavy ↔ easy/light'],
                      ['schön', 'nicht schön / hässlich', 'beautiful ↔ ugly']
                    ].map(([a, b, en]) => (
                      <button
                        key={a}
                        onClick={() => speakGerman(`${a} ... ${b}`, speechRate)}
                        className="bg-slate-950 hover:bg-slate-800 p-2 rounded-lg border border-slate-800 text-left cursor-pointer"
                      >
                        <div className="font-bold text-white">
                          <span className="text-emerald-300">{a}</span> ↔{' '}
                          <span className="text-rose-300">{b}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{en}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('ex1to4')}
                className="flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer transition"
              >
                <span>Start Textbook Exercises 1–4 & Artikeltanz (Pages 25–26)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: EXERCISES 1 TO 4 (PAGES 25 & 26)
           ===================================================================== */}
        {activeTab === 'ex1to4' && (
          <div className="space-y-8">
            {/* EXERCISE 1 & 2 (Page 25) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 25 • Übung 1 & 2 (Track 1.22)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    1 & 2. Der Tisch ist schön! — Sibylle und Artur im Möbelhaus
                  </h3>
                </div>
                {completed.ex1_2 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.22" speechRate={speechRate} />

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  2) Wer sagt was? Hören Sie (Track 1.22) und ordnen Sie zu.
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {[
                    {
                      key: 'sibylleTisch',
                      prompt: '1. Sibylle sagt, der Tisch ist ...',
                      correct: 'schön und modern.',
                      options: ['schön und modern.', 'zu groß.', 'nicht schlecht und praktisch.']
                    },
                    {
                      key: 'arturTisch',
                      prompt: '2. Artur sagt, der Tisch ist ...',
                      correct: 'nicht schlecht und praktisch.',
                      options: ['nicht schlecht und praktisch.', 'zu groß.', 'schön und modern.']
                    },
                    {
                      key: 'sibylleBett',
                      prompt: '3. Sibylle sagt, das Bett ist ...',
                      correct: 'zu groß.',
                      options: ['zu groß.', 'schön und modern.', 'praktisch.']
                    },
                    {
                      key: 'arturBett',
                      prompt: '4. Artur findet das Bett ...',
                      correct: 'gut / super.',
                      options: ['gut / super.', 'zu groß.', 'schlecht.']
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="font-bold text-white">{item.prompt}</div>
                      <select
                        value={ex2Matches[item.key]}
                        onChange={(e) =>
                          setEx2Matches({ ...ex2Matches, [item.key]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold"
                      >
                        <option value="">-- Choose opinion --</option>
                        {item.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {ex2Checked && (
                        <div className="text-xs font-bold">
                          {ex2Matches[item.key] === item.correct ? (
                            <span className="text-emerald-400">✓ {item.correct}</span>
                          ) : (
                            <span className="text-rose-400">✗ ({item.correct})</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEx2Checked(true);
                    markDone('ex1_2');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Exercise 2
                </button>
              </div>
            </section>

            {/* EXERCISE 3 (Page 26) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 26 • Übung 3a, 3b & 3c (Track 1.23)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    3. Das ist aber teuer! — Preise, Verkäufer-Dialog & Reihenfolge
                  </h3>
                </div>
                {completed.ex3 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.23" speechRate={speechRate} />

              {/* 3a: Price Tags A, B, C, D */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  3a) Was passt? Hören Sie das Gespräch weiter und ordnen Sie zu (A, B, C, D).
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div className="bg-amber-500/20 border border-amber-400 text-amber-300 p-2.5 rounded-xl">
                    A: € 1.478
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 p-2.5 rounded-xl">
                    B: € 119
                  </div>
                  <div className="bg-sky-500/20 border border-sky-400 text-sky-300 p-2.5 rounded-xl">
                    C: Das ist billig!
                  </div>
                  <div className="bg-rose-500/20 border border-rose-400 text-rose-300 p-2.5 rounded-xl">
                    D: Das ist teuer!
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2">
                    <span>1. Der Tisch kostet</span>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                      A (€ 1.478)
                    </span>
                    <span>.</span>
                    <select
                      value={ex3aGaps.tischAdj}
                      onChange={(e) =>
                        setEx3aGaps({ ...ex3aGaps, tischAdj: e.target.value })
                      }
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                    >
                      <option value="">C or D?</option>
                      <option value="D">D (Das ist teuer!)</option>
                      <option value="C">C (Das ist billig!)</option>
                    </select>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2">
                    <span>2. Die Lampe kostet</span>
                    <select
                      value={ex3aGaps.lampePrice}
                      onChange={(e) =>
                        setEx3aGaps({ ...ex3aGaps, lampePrice: e.target.value })
                      }
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-bold"
                    >
                      <option value="">A or B?</option>
                      <option value="B">B (€ 119)</option>
                      <option value="A">A (€ 1.478)</option>
                    </select>
                    <span>.</span>
                    <select
                      value={ex3aGaps.lampeAdj}
                      onChange={(e) =>
                        setEx3aGaps({ ...ex3aGaps, lampeAdj: e.target.value })
                      }
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sky-300 font-bold"
                    >
                      <option value="">C or D?</option>
                      <option value="C">C (Das ist billig!)</option>
                      <option value="D">D (Das ist teuer!)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3b & 3c: Wer sagt was + Ordnen Sie die Sätze */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-indigo-300 text-sm">
                  3b & 3c) Wer sagt was (`VERKÄUFER` oder `SIBYLLE`)? Und ordnen Sie die Sätze (1–10)!
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm bg-slate-900 rounded-xl overflow-hidden border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300 text-left">
                        <th className="p-2.5">3c) Order (1–10)</th>
                        <th className="p-2.5">Satz (Click to hear)</th>
                        <th className="p-2.5 text-center">VERKÄUFER</th>
                        <th className="p-2.5 text-center">SIBYLLE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ex3bRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-800/50">
                          <td className="p-2.5 w-28">
                            <select
                              value={ex3cOrders[row.id] || ''}
                              onChange={(e) =>
                                setEx3cOrders({ ...ex3cOrders, [row.id]: e.target.value })
                              }
                              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold"
                            >
                              <option value="">#?</option>
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n) => (
                                <option key={n} value={n}>
                                  #{n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            onClick={() => speakGerman(row.text, speechRate)}
                            className="p-2.5 text-slate-100 cursor-pointer hover:text-amber-300"
                          >
                            <span className="font-bold text-indigo-400 mr-1.5">{row.id})</span>
                            {row.text}
                          </td>
                          {['VERKÄUFER', 'SIBYLLE'].map((sp) => (
                            <td key={sp} className="p-2.5 text-center">
                              <button
                                onClick={() =>
                                  setEx3bSpeakers({ ...ex3bSpeakers, [row.id]: sp })
                                }
                                className={`w-7 h-7 rounded font-bold border cursor-pointer ${
                                  ex3bSpeakers[row.id] === sp
                                    ? 'bg-teal-400 border-teal-300 text-slate-950'
                                    : 'bg-slate-950 border-slate-700 text-slate-500'
                                }`}
                              >
                                {ex3bSpeakers[row.id] === sp ? 'X' : ''}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setEx3aChecked(true);
                      setEx3bChecked(true);
                      markDone('ex3');
                    }}
                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Check Exercise 3a, 3b & 3c
                  </button>
                  <button
                    onClick={() => {
                      setEx3aGaps({
                        tischPrice: 'A',
                        tischAdj: 'D',
                        lampePrice: 'B',
                        lampeAdj: 'C'
                      });
                      const spMap = {};
                      const ordMap = {};
                      ex3bRows.forEach((r) => {
                        spMap[r.id] = r.correctSpeaker;
                        ordMap[r.id] = r.correctOrder;
                      });
                      setEx3bSpeakers(spMap);
                      setEx3cOrders(ordMap);
                      markDone('ex3');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Auto-Fill Solutions (3a–3c)
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 4: ARTIKELTANZ (Page 26) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 26 • Übung 4a & 4b (Track 1.24 • Spiel & Spaß)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    4. der, das oder die? — Artikel-Sortierung & Der Artikeltanz!
                  </h3>
                </div>
                {completed.ex4 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 4a: Sort all 10 Bildlexikon words */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  4a) Ordnen Sie die Wörter aus dem Bildlexikon zu (`🔵 der`, `🟢 das`, `🔴 die`):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {FURNITURE_LEXICON.map((item) => (
                    <div
                      key={item.bare}
                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-center"
                    >
                      <div className="font-bold text-white text-sm">{item.bare}</div>
                      <div className="flex justify-center gap-1">
                        {['der', 'das', 'die'].map((art) => (
                          <button
                            key={art}
                            onClick={() => {
                              setEx4aArticles({ ...ex4aArticles, [item.bare]: art });
                              speakGerman(`${art} ${item.bare}`, speechRate);
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold border cursor-pointer ${
                              ex4aArticles[item.bare] === art
                                ? art === 'der'
                                  ? 'bg-sky-500 text-slate-950 border-sky-300'
                                  : art === 'das'
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                                  : 'bg-rose-500 text-slate-950 border-rose-300'
                                : 'bg-slate-950 border-slate-700 text-slate-400'
                            }`}
                          >
                            {art}
                          </button>
                        ))}
                      </div>
                      {ex4aChecked && (
                        <div className="text-xs font-bold">
                          {ex4aArticles[item.bare] === item.article ? (
                            <span className="text-emerald-400">✓ {item.noun}</span>
                          ) : (
                            <span className="text-rose-400">✗ ({item.noun})</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEx4aChecked(true);
                    markDone('ex4');
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check All 10 Furniture Articles (4a)
                </button>
              </div>

              {/* 4b: Interactive Artikeltanz Dance Floor */}
              <div className="bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 p-5 rounded-2xl border border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <Footprints className="w-4 h-4" /> 4b) Spiel & Spaß: Der interaktive Artikeltanz! (Track 1.24)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Listen to the furniture noun and step onto the matching dance-floor footprint (`🔵 der`, `🟢 das`, or `🔴 die`)!
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-slate-900 px-3 py-1 rounded-full text-teal-300 border border-slate-700">
                    Dance Score: {danceScore}
                  </span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{FURNITURE_LEXICON[danceCurrentIdx].icon}</span>
                    <div>
                      <div className="text-xs text-slate-400">Dance Prompt #{danceCurrentIdx + 1}:</div>
                      <div className="text-xl font-black text-white">
                        „... {FURNITURE_LEXICON[danceCurrentIdx].bare}!“
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {[
                      { art: 'der', label: '👣 🔵 Step Forward-Right (der)', color: 'bg-sky-500 hover:bg-sky-400 text-slate-950' },
                      { art: 'das', label: '👣 🟢 Step Back-Left (das)', color: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' },
                      { art: 'die', label: '👣 🔴 Step Side-Right (die)', color: 'bg-rose-500 hover:bg-rose-400 text-slate-950' }
                    ].map((step) => (
                      <button
                        key={step.art}
                        onClick={() => {
                          const cur = FURNITURE_LEXICON[danceCurrentIdx];
                          const right = step.art === cur.article;
                          speakGerman(cur.noun, speechRate);
                          if (right) {
                            setDanceScore((s) => s + 1);
                            setDanceFeedback(`💃 Bravo! ${cur.noun} (${cur.en})!`);
                            markDone('ex4b');
                          } else {
                            setDanceFeedback(`Oops! Step onto "${cur.article}": ${cur.noun}!`);
                          }
                          setTimeout(() => {
                            setDanceCurrentIdx((danceCurrentIdx + 1) % FURNITURE_LEXICON.length);
                          }, 900);
                        }}
                        className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs shadow cursor-pointer transition ${step.color}`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>
                {danceFeedback && (
                  <div className="text-xs font-bold text-amber-300 text-center">
                    {danceFeedback}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 3: EXERCISES 5 TO 9 (PAGE 27: BIG NUMBERS, PRICES, PRONOUNS, FRIDOLIN)
           ===================================================================== */}
        {activeTab === 'ex5to9' && (
          <div className="space-y-8">
            {/* EXERCISE 5: Zahlenschlange 100 - 1.000.000 (Page 27) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 27 • Übung 5 (Track 1.25 • Spiel & Spaß)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    5. Ergänzen Sie die Zahlenschlange (100 bis 1.000.000)
                  </h3>
                </div>
                {completed.ex5 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.25" speechRate={speechRate} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { num: '100', fixed: '(ein)hundert' },
                  { num: '200', key: 'n200', expected: 'zweihundert' },
                  { num: '300', key: 'n300', expected: 'dreihundert' },
                  { num: '351', fixed: 'dreihunderteinundfünfzig' },
                  { num: '651', key: 'n651', expected: 'sechshunderteinundfünfzig' },
                  { num: '1000', fixed: '(ein)tausend' },
                  { num: '10.000', fixed: 'zehntausend' },
                  { num: '100.000', key: 'n100k', expected: 'hunderttausend' },
                  { num: '897.000', fixed: 'achthundertsiebenundneunzigtausend' },
                  { num: '898.000', key: 'n898k', expected: 'achthundertachtundneunzigtausend' },
                  { num: '1.000.000', fixed: 'eine Million' }
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5"
                  >
                    <button
                      onClick={() =>
                        speakGerman(item.fixed || item.expected, speechRate)
                      }
                      className="font-black text-amber-400 text-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> {item.num}
                    </button>
                    {item.fixed ? (
                      <div className="font-mono text-slate-200 font-bold break-all">
                        {item.fixed}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={ex5Snake[item.key]}
                        onChange={(e) =>
                          setEx5Snake({ ...ex5Snake, [item.key]: e.target.value })
                        }
                        placeholder="Type German number word..."
                        className="w-full bg-slate-900 border border-amber-400/50 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setEx5Checked(true);
                    markDone('ex5');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Number Snake (Ex. 5)
                </button>
                <button
                  onClick={() => {
                    setEx5Snake({
                      n200: 'zweihundert',
                      n300: 'dreihundert',
                      n651: 'sechshunderteinundfünfzig',
                      n100k: 'hunderttausend',
                      n898k: 'achthundertachtundneunzigtausend'
                    });
                    markDone('ex5');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Auto-Fill Number Snake
                </button>
              </div>

              {/* Interactive Big Number Synthesizer */}
              <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  <strong className="text-teal-300 block">
                    Live Big-Number Speaker (1 to 1,000,000):
                  </strong>
                  <span>Type any furniture price to see its German word and hear it spoken:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    value={customBigNum}
                    onChange={(e) => setCustomBigNum(e.target.value)}
                    className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-black"
                  />
                  <button
                    onClick={() =>
                      speakGerman(`${bigNumberToGerman(customBigNum)} Euro`, speechRate)
                    }
                    className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> {bigNumberToGerman(customBigNum)} €
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 6 & 7 (Page 27) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exercise 6a & 6b */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 27 • Übung 6a & 6b (Tracks 1.26–1.28)
                  </span>
                  <h4 className="font-bold text-white text-base">
                    6. Wie viel kostet das? — Preis-Diktat
                  </h4>
                  <AudioTrackPlayer trackId="1.26-28" speechRate={speechRate} />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { key: 'p1', label: '1) Stuhl (€)', expected: '59,90' },
                      { key: 'p2', label: '2) Sofa (€)', expected: '499' },
                      { key: 'p3', label: '3) Karte (€)', expected: '0,85' }
                    ].map((p) => (
                      <div key={p.key} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 mb-1">{p.label}</div>
                        <input
                          type="text"
                          value={ex6aPrices[p.key]}
                          onChange={(e) =>
                            setEx6aPrices({ ...ex6aPrices, [p.key]: e.target.value })
                          }
                          placeholder={p.expected}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setEx6aPrices({ p1: '59,90', p2: '499', p3: '0,85' });
                      setEx6aChecked(true);
                      markDone('ex6');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    Verify & Fill Diktat Prices (6a)
                  </button>
                </div>

                {/* Exercise 7a & 7b */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 27 • Übung 7a & 7b (Personalpronomen er / es / sie)
                  </span>
                  <h4 className="font-bold text-white text-base">
                    7. Was kostet die Lampe? → Sie kommt aus Italien!
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-slate-200">
                      7a) Die Lampe kostet 119 Euro. → Was sagt der Verkäufer?
                    </div>
                    <div className="flex gap-2">
                      {['Er', 'Es', 'Sie'].map((pr) => (
                        <button
                          key={pr}
                          onClick={() => {
                            setEx7aLampChoice(pr);
                            if (pr === 'Sie') {
                              speakGerman('Die Lampe kostet 119 Euro. Sie kommt aus Italien.', speechRate);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold border cursor-pointer ${
                            ex7aLampChoice === pr
                              ? pr === 'Sie'
                                ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                                : 'bg-rose-600 text-white border-rose-400'
                              : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {ex7aLampChoice === pr ? '☒ ' : '☐ '} {pr} kommt aus Italien.
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grammar Table in 7a */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-sky-500/30">
                      <div className="font-bold text-sky-300">🔵 der Tisch</div>
                      <div className="font-black text-white mt-1">= er</div>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-emerald-500/30">
                      <div className="font-bold text-emerald-300">🟢 das Bett</div>
                      <select
                        value={ex7aTable.bett}
                        onChange={(e) =>
                          setEx7aTable({ ...ex7aTable, bett: e.target.value })
                        }
                        className="mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-emerald-300 font-bold"
                      >
                        <option value="">?</option>
                        <option value="es">es</option>
                        <option value="er">er</option>
                        <option value="sie">sie</option>
                      </select>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-rose-500/30">
                      <div className="font-bold text-rose-300">🔴 die Lampe</div>
                      <select
                        value={ex7aTable.lampe}
                        onChange={(e) =>
                          setEx7aTable({ ...ex7aTable, lampe: e.target.value })
                        }
                        className="mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-rose-300 font-bold"
                      >
                        <option value="">?</option>
                        <option value="sie">sie</option>
                        <option value="er">er</option>
                        <option value="es">es</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEx7aLampChoice('Sie');
                      setEx7aTable({ tisch: 'er', bett: 'es', lampe: 'sie' });
                      setEx7aChecked(true);
                      markDone('ex7');
                    }}
                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    Check Pronouns (7a)
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 8 & 9 (Page 27) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 27 • Übung 8a, 8b & 9 (Fridolins Möbel & Bewerten)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    8 & 9. Fridolins Möbel-Probleme („zu kurz, zu klein, zu teuer“)
                  </h3>
                </div>
                {completed.ex8_9 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    key: 'bett',
                    title: 'Das Bett ist ...',
                    cartoon: '🛏️🦶 (Fridolin’s feet hang over the edge!)',
                    options: ['zu lang', 'zu kurz'],
                    correct: 'zu kurz'
                  },
                  {
                    key: 'stuhl',
                    title: 'Der Stuhl ist ...',
                    cartoon: '🪑🦵 (Fridolin is squished on a tiny chair!)',
                    options: ['zu klein', 'zu groß'],
                    correct: 'zu klein'
                  },
                  {
                    key: 'lampe',
                    title: 'Die Lampe (990 €) ist ...',
                    cartoon: '💡😱 (990 € price tag shocks Fridolin!)',
                    options: ['zu billig', 'zu teuer'],
                    correct: 'zu teuer'
                  }
                ].map((c) => (
                  <div
                    key={c.key}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
                  >
                    <div className="text-xs text-amber-300 font-semibold">{c.cartoon}</div>
                    <div className="font-extrabold text-white text-sm">{c.title}</div>
                    <div className="flex gap-2">
                      {c.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setEx8aProblems({ ...ex8aProblems, [c.key]: opt });
                            speakGerman(`${c.title.replace('...', '')} ${opt}!`, speechRate);
                          }}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                            ex8aProblems[c.key] === opt
                              ? opt === c.correct
                                ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                                : 'bg-rose-600 text-white border-rose-400'
                              : 'bg-slate-900 border-slate-700 text-slate-300'
                          }`}
                        >
                          {ex8aProblems[c.key] === opt ? '☒ ' : '☐ '} {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 8b & 9 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-indigo-300">
                    8b) Wie finden Sie die Aufgabe?
                  </span>
                  {['zu leicht', 'okay', 'zu schwer'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setEx8bDifficulty(lvl);
                        speakGerman(`Ich finde die Aufgabe ${lvl}.`, speechRate);
                        markDone('ex8_9');
                      }}
                      className={`px-3 py-1 rounded-full font-bold border cursor-pointer ${
                        ex8bDifficulty === lvl
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEx8aProblems({
                      bett: 'zu kurz',
                      stuhl: 'zu klein',
                      lampe: 'zu teuer'
                    });
                    markDone('ex8_9');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Exercise 8 & 9
                </button>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 4: EXERCISES 10 & 11 + PAGE 28 OFFICIAL GRAMMAR SUMMARY
           ===================================================================== */}
        {activeTab === 'ex10to11' && (
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase">
                    Seite 28 • Sprechtraining Übung 10 & 11 (Track 1.29)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    10 & 11. Ergänzen Sie „bitte“ oder „danke“ & Übersetzung
                  </h3>
                </div>
                {completed.ex10_11 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.29" speechRate={speechRate} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'A',
                    scene: 'A: Im Geschäft (Offering Help)',
                    line: '● Brauchen Sie Hilfe? – ▲ Ja, ___ .',
                    ans: 'bitte',
                    en: '"Yes, please." (Accepting an offer politely)'
                  },
                  {
                    id: 'B',
                    scene: 'B: Beim Kaffee (Declining Politely)',
                    line: '● Kaffee? – ▲ Nein, ___ .',
                    ans: 'danke',
                    en: '"No, thank you." (Refusing an offer politely)'
                  },
                  {
                    id: 'C',
                    scene: 'C: An der Kasse (Cashier Request)',
                    line: '● Das macht dann 9 Euro 95, ___ .',
                    ans: 'bitte',
                    en: '"That will be €9.95, please."'
                  },
                  {
                    id: 'D',
                    scene: 'D: Nicht verstanden (Asking to Repeat)',
                    line: '● Wie ___ ?',
                    ans: 'bitte',
                    en: '"Pardon? / Excuse me?"'
                  },
                  {
                    id: 'E',
                    scene: 'E: Geschenk überreichen (Replying to Thanks)',
                    line: '● Vielen Dank! – ▲ ___ !',
                    ans: 'Bitte',
                    en: '"Thank you very much! – You’re welcome!"'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5"
                  >
                    <div className="text-xs font-bold text-amber-300">{item.scene}</div>
                    <div className="text-sm font-bold text-white">{item.line}</div>
                    <div className="flex gap-2">
                      {['bitte', 'danke'].map((word) => (
                        <button
                          key={word}
                          onClick={() => {
                            setEx10Gaps({ ...ex10Gaps, [item.id]: word });
                            speakGerman(item.line.replace('___', word), speechRate);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            ex10Gaps[item.id]?.toLowerCase() === word
                              ? 'bg-teal-400 text-slate-950 border-teal-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong>Ex. 11 Meaning:</strong> {item.en}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setEx10Gaps({ A: 'bitte', B: 'danke', C: 'bitte', D: 'bitte', E: 'Bitte' });
                  setEx10Checked(true);
                  markDone('ex10_11');
                }}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Check & Fill All „bitte / danke“ Dialogues (10 & 11)
              </button>
            </section>

            {/* PAGE 28 OFFICIAL GRAMMAR & COMMUNICATION REFERENCE */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-amber-400 uppercase border-b border-slate-800 pb-2">
                  GRAMMATIK (Seite 28)
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm">
                  <div className="font-bold text-white mb-2">
                    definiter Artikel (der/das/die) & Personalpronomen (er/es/sie)
                  </div>
                  <div
                    onClick={() => speakGerman('Maskulin: Der Tisch ist schön. Er kostet 1478 Euro.', speechRate)}
                    className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/30 cursor-pointer flex justify-between"
                  >
                    <span>🔵 <strong>maskulin:</strong> <strong>Der</strong> Tisch ist schön.</span>
                    <span className="text-sky-300 font-bold">→ Er kostet ...</span>
                  </div>
                  <div
                    onClick={() => speakGerman('Neutral: Das Bett ist schön. Es kostet 890 Euro.', speechRate)}
                    className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 cursor-pointer flex justify-between"
                  >
                    <span>🟢 <strong>neutral:</strong> <strong>Das</strong> Bett ist schön.</span>
                    <span className="text-emerald-300 font-bold">→ Es kostet ...</span>
                  </div>
                  <div
                    onClick={() => speakGerman('Feminin: Die Lampe ist schön. Sie kostet 119 Euro.', speechRate)}
                    className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 cursor-pointer flex justify-between"
                  >
                    <span>🔴 <strong>feminin:</strong> <strong>Die</strong> Lampe ist schön.</span>
                    <span className="text-rose-300 font-bold">→ Sie kostet ...</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-teal-400 uppercase border-b border-slate-800 pb-2">
                  KOMMUNIKATION (Seite 28)
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {[
                    'Brauchen Sie Hilfe? – Ja, bitte.',
                    'Wie viel / Was kostet (denn) die Lampe?',
                    'Die Lampe kostet (nur) 119 Euro. Das ist ein Sonderangebot.',
                    'Das ist (sehr / zu / aber) teuer / günstig / billig.',
                    'Ich finde die Lampe (wirklich) sehr schön.',
                    'Das finde ich auch. / Das finde ich nicht.'
                  ].map((line, idx) => (
                    <div
                      key={idx}
                      onClick={() => speakGerman(line, speechRate)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-slate-100 font-medium">{line}</span>
                      <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 5: BONUS MEMORY-LOCK ARENA
           ===================================================================== */}
        {activeTab === 'bonus' && (
          <div className="space-y-8">
            <section className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Bonus Reflex Drill: Replace the Furniture Noun with <em>er, es,</em> or <em>sie</em>!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { q: 'Wie viel kostet der Schrank? – ___ kostet 650 Euro.', ans: 'Er', why: 'der Schrank (M) → er' },
                  { q: 'Wie findest du das Sofa? – ___ ist sehr bequem!', ans: 'Es', why: 'das Sofa (N) → es' },
                  { q: 'Woher kommt die Lampe? – ___ kommt aus Italien.', ans: 'Sie', why: 'die Lampe (F) → sie' },
                  { q: 'Ist der Teppich teuer? – Nein, ___ ist günstig.', ans: 'er', why: 'der Teppich (M) → er' },
                  { q: 'Ist das Bild modern? – Ja, ___ ist sehr modern.', ans: 'es', why: 'das Bild (N) → es' },
                  { q: 'Was kostet die Couch? – ___ kostet 999 Euro.', ans: 'Sie', why: 'die Couch (F) → sie' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
                  >
                    <div className="text-xs sm:text-sm font-bold text-white">{item.q}</div>
                    <div className="flex gap-2">
                      {['Er', 'Es', 'Sie'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setPronounQuizAnswers({ ...pronounQuizAnswers, [i]: opt });
                            speakGerman(item.q.replace('___', opt), speechRate);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            pronounQuizAnswers[i]?.toLowerCase() === opt.toLowerCase()
                              ? 'bg-teal-400 text-slate-950 border-teal-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {pronounQuizChecked && (
                      <div className="text-xs font-bold text-emerald-400">
                        ✓ {item.ans} ({item.why})
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setPronounQuizChecked(true);
                  markDone('bonus');
                }}
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Check Pronoun Reflex Answers
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
