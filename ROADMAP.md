# ShasthoPath — Roadmap

## Status at a glance (updated by the MVP implementation session)

| Phase | Status | Notes |
|---|---|---|
| 0 Foundation | **Done** | Structure, IndexedDB, seed data, design language |
| 1 Patient Navigation MVP | **Done (headless-verified)** | Kiosk, bn/en, problem input, questions, routing, token, ticket, directions |
| 2 Smart Intake | **Done (headless-verified)** | Voice via Web Speech API with touch fallback; unknowns preserved; doctor summary |
| 3 Queue Management | **Done (headless-verified)** | Per-service queues (not per-doctor), display, call/recall/skip/complete/transfer/priority/emergency |
| 4 Follow-Up & Scheduled Visits | **Done (headless-verified)** | Phone lookup, dedicated `-FU` queue, clinician-set dates; reminder = concept only (date shown, nothing sent) |
| 5 Hospital Navigation | **Done, schematic** | Building/floor/room, text steps, SVG schematic map, directory. No real floor plans |
| 6 Demonstration Experience | **Implemented, NOT browser-verified** | Fullscreen, demo mode, print ticket, displays. Animations minimal |
| 7 Production Architecture Study | Not started (out of MVP) | |
| 8 Pilot Proposal | Not started (out of MVP) | |
| 9 Production | Not started (out of MVP) | Only after validation with a real hospital |

**Next task:** real-browser QA pass, then record the demo (see ai-handover.md).

"Headless-verified" = `docs/verification/*.test.js` pass in jsdom with fake IndexedDB. No real browser has been used yet.

---

## Phase 0 — Foundation

- Repository structure
- Documentation
- Product identity
- Design language
- Demo data model
- IndexedDB foundation

Status:
Done

---

# Phase 1 — Patient Navigation MVP

### Goal

Demonstrate the basic patient journey.

Features:

- Home kiosk
- Bengali/English selection
- Service selection
- Symptom/problem input
- Basic question flow
- Department/service routing
- Token generation
- Ticket view
- Hospital location guidance

Success:

A first-time patient can complete the journey without knowing the hospital's internal department names.

---

# Phase 2 — Smart Intake

Features:

- Voice input
- Patient name
- Age
- Phone
- Weight
- Chief complaint
- Duration
- Previous consultation
- Reports
- Blood pressure
- Temperature
- Blood glucose
- Existing conditions reported by patient
- Unknown/uncertain values
- Doctor pre-consultation summary

Important:

This phase collects information only.

It does not diagnose.

---

# Phase 3 — Queue Management

Features:

- Department queues
- Doctor queues
- Token generation
- Token display
- Call next
- Recall
- Skip
- Complete
- Transfer
- Priority queue
- Emergency escalation

---

# Phase 4 — Follow-Up & Scheduled Visits

Features:

- Existing patient lookup
- Follow-up visit
- Scheduled service
- Appointment date
- Visit number
- Follow-up token
- Dedicated queue
- Reminder concept
- No unnecessary re-registration

Medical schedules must be configurable and must not be hard-coded.

---

# Phase 5 — Hospital Navigation

Features:

- Building map
- Floor map
- Room/counter location
- Direction instructions
- Services directory
- Toilet
- Food
- Pharmacy
- Billing
- Reports
- Emergency

---

# Phase 6 — Demonstration Experience

Features:

- Fullscreen kiosk
- Large accessibility controls
- Demo mode
- Realistic sample data
- Printed ticket
- Queue display
- Doctor display
- 2–3 minute demo workflow
- Clean animations
- Error handling

---

# Phase 7 — Production Architecture Study

NOT part of MVP.

Research:

- Backend
- Hospital HMS integration
- Open standards
- Authentication
- Role-based access
- Audit logging
- Encryption
- Multi-hospital support
- Centralized queue management
- Offline LAN operation
- Hardware kiosk integration
- Printer integration
- Notification systems
- Payment integration

---

# Phase 8 — Pilot Proposal

Potential deliverables:

- Product demo
- Architecture diagram
- Workflow diagram
- Patient journey
- Hospital staff journey
- Problem/solution video
- Cost model
- Deployment model
- Security model
- Pilot plan

---

# Phase 9 — Production

Only after validation with a real hospital.

Possible capabilities:

- Multi-hospital
- Multi-building
- Multi-department
- Multi-counter
- Real patient identity
- Existing HMS integration
- Queue synchronization
- Reporting
- Analytics
- Audit
- Disaster recovery
- Security monitoring

---

# Current Development Rule

The current target is ONLY a visual and functional prototype.

Do not build production infrastructure prematurely.

Do not over-engineer.

Do not add unrelated features.

---

# AI Development Rule

If context/token budget becomes insufficient:

STOP implementation.

Do not start another feature.

Immediately update:

- ai-handover.md
- release-notes.md
- GUIDE.md
- PATIENT-GUIDE.md
- DOC-GUIDE.md
- ROADMAP.md
- README.md

Then return control to the user/next AI agent.