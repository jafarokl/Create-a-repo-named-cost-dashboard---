---
name: customer-read
description: "CMO system 04 — Customer Read: know who buys and why. Use for best-customer analysis, segments, RFM, churn risk, buyer personas, reasons people buy or leave. Reads business-data/customers/."
---

# 04 · Customer Read — *Know who buys and why.*
Owner: **CMO**

## Inputs
- `business-data/customers/customers.csv` (id, name/company, segment, location, source, first_order_date)
- `orders.csv` (customer_id, date, product, amount)
- `feedback.md` — reviews, survey answers, sales call notes, support emails, lost-deal reasons
- `company-profile.md` — offer and target audience

## Steps
1. **Value:** revenue per customer, Pareto (what % of customers make 80% of revenue), average order value, purchase frequency, simple lifetime value.
2. **RFM segments:** Champions, Loyal, New, At-risk (used to buy, quiet for > 2× their usual gap), Lost.
3. **Where they come from:** revenue and customer count by source/channel.
4. **Why they buy:** code the feedback into themes (jobs-to-be-done, triggers, objections, words they use). Quote real phrases (anonymised).
5. **Why they leave / don't buy:** churn and lost-deal themes.
6. Write 2–3 short personas grounded in the data (no invented demographics).

## Output format
```
# Customer Read — <date>
**In one sentence:** "20% of customers (mostly <segment>) bring 72% of revenue; they buy because <reason>."
## Who brings the money (table)
## Segments (RFM) — count, revenue, what to do with each
## Why they buy — top themes with real quotes
## Why they leave / hesitate
## Personas (2–3)
## Words to use in marketing (their language)
## At-risk customers to contact now (list)
## What I'd do this week
```
Save to `outputs/cmo/<YYYY-MM>-customer-read.md`. Voice Engine and Month Plan reuse this.
