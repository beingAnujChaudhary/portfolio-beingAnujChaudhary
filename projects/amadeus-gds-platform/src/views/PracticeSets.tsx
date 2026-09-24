import { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';
import guidedSetsData from '../data/guidedSets.json';

export default function PracticeSets({ startExercise }: { startExercise: (set: any) => void }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('amadeusGuidedProgress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all practice set progress?')) {
      localStorage.removeItem('amadeusGuidedProgress');
      setProgress({});
    }
  };

  return (
    <div>
      <p className="sub" style={{ marginBottom: '24px' }}>Guided Multi-Step Workflows from Amadeus Training.</p>
      
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header row-between">
          <div>
            <span>Guided Scenarios</span>
            <span className="badge" style={{ marginLeft: '12px' }}>{guidedSetsData.length} Sets</span>
          </div>
          <button className="btn sm" onClick={resetProgress} style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }}>
            Reset Progress
          </button>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {guidedSetsData.map((set) => (
            <div key={set.id} className={`exercise-item ${progress[set.id] ? 'done' : ''}`}>
              <div className="exercise-num">
                <span style={{fontSize: '12px', display: 'block', color: 'var(--muted)'}}>SET</span>
                {set.id.split('_')[2] || 1}
              </div>
              <div>
                <div className="exercise-task">{set.title}</div>
                <div className="exercise-meta">
                  {progress[set.id] ? (
                    <span style={{color: 'var(--ok)'}}>Completed ({set.steps.length} Steps)</span>
                  ) : (
                    <span>Pending ({set.steps.length} Steps)</span>
                  )}
                  <span style={{marginLeft: '12px'}} className="badge">{set.module}</span>
                </div>
              </div>
              <div>
                <button className="btn sm flex-gap" onClick={() => startExercise(set)}>
                  <PlayCircle size={14} /> {progress[set.id] ? 'Retry' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
