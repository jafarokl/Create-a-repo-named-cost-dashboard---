# Applied AI Academy — learning hub (draft)

A website where business owners and professionals learn practical AI quickly. Visitors can browse by topic, search, open a sales page for each material with a sneak-peek preview, and then download it (free) or buy it (paid).

You add new material yourself from the built-in **Upload Studio** (`admin.html`). Nothing to install and no coding needed.

## Pages

| Page | What it is |
| --- | --- |
| `index.html` | Public site: hero, featured items, topics, searchable library (filter by topic, format, free/paid), learning paths, sign-up box |
| `item.html#<id>` | A sales page for each material: watermarked sneak-peek gallery, price and Buy button, what's inside, who it's for, how people use it, benefits, FAQ, related items |
| `admin.html` | Upload Studio: upload files or add links, create new topics, remove items |
| `data/library.json` | The list of all materials and topics. The site reads it, and the Upload Studio updates it |
| `materials/` | Files for **free** materials |
| `previews/` | Watermarked preview images shown on the sales pages |
| `tools/make_previews.py` | Turns a PowerPoint/Excel/Word/PDF file into watermarked preview images |

## 1. Put the site online (GitHub Pages, free)

1. On GitHub open this repository → **Settings → Pages**.
2. Under *Build and deployment* pick **Deploy from a branch**, choose your branch (e.g. `main`) and folder `/ (root)`, then **Save**.
3. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

For free PowerPoint, Excel and Word files, the "Read it online" button uses Microsoft's free online viewer, so it only works once the site is online.

## 2. Upload new material (any time)

1. Open `https://<your-site>/admin.html`. There's also an **Admin** link in the footer.
2. First time only: create a GitHub token:
   GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate →
   *Only select repositories* → this repo → Permissions → **Contents: Read and write**.
3. Paste the token in **Connect to GitHub**. On GitHub Pages, owner and repo are filled in for you.
4. Drop a file (or paste a link / YouTube URL), give it a title, topic, level and tags, then click **Publish to site**.
5. The new item appears on the site within 1–2 minutes and is marked **NEW** for two weeks.

You can add unrelated material too: choose **General Resources**, or pick **+ Create a new topic…**.

Files over ~50 MB, such as long videos, are better uploaded to YouTube or Google Drive and added as a link.

### Alternative: upload directly on GitHub
Upload the file into `materials/` on github.com, then add an entry to `data/library.json`:

```json
{
  "id": "unique-id",
  "title": "Title shown on the card",
  "description": "One or two sentences.",
  "category": "prompting",
  "type": "pptx",
  "file": "materials/your-file.pptx",
  "tags": ["prompts", "beginner"],
  "level": "Beginner",
  "minutes": 10,
  "date": "2026-10-17",
  "featured": false
}
```

`type` is one of `pptx`, `xlsx`, `docx`, `pdf`, `video`, `image`, `link` or `other`. For links, use `"url": "https://…"` instead of `file`.

## 3. Sell materials

Each material has its own sales page, so you can share a direct link (for example on LinkedIn or in an email). In the Upload Studio, under **Selling** and **Sales page**:

- **Price:** `0` makes it free (visitors download it straight away). Anything above 0 shows a price and a **Buy** button.
- **Buy link:** create a product with a payment provider such as [Gumroad](https://gumroad.com), [Lemon Squeezy](https://lemonsqueezy.com) or [Stripe Payment Links](https://stripe.com/payments/payment-links), upload the **full file there**, and paste its link. The provider takes the payment and emails the file to the buyer. Without a Buy link, the button opens an email to you so you can sell by invoice.
- **Preview images:** add 2–5 screenshots of your best slides or pages. They appear in the sneak-peek gallery.
- **Headline, What's inside, Who it's for, How people use it, Why it's worth it:** the sales copy shown on the page.

> **Important:** for paid items, don't upload the full file to this site. Everything in a public GitHub repository can be downloaded by anyone. Upload only the preview images here and keep the full file with your payment provider.

To make watermarked previews automatically from a file (needs LibreOffice and poppler installed):

```bash
python3 tools/make_previews.py path/to/deck.pptx my-item-id 5
```

The FAQ, the reassurance lines under the Buy button (`trust`) and the currency are set in the `site` block of `data/library.json`. The sample prices, FAQ and "14-day satisfaction promise" are placeholders, so set them to match how you actually sell.

## Customise

- **Name, tagline and contact email:** the `site` block at the top of `data/library.json`.
- **Topics:** the `categories` list in the same file. Available icons: `spark`, `bolt`, `chat`, `target`, `chart`, `flow`, `compass`, `folder`.
- **Colours and fonts:** the variables at the top of `assets/css/style.css`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The sample materials, prices and sales copy are placeholders. Replace or delete them whenever you like.
