const fs = require('fs');
let content = fs.readFileSync('generateGuidedSets.cjs', 'utf-8');

const replacements = [
  {
    target: `"A: To ensure only eligible taxes are being refunded. If a tax is non-refundable, you must delete it (e.g., TRFU/TX1)."`,
    replacement: `"A: To ensure only eligible taxes are being refunded. If a tax is non-refundable, you must delete it (e.g., TRFU/TX1).",
      "",
      "Interview Scenario - Voluntary Unflown Refund:",
      "Q: A customer has a completely unused ticket and wants a voluntary refund. What will you do?",
      "A: First I retrieve the PNR with RT and check the e-ticket with TWD. I verify the fare's voluntary-refund and penalty conditions. Then I initiate the automated refund using TRF by ticket number or FA line. I review the refund record and use TRFT to check refundable taxes. If required, I update the cancellation penalty, taxes, waiver or FOP with TRFU. After verifying that the refund total and FOP reconcile, I process the refund using TRFP and verify the transaction in TJQ."`
  },
  {
    target: `"A: You must determine and input the 'fare used' (TRFU/U). The refund is based on fare paid minus fare used."`,
    replacement: `"A: You must determine and input the 'fare used' (TRFU/U). The refund is based on fare paid minus fare used.",
      "",
      "Interview Scenario - Voluntary Partially Flown Refund:",
      "Q: A customer flew the first leg of their trip but wants a refund for the remaining unused segments. How do you process it?",
      "A: First I retrieve the PNR and display the e-ticket using TWD to identify used and unused coupons. I initiate the refund with TRF, then verify the fare used and refundable fare. For a partially used ticket, the used fare is critical because the refund is based on fare paid minus fare used, plus eligible taxes, less applicable penalty. I check taxes with TRFT, make any authorized TRFU updates, verify the FOP and process with TRFP."`
  },
  {
    target: `"A: Voluntary is passenger-initiated and governed by fare rules (penalties apply). Involuntary is airline-caused (e.g. cancellation), penalties are waived, and it usually requires an authorized waiver code."`,
    replacement: `"A: Voluntary is passenger-initiated and governed by fare rules (penalties apply). Involuntary is airline-caused (e.g. cancellation), penalties are waived, and it usually requires an authorized waiver code.",
      "",
      "Interview Scenario - Involuntary Unflown Refund:",
      "Q: The airline cancelled the passenger's completely unused flight. They request a refund. What is the process?",
      "A: I first verify the airline's disruption and refund authorization, retrieve the PNR and check the ticket with TWD. I confirm that the ticket is unused and check whether an authorized waiver or specific airline instruction applies. I initiate the refund with TRF, review the taxes and refund amount, apply the authorized waiver if required, verify the FOP and process using TRFP. I then verify the refund in TJQ.",
      "",
      "Interview Scenario - Involuntary Partially Flown Refund:",
      "Q: The passenger flew the outbound leg, but the airline cancelled the return flight. How do you process this involuntary refund?",
      "A: I retrieve the PNR and display the ticket with TWD to identify the used and unused coupons. I confirm the airline's involuntary-refund authorization and applicable waiver instructions. I initiate the refund with TRF, verify the used fare and refundable unused portion, review taxes with TRFT, make only the authorized TRFU updates, verify the FOP and process with TRFP. Because the ticket is partially used, I pay particular attention to the used fare and coupon status."`
  },
  {
    target: `"A: RT shows what the booking looks like NOW. RH shows what happened to the booking in the PAST."`,
    replacement: `"A: RT shows what the booking looks like NOW. RH shows what happened to the booking in the PAST.",
      "",
      "Interview Scenario - Schedule Change Investigation:",
      "Q: A customer says their flight was changed without their permission. How will you investigate?",
      "A: First I retrieve the PNR using RT. I check the current itinerary and then display the PNR history using RH or the air-segment history using RHA. I locate the affected segment and compare the original and changed entries using the history step numbers. I check the history action code to determine whether the segment was added, changed or cancelled, and I check the agent sign, office and date/time recorded in the history. If it appears to be an airline schedule change, I look for the relevant flight-time/status history, including TC where applicable. Finally, I check TWD if I need to determine whether the ticket coupon was affected."`
  },
  {
    target: `"A: It displays item 1 from the Recall List Display (RLD) once it has been processed."`,
    replacement: `"A: It displays item 1 from the Recall List Display (RLD) once it has been processed.",
      "",
      "Interview Scenario - Purged PNR Retrieval:",
      "Q: How do you retrieve a purged PNR?",
      "A: First I would confirm that the PNR is actually purged rather than simply unavailable in the current office. If I have the Amadeus record locator, I can submit a past-date recall using RPD/RLC-.... I then use RLD to check the recall request status. Once the request is processed, I use RLDT with the appropriate line number to display the retrieved PDR. If I need the historical record or TST, the applicable RPP/RH or RPP/TST entries can be used where supported.",
      "",
      "Interview Scenario - Old Ticket Check:",
      "Q: How do you check an old ticket?",
      "A: If I have the ticket number, I can display the e-ticket directly using TWD/TKT followed by the ticket number. If I have the live PNR, I can use TWD, or TWD/Lx when I know the FA/FHE line containing the ticket information."`
  },
  {
    target: `"A: First I retrieve the PNR and identify the FA/FH line containing the ticket. I display the e-ticket with TWD/Lnn and verify the coupon/document status. I then check the airline's e-ticket capability using HE ETT XX and the appropriate market reference to confirm that VOID = Y. If the ticket has not been confirmed by BSP/ARC and voiding is permitted, I use TRDC/Lnn, for example TRDC/L5. I then verify the result with TWD/L5 and check the PNR/report as required."`,
    replacement: `"A: First I retrieve the PNR and identify the FA/FH line containing the ticket. I display the e-ticket with TWD/Lnn and verify the coupon/document status. I then check the airline's e-ticket capability using HE ETT XX and the appropriate market reference to confirm that VOID = Y. If the ticket has not been confirmed by BSP/ARC and voiding is permitted, I use TRDC/Lnn, for example TRDC/L5. I then verify the result with TWD/L5 and check the PNR/report as required.",
      "",
      "Interview Scenario - Accidental Issue:",
      "Q: You just issued a ticket and realized the name was spelled wrong. It's the same day. What do you do?",
      "A: Assuming the BSP/ARC hasn't run the end-of-day sales report, I will immediately void the ticket using TRDC. I check coupon status first using TWD, then void the document, verify the void status, correct the name in the PNR, and reissue a fresh ticket."`
  },
  {
    target: `"A: For an involuntary change, first I retrieve the PNR and verify the original e-ticket with TWD. If ATC Involuntary is supported, I make sure the PNR has the airline-authorized new itinerary and use FXI. FXI automatically prepares the involuntary exchange TST with the original fare, taxes, FO, FOP and appropriate endorsement. I check the TST with TQT/TQR, issue with TTP and verify with TWD."`,
    replacement: `"A: For an involuntary change, first I retrieve the PNR and verify the original e-ticket with TWD. If ATC Involuntary is supported, I make sure the PNR has the airline-authorized new itinerary and use FXI. FXI automatically prepares the involuntary exchange TST with the original fare, taxes, FO, FOP and appropriate endorsement. I check the TST with TQT/TQR, issue with TTP and verify with TWD.",
      "",
      "Interview Scenario - Airline Disruption:",
      "Q: The airline delayed a flight by 10 hours and auto-rebooked the passenger. They need a new ticket. Should you use FXQ or FXI?",
      "A: Since this is an involuntary change caused by the airline, I must use FXI (ATC Involuntary). FXQ is for voluntary changes and would incorrectly attempt to charge the passenger penalties and fare differences."`
  },
  {
    target: `"A: If FXI cannot be used, I process the exchange manually: rebook the authorized itinerary, update the TST with TTU, put the TST into exchange mode with TTK/EXCH, create the FO from the original ticket, verify the fare/taxes/FOP/endorsement, remove the TST change flag with TTF, end the PNR and issue using the appropriate involuntary exchange entry such as TTP/EXCH/INV/RT, then verify the new ticket with TWD."`,
    replacement: `"A: If FXI cannot be used, I process the exchange manually: rebook the authorized itinerary, update the TST with TTU, put the TST into exchange mode with TTK/EXCH, create the FO from the original ticket, verify the fare/taxes/FOP/endorsement, remove the TST change flag with TTF, end the PNR and issue using the appropriate involuntary exchange entry such as TTP/EXCH/INV/RT, then verify the new ticket with TWD.",
      "",
      "Interview Scenario - Missing ATC Support:",
      "Q: You need to process an involuntary exchange, but the airline does not support ATC FXI. How do you ensure the passenger isn't charged a penalty?",
      "A: I have to do a manual involuntary reissue. The most critical step is issuing the ticket with the /INV modifier (e.g., TTP/EXCH/INV/RT). This modifier tells the system to process it as an involuntary exchange, bypassing voluntary penalties."`
  },
  {
    target: `"A: FQD is just a fare display (looks at published fares). FXB evaluates the actual PNR itinerary, availability, and fare conditions to find the lowest usable fare."`,
    replacement: `"A: FQD is just a fare display (looks at published fares). FXB evaluates the actual PNR itinerary, availability, and fare conditions to find the lowest usable fare.",
      "",
      "Interview Scenario - Quoting a Fare:",
      "Q: A customer calls and asks 'How much would my current booking cost?' Which command do you use and why?",
      "A: I would use FXX. FXX prices the itinerary in the booked class without creating a TST. I wouldn't use FXP yet because the customer hasn't confirmed they want to save the fare, and I wouldn't use FXB because they asked for the cost of their *current* booking, not the cheapest alternative."`
  },
  {
    target: `"A: No, FXL finds the lowest possible fare regardless of current seat availability. It is informative only."`,
    replacement: `"A: No, FXL finds the lowest possible fare regardless of current seat availability. It is informative only.",
      "",
      "Interview Scenario - Finding Alternatives:",
      "Q: The customer says their current fare is too expensive and asks 'What is the absolute cheapest option you have, even if I have to change flights?'",
      "A: I would use FXA. FXA displays a list of lower available fares and alternative itineraries. If they like option 3, I can select it and create a TST simultaneously using FXU3."`
  },
  {
    target: `"A: QN removes the current PNR from the queue and moves to the next one. QI ignores the PNR (leaves it on the queue) and exits the queue."`,
    replacement: `"A: QN removes the current PNR from the queue and moves to the next one. QI ignores the PNR (leaves it on the queue) and exits the queue.",
      "",
      "Interview Scenario - Daily Queue Routine:",
      "Q: Your manager asks you to clear the ticketing time limit queue (Queue 7). Walk me through your process.",
      "A: I start by entering QS7 to open the queue. For each PNR presented, I check the time limit. If it needs to be ticketed, I issue the ticket, then use QN to remove it and move to the next. If I need to skip a PNR without removing it, I use IG. When I am completely done, I use QI to exit the queue system entirely."`
  }
];

let replacedCount = 0;
for (const req of replacements) {
  if (content.includes(req.target)) {
    content = content.replace(req.target, req.replacement);
    replacedCount++;
  } else {
    console.warn('Target not found:', req.target.substring(0, 50) + '...');
  }
}

fs.writeFileSync('generateGuidedSets.cjs', content);
console.log(`Replaced ${replacedCount} out of ${replacements.length} targets.`);
