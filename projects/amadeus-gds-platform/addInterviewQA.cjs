const fs = require('fs');
let code = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');
const match = code.match(/const guidedSets = (\[[\s\S]*\]);/);
if (!match) { console.log('No match'); process.exit(1); }
let sets = eval(match[1]);

// ── Extra questions keyed by set ID ────────────────────────────────────────
const extras = {

  set_purged_pnr: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'RPD immediately opens the old PNR.'",
    "    Correct answer: RPD submits/recalls a purged-record request;",
    "    RLD is used to check the request status, and RLDT retrieves the processed result.",
    "",
    "Real-life Scenario — Customer says:",
    "    'I travelled six months ago. My booking reference was AB12CD.",
    "    I need my old itinerary and ticket details.'",
    "Correct workflow:",
    "  1. Try RT AB12CD — if purged, the system will say NOT FOUND",
    "  2. Use RPD/RLC-AB12CD/[date] to request a past-date recall",
    "  3. Use RLD to check if the request has been processed",
    "  4. Use RLDT1 to open the retrieved PDR",
    "  5. Use TWD/TKT[number] to display the actual e-ticket if needed",
  ],

  set_pnr_history: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'I use RT to see what changes were made.'",
    "    Correct answer: RT shows the CURRENT state of the PNR.",
    "    RH (PNR History) is the audit trail showing all past changes.",
    "",
    "Real-life Scenario — Supervisor asks:",
    "    'Who changed passenger SHARMA's flight segment yesterday?'",
    "Correct workflow:",
    "  1. RT [locator] — retrieve the PNR",
    "  2. RHA — view air segment history",
    "  3. Look for CS (Changed Status) or the relevant action code",
    "  4. Note the agent sign, office ID and date/time of the change",
    "",
    "Interview Q: What action codes might you see in RH?",
    "A: O = Original entry, A = Added, C = Changed, X = Cancelled.",
    "   For example: ON = Original Name, CS = Changed Status, XS = Cancelled Segment.",
  ],

  set_pnr_retrieval_advanced: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'RT always finds the booking.'",
    "    Correct answer: RT works for active/live PNRs. For purged bookings use RPD.",
    "    For PNRs on another GDS/airline system, use RO to claim them.",
    "",
    "Real-life Scenario:",
    "    'I only have a ticket number 074-1234567890. Can I find the booking?'",
    "Correct answer:",
    "  Use RT TKT/074-1234567890 to retrieve via ticket number.",
    "  Or use TWD/TKT074-1234567890 to view the e-ticket directly.",
    "",
    "Interview Q: A passenger gives you only their surname and flight number. How do you retrieve?",
    "A: RT KL153/12AUG-SMITH — retrieve by flight/date/name combination.",
  ],

  set_pnr_creation: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'ER issues the ticket.'",
    "    Correct answer: ER ends the PNR and saves it. TTP issues the ticket. TWD verifies it.",
    "",
    "Real-life Scenario — Interviewer asks:",
    "    'Walk me through creating a PNR and issuing a ticket for one passenger.'",
    "Strong answer:",
    "  AN25SEPDELLHR → SS1Y1 → NM1CHAUDHARY/ANUJ MR → AP DEL 919876543210",
    "  → TKOK → RF ANUJ → FXP → TQT → FP CASH → ER → RT ABC123 → TTP → TWD",
    "",
    "Interview Q: What are the 5 mandatory PNR elements?",
    "A: Itinerary (SS), Name (NM), Contact (AP), Ticketing (TK), Received From (RF). [I-N-C-T-R]",
  ],

  set_split_pnr: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'After SP I use ER to save.'",
    "    Correct answer: For the associate/split PNR use EF (End and File), not ER.",
    "    Then RF + ET on the parent PNR.",
    "",
    "Real-life Scenario:",
    "    'Passenger SHARMA in a group of 3 now wants to travel on a different date.'",
    "Correct workflow:",
    "  RT [locator] → SP2 (split SHARMA) → RF PAX → EF",
    "  → Parent PNR appears → RF PAX → ET",
    "  → Retrieve child PNR → rebook required flight → ticket",
    "",
    "Interview Q: How are the parent and child PNRs linked after a split?",
    "A: Through AXR (Associated Record Indexing). Use RTAXR to display the link.",
  ],

  set_arnk: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'ARNK books the surface leg for the passenger.'",
    "    Correct answer: ARNK does NOT book anything. It simply indicates the surface",
    "    transportation is unknown. It maintains itinerary continuity.",
    "",
    "Real-life Scenario:",
    "    'Passenger flies DEL-LHR on Air India, then takes Eurostar to CDG,",
    "    then flies CDG-DEL on Air France. What do you do?'",
    "Correct workflow:",
    "  Sell: SS1Y1 (DEL-LHR) → SS1Y1 (CDG-DEL) → SIARNK",
    "  Amadeus automatically places ARNK between LHR and CDG.",
    "",
    "Interview Q: What is the difference between ARNK and SO?",
    "A: ARNK = surface transport unknown (no air booking). SO = open air segment",
    "   (passenger will fly but date/flight is not confirmed yet).",
  ],

  set_atc: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'FXF confirms the reissue.'",
    "    Correct answer: FXF is informative only — no PNR/TST change.",
    "    FXQ is the confirmed ATC pricing that updates the TST.",
    "",
    "Real-life Scenario:",
    "    'Passenger wants to change their DEL-LHR flight from 25SEP to 28SEP.",
    "    The ticket is completely unused.'",
    "Correct workflow:",
    "  RT → TWD (confirm OPEN status) → rebook → FXF (show cost to passenger)",
    "  → passenger agrees → FXQ → TQT → TQR → FP → TTP → TWD",
    "",
    "Interview Q: What is the Golden Rule for partially used tickets?",
    "A: You MUST specify all unflown segments: FXF/S2-3 and FXQ/S2-3.",
    "   Failing to do so causes incorrect ATC pricing.",
  ],

  set_involuntary: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'For an involuntary change I use FXQ.'",
    "    Correct answer: FXQ is for VOLUNTARY changes. Involuntary disruptions use FXI.",
    "    FXI automatically prepares the TST without penalty or additional collection.",
    "",
    "Real-life Scenario:",
    "    'Airline cancelled AI123 DEL-LHR 25SEP and rebooked on AI125 26SEP.",
    "    What command do you use to reissue the ticket?'",
    "Correct workflow:",
    "  RT → TWD → FXI → TQT → TQR (verify no penalty) → TTP → TWD",
  ],

  set_refund_vol_unflown: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'TRFP issues the refund immediately.'",
    "    Correct answer: TRFP processes/pays the refund after TRF → TRFT → TRFU.",
    "    Master workflow: TRF → TRFT → TRFU → TRFP",
    "",
    "Real-life Scenario:",
    "    'Passenger bought a fully flexible ticket but cannot travel. No sectors flown.'",
    "Correct workflow:",
    "  TRF/TKT[number] → TRFT (fare calculation) → TRFU (update)",
    "  → TRFP (process refund) → TWD (verify coupon status = REFUNDED)",
    "",
    "Interview Q: What command cancels an unprocessed refund?",
    "A: TRDX — cancels a refund before it has been processed/confirmed.",
  ],

  set_void: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'I can void any ticket anytime.'",
    "    Correct answer: A ticket can only be voided if it has NOT yet been",
    "    confirmed by the local BSP/ARC, and within the permitted void window.",
    "",
    "Real-life Scenario:",
    "    'You issued a ticket 30 minutes ago with wrong passenger name.",
    "    The BSP has not yet closed. What do you do?'",
    "Correct workflow:",
    "  RT [locator] → TWD (confirm ticket status) → TRDC → TWD (verify VOID status)",
    "",
    "Interview Q: What is the difference between void and refund?",
    "A: Void reverses the ticket transaction (no refund record to BSP).",
    "   Refund processes a return of fare/taxes through the normal BSP channel.",
  ],

  set_ticket_void: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'TRDC works any time after issue.'",
    "    Correct answer: TRDC (void) is only available before BSP confirmation.",
    "    After that, you must process a full refund using TRF workflow.",
  ],

  set_fare_rules_basics: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'FQN shows me the price of the fare.'",
    "    Correct answer: FQN shows fare rules/conditions (restrictions, penalties, etc.).",
    "    To display a fare price, use FQD (Fare Quote Display).",
    "",
    "Real-life Scenario:",
    "    'Customer asks: Can I change my flight for free?'",
    "Correct workflow:",
    "  FQD[route] → FQN (check Category 31 – Voluntary Changes) for penalty details.",
    "",
    "Interview Q: What are the 3 key fare rule commands?",
    "A: FQN = Fare Notes (rules), FQR = Routing, FQS = Booking code information.",
  ],

  set_pricing_booked: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'FXX creates the TST.'",
    "    Correct answer: FXX prices the PNR but does NOT create a TST.",
    "    FXP prices the PNR AND creates the TST.",
    "",
    "Real-life Scenario:",
    "    'You want to show a passenger the fare breakdown before committing.'",
    "Correct workflow:",
    "  FXX → show the price → passenger confirms → FXP (creates TST) → TQT → TTP",
  ],

  set_name_correction: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'I can change the passenger name at any time.'",
    "    Correct answer: Name changes are airline-policy specific.",
    "    Minor corrections (typos) may be allowed. Full name changes generally are not.",
    "",
    "Real-life Scenario:",
    "    'Agent misspelled CHAUDHARY as CHAUDHERY. Ticket not yet issued.'",
    "Correct workflow:",
    "  RT → identify name element number → use appropriate name change command",
    "  → RF → ER → TTP → TWD",
  ],

  set_queues: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'Queues are just messages from other agents.'",
    "    Correct answer: Queues are a structured PNR workflow system used by airlines,",
    "    offices and systems to send PNRs requiring action.",
    "",
    "Real-life Scenario:",
    "    'An airline sends a schedule-change queue for all affected passengers.'",
    "Correct workflow:",
    "  QD (display queue) → open queue → RT each PNR → check RH for changes",
    "  → action the PNR → QR (remove from queue) or QE (end/exit queue)",
  ],

  set_rebooking: [
    "",
    "⚠️  COMMON INTERVIEW MISTAKE — Do NOT say:",
    "    'I just rebook the new flight and the old one disappears.'",
    "    Correct answer: You must explicitly cancel the old segment before or after rebooking,",
    "    depending on the situation. Always verify the status codes after rebooking.",
    "",
    "Real-life Scenario:",
    "    'Passenger wants to change DEL-LHR 25SEP to 28SEP. Ticket not yet issued.'",
    "Correct workflow:",
    "  RT → rebook new segment (SS or SB) → cancel old segment if needed",
    "  → RF → ER → verify segment status (HK expected)",
  ],
};

// Apply extras to each matching set
let updatedCount = 0;
sets = sets.map(set => {
  if (extras[set.id]) {
    if (!set.questions) set.questions = [];
    set.questions = set.questions.concat(extras[set.id]);
    updatedCount++;
  }
  return set;
});

const newCode = 'const guidedSets = ' + JSON.stringify(sets, null, 2) + ';\n\nmodule.exports = guidedSets;\n';
fs.writeFileSync('generateGuidedSets.cjs', newCode);
console.log(`Added interview extras to ${updatedCount} sets.`);
