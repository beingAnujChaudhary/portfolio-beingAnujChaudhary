const fs = require('fs');
let code = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

// Match the sets array
const match = code.match(/const guidedSets = (\[[\s\S]*\]);/);
if (match) {
  let sets = eval(match[1]);
  let changes = 0;
  
  sets.forEach(set => {
    let flowChart = '';
    const id = set.id;
    if (id.includes('atc') || id.includes('reissue') || id.includes('vol') || id.includes('involuntary') || id.includes('refund') || id.includes('void')) {
      if (id.includes('vol_unflown') || id === 'set_unflown_reissue') {
        flowChart = 'Voluntary Unflown Workflow:\\nRT ↓ TWD ↓ CHANGE ↓ FXF ↓ FXQ ↓ TQT/TQR ↓ FOP ↓ TTP ↓ TWD';
      } else if (id.includes('vol_partial') || id === 'set_partially_flown_reissue') {
        flowChart = 'Voluntary Partially Flown Workflow:\\nRT ↓ TWD ↓ CHANGE remaining ↓ FXF/S... ↓ FXQ/S... ↓ TQT/TQR ↓ FOP ↓ TTP ↓ TWD';
      } else if (id.includes('involuntary_atc') || id === 'set_involuntary_atc') {
         flowChart = 'Involuntary ATC Workflow:\\nRT ↓ TWD ↓ Airline changes/rebooks ↓ FXI ↓ TQT/TQR ↓ TTP ↓ TWD';
      } else if (id.includes('refund')) {
         flowChart = 'Refund Workflow:\\nTRF ↓ TRFT ↓ TRFU ↓ TRFP';
      } else if (id.includes('void')) {
         flowChart = 'Void Workflow:\\nRT ↓ TWD ↓ TRDC ↓ TWD';
      } else {
         flowChart = 'Workflow:\\nChange booking ↓ FXF ↓ Tell customer amount ↓ Customer agrees ↓ FXQ ↓ TQT/TQR ↓ FOP ↓ TTP/TTM ↓ TWD';
      }
      if (flowChart) {
         if (!set.overview) set.overview = [];
         set.overview.push('', '--- WORKFLOW FLOWCHART ---', flowChart);
         changes++;
      }
    }
  });

  // Now let's add the 4 new ATC Sets
  const atcSets = [
    {
      id: 'set_atc_voluntary_unflown',
      title: 'ATC Reissue: Voluntary Unflown',
      module: 'Ticketing & Reissue',
      steps: [
        { prompt: 'Retrieve the PNR ABC123', expectedCommand: 'RT ABC123' },
        { prompt: 'Check the ticket status to confirm it is unused', expectedCommand: 'TWD' },
        { prompt: 'Change segment 1 date to 28 September', expectedCommand: 'SB28SEP1' },
        { prompt: 'Perform informative ATC pricing', expectedCommand: 'FXF' },
        { prompt: 'Customer accepts the price, perform confirmed ATC pricing', expectedCommand: 'FXQ' },
        { prompt: 'Display the TST', expectedCommand: 'TQT' },
        { prompt: 'Check the ATC Reissue Details panel', expectedCommand: 'TQR' },
        { prompt: 'Update form of payment if required (e.g. cash)', expectedCommand: 'FP CASH' },
        { prompt: 'Issue the new ticket', expectedCommand: 'TTP' },
        { prompt: 'Verify the new ticket', expectedCommand: 'TWD' }
      ],
      overview: [
        'Voluntary Unflown Workflow:\\nRT ↓ TWD ↓ CHANGE ↓ FXF ↓ FXQ ↓ TQT/TQR ↓ FOP ↓ TTP ↓ TWD',
        'FXF = Find/Forecast the cost (Informative)',
        'FXQ = Quote (Confirmed)',
        'Always check the ticket status (OPEN) with TWD before starting.'
      ],
      questions: [
        'Q: What is the difference between FXF and FXQ?',
        'A: FXF is informative and does not change the PNR/TST. FXQ is confirmed and updates the PNR/TST.',
        'Q: Why must you use TWD first?',
        'A: To establish the ticket number, coupon status (OPEN vs USED), and whether the ticket is wholly unflown or partially flown.'
      ]
    },
    {
      id: 'set_atc_voluntary_partial',
      title: 'ATC Reissue: Voluntary Partially Flown',
      module: 'Ticketing & Reissue',
      steps: [
        { prompt: 'Retrieve the PNR ABC123', expectedCommand: 'RT ABC123' },
        { prompt: 'Check ticket status to see which coupons are used/open', expectedCommand: 'TWD' },
        { prompt: 'Rebook the unflown segments (e.g. segment 2 to 28SEP)', expectedCommand: 'SB28SEP2' },
        { prompt: 'Perform informative ATC pricing for unflown segments 2 and 3', expectedCommand: 'FXF/S2-3' },
        { prompt: 'Customer accepts, confirm the pricing for segments 2 and 3', expectedCommand: 'FXQ/S2-3' },
        { prompt: 'Display the TST', expectedCommand: 'TQT' },
        { prompt: 'Check the ATC Reissue Details panel', expectedCommand: 'TQR' },
        { prompt: 'Issue the new ticket', expectedCommand: 'TTP' }
      ],
      overview: [
        'Voluntary Partially Flown Workflow:\\nRT ↓ TWD ↓ CHANGE remaining ↓ FXF/S... ↓ FXQ/S... ↓ TQT/TQR ↓ FOP ↓ TTP ↓ TWD',
        'CRITICAL RULE: For a partially used ticket, you must identify ALL unflown segments in the ATC pricing entry (e.g., FXF/S2-3).'
      ],
      questions: [
        'Q: What is the critical rule for a partially used ticket?',
        'A: You must specify all unflown segments in the ATC pricing entry using /S... (e.g., FXF/S4-5).',
        'Q: What happens if you just use FXF on a partially flown ticket?',
        'A: ATC may fail or price incorrectly because it needs to know which segments are still alive.'
      ]
    },
    {
      id: 'set_atc_involuntary',
      title: 'ATC Reissue: Involuntary (FXI)',
      module: 'Ticketing & Reissue',
      steps: [
        { prompt: 'Retrieve the PNR ABC123 containing the airline-changed itinerary', expectedCommand: 'RT ABC123' },
        { prompt: 'Verify the original ticket and coupon status', expectedCommand: 'TWD' },
        { prompt: 'Run the ATC Involuntary pricing', expectedCommand: 'FXI' },
        { prompt: 'Display the generated TST', expectedCommand: 'TQT' },
        { prompt: 'Review the ATC reissue details (no additional collection/penalty)', expectedCommand: 'TQR' },
        { prompt: 'Issue the involuntary reissue', expectedCommand: 'TTP' },
        { prompt: 'Verify the new ticket', expectedCommand: 'TWD' }
      ],
      overview: [
        'Involuntary ATC Workflow:\\nRT ↓ TWD ↓ Airline changes/rebooks ↓ FXI ↓ TQT/TQR ↓ TTP ↓ TWD',
        'FXI automatically prepares the ticket for reissue without penalty, additional collection, or residual value.',
        'It generates a TST with the original fare, taxes, FE SKCHG endorsement, FO, and FPO.'
      ],
      questions: [
        'Q: What is the biggest difference between FXQ and FXI?',
        'A: FXQ is for voluntary changes initiated by the passenger and may involve penalties/collection. FXI is for involuntary disruptions initiated by the airline and normally has no penalties or additional collection.',
        'Q: Does FXI require an informative step like FXF?',
        'A: No, FXI itself prepares the involuntary reissue TST directly.'
      ]
    },
    {
      id: 'set_atc_best_pricer',
      title: 'ATC Best Pricer vs Standard',
      module: 'Ticketing & Reissue',
      steps: [
        { prompt: 'Retrieve the PNR ABC123', expectedCommand: 'RT ABC123' },
        { prompt: 'Perform ATC standard informative pricing', expectedCommand: 'FXF' },
        { prompt: 'Perform ATC Best Pricer informative pricing', expectedCommand: 'FXE' },
        { prompt: 'Perform ATC Best Pricer confirmed pricing', expectedCommand: 'FXO' }
      ],
      overview: [
        'Standard ATC: FXF (Informative) / FXQ (Confirmed)',
        'Best Pricer ATC: FXE (Informative) / FXO (Confirmed)',
        'Best Pricer explores alternative cheaper availability if requested.'
      ],
      questions: [
        'Q: What is the difference between FXQ and FXO?',
        'A: FXQ confirms standard ATC pricing, while FXO confirms Best Pricer ATC.'
      ]
    }
  ];

  sets.push(...atcSets);
  
  const newCode = 'const guidedSets = ' + JSON.stringify(sets, null, 2) + ';\n\nmodule.exports = guidedSets;\n';
  fs.writeFileSync('generateGuidedSets.cjs', newCode);
  console.log('Modified ' + changes + ' sets and added 4 new ATC sets.');
} else {
  console.log('Could not match guidedSets array');
}
