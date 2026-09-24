import { useEffect, useState } from 'react';
import { Trophy, CheckCircle, TerminalSquare } from 'lucide-react';
import guidedSetsData from '../data/guidedSets.json';
import flashcardsData from '../data/flashcards.json';

export default function Dashboard({ changeView }: { changeView: (view: string) => void }) {
  const [stats, setStats] = useState({ exTotal: 0, exDone: 0, fcTotal: 0, fcMastered: 0 });

  useEffect(() => {
    const savedEx = JSON.parse(localStorage.getItem('amadeusGuidedProgress') || '{}');
    const savedFc = JSON.parse(localStorage.getItem('amadeusFcProgress') || '{}');
    
    const exDone = Object.values(savedEx).filter(Boolean).length;
    const fcMastered = Object.values(savedFc).filter((v: any) => v >= 3).length; // simple logic: level 3 is mastered

    setStats({
      exTotal: guidedSetsData.length,
      exDone,
      fcTotal: flashcardsData.length,
      fcMastered
    });
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '28px' }}>Welcome back, Agent</h2>
      <p className="sub">Pick up where you left off in your Amadeus training.</p>
      
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div className="lbl">Workflows Completed</div>
          <div className="num">{stats.exDone} <span style={{fontSize:'16px', color:'var(--muted)'}}>/{stats.exTotal}</span></div>
        </div>
        <div className="card">
          <div className="lbl">Flashcards Mastered</div>
          <div className="num">{stats.fcMastered} <span style={{fontSize:'16px', color:'var(--muted)'}}>/{stats.fcTotal}</span></div>
        </div>
        <div className="card">
          <div className="lbl">Current Level</div>
          <div className="num">Trainee</div>
        </div>
        <div className="card">
          <div className="lbl">Accuracy</div>
          <div className="num">-- %</div>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <div className="panel-header">Quick Actions</div>
          <div className="panel-body">
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn primary flex-gap" onClick={() => changeView('terminal')}>
                <TerminalSquare size={18} /> Open Free Terminal
              </button>
              <button className="btn flex-gap" onClick={() => changeView('practice')}>
                <CheckCircle size={18} /> Resume Practice
              </button>
              <button className="btn flex-gap" onClick={() => changeView('flashcards')}>
                <Trophy size={18} /> Review Flashcards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
