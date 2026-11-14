---
name: process-book
description: "CTO system 09 — Process Book: a task becomes an SOP and checklist. Use to document how a task is done, write a standard operating procedure, onboarding steps, or a checklist from notes, a transcript or a description."
---

# 09 · Process Book — *A task becomes an SOP and checklist.*
Owner: **CTO**

## Inputs
Any of: a rough description, voice-note transcript, screen-recording notes, an email thread, or the owner explaining the task in chat. Raw notes can sit in `business-data/processes/`.

## Steps
1. Interview if needed (max 5 questions): trigger (when does this start?), who does it, tools used, what "done" looks like, common mistakes.
2. Write the SOP: purpose, scope, roles, tools & access needed, numbered steps (one action per step, starting with a verb), decision points (if X → do Y), time per step, quality checks, what to do when it goes wrong.
3. Create a short **checklist** version (tick boxes) for daily use.
4. Suggest automation: which steps a tool, template or AI could do, with effort (low/med/high).
5. Add version and review date (default: 6 months).

## Output format → `business-data/processes/sop-<task-name>.md`
```
# SOP: <Task name>   v1.0 · owner: <role> · review by: <date>
**Purpose:** ... **When:** ... **Time:** ~X min
## Before you start (tools, access, inputs)
## Steps
1. ...
## If something goes wrong
## Checklist
- [ ] ...
## Automation ideas
```
Also add a line to `business-data/processes/INDEX.md` (create if missing).
