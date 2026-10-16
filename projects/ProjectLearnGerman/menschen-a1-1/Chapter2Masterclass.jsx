import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  Play,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Layers,
  Hash,
  Heart,
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Check,
  RefreshCw
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

const numberToGermanWord = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n) || n < 0 || n > 100) return '';
  const ones = [
    'null',
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
    90: 'neunzig',
    100: 'hundert'
  };
  if (n < 20) return ones[n];
  if (n === 100) return 'hundert';
  const o = n % 10;
  const t = n - o;
  if (o === 0) return tens[t];
  const onePart = o === 1 ? 'ein' : ones[o];
  return `${onePart}und${tens[t]}`;
};

const BILDLEXIKON_BERUFE = [
  { deM: 'der Ingenieur', deF: 'die Ingenieurin', en: 'Engineer', page: 'S. 14', icon: '⚙️', trap: false },
  { deM: 'der Mechatroniker', deF: 'die Mechatronikerin', en: 'Mechatronics Technician', page: 'S. 14', icon: '🔧', trap: false },
  { deM: 'der Schauspieler', deF: 'die Schauspielerin', en: 'Actor / Actress', page: 'S. 14', icon: '🎭', trap: false },
  { deM: 'der Student', deF: 'die Studentin', en: 'University Student', page: 'S. 14', icon: '🎓', trap: false },
  { deM: 'der Journalist', deF: 'die Journalistin', en: 'Journalist', page: 'S. 14', icon: '📰', trap: false },
  { deM: 'der Friseur', deF: 'die Friseurin', en: 'Hairdresser', page: 'S. 14', icon: '✂️', trap: false },
  { deM: 'der Architekt', deF: 'die Architektin', en: 'Architect', page: 'S. 14', icon: '📐', trap: false },
  { deM: 'der Sekretär', deF: 'die Sekretärin', en: 'Secretary / Admin', page: 'S. 15', icon: '🗂️', trap: false },
  { deM: 'der Arzt', deF: 'die Ärztin', en: 'Doctor / Physician', page: 'S. 15', icon: '🩺', trap: true, note: 'UMLAUT TRAP: A becomes Ä (Arzt → Ärztin)!' },
  { deM: 'der Lehrer', deF: 'die Lehrerin', en: 'Teacher', page: 'S. 15', icon: '🏫', trap: false },
  { deM: 'der Verkäufer', deF: 'die Verkäuferin', en: 'Salesperson', page: 'S. 15', icon: '🛍️', trap: false },
  { deM: 'der Kellner', deF: 'die Kellnerin', en: 'Waiter / Waitress', page: 'S. 15', icon: '☕', trap: false }
];

const VISITENKARTEN = [
  {
    id: 'A',
    name: 'Dr. Barbara Meinhardt-Bäuerlein',
    role: '– JOURNALISTIN –',
    street: 'Blumenallee 24',
    city: '50858 Köln',
    phone: 'Fon: 0221-4823717',
    mobile: 'Mobil: 0170-121989998',
    email: 'mb@x-media.de',
    color: 'from-amber-950/60 to-slate-900 border-amber-500/40',
    photoMatch: 2,
    audioTrackOrder: 2
  },
  {
    id: 'B',
    name: 'MARKUS BÄUERLEIN',
    role: 'Architekt',
    street: 'Bismarckstraße 18',
    city: '53113 Bonn',
    phone: 'Telefon: 0228-29028108',
    mobile: 'Handy: 0178-10103220',
    email: 'mb@homerunnersbest.net',
    color: 'from-sky-950/60 to-slate-900 border-sky-500/40',
    photoMatch: 1,
    audioTrackOrder: 3
  },
  {
    id: 'C',
    name: 'Sven Henkenjohann',
    titlePrefix: 'Diplom-Informatiker',
    role: 'IT-Spezialist',
    street: 'Großbeerenstraße 48',
    city: '10963 Berlin',
    phone: 'Telefon: 030-253812120',
    mobile: 'Handy: 0163-909865651',
    email: 'sven@galaxynet.com • www.galaxynet.com',
    color: 'from-indigo-950/60 to-slate-900 border-indigo-500/40',
    photoMatch: 3,
    audioTrackOrder: 1
  },
  {
    id: 'D',
    name: 'NADINE VAN MECHELEN',
    role: 'Schauspielerin (Berlin / Belgien)',
    street: 'Albrechtstraße 35',
    city: '12167 Berlin',
    phone: '0152-12345430',
    mobile: '',
    email: 'nadinevm@vmbelge.be',
    color: 'from-emerald-950/60 to-slate-900 border-emerald-500/40',
    photoMatch: 4,
    audioTrackOrder: 4
  }
];

const AUDIO_TRACKS = {
  '1.11': {
    title: 'Track 1.11 – Wer ist wer? (Ex. 1b, Seite 13)',
    lines: [
      {
        speaker: 'Hörtext 1 (Mann)',
        text: 'Hallo, mein Name ist Sven Henkenjohann. Ich bin Diplom-Informatiker von Beruf und arbeite als IT-Spezialist in Berlin.'
      },
      {
        speaker: 'Hörtext 2 (Frau)',
        text: 'Guten Tag! Ich heiße Barbara Meinhardt-Bäuerlein. Ich wohne in Köln und arbeite als Journalistin bei X-Media.'
      },
      {
        speaker: 'Hörtext 3 (Mann)',
        text: 'Grüß Gott, ich bin Markus Bäuerlein. Ich bin Architekt und lebe in Bonn.'
      },
      {
        speaker: 'Hörtext 4 (Frau)',
        text: 'Hallo! Ich bin Nadine van Mechelen. Ich komme aus Belgien, aber ich lebe jetzt in Berlin.'
      }
    ]
  },
  '1.12': {
    title: 'Track 1.12 – Ich arbeite als Journalistin (Ex. 2a, Seite 14)',
    lines: [
      {
        speaker: 'Interviewer',
        text: 'Frau Meinhardt-Bäuerlein, was sind Sie von Beruf?'
      },
      {
        speaker: 'Barbara',
        text: 'Ich bin Historikerin. Aber ich arbeite als Journalistin bei X-Media in Köln.'
      }
    ]
  },
  '1.13': {
    title: 'Track 1.13 – Interview mit Barbara und Markus (Ex. 3b, Seite 15)',
    lines: [
      {
        speaker: 'Interviewer',
        text: 'Frau Meinhardt-Bäuerlein, Herr Bäuerlein – Sie heißen beide Bäuerlein. Sind Sie verheiratet?'
      },
      {
        speaker: 'Barbara',
        text: 'Nein, wir sind nicht verheiratet. Wir sind geschieden!'
      },
      {
        speaker: 'Markus',
        text: 'Ja, wir sind geschieden, aber wir haben zwei Kinder zusammen.'
      },
      {
        speaker: 'Interviewer',
        text: 'Und leben Sie zusammen?'
      },
      {
        speaker: 'Barbara',
        text: 'Nein, wir leben nicht zusammen. Ich wohne in Köln und Markus wohnt in Bonn.'
      }
    ]
  },
  '1.14': {
    title: 'Track 1.14 & 1.16 – Sven und Nadine im Interview (Ex. 3c & 5a, Seite 15)',
    lines: [
      {
        speaker: 'Interviewer',
        text: 'Sven und Nadine, was habt ihr gemeinsam? Wo wohnt ihr?'
      },
      {
        speaker: 'Nadine',
        text: 'Wir wohnen beide in Berlin! Ich wohne in der Albrechtstraße und Sven wohnt in der Großbeerenstraße.'
      },
      {
        speaker: 'Interviewer',
        text: 'Und wie alt seid ihr?'
      },
      {
        speaker: 'Sven',
        text: 'Ich bin fünfunddreißig Jahre alt.'
      },
      {
        speaker: 'Nadine',
        text: 'Echt? Hey super – ich bin auch fünfunddreißig! Wir sind beide 35!'
      }
    ]
  }
};

