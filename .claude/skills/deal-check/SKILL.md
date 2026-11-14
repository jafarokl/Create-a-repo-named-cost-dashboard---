---
name: deal-check
description: "CFO system 03 — Deal Check: margin, cash impact and terms. Use before accepting a client deal, sending a quote, giving a discount, or signing a supplier contract."
---

# 03 · Deal Check — *Margin, cash impact and terms.*
Owner: **CFO**

## Inputs
- The deal: quote, proposal, PO, contract or chat description (price, volume, delivery, payment terms, length).
- Costs: direct costs, hours × hourly cost, subcontractors, materials, shipping, payment fees.
- `business-data/finance/` for normal margins, cash position and typical overheads.
- `company-profile.md` for target margin (default: ask; else 40% gross for services, 30% for products — ASSUMPTION).

## Steps
1. **Margin:** revenue − direct costs = gross profit; gross margin %; profit per hour/unit; compare to the business average and target.
2. **Break-even:** lowest price/volume that still hits target margin. Effect of any requested discount ("a 10% discount wipes out X% of profit").
3. **Cash impact:** when money goes out vs comes in; peak cash needed; does it push the Cash Forecast below the buffer?
4. **Terms check:** payment terms & late fees, deposits, scope creep risk, change requests, cancellation, liability/penalties, auto-renewal, exclusivity, IP, currency risk.
5. **Customer risk:** concentration (would this client be > 25% of revenue?), payment history.
6. Verdict: **GO / GO WITH CHANGES / NO-GO**, with the exact changes to ask for.

## Output format
```
# Deal Check — <deal name>
**Verdict:** GO WITH CHANGES — "Good margin (38%) but 90-day terms hurt cash; ask for 30% deposit."
## Numbers  (table: price, costs, gross profit, margin %, vs target, break-even price)
## Cash impact  (peak cash needed, timing)
## Terms — red / amber / green flags
## Counter-offer to send  (short, ready-to-use wording)
## What I'd do this week
```
Not legal advice — recommend a lawyer for big or unusual contracts. Save to `outputs/cfo/<YYYY-MM-DD>-deal-<name>.md`.
