const fs = require('fs');
let code = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

// Match the sets array
const match = code.match(/const guidedSets = (\[[\s\S]*\]);/);
if (match) {
  let sets = eval(match[1]);

  const pnrIndex = sets.findIndex(s => s.id === 'set_pnr_creation');
  if (pnrIndex !== -1) {
    sets[pnrIndex] = {
      id: "set_pnr_creation",
      title: "PNR Creation and Ticket Issuance",
      module: "PNR & Ticketing",
      steps: [
        { prompt: "Check availability for Delhi to London on 25 September.", expectedCommand: "AN25SEPDELLHR" },
        { prompt: "Sell 1 seat in Y class from line 1.", expectedCommand: "SS1Y1" },
        { prompt: "Enter adult passenger name CHAUDHARY/ANUJ MR.", expectedCommand: "NM1CHAUDHARY/ANUJ MR" },
        { prompt: "Enter contact phone number DEL 919876543210.", expectedCommand: "AP DEL 919876543210" },
        { prompt: "Set ticketing arrangement to OK.", expectedCommand: "TKOK" },
        { prompt: "Enter Received From ANUJ.", expectedCommand: "RF ANUJ" },
        { prompt: "Price the itinerary and create the TST.", expectedCommand: "FXP" },
        { prompt: "Display the stored TST.", expectedCommand: "TQT" },
        { prompt: "Enter form of payment CASH.", expectedCommand: "FP CASH" },
        { prompt: "End the transaction and redisplay (ER).", expectedCommand: "ER" },
        { prompt: "Retrieve the newly created PNR (assume ABC123).", expectedCommand: "RT ABC123" },
        { prompt: "Issue the ticket.", expectedCommand: "TTP" },
        { prompt: "Verify the electronic ticket.", expectedCommand: "TWD" }
      ],
      overview: [
        "Master Workflow: A-S-N-C-T-R-P-F-E-I-V",
        "Availability (AN) ↓ Sell (SS) ↓ Name (NM) ↓ Contact (AP) ↓ Ticketing (TK) ↓ Received (RF) ↓ Price (FXP) ↓ FOP (FP) ↓ End (ER) ↓ Issue (TTP) ↓ Verify (TWD)",
        "The 5 Mandatory PNR Elements: Itinerary (SS), Name (NM), Contact (AP), Ticketing (TK), Received From (RF) [I-N-C-T-R].",
        "FXP prices the PNR and creates a TST. FXX prices without creating a TST.",
        "ER ends and redisplays the PNR. ET ends and ignores it."
      ],
      questions: [
        "Q: What are the 5 mandatory elements required to save a PNR?",
        "A: Itinerary, Name, Contact, Ticketing, Received From (I-N-C-T-R).",
        "Q: Does ER issue the ticket?",
        "A: No, ER only saves/ends the PNR. TTP issues the ticket.",
        "Q: What is the difference between FXP and FXX?",
        "A: FXP prices the itinerary and creates a TST. FXX prices the itinerary but does not create a TST."
      ]
    };
  }

  const newCode = 'const guidedSets = ' + JSON.stringify(sets, null, 2) + ';\n\nmodule.exports = guidedSets;\n';
  fs.writeFileSync('generateGuidedSets.cjs', newCode);
  console.log('Updated set_pnr_creation.');
} else {
  console.log('Could not match guidedSets array');
}