const AudioTrackPlayer = ({ trackId, speechRate }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const track = AUDIO_TRACKS[trackId];
  if (!track) return null;

  const playFull = () => {
    const joined = track.lines.map((l) => l.text).join(' ... ');
    speakGerman(joined, speechRate);
  };

  return (
    <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={playFull}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Audio {trackId}</span>
          </button>
          <span className="text-sm font-semibold text-indigo-200">{track.title}</span>
        </div>
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer"
        >
          {showTranscript ? 'Hide Transcript' : 'Show Audio Transcript & Click-to-Speak Lines'}
        </button>
      </div>

      {showTranscript && (
        <div className="mt-3 pt-3 border-t border-indigo-800/60 space-y-2">
          {track.lines.map((line, idx) => (
            <div
              key={idx}
              onClick={() => speakGerman(line.text, speechRate)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 cursor-pointer transition"
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

export default function Chapter2Masterclass() {
  const [activeTab, setActiveTab] = useState('learn');
  const [speechRate, setSpeechRate] = useState(0.92);
  const [completed, setCompleted] = useState({});

  const markDone = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
  };

  // Interactive Gender Flipper in Tab 1
  const [selectedJobIdx, setSelectedJobIdx] = useState(8); // Arzt / Ärztin default

  // --- EXERCISE 1a & 1b STATE (Page 13) ---
  const [ex1aPhotoGuesses, setEx1aPhotoGuesses] = useState({
    photo1: 'Markus Bäuerlein',
    photo2: '',
    photo3: '',
    photo4: ''
  });
  const [ex1bMatches, setEx1bMatches] = useState({
    1: 'C', // pre-filled in textbook
    2: '',
    3: '',
    4: ''
  });
  const [ex1Checked, setEx1Checked] = useState(false);

  // --- EXERCISE 2a, 2b, 2c, 2d STATE (Page 14) ---
  const [ex2aMatches, setEx2aMatches] = useState({
    bin: '',
    als: '',
    bei: ''
  });
  const [ex2aChecked, setEx2aChecked] = useState(false);

  // Ex 2b & 2c Pinboard Kärtchen & Classroom Search
  const [customCardType, setCustomCardType] = useState('Beruf');
  const [customCardRole, setCustomCardRole] = useState('Softwareentwickler');
  const [customCardCompany, setCustomCardCompany] = useState('Siemens');
  const [ex2cSelectedCard, setEx2cSelectedCard] = useState(0);

  // --- EXERCISE 3a, 3b, 3c, 3d STATE (Pages 14–15) ---
  const ex3aItems = [
    { id: 's1', text: 'Wir sind verheiratet.', correctPic: '1', clue: 'Two linked golden wedding rings 💍💍' },
    { id: 's2', text: 'Wir sind geschieden.', correctPic: '2', clue: 'Two broken wedding rings 💔' },
    { id: 's3', text: 'Wir sind nicht verheiratet, aber Peter und ich leben zusammen.', correctPic: '4', clue: 'Unmarried couple relaxing together on the sofa 🛋️' },
    { id: 's4', text: 'Wir haben ein Kind.', correctPic: '3', clue: 'Parents with a child on shoulders 👨👩👦' },
    { id: 's5', text: 'Ich bin Single. / Ich lebe allein.', correctPic: '5', clue: 'Happy single person living solo 🙋🏼♂️' }
  ];
  const [ex3aAnswers, setEx3aAnswers] = useState({ s4: '3', s5: '5', s1: '', s2: '', s3: '' });
  const [ex3aChecked, setEx3aChecked] = useState(false);

  // Ex 3b (Page 15)
  const [ex3bQ1, setEx3bQ1] = useState(''); // geschieden
  const [ex3bQ2, setEx3bQ2] = useState(''); // zwei Kinder
  const [ex3bQ3, setEx3bQ3] = useState(''); // leben nicht zusammen
  const [ex3bChecked, setEx3bChecked] = useState(false);

  // Ex 3c (Page 15)
  const [ex3cPair, setEx3cPair] = useState('sven_nadine');
  const [ex3cVerb, setEx3cVerb] = useState('');
  const [ex3cChecked, setEx3cChecked] = useState(false);

  // --- EXERCISE 4a & 4b STATE (Page 15: Zahlen 0-100) ---
  const [ex4Gaps, setEx4Gaps] = useState({
    n13: '',
    n15: '',
    n18: '',
    n40: '',
    n70: '',
    n90: '',
    n100: '',
    n62: ''
  });
  const [ex4Checked, setEx4Checked] = useState(false);
  const [liveNumber, setLiveNumber] = useState(35);

  // --- EXERCISE 5a & 5b STATE (Page 15: Wie alt bist du?) ---
  const [ex5aAge, setEx5aAge] = useState(''); // 35.
  const [ex5aCity, setEx5aCity] = useState(''); // In Berlin.
  const [ex5aChecked, setEx5aChecked] = useState(false);
  const [echoTopic, setEchoTopic] = useState('Alter');
  const [echoInput, setEchoInput] = useState('24');

  // --- EXERCISE 6 STATE (Page 15 / Pages 78 & 82 Partner Cards) ---
  const partnerCards = [
    {
      name: 'Lukas Weber',
      pronoun: 'Er',
      origin: 'Österreich',
      city: 'Wien',
      job: 'Mechatroniker',
      employer: 'BMW',
      age: 28,
      status: 'verheiratet',
      children: 'ein Kind'
    },
    {
      name: 'Elena Rossi',
      pronoun: 'Sie',
      origin: 'Italien',
      city: 'München',
      job: 'Architektin',
      employer: 'Studio Rossi',
      age: 32,
      status: 'Single',
      children: 'keine Kinder'
    },
    {
      name: 'Tim & Laura',
      pronoun: 'Sie (Plural)',
      origin: 'der Schweiz',
      city: 'Zürich',
      job: 'Lehrer',
      employer: 'Schule Nord',
      age: 39,
      status: 'nicht verheiratet (leben zusammen)',
      children: 'zwei Kinder'
    }
  ];
  const [ex6CardIdx, setEx6CardIdx] = useState(0);

  // --- EXERCISE 7a & 7b STATE (Page 16: Schreibtraining Steckbrief) ---
  const metteTokens = [
    { word: 'Ich', isVerb: false },
    { word: 'heiße', isVerb: true },
    { word: 'Mette', isVerb: false },
    { word: 'Svendsen', isVerb: false },
    { word: 'und', isVerb: false },
    { word: 'komme', isVerb: true },
    { word: 'aus', isVerb: false },
    { word: 'Dänemark.', isVerb: false },
    { word: 'Ich', isVerb: false },
    { word: 'wohne', isVerb: true },
    { word: 'in', isVerb: false },
    { word: 'Kopenhagen.', isVerb: false },
    { word: 'Ich', isVerb: false },
    { word: 'bin', isVerb: true },
    { word: 'Studentin', isVerb: false },
    { word: 'und', isVerb: false },
    { word: 'habe', isVerb: true },
    { word: 'einen', isVerb: false },
    { word: 'Job', isVerb: false },
    { word: 'als', isVerb: false },
    { word: 'Kellnerin.', isVerb: false },
    { word: 'Ich', isVerb: false },
    { word: 'bin', isVerb: true },
    { word: '24', isVerb: false },
    { word: 'Jahre', isVerb: false },
    { word: 'alt,', isVerb: false },
    { word: 'Single', isVerb: false },
    { word: 'und', isVerb: false },
    { word: 'habe', isVerb: true },
    { word: 'keine', isVerb: false },
    { word: 'Kinder.', isVerb: false }
  ];
  const [markedVerbIndices, setMarkedVerbIndices] = useState([1]); // 'heiße' pre-marked as in book
  const [ex7aChecked, setEx7aChecked] = useState(false);

  // 7b User Steckbrief
  const [userSteckbrief, setUserSteckbrief] = useState({
    vorname: 'Aarav',
    familienname: 'Sharma',
    herkunft: 'Indien',
    wohnort: 'Delhi',
    beruf: 'Ingenieur',
    arbeitgeber: 'TechCorp',
    alter: '25',
    familienstand: 'Single',
    kinder: 'keine Kinder'
  });

  // --- BONUS ARENA STATES ---
  // Bonus 1: Preposition Sniper (als / bei / in / aus / von)
  const prepQuestions = [
    { q: 'Ich arbeite ___ Journalistin.', ans: 'als', why: 'Use "als" + profession/role!' },
    { q: 'Ich arbeite ___ X-Media.', ans: 'bei', why: 'Use "bei" + company/employer name!' },
    { q: 'Barbara wohnt ___ Köln.', ans: 'in', why: 'Use "in" + city/place of residence!' },
    { q: 'Was sind Sie ___ Beruf?', ans: 'von', why: 'Fixed idiom: "Was sind Sie von Beruf?"' },
    { q: 'Ich mache ein Praktikum ___ Mertz & Co.', ans: 'bei', why: 'Mertz & Co. is a company → "bei"!' },
    { q: 'Ich habe einen Job ___ Kellnerin.', ans: 'als', why: 'Kellnerin is the role/job → "als"!' },
    { q: 'Sven und Nadine leben ___ Berlin.', ans: 'in', why: 'Berlin is a city → "in"!' },
    { q: 'Mette kommt ___ Dänemark.', ans: 'aus', why: 'Origin (Herkunft) always takes "aus"!' }
  ];
  const [prepSelections, setPrepSelections] = useState({});
  const [prepChecked, setPrepChecked] = useState(false);

  // Bonus 2: Conjugation Blitz (Singular & Plural)
  const conjDrill = [
    { subj: 'du', verb: 'arbeiten', ans: 'arbeitest', sent: 'Wo ___ du?', hint: 'Stem ends in -t → add cushion -e- + -st!' },
    { subj: 'du', verb: 'haben', ans: 'hast', sent: '___ du Kinder?', hint: 'Special form: drops the "b" → du hast!' },
    { subj: 'er/sie', verb: 'haben', ans: 'hat', sent: 'Er ___ zwei Kinder.', hint: 'Special form: drops the "b" → er/sie hat!' },
    { subj: 'wir', verb: 'sein', ans: 'sind', sent: 'Wir ___ verheiratet.', hint: 'Irregular plural: wir sind!' },
    { subj: 'ihr', verb: 'sein', ans: 'seid', sent: 'Wie alt ___ ihr?', hint: 'Watch out: ihr seid (with a d)!' },
    { subj: 'ihr', verb: 'arbeiten', ans: 'arbeitet', sent: 'Wo ___ ihr?', hint: 'ihr + cushion -e- + -t → arbeitet!' },
    { subj: 'ihr', verb: 'haben', ans: 'habt', sent: 'Was ___ ihr gemeinsam?', hint: 'Regular in plural: ihr habt!' },
    { subj: 'sie (they)', verb: 'wohnen', ans: 'wohnen', sent: 'Sven und Nadine ___ in Berlin.', hint: 'Plural "sie" ends in -en!' }
  ];
  const [conjIdx, setConjIdx] = useState(0);
  const [conjInput, setConjInput] = useState('');
  const [conjFeedback, setConjFeedback] = useState(null);

  // Bonus 3: Numbers Ear-Trainer (0-100)
  const numberChallenges = [16, 17, 30, 35, 62, 70, 84, 99];
  const [numQuizIdx, setNumQuizIdx] = useState(0);
  const [numWordInput, setNumWordInput] = useState('');
  const [numQuizFeedback, setNumQuizFeedback] = useState(null);

  const totalTasks = 16;
  const doneCount = Object.keys(completed).length;
  const progressPct = Math.min(100, Math.round((doneCount / totalTasks) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              L2
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Menschen A1 • Lektion 2 (Seiten 13–16)
                </span>
                <button
                  onClick={() => setSpeechRate(speechRate === 0.92 ? 0.72 : 0.92)}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold cursor-pointer hover:bg-amber-500/30 transition"
                  title="Toggle between normal and slow learner pronunciation"
                >
                  {speechRate === 0.92 ? '🐇 Audio: Normal (0.92x)' : '🐢 Audio: Slow Learner (0.72x)'}
                </button>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                Ich bin Journalistin — Complete Interactive Masterclass
              </h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 min-w-[240px]">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-400" /> Chapter 2 Mastery
              </span>
              <span className="text-emerald-400">
                {doneCount} / {totalTasks} Completed ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-2 pb-3">
          {[
            { id: 'learn', label: '1. Deep Lesson & 7 Memory Hooks', icon: Brain },
            { id: 'ex1to3', label: '2. Exercises 1–3 (Pages 13–15)', icon: Briefcase },
            { id: 'ex4to7', label: '3. Exercises 4–7 (Pages 15–16)', icon: Hash },
            { id: 'bonus', label: '4. Bonus Memory-Lock Arena (+4 Drills)', icon: Sparkles },
            { id: 'summary', label: '5. Page 16 Grammar & Bildlexikon', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
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
            {/* Overview Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    What You Will Master in Chapter 2 (Seiten 13–16)
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Professions, Business Cards, Marital Status, Plurals & Numbers 0–100
                  </h2>
                </div>
                <button
                  onClick={() =>
                    speakGerman(
                      'Ich bin Historikerin. Ich arbeite als Journalistin bei X-Media. Wir sind geschieden, aber wir haben zwei Kinder. Ich bin fünfunddreißig Jahre alt.',
                      speechRate
                    )
                  }
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Hear Chapter 2 Key Sentences
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                In Chapter 1 you learned how to say your name and country. Now in <strong>Chapter 2</strong>, you unlock how to talk about your <strong>career & work</strong> (<em>Beruf, Ausbildung, Praktikum, Job</em>), read German <strong>business cards</strong> (<em>Visitenkarten</em>), describe your <strong>family & relationship status</strong> (<em>verheiratet, geschieden, Single, Kinder</em>), conjugate verbs in the <strong>Plural</strong> (<em>wir, ihr, sie</em>), count from <strong>0 to 100</strong>, and write a complete <strong>personal profile</strong> (<em>Steckbrief</em>).
              </p>

              {/* Interactive Gender Transformer Widget */}
              <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interactive Bildlexikon (Pages 14–15 Top Banner): Male vs. Female (-in) Professions
                  </span>
                  <span className="text-xs text-slate-400">Click any profession to compare & hear!</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-4">
                  {BILDLEXIKON_BERUFE.map((job, idx) => (
                    <button
                      key={job.en}
                      onClick={() => {
                        setSelectedJobIdx(idx);
                        speakGerman(`${job.deM}. ${job.deF}.`, speechRate);
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedJobIdx === idx
                          ? 'bg-indigo-900/70 border-amber-400 shadow'
                          : job.trap
                          ? 'bg-rose-950/30 border-rose-500/40 hover:bg-rose-950/50'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{job.icon}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {job.page}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-sky-300 mt-1">{job.deM}</div>
                      <div className="font-bold text-xs text-amber-300">{job.deF}</div>
                      <div className="text-[11px] text-slate-400">{job.en}</div>
                    </button>
                  ))}
                </div>

                {BILDLEXIKON_BERUFE[selectedJobIdx] && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-slate-400 mr-2">Selected Rule:</span>
                      <strong className="text-sky-300">{BILDLEXIKON_BERUFE[selectedJobIdx].deM}</strong>
                      <span className="mx-2 text-slate-500">→ (+ -in) →</span>
                      <strong className="text-amber-300">
                        {BILDLEXIKON_BERUFE[selectedJobIdx].deF}
                      </strong>
                      {BILDLEXIKON_BERUFE[selectedJobIdx].trap && (
                        <span className="ml-3 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                          {BILDLEXIKON_BERUFE[selectedJobIdx].note}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        speakGerman(
                          `Er ist ${BILDLEXIKON_BERUFE[selectedJobIdx].deM.replace('der ', '')}. Sie ist ${BILDLEXIKON_BERUFE[selectedJobIdx].deF.replace('die ', '')}.`,
                          speechRate
                        )
                      }
                      className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Hear in Full Sentence
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* THE 7 FOREVER MEMORY HOOKS */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-extrabold text-white">
                  7 "Forever Memory Hooks" (Gehirn-Anker) for Chapter 2
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hook 1: als vs bei vs in */}
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    MEMORY HOOK #1 • PREPOSITIONS (S. 14 & 16)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The Career Triangle: „als“ (Hat) vs. „bei“ (Building) vs. „in“ (City)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Never confuse how to talk about your work again—just picture what follows the word:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div
                      onClick={() => speakGerman('Ich bin Historikerin.', speechRate)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500/50"
                    >
                      🎩 <strong>Ich bin + [Profession]</strong> (No article! Your qualification):{' '}
                      <span className="text-amber-300 font-bold">„Ich bin Historikerin.“</span>
                    </div>
                    <div
                      onClick={() => speakGerman('Ich arbeite als Journalistin.', speechRate)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500/50"
                    >
                      🪪 <strong>als + [Role/Title]</strong> (Think: <em>als = AS a...</em>):{' '}
                      <span className="text-emerald-300 font-bold">
                        „Ich arbeite als Journalistin.“
                      </span>
                    </div>
                    <div
                      onClick={() => speakGerman('Ich arbeite bei X-Media.', speechRate)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500/50"
                    >
                      🏢 <strong>bei + [Company/Employer]</strong> (Think: <em>B = Building/Boss</em>):{' '}
                      <span className="text-sky-300 font-bold">„Ich arbeite bei X-Media.“</span>
                    </div>
                    <div
                      onClick={() => speakGerman('Ich wohne und lebe in Köln.', speechRate)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500/50"
                    >
                      📍 <strong>in + [City]</strong> (Location):{' '}
                      <span className="text-indigo-300 font-bold">„Ich lebe in Köln.“</span>
                    </div>
                  </div>
                </div>

                {/* Hook 2: arbeiten & haben traps */}
                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">
                    MEMORY HOOK #2 • VERB TRAPS (S. 14 & 16)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The "E-Cushion" in <em>arbeiten</em> & The "B-Thief" in <em>haben</em>
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-amber-300 block mb-1">
                        1. Why is it „du arbeitest“ and „er arbeitet“?
                      </strong>
                      The stem <code>arbeit-</code> ends in a hard <strong>-t</strong>. Try saying <em>"arbeitst"</em>—your tongue gets stuck! So German inserts a soft <strong>-e- cushion</strong> before <code>-st</code> and <code>-t</code>:
                      <div className="mt-1 font-mono text-white">
                        du arbeit<span className="text-amber-400 font-bold">e</span>st • er/sie arbeit<span className="text-amber-400 font-bold">e</span>t • ihr arbeit<span className="text-amber-400 font-bold">e</span>t
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-sky-300 block mb-1">
                        2. Why is it „du hast“ and „er/sie hat“?
                      </strong>
                      In <code>haben</code> (to have), the 2nd and 3rd person singular steal the letter <strong>b</strong> so it’s faster to say!
                      <div className="mt-1 font-mono text-white">
                        ich habe • <span className="text-rose-400 font-bold">du hast</span> • <span className="text-rose-400 font-bold">er/sie hat</span> • wir haben • ihr habt
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hook 3: Plural Sandwich */}
                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                    MEMORY HOOK #3 • PLURAL PRONOUNS (S. 15)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The Plural "Clone Rule": <em>wir</em> & <em>sie/Sie</em> vs. <em>ihr</em>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Plural conjugation is the easiest part of German once you see this pattern:
                  </p>
                  <ul className="text-xs space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <li>
                      • <strong className="text-emerald-300">wir (we)</strong> and{' '}
                      <strong className="text-emerald-300">sie (they) / Sie (You)</strong> always end in{' '}
                      <strong>-en</strong> (except <em>sein → wir/sie sind</em>):
                      <div className="text-slate-300 font-mono mt-0.5">
                        wir wohnen / arbeiten / haben • sie wohnen / arbeiten / haben
                      </div>
                    </li>
                    <li>
                      • <strong className="text-amber-300">ihr (you guys - plural of du)</strong> always ends in{' '}
                      <strong>-t</strong> (just like <em>er/sie</em>!):
                      <div className="text-slate-300 font-mono mt-0.5">
                        ihr wohnt • ihr arbeitet • ihr habt • <span className="text-amber-300 font-bold">ihr seid</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Hook 4: Numbers 0-100 */}
                <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-3">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold">
                    MEMORY HOOK #4 • NUMBERS 0–100 (S. 15)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    The 5 Spelling Traps (16, 17, 30, 60, 70) & "Ones-First" Flip
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      ✂️ <strong>Drop the "s" in 6:</strong> <code>sechs</code> →{' '}
                      <strong className="text-amber-300">sechzehn (16)</strong> &{' '}
                      <strong className="text-amber-300">sechzig (60)</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      ✂️ <strong>Drop the "en" in 7:</strong> <code>sieben</code> →{' '}
                      <strong className="text-amber-300">siebzehn (17)</strong> &{' '}
                      <strong className="text-amber-300">siebzig (70)</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40">
                      🚨 <strong>The 30 Rebel:</strong> Every tens number ends in <code>-zig</code> EXCEPT 30, which is spelled with <strong>ß</strong>:{' '}
                      <strong className="text-rose-300">dreißig (30)</strong>!
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      🔄 <strong>21–99 Read Right-to-Left:</strong> Say the <strong>Ones + und + Tens</strong> as one glued word! (e.g., <code>35</code> = 5 and 30 ={' '}
                      <strong className="text-emerald-300">fünfunddreißig</strong>; <code>21</code> drops the s in eins = <strong className="text-emerald-300">einundzwanzig</strong>).
                    </div>
                  </div>
                </div>

                {/* Hook 5: Negation mit nicht vs keine */}
                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold">
                    MEMORY HOOK #5 • NEGATION (S. 14 & 16)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    When to Use „nicht“ vs. „keine“
                  </h3>
                  <p className="text-xs text-slate-300">
                    In Chapter 2, you meet both negation words. Here is the crystal-clear rule:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <strong className="text-purple-300">Use „nicht“ for adjectives, places & verbs:</strong>
                      <p className="mt-1 text-slate-300">
                        • Wir sind <strong>nicht</strong> verheiratet.<br />
                        • Wir leben <strong>nicht</strong> zusammen.<br />
                        • Sie wohnt <strong>nicht</strong> in Köln.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <strong className="text-amber-300">Use „keine“ before plural nouns (Kinder):</strong>
                      <p className="mt-1 text-slate-300">
                        • Wir haben ein Kind. (1 child)<br />
                        • Wir haben zwei Kinder. (2 children)<br />
                        • Wir haben <strong>keine</strong> Kinder. (no children)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hook 6 & 7: Career Stages */}
                <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold">
                    MEMORY HOOK #6 & #7 • CAREER EXPRESSIONS (S. 14)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    4 Ways to Answer „Was machst du beruflich?“
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      1️⃣ <strong>Full Profession:</strong> <em>„Ich bin Architekt / Ich arbeite als Architekt.“</em>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      2️⃣ <strong>Apprenticeship (Vocational Training):</strong>{' '}
                      <em>„Ich mache eine <strong>Ausbildung</strong> als Friseurin.“</em>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      3️⃣ <strong>Internship:</strong>{' '}
                      <em>„Ich mache ein <strong>Praktikum</strong> bei Mertz & Co.“</em>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      4️⃣ <strong>Student Side-Job:</strong>{' '}
                      <em>„Ich bin Studentin und habe einen <strong>Job</strong> als Kellnerin.“</em>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('ex1to3')}
                className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer transition"
              >
                <span>Start Textbook Exercises 1–3 (Pages 13–15)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === 'ex1to3' && (
          <div className="space-y-8">
            {/* EXERCISE 1 (1a & 1b) - Page 13 */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seite 13 • Übung 1a & 1b (Track 1.11)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    1. Ich bin Diplom-Informatiker — Fotos & Visitenkarten (A–D)
                  </h3>
                </div>
                {completed.ex1 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 4 Business Cards from Page 13 */}
              <div>
                <h4 className="text-sm font-bold text-indigo-300 mb-3">
                  1a) Sehen Sie die Fotos (1–4) und die Visitenkarten (A–D) an. Click any card to hear it read aloud:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VISITENKARTEN.map((card) => (
                    <div
                      key={card.id}
                      onClick={() =>
                        speakGerman(
                          `Visitenkarte ${card.id}: ${card.titlePrefix || ''} ${card.name}, ${card.role}, ${card.street}, ${card.city}.`,
                          speechRate
                        )
                      }
                      className={`bg-gradient-to-br ${card.color} border rounded-xl p-4 shadow-md hover:scale-[1.01] transition cursor-pointer relative`}
                    >
                      <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-black text-amber-400 text-sm">
                        {card.id}
                      </span>
                      {card.titlePrefix && (
                        <div className="text-xs text-indigo-300 font-semibold">
                          {card.titlePrefix}
                        </div>
                      )}
                      <div className="text-lg font-extrabold text-white pr-8">{card.name}</div>
                      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                        {card.role}
                      </div>
                      <div className="text-xs text-slate-300 space-y-1 font-mono">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {card.street} • {card.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {card.phone} {card.mobile && `| ${card.mobile}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{card.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1a Speaking Speculation Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm space-y-1">
                  <div className="font-bold text-amber-300">1a) Redemittel (Speaking Practice):</div>
                  <div>● „Foto 1: Das ist Markus Bäuerlein.“</div>
                  <div>▲ „Ja, das glaube ich auch.“ / „Nein, ich glaube, das ist Sven Henkenjohann.“</div>
                </div>
                <button
                  onClick={() =>
                    speakGerman(
                      'Das ist Markus Bäuerlein. Ja, das glaube ich auch. Nein, ich glaube, das ist Sven Henkenjohann.',
                      speechRate
                    )
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Hear 1a Dialogue
                </button>
              </div>

              {/* 1b Audio & Matching Table */}
              <div className="space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  1b) Hören Sie (Track 1.11) und ordnen Sie zu: Welcher Hörtext (1–4) passt zu welcher Visitenkarte (A–D)?
                </h4>
                <AudioTrackPlayer trackId="1.11" speechRate={speechRate} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { trackNum: 1, correct: 'C', speakerHint: 'Sven Henkenjohann (IT)' },
                    { trackNum: 2, correct: 'A', speakerHint: 'Dr. Barbara Meinhardt-Bäuerlein' },
                    { trackNum: 3, correct: 'B', speakerHint: 'Markus Bäuerlein (Architekt)' },
                    { trackNum: 4, correct: 'D', speakerHint: 'Nadine van Mechelen' }
                  ].map((item) => (
                    <div
                      key={item.trackNum}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2"
                    >
                      <div className="text-xs font-bold text-slate-400">
                        Hörtext {item.trackNum}
                      </div>
                      <select
                        value={ex1bMatches[item.trackNum]}
                        onChange={(e) =>
                          setEx1bMatches({ ...ex1bMatches, [item.trackNum]: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-indigo-500/40 rounded-lg px-3 py-2 text-center font-black text-amber-300"
                      >
                        <option value="">Visitenkarte ?</option>
                        {['A', 'B', 'C', 'D'].map((letter) => (
                          <option key={letter} value={letter}>
                            Visitenkarte {letter}
                          </option>
                        ))}
                      </select>
                      {ex1Checked && (
                        <div className="text-xs font-bold">
                          {ex1bMatches[item.trackNum] === item.correct ? (
                            <span className="text-emerald-400">✓ {item.correct}</span>
                          ) : (
                            <span className="text-rose-400">✗ (Correct: {item.correct})</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setEx1Checked(true);
                    if (
                      ex1bMatches[1] === 'C' &&
                      ex1bMatches[2] === 'A' &&
                      ex1bMatches[3] === 'B' &&
                      ex1bMatches[4] === 'D'
                    ) {
                      markDone('ex1');
                    }
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"
                >
                  Check Exercise 1b
                </button>
              </div>
            </section>

            {/* EXERCISE 2 (2a, 2b, 2c, 2d) - Page 14 */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seite 14 • Übung 2a, 2b, 2c & 2d (Track 1.12)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    2. Ich arbeite als Journalistin — Berufe, Kärtchen & Wortbildung (-in)
                  </h3>
                </div>
                {completed.ex2 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <AudioTrackPlayer trackId="1.12" speechRate={speechRate} />

              {/* 2a Matching */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  2a) Hören Sie (Track 1.12) und ordnen Sie zu. What does Barbara say?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'bin', left: 'Ich bin ...', correct: 'Historikerin.', hint: 'Her studied degree/background' },
                    { key: 'als', left: 'Ich arbeite als ...', correct: 'Journalistin.', hint: 'als + current job role' },
                    { key: 'bei', left: 'Ich arbeite bei ...', correct: 'X-Media.', hint: 'bei + employer/company name' }
                  ].map((row) => (
                    <div key={row.key} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-white">{row.left}</div>
                      <select
                        value={ex2aMatches[row.key]}
                        onChange={(e) =>
                          setEx2aMatches({ ...ex2aMatches, [row.key]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold text-sm"
                      >
                        <option value="">-- Choose ending --</option>
                        <option value="Journalistin.">Journalistin.</option>
                        <option value="X-Media.">X-Media.</option>
                        <option value="Historikerin.">Historikerin.</option>
                      </select>
                      {ex2aChecked && (
                        <div className="text-xs font-bold">
                          {ex2aMatches[row.key] === row.correct ? (
                            <span className="text-emerald-400">✓ {row.correct}</span>
                          ) : (
                            <span className="text-rose-400">✗ ({row.correct})</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEx2aChecked(true);
                    if (
                      ex2aMatches.bin === 'Historikerin.' &&
                      ex2aMatches.als === 'Journalistin.' &&
                      ex2aMatches.bei === 'X-Media.'
                    ) {
                      markDone('ex2');
                    }
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check 2a Answers
                </button>
              </div>

              {/* 2b, 2c, 2d Interactive Plakat & Classroom Roleplay */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-indigo-300 text-sm">
                    2b & 2c) Kärtchen auf dem Plakat: Wer hat die Kärtchen geschrieben?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click any of the 4 yellow pinboard cards from Page 14 to hear the question & full spoken answer:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        card: 'Ausbildung: Friseur',
                        person: 'Carmen',
                        q: 'Carmen, was machst du beruflich?',
                        a: 'Ich mache eine Ausbildung als Friseurin.'
                      },
                      {
                        card: 'Praktikum: Mertz & Co.',
                        person: 'Jonas',
                        q: 'Jonas, was machst du beruflich?',
                        a: 'Ich mache ein Praktikum bei Mertz und Co.'
                      },
                      {
                        card: 'Beruf: Journalistin',
                        person: 'Barbara',
                        q: 'Frau Bäuerlein, was sind Sie von Beruf?',
                        a: 'Ich bin Journalistin von Beruf.'
                      },
                      {
                        card: 'Studentin und Job als Kellnerin',
                        person: 'Mette',
                        q: 'Mette, was machst du beruflich?',
                        a: 'Ich bin Studentin und ich habe einen Job als Kellnerin.'
                      }
                    ].map((c, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setEx2cSelectedCard(i);
                          speakGerman(`${c.q} ... ${c.a}`, speechRate);
                          markDone('ex2c');
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          ex2cSelectedCard === i
                            ? 'bg-amber-400/20 border-amber-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-mono text-xs text-amber-300 font-bold mb-1">
                          📌 {c.card}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <strong>Q:</strong> {c.q}
                        </div>
                        <div className="text-[11px] text-emerald-300">
                          <strong>A:</strong> {c.a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2d Internet-Profil Generator */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-emerald-300 text-sm">
                    2b & 2d) Build Your Own Beruf-Kärtchen & Internet-Profil (Seite 74)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Status Type:</label>
                      <select
                        value={customCardType}
                        onChange={(e) => setCustomCardType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                      >
                        <option value="Beruf">Beruf (Full Job)</option>
                        <option value="Ausbildung">Ausbildung (Apprentice)</option>
                        <option value="Praktikum">Praktikum (Intern)</option>
                        <option value="Job">Student + Job</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Role (als):</label>
                      <input
                        type="text"
                        value={customCardRole}
                        onChange={(e) => setCustomCardRole(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Employer (bei):</label>
                      <input
                        type="text"
                        value={customCardCompany}
                        onChange={(e) => setCustomCardCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sky-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold">Your Generated Spoken Answer:</div>
                    <div className="text-sm font-bold text-white">
                      {customCardType === 'Beruf' &&
                        `„Ich bin ${customCardRole} von Beruf und arbeite bei ${customCardCompany}.“`}
                      {customCardType === 'Ausbildung' &&
                        `„Ich mache eine Ausbildung als ${customCardRole} bei ${customCardCompany}.“`}
                      {customCardType === 'Praktikum' &&
                        `„Ich mache ein Praktikum als ${customCardRole} bei ${customCardCompany}.“`}
                      {customCardType === 'Job' &&
                        `„Ich bin Student und habe einen Job als ${customCardRole} bei ${customCardCompany}.“`}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const text =
                        customCardType === 'Beruf'
                          ? `Ich bin ${customCardRole} von Beruf und arbeite bei ${customCardCompany}.`
                          : customCardType === 'Ausbildung'
                          ? `Ich mache eine Ausbildung als ${customCardRole} bei ${customCardCompany}.`
                          : customCardType === 'Praktikum'
                          ? `Ich mache ein Praktikum als ${customCardRole} bei ${customCardCompany}.`
                          : `Ich bin Student und habe einen Job als ${customCardRole} bei ${customCardCompany}.`;
                      speakGerman(text, speechRate);
                      markDone('ex2d');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Speak My Career Profile
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 3 (3a, 3b, 3c, 3d) - Pages 14–15 */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seiten 14 & 15 • Übung 3a, 3b, 3c & 3d (Tracks 1.13 & 1.14)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    3. Wir sind verheiratet — Familienstand, Interview & Plural-Konjugation
                  </h3>
                </div>
                {completed.ex3 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 3a: 5 Pinboard Pictures & Matching */}
              <div className="space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  3a) Familienstand: Ordnen Sie die Aussagen den Bildern (1–5) auf Seite 14 zu.
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { num: '1', emoji: '💍💍', title: 'Bild 1', desc: 'Two linked wedding rings' },
                    { num: '2', emoji: '💔💍', title: 'Bild 2', desc: 'Two broken wedding rings' },
                    { num: '3', emoji: '👨👩👦', title: 'Bild 3', desc: 'Parents + child on shoulders' },
                    { num: '4', emoji: '🛋️💑', title: 'Bild 4', desc: 'Unmarried couple on sofa' },
                    { num: '5', emoji: '🙋🏼♂️✨', title: 'Bild 5', desc: 'Happy person living alone' }
                  ].map((pic) => (
                    <div
                      key={pic.num}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center"
                    >
                      <div className="text-xs font-black text-amber-400 mb-1">📌 {pic.title}</div>
                      <div className="text-2xl mb-1">{pic.emoji}</div>
                      <div className="text-[11px] text-slate-400">{pic.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {ex3aItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
                    >
                      <button
                        onClick={() => speakGerman(item.text, speechRate)}
                        className="text-sm font-medium text-white hover:text-amber-300 flex items-center gap-2 text-left cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{item.text}</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <select
                          value={ex3aAnswers[item.id]}
                          onChange={(e) =>
                            setEx3aAnswers({ ...ex3aAnswers, [item.id]: e.target.value })
                          }
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-bold text-xs"
                        >
                          <option value="">Bild ?</option>
                          {['1', '2', '3', '4', '5'].map((n) => (
                            <option key={n} value={n}>
                              Bild {n}
                            </option>
                          ))}
                        </select>
                        {ex3aChecked && (
                          <span className="text-xs font-bold">
                            {ex3aAnswers[item.id] === item.correctPic ? (
                              <span className="text-emerald-400">✓ Bild {item.correctPic}</span>
                            ) : (
                              <span className="text-rose-400">✗ (Bild {item.correctPic})</span>
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
                    if (ex3aItems.every((i) => ex3aAnswers[i.id] === i.correctPic)) {
                      markDone('ex3a');
                    }
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check 3a Matches
                </button>
              </div>

              {/* 3b: Interview mit Barbara & Markus (Page 15) */}
              <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/30 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  3b) Hören Sie das Interview (Track 1.13, Seite 15). Was ist richtig? Kreuzen Sie an.
                </h4>
                <AudioTrackPlayer trackId="1.13" speechRate={speechRate} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">1. Barbara und Markus sind ...</div>
                    {['geschieden.', 'verheiratet.'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setEx3bQ1(opt)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                          ex3bQ1 === opt
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {ex3bQ1 === opt ? '☒ ' : '☐ '} {opt}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">2. Sie haben ...</div>
                    {['keine Kinder.', 'zwei Kinder.'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setEx3bQ2(opt)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                          ex3bQ2 === opt
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {ex3bQ2 === opt ? '☒ ' : '☐ '} {opt}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">3. Sie ...</div>
                    {['leben zusammen.', 'leben nicht zusammen.'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setEx3bQ3(opt)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                          ex3bQ3 === opt
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {ex3bQ3 === opt ? '☒ ' : '☐ '} {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEx3bChecked(true);
                      if (
                        ex3bQ1 === 'geschieden.' &&
                        ex3bQ2 === 'zwei Kinder.' &&
                        ex3bQ3 === 'leben nicht zusammen.'
                      ) {
                        markDone('ex3');
                      }
                    }}
                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Check 3b Interview
                  </button>
                  {ex3bChecked && (
                    <span className="text-xs font-bold text-emerald-300">
                      {ex3bQ1 === 'geschieden.' &&
                      ex3bQ2 === 'zwei Kinder.' &&
                      ex3bQ3 === 'leben nicht zusammen.'
                        ? '✓ Perfekt! Barbara & Markus are divorced (geschieden), have 2 children, and do not live together!'
                        : 'Answer: geschieden • zwei Kinder • leben nicht zusammen.'}
                    </span>
                  )}
                </div>
              </div>

              {/* 3c & 3d: Was haben die Personen gemeinsam? + Plural Table */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  3c & 3d) Was haben die Personen auf Seite 13 gemeinsam? (Plural Verbs: wir, ihr, sie)
                </h4>
                <AudioTrackPlayer trackId="1.14" speechRate={speechRate} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-amber-300">
                      Complete the Plural Sentence:
                    </div>
                    <p className="text-sm text-white">
                      ● Was haben Sven und Nadine gemeinsam?
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span>▲ Sie</span>
                      <select
                        value={ex3cVerb}
                        onChange={(e) => setEx3cVerb(e.target.value)}
                        className="bg-slate-950 border border-amber-400 rounded-lg px-2.5 py-1 text-amber-300 font-bold"
                      >
                        <option value="">verb?</option>
                        <option value="wohnen">wohnen</option>
                        <option value="wohnt">wohnt</option>
                        <option value="wohne">wohne</option>
                      </select>
                      <span>in Berlin. Und beide</span>
                      <span className="font-bold text-emerald-300">sind</span>
                      <span>35 Jahre alt!</span>
                    </div>
                    <button
                      onClick={() => {
                        setEx3cChecked(true);
                        speakGerman('Was haben Sven und Nadine gemeinsam? Sie wohnen in Berlin.', speechRate);
                        if (ex3cVerb === 'wohnen') markDone('ex3c');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      Verify & Speak 3c
                    </button>
                    {ex3cChecked && (
                      <p className="text-xs font-bold text-emerald-400">
                        {ex3cVerb === 'wohnen'
                          ? '✓ Richtig! Plural "sie" (they) takes "wohnen"!'
                          : 'Hint: "Sie" (they) is plural, so choose "wohnen"!'}
                      </p>
                    )}
                  </div>

                  {/* Textbook Grammar Box from 3c */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                    <div className="text-xs font-bold text-indigo-300 uppercase mb-2">
                      GRAMMATIK (Seite 15): Plural Conjugation (Click row to hear)
                    </div>
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-1.5">Pronomen</th>
                          <th className="py-1.5">wohnen</th>
                          <th className="py-1.5">arbeiten</th>
                          <th className="py-1.5">sein</th>
                          <th className="py-1.5">haben</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {[
                          { p: 'wir', w: 'wohnen', a: 'arbeiten', s: 'sind', h: 'haben' },
                          { p: 'ihr', w: 'wohnt', a: 'arbeitet', s: 'seid', h: 'habt' },
                          { p: 'sie', w: 'wohnen', a: 'arbeiten', s: 'sind', h: 'haben' }
                        ].map((r) => (
                          <tr
                            key={r.p}
                            onClick={() =>
                              speakGerman(
                                `${r.p} ${r.w}, ${r.p} ${r.a}, ${r.p} ${r.s}, ${r.p} ${r.h}`,
                                speechRate
                              )
                            }
                            className="hover:bg-slate-800/70 cursor-pointer"
                          >
                            <td className="py-2 font-bold text-amber-300">{r.p}</td>
                            <td className="py-2">{r.w}</td>
                            <td className="py-2">{r.a}</td>
                            <td className="py-2 font-bold text-emerald-300">{r.s}</td>
                            <td className="py-2">{r.h}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('ex4to7')}
                  className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  <span>Continue to Exercises 4–7 (Pages 15–16)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'ex4to7' && (
          <div className="space-y-8">
            {/* EXERCISE 4 (4a & 4b) - Page 15 (Zahlen von 0 bis 100) */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seite 15 • Übung 4a & 4b (Track 1.15)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    4. Zahlen von 0 bis 100 — Interactive Audio Board & Missing Numbers
                  </h3>
                </div>
                {completed.ex4 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                <strong>4a) Hören Sie und sprechen Sie nach. Ergänzen Sie die fehlenden Zahlen.</strong> Click any number card to hear its pronunciation, and fill in the 8 yellow textbook blanks (`13, 15, 18, 40, 70, 90, 100, 62`)!
              </p>

              {/* Row 0 to 12 */}
              <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-2">
                {[
                  [0, 'null'],
                  [1, 'eins'],
                  [2, 'zwei'],
                  [3, 'drei'],
                  [4, 'vier'],
                  [5, 'fünf'],
                  [6, 'sechs'],
                  [7, 'sieben'],
                  [8, 'acht'],
                  [9, 'neun'],
                  [10, 'zehn'],
                  [11, 'elf'],
                  [12, 'zwölf']
                ].map(([num, word]) => (
                  <button
                    key={num}
                    onClick={() => speakGerman(word, speechRate)}
                    className="bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 rounded-xl p-2 text-center cursor-pointer transition"
                  >
                    <div className="font-black text-base text-white">{num}</div>
                    <div className="text-[11px] text-indigo-300">{word}</div>
                  </button>
                ))}
              </div>

              {/* Row 13 to 19 + Tens 20 to 100 with Textbook Input Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 13 to 19 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-amber-400 uppercase">
                    Numbers 13–19 (Fill in 13, 15, 18)
                  </div>
                  {[
                    { num: 13, gapKey: 'n13', expected: 'dreizehn' },
                    { num: 14, text: 'vierzehn' },
                    { num: 15, gapKey: 'n15', expected: 'fünfzehn' },
                    { num: 16, text: 'sechzehn', highlight: 'Drops the -s!' },
                    { num: 17, text: 'siebzehn', highlight: 'Drops the -en!' },
                    { num: 18, gapKey: 'n18', expected: 'achtzehn' },
                    { num: 19, text: 'neunzehn' }
                  ].map((item) => (
                    <div key={item.num} className="flex items-center justify-between gap-2 text-sm">
                      <button
                        onClick={() =>
                          speakGerman(item.text || item.expected, speechRate)
                        }
                        className="font-black text-white hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> {item.num} =
                      </button>
                      {item.gapKey ? (
                        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                          <input
                            type="text"
                            value={ex4Gaps[item.gapKey]}
                            onChange={(e) =>
                              setEx4Gaps({ ...ex4Gaps, [item.gapKey]: e.target.value })
                            }
                            placeholder="Type German word..."
                            className="w-full bg-slate-900 border border-amber-400/60 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold"
                          />
                          {ex4Checked && (
                            <span className="text-xs font-bold">
                              {ex4Gaps[item.gapKey]?.trim().toLowerCase() === item.expected ? (
                                <span className="text-emerald-400">✓</span>
                              ) : (
                                <span className="text-rose-400">{item.expected}</span>
                              )}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200">{item.text}</span>
                          {item.highlight && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {item.highlight}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tens 20 to 100 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-emerald-400 uppercase">
                    Tens 20–100 & Compound Numbers (Fill in 40, 70, 90, 100, 62)
                  </div>
                  {[
                    { num: 20, text: 'zwanzig' },
                    { num: 30, text: 'dreißig', highlight: 'Uses ß!' },
                    { num: 40, gapKey: 'n40', expected: 'vierzig' },
                    { num: 50, text: 'fünfzig' },
                    { num: 60, text: 'sechzig', highlight: 'Drops -s!' },
                    { num: 70, gapKey: 'n70', expected: 'siebzig' },
                    { num: 80, text: 'achtzig' },
                    { num: 90, gapKey: 'n90', expected: 'neunzig' },
                    { num: 100, gapKey: 'n100', expected: 'hundert' },
                    { num: 35, text: 'fünfunddreißig' },
                    { num: 62, gapKey: 'n62', expected: 'zweiundsechzig' }
                  ].map((item) => (
                    <div key={item.num} className="flex items-center justify-between gap-2 text-sm">
                      <button
                        onClick={() =>
                          speakGerman(item.text || item.expected, speechRate)
                        }
                        className="font-black text-white hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> {item.num} =
                      </button>
                      {item.gapKey ? (
                        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                          <input
                            type="text"
                            value={ex4Gaps[item.gapKey]}
                            onChange={(e) =>
                              setEx4Gaps({ ...ex4Gaps, [item.gapKey]: e.target.value })
                            }
                            placeholder="Type German word..."
                            className="w-full bg-slate-900 border border-amber-400/60 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold"
                          />
                          {ex4Checked && (
                            <span className="text-xs font-bold">
                              {ex4Gaps[item.gapKey]?.trim().toLowerCase() === item.expected ? (
                                <span className="text-emerald-400">✓</span>
                              ) : (
                                <span className="text-rose-400">{item.expected}</span>
                              )}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200">{item.text}</span>
                          {item.highlight && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              {item.highlight}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setEx4Checked(true);
                    markDone('ex4');
                  }}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Check Exercise 4a Numbers
                </button>
                <button
                  onClick={() =>
                    setEx4Gaps({
                      n13: 'dreizehn',
                      n15: 'fünfzehn',
                      n18: 'achtzehn',
                      n40: 'vierzig',
                      n70: 'siebzig',
                      n90: 'neunzig',
                      n100: 'hundert',
                      n62: 'zweiundsechzig'
                    })
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Auto-Fill Correct Numbers
                </button>
              </div>

              {/* 4b: Interactive 0-100 Number Synthesizer */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">
                    4b) Interactive 0–100 Number Explorer & Speaker
                  </h4>
                  <p className="text-xs text-slate-300">
                    Slide or type any number from 0 to 100 to see how its "Ones + und + Tens" word is built:
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={liveNumber}
                    onChange={(e) => setLiveNumber(Number(e.target.value))}
                    className="w-32 accent-amber-400 cursor-pointer"
                  />
                  <span className="text-2xl font-black text-white w-12 text-center">
                    {liveNumber}
                  </span>
                  <button
                    onClick={() => speakGerman(numberToGermanWord(liveNumber), speechRate)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{numberToGermanWord(liveNumber)}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 5 (5a, 5b) & EXERCISE 6 - Page 15 */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    Seite 15 • Übung 5a, 5b & 6 (Track 1.16)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    5 & 6. Wie alt bist du? („Echo“-Spiel) & Andere Personen vorstellen
                  </h3>
                </div>
                {completed.ex5 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 5a */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">
                  5a) Hören Sie (Track 1.16) und kreuzen Sie an.
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-white">
                      1. Wie alt sind Sven und Nadine?
                    </div>
                    <div className="flex gap-3">
                      {['25.', '35.'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setEx5aAge(opt)}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm border cursor-pointer ${
                            ex5aAge === opt
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          {ex5aAge === opt ? '☒ ' : '☐ '} {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-white">2. Wo wohnen sie?</div>
                    <div className="flex gap-3">
                      {['In Bonn.', 'In Berlin.'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setEx5aCity(opt)}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm border cursor-pointer ${
                            ex5aCity === opt
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          {ex5aCity === opt ? '☒ ' : '☐ '} {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEx5aChecked(true);
                      if (ex5aAge === '35.' && ex5aCity === 'In Berlin.') markDone('ex5');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Check 5a Answers
                  </button>
                  {ex5aChecked && (
                    <span className="text-xs font-bold text-emerald-400">
                      {ex5aAge === '35.' && ex5aCity === 'In Berlin.'
                        ? '✓ Genau! Both Sven and Nadine are 35 years old and live in Berlin!'
                        : 'Correct: 35. & In Berlin.'}
                    </span>
                  )}
                </div>
              </div>

              {/* 5b Echo Game */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  5b) Spiel & Spaß: Fragen Sie und spielen Sie „Echo“!
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <select
                    value={echoTopic}
                    onChange={(e) => {
                      setEchoTopic(e.target.value);
                      if (e.target.value === 'Alter') setEchoInput('34');
                      if (e.target.value === 'Wohnort') setEchoInput('Berlin');
                      if (e.target.value === 'Beruf') setEchoInput('Ingenieur');
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    <option value="Alter">Topic: Alter (Age)</option>
                    <option value="Wohnort">Topic: Wohnort (City)</option>
                    <option value="Beruf">Topic: Beruf (Profession)</option>
                  </select>
                  <input
                    type="text"
                    value={echoInput}
                    onChange={(e) => setEchoInput(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold"
                  />
                  <button
                    onClick={() => {
                      const dialog =
                        echoTopic === 'Alter'
                          ? `Wie alt bist du? Ich bin ${echoInput} Jahre alt. Hey super, ich bin auch ${echoInput}!`
                          : echoTopic === 'Wohnort'
                          ? `Wo wohnst du? Ich wohne in ${echoInput}. Hey super, ich wohne auch in ${echoInput}!`
                          : `Was bist du von Beruf? Ich bin ${echoInput}. Hey super, ich bin auch ${echoInput}!`;
                      speakGerman(dialog, speechRate);
                      markDone('ex5b');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" /> Play „Echo“ Dialogue
                  </button>
                </div>
              </div>

              {/* Exercise 6: Partner Cards (Pages 78 & 82) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-emerald-300 text-sm">
                    6) Texte verstehen: Stellen Sie andere Personen vor (Seiten 78 & 82 Simulation)
                  </h4>
                  <button
                    onClick={() => {
                      setEx6CardIdx((ex6CardIdx + 1) % partnerCards.length);
                      markDone('ex6');
                    }}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Switch Person ({ex6CardIdx + 1}/{partnerCards.length}) →
                  </button>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-amber-300 text-sm">
                      Person Card: {partnerCards[ex6CardIdx].name}
                    </div>
                    <div>
                      • Herkunft: <strong>{partnerCards[ex6CardIdx].origin}</strong> | Wohnort:{' '}
                      <strong>{partnerCards[ex6CardIdx].city}</strong>
                    </div>
                    <div>
                      • Beruf: <strong>{partnerCards[ex6CardIdx].job}</strong> bei{' '}
                      <strong>{partnerCards[ex6CardIdx].employer}</strong>
                    </div>
                    <div>
                      • Alter: <strong>{partnerCards[ex6CardIdx].age}</strong> | Privat:{' '}
                      <strong>{partnerCards[ex6CardIdx].status}</strong>,{' '}
                      <strong>{partnerCards[ex6CardIdx].children}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const c = partnerCards[ex6CardIdx];
                      const intro =
                        c.pronoun === 'Sie (Plural)'
                          ? `Das sind ${c.name}. Sie kommen aus ${c.origin} und wohnen in ${c.city}. Sie arbeiten als ${c.job} bei ${c.employer}. Sie sind ${c.age} Jahre alt und haben ${c.children}.`
                          : `Das ist ${c.name}. ${c.pronoun} kommt aus ${c.origin} und wohnt in ${c.city}. ${c.pronoun} arbeitet als ${c.job} bei ${c.employer}. ${c.pronoun} ist ${c.age} Jahre alt, ${c.status} und hat ${c.children}.`;
                      speakGerman(intro, speechRate);
                      markDone('ex6');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4" /> Hear 3rd-Person Presentation
                  </button>
                </div>
              </div>
            </section>

            {/* EXERCISE 7 (7a & 7b) - Page 16 */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Seite 16 • Übung 7a & 7b (Schreibtraining)
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    7. Einen kurzen Text über sich schreiben (Steckbrief Mette Svendsen & Und Sie?)
                  </h3>
                </div>
                {completed.ex7 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              {/* 7a: Mette Svendsen Steckbrief & Verb Highlighter */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-indigo-300 text-sm">
                    7a) Lesen Sie den Steckbrief von Mette Svendsen:
                  </h4>
                  <table className="w-full text-xs border-collapse bg-slate-900 rounded-lg overflow-hidden">
                    <tbody className="divide-y divide-slate-800">
                      {[
                        ['Vorname:', 'Mette'],
                        ['Familienname:', 'Svendsen'],
                        ['Herkunft:', 'Dänemark'],
                        ['Wohnort:', 'Kopenhagen'],
                        ['Beruf:', 'Studentin / Job als Kellnerin'],
                        ['Alter:', '24'],
                        ['Familienstand:', 'Single'],
                        ['Kinder:', 'keine Kinder']
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <td className="p-2 font-bold text-slate-400 w-36">{k}</td>
                          <td className="p-2 font-semibold text-white">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-300 text-sm">
                      7a) Markieren Sie die Verben! (Click all 7 verbs in Mette's text)
                    </h4>
                    <button
                      onClick={() =>
                        speakGerman(
                          'Ich heiße Mette Svendsen und komme aus Dänemark. Ich wohne in Kopenhagen. Ich bin Studentin und habe einen Job als Kellnerin. Ich bin 24 Jahre alt, Single und habe keine Kinder.',
                          speechRate
                        )
                      }
                      className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap gap-1.5 leading-relaxed">
                    {metteTokens.map((tok, idx) => {
                      const isSelected = markedVerbIndices.includes(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setMarkedVerbIndices(markedVerbIndices.filter((i) => i !== idx));
                            } else {
                              setMarkedVerbIndices([...markedVerbIndices, idx]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-sm transition cursor-pointer ${
                            isSelected
                              ? tok.isVerb
                                ? 'bg-amber-400 text-slate-950 font-extrabold underline'
                                : 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          {tok.word}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setEx7aChecked(true);
                        const verbIndices = metteTokens
                          .map((t, i) => (t.isVerb ? i : -1))
                          .filter((i) => i !== -1);
                        const allVerbsFound = verbIndices.every((i) =>
                          markedVerbIndices.includes(i)
                        );
                        if (allVerbsFound) markDone('ex7');
                      }}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      Check Marked Verbs (7a)
                    </button>
                    <button
                      onClick={() =>
                        setMarkedVerbIndices(
                          metteTokens.map((t, i) => (t.isVerb ? i : -1)).filter((i) => i !== -1)
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Highlight All 7 Verbs (heiße, komme, wohne, bin, habe, bin, habe)
                    </button>
                  </div>
                </div>
              </div>

              {/* 7b: Und Sie? Personal Steckbrief & Auto-Essay Builder */}
              <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 space-y-4">
                <h4 className="font-bold text-emerald-300 text-sm">
                  7b) Und Sie? Ergänzen Sie Ihren Steckbrief und schreiben Sie einen Text über sich selbst:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { key: 'vorname', label: 'Vorname' },
                    { key: 'familienname', label: 'Familienname' },
                    { key: 'herkunft', label: 'Herkunft (Country)' },
                    { key: 'wohnort', label: 'Wohnort (City)' },
                    { key: 'beruf', label: 'Beruf / Studium' },
                    { key: 'arbeitgeber', label: 'Arbeitgeber (bei)' },
                    { key: 'alter', label: 'Alter (Age)' },
                    { key: 'familienstand', label: 'Familienstand' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-slate-400 block mb-1">{field.label}:</label>
                      <input
                        type="text"
                        value={userSteckbrief[field.key]}
                        onChange={(e) =>
                          setUserSteckbrief({ ...userSteckbrief, [field.key]: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase">
                    Your Generated German Self-Introduction (Notice the highlighted Position-2 Verbs!):
                  </div>
                  <p className="text-sm text-slate-100 leading-relaxed">
                    Ich <span className="text-amber-300 font-bold underline">heiße</span>{' '}
                    {userSteckbrief.vorname} {userSteckbrief.familienname} und{' '}
                    <span className="text-amber-300 font-bold underline">komme</span> aus{' '}
                    {userSteckbrief.herkunft}. Ich{' '}
                    <span className="text-amber-300 font-bold underline">wohne</span> in{' '}
                    {userSteckbrief.wohnort}. Ich{' '}
                    <span className="text-amber-300 font-bold underline">arbeite</span> als{' '}
                    {userSteckbrief.beruf} bei {userSteckbrief.arbeitgeber}. Ich{' '}
                    <span className="text-amber-300 font-bold underline">bin</span>{' '}
                    {userSteckbrief.alter} Jahre alt, {userSteckbrief.familienstand} und{' '}
                    <span className="text-amber-300 font-bold underline">habe</span>{' '}
                    {userSteckbrief.kinder}.
                  </p>
                  <button
                    onClick={() => {
                      const bio = `Ich heiße ${userSteckbrief.vorname} ${userSteckbrief.familienname} und komme aus ${userSteckbrief.herkunft}. Ich wohne in ${userSteckbrief.wohnort}. Ich arbeite als ${userSteckbrief.beruf} bei ${userSteckbrief.arbeitgeber}. Ich bin ${userSteckbrief.alter} Jahre alt, ${userSteckbrief.familienstand} und habe ${userSteckbrief.kinder}.`;
                      speakGerman(bio, speechRate);
                      markDone('ex7b');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Hear My Personal Steckbrief Text
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'bonus' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-500/20 via-indigo-950 to-amber-500/20 border border-emerald-500/40 rounded-2xl p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Extra High-Retention Drills (Beyond the Textbook)
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Chapter 2 Bonus Memory-Lock Arena
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Lock in the 3 hardest parts of Chapter 2 forever: Prepositions (<em>als, bei, in, von, aus</em>), Singular + Plural Verb Conjugation (<em>arbeiten, haben, sein</em>), and Spelling Numbers 0–100.
              </p>
            </div>

            {/* BONUS DRILL 1: Preposition Sniper */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Bonus Drill #1: The Preposition Sniper (als • bei • in • von • aus)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prepQuestions.map((item, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">{item.q}</span>
                      <div className="flex gap-1">
                        {['als', 'bei', 'in', 'von', 'aus'].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setPrepSelections({ ...prepSelections, [i]: p });
                              speakGerman(item.q.replace('___', p), speechRate);
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold border cursor-pointer ${
                              prepSelections[i] === p
                                ? 'bg-indigo-600 border-indigo-400 text-white'
                                : 'bg-slate-900 border-slate-700 text-slate-400'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    {prepChecked && (
                      <div
                        className={`text-xs font-semibold ${
                          prepSelections[i] === item.ans ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {prepSelections[i] === item.ans ? '✓ ' : `✗ (${item.ans}) `}
                        {item.why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setPrepChecked(true);
                  markDone('bonus1');
                }}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Check All Prepositions
              </button>
            </section>

            {/* BONUS DRILL 2: Conjugation Blitz */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold text-white">
                  Bonus Drill #2: Singular & Plural Verb Blitz (arbeiten • haben • sein)
                </h3>
                <span className="text-xs bg-indigo-950 border border-indigo-500/40 text-indigo-200 px-3 py-1 rounded-full font-bold">
                  Card {conjIdx + 1} of {conjDrill.length}
                </span>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-xs text-slate-400">Conjugate for subject:</div>
                    <div className="text-lg font-extrabold text-amber-300">
                      {conjDrill[conjIdx].subj} + {conjDrill[conjIdx].verb}
                    </div>
                  </div>
                  <div className="text-xl font-black text-white bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                    {conjDrill[conjIdx].sent}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={conjInput}
                    onChange={(e) => setConjInput(e.target.value)}
                    placeholder="Type verb form..."
                    className="bg-slate-900 border border-amber-400/60 rounded-xl px-4 py-2 text-white font-bold"
                  />
                  <button
                    onClick={() => {
                      const cur = conjDrill[conjIdx];
                      const ok = conjInput.trim().toLowerCase() === cur.ans.toLowerCase();
                      const full = cur.sent.replace('___', cur.ans);
                      speakGerman(full, speechRate);
                      setConjFeedback(
                        ok
                          ? `✓ Richtig! "${full}" (${cur.hint})`
                          : `✗ Answer: "${cur.ans}" — ${cur.hint}`
                      );
                      if (ok) markDone('bonus2');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Check & Speak
                  </button>
                  <button
                    onClick={() => {
                      setConjIdx((conjIdx + 1) % conjDrill.length);
                      setConjInput('');
                      setConjFeedback(null);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Next Verb →
                  </button>
                </div>
                {conjFeedback && (
                  <div className="text-xs font-bold text-emerald-300">{conjFeedback}</div>
                )}
              </div>
            </section>

            {/* BONUS DRILL 3: Number Spelling & Listening Bee */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Bonus Drill #3: Tricky Numbers Spelling & Ear-Trainer (16, 17, 30, 35, 62, 70...)
              </h3>
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      speakGerman(
                        numberToGermanWord(numberChallenges[numQuizIdx]),
                        speechRate
                      )
                    }
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Hear Number: {numberChallenges[numQuizIdx]}</span>
                  </button>
                  <input
                    type="text"
                    value={numWordInput}
                    onChange={(e) => setNumWordInput(e.target.value)}
                    placeholder="Spell in German..."
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-amber-300 font-bold"
                  />
                  <button
                    onClick={() => {
                      const target = numberToGermanWord(numberChallenges[numQuizIdx]);
                      const ok = numWordInput.trim().toLowerCase() === target;
                      setNumQuizFeedback(
                        ok
                          ? `✓ Perfekt! ${numberChallenges[numQuizIdx]} = ${target}`
                          : `Watch the spelling: ${numberChallenges[numQuizIdx]} = ${target}`
                      );
                      if (ok) markDone('bonus3');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Check Spelling
                  </button>
                  <button
                    onClick={() => {
                      setNumQuizIdx((numQuizIdx + 1) % numberChallenges.length);
                      setNumWordInput('');
                      setNumQuizFeedback(null);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Next Number →
                  </button>
                </div>
                {numQuizFeedback && (
                  <div className="text-xs font-bold text-amber-300 w-full">{numQuizFeedback}</div>
                )}
              </div>
            </section>
          </div>
        )}

        {}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Modul 1 • Seite 16 Official Reference
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                GRAMMATIK & KOMMUNIKATION (Click Any Row to Hear It!)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GRAMMATIK COLUMN */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  GRAMMATIK (Seite 16)
                </h3>

                <div className="overflow-x-auto">
                  <h4 className="text-sm font-bold text-white mb-2">
                    Verb: Konjugation (Singular & Plural — auch so: wohnen, leben)
                  </h4>
                  <table className="w-full text-xs sm:text-sm bg-slate-950 rounded-xl overflow-hidden border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200 text-left">
                        <th className="p-2.5">Pronomen</th>
                        <th className="p-2.5">machen</th>
                        <th className="p-2.5">arbeiten</th>
                        <th className="p-2.5">haben</th>
                        <th className="p-2.5">sein</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { p: 'ich', m: 'mache', a: 'arbeite', h: 'habe', s: 'bin' },
                        { p: 'du', m: 'machst', a: 'arbeitest', h: 'hast', s: 'bist' },
                        { p: 'er/sie', m: 'macht', a: 'arbeitet', h: 'hat', s: 'ist' },
                        { p: 'wir', m: 'machen', a: 'arbeiten', h: 'haben', s: 'sind' },
                        { p: 'ihr', m: 'macht', a: 'arbeitet', h: 'habt', s: 'seid' },
                        { p: 'sie/Sie', m: 'machen', a: 'arbeiten', h: 'haben', s: 'sind' }
                      ].map((r) => (
                        <tr
                          key={r.p}
                          onClick={() =>
                            speakGerman(
                              `${r.p} ${r.m}, ${r.p} ${r.a}, ${r.p} ${r.h}, ${r.p} ${r.s}`,
                              speechRate
                            )
                          }
                          className="hover:bg-indigo-950/40 cursor-pointer transition"
                        >
                          <td className="p-2.5 font-bold text-indigo-300">{r.p}</td>
                          <td className="p-2.5">{r.m}</td>
                          <td className="p-2.5 text-amber-300 font-semibold">{r.a}</td>
                          <td className="p-2.5 text-sky-300 font-semibold">{r.h}</td>
                          <td className="p-2.5 text-emerald-300 font-semibold">{r.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Präpositionen, Wortbildung, Negation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 uppercase">
                      Präpositionen als, bei, in
                    </div>
                    <div>• <strong>als:</strong> Ich arbeite als Journalistin.</div>
                    <div>• <strong>bei:</strong> Ich arbeite bei X-Media.</div>
                    <div>• <strong>in:</strong> Ich lebe in Köln.</div>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-400 uppercase">Wortbildung -in</div>
                    <div>• der Journalist → <strong>die Journalistin</strong></div>
                    <div>• der Arzt → <strong>die Ärztin</strong></div>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-rose-400 uppercase">Negation mit nicht</div>
                    <div>• Wir leben <strong>nicht</strong> zusammen.</div>
                    <div>• Sie wohnt <strong>nicht</strong> in Köln.</div>
                  </div>
                </div>
              </div>

              {/* KOMMUNIKATION COLUMN */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  KOMMUNIKATION (Seite 16)
                </h3>

                {[
                  {
                    title: 'über den Beruf sprechen (Talking About Professions)',
                    items: [
                      'Was sind Sie / bist du von Beruf? → Ich bin / arbeite als ... bei ...',
                      'Was machen Sie / machst du beruflich? → Ich bin Student / Schülerin.',
                      'Ich habe einen Job als Kellnerin.',
                      'Ich mache eine Ausbildung als Friseurin / ein Praktikum bei Mertz & Co.'
                    ]
                  },
                  {
                    title: 'über Persönliches sprechen (Talking About Personal Life)',
                    items: [
                      'Wo wohnen Sie / wohnst du? → Ich wohne / lebe in Berlin.',
                      'Ich bin verheiratet / geschieden / Single.',
                      'Wir leben zusammen / nicht zusammen.',
                      'Ich habe ein Kind / zwei, drei ... Kinder / keine Kinder.',
                      'Wie alt sind Sie / bist du? → Ich bin 24 Jahre alt.'
                    ]
                  }
                ].map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                  >
                    <div className="text-xs font-bold uppercase text-indigo-300">{sec.title}</div>
                    {sec.items.map((line, i) => (
                      <div
                        key={i}
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
