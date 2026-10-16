import React, { useState, useEffect, useRef } from 'react';

import {

  Volume2,

  CheckCircle2,

  XCircle,

  Sparkles,

  BookOpen,

  Brain,

  Award,

  Play,

  RotateCcw,

  HelpCircle,

  Users,

  Globe,

  Music,

  MessageSquare,

  GraduationCap,

  ChevronRight,

  ChevronLeft,

  Star,

  Lightbulb,

  Mic,

  ArrowRight,

  ShieldCheck,

  Smile,

  Meh,

  Frown,

  Compass,

  Layers

} from 'lucide-react';



// Helper for German Text-to-Speech using browser's Web Speech API

const speakGerman = (text, pitch = 1, rate = 0.92) => {

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'de-DE';

    utterance.pitch = pitch;

    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();

    const deVoice = voices.find((v) => v.lang.startsWith('de'));

    if (deVoice) utterance.voice = deVoice;

    window.speechSynthesis.speak(utterance);

  } catch (e) {

    console.error('Speech synthesis error:', e);

  }

};



// Web Audio API Synthesizer for Exercise 4 ("Woher kommt die Musik?")

const playCulturalMelody = (style) => {

  if (typeof window === 'undefined') return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) return;

  const ctx = new AudioCtx();

  const now = ctx.currentTime;



  const melodies = {

    Österreich: {

      // Viennese Waltz (3/4 oom-pah-pah feel)

      notes: [261.63, 329.63, 392.0, 523.25, 659.25, 587.33, 523.25],

      durations: [0.28, 0.2, 0.2, 0.35, 0.25, 0.25, 0.45],

      type: 'triangle'

    },

    Spanien: {

      // Phrygian Flamenco cadence (A - G - F - E)

      notes: [440.0, 415.3, 392.0, 349.23, 329.63, 349.23, 329.63],

      durations: [0.22, 0.15, 0.22, 0.25, 0.3, 0.18, 0.45],

      type: 'sawtooth'

    },

    Frankreich: {

      // Parisian Musette Accordion waltz

      notes: [329.63, 392.0, 493.88, 523.25, 493.88, 440.0, 392.0],

      durations: [0.25, 0.25, 0.25, 0.35, 0.2, 0.2, 0.45],

      type: 'square'

    },

    Türkei: {

      // Hijaz scale motif

      notes: [293.66, 311.13, 369.99, 392.0, 440.0, 369.99, 293.66],

      durations: [0.22, 0.22, 0.28, 0.22, 0.25, 0.25, 0.45],

      type: 'sawtooth'

    },

    Iran: {

      // Persian Dastgah lyrical ornament motif

      notes: [329.63, 349.23, 440.0, 392.0, 349.23, 329.63, 293.66],

      durations: [0.28, 0.22, 0.3, 0.22, 0.22, 0.25, 0.45],

      type: 'sine'

    }

  };



  const track = melodies[style] || melodies.Österreich;

  let offset = 0;

  track.notes.forEach((freq, idx) => {

    const osc = ctx.createOscillator();

    const gain = ctx.createGain();

    osc.type = track.type;

    osc.frequency.setValueAtTime(freq, now + offset);



    gain.gain.setValueAtTime(0.001, now + offset);

    gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.04);

    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + track.durations[idx]);



    osc.connect(gain);

    gain.connect(ctx.destination);

    osc.start(now + offset);

    osc.stop(now + offset + track.durations[idx] + 0.02);

    offset += track.durations[idx];

  });

};



const BILDLEXIKON_ITEMS = [

  { de: 'Hallo', en: 'Hello / Hi (informal)', time: 'Anytime', category: 'Begrüßung', emoji: '👋', tip: 'Used with friends, family, and peers (du).' },

  { de: 'Guten Morgen', en: 'Good morning', time: 'Until ~11:00 AM', category: 'Begrüßung', emoji: '🌅', tip: 'Used from waking up until late morning.' },

  { de: 'Guten Tag', en: 'Good day / Hello (formal)', time: '11:00 AM – 6:00 PM', category: 'Begrüßung', emoji: '☀️', tip: 'Standard polite daytime greeting.' },

  { de: 'Guten Abend', en: 'Good evening', time: 'From ~6:00 PM', category: 'Begrüßung', emoji: '🌆', tip: 'CRITICAL: Used when ARRIVING or meeting someone in the evening!' },

  { de: 'Gute Nacht', en: 'Good night', time: 'Bedtime', category: 'Abschied', emoji: '🌙', tip: 'MEMORY HOOK: Unlike English, "Gute Nacht" is ONLY a farewell when going to sleep!' },

  { de: 'Tschüs', en: 'Bye (informal)', time: 'Anytime leaving', category: 'Abschied', emoji: '✌️', tip: 'Friendly goodbye, pairs with "Hallo" and "du".' },

  { de: 'Auf Wiedersehen', en: 'Goodbye (formal)', time: 'Anytime leaving', category: 'Abschied', emoji: '🎩', tip: 'Literally "Until we see each other again!" Pairs with "Guten Tag" and "Sie".' }

];



const ALPHABET_DATA = [

  { letter: 'A, a', sound: '[A]', speak: 'A', example: 'Anna', trap: false },

  { letter: 'B, b', sound: '[Be]', speak: 'Be', example: 'Berlin', trap: false },

  { letter: 'C, c', sound: '[Ce]', speak: 'Ce', example: 'Café', trap: true, note: 'Pronounced "Tseh"!' },

  { letter: 'D, d', sound: '[De]', speak: 'De', example: 'Deutschland', trap: false },

  { letter: 'E, e', sound: '[E]', speak: 'E', example: 'Emil', trap: true, note: 'Sounds like English long "A" (eh)!' },

  { letter: 'F, f', sound: '[Ef]', speak: 'Ef', example: 'Frankreich', trap: false },

  { letter: 'G, g', sound: '[Ge]', speak: 'Ge', example: 'Guten Tag', trap: false },

  { letter: 'H, h', sound: '[Ha]', speak: 'Ha', example: 'Hallo', trap: true, note: 'Breathe out: "Hah"!' },

  { letter: 'I, i', sound: '[I]', speak: 'I', example: 'Ich', trap: true, note: 'Sounds like English "EE"!' },

  { letter: 'J, j', sound: '[Jot]', speak: 'Jot', example: 'Julia (Yulia)', trap: true, note: 'TRAP! Called "Jot", sounds like English "Y"!' },

  { letter: 'K, k', sound: '[Ka]', speak: 'Ka', example: 'Kaffee', trap: false },

  { letter: 'L, l', sound: '[El]', speak: 'El', example: 'Land', trap: false },

  { letter: 'M, m', sound: '[Em]', speak: 'Em', example: 'Mexiko', trap: false },

  { letter: 'N, n', sound: '[En]', speak: 'En', example: 'Nicole', trap: false },

  { letter: 'O, o', sound: '[O]', speak: 'O', example: 'Oma', trap: false },

  { letter: 'P, p', sound: '[Pe]', speak: 'Pe', example: 'Paco', trap: false },

  { letter: 'Q, q', sound: '[Qu]', speak: 'Qu', example: 'Quiz', trap: true, note: 'Pronounced "Koo"!' },

  { letter: 'R, r', sound: '[Er]', speak: 'Er', example: 'Rodriguez', trap: false },

  { letter: 'S, s', sound: '[Es]', speak: 'Es', example: 'Spanien', trap: false },

  { letter: 'T, t', sound: '[Te]', speak: 'Te', example: 'Tag', trap: false },

  { letter: 'U, u', sound: '[U]', speak: 'U', example: 'Und', trap: false },

  { letter: 'V, v', sound: '[Vau]', speak: 'Vau', example: 'Valerie / Vater', trap: true, note: 'TRAP! Called "Fau" [Vau]!' },

  { letter: 'W, w', sound: '[We]', speak: 'We', example: 'Winfried', trap: true, note: 'TRAP! Called "Veh" [We], sounds like English V!' },

  { letter: 'X, x', sound: '[Ix]', speak: 'Ix', example: 'Xylofon', trap: false },

  { letter: 'Y, y', sound: '[Ypsilon]', speak: 'Ypsilon', example: 'Yoga', trap: true, note: 'Called "Ypsilon"!' },

  { letter: 'Z, z', sound: '[Zet]', speak: 'Zet', example: 'Zehn (ts-ehn)', trap: true, note: 'TRAP! Called "Tsett", always sounds like sharp "TS"!' },

  { letter: 'Ä, ä', sound: '[A-Umlaut]', speak: 'Ä', example: 'Ärztin', trap: true, note: 'Say "A" like in "air" / "bet"!' },

  { letter: 'Ö, ö', sound: '[O-Umlaut]', speak: 'Ö', example: 'Österreich', trap: true, note: 'Shape lips for "O", but say "E"!' },

  { letter: 'Ü, ü', sound: '[U-Umlaut]', speak: 'Ü', example: 'Türkei / Tschüs', trap: true, note: 'Whistle lips for "OO", but say "EE"!' },

  { letter: 'ß', sound: '[Es-Zett]', speak: 'Eszett', example: 'heißen', trap: true, note: 'Sharp double-S ("ss"). That is why "du heißt" doesn’t add another s!' }

];



const AUDIO_SCRIPTS = {

  '1.02': {

    title: 'Track 1.02 – Das Namen-Lied (Ex. 1a)',

    lines: [

      { speaker: 'Chor', text: 'Hallo! Hallo! Ich bin Nicole. Und wer bist du?' },

      { speaker: 'Winfried', text: 'Hallo! Ich heiße Winfried. Und wer bist du?' },

      { speaker: 'Sofia', text: 'Ich bin Sofia! Und das sind Johnny und Julia!' }

    ]

  },

  '1.03': {

    title: 'Track 1.03 – Paco & Nicole lernen sich kennen (Ex. 2a)',

    lines: [

      { speaker: 'Paco', text: 'Hallo! Ich heiße Paco. Und wer bist du?' },

      { speaker: 'Nicole', text: 'Hallo! Ich bin Nicole.' }

    ]

  },

  '1.04': {

    title: 'Track 1.04 – Woher kommst du? (Ex. 3a)',

    lines: [

      { speaker: 'Nicole', text: 'Woher kommst du, Paco? Aus Spanien?' },

      { speaker: 'Paco', text: 'Nein, ich komme aus Mexiko.' },

      { speaker: 'Paco', text: 'Du kommst aus Deutschland, hm? Aus der Schweiz?' },

      { speaker: 'Nicole', text: 'Nein, ich komme aus Österreich.' }

    ]

  },

  '1.06': {

    title: 'Track 1.06 / 1.07 / 1.08 – Frau Wachter kommt dazu (Ex. 5, 6c, 7)',

    lines: [

      { speaker: 'Paco', text: 'Hallo, Nicole! Wie geht’s?' },

      { speaker: 'Nicole', text: 'Gut, danke! Und wie geht es dir?' },

      { speaker: 'Paco', text: 'Sehr gut, danke!' },

      { speaker: 'Nicole', text: 'Ach, guten Tag, Frau Wachter! Wie geht’s Ihnen?' },

      { speaker: 'Frau Wachter', text: 'Auch gut, danke. Und wer ist das?' },

      { speaker: 'Nicole', text: 'Das ist Paco. Und das ist Frau Wachter.' },

      { speaker: 'Paco', text: 'Guten Tag, Frau Wachter!' },

      { speaker: 'Frau Wachter', text: 'Guten Tag, Herr ...?' },

      { speaker: 'Paco', text: 'Rodriguez. Paco Rodriguez.' },

      { speaker: 'Frau Wachter', text: 'Guten Tag, Herr Rodriguez. „Rodriguez“ ... hm ... Woher kommen Sie?' },

      { speaker: 'Nicole', text: 'Er kommt aus Mexiko.' },

      { speaker: 'Frau Wachter', text: 'Ah! Aus Mexiko!' },

      { speaker: 'Paco', text: 'Ja.' },

      { speaker: 'Frau Wachter', text: 'Auf Wiedersehen, Herr Rodriguez! Tschüs, Nicole!' }

    ]

  }

};



