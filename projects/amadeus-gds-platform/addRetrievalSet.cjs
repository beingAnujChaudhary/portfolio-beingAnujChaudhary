const fs = require('fs');
let content = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

const endOfArrayTarget = `  }
];`;

const newSet = `  },
  // PNR Retrieval: Advanced Search
  {
    id: "set_pnr_retrieval_advanced",
    title: "PNR Retrieval: Advanced Search",
    module: "PNR & Profiles",
    steps: [
      { prompt: "Retrieve a PNR using record locator ABC123.", expectedCommand: "RT ABC123" },
      { prompt: "Search for PNRs containing the passenger surname SMITH.", expectedCommand: "RT/SMITH" },
      { prompt: "Search for PNRs for SMITH with the first initial J.", expectedCommand: "RT/SMITH/J" },
      { prompt: "Select the second PNR from a similar-name list.", expectedCommand: "RT2" },
      { prompt: "Return to the previous similar-name list.", expectedCommand: "RT0" },
      { prompt: "Retrieve a PNR for SMITH travelling on 12 August.", expectedCommand: "RT/12AUG-SMITH" },
      { prompt: "Retrieve a PNR for SMITH on flight KL153 on 12 August.", expectedCommand: "RT KL153/12AUG-SMITH" },
      { prompt: "Retrieve using record locator Q6RBB3 and surname JOHNSON.", expectedCommand: "RT-Q6RBB3-JOHNSON" },
      { prompt: "Retrieve using ticket number 016-1234567890.", expectedCommand: "RT TKT/016-1234567890" },
      { prompt: "Claim a PNR from another system using record locator CO123ABC.", expectedCommand: "RO CO123ABC" }
    ],
    overview: [
      "Amadeus supports retrieval by record locator, passenger name, partial name, date/name, flight/date/name, ticket number, and more.",
      "RT = Retrieve an active PNR in your system.",
      "RO = Claim a PNR from another system.",
      "RPD = Recall a purged/past-date PNR.",
      "If you only have a ticket number, you can also use TWD/TKT... followed by RT*E to retrieve the locator."
    ],
    questions: [
      "Q: What is the difference between RT and RO?",
      "A: RT retrieves a PNR. RO claims a PNR from another GDS or airline system.",
      "",
      "Interview Scenario - PNR Retrieval Methods:",
      "Q: How can you retrieve a PNR in Amadeus?",
      "A: The primary command is RT. I can retrieve a PNR by record locator using RT ABC123, by passenger name using RT/SMITH, by partial name using RT/SMIT, by date and name using RT/12AUG-SMITH, by flight/date/name using RT KL153/12AUG-SMITH, and from an availability line using RT/4-SMITH/A MR. I can also retrieve using a ticket number, office information, frequent flyer number, or other stored identifiers. If multiple PNRs are returned, I use RT1, RT2, etc. to select one and RT0 to return to the list. For a purged PNR I use RPD, while RO is used when I need to claim a PNR from another system."
    ]
  }
];`;

content = content.replace(endOfArrayTarget, newSet);
fs.writeFileSync('generateGuidedSets.cjs', content);
console.log('Advanced PNR Retrieval set added.');
