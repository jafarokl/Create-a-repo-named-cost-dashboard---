---
name: monday-review
description: "CEO system 12 — Monday Review: one-page company brief and three decisions. Use every Monday (or for a weekly/business review, status of the company, what to focus on this week)."
---

# 12 · Monday Review — *One-page company brief. Three decisions.*
Owner: **CEO**

## Inputs (read the latest of each; note anything stale > 2 weeks)
- **Money:** `business-data/finance/` + latest `outputs/cfo/` (money brief, cash forecast)
- **Customers & marketing:** `business-data/customers/` + latest `outputs/cmo/` (month plan progress)
- **Operations & tools:** latest `outputs/cto/`, `TASKS.md`, processes
- **Decisions:** `business-data/decisions/decision-log.md` — any due for review?
- **Goals:** `company-profile.md`
- Last week's review in `outputs/ceo/` — check what happened to last week's 3 decisions.

## Steps
1. Scorecard: 5–7 key numbers (revenue week & month-to-date vs target, cash balance & runway, new customers/leads, pipeline, overdue invoices, one ops metric) with ▲▼ vs last week and a status (🟢🟡🔴).
2. Last week: what got done, what didn't, outcome of last week's decisions.
3. What changed: wins, problems, risks (biggest money/customer impact first).
4. Pick exactly **three decisions** for this week — the ones with the most leverage. For each: the question, options, recommendation, deadline.
5. Keep it to one page. If data is missing, say which file to update (the owner can paste numbers in chat).

## Output format
```
# Monday Review — week of <date>
**The week in one line:** ...
## Scorecard (table: metric, this week, last week, target, status)
## Last week: done / not done / decisions outcome
## What changed (wins · problems · risks)
## Three decisions for this week
1. **<Question>** — Recommend: ... Why: ... Decide by: ...
2. ...
3. ...
## Focus: one thing that matters most this week
```
Save to `outputs/ceo/<YYYY-MM-DD>-monday-review.md`. Log decisions made into `decision-log.md`.
