# Doctor / Clinical Staff Guide

## Purpose

ShasthoPath provides a short pre-consultation intake summary and a simple queue console.

Open the **Doctor / staff** tab. Pick your queue from the chips (the number badge = people waiting; ● = someone is being served). `-follow-up` queues are the dedicated follow-up lines.

## What You See (Intake Summary)

Shown for the token being served, headed "Intake summary — patient-reported, NOT a diagnosis":

- Patient identity (name, age, sex) and token
- Chief complaint (the service tile or the patient's own words) and duration
- Injury / previous consultation / reports with the patient (Yes / No / Patient does not know)
- Pregnancy answer (only asked for the women's-health route, and only if the patient knows)
- Basic measured vitals if entered: blood pressure, temperature, glucose, weight
- Conditions, current medicines, allergies — as reported by the patient
- Follow-up status (visit number for follow-up tokens; any scheduled visits)

## Important

The information is patient-reported or entered during intake.

It is NOT a diagnosis. ShasthoPath never diagnoses, prescribes or suggests dosage.

The doctor remains responsible for:

- Clinical assessment
- Diagnosis
- Investigation
- Treatment
- Prescription
- Follow-up decision

## Queue Controls

- **Call next** — calls the first waiting token (emergency, then priority, then time). Disabled while someone is being served: complete or skip first.
- **Recall** — shows 🔔 on the display and on the patient's screen.
- **Skip** — token goes to "Skipped"; **Back to queue** returns it to the end.
- **Complete** — finishes the visit (and marks a linked follow-up as completed).
- **Cancel** — cancels a waiting/serving/skipped token.
- **Transfer** — choose a service and press Transfer: a new token is issued there (priority kept), the old one is marked transferred, and the patient's screen follows.
- **Priority** — ⭐ marks a waiting token as priority (or removes it). Emergency tokens (`EMR-`) are priority 2.

## Follow-Up

Existing scheduled patients can be routed through the follow-up workflow instead of unnecessarily repeating the entire registration process.

To schedule: with a patient being served press **Schedule follow-up**, then enter the **date**, **visit number**, **service**, and your **instruction** (free text). The system never suggests a date or a vaccination/injection schedule — you decide. The patient can then check in on/after that date and receives a token in the `-FU` queue; before the date the kiosk tells them when to come.

## Unknown Values

Unknown information must remain unknown.

Do not assume or infer missing values from incomplete intake data. The summary prints: Unknown · Not measured · Not available · Not reported by patient · Patient does not know.

## Demo Notes

All patients and doctors are fictional. Do not enter real patient data. Admin ▸ *Seed demo queue* adds six fictional waiting patients; *Reset demo data* clears everything.
