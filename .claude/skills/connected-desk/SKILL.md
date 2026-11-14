---
name: connected-desk
description: "CTO system 08 — Connected Desk: surface what needs you today. Use for a daily briefing across inbox, calendar, Drive files and task lists — what's urgent, who's waiting, what to prepare."
---

# 08 · Connected Desk — *Surface what needs you today.*
Owner: **CTO**

## Sources (use whatever is connected; load tools with ToolSearch, e.g. "gmail", "calendar", "drive")
- **Email** (Gmail): unread/flagged from the last 48h, threads where someone is waiting on the owner
- **Calendar:** today and tomorrow's meetings
- **Files** (Google Drive): recently changed/shared docs needing review
- **Tasks:** `TASKS.md` or connected task tools; overdue items
- **Money signals:** overdue invoices from `business-data/finance/receivables.csv`
If nothing is connected, ask the owner to paste their inbox subjects/calendar, or explain how to connect the tools.

## Steps
1. Collect items from each source (read-only — never send, archive, delete or accept).
2. Classify each: **Do today** (deadline/money/customer waiting), **Decide**, **Delegate**, **Read later**, **Ignore**.
3. For each meeting: who, why, what to prepare, 1-line context from past emails.
4. Draft short replies (in the owner's voice via `business-data/voice/voice-guide.md`) for the top 3 waiting emails — as drafts only, and only create Gmail drafts if the owner asks.
5. Keep it to one screen.

## Output format
```
# Today's Desk — <weekday, date>
## Top 3 (do these first)
## Meetings (time · who · prep needed)
## People waiting on you
## Decisions needed
## Can delegate
## Draft replies (ready to copy)
```
Save to `outputs/cto/<YYYY-MM-DD>-desk.md`.
