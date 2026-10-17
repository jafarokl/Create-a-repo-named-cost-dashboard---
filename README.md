# Applied AI Academy — learning hub (draft)

A website where business owners and professionals learn practical AI quickly. Visitors can browse by topic, search, and preview PowerPoint, Excel, Word, PDF, image and video material right in the browser, or download it.

You add new material yourself from the built-in **Upload Studio** (`admin.html`). Nothing to install and no coding needed.

## Pages

| Page | What it is |
| --- | --- |
| `index.html` | Public site: hero, featured items, topics, searchable library with in-browser preview, learning paths, sign-up box |
| `admin.html` | Upload Studio: upload files or add links, create new topics, remove items |
| `data/library.json` | The list of all materials and topics. The site reads it, and the Upload Studio updates it |
| `materials/` | The uploaded files themselves |

## 1. Put the site online (GitHub Pages, free)

1. On GitHub open this repository → **Settings → Pages**.
2. Under *Build and deployment* pick **Deploy from a branch**, choose your branch (e.g. `main`) and folder `/ (root)`, then **Save**.
3. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

Office previews (PowerPoint/Excel/Word) use Microsoft's free online viewer, so they only work once the site is online. Running it locally shows a "Download" button instead.

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

## Customise

- **Name, tagline and contact email:** the `site` block at the top of `data/library.json`.
- **Topics:** the `categories` list in the same file. Available icons: `spark`, `bolt`, `chat`, `target`, `chart`, `flow`, `compass`, `folder`.
- **Colours and fonts:** the variables at the top of `assets/css/style.css`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The sample materials in `materials/` are placeholders. Replace or delete them whenever you like.
