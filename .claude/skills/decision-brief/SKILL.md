---
name: decision-brief
description: "CEO system 10 — Decision Brief: compare options, risks and numbers. Use for any significant business decision — hiring, pricing, expansion, investment, new product, partnership, firing a client."
---

# 10 · Decision Brief — *Compare options, risks and numbers.*
Owner: **CEO**

## Inputs
- The decision in the owner's words, deadline, and what matters most to them.
- `company-profile.md` (goals, constraints, values) and relevant `business-data/` files.
- Latest CFO/CMO/CTO outputs. Delegate to the `cfo` agent for cash/margin impact when money is involved.

## Steps
1. Restate the decision as one clear question and the deadline. Note if it is reversible (two-way door) or not (one-way door).
2. Define 3–5 criteria with weights (e.g. profit, cash, risk, time, fit with goals).
3. Lay out **3–4 options, always including "do nothing / wait"**.
4. For each: numbers (cost, revenue, cash impact, payback), upside, downside, key risks with likelihood × impact, what it needs (people, time, money).
5. Score options against criteria.
6. Recommend one, with confidence level, the key assumption it depends on, what would change the recommendation, and the first 3 steps if approved.

## Output format (one page)
```
# Decision Brief — <question>
**Recommendation:** Option B — <why, one sentence>.  Confidence: medium.  Decide by: <date>.  Reversible: yes/no.
## Options at a glance (table: option, cost, 12-month profit/cash effect, risk, score)
## Facts / Assumptions / Opinions
## Risks & how to reduce them
## What would change my mind
## If you say yes — first 3 steps
```
Save to `outputs/ceo/<YYYY-MM-DD>-decision-<topic>.md`. Suggest running **Devil's Advocate** for one-way-door decisions. When the owner decides, append to `business-data/decisions/decision-log.md`.
