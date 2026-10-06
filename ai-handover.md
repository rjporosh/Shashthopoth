# AI Handover

## Purpose

This file is the mandatory handover document for any AI agent working on ShasthoPath.

When the current AI agent is approaching its context/token limit, it MUST STOP implementation immediately and update this file before returning the project.

Do NOT continue implementation after the handover threshold.

---

# Current State

## Project Phase

**MVP prototype implemented (Phases 0–6 of ROADMAP.md, in prototype form). Verified headlessly (jsdom + fake IndexedDB) only. A real-browser QA pass has NOT been done yet.**

This session ended because the MVP scope was finished, not because the token budget ran out. Nothing is half-implemented.

## Completed Features

- Phase 0: repo structure, IndexedDB foundation, seeded fictional demo data, design language.
- Phase 1: Bengali-first kiosk home, Bengali/English toggle, problem/service selection, simple question flow, routing to a service, token, ticket, location guidance.
- Phase 2: voice input (browser Web Speech API) with a touch/typing fallback that always works, name/age/sex/phone, weight, BP, temperature, glucose, existing conditions/medicines/allergies as reported, previous consultation, reports, explicit Unknown / Not measured / Not available / Not reported values, doctor intake summary.
- Phase 3: department queues, token display, call next, recall, skip, requeue, complete, cancel, transfer, priority, emergency priority queue.
- Phase 4: existing-patient lookup by phone, scheduled follow-up (date, visit number, service, clinician note), follow-up token in a dedicated `CODE-FU` queue, no re-registration, doctor-side scheduling form, patient sees the next date.
- Phase 5: services directory (clinics, lab, radiology, pharmacy, billing, reports, toilet, food, info desk, emergency), per-location building/floor/room, text directions, simple schematic SVG map with floor indicator.
- Phase 6: fullscreen button, large controls, demo mode (demo-number chips, "Fill demo data", "Seed demo queue", "Reset demo data"), printable 80 mm-style ticket (`@media print`), queue display, doctor display, 12-step demo script in the Admin tab, error handling.
- Emergency escalation: configurable red-flag list; any hit shows EMERGENCY + "Please proceed immediately to Emergency." (Bengali + English) with directions and an optional emergency token.
- Live updates: BroadcastChannel + 2.5 s polling; an open doctor follow-up form is never overwritten.

## Current Feature

None in progress. All code that exists is complete and working as far as headless testing can show.

## Features Not Started

- Real-browser QA (layout, fonts, print, speech) — **next task**.
- Phase 7 (production architecture study), Phase 8 (pilot proposal), Phase 9 (production): out of MVP scope by design.
- Per-doctor queues (queues are per department/service).
- Admin editing of config (config is read-only in the Admin tab; edit `assets/js/data.js` and reset).
- Real floor plans (map is schematic).
- Reminder notifications (only a "reminder concept": the next date is shown on the ticket and status screen).

---

# What Problem Does the Current Version Solve?

A first-time, possibly low-literacy patient who only knows "my hand hurts" can get from the entrance to the right room without knowing a department name: say or touch the problem → answer a few one-tap questions → be told which service to go to → get a token and printed ticket with building/floor/room → follow a map + text directions → see how many people are ahead and when they are called → the doctor sees a short patient-reported intake summary → a follow-up visit gets its own queue without re-registration.

It is navigation and information collection only. It does not diagnose, prescribe, or hard-code any medical schedule.

---

# What Has Been Completed?

Files (all new this session unless stated):

- `index.html` (was empty) — shell: top bar (mode tabs, language, fullscreen), view area, demo-notice footer.
- `assets/css/style.css` — kiosk styling, print stylesheet.
- `assets/js/data.js` — seed config: locations, departments, doctors, routing services, red flags, questions, buildings. All fictional.
- `assets/js/db.js` — IndexedDB wrapper + atomic multi-store transaction helper.
- `assets/js/logic.js` — seeding, routing/red-flag matching, patients, tokens, queue operations, follow-up rules, demo seeding.
- `assets/js/ui.js` — i18n strings, helpers, kiosk screens and actions.
- `assets/js/staff.js` — queue display, doctor console, admin/demo, render loop, event delegation, live sync, boot.
- `docs/verification/` — dev-only headless test scripts + README (see "How it was verified").

Stack: HTML + CSS + vanilla JS + IndexedDB. Classic `<script>` tags (no ES modules) so `index.html` also works from `file://`. No framework, no build step, no dependencies.

IndexedDB stores: `patients, departments, services, doctors, locations, tokens, queues, followups, settings`. `services` holds routing rules (and red flags as `kind:'redflag'`). `queues` holds the per-queue daily sequence counter.

---

# Bugs Fixed

