---
name: tech-translator
description: "CTO system 07 — Tech Translator: evaluate software and vendor offers. Use for SaaS quotes, IT/agency proposals, 'should we buy this tool', comparing software, renewal decisions."
---

# 07 · Tech Translator — *Evaluate software and vendor offers.*
Owner: **CTO**

## Inputs
- The offer: quote, proposal, pricing page link, contract, or sales email.
- `business-data/tools/tool-stack.md` — what we already pay for (avoid overlap).
- The problem the owner wants solved and who would use it (team size).

## Steps
1. **Plain-English summary:** what it actually does, in 3 sentences, no jargon. Translate any buzzwords into what they mean.
2. **Real cost:** total yearly cost incl. per-seat growth, setup/onboarding, add-ons, price-increase clauses, payment fees, and staff time to learn it. 3-year cost.
3. **Value:** hours saved/week × hourly cost, revenue gained, errors avoided → payback period.
4. **Overlap:** does an existing tool already do this?
5. **Risk check:** contract length & cancellation, auto-renew, data ownership & export, security (2FA, SSO, GDPR/data location), vendor size/stability, integrations, support.
6. **Alternatives:** 2–3 options (incl. a cheaper/simple one and "do nothing / spreadsheet"). Use WebSearch for current pricing if available; note the date checked.
7. **Questions to ask the vendor** before signing.

## Output format
```
# Tech Translator — <vendor/product>
**Verdict:** BUY / NEGOTIATE / PILOT FIRST / SKIP — one-sentence reason.
## What it really is (plain English)
## Cost (table: year 1, year 2, year 3, hidden costs)
## Value & payback
## Comparison (table: option, yearly cost, fit, risk)
## Red flags
## Questions to ask the vendor
## What I'd do this week
```
Save to `outputs/cto/<YYYY-MM-DD>-tech-<vendor>.md`. If bought, add it to `tool-stack.md`.
