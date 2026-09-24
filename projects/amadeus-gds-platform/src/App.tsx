import { useState } from 'react';
import { TerminalSquare, BookOpen, Layers, Library, ChevronRight, LayoutDashboard, X } from 'lucide-react';
import Dashboard from './views/Dashboard';
import TerminalView from './views/TerminalView';
import PracticeSets from './views/PracticeSets';
import Flashcards from './views/Flashcards';
import Reference from './views/Reference';
import DetailedNotes from './views/DetailedNotes';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [navOpen, setNavOpen] = useState(false);

  const startExercise = (exercise: any) => {
    setActiveExercise(exercise);
    setCurrentView('terminal');
    setNavOpen(false);
  };

  const navigate = (view: string) => {
    setCurrentView(view);
    setNavOpen(false);
  };

  const viewLabel: Record<string, string> = {
    dashboard: 'Dashboard',
    terminal: 'Terminal',
    practice: 'Practice Sets',
    flashcards: 'Flashcards',
    reference: 'Command Reference',
    notes: 'Detailed Notes',
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Amadeus<span>Lab</span></div>
          <button className="hamburger" onClick={() => setNavOpen(o => !o)} aria-label="Toggle menu">
            {navOpen ? <X size={22} color="var(--text)" /> : <><span /><span /><span /></>}
          </button>
        </div>

        <nav className={`nav-menu${navOpen ? ' open' : ''}`}>
          {[
            { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { key: 'terminal', label: 'Terminal', Icon: TerminalSquare },
            { key: 'practice', label: 'Practice Sets', Icon: Layers },
            { key: 'flashcards', label: 'Flashcards', Icon: Library },
            { key: 'reference', label: 'Command Ref', Icon: BookOpen },
            { key: 'notes', label: 'Detailed Notes', Icon: BookOpen },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`nav-item ${currentView === key ? 'active' : ''}`}
              onClick={() => navigate(key)}
            >
              <div className="flex-gap">
                <Icon className="nav-item-icon" />
                <span>{label}</span>
              </div>
              {key === 'terminal' && activeExercise && <div className="badge">Active</div>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <main>
        <header className="main-header">
          <div className="flex-gap">
            <h3 style={{ margin: 0 }}>{viewLabel[currentView] || currentView}</h3>
            {activeExercise && currentView === 'terminal' && (
              <>
                <ChevronRight size={16} color="var(--muted)" />
                <span className="badge" style={{ background: 'var(--gold)', color: '#000' }}>Training</span>
              </>
            )}
          </div>
          <div className="status-text">
            Agent: <b>1011AA/SU</b> | Office: <b>BOMQR0800</b>
          </div>
        </header>

        <div className="main-content">
          {currentView === 'dashboard' && <Dashboard changeView={navigate} />}
          {currentView === 'terminal' && (
            <TerminalView
              activeExercise={activeExercise}
              clearExercise={() => setActiveExercise(null)}
              onExit={() => setCurrentView('practice')}
            />
          )}
          {currentView === 'practice' && <PracticeSets startExercise={startExercise} />}
          {currentView === 'flashcards' && <Flashcards />}
          {currentView === 'reference' && <Reference />}
          {currentView === 'notes' && <DetailedNotes />}
        </div>
      </main>
    </div>
  );
}

export default App;
