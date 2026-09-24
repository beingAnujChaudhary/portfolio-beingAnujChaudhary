import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { TerminalSquare, RefreshCw, LogOut, BookOpen, X } from 'lucide-react';
import commandsData from '../data/commands.json';

interface TerminalLine {
  id: number;
  text: string;
  type: 'cmd' | 'ok' | 'bad' | 'info' | 'warn';
}

export default function TerminalView({
  activeExercise,
  clearExercise,
  onExit,
}: {
  activeExercise: any;
  clearExercise: () => void;
  onExit?: () => void;
}) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 1, text: 'AMADEUS SYSTEM READY', type: 'info' },
    { id: 2, text: 'AGENT 1011AA/SU SIGNED IN', type: 'info' },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [stepIndex, setStepIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Free Mode PNR State
  const [pnr, setPnr] = useState({
    name: '',
    itin: [] as string[],
    contacts: [] as string[],
    tkt: '',
    rf: '',
    status: 'NO PNR',
  });

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (activeExercise) {
      setStepIndex(0);
      setHistory(prev => [
        ...prev,
        { id: Date.now(), text: `\n--- TRAINING MODE: ${activeExercise.title.toUpperCase()} ---`, type: 'warn' },
        { id: Date.now() + 1, text: `STEP 1: ${activeExercise.steps[0].prompt}`, type: 'warn' },
      ]);
    } else {
      setShowGuide(false);
    }
  }, [activeExercise]);

  const addLine = (text: string, type: TerminalLine['type']) => {
    setHistory(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    addLine(`> ${cmd.toUpperCase()}`, 'cmd');
    setCmdHistory(prev => [...prev, cmd.toUpperCase()]);
    setHistoryIndex(-1);

    const upperCmd = cmd.toUpperCase().trim();

    if (upperCmd === 'EXIT') {
      if (activeExercise) clearExercise();
      if (onExit) onExit();
      setInput('');
      return;
    }

    // Guided Workflow Mode
    if (activeExercise) {
      if (stepIndex === 9999) {
        clearExercise();
        setInput('');
        return;
      }

      const currentStep = activeExercise.steps[stepIndex];
      const expected = currentStep.expectedCommand.toUpperCase().replace(/\s+/g, '');

      if (upperCmd.replace(/\s+/g, '') === expected) {
        addLine(`OK - PROCESSED`, 'ok');

        const nextIdx = stepIndex + 1;
        if (nextIdx < activeExercise.steps.length) {
          setStepIndex(nextIdx);
          addLine(`STEP ${nextIdx + 1}: ${activeExercise.steps[nextIdx].prompt}`, 'warn');
        } else {
          const saved = JSON.parse(localStorage.getItem('amadeusGuidedProgress') || '{}');
          saved[activeExercise.id] = true;
          localStorage.setItem('amadeusGuidedProgress', JSON.stringify(saved));

          addLine(`*** SCENARIO COMPLETED ***`, 'ok');

          if (activeExercise.overview) {
            addLine(` `, 'info');
            addLine(`--- OVERVIEW ---`, 'warn');
            activeExercise.overview.forEach((line: string) => addLine(line, 'info'));
          }
          if (activeExercise.questions) {
            addLine(` `, 'info');
            addLine(`--- PRACTICE QUESTIONS ---`, 'warn');
            activeExercise.questions.forEach((line: string) => addLine(line, 'info'));
          }

          addLine(` `, 'info');
          addLine(`Type EXIT to return to Practice Sets.`, 'warn');
          setStepIndex(9999);
        }
      } else {
        addLine(
          `INCORRECT. Expected: ${currentStep.expectedCommand}. Type it to continue.`,
          'bad'
        );
      }

      setInput('');
      return;
    }

    // Free Mode Simulator
    let matched = false;

    if (upperCmd === 'IG') {
      setPnr({ name: '', itin: [], contacts: [], tkt: '', rf: '', status: 'IGNORED' });
      addLine('IGNORED', 'info');
      matched = true;
    } else if (upperCmd === 'RT') {
      if (pnr.name || pnr.itin.length > 0) {
        addLine(`--- PNR ---`, 'info');
        if (pnr.name) addLine(`1.${pnr.name}`, 'info');
        pnr.itin.forEach((seg, i) => addLine(`${i + 2} ${seg}`, 'info'));
        pnr.contacts.forEach((c, i) => addLine(`${i + 2 + pnr.itin.length} ${c}`, 'info'));
        if (pnr.tkt) addLine(`TK: ${pnr.tkt}`, 'info');
        if (pnr.rf) addLine(`RF: ${pnr.rf}`, 'info');
      } else {
        addLine('NO RECORD LOCATOR', 'bad');
      }
      matched = true;
    } else if (upperCmd.startsWith('NM1')) {
      setPnr(p => ({ ...p, name: upperCmd.substring(3) }));
      addLine(upperCmd, 'ok');
      matched = true;
    } else if (upperCmd.startsWith('SS')) {
      setPnr(p => ({ ...p, itin: [...p.itin, upperCmd] }));
      addLine(`HK SEGMENT ADDED`, 'ok');
      matched = true;
    } else if (upperCmd.startsWith('AP')) {
      setPnr(p => ({ ...p, contacts: [...p.contacts, upperCmd] }));
      addLine(upperCmd, 'ok');
      matched = true;
    } else if (upperCmd.startsWith('TKOK') || upperCmd.startsWith('TKTL')) {
      setPnr(p => ({ ...p, tkt: upperCmd }));
      addLine('TICKETING ELEMENT ADDED', 'ok');
      matched = true;
    } else if (upperCmd.startsWith('RF')) {
      setPnr(p => ({ ...p, rf: upperCmd.substring(2).trim() }));
      addLine('RECEIVED FROM ADDED', 'ok');
      matched = true;
    } else if (upperCmd === 'ER' || upperCmd === 'ET') {
      if (pnr.name && pnr.rf && pnr.itin.length > 0) {
        addLine('OK - PNR GENERATED: AB12CD', 'ok');
        if (upperCmd === 'ET') {
          setPnr({ name: '', itin: [], contacts: [], tkt: '', rf: '', status: 'NO PNR' });
        }
      } else {
        addLine('NEED NAME/ITIN/RF TO END', 'bad');
      }
      matched = true;
    }

    if (!matched) {
      const isValid = commandsData.find(c => upperCmd.startsWith(c.command.split(' ')[0]));
      if (isValid) {
        addLine(`PROCESSED: ${isValid.purpose}`, 'info');
      } else {
        addLine('FORMAT ERROR', 'bad');
      }
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Toolbar */}
      <div className="terminal-toolbar">
        <div className="terminal-toolbar-left">
          <TerminalSquare size={16} color="var(--cyan)" />
          <span>Amadeus cryptic emulator</span>
        </div>
        <div className="terminal-toolbar-right">
          {activeExercise && (
            <button className="btn primary sm flex-gap" onClick={() => setShowGuide(!showGuide)}>
              <BookOpen size={14} /> {showGuide ? 'Hide' : 'Guide'}
            </button>
          )}
          <button className="btn sm flex-gap" onClick={() => setHistory([])}>
            <RefreshCw size={14} /> Clear
          </button>
          {activeExercise && (
            <button className="btn danger sm flex-gap" onClick={clearExercise}>
              <LogOut size={14} /> Quit
            </button>
          )}
        </div>
      </div>

      {/* Terminal + Guide */}
      <div className="terminal-main-area">
        {/* Terminal */}
        <div className="terminal" style={{ flex: 1, minHeight: 0 }}>
          <div className="terminal-header row-between">
            <span>AMADEUS ALTEA | WINDOW A</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="terminal-screen" ref={screenRef}>
            {history.map(line => (
              <div key={line.id} className={line.type}>
                {line.text}
              </div>
            ))}
          </div>

          <div
            className="terminal-input-area"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="terminal-prompt">{'>'}</div>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="send"
            />
          </div>

          {activeExercise && activeExercise.steps[stepIndex] && (
            <div className="terminal-quick">
              <span style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>
                STEP {stepIndex + 1}/{activeExercise.steps.length}:{' '}
                {activeExercise.steps[stepIndex].prompt}
              </span>
            </div>
          )}
        </div>

        {/* Guide panel */}
        {showGuide && activeExercise && (
          <div
            className="guide-panel panel"
            style={{ background: 'var(--panel)' }}
          >
            <div className="panel-header row-between">
              <span>Guide</span>
              <button className="btn icon-only sm" onClick={() => setShowGuide(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="panel-body" style={{ flex: 1, overflowY: 'auto' }}>
              <div
                style={{ color: 'var(--cyan)', fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}
              >
                {activeExercise.title}
              </div>
              {activeExercise.steps.map((step: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '12px',
                    padding: '10px',
                    backgroundColor:
                      idx === stepIndex ? 'rgba(0,255,255,0.08)' : 'rgba(0,0,0,0.2)',
                    borderLeft:
                      idx === stepIndex ? '3px solid var(--cyan)' : '3px solid transparent',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
                    STEP {idx + 1}
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>{step.prompt}</div>
                  <code
                    style={{
                      color: 'var(--ok)',
                      background: '#111',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'block',
                      fontSize: '13px',
                    }}
                  >
                    {step.expectedCommand}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
