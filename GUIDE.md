# ShasthoPath — System Guide

## Purpose

ShasthoPath demonstrates a simple patient journey through a hospital.

## Core Flow

Patient → Intake → Routing → Token → Navigation → Queue → Doctor → Follow-up

## How To Run

Open `index.html` in a normal (non-private) Chrome/Edge/Firefox window. No server, install or build. Data is stored in the browser's IndexedDB (database `shasthopath`).

## Main Screens (all implemented)

1. **Kiosk** — home with large tiles: *I need treatment*, *scheduled visit/injection*, *Where is what?*, *My token*, red *Emergency*.
2. **Patient Intake** — problem (voice / touch / typing) → one-tap questions → patient info → optional health info.
3. **Service Routing** — "You can go here: <service>", with the note that this is not a diagnosis; patient can pick another service.
4. **Token** — printable ticket + live status (people ahead, estimate, "it is your turn").
5. **Navigation** — building / floor / room, text steps, schematic map; plus the "Where is what?" directory.
6. **Queue** — *Queue display* tab (NOW SERVING / NEXT / WAITING).
7. **Doctor Console** — *Doctor / staff* tab.
8. **Follow-up** — patient looks up by mobile number; doctor schedules the next visit.
9. **Demo/Admin** — script, seed queue, reset, read-only config.

## Code Map

`window.SP` namespace, classic scripts in this order: `data.js` (config) → `db.js` (IndexedDB) → `logic.js` (rules) → `ui.js` (kiosk) → `staff.js` (staff views, render, boot). UI uses `data-act` (click handlers in `SP.ui.acts`) and `data-bind` (writes into state). All user text is HTML-escaped.

## Configuration (not hard-coded medicine)

Routing keywords, emergency red flags, questions, departments, locations and doctors are data in `assets/js/data.js`, copied into IndexedDB on first run. After editing `data.js`, press Admin ▸ **Reset demo data**. Hospital administrators/clinicians own these rules.

## Queues and Tokens

- Queue id = department code (`MED`) or follow-up queue (`MED-FU`); token = `QUEUE-NNN` (e.g. `ORT-001`, `AR-FU-001`, `EMR-001`). The counter resets daily and is incremented atomically.
- Order: priority (emergency 2 > priority 1 > normal 0), then time. Skipped tokens can be returned to the end of the queue. Transfer issues a new token in the target queue.

## Development Principle

The prototype should always answer:

- What is the patient's problem?
- Where should the patient go?
- What should the patient do next?
- When is the patient's turn?

## Safety Principle

The system assists with navigation and information collection.

It does not diagnose or prescribe. It never hard-codes a medical or vaccination schedule: follow-up dates and instructions are entered by a clinician.

## Unknown Data

Never invent missing information. Blank input is stored as `null` and shown as:

Unknown (age, weight) · Not measured (BP, temperature) · Not available (glucose, reports) · Not reported by patient (conditions, medicines, allergies) · Patient does not know (answered "জানি না")

Invalid or out-of-range numbers are rejected, not corrected.

## Demo

Use Demo Mode (Admin tab): *Seed demo queue* fills the display; *Reset demo data* restores fictional patients (demo numbers `01700000001` — follow-up due today, `01700000002` — follow-up in 3 days). Do not enter real patient data.

## Testing

`docs/verification/` has dev-only headless tests (jsdom + fake IndexedDB). They do not replace a real-browser check.

## Future

The prototype may later integrate with real hospital systems, but MVP must remain standalone and simple.
