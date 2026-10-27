# Claude Code Finance Department

10 finance functions. 50 agents. 1 CFO.

The agents live in [`.claude/agents/`](../.claude/agents). Claude Code loads them automatically when you open this repository.

## Quick start

1. Drop your data exports (trial balance, budget, AR/AP ageing, bank statements, payroll, CRM, etc.) into `finance/data/` as CSV or XLSX.
2. Start the CFO, who delegates to the right specialists:
   ```bash
   claude --agent cfo
   ```
   Then ask, for example: *"Run the October close and give me a board-ready summary."*
3. Or call a specialist directly from a normal Claude Code session:
   > Use the variance-analysis agent to explain October budget vs actual using finance/data/tb_2026-10.csv and finance/data/budget_2026.xlsx

Results are written to `finance/outputs/<agent-name>/`. Type `/agents` in Claude Code to browse or edit them.

## The team

| Function | Agents |
|---|---|
| FP&A & Forecasting | budget-builder, forecast-model, variance-analysis, scenario-planner, kpi-tracker |
| Accounting & Close | month-end-close, reconciliations, journal-review, accruals, close-checklist |
| Cash & Treasury | cash-forecast, working-capital, payment-runs, cash-alerts, bank-review |
| Revenue & Collections | invoicing, collections, credit-control, billing-audit, revenue-metrics |
| Spend & Payables | spend-analysis, supplier-review, purchase-approvals, payables, expense-audit |
| Pricing & Margin | pricing-model, margin-analysis, unit-economics, discount-review, cost-to-serve |
| People Finance | headcount-plan, payroll-check, comp-benchmark, commission-calc, people-cost |
| Fundraising & Investors | investor-update, pitch-financials, data-room, cap-table, diligence-prep |
| Tax & Controls | vat-prep, tax-calendar, controls-review, audit-prep, policy-check |
| Board & CFO Strategy | board-pack, management-accounts, cfo-briefing, investor-report, strategy-model |

## Ground rules every agent follows

- Works only from the data you provide and never invents figures.
- States its assumptions and workings, and ties totals back to source.
- Never posts entries, sends emails, makes payments or files returns. It prepares drafts for you to approve.
- Puts anything that looks like fraud, a control failure or a tax/legal risk at the top of its output.

Note: the agents support your finance work but are not professional accounting, tax or legal advice. A qualified person should review the outputs before you rely on them.
