# ShasthoPath — স্বাস্থ্যপথ
## Hospital Patient Navigation, Smart Intake & Queue Management Prototype

### Motto

> **হাসপাতালে পথ হারাবেন না—সঠিক জায়গা, সঠিক সময়ে।**

Alternative English motto:

> **From confusion to care.**

---

# 1. Vision

ShasthoPath is a browser-based hospital workflow prototype designed to demonstrate how technology can reduce confusion, unnecessary queues, line-breaking, poor navigation, repeated questioning, and uncertainty for patients and hospital staff.

The system is NOT intended to replace doctors, nurses, hospital management systems, electronic medical records, or clinical decision-making.

The prototype represents a patient-facing navigation and workflow layer that can potentially sit on top of an existing hospital information system.

---

# 2. Problem

Patients may enter a hospital without knowing:

- Which department they need
- Which doctor they need
- Which building or ward they should visit
- Where to obtain a ticket
- Where to submit reports
- Where to pay
- Where to collect medicine
- Where to receive scheduled injections
- When their turn will come
- Whether they need a new ticket for a follow-up visit

This becomes especially difficult for:

- Elderly patients
- Rural patients
- Patients with limited literacy
- First-time hospital visitors
- Patients unfamiliar with hospital terminology
- Patients accompanying children or elderly family members
- Patients visiting large public hospitals

---

# 3. Core Solution

ShasthoPath provides:

1. Patient-facing kiosk
2. Voice-first intake
3. Symptom/problem-based service routing
4. Basic pre-consultation information collection
5. Token generation
6. Queue management
7. Doctor/desk queue display
8. Hospital navigation
9. Follow-up scheduling
10. Scheduled service/injection tracking
11. Printable patient ticket
12. Patient guidance
13. Doctor guidance
14. Admin/demo mode

---

# 4. Critical Safety Boundary

ShasthoPath MUST NOT:

- Diagnose diseases
- Prescribe medicine
- Recommend medication dosage
- Replace a doctor
- Make definitive clinical decisions
- Automatically determine a medical diagnosis
- Invent missing patient information
- Modify a doctor's clinical decision
- Give medical treatment instructions as if it were a doctor

It MAY:

- Collect patient-reported symptoms
- Ask predefined administrative/intake questions
- Identify potential service/department routing
- Identify predefined emergency red flags for escalation
- Record "Unknown", "Uncertain", or "Not available"
- Present information to healthcare professionals
- Manage queues and navigation

All medical routing rules must be configurable and ultimately controlled by qualified hospital administrators/clinicians.

---

# 5. Patient Journey

## Standard Journey

Patient arrives

↓

Kiosk / Reception

↓

Patient describes problem

↓

System asks basic questions

↓

Service/department suggestion

↓

Patient information collected

↓

Token generated

↓

Printed ticket

↓

Navigation instructions

↓

Waiting queue

↓

Doctor/desk calls token

↓

Consultation

↓

Investigation / medicine / follow-up if required

---

# 6. Patient Intake

Collect where applicable:

- Patient name
- Age
- Sex
- Phone
- Weight
- Chief complaint
- Duration
- Previous consultation
- Existing diagnosis reported by patient
- Current medicines reported by patient
- Allergies reported by patient
- Reports available
- Blood pressure
- Temperature
- Blood glucose
- Pregnancy information where clinically appropriate and configured
- Follow-up status
- Scheduled service
- Additional notes

The exact fields must be configurable.

---

# 7. Unknown Data Rule

Never guess missing information.

Examples:

Age → Unknown

Weight → Unknown

Blood pressure → Not measured

Blood glucose → Not available

Previous diagnosis → Patient does not know

The system must preserve uncertainty rather than fabricate information.

---

# 8. Voice-First Interaction

The system should support a low-literacy-friendly workflow.

Example:

System:

"আপনার কী সমস্যা?"

Patient:

"আমার হাতে ব্যথা।"

System:

"কতদিন ধরে?"

Patient:

"তিন দিন।"

System:

"কোনো আঘাত পেয়েছেন?"

Patient:

"হ্যাঁ।"

The prototype may use browser speech recognition where available.

A manual touch fallback MUST always exist.

Voice recognition failure must never block the workflow.

---

# 9. Symptom-Based Routing

Patients do NOT need to know the department name.

They describe the problem.

The system maps the complaint to a configurable service category.

Example:

Hand pain
→ configured assessment pathway

Headache
→ configured assessment pathway

Fever
→ configured assessment pathway

Eye problem
→ configured eye service

Dental problem
→ configured dental service

Emergency red flag
→ Emergency

This is routing assistance, NOT diagnosis.

---

# 10. Emergency Escalation

The prototype may contain configurable emergency indicators.

Examples:

- Severe bleeding
- Difficulty breathing
- Loss of consciousness
- Severe chest pain
- Major trauma
- Severe allergic reaction
- Other hospital-configured emergency indicators

If triggered:

Display:

EMERGENCY

"Please proceed immediately to Emergency."

The prototype must not claim to medically diagnose the patient.

---

# 11. Pre-Consultation Summary

