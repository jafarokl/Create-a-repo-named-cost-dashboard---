---
name: monthly-money-brief
description: "CFO system 01 — Monthly Money Brief: your numbers, in plain words. Use for 'how did we do last month', monthly P&L, profit, revenue, costs, spending review. Reads business-data/finance/."
---

# 01 · Monthly Money Brief — *Your numbers, in plain words.*
Owner: **CFO**

## Inputs
- `business-data/finance/transactions.csv` (date, description, category, amount, type=income|expense) **or** `monthly-pnl.csv` (month, revenue, cogs, expenses by category)
- `business-data/company-profile.md` (currency, monthly targets)
- Optional: last brief in `outputs/cfo/` for comparison
- Ask for the month if not given (default: last full calendar month).

## Steps
1. Load the data for the target month, the previous month and the same month last year (if available).
2. Compute: revenue, cost of sales, gross profit & gross margin %, operating expenses by category, net profit & net margin %, cash in vs cash out.
3. Compare to previous month, same month last year and target. Flag any line that moved more than **±15%** or **±5% of revenue**.
4. Find the top 3 revenue sources and top 5 expenses. Spot new/recurring subscriptions, duplicate charges, unusual one-offs.
5. Check receivables: who owes money, how old (0-30 / 31-60 / 60+ days).
6. Write the brief.

## Output format (one page)
```
# Money Brief — <Month YYYY>
**In one sentence:** <e.g. "We made 4,200 profit on 31,000 sales — up 12%, mainly from X.">

## The numbers
| | This month | Last month | Change | Target |
| Revenue | ... |
| Gross profit (margin %) | ... |
| Expenses | ... |
| Net profit (margin %) | ... |
| Cash in / out | ... |

## What happened (plain words)
- 3–5 bullets explaining the WHY behind the changes.

## Watch list
- Risks/oddities, biggest money first (late payers, rising costs, unused subscriptions).

## What I'd do this week
1. ... 2. ... 3. ...
```
Save to `outputs/cfo/<YYYY-MM>-money-brief.md`.
