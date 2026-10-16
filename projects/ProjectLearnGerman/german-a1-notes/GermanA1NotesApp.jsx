import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  RotateCcw,
  Shuffle,
  Layers,
  HelpCircle,
  Check,
  X,
  FileText,
  Flame,
  GraduationCap,
  Play
} from 'lucide-react';
import './flashcards.css';
import { FLASHCARDS_DATA, VERBS_DATA, EXERCISES_DATA } from './notesData.js';

const speakGerman = (text, rate = 0.92, pitch = 1.0) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    // Clean markdown bold/code markers
    const cleanText = text.replace(/[*`_]/g, '').replace(/→/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
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

const STORAGE_KEY = 'germanA1NotesProgressV1';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { index: 0, progress: {} };
}

function saveSaved(index, progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, progress }));
  } catch {}
}

export default function GermanA1NotesApp() {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [speechRate, setSpeechRate] = useState(0.92);

  // --- FLASHCARD ENGINE (AMADEUS ARCHITECTURE) ---
  const allCategories = ['All', ...Array.from(new Set(FLASHCARDS_DATA.map((c) => c.category)))];
  const [progress, setProgress] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unseen' | 'review'
  const [search, setSearch] = useState('');
  const [shuffledOrder, setShuffledOrder] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [justMarked, setJustMarked] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    setProgress(saved.progress || {});
  }, []);

  const filteredCards = FLASHCARDS_DATA.filter((c) => {
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchSearch =
      !search ||
      c.front.toLowerCase().includes(search.toLowerCase()) ||
      c.back.toLowerCase().includes(search.toLowerCase());
    const prog = progress[String(c.id)];
    const status = prog?.status ?? 'unseen';
    const matchMode =
      filterMode === 'all' ||
      (filterMode === 'unseen' && status === 'unseen') ||
      (filterMode === 'review' && status === 'review');
    return matchCat && matchSearch && matchMode;
  });

  const displayOrder = isShuffled ? shuffledOrder : filteredCards.map((_, i) => i);
  const orderedCards = displayOrder
    .filter((i) => i < filteredCards.length)
    .map((i) => filteredCards[i]);

  const card = orderedCards[currentIndex] ?? null;

  // Stats
  const totalCards = FLASHCARDS_DATA.length;
  const knownCount = Object.values(progress).filter((p) => p.status === 'known').length;
  const reviewCount = Object.values(progress).filter((p) => p.status === 'review').length;
  const unseenCount = totalCards - knownCount - reviewCount;
  const masteryPct = Math.round((knownCount / totalCards) * 100);

  useEffect(() => {
    saveSaved(currentIndex, progress);
  }, [progress, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setIsShuffled(false);
  }, [filterCategory, filterMode, search]);

  const goTo = useCallback(
    (idx) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(idx);
        setIsAnimating(false);
      }, 220);
    },
    [isAnimating]
  );

  const nextCard = useCallback(() => {
    if (!card) return;
    const next = currentIndex + 1 < orderedCards.length ? currentIndex + 1 : 0;
    goTo(next);
  }, [currentIndex, orderedCards.length, card, goTo]);

  const prevCard = useCallback(() => {
    if (!card) return;
    const prev = currentIndex > 0 ? currentIndex - 1 : orderedCards.length - 1;
    goTo(prev);
  }, [currentIndex, orderedCards.length, card, goTo]);

  const markCard = useCallback(
    (status) => {
      if (!card) return;
      const id = String(card.id);
      setProgress((prev) => ({
        ...prev,
        [id]: { status, seenAt: Date.now() }
      }));
      setJustMarked(status === 'known' ? 'known' : 'review');
      setTimeout(() => setJustMarked(null), 700);
      setTimeout(() => {
        const next = currentIndex + 1 < orderedCards.length ? currentIndex + 1 : 0;
        setFlipped(false);
        setTimeout(() => setCurrentIndex(next), 200);
      }, 300);
    },
    [card, currentIndex, orderedCards.length]
  );

  const shuffleCards = useCallback(() => {
    const indices = filteredCards.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledOrder(indices);
    setIsShuffled(true);
    setCurrentIndex(0);
    setFlipped(false);
  }, [filteredCards]);

  const resetProgress = useCallback(() => {
    if (confirm('Reset your flashcard progress back to 0?')) {
      setProgress({});
      setCurrentIndex(0);
      setFlipped(false);
      setIsShuffled(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (activeTab !== 'flashcards') return;
      if (e.key === 'ArrowRight' || e.key === 'l') nextCard();
      else if (e.key === 'ArrowLeft' || e.key === 'h') prevCard();
      else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === '1') markCard('review');
      else if (e.key === '2') markCard('known');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextCard, prevCard, markCard, activeTab]);

  const cardStatus = card ? progress[String(card.id)]?.status ?? 'unseen' : 'unseen';
  const statusColor = {
    known: '#10b981',
    review: '#f43f5e',
    unseen: '#64748b'
  }[cardStatus];

  const progressPct =
    orderedCards.length > 0 ? Math.round(((currentIndex + 1) / orderedCards.length) * 100) : 0;

  // --- VERBS EXPLORER STATE ---
  const [selectedVerb, setSelectedVerb] = useState(VERBS_DATA[0] || null);
  const [verbSearch, setVerbSearch] = useState('');

  const filteredVerbs = VERBS_DATA.filter(
    (v) =>
      v.infinitive.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.english.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.hindi.includes(verbSearch)
  );

  // --- EXERCISES INTERACTIVE STATES ---
  // Ex 1: Pronoun Matching
  const [ex1Answers, setEx1Answers] = useState({});
  const [ex1Checked, setEx1Checked] = useState(false);

  // Ex 2: Stem Extraction
  const [ex2Inputs, setEx2Inputs] = useState({});
  const [ex2Checked, setEx2Checked] = useState(false);

  // Ex 3: Suffix Drill
  const [ex3Inputs, setEx3Inputs] = useState({});
  const [ex3Checked, setEx3Checked] = useState(false);

  // Ex 4: sie/Sie Detective
  const [ex4Inputs, setEx4Inputs] = useState({});
  const [ex4Checked, setEx4Checked] = useState(false);

  // Ex 5: Translation
  const [ex5Reveals, setEx5Reveals] = useState({});

  // Ex 6: Mistake Spotter
  const [ex6Reveals, setEx6Reveals] = useState({});

  // Ex 7: 5 Sentences a Day Builder
  const [builderSubject, setBuilderSubject] = useState('ich');
  const [builderVerb, setBuilderVerb] = useState('trinken');
  const [builderObject, setBuilderObject] = useState('Tee');

  const getConjugatedForm = (subj, verbInf) => {
    const stem = verbInf.replace(/en$/, '');
    if (subj === 'ich') return `${stem}e`;
    if (subj === 'du') return `${stem}st`;
    if (subj === 'er' || subj === 'sie (she)' || subj === 'es' || subj === 'ihr') return `${stem}t`;
    return verbInf;
  };

  const builderSentence = `${builderSubject.split(' ')[0].charAt(0).toUpperCase() + builderSubject.split(' ')[0].slice(1)} ${getConjugatedForm(
    builderSubject,
    builderVerb
  )} ${builderObject}.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Back to German Roadmap"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Roadmap</span>
            </a>
            <a
              href="../menschen-a1-1/index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 1"
            >
              <span>Kapitel 1</span>
            </a>
            <a
              href="../menschen-a1-1/chapter-2.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold transition shadow-sm"
              title="Go to Chapter 2"
            >
              <span>Kapitel 2</span>
            </a>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              300
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  German A1 • Lecture 1 Notes & 300 Flashcards
                </span>
                <button
                  onClick={() => setSpeechRate(speechRate === 0.92 ? 0.72 : 0.92)}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-semibold cursor-pointer hover:bg-indigo-500/30 transition"
                  title="Toggle normal / slow speech rate"
                >
                  {speechRate === 0.92 ? '🐇 Audio: Normal (0.92x)' : '🐢 Audio: Slow Learner (0.72x)'}
                </button>
              </div>
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight mt-0.5">
                Pronouns, Verb Conjugation &amp; Simple Sentences (Hindi-German Grammar Logic)
              </h1>
            </div>
          </div>

          {/* Flashcard Mastery Mini Badge */}
          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2 min-w-[220px]">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" /> Flashcard Mastery
              </span>
              <span className="text-emerald-400 font-bold">
                {knownCount} / {totalCards} ({masteryPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 transition-all duration-300"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-2 pb-3">
          {[
            { id: 'flashcards', label: '1. 300 Flashcards (Amadeus Engine)', icon: Sparkles },
            { id: 'notes', label: '2. Lecture 1 Notes & 32 Verbs', icon: Brain },
            { id: 'exercises', label: '3. Practice Exercises (1–7)', icon: BookOpen },
            { id: 'summary', label: '4. Quick Reference & Decks', icon: Layers }
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

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* ============================================================== */}
        {/* TAB 1: 300 INTERACTIVE FLASHCARDS (AMADEUS ARCHITECTURE) */}
        {/* ============================================================== */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="fc-stats-row">
              <div className="fc-stat-chip" title="Total cards mastered">
                <span className="fc-stat-dot" style={{ background: '#10b981' }} />
                <span className="fc-stat-num">{knownCount}</span>
                <span className="fc-stat-lbl">Known</span>
              </div>
              <div className="fc-stat-chip" title="Cards needing review">
                <span className="fc-stat-dot" style={{ background: '#f43f5e' }} />
                <span className="fc-stat-num">{reviewCount}</span>
                <span className="fc-stat-lbl">Review</span>
              </div>
              <div className="fc-stat-chip" title="Unseen cards">
                <span className="fc-stat-dot" style={{ background: '#64748b' }} />
                <span className="fc-stat-num">{unseenCount}</span>
                <span className="fc-stat-lbl">Unseen</span>
              </div>
              <div className="fc-mastery" title="Overall mastery">
                <svg viewBox="0 0 36 36" className="fc-donut">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={`${masteryPct} ${100 - masteryPct}`}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <span className="fc-mastery-pct">{masteryPct}%</span>
                <span className="fc-stat-lbl">Mastery</span>
              </div>
            </div>

            {/* Filters */}
            <div className="fc-filters">
              <select
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="fc-mode-tabs" role="group" aria-label="Filter by study mode">
                {['all', 'unseen', 'review'].map((mode) => (
                  <button
                    key={mode}
                    className={`fc-mode-tab${filterMode === mode ? ' active' : ''}`}
                    onClick={() => setFilterMode(mode)}
                  >
                    {mode === 'all' ? 'All (300)' : mode === 'unseen' ? 'Unseen' : '⚑ Review'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search 300 cards (Hindi, English, German)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white outline-none focus:border-amber-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="fc-progress-bar-wrap">
              <div className="fc-progress-bar-track">
                <div className="fc-progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="fc-progress-label">
                {orderedCards.length > 0 ? `${currentIndex + 1} / ${orderedCards.length}` : '0 / 0'}
              </span>
            </div>

            {/* Flashcard 3D Scene */}
            {!card ? (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                <p className="text-slate-400 font-semibold">No flashcards match your current filters.</p>
                <button
                  onClick={() => {
                    setFilterCategory('All');
                    setFilterMode('all');
                    setSearch('');
                  }}
                  className="bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={`fc-scene${isAnimating ? ' fc-animating' : ''}`}
                onClick={() => !isAnimating && setFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                aria-label={flipped ? 'Click to see question' : 'Click to reveal answer'}
                onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
              >
                <div className={`fc-card${flipped ? ' fc-flipped' : ''}`}>
                  {/* Front Face */}
                  <div className="fc-face fc-front">
                    <div className="fc-face-header">
                      <span className="fc-category-pill">{card.category}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakGerman(card.front, speechRate);
                          }}
                          className="text-slate-400 hover:text-amber-300 p-1 rounded-lg bg-slate-800/80 cursor-pointer"
                          title="Speak German"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <span
                          className="fc-status-dot"
                          style={{ background: statusColor }}
                          title={`Status: ${cardStatus}`}
                        />
                      </div>
                    </div>

                    <p className="fc-front-text">{card.front}</p>

                    <div className="fc-flip-hint">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Click card or press Space to flip</span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="fc-face fc-back">
                    <div className="fc-face-header">
                      <span className="fc-category-pill fc-category-pill--back">{card.category}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakGerman(card.back, speechRate);
                        }}
                        className="text-slate-300 hover:text-emerald-300 p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 cursor-pointer"
                        title="Speak German Answer"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>

                    <div className="fc-answer-label">Answer &amp; Explanation</div>
                    <div className="fc-answer-text">{card.back}</div>

                    {/* Mark Buttons on Back */}
                    <div className="fc-mark-row">
                      <button
                        className={`fc-mark-btn fc-mark-btn--review${cardStatus === 'review' ? ' active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          markCard('review');
                        }}
                        title="Needs Review (key: 1)"
                      >
                        <X className="w-4 h-4" />
                        <span>Needs Review</span>
                      </button>
                      <button
                        className={`fc-mark-btn fc-mark-btn--known${cardStatus === 'known' ? ' active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          markCard('known');
                        }}
                        title="Got It! (key: 2)"
                      >
                        <Check className="w-4 h-4" />
                        <span>Got It!</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback Flash Overlay */}
                {justMarked && (
                  <div className={`fc-feedback-flash fc-feedback-flash--${justMarked}`}>
                    {justMarked === 'known' ? '✓' : '✗'}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Controls */}
            <div className="fc-nav-row">
              <button
                className="fc-nav-btn"
                onClick={prevCard}
                disabled={!card}
                aria-label="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="fc-nav-center">
                <button
                  className={`fc-shuffle-btn${isShuffled ? ' active' : ''}`}
                  onClick={shuffleCards}
                  title={isShuffled ? 'Shuffled — click to reshuffle' : 'Shuffle cards'}
                  aria-label="Shuffle cards"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  className="fc-reset-btn"
                  onClick={resetProgress}
                  title="Reset all study progress"
                  aria-label="Reset progress"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                className="fc-nav-btn fc-nav-btn--next"
                onClick={nextCard}
                disabled={!card}
                aria-label="Next card"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="fc-keyboard-hint">
              <kbd>←</kbd> <kbd>→</kbd> Navigate &nbsp;·&nbsp;
              <kbd>Space</kbd> Flip &nbsp;·&nbsp;
              <kbd>1</kbd> Review &nbsp;·&nbsp;
              <kbd>2</kbd> Known
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: LECTURE 1 NOTES & 32 VERBS EXPLORER */}
        {/* ============================================================== */}
        {activeTab === 'notes' && (
          <div className="space-y-8">
            {/* Why Learn German through Hindi */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳🤝🇩🇪</span>
                <h2 className="text-xl font-bold text-white">
                  1. Why Learn German Through Hindi? (जर्मन हिंदी के माध्यम से क्यों सीखें?)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Most students in India learn German through English, which often makes German grammar feel complicated. However, <strong>German and Hindi share deep grammatical similarities</strong> that English completely lacks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-amber-300">1. Gendered Possessives</div>
                  <p className="text-slate-400">
                    Just as Hindi has <em>मेरा / मेरी / मेरे</em> (unlike English which only has <em>my</em>), German changes possessive words based on grammatical gender.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-sky-300">2. Respectful "You" System</div>
                  <p className="text-slate-400">
                    English uses "You" for everyone. Both Hindi and German distinguish between informal singular (<strong>तू</strong> = <code>du</code>), informal plural (<strong>तुम सब</strong> = <code>ihr</code>), and formal (<strong>आप</strong> = <code>Sie</code>).
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-300">3. Root + Suffix Conjugation</div>
                  <p className="text-slate-400">
                    Both drop the infinitive ending (<strong>-ना</strong> in Hindi; <strong>-en</strong> in German) to find the root stem, and attach a fixed suffix based on the subject pronoun.
                  </p>
                </div>
              </div>
            </section>

            {/* Pronouns Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">
                2. German Personal Pronouns (जर्मन सर्वनाम – Personalpronomen)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse bg-slate-950 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300">
                      <th className="p-3">German</th>
                      <th className="p-3">Hindi</th>
                      <th className="p-3">English</th>
                      <th className="p-3">Usage &amp; Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { g: 'ich', h: 'मैं', e: 'I', n: 'First-person singular' },
                      { g: 'du', h: 'तू / तुम (एकवचन)', e: 'You (informal singular)', n: 'Friends, family, children' },
                      { g: 'er', h: 'वह (पुल्लिंग)', e: 'He', n: 'Masculine singular' },
                      { g: 'sie', h: 'वह (स्त्रीलिंग)', e: 'She', n: 'Feminine singular (lowercase s)' },
                      { g: 'es', h: 'वह (नपुंसकलिंग)', e: 'It', n: 'Neuter singular / objects' },
                      { g: 'ihr', h: 'तुम सब / तुम दोनों', e: 'You all (informal plural)', n: 'Addressing 2+ informal people' },
                      { g: 'wir', h: 'हम', e: 'We', n: 'First-person plural' },
                      { g: 'sie', h: 'वे / वे लोग', e: 'They', n: 'Third-person plural (lowercase s)' },
                      { g: 'Sie', h: 'आप', e: 'YOU (formal)', n: 'Always capitalized S (respect)' }
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => speakGerman(row.g, speechRate)}
                        className="hover:bg-slate-900 cursor-pointer transition"
                      >
                        <td className="p-3 font-bold text-amber-300 font-mono text-sm">{row.g}</td>
                        <td className="p-3 font-semibold text-white">{row.h}</td>
                        <td className="p-3 text-slate-300">{row.e}</td>
                        <td className="p-3 text-slate-400">{row.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Verb Conjugation Logic */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">
                3. Verb Conjugation: Hindi Logic vs. German Logic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="font-bold text-amber-300 text-sm">Step A: Hindi Logic (पीना)</div>
                  <p className="text-slate-300">
                    1. Remove <strong>-ना</strong> from <em>पीना</em> &rarr; Stem: <strong>पी</strong>.<br />
                    2. मैं + पी + <strong>ता हूँ</strong> = मैं पीता हूँ.<br />
                    3. तू + पी + <strong>ता है</strong> = तू पीता है.<br />
                    4. हम + पी + <strong>ते हैं</strong> = हम पीते हैं.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="font-bold text-emerald-300 text-sm">Step B: German Logic (trinken)</div>
                  <p className="text-slate-300">
                    1. Remove <strong>-en</strong> from <em>trinken</em> &rarr; Stem: <strong>trink</strong>.<br />
                    2. ich + trink + <strong>e</strong> = <strong>ich trinke</strong>.<br />
                    3. du + trink + <strong>st</strong> = <strong>du trinkst</strong>.<br />
                    4. wir + trink + <strong>en</strong> = <strong>wir trinken</strong>.
                  </p>
                </div>
              </div>

              {/* Conjugation Mantra */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase">
                    The Conjugation Mantra (कंठस्थ करने का मंत्र)
                  </div>
                  <div className="font-mono text-white text-sm font-bold mt-1">
                    ich trinke &bull; du trinkst &bull; er/sie/es trinkt &bull; ihr trinkt &bull; wir trinken &bull; sie/Sie trinken!
                  </div>
                </div>
                <button
                  onClick={() =>
                    speakGerman(
                      'ich trinke, du trinkst, er trinkt, sie trinkt, es trinkt, ihr trinkt, wir trinken, sie trinken, Sie trinken',
                      speechRate
                    )
                  }
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Chant Mantra Aloud</span>
                </button>
              </div>
            </section>

            {/* Word Order Rule */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">
                4. Word Order: Verb ALWAYS in the 2nd Position
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                In Hindi and Marathi, the verb goes at the <strong>end</strong> (<em>मैं क्रिकेट खेलता हूँ</em>). But in German and English, the conjugated verb <strong>ALWAYS comes in the 2nd Position</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { d: 'Ich trinke Tee.', h: 'मैं चाय पीता हूँ।' },
                  { d: 'Wir trinken Pepsi.', h: 'हम पेप्सी पीते हैं।' },
                  { d: 'Ich spiele Cricket.', h: 'मैं क्रिकेट खेलता हूँ।' },
                  { d: 'Wir lernen Hindi.', h: 'हम हिंदी सीखते हैं।' }
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => speakGerman(item.d, speechRate)}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-emerald-500/40"
                  >
                    <div className="font-bold text-emerald-300 font-mono text-sm">{item.d}</div>
                    <div className="text-slate-400 mt-1">{item.h}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 32 Core Verbs Explorer */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    5. Top 32 Daily-Life German Verbs (with Stems &amp; Meanings)
                  </h2>
                  <p className="text-xs text-slate-400">Click any verb to hear it and view full conjugations:</p>
                </div>
                <input
                  type="text"
                  placeholder="Filter verbs (e.g. play, आना, geh)..."
                  value={verbSearch}
                  onChange={(e) => setVerbSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none max-w-[220px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {filteredVerbs.map((v) => (
                  <div
                    key={v.num}
                    onClick={() => {
                      setSelectedVerb(v);
                      speakGerman(v.infinitive, speechRate);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      selectedVerb?.infinitive === v.infinitive
                        ? 'bg-indigo-900/60 border-amber-400 shadow'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">#{v.num}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono">
                        stem: {v.stem}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-sky-300 mt-1">{v.infinitive}</div>
                    <div className="text-xs text-white font-medium">{v.english}</div>
                    <div className="text-[11px] text-slate-400">{v.hindi}</div>
                  </div>
                ))}
              </div>

              {selectedVerb && (
                <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 mt-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-bold">Selected Verb Conjugation:</span>
                      <h3 className="text-lg font-black text-amber-300">
                        {selectedVerb.infinitive} (Stem: {selectedVerb.stem}) &mdash; {selectedVerb.english} ({selectedVerb.hindi})
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        speakGerman(
                          `ich ${selectedVerb.stem}e, du ${selectedVerb.stem}st, er ${selectedVerb.stem}t, wir ${selectedVerb.infinitive}, ihr ${selectedVerb.stem}t, sie ${selectedVerb.infinitive}`,
                          speechRate
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Speak All Forms
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                    {[
                      { p: 'ich', form: `${selectedVerb.stem}e` },
                      { p: 'du', form: `${selectedVerb.stem}st` },
                      { p: 'er/sie/es', form: `${selectedVerb.stem}t` },
                      { p: 'ihr', form: `${selectedVerb.stem}t` },
                      { p: 'wir', form: selectedVerb.infinitive },
                      { p: 'sie/Sie', form: selectedVerb.infinitive }
                    ].map((conj, idx) => (
                      <div
                        key={idx}
                        onClick={() => speakGerman(`${conj.p} ${conj.form}`, speechRate)}
                        className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center cursor-pointer hover:border-amber-400"
                      >
                        <div className="text-[10px] text-slate-400">{conj.p}</div>
                        <div className="font-bold text-white text-xs mt-0.5">{conj.form}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INTERACTIVE PRACTICE EXERCISES (1 TO 7) */}
        {/* ============================================================== */}
        {activeTab === 'exercises' && (
          <div className="space-y-8">
            {/* Exercise 1: Pronoun Matching */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">Exercise 1</span>
                  <h3 className="text-lg font-bold text-white">Pronoun Matching (सर्वनाम मिलान करें)</h3>
                </div>
                <button
                  onClick={() => setEx1Checked(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  Check Answers
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {EXERCISES_DATA.ex1.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs text-slate-300 font-semibold">{item.prompt}</div>
                    <select
                      value={ex1Answers[item.id] || ''}
                      onChange={(e) => setEx1Answers({ ...ex1Answers, [item.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold"
                    >
                      <option value="">Choose German...</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {ex1Checked && (
                      <div className="text-[11px] font-bold">
                        {ex1Answers[item.id] === item.ans ? (
                          <span className="text-emerald-400">✓ Correct ({item.ans})</span>
                        ) : (
                          <span className="text-rose-400">✗ Answer: {item.ans}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 2: Stem Extraction Lab */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">Exercise 2</span>
                  <h3 className="text-lg font-bold text-white">Stem Extraction Lab (मूल शब्द निकालें)</h3>
                </div>
                <button
                  onClick={() => setEx2Checked(true)}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  Check All Stems
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {EXERCISES_DATA.ex2.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm font-mono">{item.verb}</span>
                      <button
                        onClick={() => speakGerman(item.verb, speechRate)}
                        className="text-slate-400 hover:text-amber-300 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Type stem (remove -en)..."
                      value={ex2Inputs[item.verb] || ''}
                      onChange={(e) => setEx2Inputs({ ...ex2Inputs, [item.verb]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold"
                    />
                    {ex2Checked && (
                      <div className="text-[11px] font-semibold text-slate-300">
                        {ex2Inputs[item.verb]?.trim().toLowerCase() === item.stem ? (
                          <span className="text-emerald-400">✓ Stem: {item.stem} ({item.meaning})</span>
                        ) : (
                          <span className="text-rose-400">Stem: {item.stem} ({item.meaning})</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 3: Verb Ending Suffix Drill */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase">Exercise 3</span>
                  <h3 className="text-lg font-bold text-white">Fill in the Correct Verb Ending (-e, -st, -t, -en)</h3>
                </div>
                <button
                  onClick={() => setEx3Checked(true)}
                  className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  Check All 20 Endings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {EXERCISES_DATA.ex3.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-slate-200 font-medium">
                      {item.id}. {item.sentence}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type conjugated verb..."
                        value={ex3Inputs[item.id] || ''}
                        onChange={(e) => setEx3Inputs({ ...ex3Inputs, [item.id]: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-amber-300 font-bold flex-1"
                      />
                      <button
                        onClick={() =>
                          speakGerman(item.sentence.replace(/_{2,}/, item.answer), speechRate)
                        }
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {ex3Checked && (
                      <div className="text-[11px] font-bold">
                        {ex3Inputs[item.id]?.trim().toLowerCase() === item.answer.toLowerCase() ? (
                          <span className="text-emerald-400">✓ Correct ({item.answer})</span>
                        ) : (
                          <span className="text-rose-400">✗ Answer: {item.answer}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 4: sie / Sie Detective */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase">Exercise 4</span>
                  <h3 className="text-lg font-bold text-white">The "sie / Sie" Detective (संदर्भ पहचानें)</h3>
                </div>
                <button
                  onClick={() => setEx4Checked(true)}
                  className="bg-purple-400 hover:bg-purple-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  Check Detective Choices
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {EXERCISES_DATA.ex4.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-bold text-white">{item.sentence}</div>
                    <select
                      value={ex4Inputs[item.id] || ''}
                      onChange={(e) => setEx4Inputs({ ...ex4Inputs, [item.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-amber-300 font-bold"
                    >
                      <option value="">Who is this?</option>
                      <option value="वह (She)">वह (She)</option>
                      <option value="वे लोग (They)">वे लोग (They)</option>
                      <option value="आप (You - Formal)">आप (You - Formal)</option>
                    </select>
                    {ex4Checked && (
                      <div className="text-[11px] font-semibold space-y-0.5">
                        {ex4Inputs[item.id] === item.ans ? (
                          <div className="text-emerald-400">✓ Richtig! {item.ans}</div>
                        ) : (
                          <div className="text-rose-400">✗ Answer: {item.ans}</div>
                        )}
                        <div className="text-slate-400">{item.explanation}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 5: German Sentence Translation */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase">Exercise 5</span>
                <h3 className="text-lg font-bold text-white">20 Sentence Translation Practice (with Audio &amp; Reveals)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {EXERCISES_DATA.ex5.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-slate-300 font-medium">
                      {item.id}. {item.prompt}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setEx5Reveals({ ...ex5Reveals, [item.id]: !ex5Reveals[item.id] })
                        }
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold underline cursor-pointer"
                      >
                        {ex5Reveals[item.id] ? 'Hide German' : 'Reveal German'}
                      </button>
                      <button
                        onClick={() => speakGerman(item.german, speechRate)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak</span>
                      </button>
                    </div>
                    {ex5Reveals[item.id] && (
                      <div className="text-emerald-400 font-bold font-mono text-sm">
                        {item.german}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 6: Spot and Fix the Mistake */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-400 uppercase">Exercise 6</span>
                <h3 className="text-lg font-bold text-white">Spot and Fix the Mistake (गलती सुधारें)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {EXERCISES_DATA.ex6.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-rose-300 font-mono font-bold line-through">
                      {item.id}. {item.bad}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setEx6Reveals({ ...ex6Reveals, [item.id]: !ex6Reveals[item.id] })
                        }
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold underline cursor-pointer"
                      >
                        {ex6Reveals[item.id] ? 'Hide Correction' : 'Show Correction'}
                      </button>
                      <button
                        onClick={() => speakGerman(item.good, speechRate)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak</span>
                      </button>
                    </div>
                    {ex6Reveals[item.id] && (
                      <div className="space-y-1">
                        <div className="text-emerald-400 font-bold font-mono text-sm">{item.good}</div>
                        <div className="text-[11px] text-slate-400">{item.rule}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Exercise 7: 5 Sentences a Day Builder */}
            <section className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase">Exercise 7 &bull; Strategy Lab</span>
                <h3 className="text-lg font-bold text-white">
                  Kedar Sir's Daily "5 Sentences a Day" Interactive Builder
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Pick any Subject, Action Verb, and Object to synthesize 100% grammatically correct German sentences with the verb in the 2nd position:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Subject (Pronoun):</label>
                  <select
                    value={builderSubject}
                    onChange={(e) => setBuilderSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  >
                    <option value="ich">ich (मैं)</option>
                    <option value="du">du (तू)</option>
                    <option value="er">er (वह लड़का)</option>
                    <option value="sie (she)">sie (वह लड़की)</option>
                    <option value="wir">wir (हम)</option>
                    <option value="ihr">ihr (तुम सब)</option>
                    <option value="sie (they)">sie (वे लोग)</option>
                    <option value="Sie">Sie (आप - Respectful)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Action Verb:</label>
                  <select
                    value={builderVerb}
                    onChange={(e) => setBuilderVerb(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold"
                  >
                    {VERBS_DATA.map((v) => (
                      <option key={v.infinitive} value={v.infinitive}>
                        {v.infinitive} ({v.english})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Universal Object / Context:</label>
                  <select
                    value={builderObject}
                    onChange={(e) => setBuilderObject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sky-300 font-bold"
                  >
                    <option value="Tee">Tee (चाय)</option>
                    <option value="Kaffee">Kaffee (कॉफ़ी)</option>
                    <option value="Pepsi">Pepsi (पेप्सी)</option>
                    <option value="Pizza">Pizza (पिज़्ज़ा)</option>
                    <option value="Cricket">Cricket (क्रिकेट)</option>
                    <option value="Deutsch">Deutsch (जर्मन)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Musik">Musik (संगीत)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Synthesized Sentence:</div>
                  <div className="text-xl font-black text-emerald-300 font-mono">{builderSentence}</div>
                </div>
                <button
                  onClick={() => speakGerman(builderSentence, speechRate)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Speak Sentence</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: QUICK REFERENCE & DECKS OVERVIEW */}
        {/* ============================================================== */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Summary of 6 Flashcard Decks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  {
                    name: 'Deck 1: Pronouns & Grammar Rules',
                    cards: 'Cards 1–30',
                    desc: 'Pronouns, small sie vs capital Sie, finding stems, the conjugation mantra, and word order.'
                  },
                  {
                    name: 'Deck 2: 32 Core Verbs',
                    cards: 'Cards 31–94',
                    desc: 'Infinitives, stems, and translations in both Hindi and English for all 32 daily verbs.'
                  },
                  {
                    name: 'Deck 3: ich & wir Drills',
                    cards: 'Cards 95–158',
                    desc: 'Rapid-fire beginner confidence drills focusing on effortless -e and -en endings.'
                  },
                  {
                    name: 'Deck 4: du, er/sie/es, ihr & sie/Sie Drills',
                    cards: 'Cards 159–230',
                    desc: 'Mastering -st, -t, and -en across all 32 verbs for complete conjugation versatility.'
                  },
                  {
                    name: 'Deck 5: 100% German Sentences',
                    cards: 'Cards 231–280',
                    desc: '50 real-life sentences with universal words (Pepsi, Pizza, Cricket, Tee, Kaffee, Hindi).'
                  },
                  {
                    name: 'Deck 6: Context Detection & Study Tricks',
                    cards: 'Cards 281–300',
                    desc: 'Context traps, spotting errors, placeholder English tricks, and daily 5-sentence strategy.'
                  }
                ].map((deck, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFilterCategory(deck.name.replace(' & Grammar Rules', ' & Rules'));
                      setActiveTab('flashcards');
                    }}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-400 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{deck.name}</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">
                        {deck.cards}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{deck.desc}</p>
                    <div className="text-[11px] font-bold text-amber-400 mt-2 flex items-center gap-1">
                      <span>Practice this Deck now</span> &rarr;
                    </div>
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