const AudioTrackPlayer = ({ trackId }) => {

  const [playingIdx, setPlayingIdx] = useState(null);

  const [showScript, setShowScript] = useState(false);

  const track = AUDIO_SCRIPTS[trackId];



  const playFullTrack = () => {

    if (!track) return;

    setPlayingIdx(0);

    const fullText = track.lines.map((l) => l.text).join(' ... ');

    speakGerman(fullText, 1.0, 0.9);

    setTimeout(() => setPlayingIdx(null), track.lines.length * 2200);

  };



  if (!track) return null;



  return (

    <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-4 mb-4">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <button

            onClick={playFullTrack}

            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"

          >

            <Volume2 className="w-4 h-4" />

            <span>Play Audio {trackId}</span>

          </button>

          <span className="text-sm font-medium text-indigo-200">{track.title}</span>

        </div>

        <button

          onClick={() => setShowScript(!showScript)}

          className="text-xs text-indigo-300 hover:text-white underline cursor-pointer"

        >

          {showScript ? 'Hide Audio Transcript' : 'Show Audio Transcript & Individual Lines'}

        </button>

      </div>



      {showScript && (

        <div className="mt-3 pt-3 border-t border-indigo-800/60 space-y-2">

          {track.lines.map((line, i) => (

            <div

              key={i}

              onClick={() => speakGerman(line.text, line.speaker === 'Paco' ? 0.85 : 1.15, 0.92)}

              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${

                playingIdx === i ? 'bg-indigo-800/60' : 'bg-slate-900/60 hover:bg-slate-800/80'

              }`}

            >

              <div className="text-sm">

                <span className="font-bold text-amber-400 mr-2">{line.speaker}:</span>

                <span className="text-slate-100">{line.text}</span>

              </div>

              <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />

            </div>

          ))}

        </div>

      )}

    </div>

  );

};



export default function Chapter1Masterclass() {

  const [activeTab, setActiveTab] = useState('learn');

  const [completedExercises, setCompletedExercises] = useState({});



  const markComplete = (exKey) => {

    setCompletedExercises((prev) => ({ ...prev, [exKey]: true }));

  };



  // --- EXERCISE STATES (1 to 10) ---

  // Ex 1a & 1b state

  const [ex1SongAnswer, setEx1SongAnswer] = useState('');

  const [ex1NamesInput, setEx1NamesInput] = useState(['Sofia', 'Johnny', 'Julia', 'Nicole', 'Paco', 'Winfried']);

  const [newGermanName, setNewGermanName] = useState('');

  const [chainUserName, setChainUserName] = useState('');

  const [chainStep, setChainStep] = useState(0);



  // Ex 2a state (Page 9)

  const [ex2aHeisse, setEx2aHeisse] = useState(null); // 'Winfried' | 'Paco'

  const [ex2aBin, setEx2aBin] = useState(null); // 'Nicole' | 'Winfried'

  const [ex2aChecked, setEx2aChecked] = useState(false);



  // Ex 2c state (Seating Plan Memory Game - Page 9)

  const [deskGuesses, setDeskGuesses] = useState({ desk1: '', desk2: '', desk3: '', desk4: '', desk5: '' });

  const [deskChecked, setDeskChecked] = useState(false);



  // Ex 3a state (Page 10)

  const ex3aItems = [

    { id: 1, text: 'Woher kommst du? Aus Spanien?', answer: 'NICOLE' },

    { id: 2, text: 'Nein, ich komme aus Mexiko.', answer: 'PACO' },

    { id: 3, text: 'Du kommst aus Deutschland, hm?', answer: 'PACO' },

    { id: 4, text: 'Aus der Schweiz?', answer: 'PACO' },

    { id: 5, text: 'Ich komme aus Österreich.', answer: 'NICOLE' }

  ];

  const [ex3aSelections, setEx3aSelections] = useState({});

  const [ex3aChecked, setEx3aChecked] = useState(false);



  // Ex 3b state (Page 10)

  const [ex3bGap1, setEx3bGap1] = useState('');

  const [ex3bGap2, setEx3bGap2] = useState('');

  const [ex3bChecked, setEx3bChecked] = useState(false);



  // Ex 3c state (Interactive Origin Roleplay)

  const [ex3cCountry, setEx3cCountry] = useState('Indien');



  // Ex 4 state (Woher kommt die Musik? - Page 10)

  const ex4Countries = [

    { country: 'Iran', correctTrack: '4', clue: 'Persian traditional lyrical melody (aus dem Iran)' },

    { country: 'Österreich', correctTrack: '1', clue: 'Viennese Waltz in 3/4 time (Walzer aus Wien)' },

    { country: 'Spanien', correctTrack: '2', clue: 'Flamenco guitar cadence' },

    { country: 'Frankreich', correctTrack: '5', clue: 'Parisian musette accordion waltz' },

    { country: 'Türkei', correctTrack: '3', clue: 'Anatolian Hijaz rhythm (aus der Türkei)' }

  ];

  const [ex4Answers, setEx4Answers] = useState({ Österreich: '1', Iran: '', Spanien: '', Frankreich: '', Türkei: '' });

  const [ex4Checked, setEx4Checked] = useState(false);



  // Ex 5 state (Wer sagt was? - Page 10)

  const ex5Rows = [

    { key: 'a', text: 'a) Wie geht’s?', correct: 'PACO' },

    { key: 'b', text: 'b) Gut, danke!', correct: 'NICOLE' },

    { key: 'c', text: 'c) Und wie geht’s Ihnen?', correct: 'NICOLE' },

    { key: 'd', text: 'd) Auch gut.', correct: 'FRAU WACHTER' },

    { key: 'e', text: 'e) Das ist Paco.', correct: 'NICOLE' },

    { key: 'f', text: 'f) Guten Tag, Frau Wachter!', correct: 'PACO' },

    { key: 'g', text: 'g) Woher kommen Sie?', correct: 'FRAU WACHTER' },

    { key: 'h', text: 'h) Er kommt aus Mexiko.', correct: 'NICOLE' },

    { key: 'i', text: 'i) Auf Wiedersehen, Herr Rodriguez!', correct: 'FRAU WACHTER' }

  ];

  const [ex5Selections, setEx5Selections] = useState({ a: 'PACO' });

  const [ex5Checked, setEx5Checked] = useState(false);



  // Ex 6a state (Page 11)

  const [ex6aWord1, setEx6aWord1] = useState('');

  const [ex6aWord2, setEx6aWord2] = useState('');

  const [ex6aChecked, setEx6aChecked] = useState(false);



  // Ex 6b state (du oder Sie roleplay - Page 11)

  const ex6bScenarios = [

    { id: 1, person: 'Herr Rodriguez (at the office)', correctForm: 'Sie', question: 'Woher kommen Sie, Herr Rodriguez?' },

    { id: 2, person: 'Nicole (university student at a café)', correctForm: 'du', question: 'Woher kommst du, Nicole?' },

    { id: 3, person: 'Frau Wachter (elderly neighbor)', correctForm: 'Sie', question: 'Wie heißen Sie? / Wie geht es Ihnen?' },

    { id: 4, person: 'Johnny (classmate in German course)', correctForm: 'du', question: 'Wie heißt du, Johnny?' }

  ];

  const [ex6bChoices, setEx6bChoices] = useState({});

  const [ex6bChecked, setEx6bChecked] = useState(false);



  // Ex 6c state (Fill in blanks with Word Bank - Page 11)

  // Word bank: Aus | das | Er | Guten | ist | kommt | Tag

  const [ex6cGaps, setEx6cGaps] = useState({

    g1: 'ist', // pre-filled in textbook

    g2: '', // das

    g3: '', // Guten

    g4: '', // Tag

    g5: '', // Er

    g6: '', // kommt

    g7: ''  // Aus

  });

  const [ex6cChecked, setEx6cChecked] = useState(false);



  // Ex 6d state (Bekannte Persönlichkeiten - Page 11)

  const famousPeople = [

    { name: 'Albert Einstein', pronoun: 'Er', verb: 'kommt', prep: 'aus', country: 'Deutschland', role: 'Physicist' },

    { name: 'Frida Kahlo', pronoun: 'Sie', verb: 'kommt', prep: 'aus', country: 'Mexiko', role: 'Artist' },

    { name: 'Roger Federer', pronoun: 'Er', verb: 'kommt', prep: 'aus der', country: 'Schweiz', role: 'Tennis Legend' },

    { name: 'Wolfgang Amadeus Mozart', pronoun: 'Er', verb: 'kommt', prep: 'aus', country: 'Österreich', role: 'Composer' }

  ];

  const [ex6dIndex, setEx6dIndex] = useState(0);

  const [ex6dPronoun, setEx6dPronoun] = useState('');

  const [ex6dPrep, setEx6dPrep] = useState('');

  const [ex6dFeedback, setEx6dFeedback] = useState(null);



  // Ex 7 & 8 state (Page 11)

  const ex7Items = [

    { phrase: 'Wie geht’s?', speaker: 'NICOLE', note: 'Works for both du & Sie!' },

    { phrase: 'Wie geht es Ihnen?', speaker: 'NICOLE', note: 'Formal (to Frau Wachter)' },

    { phrase: 'Gut, danke.', speaker: 'NICOLE', note: 'Positive response 😀' },

    { phrase: 'Auch gut.', speaker: 'FRAU WACHTER', note: 'Also good! 😀' }

  ];

  const [ex7Selections, setEx7Selections] = useState({});

  const [ex7Checked, setEx7Checked] = useState(false);

  const [ex8Mood, setEx8Mood] = useState('Sehr gut, danke!');



  // Ex 9a & 9b state (Alphabet & Diktat - Page 12)

  const [spellerName, setSpellerName] = useState('Valerie Wulf');

  const diktatWords = [

    { word: 'NICOLE', spelled: 'N - i - c - o - l - e', audio: 'N, i, c, o, l, e' },

    { word: 'WACHTER', spelled: 'W - a - c - h - t - e - r', audio: 'W, a, c, h, t, e, r' },

    { word: 'SCHWEIZ', spelled: 'S - c - h - w - e - i - z', audio: 'S, c, h, w, e, i, z' },

    { word: 'ÖSTERREICH', spelled: 'Ö - s - t - e - r - r - e - i - c - h', audio: 'Ö, s, t, e, r, r, e, i, c, h' }

  ];

  const [diktatIdx, setDiktatIdx] = useState(0);

  const [diktatInput, setDiktatInput] = useState('');

  const [diktatResult, setDiktatResult] = useState(null);



  // Ex 10 state (Hallo oder tschüs? - Page 12)

  // Greeting vs Farewell sorting

  const ex10Phrases = [

    { phrase: 'Hallo', correct: 'Begrüßung' },

    { phrase: 'Guten Tag', correct: 'Begrüßung' },

    { phrase: 'Guten Morgen', correct: 'Begrüßung' },

    { phrase: 'Guten Abend', correct: 'Begrüßung' },

    { phrase: 'Gute Nacht', correct: 'Abschied' },

    { phrase: 'Tschüs', correct: 'Abschied' },

    { phrase: 'Auf Wiedersehen', correct: 'Abschied' }

  ];

  const [ex10Sorting, setEx10Sorting] = useState({

    Hallo: 'Begrüßung',

    'Gute Nacht': 'Abschied'

  });

  const [ex10Checked, setEx10Checked] = useState(false);



  // --- BONUS MEMORY ARENA STATES ---

  // Bonus 1: Verb Conjugation Speed Drill

  const bonusConjugationQuestions = [

    { pronoun: 'ich', verb: 'heißen', answer: 'heiße', sentence: 'Ich ___ Nicole.' },

    { pronoun: 'du', verb: 'heißen', answer: 'heißt', sentence: 'Wie ___ du?' },

    { pronoun: 'Sie', verb: 'kommen', answer: 'kommen', sentence: 'Woher ___ Sie, Herr Rodriguez?' },

    { pronoun: 'er', verb: 'kommen', answer: 'kommt', sentence: 'Das ist Paco. Er ___ aus Mexiko.' },

    { pronoun: 'du', verb: 'sein', answer: 'bist', sentence: 'Und wer ___ du?' },

    { pronoun: 'ich', verb: 'sein', answer: 'bin', sentence: 'Hallo! Ich ___ Paco.' },

    { pronoun: 'er/sie', verb: 'sein', answer: 'ist', sentence: 'Wer ___ das? Das ist Frau Wachter.' },

    { pronoun: 'Sie', verb: 'sein', answer: 'sind', sentence: 'Wer ___ Sie?' },

    { pronoun: 'du', verb: 'kommen', answer: 'kommst', sentence: 'Woher ___ du?' },

    { pronoun: 'sie (she)', verb: 'heißen', answer: 'heißt', sentence: 'Sie ___ Valerie Wulf.' }

  ];

  const [bonusConjIdx, setBonusConjIdx] = useState(0);

  const [bonusConjInput, setBonusConjInput] = useState('');

  const [bonusConjScore, setBonusConjScore] = useState(0);

  const [bonusConjFeedback, setBonusConjFeedback] = useState(null);



  // Bonus 2: Position 2 Sentence Builder

  const sentencePuzzles = [

    {

      english: 'Where do you come from? (informal)',

      words: ['du', 'kommst', 'Woher', '?'],

      correct: 'Woher kommst du ?'

    },

    {

      english: 'Where do you come from? (formal)',

      words: ['Sie', 'Woher', 'kommen', '?'],

      correct: 'Woher kommen Sie ?'

    },

    {

      english: 'My name is Valerie.',

      words: ['ist', 'Mein Name', 'Valerie', '.'],

      correct: 'Mein Name ist Valerie .'

    },

    {

      english: 'He comes from Mexico.',

      words: ['aus Mexiko', 'kommt', 'Er', '.'],

      correct: 'Er kommt aus Mexiko .'

    },

    {

      english: 'I come from Switzerland.',

      words: ['aus der Schweiz', 'Ich', 'komme', '.'],

      correct: 'Ich komme aus der Schweiz .'

    }

  ];

  const [puzzleIdx, setPuzzleIdx] = useState(0);

  const [builtWords, setBuiltWords] = useState([]);

  const [puzzleFeedback, setPuzzleFeedback] = useState(null);



  // Bonus 3: Country Preposition Trap Quiz (aus / aus der / aus dem)

  const countryQuiz = [

    { country: 'Mexiko', answer: 'aus', note: 'Neutral countries (90% of countries) take pure "aus"!' },

    { country: 'Schweiz', answer: 'aus der', note: 'Die Schweiz (feminine) -> changes to "aus der Schweiz"!' },

    { country: 'Türkei', answer: 'aus der', note: 'Die Türkei (feminine, ends in -ei) -> changes to "aus der Türkei"!' },

    { country: 'Iran', answer: 'aus dem', note: 'Der Iran (masculine) -> changes to "aus dem Iran"!' },

    { country: 'Österreich', answer: 'aus', note: 'Neutral country -> "Ich komme aus Österreich."' },

    { country: 'Deutschland', answer: 'aus', note: 'Neutral country -> "Du kommst aus Deutschland."' }

  ];

  const [countrySelections, setCountrySelections] = useState({});

  const [countryChecked, setCountryChecked] = useState(false);



  const totalExercisesCount = 18;

  const completedCount = Object.keys(completedExercises).length;

  const progressPercent = Math.min(100, Math.round((completedCount / totalExercisesCount) * 100));



  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">

      {/* Top Hero Banner */}

      <header className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/30 sticky top-0 z-30 backdrop-blur-md">

        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Back to German Roadmap"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Roadmap</span>
            </a>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">

              A1

            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">

                  Menschen A1 • Lektion 1 (Pages 9–12)

                </span>

                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">

                  <Volume2 className="w-3.5 h-3.5" /> Live Audio Enabled

                </span>

              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">

                Hallo! Ich bin Nicole — Complete Interactive Masterclass

              </h1>

            </div>

          </div>



          {/* Mastery Progress Bar */}

          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 min-w-[240px]">

            <div className="flex justify-between text-xs font-semibold mb-1.5">

              <span className="text-slate-300 flex items-center gap-1">

                <Award className="w-4 h-4 text-amber-400" /> Chapter Mastery

              </span>

              <span className="text-amber-400">

                {completedCount} / {totalExercisesCount} Completed ({progressPercent}%)

              </span>

            </div>

            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">

              <div

                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 transition-all duration-500"

                style={{ width: `${progressPercent}%` }}

              />

            </div>

          </div>

        </div>



        {/* Navigation Tabs */}

        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-2 pb-3">

          {[

            { id: 'learn', label: '1. Deep Lesson & Memory Hooks', icon: Brain },

            { id: 'ex1to5', label: '2. Exercises 1–5 (Pages 9–10)', icon: BookOpen },

            { id: 'ex6to10', label: '3. Exercises 6–10 (Pages 11–12)', icon: GraduationCap },

            { id: 'bonus', label: '4. Bonus Memory-Lock Arena (+Drills)', icon: Sparkles },

            { id: 'summary', label: '5. Page 12 Grammar & Cheat Sheet', icon: Layers }

          ].map((tab) => {

            const Icon = tab.icon;

            const active = activeTab === tab.id;

            return (

              <button

                key={tab.id}

                onClick={() => setActiveTab(tab.id)}

                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer ${

                  active

                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'

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



      {/* Main Content Container */}

      <main className="max-w-6xl mx-auto px-4 mt-8">

        {}

        {activeTab === 'learn' && (

          <div className="space-y-8">

            {/* Chapter Story Overview */}

            <section className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">

              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">

                <div>

                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">

                    The Story of Chapter 1

                  </span>

                  <h2 className="text-2xl font-bold text-white mt-1">

                    Meet Nicole, Paco & Frau Wachter

                  </h2>

                </div>

                <button

                  onClick={() =>

                    speakGerman(

                      'Hallo! Ich bin Nicole. Ich komme aus Österreich. Und das ist Paco Rodriguez. Er kommt aus Mexiko. Guten Tag, Frau Wachter!'

                    )

                  }

                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow cursor-pointer"

                >

                  <Volume2 className="w-4 h-4" /> Hear Story Summary

                </button>

              </div>

              <p className="text-slate-300 leading-relaxed mb-6">

                This chapter follows a real-life conversation at a sunny street café. First, two young people meet informally using{' '}

                <span className="text-amber-300 font-bold">du</span> (informal "you"):

                <strong> Paco Rodriguez</strong> (from Mexico) and <strong>Nicole</strong> (from Austria). Then, an older lady whom Nicole knows—<strong>Frau Wachter</strong>—walks by the café table. Immediately, the language shifts to polite, formal German using{' '}

                <span className="text-emerald-300 font-bold">Sie</span> (formal "you") and last names (<em>Herr Rodriguez</em>, <em>Frau Wachter</em>).

              </p>



              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4">

                  <div className="text-2xl mb-1">👩🏼🎓🇦🇹</div>

                  <h3 className="font-bold text-lg text-amber-300">Nicole</h3>

                  <p className="text-xs text-slate-400 mb-2">Vorname (First name only → uses "du")</p>

                  <p className="text-sm text-slate-200">

                    "Hallo! Ich bin Nicole. Ich komme aus Österreich."

                  </p>

                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4">

                  <div className="text-2xl mb-1">👨🏻🇲🇽</div>

                  <h3 className="font-bold text-lg text-sky-300">Paco Rodriguez</h3>

                  <p className="text-xs text-slate-400 mb-2">

                    "Paco" to Nicole (du) • "Herr Rodriguez" to Frau Wachter (Sie)

                  </p>

                  <p className="text-sm text-slate-200">

                    "Hallo, ich heiße Paco. Ich komme aus Mexiko."

                  </p>

                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4">

                  <div className="text-2xl mb-1">👵🏼🎩</div>

                  <h3 className="font-bold text-lg text-emerald-300">Frau Wachter</h3>

                  <p className="text-xs text-slate-400 mb-2">Familienname (Last name → uses "Sie")</p>

                  <p className="text-sm text-slate-200">

                    "Guten Tag, Herr Rodriguez. Woher kommen Sie?"

                  </p>

                </div>

              </div>

            </section>



            {/* Picture Lexicon (Bildlexikon from top of pages 9-11) */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="mb-4">

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">

                  Visual Vocabulary Banner (Pages 9–11 Top Margin)

                </span>

                <h2 className="text-xl font-bold text-white mt-1">

                  Bildlexikon: Begrüßung (Greetings) & Abschied (Farewells)

                </h2>

                <p className="text-sm text-slate-400">

                  Click any card to hear authentic German pronunciation and lock in when to use it.

                </p>

              </div>



              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                {BILDLEXIKON_ITEMS.map((item, idx) => (

                  <div

                    key={idx}

                    onClick={() => speakGerman(item.de)}

                    className="group bg-slate-950/90 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"

                  >

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <span className="text-2xl">{item.emoji}</span>

                        <span

                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${

                            item.category === 'Begrüßung'

                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'

                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'

                          }`}

                        >

                          {item.category}

                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition">

                          {item.de}

                        </h3>

                        <Volume2 className="w-4 h-4 text-indigo-400 opacity-80 group-hover:opacity-100" />

                      </div>

                      <p className="text-xs text-indigo-300 font-medium mb-2">{item.en}</p>

                    </div>

                    <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-2">

                      {item.tip}

                    </p>

                  </div>

                ))}

              </div>

            </section>



            {/* THE 6 FOREVER MEMORY HOOKS */}

            <section className="space-y-4">

              <div className="flex items-center gap-2">

                <Lightbulb className="w-6 h-6 text-amber-400" />

                <h2 className="text-2xl font-extrabold text-white">

                  6 "Forever Memory Hooks" (Gehirn-Anker)

                </h2>

              </div>

              <p className="text-sm text-slate-300">

                Read and click through these 6 mental shortcuts. They explain <em>why</em> every rule in Chapter 1 works so you never forget them during exams or real conversations.

              </p>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Hook 1 */}

                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-2">

                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">

                      MEMORY HOOK #1 • VERB ENDINGS

                    </span>

                    <Sparkles className="w-4 h-4 text-amber-400" />

                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">

                    The "E – ST – EN – T" Rhythm & The "ß" Secret

                  </h3>

                  <p className="text-sm text-slate-300 mb-3">

                    Regular verbs follow a super sticky rhythm:

                  </p>

                  <ul className="text-sm space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">

                    <li>

                      • <strong className="text-amber-300">ich</strong> → ends in <strong>-e</strong> (<em>ich komm<span className="underline text-amber-400">e</span>, ich heiß<span className="underline text-amber-400">e</span></em>)

                    </li>

                    <li>

                      • <strong className="text-amber-300">du</strong> → ends in <strong>-st</strong> ("You are the Be<strong>st</strong>!": <em>du komm<span className="underline text-amber-400">st</span></em>)

                    </li>

                    <li>

                      • <strong className="text-amber-300">Sie</strong> → ends in <strong>-en</strong> (<em>Sie komm<span className="underline text-amber-400">en</span>, Sie heiß<span className="underline text-amber-400">en</span></em>)

                    </li>

                    <li>

                      • <strong className="text-amber-300">er/sie</strong> → ends in <strong>-t</strong> (<em>er komm<span className="underline text-amber-400">t</span>, er heiß<span className="underline text-amber-400">t</span></em>)

                    </li>

                  </ul>

                  <div className="text-xs bg-amber-950/40 border border-amber-500/40 text-amber-200 p-3 rounded-lg">

                    <strong>Wait! Why are "du heißt" and "er heißt" identical?</strong> Because <strong>ß</strong> already equals double-S (<code>ss</code>)! Adding another <code>s</code> in <em>du heiß-st</em> would create triple-S, so German drops the <code>s</code> and adds only <strong>-t</strong>!

                  </div>

                </div>



                {/* Hook 2 */}

                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-2">

                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">

                      MEMORY HOOK #2 • COUNTRIES

                    </span>

                    <Globe className="w-4 h-4 text-emerald-400" />

                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">

                    The "aus / aus der / aus dem" Country Trap (Ex. 3b & 4)

                  </h3>

                  <p className="text-sm text-slate-300 mb-3">

                    90% of countries & cities have no article, so you just say <strong className="text-emerald-300">aus</strong>. Put these 3 VIP rebel countries in your mental vault:

                  </p>

                  <div className="space-y-2 text-sm">

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">

                      <span>🟢 <strong>Normal (No article):</strong> Deutschland, Österreich, Mexiko, Spanien</span>

                      <span className="font-bold text-emerald-400">aus ...</span>

                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 flex justify-between items-center">

                      <span>🔴 <strong>Feminine (die → der):</strong> die Schweiz, die Türkei</span>

                      <span className="font-bold text-rose-300">aus der Schweiz / Türkei</span>

                    </div>

                    <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/30 flex justify-between items-center">

                      <span>🔵 <strong>Masculine (der → dem):</strong> der Iran</span>

                      <span className="font-bold text-sky-300">aus dem Iran</span>

                    </div>

                  </div>

                </div>



                {/* Hook 3 */}

                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-2">

                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">

                      MEMORY HOOK #3 • WORD ORDER

                    </span>

                    <ShieldCheck className="w-4 h-4 text-indigo-400" />

                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">

                    The Verb is Superglued to Position 2! (Page 12)

                  </h3>

                  <p className="text-sm text-slate-300 mb-3">

                    In both W-Questions (<em>Wer, Wie, Woher</em>) and Statements (<em>Aussagen</em>), the conjugated verb is <strong>ALWAYS in Slot #2</strong>:

                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-3">

                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400">Position 1</div>

                    <div className="bg-indigo-600/30 p-2 rounded border border-indigo-400 text-indigo-200 font-bold">

                      POSITION 2 (VERB!)

                    </div>

                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400">Position 3</div>



                    <div className="bg-slate-950 p-2 rounded">Woher</div>

                    <div className="bg-indigo-950 p-2 rounded font-bold text-amber-300">kommst</div>

                    <div className="bg-slate-950 p-2 rounded">du?</div>



                    <div className="bg-slate-950 p-2 rounded">Mein Name</div>

                    <div className="bg-indigo-950 p-2 rounded font-bold text-amber-300">ist</div>

                    <div className="bg-slate-950 p-2 rounded">Valerie.</div>

                  </div>

                  <p className="text-xs text-slate-400">

                    Notice: <em>"Mein Name"</em> counts as <strong>one</strong> block in Position 1, so <em>"ist"</em> stays in Position 2!

                  </p>

                </div>



                {/* Hook 4 */}

                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-2">

                    <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold">

                      MEMORY HOOK #4 • SOCIAL RADAR

                    </span>

                    <Users className="w-4 h-4 text-purple-400" />

                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">

                    The "du" vs. "Sie" Mirror Equation (Ex. 6, 7 & 8)

                  </h3>

                  <div className="space-y-2 text-sm">

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">

                      <span className="text-amber-300 font-bold">Friends / Peers (du):</span>

                      <p className="text-xs text-slate-300 mt-1">

                        Hallo + Vorname (<em>Paco / Nicole</em>) + <strong>Wie heißt du?</strong> + <strong>Woher kommst du?</strong> + <strong>Wie geht es dir?</strong> + Tschüs!

                      </p>

                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">

                      <span className="text-emerald-300 font-bold">Formal / Adults (Sie):</span>

                      <p className="text-xs text-slate-300 mt-1">

                        Guten Tag + Herr/Frau + Familienname (<em>Herr Rodriguez / Frau Wachter</em>) + <strong>Wie heißen Sie?</strong> + <strong>Woher kommen Sie?</strong> + <strong>Wie geht es Ihnen?</strong> + Auf Wiedersehen!

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>



            <div className="flex justify-end">

              <button

                onClick={() => setActiveTab('ex1to5')}

                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer transition"

              >

                <span>Start Textbook Exercises 1–5 (Pages 9–10)</span>

                <ArrowRight className="w-5 h-5" />

              </button>

            </div>

          </div>

        )}



        {}

        {activeTab === 'ex1to5' && (

          <div className="space-y-8">

            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">

              <div>

                <h2 className="text-xl font-bold text-white">

                  Textbook Pages 9 & 10: Complete Exercises 1 to 5

                </h2>

                <p className="text-xs text-slate-300">

                  Every single exercise and sub-task (a, b, c) from your book is recreated below with audio and instant feedback.

                </p>

              </div>

              <span className="text-xs bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3 py-1.5 rounded-lg font-semibold">

                Seite 9 & Seite 10

              </span>

            </div>



            {/* EXERCISE 1 (1a & 1b) - Page 9 */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 9 • Übung 1a & 1b

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    1. Hallo! Ich bin Nicole — Lied & Kettenspiel

                  </h3>

                </div>

                {completedExercises.ex1 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <AudioTrackPlayer trackId="1.02" />



              {/* 1a */}

              <div className="space-y-4">

                <h4 className="font-bold text-indigo-300 text-sm">

                  1a) Hören Sie. Wie heißt das Lied? Welche deutschen Namen kennen Sie noch?

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">

                    <label className="block text-xs text-slate-400 mb-2">

                      Select the title/chorus of the greeting song:

                    </label>

                    <div className="space-y-2">

                      {[

                        'Hallo! Ich bin Nicole. Und wer bist du?',

                        'Auf Wiedersehen in Berlin!',

                        'Gute Nacht, Frau Wachter!'

                      ].map((opt) => (

                        <button

                          key={opt}

                          onClick={() => {

                            setEx1SongAnswer(opt);

                            if (opt.startsWith('Hallo!')) markComplete('ex1');

                          }}

                          className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition cursor-pointer ${

                            ex1SongAnswer === opt

                              ? opt.startsWith('Hallo!')

                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'

                                : 'bg-rose-950/60 border-rose-500 text-rose-200'

                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'

                          }`}

                        >

                          {opt}

                        </button>

                      ))}

                    </div>

                  </div>



                  {/* German Names Collector */}

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">

                    <label className="block text-xs text-slate-400 mb-2">

                      Welche deutschen Namen kennen Sie noch? (Click a name to hear it, or add more!):

                    </label>

                    <div className="flex flex-wrap gap-2 mb-3">

                      {ex1NamesInput.map((n, i) => (

                        <button

                          key={i}

                          onClick={() => speakGerman(n)}

                          className="px-3 py-1 rounded-full bg-indigo-950/80 hover:bg-indigo-800 border border-indigo-500/40 text-xs text-indigo-200 flex items-center gap-1 cursor-pointer"

                        >

                          <span>{n}</span>

                          <Volume2 className="w-3 h-3" />

                        </button>

                      ))}

                    </div>

                    <div className="flex gap-2">

                      <input

                        type="text"

                        value={newGermanName}

                        onChange={(e) => setNewGermanName(e.target.value)}

                        placeholder="Add name (e.g. Lukas, Anna, Hans)..."

                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"

                      />

                      <button

                        onClick={() => {

                          if (newGermanName.trim()) {

                            setEx1NamesInput([...ex1NamesInput, newGermanName.trim()]);

                            speakGerman(newGermanName.trim());

                            setNewGermanName('');

                            markComplete('ex1');

                          }

                        }}

                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"

                      >

                        + Add & Speak

                      </button>

                    </div>

                  </div>

                </div>

              </div>



              {/* 1b: Kettenspiel */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  1b) Kettenspiel (Chain Game): Sprechen Sie!

                </h4>

                <p className="text-xs text-slate-400">

                  Type your name to join the classroom chain between Sofia, Johnny, and Julia!

                </p>

                <div className="flex flex-wrap items-center gap-3">

                  <input

                    type="text"

                    value={chainUserName}

                    onChange={(e) => setChainUserName(e.target.value)}

                    placeholder="Enter your name..."

                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"

                  />

                  <button

                    onClick={() => {

                      const nameToUse = chainUserName.trim() || 'Alex';

                      setChainStep(1);

                      speakGerman(

                        `Hallo! Ich bin Sofia. Und wer bist du? ... Hallo, ich heiße ${nameToUse}. Und wer bist du? ... Hallo! Ich bin Johnny!`

                      );

                      markComplete('ex1');

                    }}

                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer"

                  >

                    <Play className="w-4 h-4" /> Run Chain Game (Kettenspiel)

                  </button>

                </div>

                {chainStep > 0 && (

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">

                      <strong className="text-amber-300">Sofia:</strong> "Hallo! Ich bin Sofia. Und wer bist du?"

                    </div>

                    <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-xs">

                      <strong className="text-emerald-300">You:</strong> "Hallo, ich heiße{' '}

                      <span className="underline font-bold">{chainUserName || 'Alex'}</span>. Und wer bist du?"

                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">

                      <strong className="text-sky-300">Johnny:</strong> "Hallo! Ich bin Johnny!"

                    </div>

                  </div>

                )}

              </div>

            </section>



            {/* EXERCISE 2 (2a, 2b, 2c) - Page 9 */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 9 • Übung 2a, 2b & 2c

                  </span>

                  <h3 className="text-xl font-bold text-white">2. Und wer bist du?</h3>

                </div>

                {completedExercises.ex2 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <AudioTrackPlayer trackId="1.03" />



              {/* 2a: Hören Sie und kreuzen Sie an */}

              <div className="space-y-4">

                <h4 className="font-bold text-indigo-300 text-sm">

                  2a) Hören Sie (Track 1.03) und kreuzen Sie an. (Check the correct name for each phrase!)

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">

                    <p className="font-bold text-white mb-3">1. „Ich heiße ...“</p>

                    <div className="flex gap-3">

                      {['Winfried.', 'Paco.'].map((name) => (

                        <button

                          key={name}

                          onClick={() => setEx2aHeisse(name)}

                          className={`flex-1 py-2.5 px-4 rounded-lg border font-semibold text-sm cursor-pointer transition ${

                            ex2aHeisse === name

                              ? 'bg-indigo-600 border-indigo-400 text-white'

                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'

                          }`}

                        >

                          {ex2aHeisse === name ? '☒ ' : '☐ '} {name}

                        </button>

                      ))}

                    </div>

                  </div>



                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">

                    <p className="font-bold text-white mb-3">2. „Ich bin ...“</p>

                    <div className="flex gap-3">

                      {['Nicole.', 'Winfried.'].map((name) => (

                        <button

                          key={name}

                          onClick={() => setEx2aBin(name)}

                          className={`flex-1 py-2.5 px-4 rounded-lg border font-semibold text-sm cursor-pointer transition ${

                            ex2aBin === name

                              ? 'bg-indigo-600 border-indigo-400 text-white'

                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'

                          }`}

                        >

                          {ex2aBin === name ? '☒ ' : '☐ '} {name}

                        </button>

                      ))}

                    </div>

                  </div>

                </div>



                <div className="flex items-center gap-4">

                  <button

                    onClick={() => {

                      setEx2aChecked(true);

                      if (ex2aHeisse === 'Paco.' && ex2aBin === 'Nicole.') markComplete('ex2');

                    }}

                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"

                  >

                    Check 2a Answers

                  </button>

                  {ex2aChecked && (

                    <span

                      className={`text-sm font-semibold ${

                        ex2aHeisse === 'Paco.' && ex2aBin === 'Nicole.'

                          ? 'text-emerald-400'

                          : 'text-rose-400'

                      }`}

                    >

                      {ex2aHeisse === 'Paco.' && ex2aBin === 'Nicole.'

                        ? '✓ Perfekt! Paco says "Ich heiße Paco" and Nicole says "Ich bin Nicole."'

                        : '✗ Listen closely to Track 1.03: Paco says "Ich heiße Paco" and Nicole says "Ich bin Nicole."'}

                    </span>

                  )}

                </div>

              </div>



              {/* 2b & 2c: Sitzplan (Seating Plan Challenge from Page 9 illustration) */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  2b & 2c) Zeichnen Sie einen Sitzplan. Notieren Sie die Namen. Wer weiß die meisten Namen?

                </h4>

                <p className="text-xs text-slate-400">

                  Click each desk chair to hear the student introduce themselves, then type their name onto their desk (just like the Sofia, Johnny, Julia illustration on Page 9!):

                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

                  {[

                    { id: 'desk1', expected: 'Sofia', intro: 'Hallo! Ich bin Sofia.' },

                    { id: 'desk2', expected: 'Johnny', intro: 'Hallo, ich heiße Johnny.' },

                    { id: 'desk3', expected: 'Julia', intro: 'Hallo! Ich bin Julia.' }

                  ].map((desk, i) => (

                    <div

                      key={desk.id}

                      className="bg-slate-900 border-2 border-amber-500/30 rounded-xl p-4 flex flex-col items-center text-center"

                    >

                      <button

                        onClick={() => speakGerman(desk.intro)}

                        className="mb-2 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"

                      >

                        <Volume2 className="w-3.5 h-3.5" /> Hear Desk #{i + 1}

                      </button>

                      <div className="text-2xl mb-2">🪑</div>

                      <input

                        type="text"

                        value={deskGuesses[desk.id]}

                        onChange={(e) => setDeskGuesses({ ...deskGuesses, [desk.id]: e.target.value })}

                        placeholder={`Desk #${i + 1} Name...`}

                        className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-amber-300"

                      />

                      {deskChecked && (

                        <span

                          className={`text-xs mt-1 font-semibold ${

                            deskGuesses[desk.id]?.trim().toLowerCase() === desk.expected.toLowerCase()

                              ? 'text-emerald-400'

                              : 'text-rose-400'

                          }`}

                        >

                          {deskGuesses[desk.id]?.trim().toLowerCase() === desk.expected.toLowerCase()

                            ? `✓ ${desk.expected}`

                            : `Answer: ${desk.expected}`}

                        </span>

                      )}

                    </div>

                  ))}

                </div>

                <button

                  onClick={() => {

                    setDeskChecked(true);

                    markComplete('ex2c');

                  }}

                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"

                >

                  Verify Seating Plan (Sitzplan prüfen)

                </button>

              </div>

            </section>



            {/* EXERCISE 3 (3a, 3b, 3c) - Page 10 */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 10 • Übung 3a, 3b & 3c

                  </span>

                  <h3 className="text-xl font-bold text-white">3. Ich komme aus Mexiko.</h3>

                </div>

                {completedExercises.ex3 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <AudioTrackPlayer trackId="1.04" />



              {/* 3a: Wer sagt was? */}

              <div className="space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  3a) Wer sagt was? Hören Sie das Gespräch weiter und ordnen Sie zu (PACO oder NICOLE).

                </h4>

                <div className="space-y-2">

                  {ex3aItems.map((item) => (

                    <div

                      key={item.id}

                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"

                    >

                      <div className="flex items-center gap-2">

                        <button

                          onClick={() => speakGerman(item.text)}

                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 cursor-pointer"

                        >

                          <Volume2 className="w-4 h-4" />

                        </button>

                        <span className="text-sm font-medium text-white">{item.text}</span>

                      </div>

                      <div className="flex items-center gap-2">

                        {['PACO', 'NICOLE'].map((speaker) => (

                          <button

                            key={speaker}

                            onClick={() =>

                              setEx3aSelections({ ...ex3aSelections, [item.id]: speaker })

                            }

                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${

                              ex3aSelections[item.id] === speaker

                                ? 'bg-indigo-600 border-indigo-400 text-white'

                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'

                            }`}

                          >

                            {speaker}

                          </button>

                        ))}

                        {ex3aChecked && (

                          <span className="text-xs font-bold ml-2">

                            {ex3aSelections[item.id] === item.answer ? (

                              <span className="text-emerald-400">✓</span>

                            ) : (

                              <span className="text-rose-400">✗ ({item.answer})</span>

                            )}

                          </span>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

                <button

                  onClick={() => {

                    setEx3aChecked(true);

                    const allRight = ex3aItems.every((i) => ex3aSelections[i.id] === i.answer);

                    if (allRight) markComplete('ex3');

                  }}

                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"

                >

                  Check 3a Answers

                </button>

              </div>



              {/* 3b: Ergänzen Sie (GRAMMATIK Box) */}

              <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/30 space-y-4">

                <h4 className="font-bold text-indigo-300 text-sm">

                  3b) Ergänzen Sie die Endungen und vergleichen Sie mit a. (GRAMMATIK Box)

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800">

                    <div className="flex items-center gap-1 text-base font-semibold">

                      <span>Woher komm</span>

                      <input

                        type="text"

                        value={ex3bGap1}

                        onChange={(e) => setEx3bGap1(e.target.value)}

                        placeholder="?"

                        className="w-14 text-center bg-slate-950 border border-amber-400 rounded px-1 py-0.5 text-amber-300 font-bold"

                      />

                      <span>du?</span>

                    </div>

                    <div className="flex items-center gap-1 text-base font-semibold">

                      <span>Ich komm</span>

                      <input

                        type="text"

                        value={ex3bGap2}

                        onChange={(e) => setEx3bGap2(e.target.value)}

                        placeholder="?"

                        className="w-14 text-center bg-slate-950 border border-amber-400 rounded px-1 py-0.5 text-amber-300 font-bold"

                      />

                      <span>aus Mexiko.</span>

                    </div>

                    <button

                      onClick={() => {

                        setEx3bChecked(true);

                        if (

                          ex3bGap1.trim().toLowerCase() === 'st' &&

                          ex3bGap2.trim().toLowerCase() === 'e'

                        ) {

                          markComplete('ex3b');

                        }

                      }}

                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs cursor-pointer"

                    >

                      Verify Grammar Endings (3b)

                    </button>

                    {ex3bChecked && (

                      <p className="text-xs font-semibold text-emerald-400">

                        {ex3bGap1.trim().toLowerCase() === 'st' &&

                        ex3bGap2.trim().toLowerCase() === 'e'

                          ? '✓ Bravo! Woher komm[st] du? / Ich komm[e] aus Mexiko.'

                          : 'Hint: du takes "-st" (kommst) and ich takes "-e" (komme)!'}

                      </p>

                    )}

                  </div>



                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">

                    <div className="font-bold text-amber-300 uppercase">Textbook Grammar Box:</div>

                    <p className="text-slate-200">

                      • <strong>aus</strong> Deutschland / Spanien / Wien / ...

                    </p>

                    <p className="text-rose-300">

                      • <strong>aus der</strong> Schweiz / <strong>aus der</strong> Türkei

                    </p>

                    <p className="text-sky-300">

                      • <strong>aus dem</strong> Iran

                    </p>

                  </div>

                </div>

              </div>



              {/* 3c: Sprechen Sie */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">

                <div>

                  <h4 className="font-bold text-indigo-300 text-sm">

                    3c) Sprechen Sie! Practice Your Own Country Dialogue:

                  </h4>

                  <p className="text-xs text-slate-400">

                    Choose a country/city and hear the complete question & answer:

                  </p>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  {[

                    { label: 'Indien', phrase: 'aus Indien' },

                    { label: 'Delhi', phrase: 'aus Delhi' },

                    { label: 'Deutschland', phrase: 'aus Deutschland' },

                    { label: 'der Schweiz', phrase: 'aus der Schweiz' },

                    { label: 'dem Iran', phrase: 'aus dem Iran' }

                  ].map((c) => (

                    <button

                      key={c.label}

                      onClick={() => {

                        setEx3cCountry(c.phrase);

                        speakGerman(`Woher kommst du? Ich komme ${c.phrase}.`);

                      }}

                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${

                        ex3cCountry === c.phrase

                          ? 'bg-emerald-600 border-emerald-400 text-white'

                          : 'bg-slate-900 border-slate-700 text-slate-300'

                      }`}

                    >

                      {c.phrase}

                    </button>

                  ))}

                </div>

              </div>

            </section>



            {/* EXERCISE 4 - Page 10 ("Woher kommt die Musik?") */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 10 • Übung 4 (Spiel & Spaß • Track 1.05)

                  </span>

                  <h3 className="text-xl font-bold text-white flex items-center gap-2">

                    <Music className="w-5 h-5 text-amber-400" /> 4. Woher kommt die Musik? Hören Sie und ordnen Sie zu.

                  </h3>

                </div>

                {completedExercises.ex4 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <p className="text-xs text-slate-300">

                Click the 5 musical snippets (Tracks #1 – #5) below to hear the synthesized melody and cultural announcement, then match each country in the table! (Note: <em>Österreich = 1</em> is pre-filled as in the book).

              </p>



              {/* 5 Musical Buttons */}

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">

                {[

                  { num: '1', style: 'Österreich', hint: 'Viennese Waltz (3/4)' },

                  { num: '2', style: 'Spanien', hint: 'Flamenco Guitar' },

                  { num: '3', style: 'Türkei', hint: 'Anatolian Melody' },

                  { num: '4', style: 'Iran', hint: 'Persian Classical' },

                  { num: '5', style: 'Frankreich', hint: 'Parisian Accordion' }

                ].map((m) => (

                  <button

                    key={m.num}

                    onClick={() => {

                      playCulturalMelody(m.style);

                    }}

                    className="bg-indigo-950/70 hover:bg-indigo-800/80 border border-indigo-500/40 rounded-xl p-3 text-center transition cursor-pointer"

                  >

                    <div className="flex items-center justify-center gap-1 font-bold text-amber-300 text-sm">

                      <Music className="w-4 h-4" /> Musik #{m.num}

                    </div>

                    <div className="text-[11px] text-indigo-200 mt-1">{m.hint}</div>

                  </button>

                ))}

              </div>



              {/* Textbook Table */}

              <div className="overflow-x-auto">

                <table className="w-full text-sm border-collapse bg-slate-950 rounded-xl overflow-hidden">

                  <thead>

                    <tr className="bg-slate-800/80 text-slate-300 text-left">

                      <th className="p-3">Land (Country)</th>

                      <th className="p-3">German Phrase (Click to hear)</th>

                      <th className="p-3">Musik (1–5)</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800">

                    {ex4Countries.map((row) => {

                      const prep =

                        row.country === 'Türkei'

                          ? 'aus der Türkei'

                          : row.country === 'Iran'

                          ? 'aus dem Iran'

                          : `aus ${row.country}`;

                      return (

                        <tr key={row.country}>

                          <td className="p-3 font-bold text-white">{row.country}</td>

                          <td className="p-3">

                            <button

                              onClick={() => speakGerman(`Die Musik kommt ${prep}.`)}

                              className="text-xs text-indigo-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer"

                            >

                              <Volume2 className="w-3.5 h-3.5" /> "Die Musik kommt {prep}."

                            </button>

                          </td>

                          <td className="p-3">

                            <select

                              value={ex4Answers[row.country]}

                              onChange={(e) =>

                                setEx4Answers({ ...ex4Answers, [row.country]: e.target.value })

                              }

                              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-bold"

                            >

                              <option value="">-- ? --</option>

                              {['1', '2', '3', '4', '5'].map((n) => (

                                <option key={n} value={n}>

                                  Musik {n}

                                </option>

                              ))}

                            </select>

                            {ex4Checked && (

                              <span className="ml-2 text-xs font-bold">

                                {ex4Answers[row.country] === row.correctTrack ? (

                                  <span className="text-emerald-400">✓</span>

                                ) : (

                                  <span className="text-rose-400">✗ (#{row.correctTrack})</span>

                                )}

                              </span>

                            )}

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>



              <button

                onClick={() => {

                  setEx4Checked(true);

                  const allOk = ex4Countries.every(

                    (c) => ex4Answers[c.country] === c.correctTrack

                  );

                  if (allOk) markComplete('ex4');

                }}

                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"

              >

                Check Exercise 4

              </button>

            </section>



            {/* EXERCISE 5 - Page 10 ("Wer sagt was?") */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 10 • Übung 5 (Track 1.06)

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    5. Wer sagt was? Hören Sie das Gespräch weiter und kreuzen Sie an.

                  </h3>

                </div>

                {completedExercises.ex5 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <AudioTrackPlayer trackId="1.06" />



              <div className="overflow-x-auto">

                <table className="w-full text-sm bg-slate-950 rounded-xl overflow-hidden border-collapse">

                  <thead>

                    <tr className="bg-slate-800 text-slate-200">

                      <th className="p-3 text-left">Aussage / Frage</th>

                      <th className="p-3 text-center">PACO</th>

                      <th className="p-3 text-center">NICOLE</th>

                      <th className="p-3 text-center">FRAU WACHTER</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800">

                    {ex5Rows.map((row) => (

                      <tr key={row.key} className="hover:bg-slate-900/60">

                        <td className="p-3 font-medium text-white flex items-center gap-2">

                          <button

                            onClick={() => speakGerman(row.text.slice(3))}

                            className="text-indigo-400 hover:text-amber-300 cursor-pointer"

                          >

                            <Volume2 className="w-4 h-4" />

                          </button>

                          <span>{row.text}</span>

                          {ex5Checked && (

                            <span className="ml-2 text-xs font-bold">

                              {ex5Selections[row.key] === row.correct ? (

                                <span className="text-emerald-400">✓</span>

                              ) : (

                                <span className="text-rose-400">✗ ({row.correct})</span>

                              )}

                            </span>

                          )}

                        </td>

                        {['PACO', 'NICOLE', 'FRAU WACHTER'].map((person) => (

                          <td key={person} className="p-3 text-center">

                            <button

                              onClick={() =>

                                setEx5Selections({ ...ex5Selections, [row.key]: person })

                              }

                              className={`w-8 h-8 rounded-lg font-bold border transition cursor-pointer ${

                                ex5Selections[row.key] === person

                                  ? 'bg-amber-400 border-amber-300 text-slate-950'

                                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'

                              }`}

                            >

                              {ex5Selections[row.key] === person ? 'X' : ''}

                            </button>

                          </td>

                        ))}

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>



              <div className="flex items-center justify-between flex-wrap gap-4">

                <button

                  onClick={() => {

                    setEx5Checked(true);

                    const allCorrect = ex5Rows.every((r) => ex5Selections[r.key] === r.correct);

                    if (allCorrect) markComplete('ex5');

                  }}

                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"

                >

                  Check Exercise 5 Table

                </button>

                <button

                  onClick={() => setActiveTab('ex6to10')}

                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"

                >

                  <span>Continue to Exercises 6–10 (Pages 11–12)</span>

                  <ArrowRight className="w-4 h-4" />

                </button>

              </div>

            </section>

          </div>

        )}



        {}

        {activeTab === 'ex6to10' && (

          <div className="space-y-8">

            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">

              <div>

                <h2 className="text-xl font-bold text-white">

                  Textbook Pages 11 & 12: Complete Exercises 6 to 10

                </h2>

                <p className="text-xs text-slate-300">

                  Formal vs. informal address (<em>du/Sie</em>), third person (<em>er/sie</em>), asking how someone is, the German Alphabet, and Greetings vs. Farewells.

                </p>

              </div>

              <span className="text-xs bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3 py-1.5 rounded-lg font-semibold">

                Seite 11 & Seite 12

              </span>

            </div>



            {/* EXERCISE 6 (6a, 6b, 6c, 6d) - Page 11 */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 11 • Übung 6a, 6b, 6c & 6d

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    6. Woher kommst du? vs. Woher kommen Sie?

                  </h3>

                </div>

                {completedExercises.ex6 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              {/* 6a: Was sagt Frau Wachter? */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  6a) Was sagt Frau Wachter? Ergänzen Sie.

                </h4>

                <div className="space-y-2 text-sm">

                  <div className="p-3 bg-slate-900 rounded-lg">

                    <strong className="text-amber-300 mr-2">NICOLE:</strong>

                    <span>Woher kommst du, Paco? Aus Spanien?</span>

                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg flex flex-wrap items-center gap-2">

                    <strong className="text-emerald-300 mr-2">FRAU WACHTER:</strong>

                    <span>„Rodriguez“ ... hm ... Woher</span>

                    <input

                      type="text"

                      value={ex6aWord1}

                      onChange={(e) => setEx6aWord1(e.target.value)}

                      placeholder="verb..."

                      className="w-28 bg-slate-950 border border-amber-400 rounded px-2 py-1 text-amber-300 font-bold text-center"

                    />

                    <input

                      type="text"

                      value={ex6aWord2}

                      onChange={(e) => setEx6aWord2(e.target.value)}

                      placeholder="pronoun..."

                      className="w-20 bg-slate-950 border border-amber-400 rounded px-2 py-1 text-amber-300 font-bold text-center"

                    />

                    <span>?</span>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <button

                    onClick={() => {

                      setEx6aChecked(true);

                      if (

                        ex6aWord1.trim().toLowerCase() === 'kommen' &&

                        ex6aWord2.trim() === 'Sie'

                      ) {

                        markComplete('ex6');

                      }

                    }}

                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"

                  >

                    Check 6a

                  </button>

                  {ex6aChecked && (

                    <span className="text-xs font-semibold text-emerald-300">

                      {ex6aWord1.trim().toLowerCase() === 'kommen' && ex6aWord2.trim() === 'Sie'

                        ? '✓ Genau! „Woher kommen Sie?“ (Capital "S" in Sie is important!)'

                        : 'Answer: Woher [kommen] [Sie]? (Note the capital S in formal Sie!)'}

                    </span>

                  )}

                </div>

              </div>



              {/* 6b: Gespräche üben: du oder Sie? */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  6b) Gespräche üben: du oder Sie? (Social Etiquette Trainer)

                </h4>

                <p className="text-xs text-slate-400">

                  Remember the Page 11 Grammar Box: <strong>du</strong> = Vorname (Nicole/Paco) | <strong>Sie</strong> = Herr/Frau + Familienname (Herr Rodriguez / Frau Wachter). Choose the right address:

                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {ex6bScenarios.map((sc) => (

                    <div

                      key={sc.id}

                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2"

                    >

                      <div>

                        <div className="text-xs font-bold text-white">{sc.person}</div>

                        <div className="text-[11px] text-slate-400">{sc.question}</div>

                      </div>

                      <div className="flex gap-1.5">

                        {['du', 'Sie'].map((opt) => (

                          <button

                            key={opt}

                            onClick={() => setEx6bChoices({ ...ex6bChoices, [sc.id]: opt })}

                            className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${

                              ex6bChoices[sc.id] === opt

                                ? opt === sc.correctForm

                                  ? 'bg-emerald-600 border-emerald-400 text-white'

                                  : 'bg-rose-600 border-rose-400 text-white'

                                : 'bg-slate-950 border-slate-700 text-slate-300'

                            }`}

                          >

                            {opt}

                          </button>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

              </div>



              {/* 6c: Hören Sie noch einmal und ergänzen Sie (Track 1.07) */}

              <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/30 space-y-4">

                <h4 className="font-bold text-indigo-300 text-sm">

                  6c) Hören Sie noch einmal (Track 1.07) und ergänzen Sie.

                </h4>

                <div className="flex flex-wrap gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">

                  <span className="text-slate-400 font-bold">Word Bank:</span>

                  {['Aus', 'das', 'Er', 'Guten', 'ist (used)', 'kommt', 'Tag'].map((w) => (

                    <span

                      key={w}

                      className="px-2.5 py-0.5 rounded bg-indigo-950 text-amber-300 border border-indigo-500/30 font-mono"

                    >

                      {w}

                    </span>

                  ))}

                </div>



                <div className="space-y-2.5 text-sm bg-slate-900 p-4 rounded-xl border border-slate-800">

                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-amber-400 font-bold">▲</span>

                    <span>Das</span>

                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-300 rounded font-bold">

                      ist

                    </span>

                    <span>Paco. Und</span>

                    <input

                      type="text"

                      value={ex6cGaps.g2}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g2: e.target.value })}

                      placeholder="..."

                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <span>ist Frau Wachter.</span>

                  </div>



                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-sky-400 font-bold">●</span>

                    <input

                      type="text"

                      value={ex6cGaps.g3}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g3: e.target.value })}

                      placeholder="..."

                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <span>Tag, Frau Wachter!</span>

                  </div>



                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-emerald-400 font-bold">◼</span>

                    <span>Guten</span>

                    <input

                      type="text"

                      value={ex6cGaps.g4}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g4: e.target.value })}

                      placeholder="..."

                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <span>, Herr Rodriguez.</span>

                  </div>



                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-amber-400 font-bold">▲</span>

                    <input

                      type="text"

                      value={ex6cGaps.g5}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g5: e.target.value })}

                      placeholder="..."

                      className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <input

                      type="text"

                      value={ex6cGaps.g6}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g6: e.target.value })}

                      placeholder="..."

                      className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <span>aus Mexiko.</span>

                  </div>



                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-emerald-400 font-bold">◼</span>

                    <span>Ah!</span>

                    <input

                      type="text"

                      value={ex6cGaps.g7}

                      onChange={(e) => setEx6cGaps({ ...ex6cGaps, g7: e.target.value })}

                      placeholder="..."

                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-amber-300 font-bold"

                    />

                    <span>Mexiko!</span>

                  </div>



                  <div className="flex flex-wrap items-center gap-1.5">

                    <span className="text-sky-400 font-bold">●</span>

                    <span>Ja.</span>

                  </div>

                </div>



                <div className="flex flex-wrap items-center gap-3">

                  <button

                    onClick={() => {

                      setEx6cChecked(true);

                      markComplete('ex6c');

                    }}

                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"

                  >

                    Check 6c Answers

                  </button>

                  <button

                    onClick={() =>

                      setEx6cGaps({

                        g1: 'ist',

                        g2: 'das',

                        g3: 'Guten',

                        g4: 'Tag',

                        g5: 'Er',

                        g6: 'kommt',

                        g7: 'Aus'

                      })

                    }

                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs cursor-pointer"

                  >

                    Fill Correct Answers

                  </button>

                </div>

              </div>



              {/* 6d: Bekannte Persönlichkeiten: Wer ist das? - Das ist ... */}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  6d) Bekannte Persönlichkeiten: „Wer ist das? – Das ist ... Er/Sie kommt aus ...“

                </h4>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">

                  <div>

                    <span className="text-xs text-amber-400 font-bold uppercase">

                      Famous Personality #{ex6dIndex + 1} of {famousPeople.length}

                    </span>

                    <h5 className="text-lg font-bold text-white">

                      Wer ist das? → „Das ist {famousPeople[ex6dIndex].name}.“

                    </h5>

                    <p className="text-xs text-slate-400">

                      Country: <strong>{famousPeople[ex6dIndex].country}</strong> ({famousPeople[ex6dIndex].role})

                    </p>

                  </div>



                  <div className="flex flex-wrap items-center gap-2 text-sm">

                    <select

                      value={ex6dPronoun}

                      onChange={(e) => setEx6dPronoun(e.target.value)}

                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"

                    >

                      <option value="">Er / Sie?</option>

                      <option value="Er">Er (He)</option>

                      <option value="Sie">Sie (She)</option>

                    </select>

                    <span className="font-bold text-white">kommt</span>

                    <select

                      value={ex6dPrep}

                      onChange={(e) => setEx6dPrep(e.target.value)}

                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"

                    >

                      <option value="">aus / aus der?</option>

                      <option value="aus">aus</option>

                      <option value="aus der">aus der</option>

                      <option value="aus dem">aus dem</option>

                    </select>

                    <span className="font-bold text-emerald-300">

                      {famousPeople[ex6dIndex].country}.

                    </span>

                    <button

                      onClick={() => {

                        const cur = famousPeople[ex6dIndex];

                        const ok = ex6dPronoun === cur.pronoun && ex6dPrep === cur.prep;

                        const fullSentence = `Das ist ${cur.name}. ${cur.pronoun} kommt ${cur.prep} ${cur.country}.`;

                        speakGerman(fullSentence);

                        setEx6dFeedback(

                          ok ? `✓ Richtig! "${fullSentence}"` : `Watch out: "${fullSentence}"`

                        );

                        if (ok) markComplete('ex6d');

                      }}

                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"

                    >

                      Check & Speak

                    </button>

                    <button

                      onClick={() => {

                        setEx6dIndex((ex6dIndex + 1) % famousPeople.length);

                        setEx6dPronoun('');

                        setEx6dPrep('');

                        setEx6dFeedback(null);

                      }}

                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs cursor-pointer"

                    >

                      Next Person →

                    </button>

                  </div>

                </div>

                {ex6dFeedback && (

                  <p className="text-xs font-bold text-amber-300">{ex6dFeedback}</p>

                )}

              </div>

            </section>



            {/* EXERCISE 7 & 8 - Page 11 (Nach dem Befinden fragen) */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 11 • Übung 7 & 8 (Track 1.08)

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    7 & 8. Nach dem Befinden fragen: Wie geht’s? / Wie geht es Ihnen?

                  </h3>

                </div>

                {completedExercises.ex7 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              {/* Mood Thermometer from Page 11 */}

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">

                {[

                  { text: 'Sehr gut, danke!', icon: '😄', color: 'border-emerald-500/50 bg-emerald-950/30', en: 'Very good, thanks!' },

                  { text: 'Gut, danke.', icon: '🙂', color: 'border-teal-500/50 bg-teal-950/30', en: 'Good, thanks.' },

                  { text: 'Auch gut.', icon: '😊', color: 'border-sky-500/50 bg-sky-950/30', en: 'Also good.' },

                  { text: 'Es geht.', icon: '😐', color: 'border-amber-500/50 bg-amber-950/30', en: 'So-so / It goes.' },

                  { text: 'Nicht so gut.', icon: '🙁', color: 'border-rose-500/50 bg-rose-950/30', en: 'Not so good.' }

                ].map((m) => (

                  <div

                    key={m.text}

                    onClick={() => {

                      setEx8Mood(m.text);

                      speakGerman(m.text);

                    }}

                    className={`p-3 rounded-xl border ${m.color} text-center cursor-pointer hover:scale-[1.02] transition`}

                  >

                    <div className="text-2xl mb-1">{m.icon}</div>

                    <div className="font-bold text-sm text-white">{m.text}</div>

                    <div className="text-[11px] text-slate-400">{m.en}</div>

                  </div>

                ))}

              </div>



              {/* 7: Was sagen die Personen? */}

              <div className="space-y-3">

                <h4 className="font-bold text-indigo-300 text-sm">

                  7) Was sagen die Personen im Hörtext (Track 1.08)? Ordnen Sie zu (NICOLE oder FRAU WACHTER):

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {ex7Items.map((item) => (

                    <div

                      key={item.phrase}

                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2"

                    >

                      <div>

                        <button

                          onClick={() => speakGerman(item.phrase)}

                          className="font-bold text-sm text-white hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"

                        >

                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> {item.phrase}

                        </button>

                        <span className="text-[11px] text-slate-400">{item.note}</span>

                      </div>

                      <div className="flex gap-1.5">

                        {['NICOLE', 'FRAU WACHTER'].map((sp) => (

                          <button

                            key={sp}

                            onClick={() =>

                              setEx7Selections({ ...ex7Selections, [item.phrase]: sp })

                            }

                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${

                              ex7Selections[item.phrase] === sp

                                ? 'bg-indigo-600 border-indigo-400 text-white'

                                : 'bg-slate-900 border-slate-700 text-slate-400'

                            }`}

                          >

                            {sp}

                          </button>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

                <div className="flex items-center gap-3">

                  <button

                    onClick={() => {

                      setEx7Checked(true);

                      markComplete('ex7');

                    }}

                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"

                  >

                    Check Exercise 7 & 8

                  </button>

                  {ex7Checked && (

                    <span className="text-xs text-emerald-300">

                      ✓ Checked! Nicole asks "Wie geht’s Ihnen?" and answers "Gut, danke." Frau Wachter replies "Auch gut."

                    </span>

                  )}

                </div>

              </div>

            </section>



            {/* EXERCISE 9 (9a & 9b) - Page 12 (SPRECHTRAINING: Das Alphabet) */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 12 • Übung 9a & 9b (Track 1.09 • Sprechtraining)

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    9. Das Alphabet & Namen buchstabieren (Diktat)

                  </h3>

                </div>

                {completedExercises.ex9 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <p className="text-xs text-slate-300">

                <strong>9a) Hören Sie und sprechen Sie nach.</strong> Click any letter to hear its German name. Letters highlighted in <span className="text-amber-300 font-bold">amber</span> are the famous "Pronunciation Traps" that sound very different from English!

              </p>



              {/* 30-letter Grid */}

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">

                {ALPHABET_DATA.map((item) => (

                  <button

                    key={item.letter}

                    onClick={() => speakGerman(`${item.speak}. Wie in ${item.example}.`)}

                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${

                      item.trap

                        ? 'bg-amber-950/40 border-amber-500/50 hover:bg-amber-900/50'

                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800'

                    }`}

                    title={item.note || item.example}

                  >

                    <div className="font-black text-base text-white">{item.letter}</div>

                    <div className="text-xs font-mono text-indigo-300">{item.sound}</div>

                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.example}</div>

                  </button>

                ))}

              </div>



              {/* 9b: Diktieren Sie Ihren Namen + Audio Diktat Game */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

                {/* Custom Name Speller */}

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                  <h4 className="font-bold text-indigo-300 text-sm">

                    9b) Diktieren Sie Ihren Namen („Ich buchstabiere...“)

                  </h4>

                  <p className="text-xs text-slate-400">

                    Type your own name below and hear how to spell it out loud in German like Valerie Wulf on Page 12:

                  </p>

                  <div className="flex gap-2">

                    <input

                      type="text"

                      value={spellerName}

                      onChange={(e) => setSpellerName(e.target.value)}

                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-bold"

                    />

                    <button

                      onClick={() => {

                        const letters = spellerName

                          .trim()

                          .split('')

                          .filter((c) => c.trim() !== '')

                          .join(', ');

                        speakGerman(

                          `Mein Name ist ${spellerName}. Wie bitte? Ich buchstabiere: ${letters}.`

                        );

                        markComplete('ex9');

                      }}

                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"

                    >

                      <Volume2 className="w-4 h-4" /> Buchstabieren!

                    </button>

                  </div>

                  <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-slate-200">

                    <div>▲ Mein Name ist <strong>{spellerName || 'Valerie Wulf'}</strong>.</div>

                    <div>● <strong>Wie bitte?</strong> (Pardon / Excuse me?)</div>

                    <div className="text-amber-300">

                      ▲ Ich buchstabiere:{' '}

                      {(spellerName || 'Valerie')

                        .toUpperCase()

                        .split('')

                        .filter((c) => c !== ' ')

                        .join(' - ')}

                    </div>

                  </div>

                </div>



                {/* Interactive Diktat Listening Test */}

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">

                  <h4 className="font-bold text-emerald-300 text-sm">

                    Interactive Diktat Challenge (Spelling Bee)

                  </h4>

                  <p className="text-xs text-slate-400">

                    Click "Play Spelled Word", listen to the German letters, and type the word you hear:

                  </p>

                  <div className="flex items-center gap-2">

                    <button

                      onClick={() =>

                        speakGerman(

                          `Ich buchstabiere: ${diktatWords[diktatIdx].audio}`,

                          1.0,

                          0.82

                        )

                      }

                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"

                    >

                      <Volume2 className="w-4 h-4" /> Play Word #{diktatIdx + 1}

                    </button>

                    <input

                      type="text"

                      value={diktatInput}

                      onChange={(e) => setDiktatInput(e.target.value)}

                      placeholder="Type spelled word..."

                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white uppercase font-bold"

                    />

                    <button

                      onClick={() => {

                        const target = diktatWords[diktatIdx].word;

                        if (diktatInput.trim().toUpperCase() === target) {

                          setDiktatResult(`✓ Super! ${target} (${diktatWords[diktatIdx].spelled})`);

                          markComplete('ex9');

                        } else {

                          setDiktatResult(`Answer: ${target} (${diktatWords[diktatIdx].spelled})`);

                        }

                      }}

                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"

                    >

                      Check

                    </button>

                    <button

                      onClick={() => {

                        setDiktatIdx((diktatIdx + 1) % diktatWords.length);

                        setDiktatInput('');

                        setDiktatResult(null);

                      }}

                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"

                    >

                      Next →

                    </button>

                  </div>

                  {diktatResult && (

                    <p className="text-xs font-bold text-amber-300">{diktatResult}</p>

                  )}

                </div>

              </div>

            </section>



            {/* EXERCISE 10 (10a & 10b) - Page 12 ("Hallo oder tschüs?") */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Seite 12 • Übung 10a & 10b (Track 1.10)

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    10. Hallo oder tschüs? — Begrüßung (Greeting) vs. Abschied (Farewell)

                  </h3>

                </div>

                {completedExercises.ex10 && (

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">

                    <CheckCircle2 className="w-4 h-4" /> Completed

                  </span>

                )}

              </div>



              <p className="text-xs text-slate-300">

                <strong>10a) Hören Sie die Wendungen aus dem Bildlexikon und ordnen Sie zu.</strong> Sort all 7 expressions into <strong>Begrüßung</strong> (Hello) or <strong>Abschied</strong> (Goodbye). Watch out for <em>Guten Abend</em> vs. <em>Gute Nacht</em>!

              </p>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {ex10Phrases.map((item) => (

                  <div

                    key={item.phrase}

                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"

                  >

                    <button

                      onClick={() => speakGerman(item.phrase)}

                      className="font-bold text-white hover:text-amber-300 flex items-center gap-2 cursor-pointer"

                    >

                      <Volume2 className="w-4 h-4 text-indigo-400" />

                      <span>{item.phrase}</span>

                    </button>

                    <div className="flex items-center gap-2">

                      {['Begrüßung', 'Abschied'].map((cat) => (

                        <button

                          key={cat}

                          onClick={() =>

                            setEx10Sorting({ ...ex10Sorting, [item.phrase]: cat })

                          }

                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${

                            ex10Sorting[item.phrase] === cat

                              ? cat === 'Begrüßung'

                                ? 'bg-emerald-600 border-emerald-400 text-white'

                                : 'bg-rose-600 border-rose-400 text-white'

                              : 'bg-slate-900 border-slate-700 text-slate-400'

                          }`}

                        >

                          {cat}

                        </button>

                      ))}

                      {ex10Checked && (

                        <span className="text-xs font-bold">

                          {ex10Sorting[item.phrase] === item.correct ? (

                            <span className="text-emerald-400">✓</span>

                          ) : (

                            <span className="text-rose-400">✗ ({item.correct})</span>

                          )}

                        </span>

                      )}

                    </div>

                  </div>

                ))}

              </div>



              <div className="flex items-center justify-between flex-wrap gap-4">

                <button

                  onClick={() => {

                    setEx10Checked(true);

                    const allGood = ex10Phrases.every(

                      (p) => ex10Sorting[p.phrase] === p.correct

                    );

                    if (allGood) markComplete('ex10');

                  }}

                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"

                >

                  Check Exercise 10

                </button>

                <button

                  onClick={() => setActiveTab('bonus')}

                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"

                >

                  <span>Enter Bonus Memory-Lock Arena (+Extra Exercises)</span>

                  <Sparkles className="w-4 h-4" />

                </button>

              </div>

            </section>

          </div>

        )}



        {}

        {activeTab === 'bonus' && (

          <div className="space-y-8">

            <div className="bg-gradient-to-r from-amber-500/20 via-indigo-950 to-emerald-500/20 border border-amber-500/40 rounded-2xl p-6">

              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">

                Extra Memory-Hooking Exercises (Beyond the Textbook!)

              </span>

              <h2 className="text-2xl font-extrabold text-white mt-1">

                Bonus Memory-Lock Arena: Hook Chapter 1 Into Long-Term Memory

              </h2>

              <p className="text-sm text-slate-300 mt-1">

                These 3 high-retention drills target the exact grammar patterns tested in A1 exams: Verb Conjugations (<em>kommen, heißen, sein</em>), Position-2 Word Order, and the Country Article Trap.

              </p>

            </div>



            {/* BONUS DRILL 1: Verb Conjugation Speed-Run */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

              <div className="flex items-center justify-between flex-wrap gap-2">

                <div>

                  <span className="text-xs font-bold text-amber-400 uppercase">

                    Bonus Drill #1 • Active Recall

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    Verb Conjugation Speed-Trainer (kommen • heißen • sein)

                  </h3>

                </div>

                <span className="text-xs font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-200 px-3 py-1 rounded-full">

                  Question {bonusConjIdx + 1} / {bonusConjugationQuestions.length} • Score: {bonusConjScore}

                </span>

              </div>



              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">

                <div className="flex items-center justify-between flex-wrap gap-2">

                  <div>

                    <span className="text-xs text-slate-400">Conjugate the verb:</span>

                    <div className="text-lg font-bold text-amber-300">

                      Subject: „{bonusConjugationQuestions[bonusConjIdx].pronoun}“ + Verb: „

                      {bonusConjugationQuestions[bonusConjIdx].verb}“

                    </div>

                  </div>

                  <div className="text-xl font-extrabold text-white bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">

                    {bonusConjugationQuestions[bonusConjIdx].sentence}

                  </div>

                </div>



                <div className="flex flex-wrap items-center gap-3">

                  <input

                    type="text"

                    value={bonusConjInput}

                    onChange={(e) => setBonusConjInput(e.target.value)}

                    placeholder="Type conjugated verb..."

                    className="bg-slate-900 border border-amber-400/60 rounded-xl px-4 py-2 text-white font-bold"

                  />

                  <button

                    onClick={() => {

                      const q = bonusConjugationQuestions[bonusConjIdx];

                      const isRight =

                        bonusConjInput.trim().toLowerCase() === q.answer.toLowerCase();

                      const completeSent = q.sentence.replace('___', q.answer);

                      speakGerman(completeSent);

                      if (isRight) {

                        setBonusConjScore((s) => s + 1);

                        setBonusConjFeedback(`✓ Perfekt! "${completeSent}"`);

                        markComplete('bonus1');

                      } else {

                        setBonusConjFeedback(`✗ Remember: "${completeSent}"`);

                      }

                    }}

                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"

                  >

                    Check & Hear

                  </button>

                  <button

                    onClick={() => {

                      setBonusConjIdx((bonusConjIdx + 1) % bonusConjugationQuestions.length);

                      setBonusConjInput('');

                      setBonusConjFeedback(null);

                    }}

                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-sm cursor-pointer"

                  >

                    Next Card →

                  </button>

                </div>



                {bonusConjFeedback && (

                  <div className="text-sm font-bold text-emerald-300">{bonusConjFeedback}</div>

                )}

              </div>

            </section>



            {/* BONUS DRILL 2: Position-2 Sentence Builder */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

              <div className="flex items-center justify-between flex-wrap gap-2">

                <div>

                  <span className="text-xs font-bold text-emerald-400 uppercase">

                    Bonus Drill #2 • Syntax & Position 2 Rule

                  </span>

                  <h3 className="text-xl font-bold text-white">

                    "Verb in Position 2" Sentence Architect

                  </h3>

                </div>

                <span className="text-xs text-slate-400">

                  Puzzle {puzzleIdx + 1} of {sentencePuzzles.length}

                </span>

              </div>



              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">

                <p className="text-sm text-indigo-200 font-semibold">

                  Build in German: <span className="text-white font-bold">"{sentencePuzzles[puzzleIdx].english}"</span>

                </p>



                {/* Built sentence bar */}

                <div className="min-h-[52px] bg-slate-900 border border-indigo-500/40 rounded-xl p-3 flex flex-wrap items-center gap-2">

                  {builtWords.length === 0 ? (

                    <span className="text-xs text-slate-500">

                      Click words below in order (Remember: Put the Verb in Slot #2!)...

                    </span>

                  ) : (

                    builtWords.map((w, i) => (

                      <span

                        key={i}

                        onClick={() => setBuiltWords(builtWords.filter((_, idx) => idx !== i))}

                        className={`px-3 py-1 rounded-lg font-bold text-sm cursor-pointer ${

                          i === 1

                            ? 'bg-amber-400 text-slate-950 shadow'

                            : 'bg-indigo-600 text-white'

                        }`}

                        title="Click to remove"

                      >

                        {i === 1 ? `⚡2: ${w}` : w}

                      </span>

                    ))

                  )}

                </div>



                {/* Word tiles */}

                <div className="flex flex-wrap gap-2">

                  {sentencePuzzles[puzzleIdx].words.map((w, i) => (

                    <button

                      key={i}

                      onClick={() => setBuiltWords([...builtWords, w])}

                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-bold text-white cursor-pointer"

                    >

                      {w}

                    </button>

                  ))}

                </div>



                <div className="flex flex-wrap items-center gap-3">

                  <button

                    onClick={() => {

                      const attempt = builtWords.join(' ');

                      const target = sentencePuzzles[puzzleIdx].correct;

                      speakGerman(target);

                      if (attempt === target) {

                        setPuzzleFeedback('✓ Gold Star! The verb is locked in Position 2!');

                        markComplete('bonus2');

                      } else {

                        setPuzzleFeedback(`Correct order: ${target}`);

                      }

                    }}

                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"

                  >

                    Verify Sentence

                  </button>

                  <button

                    onClick={() => {

                      setBuiltWords([]);

                      setPuzzleFeedback(null);

                    }}

                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer"

                  >

                    Clear

                  </button>

                  <button

                    onClick={() => {

                      setPuzzleIdx((puzzleIdx + 1) % sentencePuzzles.length);

                      setBuiltWords([]);

                      setPuzzleFeedback(null);

                    }}

                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"

                  >

                    Next Puzzle →

                  </button>

                </div>



                {puzzleFeedback && (

                  <p className="text-xs font-bold text-amber-300">{puzzleFeedback}</p>

                )}

              </div>

            </section>



            {/* BONUS DRILL 3: Country Preposition Trap Quiz */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

              <div>

                <span className="text-xs font-bold text-rose-400 uppercase">

                  Bonus Drill #3 • Exam Trap Eliminator

                </span>

                <h3 className="text-xl font-bold text-white">

                  „aus“ vs. „aus der“ vs. „aus dem“ Country Challenge

                </h3>

              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {countryQuiz.map((item) => (

                  <div

                    key={item.country}

                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"

                  >

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-white">

                        Ich komme ___ <span className="text-amber-300">{item.country}</span>.

                      </span>

                      <div className="flex gap-1.5">

                        {['aus', 'aus der', 'aus dem'].map((prep) => (

                          <button

                            key={prep}

                            onClick={() => {

                              setCountrySelections({

                                ...countrySelections,

                                [item.country]: prep

                              });

                              speakGerman(`Ich komme ${prep} ${item.country}.`);

                            }}

                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${

                              countrySelections[item.country] === prep

                                ? 'bg-indigo-600 border-indigo-400 text-white'

                                : 'bg-slate-900 border-slate-700 text-slate-400'

                            }`}

                          >

                            {prep}

                          </button>

                        ))}

                      </div>

                    </div>

                    {countryChecked && (

                      <div

                        className={`text-xs font-semibold ${

                          countrySelections[item.country] === item.answer

                            ? 'text-emerald-400'

                            : 'text-rose-400'

                        }`}

                      >

                        {countrySelections[item.country] === item.answer ? '✓ ' : `✗ (${item.answer}) `}

                        {item.note}

                      </div>

                    )}

                  </div>

                ))}

              </div>



              <button

                onClick={() => {

                  setCountryChecked(true);

                  markComplete('bonus3');

                }}

                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"

              >

                Check Country Prepositions

              </button>

            </section>

          </div>

        )}



        {}

        {activeTab === 'summary' && (

          <div className="space-y-8">

            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">

              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">

                Modul 1 • Seite 12 Official Summary

              </span>

              <h2 className="text-2xl font-extrabold text-white mt-1">

                GRAMMATIK & KOMMUNIKATION (Click Any Row to Hear It!)

              </h2>

              <p className="text-sm text-slate-300 mt-1">

                This is the exact reference page from Page 12 of your textbook, upgraded with interactive audio pronunciation.

              </p>

            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* GRAMMATIK COLUMN */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

                <h3 className="text-lg font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">

                  GRAMMATIK (Grammar)

                </h3>



                {/* Verb Konjugation Table */}

                <div>

                  <h4 className="text-sm font-bold text-white mb-2">Verb: Konjugation (Singular + Sie)</h4>

                  <table className="w-full text-sm bg-slate-950 rounded-xl overflow-hidden border-collapse">

                    <thead>

                      <tr className="bg-slate-800 text-slate-200 text-left">

                        <th className="p-3">Pronomen</th>

                        <th className="p-3">kommen</th>

                        <th className="p-3">heißen</th>

                        <th className="p-3">sein</th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-800">

                      {[

                        { p: 'ich', k: 'komme', h: 'heiße', s: 'bin' },

                        { p: 'du', k: 'kommst', h: 'heißt', s: 'bist' },

                        { p: 'Sie', k: 'kommen', h: 'heißen', s: 'sind' },

                        { p: 'er/sie', k: 'kommt', h: 'heißt', s: 'ist' }

                      ].map((row) => (

                        <tr

                          key={row.p}

                          onClick={() =>

                            speakGerman(`${row.p} ${row.k}, ${row.p} ${row.h}, ${row.p} ${row.s}`)

                          }

                          className="hover:bg-indigo-950/40 cursor-pointer transition"

                        >

                          <td className="p-3 font-bold text-indigo-300">{row.p}</td>

                          <td className="p-3 text-white">{row.k}</td>

                          <td className="p-3 text-white">{row.h}</td>

                          <td className="p-3 text-amber-300 font-semibold">{row.s}</td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>



                {/* W-Frage & Aussage Position 2 Tables */}

                <div className="space-y-4">

                  <h4 className="text-sm font-bold text-white">

                    W-Frage (wer, wie, woher) & Aussage — Position 2 Rule

                  </h4>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-sm">

                    <div className="text-xs font-bold text-indigo-400 uppercase mb-1">

                      W-Frage (Question Word + Verb in Position 2)

                    </div>

                    {[

                      ['Wer', 'ist', 'das?'],

                      ['Wie', 'heißen', 'Sie?'],

                      ['Woher', 'kommst', 'du?']

                    ].map((r, idx) => (

                      <div

                        key={idx}

                        onClick={() => speakGerman(r.join(' '))}

                        className="grid grid-cols-3 bg-slate-900 p-2 rounded-lg cursor-pointer hover:bg-slate-800"

                      >

                        <span>{r[0]}</span>

                        <span className="font-bold text-amber-300">{r[1]} (Pos. 2)</span>

                        <span>{r[2]}</span>

                      </div>

                    ))}

                  </div>



                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-sm">

                    <div className="text-xs font-bold text-emerald-400 uppercase mb-1">

                      Aussage (Statement + Verb in Position 2)

                    </div>

                    {[

                      ['Ich', 'heiße', 'Paco.'],

                      ['Ich', 'komme', 'aus Österreich.'],

                      ['Mein Name', 'ist', 'Valerie.']

                    ].map((r, idx) => (

                      <div

                        key={idx}

                        onClick={() => speakGerman(r.join(' '))}

                        className="grid grid-cols-3 bg-slate-900 p-2 rounded-lg cursor-pointer hover:bg-slate-800"

                      >

                        <span>{r[0]}</span>

                        <span className="font-bold text-amber-300">{r[1]} (Pos. 2)</span>

                        <span>{r[2]}</span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>



              {/* KOMMUNIKATION COLUMN */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

                <h3 className="text-lg font-extrabold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">

                  KOMMUNIKATION (Communication Phrases)

                </h3>



                {[

                  {

                    title: 'Name (Asking & Saying Names)',

                    pairs: [

                      { q: 'Wie heißen Sie? / Wie heißt du?', a: 'Ich bin / heiße Nicole.' },

                      { q: 'Wer sind Sie? / Wer bist du?', a: 'Mein Name ist Paco Rodriguez.' }

                    ]

                  },

                  {

                    title: 'Herkunft (Origin)',

                    pairs: [

                      {

                        q: 'Woher kommen Sie? / Woher kommst du?',

                        a: '(Ich komme) Aus Mexiko / Aus der Schweiz / Aus dem Iran.'

                      }

                    ]

                  },

                  {

                    title: 'sich und andere vorstellen (Introducing Yourself & Others)',

                    pairs: [

                      {

                        q: 'Das ist Paco / Frau Wachter.',

                        a: 'Er / Sie kommt aus Mexiko.'

                      }

                    ]

                  },

                  {

                    title: 'nach dem Befinden fragen (Asking How Someone Is)',

                    pairs: [

                      {

                        q: 'Wie geht es Ihnen? / Wie geht’s? / Wie geht es dir?',

                        a: 'Sehr gut. / Gut, danke. / Es geht. / Nicht so gut.'

                      },

                      {

                        q: 'Gut, danke. Und Ihnen? / Und dir?',

                        a: 'Auch gut.'

                      }

                    ]

                  },

                  {

                    title: 'um Wiederholung bitten (Asking for Repetition)',

                    pairs: [

                      {

                        q: 'Wie bitte?',

                        a: 'Ich buchstabiere: V - a - l - e - r - i - e.'

                      }

                    ]

                  }

                ].map((section, idx) => (

                  <div

                    key={idx}

                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"

                  >

                    <h4 className="text-xs font-bold uppercase text-indigo-300">

                      {section.title}

                    </h4>

                    {section.pairs.map((p, i) => (

                      <div

                        key={i}

                        onClick={() => speakGerman(`${p.q} ... ${p.a}`)}

                        className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 text-xs sm:text-sm"

                      >

                        <div>

                          <div className="font-bold text-white">{p.q}</div>

                          <div className="text-amber-300">{p.a}</div>

                        </div>

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