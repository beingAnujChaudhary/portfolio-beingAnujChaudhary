import React from 'react';

const DetailedNotes: React.FC = () => {
  return (
    <div className="module-container fade-in">
      <div className="module-header">
        <div className="module-title">
          <h2>Detailed Study Notes</h2>
          <span className="badge">Advanced</span>
        </div>
        <p>In-depth explanations and cheat sheets for complex Amadeus workflows.</p>
      </div>

      <div className="notes-content">
        <section className="note-section">
          <h3>1. Rebooking / Date Change (SB)</h3>
          <p>
            <code>SB25SEP2</code> is a rebooking/change-date entry in Amadeus. 
            However, <code>SB25SEP2</code> by itself is not a generic "change segment 2 to 25 SEP" command. 
            The exact <code>SB</code> format depends on the situation and the segment details.
          </p>
          <div className="code-breakdown">
            <pre>
SB25SEP2
│ │     │
│ │     └── Segment 2
│ └──────── 25 September
└────────── SB = change/rebook itinerary
            </pre>
          </div>
          <p><strong>Example:</strong> Suppose your PNR has:</p>
          <pre className="terminal-preview">
1. DEL → LHR   20SEP
2. LHR → DEL   25SEP
          </pre>
          <p>
            An <code>SB</code> entry is used to modify/rebook the relevant segment.
            Always remember: <strong>SB = Schedule/Booking change</strong>.
          </p>
        </section>

        <section className="note-section">
          <h3>2. ARNK (Arrival Not Known)</h3>
          <p>
            An <strong>ARNK</strong> segment is required when there is a break in the itinerary (a surface sector) where the passenger travels by means other than a booked flight.
          </p>
          <ul>
            <li><strong>Command:</strong> <code>SIARNK</code> (Segment Insert ARNK)</li>
            <li><strong>Purpose:</strong> Tells the airline that the passenger's continuity is broken intentionally and prevents auto-cancellation of subsequent flights due to "no-show" assumptions.</li>
          </ul>
          <p><strong>Example Scenario:</strong></p>
          <pre className="terminal-preview">
1. LHR → JFK   (Flight)
2. ARNK        (Surface travel JFK to MIA)
3. MIA → LHR   (Flight)
          </pre>
          <p>You would insert the ARNK segment after segment 1 and before segment 3.</p>
        </section>

        <section className="note-section">
          <h3>3. ATC (Amadeus Ticket Changer) Reissue</h3>
          <p>
            ATC automates the calculation of fare differences and penalties for ticket reissues.
          </p>
          <div className="grid-2-col">
            <div className="card">
              <h4>Voluntary Changes (Passenger requested)</h4>
              <ul>
                <li><code>FXQ</code>: Price the reissue (historical fare).</li>
                <li><code>FXF</code>: Price the reissue and store the TST (Ticket Stored).</li>
              </ul>
            </div>
            <div className="card">
              <h4>Involuntary Changes (Airline caused/Schedule Change)</h4>
              <ul>
                <li><code>FXI</code>: Price involuntary reissue (usually no penalty).</li>
              </ul>
            </div>
          </div>
          <p><strong>Workflow:</strong></p>
          <ol>
            <li>Make the changes to the itinerary (e.g., using <code>SB</code>).</li>
            <li>Price the reissue: <code>FXF</code></li>
            <li>Save the changes: <code>ER</code></li>
            <li>Issue the new ticket: <code>TTP/EXCH/P1</code></li>
          </ol>
        </section>

        <section className="note-section">
          <h3>4. PNR Retrieval (RT)</h3>
          <p>Different ways to retrieve a Passenger Name Record:</p>
          <ul>
            <li><code>RTABCDEF</code>: Retrieve by 6-character Record Locator.</li>
            <li><code>RT/SMITH</code>: Retrieve by passenger's last name.</li>
            <li><code>RT1</code>: Retrieve from a list of similar names.</li>
          </ul>
        </section>

        <section className="note-section">
          <h3>5. Refunds (TRF)</h3>
          <p>Automated refund process workflow:</p>
          <ul>
            <li><code>TRF125-1234567890</code>: Initiate refund for ticket number.</li>
            <li><code>TRFT</code>: Calculate refund taxes.</li>
            <li><code>TRFU</code>: Update refund record.</li>
            <li><code>TRFP</code>: Process the final refund.</li>
          </ul>
        </section>
        
        <section className="note-section">
          <h3>6. Pricing Options</h3>
          <ul>
            <li><code>FXP</code>: Standard pricing (prices booked itinerary as-is).</li>
            <li><code>FXB</code>: Best Pricer (prices itinerary and automatically rebooks into the lowest available class).</li>
          </ul>
        </section>

        <section className="note-section">
          <h3>7. PNR History (RH)</h3>
          <p>Used to audit changes made to the PNR.</p>
          <ul>
            <li><code>RH/ALL</code>: Display all history.</li>
            <li><code>RH/ITIN</code>: Display only itinerary history.</li>
            <li><code>RH/TKT</code>: Display only ticketing history.</li>
          </ul>
        </section>

        <section className="note-section">
          <h3>8. Fare Rules & Comparison</h3>
          <p>
            Before promising any changes, cancellations, or upgrades to a customer, travel professionals must verify the specific fare conditions of a ticket.
          </p>
          
          <div className="card" style={{ marginBottom: '16px', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '6px' }}>
            <h4>Step 1: Display Ticket Image</h4>
            <p><strong>Command:</strong> <code>TWD [Line Number]</code> (e.g., <code>TWD5</code>)</p>
            <p><strong>Use:</strong> Accesses the ticket details required to identify the sector, airline, travel class, and dates necessary for checking fare rules.</p>
          </div>

          <div className="card" style={{ marginBottom: '16px', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '6px' }}>
            <h4>Step 2: Check Fare Rules</h4>
            <p><strong>Command:</strong> <code>FQD [Sector] /A [Airline] /C [Class] /D [Departure Date] /R,UP,[Issuance Date]</code></p>
            <p><strong>Example:</strong> <code>FQD LHR DXB/A BA/C V/D 15APR/R,UP,29JAN</code></p>
            <p><strong>Use:</strong> Retrieves fare basis codes based on specific flight parameters. Once multiple fare bases appear, identify the one matching your ticket image.</p>
          </div>

          <div className="card" style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '6px' }}>
            <h4>Step 3: Display Full Fare Rule Details</h4>
            <p><strong>Command:</strong> <code>FQN [Line Number] /P</code> (e.g., <code>FQN30/P</code>)</p>
            <p><strong>Use:</strong> Displays the actual rule text for the selected fare basis, allowing you to read specific terms regarding non-refundability, change fees, or reissue conditions.</p>
          </div>
        </section>
      </div>
      
      <style>{`
        .notes-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .note-section {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 20px;
        }
        .note-section h3 {
          margin-top: 0;
          color: #60a5fa;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
          margin-bottom: 16px;
        }
        .code-breakdown pre, .terminal-preview {
          background: #0f172a;
          padding: 12px;
          border-radius: 6px;
          color: #a7f3d0;
          font-family: 'JetBrains Mono', monospace;
          overflow-x: auto;
          margin: 12px 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
        }
        .grid-2-col .card {
          background: rgba(15, 23, 42, 0.5);
          padding: 16px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .grid-2-col .card h4 {
          margin-top: 0;
          color: #f8fafc;
        }
        .note-section code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          color: #38bdf8;
        }
      `}</style>
    </div>
  );
};

export default DetailedNotes;
