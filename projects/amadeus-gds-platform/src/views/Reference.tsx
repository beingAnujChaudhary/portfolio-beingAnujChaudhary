import { useState } from 'react';
import commandsData from '../data/commands.json';

export default function Reference() {
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');

  const groups = ['All', ...new Set(commandsData.map(c => c.group))];

  const filtered = commandsData.filter(c => {
    const matchesSearch = c.command.toLowerCase().includes(search.toLowerCase()) || 
                          c.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = filterGroup === 'All' || c.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div>
      <div className="toolbar row-between">
        <p className="sub" style={{ margin: 0 }}>Browse the complete Amadeus command dictionary from the training modules.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            className="input" 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value)}
            style={{ width: '150px' }}
          >
            {groups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="input" 
            placeholder="Search commands..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table className="table" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '90px' }} />
                <col style={{ width: '160px' }} />
                <col style={{ width: '220px' }} />
                <col style={{ width: '90px' }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Purpose</th>
                  <th>Example</th>
                  <th>Group</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><span className="code">{c.command}</span></td>
                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{c.purpose}</td>
                    <td
                      style={{
                        fontFamily: 'var(--font-mono)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        fontSize: '12px',
                        color: 'var(--cyan)',
                        lineHeight: '1.6',
                      }}
                    >
                      {c.example}
                    </td>
                    <td><span className="badge">{c.group}</span></td>
                    <td
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--muted)',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: '1.5',
                      }}
                    >
                      {c.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>No commands found matching "{search}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
