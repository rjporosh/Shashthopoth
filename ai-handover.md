# AI Handover

## Purpose

This file is the mandatory handover document for any AI agent working on ShasthoPath.

When the current AI agent is approaching its context/token limit, it MUST STOP implementation immediately and update this file before returning the project.

Do NOT continue implementation after the handover threshold.

---

# Current State

## Project Phase

[UPDATE]

## Completed Features

- [UPDATE]

## Current Feature

[UPDATE]

## Features Not Started

- [UPDATE]

---

# What Problem Does the Current Version Solve?

[UPDATE]

Explain the exact user/hospital problem solved by the current implementation.

---

# What Has Been Completed?

[UPDATE]

List concrete completed functionality.

---

# Bugs Fixed

For every bug:

### Bug

[UPDATE]

### Root Cause

[UPDATE]

### Fix

[UPDATE]

### Why This Fix Was Chosen

[UPDATE]

### Trade-offs

[UPDATE]

### Why This Is Currently the Best Practical Fix

[UPDATE]

---

# Known Bugs

- [UPDATE]

---

# Known Limitations

- [UPDATE]

---

# Files Changed

- [UPDATE]

---

# Features Intentionally NOT Touched

- [UPDATE]

This section is important.

Do not implement these items unless explicitly instructed.

---

# Architecture Decisions

[UPDATE]

Explain important decisions and why they were made.

---

# Current Demo Flow

[UPDATE]

Describe the exact workflow currently working.

---

# Next Recommended Task

[UPDATE]

Only one next task should be identified unless multiple tasks are genuinely required.

---

# Exact Continuation Command

The next AI agent must be able to continue without guessing.

Use this format:

> Continue ShasthoPath from the current repository state. First read README.md, MASTER-SPECIFICATION.md, ROADMAP.md, GUIDE.md, PATIENT-GUIDE.md, DOC-GUIDE.md, release-notes.md and ai-handover.md. Do not redo completed work. Continue only from the "Next Recommended Task" section of ai-handover.md. Preserve all existing architecture and UX decisions unless a documented bug requires a change. Before making changes, verify the current implementation against the specification.

Then add the exact task:

[UPDATE]

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

Confirm:

- Project runs
- Current feature works
- No known accidental regressions
- Documentation is updated
- Next task is explicit
- Exact continuation command is written