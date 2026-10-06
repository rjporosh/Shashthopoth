# Release Notes

## Unreleased — MVP prototype (first implementation)

### Added

- Patient kiosk, Bengali-first with English toggle: home, problem (voice or touch or typing), simple one-tap questions, service guidance, patient info, optional health info, token + printable ticket, directions (schematic map + text), services directory, scheduled-visit/follow-up flow, emergency screen.
- Configurable seed data (routing keywords, emergency red flags, questions, departments, locations, doctors) — all fictional.
- Queue engine: per-service queues, unique tokens (atomic in IndexedDB), call next, recall, skip, requeue, complete, cancel, transfer, priority, emergency priority, dedicated `CODE-FU` follow-up queues.
- Queue display (NOW SERVING / NEXT / WAITING) and doctor/staff console with intake summary (patient-reported, never a diagnosis) and a follow-up scheduling form.
- Patient live status (position, estimate, "it is your turn", skipped/done/cancelled, transfer notice, next follow-up date).
- Demo & admin tab: 12-step script, seed demo queue, reset demo data, config tables, stored-data counts.
- IndexedDB persistence (patients, departments, services, doctors, locations, tokens, queues, followups, settings); language and active token survive reload.
- Dev-only headless verification scripts in `docs/verification/`.

### Changed

- `index.html` (was empty) now hosts the app; README/ROADMAP/GUIDE/PATIENT-GUIDE/DOC-GUIDE/ai-handover updated to the real state.

### Fixed

- `render()` reference error in voice callbacks (split-file scoping) — fixed via `SP.ui.render` indirection.
- Counter locations displayed as "Room Pharmacy 1" — "Room" now only prefixes numeric rooms.
- Process incident: root README accidentally overwritten and immediately restored from git.

### Verification of fixes

- `render` fix: found by code reading before first run; only the voice-*unsupported* branch is covered by `e2e.test.js`. The voice-*success* path is unverified in a real browser.
- `locLine` fix: covered by `e2e.test.js` ("location detail (counter not labelled Room)").
- README restore: `git status` shows README.md unmodified by the accident; later edits are intentional.

### Root Cause

- Voice callbacks lived in `ui.js` but `render` was private to `staff.js`.
- `locLine()` assumed every location had a room number.
- A failed `cp` followed by `;` let a `cat >` run in the wrong directory.

### Trade-offs

- Classic scripts + global `SP` namespace instead of ES modules (needed for `file://`).
- Config lives in `data.js` and is read-only in the Admin tab (no editing UI).
- Phone-match + name-confirm identity check is demo-grade only.
- Queues are per service, not per doctor; wait time is a simple estimate.

### Not Touched

- MASTER-SPECIFICATION.md, MASTER-PROMPT.md, LICENSE, .git, .kilo.
- No backend, auth, payment, HMS/EMR integration, AI diagnosis, hard-coded medical schedule, framework, or build tooling. Phases 7–9 not started. Nothing committed to git.

### Current Demo Status

- Full journey implemented: problem → questions → service guidance → intake → token → ticket → directions → queue → doctor summary → follow-up (+ emergency).
- Verified headlessly: `logic.test.js`, `e2e.test.js`, `live.test.js` all ALL PASS (jsdom + fake IndexedDB).
- **Not verified:** real-browser layout/fonts, print output, speech recognition/synthesis, multi-tab sync. Do not describe the prototype as "browser-tested" until that is done.

### Next

- Real-browser QA pass (desktop Chrome + Android), fix only reproducible defects, then record the 2–3 minute demo. See ai-handover.md.

---

## Release Rule

Every meaningful AI development session must update this file.

Do not claim a feature is complete unless it has been implemented and verified.

If a feature is intentionally not implemented, explicitly state that.

If a bug was fixed, document:

1. What happened
2. Root cause
3. Fix
4. Trade-off
5. Verification
