# Amadeus GDS Training Platform

A realistic, interactive web-based training simulator for learning Amadeus GDS cryptic commands, designed specifically based on the provided Amadeus course transcripts.

## Features

- **Terminal Simulator:** An authentic cryptic environment that reacts to commands (e.g., `AN`, `SS`, `NM`, `RT`, `FX`).
- **Practice Sets (Modules 1-8):** Follow exactly the transcripts from the course with over 90 practice scenarios.
- **Flashcards:** Spaced-repetition inspired flashcards containing every command and concept from the transcript.
- **Command Reference:** A searchable directory of the extracted Amadeus commands and formats.
- **Progress Tracking:** Tracks completed exercises and flashcard mastery securely in the browser.

## Running the Application

### Prerequisites
- Node.js (v16 or higher)

### Setup
1. Open a terminal in this directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

## Editing Content (Structured JSON)

The training content is entirely data-driven and lives in the `src/data/` folder. You can easily modify or expand the content by editing these JSON files:

- **`src/data/exercises.json`**: Add new practice drills. Make sure to define the `expectedCommand` the terminal should look for.
- **`src/data/flashcards.json`**: Update or add flashcards.
- **`src/data/commands.json`**: The dictionary of supported commands for the Reference tab and the Terminal's fallback processor.
- **`src/data/scenarios.json`**: Larger contextual scenarios (currently accessible via structured arrays for future expansion).

## Coverage Report

This platform maps the provided Amadeus YouTube transcript (Sessions 1-28) to the extracted data exactly as requested:

- **Module 1: Encode/Decode:** 7 exercises (City, Airline, Country encode/decode)
- **Module 2: Time/Currency:** 8 exercises (Time calculation, currency conversion `DD`, `DF`, `FCC`)
- **Module 3 & 4: PNR Creation:** 13 exercises (`AN`, `SS`, `NM`, `AP`, `TKOK`, `RF`)
- **Module 5 & 8: Pricing / Master Pricer:** 12 exercises (`FX`, `FXP`, `FXR`, `FXB`, `FXD`, `FXZ3`)
- **Module 6: Ticketing:** 5 exercises (`RTF`, `FP`, `TTP`)
- **Module 13 & 23: Retrieval & History:** 5 exercises (`RT`, `RH`, `RHS`)
- **Modules 15-28: Advanced Scenarios:** Manual Exchange (`TWD`, `TQT`), Name Correction, Refund, Void (`TRDC`), Split PNR (`SP`, `EF`), and Involuntary Exchange (`FXI`).

**Total Extracted Assets:**
- **104** Commands in the Reference directory
- **96** Discrete Practice Exercises broken out from the transcripts
- **94** Flashcards capturing concepts and formats
- **12** Core Scenarios structured for training workflows

All content is parsed directly from `amedus.docx` to adhere strictly to the rule: *Do not invent Amadeus commands, formats, or workflows.*