Before the patient reaches the doctor, the doctor/clinical desk may see:

- Patient name
- Token
- Chief complaint
- Duration
- Relevant intake answers
- Vital measurements if entered
- Previous consultation status
- Reports available
- Follow-up status

This is an intake summary only.

---

# 12. Queue System

Every active queue must have unique tokens.

Examples:

MED-001
LAB-004
AR-FU-018
SURG-012

The system must support:

- Create token
- Call next
- Recall
- Skip
- Complete
- Cancel
- Transfer
- Priority/emergency queue
- Follow-up queue

---

# 13. Follow-Up

Patients with an existing scheduled visit must not necessarily repeat the complete registration process.

Example:

Patient:

Existing patient

Purpose:

Scheduled rabies vaccination/follow-up

The system verifies:

- Patient identity
- Existing schedule
- Visit number
- Date
- Service

Then generates a follow-up token.

The actual medical schedule must come from hospital-configured data or clinician instructions.

The application must NEVER hard-code a universal medical vaccination schedule.

---

# 14. Navigation

Every destination should contain:

- Building
- Floor
- Room
- Counter
- Department
- Simple text instructions
- Optional visual map

Example:

Building B
2nd Floor
Room 207

Directions:

"Enter through the main entrance, take the stairs on the right, go to the second floor and turn left."

---

# 15. Hospital Services

Demo data should include:

- Registration
- Medicine
- Surgery
- Orthopedics
- Pediatrics
- Gynecology
- Eye
- ENT
- Dental
- Laboratory
- Radiology
- Pharmacy
- Emergency
- Billing
- Reports
- Anti-rabies/follow-up service
- Toilet
- Food area
- Information desk

The list must be configurable.

---

# 16. Ticket

Printed ticket should contain:

- Hospital name
- Patient name
- Token
- Visit type
- Department/service
- Doctor if available
- Building
- Floor
- Room/counter
- Queue number
- Date/time
- Basic instructions
- Follow-up date if applicable

---

# 17. Kiosk Design

Large touch targets.

Minimal typing.

Large typography.

Bengali-first interface.

English fallback.

Clear icons.

Simple language.

No unnecessary dashboards.

The interface must be usable by someone unfamiliar with computers.

---

# 18. Doctor/Staff Display

Display:

NOW SERVING

MED-047

NEXT

MED-048

WAITING

MED-049
MED-050

The staff console must allow controlled queue management.

---

# 19. Data Architecture

Technology:

- HTML
- CSS
- Vanilla JavaScript
- IndexedDB

IndexedDB stores:

patients
departments
services
doctors
locations
tokens
queues
followups
appointments
settings
demo data

No backend in MVP.

---

# 20. Privacy

The prototype must clearly state:

"This is a demonstration system. Do not enter real sensitive medical information."

Production implementation would require:

- Authentication
- Authorization
- Encryption
- Audit logs
- Secure APIs
- Data retention policies
- Privacy compliance
- Hospital governance

---

# 21. Demo Mode

The prototype must support a complete demonstration without real patients.

Demo flow:

1. Create patient
2. Describe symptom
3. Answer questions
4. Route to service
5. Generate token
6. Print ticket
7. Navigate
8. Open queue
9. Call token
10. Show doctor summary
11. Create follow-up
12. Demonstrate follow-up token

---

# 22. Architecture Principle

Keep the MVP simple.

Do not over-engineer.

Do not add:

- Microservices
- Backend
- Authentication
- Cloud
- Payment gateway
- Real hospital integration
- AI diagnosis
- Production EMR

unless explicitly requested in a future phase.

---

# 23. Future Production Architecture

Potential future layers:

Kiosk
↓
Patient Navigation API
↓
Hospital Integration Layer
↓
Existing HMS/EMR
↓
Queue Service
↓
Notification Service
↓
Reporting/Analytics

Hardware may later include:

- Touch kiosk
- Receipt printer
- Token display
- Speaker
- Barcode/QR scanner
- Payment terminal
- Cash module

---

# 24. Success Criteria

The prototype is successful if a viewer can understand within 2–3 minutes:

1. What problem exists
2. How a patient enters
3. How the patient describes their problem
4. How the system guides them
5. How a token is created
6. How the patient finds the correct location
7. How the queue works
8. How the doctor receives preliminary information
9. How follow-up visits avoid unnecessary confusion
10. How the system can potentially reduce patient frustration

---

# 25. Product Philosophy

Do not make the hospital feel like a complicated machine.

Make the system feel like a helpful guide.

The patient should always know:

WHERE AM I?

WHAT DO I NEED TO DO?

WHERE DO I GO NEXT?

WHEN IS MY TURN?

WHAT HAPPENS AFTER THIS?

---

# 26. Final Product Positioning

ShasthoPath is not:

"Another hospital management system."

It is:

> "A patient-facing navigation, intake and queue layer designed to make complex hospitals easier to use."

---

# 27. MVP Rule

Build only what is necessary to visually demonstrate the concept.

Avoid feature creep.

Avoid unnecessary abstraction.

Avoid premature production architecture.

The prototype must remain understandable, demonstrable and easy to extend.