const fs = require('fs');
let code = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

// Match the sets array
const match = code.match(/const guidedSets = (\[[\s\S]*\]);/);
if (match) {
  let sets = eval(match[1]);

  const splitIndex = sets.findIndex(s => s.id === 'set_split_pnr');
  if (splitIndex !== -1) {
    sets[splitIndex] = {
      id: "set_split_pnr",
      title: "How to Split PNR",
      module: "PNR & Profiles",
      steps: [
        { prompt: "Retrieve the parent PNR (Locator: ABC123).", expectedCommand: "RT ABC123" },
        { prompt: "Split passenger 2.", expectedCommand: "SP2" },
        { prompt: "Enter Received From in the new associate PNR.", expectedCommand: "RF PAX" },
        { prompt: "End and File the associate PNR.", expectedCommand: "EF" },
        { prompt: "Enter Received From in the parent PNR.", expectedCommand: "RF PAX" },
        { prompt: "End the parent PNR transaction.", expectedCommand: "ET" }
      ],
      overview: [
        "Split Workflow:\\nRT ↓ SP2 ↓ RF PAX ↓ EF ↓ Parent PNR ↓ RF PAX ↓ ET",
        "SP = Split PNR. Example: SP2 or SP2,4.",
        "EF = End and File (used for the associate PNR).",
        "The parent and child PNRs remain linked via AXR."
      ],
      questions: [
        "Q: Can you use ER to end the associate PNR?",
        "A: No, you must use EF (End and File) for the associate PNR, then finish the parent PNR.",
        "Q: How do you split multiple passengers?",
        "A: You can use SP2,4 or SP3,4,5-7 depending on the name elements.",
        "Q: How do you retrieve the associated split PNR later?",
        "A: You use RTAXR while the parent PNR is retrieved."
      ]
    };
  }

  const arnkIndex = sets.findIndex(s => s.id === 'set_arnk');
  if (arnkIndex !== -1) {
    sets[arnkIndex] = {
      id: "set_arnk",
      title: "Arrival Unknown (ARNK)",
      module: "PNR & Profiles",
      steps: [
        { prompt: "Retrieve the PNR.", expectedCommand: "RT ABC123" },
        { prompt: "Insert an Arrival Unknown (ARNK) segment to fill the surface gap.", expectedCommand: "SIARNK" },
        { prompt: "Display the PNR to verify the ARNK segment.", expectedCommand: "RT" },
        { prompt: "Receive from agent.", expectedCommand: "RF ANUJ" },
        { prompt: "End transaction.", expectedCommand: "ET" }
      ],
      overview: [
        "ARNK Workflow:\\nRT ↓ SIARNK ↓ RT ↓ RF ↓ ET",
        "SIARNK = Insert ARNK / surface segment. Used when surface transportation is unknown.",
        "SIARNK20NOV = ARNK with a specific date.",
        "SIARNK20NOV/P2 = ARNK for a specific passenger.",
        "ARNK is automatically placed at the first point where continuity is missing."
      ],
      questions: [
        "Q: When do you use ARNK?",
        "A: When there is a gap between two itinerary segments and the passenger's mode of transportation is unknown.",
        "Q: What is the difference between ARNK and SO?",
        "A: ARNK means surface transportation unknown. SO means Open flight segment where they will fly but don't know the flight/date yet."
      ]
    };
  }

  const newCode = 'const guidedSets = ' + JSON.stringify(sets, null, 2) + ';\n\nmodule.exports = guidedSets;\n';
  fs.writeFileSync('generateGuidedSets.cjs', newCode);
  console.log('Updated ARNK and Split PNR sets.');
} else {
  console.log('Could not match guidedSets array');
}
