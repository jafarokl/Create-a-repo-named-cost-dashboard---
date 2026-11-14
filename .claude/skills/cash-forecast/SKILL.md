---
name: cash-forecast
description: "CFO system 02 — Cash Forecast: see when cash gets tight. Use for runway, 13-week cash flow, 'can we afford X', when will we run low, payroll cover. Reads business-data/finance/."
---

# 02 · Cash Forecast — *See when cash gets tight.*
Owner: **CFO**

## Inputs
- `business-data/finance/cash-position.csv` — current bank balance(s) and date
- `receivables.csv` (customer, amount, due_date, typical_days_late) and `payables.csv` (supplier, amount, due_date)
- `transactions.csv` — to learn recurring income/expenses (rent, payroll, subscriptions, loan payments, tax)
- `company-profile.md` — minimum cash buffer (default: 1 month of fixed costs)
- Any planned big spends/income the user mentions.

## Steps
1. Start balance = latest cash position.
2. Build a **13-week** weekly forecast (offer 6-month monthly view too):
   - Cash in: receivables by due date **adjusted for each customer's typical lateness**, plus expected recurring sales (average of last 3 months, labelled ASSUMPTION).
   - Cash out: payroll, rent, subscriptions, suppliers, loan repayments, tax dates.
3. Make three scenarios: **Expected**, **Bad** (sales −20%, top 2 payers 30 days late), **Good** (sales +10%).
4. Find the first week each scenario drops below the minimum buffer and below zero.
5. List levers with their cash effect: chase invoices, delay a payment, cut a cost, deposit/upfront billing, credit line.

## Output format
```
# Cash Forecast — from <date>
**Headline:** "Cash stays above the buffer until week of <date>. In a bad case it dips below <buffer> on <date>."

## 13-week view (Expected)
| Week | Starts | Cash in | Cash out | End balance | Status (OK / Tight / Short) |

## Scenarios
| Scenario | Lowest balance | When | Weeks below buffer |

## Tight spots & why
## Levers (with amount and when it lands)
## What I'd do this week
```
Optionally also write `outputs/cfo/<YYYY-MM-DD>-cash-forecast.csv`. Save the report to `outputs/cfo/<YYYY-MM-DD>-cash-forecast.md`.
