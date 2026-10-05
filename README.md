# 🏥 ShasthoPath — স্বাস্থ্যপথ

### **হাসপাতালে পথ হারাবেন না—সঠিক জায়গা, সঠিক সময়ে।**

> **From confusion to care.**

---

## What is ShasthoPath?

ShasthoPath is a hospital patient-navigation and queue-management prototype.

It helps demonstrate how a patient can enter a hospital, describe their problem in simple language, receive guidance, get a token, find the correct location, wait for their turn, and continue with follow-up care.

It is designed especially with large, complex hospitals and patients with limited technical or medical knowledge in mind.

---

# The Problem

A patient may know:

> "আমার হাতে ব্যথা।"

But may not know:

> Which department?

> Which doctor?

> Which building?

> Which counter?

> Where should I get a ticket?

> Where should I wait?

> When is my turn?

> Do I need a new ticket for my follow-up?

The hospital may be perfectly functional internally, but the patient can still experience it as confusing.

---

# The Idea

Instead of asking the patient to understand the hospital, let the system understand the patient's basic need and guide them.

```text
Patient
   ↓
Describe Problem
   ↓
Simple Questions
   ↓
Service Guidance
   ↓
Token
   ↓
Directions
   ↓
Queue
   ↓
Doctor
   ↓
Follow-up
```

---

# Key Features

### 🗣️ Voice-first Intake

Patients can describe their problem using natural language.

### 🧭 Patient Navigation

The system tells the patient where to go.

### 🎫 Token System

Patients receive a unique token instead of fighting over physical queue positions.

### 🩺 Pre-consultation Intake

Basic patient-reported information can be collected before consultation.

### 📋 Doctor Summary

The doctor can receive a short intake summary before seeing the patient.

### 🔁 Follow-up

Scheduled visits can use a dedicated follow-up workflow.

### 🚨 Emergency Escalation

Configured emergency indicators can direct patients toward emergency services.

### 🖨️ Printable Ticket

The patient receives a simple physical ticket containing their next destination and queue information.

---

# Technology

Current prototype:

- HTML
- CSS
- Vanilla JavaScript
- IndexedDB

No backend is required for the prototype.

---

# Important Boundary

ShasthoPath is NOT a diagnostic system.

It does not replace:

- Doctors
- Nurses
- Clinical judgement
- Hospital management systems
- Electronic medical records

It is a patient-facing workflow and navigation concept.

---

# Why This Prototype Exists

The goal is simple:

> **Make a complicated hospital easier for ordinary people to understand.**

The prototype is intended to communicate the idea visually through a working demonstration and short video.

---

# Demo

A complete demonstration can show:

1. Patient arrives
2. Patient describes a problem
3. System asks basic questions
4. Service is identified
5. Token is generated
6. Ticket is printed
7. Patient receives directions
8. Patient waits
9. Doctor calls token
10. Doctor sees intake summary
11. Patient receives follow-up workflow

---

# Vision

A future production version could work across:

- Small hospitals
- Clinics
- Private hospitals
- Public hospitals
- Large medical colleges
- Multi-building hospital campuses

The long-term vision is not to replace existing hospital systems.

It is to make those systems easier for humans to use.

---

## Motto

> ### **From confusion to care.**

### স্বাস্থ্যপথ

**সঠিক জায়গা। সঠিক সময়ে। কম ঝামেলায়।**