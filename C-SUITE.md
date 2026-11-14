# Your AI C-Suite — 12 systems, 4 heads

Twelve practical systems that run on **your own business data**, organised as four executive "heads" inside Claude Code.

| Head | Motto | Systems | Slash commands |
|---|---|---|---|
| **CFO** (`cfo` agent) | Know your money | 01 Monthly Money Brief · 02 Cash Forecast · 03 Deal Check | `/monthly-money-brief` `/cash-forecast` `/deal-check` |
| **CMO** (`cmo` agent) | Understand and reach customers | 04 Customer Read · 05 Voice Engine · 06 Month Plan | `/customer-read` `/voice-engine` `/month-plan` |
| **CTO** (`cto` agent) | Make tools work for you | 07 Tech Translator · 08 Connected Desk · 09 Process Book | `/tech-translator` `/connected-desk` `/process-book` |
| **CEO** (`ceo` agent) | Prepare your next decision | 10 Decision Brief · 11 Devil's Advocate · 12 Monday Review | `/decision-brief` `/devils-advocate` `/monday-review` |

## How to use

1. **Fill in your data** (once): start with `business-data/company-profile.md`, then the CSV templates in `business-data/finance/` and `business-data/customers/`, your writing in `business-data/voice/voice-samples.md`, and your software in `business-data/tools/tool-stack.md`. No data yet? Just paste numbers into the chat — the heads will work with that.
2. **Talk to a head** in Claude Code (open this repo):
   - "Ask the **CFO**: how did we do in October?"
   - "**CMO**, write a follow-up email to a client who went quiet."
   - "**CTO**, is this HubSpot quote worth it?" (attach the quote)
   - "**CEO**, should I hire a second salesperson?"
3. **Or run a system directly** with its slash command, e.g. `/monday-review`.
4. Reports are saved in `outputs/<head>/` so the next run (and the CEO) can build on them.

## Suggested rhythm
- **Daily:** `/connected-desk`
- **Monday:** `/monday-review`
- **Start of month:** `/monthly-money-brief` → `/cash-forecast` → `/customer-read` → `/month-plan`
- **When it comes up:** `/deal-check`, `/tech-translator`, `/voice-engine`, `/process-book`, `/decision-brief`, `/devils-advocate`

## Files
```
.claude/agents/      cfo.md  cmo.md  cto.md  ceo.md        ← the four heads
.claude/skills/      12 folders, one SKILL.md per system    ← the playbooks
business-data/       your data (templates to fill in)
outputs/             finished reports, by head
```

**Privacy:** `business-data/` holds real company numbers. If this GitHub repository is public, make the repo private (Settings → General → Danger Zone → Change visibility) before committing real data.