This was a from-scratch build; these are the defects found and fixed *during* the session (none were in the user's pre-existing code, which contained no code).

### Bug 1 — `render` was not defined where the kiosk code called it

### Root Cause

The UI was split into `ui.js` (kiosk) and `staff.js` (render loop). Two voice-result callbacks in `ui.js` called a bare `render()` that only exists inside `staff.js`'s closure, so they would have thrown `ReferenceError` the moment a voice result arrived.

### Fix

`ui.js` now defines `const render = () => SP.ui.render();`, and `staff.js` assigns `ui.render = render`.

### Why This Fix Was Chosen

Smallest change that keeps the two-file split and avoids a global. Found by reading the code before the first run (not by a test); the voice path cannot be exercised in jsdom, so only the "voice unsupported" branch is test-covered.

### Trade-offs

A one-line indirection; the voice-success branch (`handleText` → `render`) is still untested in a real browser.

### Why This Is Currently the Best Practical Fix

Alternatives (merging files, exposing a global `render`) were larger or messier.

---

### Bug 2 — non-numbered locations read "Room Pharmacy 1" / "Room Lab 1-3"

### Root Cause

`locLine()` always prefixed the word "Room" to the `room` field, but several locations store a counter label (e.g. `Pharmacy 1`, `Lab 1-3`, `Hall`) rather than a room number.

### Fix

`locLine()` adds "Room" only when the value starts with a digit; otherwise it prints the label as-is.

### Why This Fix Was Chosen

It is a one-line display rule and keeps the data model (`room` is a free string) unchanged.

### Trade-offs

Relies on the convention "numbered rooms start with a digit". A room named e.g. "A12" would show without the word "Room".

### Why This Is Currently the Best Practical Fix

Splitting `room`/`counter` into two fields (as the spec's ticket lists "Room/counter" together) would be a data-model change for no demo benefit.

---

### Incident (process, not a product bug) — project README overwritten, then restored

While adding `docs/verification/README.md`, a failed `cp` (the tool shell has no brace expansion) followed by `;` made the `cat >` run in the repo root and overwrite the root `README.md`. It was detected immediately and restored byte-for-byte with `git checkout -- README.md`; the README was then intentionally updated with a status section. Lesson for agents: use absolute paths and `set -e` in shell steps; do not chain with `;`.

---

# Known Bugs

- None known in headless testing. Not verified in a real browser — so visual/print/speech defects may exist.

---

# Known Limitations

- **Not tested in a real browser.** No browser was available. Layout, fonts, colour contrast, touch-target feel, the 80 mm print layout, and Bengali font rendering are unchecked. jsdom checks logic and DOM only.
- **Voice** uses the browser Web Speech API (`bn-BD` / `en-US`). Support and offline behaviour vary (Chrome usually needs internet for recognition). Only the "unsupported/failed → touch fallback" path is test-covered. Spoken prompts (🔊, "your turn" announcement) use `speechSynthesis`; a Bengali voice may not exist on the device.
- **Cross-tab sync** uses `BroadcastChannel` + 2.5 s polling. Polling/live refresh is tested in one window; true multi-tab/multi-window behaviour is not.
- **Identity check for follow-up** = phone-number match + patient confirms the displayed name. Demo-grade, not secure (by design for the MVP; no auth).
- **Estimated wait** = people ahead × a per-service average minutes in config. Labelled "estimate only".
- Routing is keyword/tile based and deliberately simple; ambiguous free text may route to the wrong service (patient can choose another service on the route screen) and unmatched text asks the patient to touch a tile. The `unsure` tile sends the patient to the Information desk (no token).
- Queues are per department/service, not per individual doctor. Token sequence resets each calendar day.
- The `appointments` and "demo data" stores named in the spec were intentionally not created: scheduled visits live in `followups`; demo data is seeded from `data.js`.
- Sex/age/phone entry uses the device keyboard (no custom on-screen keypad). Bengali digits are accepted and normalised.
- Emergency token records no patient details (name "Unknown (emergency)").
- No idle-timeout/auto-reset to home on the kiosk.
- Seeded follow-up dates are relative to "today" at the time of (re)seeding. Reset demo data right before filming.
- Opening via `file://` should work in Chrome/Edge/Firefox; if IndexedDB is blocked (some private modes) the app shows an error message.

---

# Files Changed

- `index.html` (from empty), `assets/css/style.css`, `assets/js/data.js`, `assets/js/db.js`, `assets/js/logic.js`, `assets/js/ui.js`, `assets/js/staff.js` — new.
- `docs/verification/{README.md,logic.test.js,e2e.test.js,live.test.js}` — new, dev-only.
- Docs updated: `ai-handover.md`, `release-notes.md`, `ROADMAP.md`, `README.md`, `GUIDE.md`, `PATIENT-GUIDE.md`, `DOC-GUIDE.md`.
- `MASTER-SPECIFICATION.md`, `MASTER-PROMPT.md`, `LICENSE`, `.git`, `.kilo`: untouched. Nothing was committed to git.

---

# Features Intentionally NOT Touched

Do not implement these unless explicitly instructed:

- Any backend, authentication, cloud, payment gateway, real HMS/EMR integration, AI diagnosis (spec §22).
- Phase 7–9 work (production architecture, pilot proposal, production).
- A universal vaccination/injection schedule — **never hard-code one**. Schedules exist only as clinician-entered follow-up records; the seeded demo items are fictional.
- Any frameworks/build tools. Admin UI for editing routing rules. Per-doctor queues. Real floor-plan drawings. SMS/notification sending.
- The structure of `MASTER-SPECIFICATION.md` / `MASTER-PROMPT.md` (source of truth).

---

# Architecture Decisions

- **Classic scripts, one global namespace `window.SP`** (`data → db → logic → ui → staff`): works from `file://` (ES modules would be blocked by CORS), zero tooling.
- **Config in code, copied into IndexedDB on first run** (`seedConfig`): satisfies "routing rules must be configurable" while staying simple; rules are data, not logic. Changing `data.js` requires "Reset demo data" to take effect.
- **Atomic token issue**: counter + token written in one IndexedDB transaction (`db.tx`), so concurrent kiosks cannot create duplicate codes (tested with 3 concurrent requests). Only IndexedDB calls are awaited inside a transaction (otherwise it auto-commits).
- **Follow-ups are a separate dedicated queue** (`CODE-FU-NNN`), created at check-in from a clinician-scheduled record; check-in is blocked before the scheduled date and is idempotent.
- **Transfer creates a new token** in the target queue and marks the old one `transferred` (chain followed by `resolve()`), so the patient's screen follows them.
- **Unknown is stored as `null` and displayed as an explicit label per field** (Unknown / Not measured / Not available / Not reported by patient / Patient does not know). Out-of-range or non-numeric input is rejected, never coerced.
- **Rendering**: whole-view `innerHTML` re-render + event delegation (`data-act`, `data-bind`). All dynamic text is HTML-escaped. Live refresh is signature-based and skipped while the doctor's follow-up form is open.
- **Emergency**: red-flag keywords in free text or the red-flag tiles both escalate; wording follows the spec exactly and makes no diagnostic claim.

---

# Current Demo Flow

Reset demo data (Admin) → Kiosk: **I need treatment** → say/touch "hand pain" (or type `আমার হাতে ব্যথা`) → "none of these" → duration → injury → previous doctor → reports → **Orthopedics** → **Fill demo data** → Next → (skip/enter vitals) → **ORT-001** ticket (Print) → **Show me the way** (map + steps) → **Queue display** tab → **Doctor** tab: *Call next* → intake summary (unknowns shown honestly) → back on kiosk the status turns green "It is your turn" → Doctor: *Schedule follow-up* → *Complete* → Kiosk **scheduled visit** → `01700000001` → confirm identity → **AR-FU-001**. Emergency: type `বুকে ব্যথা` → EMERGENCY screen. The Admin tab contains the same 12-step script, a "Seed demo queue" button, and read-only config tables.

---

# Next Recommended Task

**Real-browser QA pass, fixing only what is actually broken, then record the demo.**

Open `index.html` in desktop Chrome and on an Android phone/tablet and check, in this order: (1) Bengali text renders and nothing overflows at 1280×800, 1024×768 and 390×800; (2) the demo flow above end-to-end; (3) Print preview of the ticket shows only the ticket at ~80 mm; (4) Chrome voice button (`bn-BD`) and the 🔊 buttons; (5) two windows (kiosk + queue display/doctor) update each other. Record each defect as Bug / Root cause / Fix in this file.

---

# Exact Continuation Command

> Continue ShasthoPath from the current repository state. First read README.md, MASTER-SPECIFICATION.md, ROADMAP.md, GUIDE.md, PATIENT-GUIDE.md, DOC-GUIDE.md, release-notes.md and ai-handover.md. Do not redo completed work. Continue only from the "Next Recommended Task" section of ai-handover.md. Preserve all existing architecture and UX decisions unless a documented bug requires a change. Before making changes, verify the current implementation against the specification.

Then add the exact task:

> Run the real-browser QA pass described under "Next Recommended Task" in ai-handover.md. Re-run `docs/verification/*.test.js` first (see docs/verification/README.md) to confirm the baseline (all three print ALL PASS). Open `index.html` directly (no server needed). Fix only defects you can reproduce, smallest change each, add a Bug/Root cause/Fix entry per fix here, update release-notes.md, and do not add features. Do not touch the items under "Features Intentionally NOT Touched".

---

# Handover Rule

If context/token budget becomes insufficient:

1. Stop coding.
2. Update ai-handover.md.
3. Update release-notes.md.
4. Update ROADMAP.md.
5. Update GUIDE.md.
6. Update PATIENT-GUIDE.md.
7. Update DOC-GUIDE.md.
8. Update README.md if the current product state changed.
9. Verify files were saved.
10. Return the ZIP immediately if requested.
11. Do not begin another feature.
12. Do not leave unfinished half-implemented code knowingly.

---

# Final Verification Before Handover

Confirmed this session (headless): 

- Project loads from `index.html` with no JS errors — **yes (jsdom)**.
- Current feature works — **yes**: `logic.test.js`, `e2e.test.js`, `live.test.js` all print ALL PASS.
- No known accidental regressions — **none observed**; README accident was reverted.
- Documentation updated — **yes** (7 docs).
- Next task explicit — **yes**.
- Exact continuation command written — **yes**.

NOT confirmed: real-browser rendering, print output, speech, multi-tab sync. These are the first thing the next agent must check.
