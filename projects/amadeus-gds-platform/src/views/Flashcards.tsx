import { useState, useEffect } from 'react';
import flashcardsData from '../data/flashcards.json';

export default function Flashcards() {
  const [cards, setCards] = useState<typeof flashcardsData>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(flashcardsData.map(c => c.category))];

  useEffect(() => {
    const saved = localStorage.getItem('amadeusFcProgress');
    const parsedProgress = saved ? JSON.parse(saved) : {};
    setProgress(parsedProgress);
    
    // Filter and Sort
    const filtered = flashcardsData.filter(c => {
      const matchesSearch = c.front.toLowerCase().includes(search.toLowerCase()) || 
                            c.back.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const sorted = filtered.sort((a, b) => {
      const pA = parsedProgress[a.id] || 0;
      const pB = parsedProgress[b.id] || 0;
      return pA - pB;
    });

    setCards(sorted);
    setCurrentIndex(0);
    setFlipped(false);
  }, [search, filterCategory]);

  const handleRate = (rating: number) => {
    if (!cards[currentIndex]) return;
    
    const cardId = cards[currentIndex].id;
    const currentVal = progress[cardId] || 0;
    
    const newProgress = { ...progress, [cardId]: Math.max(0, Math.min(3, currentVal + rating)) };
    setProgress(newProgress);
    localStorage.setItem('amadeusFcProgress', JSON.stringify(newProgress));
    
    setFlipped(false);
    
    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back or show completion state
      setCurrentIndex(0);
    }
  };

  const card = cards[currentIndex];

  if (!card && cards.length === 0) return (
    <div>
      <div className="toolbar row-between">
        <p className="sub" style={{ margin: 0 }}>Test your memory of Amadeus formats and concepts.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            className="input" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: '150px' }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="input" 
            placeholder="Search flashcards..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>No flashcards found matching your filters.</div>
    </div>
  );
  if (!card) return <div>Loading flashcards...</div>;

  return (
    <div>
      <div className="toolbar row-between">
        <p className="sub" style={{ margin: 0 }}>Test your memory of Amadeus formats and concepts.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            className="input" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: '150px' }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="input" 
            placeholder="Search flashcards..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>
      
      <div className="flashcard-wrap">
        <div className="flashcard" onClick={() => !flipped && setFlipped(true)} style={{ cursor: flipped ? 'default' : 'pointer' }}>
          <div>
            <div className="flashcard-cat">{card.category}</div>
            <div className="flashcard-front">{card.front}</div>
          </div>
          
          {!flipped ? (
            <div style={{ color: 'var(--muted)', fontSize: '14px', marginTop: 'auto' }}>Click to flip</div>
          ) : (
            <div>
              <div className="flashcard-back">Answer:</div>
              <div className="flashcard-answer">{card.back}</div>
              
              <div className="flashcard-actions">
                <button className="btn danger" onClick={(e) => { e.stopPropagation(); handleRate(-1); }}>Hard (Forgot)</button>
                <button className="btn" onClick={(e) => { e.stopPropagation(); handleRate(1); }}>Good</button>
                <button className="btn primary" onClick={(e) => { e.stopPropagation(); handleRate(2); }}>Easy</button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        Card {currentIndex + 1} of {cards.length}
      </div>
    </div>
  );
}
