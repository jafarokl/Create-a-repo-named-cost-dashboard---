---
name: month-plan
description: "CMO system 06 — Month Plan: marketing actions, budget and reasoning. Use to plan next month's marketing, choose channels, split a budget, or set marketing goals."
---

# 06 · Month Plan — *Marketing actions, budget and reasoning.*
Owner: **CMO**

## Inputs
- `company-profile.md` (goals, offer, seasonality)
- Latest Customer Read (`outputs/cmo/*customer-read.md`) — run it first if missing
- `business-data/finance/` — revenue, margin, what the business can afford (or ask for a budget)
- Last month's plan and results, if any (`outputs/cmo/*month-plan.md`)
- Calendar: holidays, launches, events in the month

## Steps
1. **One goal** for the month in numbers (e.g. "12 new clients" or "€20k from repeat buyers"), tied to the business goal.
2. **Math backwards:** customers needed ← conversion rate ← leads ← reach. Use real rates if known, else label ASSUMPTION.
3. Review last month: what worked (keep), what didn't (stop), one test (start).
4. Pick **3–5 actions max**, prioritised by impact ÷ effort; favour the channels where the best customers come from. Always include one action for existing/at-risk customers.
5. **Budget split** with reasoning; keep 10–20% for a test. Show expected cost per customer vs gross profit per customer.
6. Weekly calendar with owners and dates.

## Output format
```
# Marketing Plan — <Month YYYY>
**Goal:** ... **Budget:** ... **Why this plan:** 2 sentences.
## Last month: keep / stop / start
## Actions (table: action, channel, target segment, owner, due, cost, success number)
## Budget split + reasoning
## Week-by-week calendar
## How we'll measure (check-in every Monday)
## What I'd do this week
```
Save to `outputs/cmo/<YYYY-MM>-month-plan.md`.
