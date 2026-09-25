import { useState, useEffect, useCallback, useRef } from 'react';
import flashcardsData from '../data/flashcards.json';

type TrackStatus = 'known' | 'review' | 'unseen';
type FilterMode = 'all' | 'unseen' | 'review';

interface ProgressRecord {
  status: TrackStatus;
  seenAt?: number;
}

const STORAGE_KEY = 'amadeusFcProgressV2';

function loadSaved(): { index: number; progress: Record<string, ProgressRecord> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { index: 0, progress: {} };
}

function saveSaved(index: number, progress: Record<string, ProgressRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, progress }));
}

export default function Flashcards() {
  const allCategories = ['All', ...Array.from(new Set(flashcardsData.map(c => c.category)))];

  const [progress, setProgress] = useState<Record<string, ProgressRecord>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [justMarked, setJustMarked] = useState<'known' | 'review' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load saved state once
  useEffect(() => {
    const saved = loadSaved();
    setProgress(saved.progress);
    // We'll resolve index after filtering
  }, []);

  // Compute filtered cards
  const filteredCards = flashcardsData.filter(c => {
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchSearch =
      !search ||
      c.front.toLowerCase().includes(search.toLowerCase()) ||
      c.back.toLowerCase().includes(search.toLowerCase());
    const prog = progress[String(c.id)];
    const status: TrackStatus = prog?.status ?? 'unseen';
    const matchMode =
      filterMode === 'all' ||
      (filterMode === 'unseen' && status === 'unseen') ||
      (filterMode === 'review' && status === 'review');
    return matchCat && matchSearch && matchMode;
  });

  const displayOrder = isShuffled ? shuffledOrder : filteredCards.map((_, i) => i);
  const orderedCards = displayOrder
    .filter(i => i < filteredCards.length)
    .map(i => filteredCards[i]);

  const card = orderedCards[currentIndex] ?? null;

  // Stats
  const totalCards = flashcardsData.length;
  const knownCount = Object.values(progress).filter(p => p.status === 'known').length;
  const reviewCount = Object.values(progress).filter(p => p.status === 'review').length;
  const unseenCount = totalCards - knownCount - reviewCount;
  const masteryPct = Math.round((knownCount / totalCards) * 100);

  // Persist when progress or index changes
  useEffect(() => {
    saveSaved(currentIndex, progress);
  }, [progress, currentIndex]);

  // Reset index & flip when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setIsShuffled(false);
  }, [filterCategory, filterMode, search]);

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsAnimating(false);
    }, 220);
  }, [isAnimating]);

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

  const markCard = useCallback((status: TrackStatus) => {
    if (!card) return;
    const id = String(card.id);
    setProgress(prev => ({
      ...prev,
      [id]: { status, seenAt: Date.now() },
    }));
    setJustMarked(status === 'known' ? 'known' : 'review');
    setTimeout(() => setJustMarked(null), 700);
    // Auto-advance
    setTimeout(() => {
      const next = currentIndex + 1 < orderedCards.length ? currentIndex + 1 : 0;
      setFlipped(false);
      setTimeout(() => setCurrentIndex(next), 200);
    }, 300);
  }, [card, currentIndex, orderedCards.length]);

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
    setProgress({});
    setCurrentIndex(0);
    setFlipped(false);
    setIsShuffled(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Keyboard nav
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'l') nextCard();
      else if (e.key === 'ArrowLeft' || e.key === 'h') prevCard();
      else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFlipped(f => !f);
      } else if (e.key === '1') markCard('review');
      else if (e.key === '2') markCard('known');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextCard, prevCard, markCard]);

  const cardStatus: TrackStatus = card ? (progress[String(card.id)]?.status ?? 'unseen') : 'unseen';

  const statusColor = {
    known: 'var(--ok)',
    review: 'var(--bad)',
    unseen: 'var(--muted)',
  }[cardStatus];

  const progressPct = orderedCards.length > 0
    ? Math.round(((currentIndex + 1) / orderedCards.length) * 100)
    : 0;

  return (
    <div ref={containerRef} style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* ── Stats Row ── */}
      <div className="fc-stats-row">
        <div className="fc-stat-chip" title="Total cards mastered">
          <span className="fc-stat-dot" style={{ background: 'var(--ok)' }} />
          <span className="fc-stat-num">{knownCount}</span>
          <span className="fc-stat-lbl">Known</span>
        </div>
        <div className="fc-stat-chip" title="Cards needing review">
          <span className="fc-stat-dot" style={{ background: 'var(--bad)' }} />
          <span className="fc-stat-num">{reviewCount}</span>
          <span className="fc-stat-lbl">Review</span>
        </div>
        <div className="fc-stat-chip" title="Unseen cards">
          <span className="fc-stat-dot" style={{ background: 'var(--muted)' }} />
          <span className="fc-stat-num">{unseenCount}</span>
          <span className="fc-stat-lbl">Unseen</span>
        </div>
        <div className="fc-mastery" title="Overall mastery">
          <svg viewBox="0 0 36 36" className="fc-donut">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#122736" strokeWidth="3.5" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="var(--ok)" strokeWidth="3.5"
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

      {/* ── Filters ── */}
      <div className="fc-filters">
        <select
          className="input"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {allCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* On mobile these sit side-by-side; on tablet+ they become grid columns */}
        <div className="fc-filter-row2">
          <div className="fc-mode-tabs" role="group" aria-label="Filter by study mode">
            {(['all', 'unseen', 'review'] as FilterMode[]).map(mode => (
              <button
                key={mode}
                className={`fc-mode-tab${filterMode === mode ? ' active' : ''}`}
                onClick={() => setFilterMode(mode)}
              >
                {mode === 'all' ? 'All' : mode === 'unseen' ? 'Unseen' : '⚑ Review'}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="input"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 0 }}
            aria-label="Search flashcards"
          />
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="fc-progress-bar-wrap">
        <div className="fc-progress-bar-track">
          <div
            className="fc-progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
          {/* Known sub-bar shown separately via stats */}
        </div>
        <span className="fc-progress-label">
          {orderedCards.length > 0
            ? `${currentIndex + 1} / ${orderedCards.length}`
            : '0 / 0'}
        </span>
      </div>

      {/* ── Flashcard ── */}
      {!card ? (
        <div className="fc-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M9 9h6M9 13h4" />
          </svg>
          <p>No cards match your filters.</p>
          <button className="btn" onClick={() => { setFilterCategory('All'); setFilterMode('all'); setSearch(''); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className={`fc-scene${isAnimating ? ' fc-animating' : ''}`}
          onClick={() => !isAnimating && setFlipped(f => !f)}
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Click to see question' : 'Click to reveal answer'}
          onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
        >
          <div className={`fc-card${flipped ? ' fc-flipped' : ''}`}>
            {/* Front */}
            <div className="fc-face fc-front">
              <div className="fc-face-header">
                <span className="fc-category-pill">{card.category}</span>
                <span className="fc-status-dot" style={{ background: statusColor }} title={`Status: ${cardStatus}`} />
              </div>
              <p className="fc-front-text">{card.front}</p>
              <div className="fc-flip-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                Click to flip
              </div>
            </div>

            {/* Back */}
            <div className="fc-face fc-back">
              <div className="fc-face-header">
                <span className="fc-category-pill fc-category-pill--back">{card.category}</span>
              </div>
              <div className="fc-answer-label">Command / Example</div>
              <div className="fc-answer-text">{card.back}</div>

              {/* Mark buttons on back face */}
              <div className="fc-mark-row">
                <button
                  className={`fc-mark-btn fc-mark-btn--review${cardStatus === 'review' ? ' active' : ''}`}
                  onClick={e => { e.stopPropagation(); markCard('review'); }}
                  title="Needs Review (key: 1)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Needs Review
                </button>
                <button
                  className={`fc-mark-btn fc-mark-btn--known${cardStatus === 'known' ? ' active' : ''}`}
                  onClick={e => { e.stopPropagation(); markCard('known'); }}
                  title="Got it! (key: 2)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Got It!
                </button>
              </div>
            </div>
          </div>

          {/* Feedback flash overlay */}
          {justMarked && (
            <div className={`fc-feedback-flash fc-feedback-flash--${justMarked}`}>
              {justMarked === 'known' ? '✓' : '✗'}
            </div>
          )}
        </div>
      )}

      {/* ── Navigation Controls ── */}
      <div className="fc-nav-row">
        <button className="btn fc-nav-btn" onClick={prevCard} disabled={!card} aria-label="Previous card">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <div className="fc-nav-center">
          <button
            className={`fc-shuffle-btn${isShuffled ? ' active' : ''}`}
            onClick={shuffleCards}
            title={isShuffled ? 'Shuffled — click to reshuffle' : 'Shuffle cards'}
            aria-label="Shuffle cards"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>
          <button
            className="fc-reset-btn"
            onClick={resetProgress}
            title="Reset all study progress"
            aria-label="Reset progress"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        <button className="btn fc-nav-btn fc-nav-btn--next" onClick={nextCard} disabled={!card} aria-label="Next card">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Keyboard hint ── */}
      <div className="fc-keyboard-hint">
        <kbd>←</kbd><kbd>→</kbd> Navigate &nbsp;·&nbsp;
        <kbd>Space</kbd> Flip &nbsp;·&nbsp;
        <kbd>1</kbd> Review &nbsp;·&nbsp;
        <kbd>2</kbd> Known
      </div>
    </div>
  );
}
