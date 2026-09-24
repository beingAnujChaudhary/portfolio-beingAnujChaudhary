const fs = require('fs');
let content = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

// Add TRDX to the refund overview
const targetTRFOverview = `"TRFIG ignores the refund before processing, and TRDC cancels it after processing if permitted."`;
const replacementTRFOverview = `"TRFIG ignores the refund before processing, TRDX cancels an un-processed refund, and TRDC cancels it after processing if permitted."`;
content = content.replace(targetTRFOverview, replacementTRFOverview);

const targetTRFQuestions = `"Q: Why must you check TRFT before processing?",`;
const replacementTRFQuestions = `"Q: What is the difference between TRFIG, TRDX, and TRDC in the refund process?",
      "A: TRFIG ignores/cancels the refund workflow before the record is saved. TRDX cancels an updated but un-processed refund record. TRDC voids/cancels the refund document after it has been fully processed (TRFP) if permitted.",
      "",
      "Q: Why must you check TRFT before processing?",`;
content = content.replace(targetTRFQuestions, replacementTRFQuestions);

// Find the end of the array to inject new sets
const endOfArrayTarget = `  }
];`;

const newSets = `  },
  // Fare Rules: Basics
  {
    id: "set_fare_rules_basics",
    title: "Fare Rules: Basics (FQD, FQN, FQR, FQS)",
    module: "Pricing & Ticketing",
    steps: [
      { prompt: "Display fares from DEL to LHR for 25 September.", expectedCommand: "FQDDELLHR/D25SEP" },
      { prompt: "Display the fare notes/rules for fare line 2.", expectedCommand: "FQN2" },
      { prompt: "Check the permitted routing for fare line 2.", expectedCommand: "FQR2" },
      { prompt: "Check the required booking class/code for fare line 2.", expectedCommand: "FQS2" }
    ],
    overview: [
      "Fare rules must be checked before confirming changes or refunds.",
      "The normal workflow is FQD (Find Fare) → FQN (Find Notes) → FQR (Find Route) → FQS (Find Class)."
    ],
    questions: [
      "Q: What is the difference between FQN, FQR, and FQS?",
      "A: FQN displays the textual rules (Notes). FQR displays permitted geographical Routings. FQS displays the required Selling/booking classes.",
      "",
      "Interview Scenario - Checking a Fare:",
      "Q: A customer wants to know if a specific fare on line 2 allows stopovers. How do you check?",
      "A: I would first use FQN2 to open the fare notes index for that fare, and then look for the Stopovers category (usually ST) to read the specific conditions."
    ]
  },
  // Fare Rules: Categories
  {
    id: "set_fare_rules_categories",
    title: "Fare Rules: Categories (PE, VC, VR)",
    module: "Pricing & Ticketing",
    steps: [
      { prompt: "Display the fare notes for fare line 1.", expectedCommand: "FQN1" },
      { prompt: "Check the Penalties category for fare line 1.", expectedCommand: "FQN1*PE" },
      { prompt: "Check the Voluntary Changes category for fare line 1.", expectedCommand: "FQN1*VC" },
      { prompt: "Check the Voluntary Refunds category for fare line 1.", expectedCommand: "FQN1*VR" },
      { prompt: "Check the Advance Purchase category for fare line 1.", expectedCommand: "FQN1*AP" }
    ],
    overview: [
      "FQN does not always show everything on one screen. It shows an index.",
      "You must drill down into categories. The most important are PE (Penalties), VC (Voluntary Change), VR (Voluntary Refund), and AP (Advance Purchase).",
      "Do not rely solely on PE; for reissues, VC is critical. For refunds, VR is critical."
    ],
    questions: [
      "Q: If a customer asks 'Can I change my ticket?', what categories must you check?",
      "A: You must check VC (Voluntary Changes) to see if changes are permitted and under what conditions, and PE (Penalties) to see the cost.",
      "",
      "Interview Scenario - Customer Query:",
      "Q: Customer wants to know whether their ticket is refundable and changeable. What will you do?",
      "A: First I identify the applicable fare and fare basis. If I don't already have the fare display, I use FQD for the city pair and date. I then use FQN followed by the fare-line number to display the fare notes. I check the penalties section PE, voluntary changes VC, and voluntary refunds VR. If necessary I also check advance purchase, minimum/maximum stay and routing using the applicable fare-rule categories and FQR. If the PNR is already priced, I can use FWR to view the Mini Rules. I would not quote a change or refund penalty until I verify the actual fare conditions."
    ]
  },
  // Fare Rules: Mini Rules
  {
    id: "set_fare_rules_mini",
    title: "Fare Rules: Mini Rules (FWR)",
    module: "Pricing & Ticketing",
    steps: [
      { prompt: "Price the itinerary in the booked class.", expectedCommand: "FXP" },
      { prompt: "Display the Mini Rules for the current pricing.", expectedCommand: "FWR" },
      { prompt: "Display the Mini Rules specifically for TST 1.", expectedCommand: "FWR/T1" },
      { prompt: "Display the Mini Rules from FA/FHE line 8.", expectedCommand: "FWR/L8" },
      { prompt: "View fare-family details for fare family 1.", expectedCommand: "FQF1" }
    ],
    overview: [
      "Mini Rules (FWR) provide a concise, easy-to-read summary of fare conditions after pricing.",
      "They are a faster alternative to FQN, showing Revalidation, Reissue, Refund allowances, and Penalties.",
      "You can access them generally (FWR), by TST (FWR/T1), or by ticket/FA line (FWR/L8)."
    ],
    questions: [
      "Q: What is the difference between FQN and FWR?",
      "A: FQN provides the full, official, detailed fare rules usually from a fare display (FQD). FWR provides a quick, concise summary of conditions (Mini Rules) usually after the PNR has been priced.",
      "",
      "Interview Scenario - Quick Quote:",
      "Q: You just priced a PNR with FXP and the customer immediately asks 'Is this non-refundable?' What is the fastest way to check?",
      "A: I would use FWR to display the Mini Rules for the pricing I just created. It will provide a quick 'Yes/No' summary for refunds and changes without having to manually read the full FQN rule categories."
    ]
  }
];`;

content = content.replace(endOfArrayTarget, newSets);
fs.writeFileSync('generateGuidedSets.cjs', content);
console.log('Fare rules sets and TRDX added successfully.');
