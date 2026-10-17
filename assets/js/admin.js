// Upload Studio: commits files to materials/ and updates data/library.json through the GitHub Contents API.
const $ = (s) => document.querySelector(s);
const LIB_PATH = 'data/library.json';
let mode = 'file';
let pickedFile = null;
let library = null;

document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = ICONS[el.dataset.icon]; });
initNav();

// ---------- Settings ----------
const store = {
  get(k) { try { return sessionStorage.getItem(k) ?? localStorage.getItem(k); } catch { return null; } },
  set(k, v, persist) {
    try {
      (persist ? localStorage : sessionStorage).setItem(k, v);
      if (!persist) localStorage.removeItem(k);
    } catch { /* storage unavailable: settings last for this page only */ }
  },
};
const cfg = () => ({ owner: $('#owner').value.trim(), repo: $('#repo').value.trim(), branch: $('#branch').value.trim() || 'main', token: $('#token').value.trim() });

function prefill() {
  // On GitHub Pages (user.github.io/repo) we can guess owner and repo.
  const gh = location.hostname.match(/^([^.]+)\.github\.io$/i);
  $('#owner').value = store.get('aia.owner') || (gh ? gh[1] : '');
  $('#repo').value = store.get('aia.repo') || (gh ? (location.pathname.split('/')[1] || `${gh[1]}.github.io`) : '');
  $('#branch').value = store.get('aia.branch') || 'main';
  $('#token').value = store.get('aia.token') || '';
  $('#remember').checked = !!(() => { try { return localStorage.getItem('aia.token'); } catch { return null; } })();
}

function showStatus(el, kind, msg) {
  el.className = 'status show ' + kind;
  el.innerHTML = msg;
}

// ---------- GitHub API ----------
async function gh(path, opts = {}) {
  const { owner, repo, token } = cfg();
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...opts,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(opts.headers || {}) },
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message; } catch { /* no body */ }
    const err = new Error(`GitHub ${res.status}: ${detail || res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

const b64FromText = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const textFromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));
const b64FromFile = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.onerror = () => reject(r.error);
  r.readAsDataURL(file);
});

async function fetchLibrary() {
  const { branch } = cfg();
  const f = await gh(`/contents/${LIB_PATH}?ref=${encodeURIComponent(branch)}`);
  return { sha: f.sha, data: JSON.parse(textFromB64(f.content)) };
}

async function putFile(path, contentB64, message, sha) {
  const { branch } = cfg();
  return gh(`/contents/${path.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: contentB64, branch, ...(sha ? { sha } : {}) }),
  });
}

// Read-modify-write library.json, retrying once if someone else changed it meanwhile.
async function updateLibrary(mutate, message) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { sha, data } = await fetchLibrary();
    mutate(data);
    try {
      await putFile(LIB_PATH, b64FromText(JSON.stringify(data, null, 2) + '\n'), message, sha);
      return data;
    } catch (e) {
      if (e.status !== 409 || attempt) throw e;
    }
  }
}

// ---------- UI ----------
function renderCategories() {
  const sel = $('#category');
  const current = sel.value;
  sel.innerHTML = library.categories.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')
    + '<option value="__new">+ Create a new topic…</option>';
  if (current && [...sel.options].some((o) => o.value === current)) sel.value = current;
  $('#new-cat-wrap').hidden = sel.value !== '__new';
}

function renderManage(connected) {
  const items = [...library.items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  $('#manage-hint').textContent = connected ? `${items.length} items live on the site.` : 'Connect to GitHub to manage items. Showing the current site library.';
  $('#manage-list').innerHTML = items.map((i) => {
    const t = typeOf(i);
    return `<div class="manage-item">
      <span class="type-badge" style="--tc:${t.color}">${ICONS[t.icon]}</span>
      <div class="grow"><strong>${esc(i.title)}</strong><small>${fmtDate(i.date)} · ${esc(t.label)}</small></div>
      ${connected ? `<button class="icon-btn" title="Remove from site" data-del="${esc(i.id)}">${ICONS.trash}</button>` : ''}
    </div>`;
  }).join('');
}

document.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
  mode = b.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('on', x === b));
  $('#file-block').hidden = mode !== 'file';
  $('#link-block').hidden = mode !== 'link';
}));

$('#category').addEventListener('change', () => { $('#new-cat-wrap').hidden = $('#category').value !== '__new'; });

const drop = $('#drop');
function pick(file) {
  if (!file) return;
  pickedFile = file;
  $('#file-name').textContent = `${file.name} · ${(file.size / 1048576).toFixed(1)} MB`;
  if (!$('#title').value) $('#title').value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
}
drop.addEventListener('click', () => $('#file').click());
drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#file').click(); } });
$('#file').addEventListener('change', (e) => pick(e.target.files[0]));
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('drag'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('drag'); }));
drop.addEventListener('drop', (e) => pick(e.dataTransfer.files[0]));

$('#settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const c = cfg(); const persist = $('#remember').checked;
  store.set('aia.owner', c.owner, true); store.set('aia.repo', c.repo, true); store.set('aia.branch', c.branch, true);
  store.set('aia.token', c.token, persist);
  await connect(true);
});

async function connect(verbose) {
  const el = $('#conn-status');
  if (!cfg().token) return false;
  try {
    showStatus(el, 'info', 'Connecting…');
    library = (await fetchLibrary()).data;
    renderCategories(); renderManage(true);
    if (verbose) showStatus(el, 'ok', `Connected to <strong>${esc(cfg().owner)}/${esc(cfg().repo)}</strong>. You’re ready to upload.`);
    else el.className = 'status';
    return true;
  } catch (err) {
    showStatus(el, 'err', esc(err.message) + (err.status === 404 ? ' — check owner, repo, branch and token access.' : ''));
    return false;
  }
}

$('#upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const st = $('#status'); const btn = $('#submit-btn');
  if (!cfg().token) return showStatus(st, 'err', 'Connect to GitHub first (panel on the right).');
  if (mode === 'file' && !pickedFile) return showStatus(st, 'err', 'Choose a file to upload.');
  if (mode === 'link' && !$('#url').value.trim()) return showStatus(st, 'err', 'Paste the link URL.');
  if (mode === 'file' && pickedFile.size > 50 * 1048576) return showStatus(st, 'err', 'That file is over 50 MB. Upload it to YouTube / Google Drive and add it as a link instead.');

  const title = $('#title').value.trim();
  const today = new Date().toISOString().slice(0, 10);
  const id = `${slugify(title)}-${Date.now().toString(36)}`;
  let category = $('#category').value;
  const newCatName = $('#new-cat').value.trim();
  if (category === '__new') {
    if (!newCatName) return showStatus(st, 'err', 'Give the new topic a name.');
    category = slugify(newCatName);
  }

  btn.disabled = true;
  try {
    const item = {
      id, title,
      description: $('#description').value.trim(),
      category,
      tags: $('#tags').value.split(',').map((t) => t.trim()).filter(Boolean),
      level: $('#level').value,
      minutes: Number($('#minutes').value) || undefined,
      date: today,
      featured: $('#featured').checked || undefined,
    };
    if (mode === 'file') {
      const ext = (pickedFile.name.match(/\.([^.]+)$/) || [, ''])[1].toLowerCase();
      const path = `materials/${today}-${slugify(title)}${ext ? '.' + ext : ''}`;
      showStatus(st, 'info', `Uploading <strong>${esc(pickedFile.name)}</strong>…`);
      await putFile(path, await b64FromFile(pickedFile), `Add material: ${title}`);
      item.type = typeFromName(pickedFile.name);
      item.file = path;
    } else {
      const url = $('#url').value.trim();
      item.url = url;
      item.type = /youtu\.?be|vimeo\.com|\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'video' : 'link';
    }
    showStatus(st, 'info', 'Updating the library…');
    library = await updateLibrary((data) => {
      if (!data.categories.some((c) => c.id === category)) {
        data.categories.push({ id: category, name: newCatName || category, icon: 'folder', blurb: '' });
      }
      data.items.push(item);
    }, `Library: add “${title}”`);
    renderCategories(); renderManage(true);
    $('#category').value = category; $('#new-cat-wrap').hidden = true; $('#new-cat').value = '';
    showStatus(st, 'ok', `Published! <strong>${esc(title)}</strong> will appear on the site in about 1–2 minutes. <a href="index.html#item=${encodeURIComponent(id)}">View it</a>`);
    $('#upload-form').querySelectorAll('#title, #description, #tags, #url').forEach((el) => (el.value = ''));
    $('#featured').checked = false; pickedFile = null; $('#file').value = ''; $('#file-name').textContent = '';
  } catch (err) {
    showStatus(st, 'err', 'Upload failed: ' + esc(err.message));
  } finally {
    btn.disabled = false;
  }
});

$('#manage-list').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-del]');
  if (!b) return;
  const item = library.items.find((i) => i.id === b.dataset.del);
  if (!item || !confirm(`Remove “${item.title}” from the site?${item.file ? ' The file will be deleted too.' : ''}`)) return;
  b.disabled = true;
  try {
    library = await updateLibrary((data) => { data.items = data.items.filter((i) => i.id !== item.id); }, `Library: remove “${item.title}”`);
    if (item.file) {
      const { branch } = cfg();
      const enc = item.file.split('/').map(encodeURIComponent).join('/');
      try {
        const meta = await gh(`/contents/${enc}?ref=${encodeURIComponent(branch)}`);
        await gh(`/contents/${enc}`, { method: 'DELETE', body: JSON.stringify({ message: `Remove material: ${item.title}`, sha: meta.sha, branch }) });
      } catch (err) {
        if (err.status !== 404) throw err;
      }
    }
    renderManage(true);
  } catch (err) {
    alert('Could not remove: ' + err.message);
    b.disabled = false;
  }
});

// ---------- Boot ----------
prefill();
loadLibrary().then((data) => {
  library = data;
  if (data.site?.name) document.querySelectorAll('[data-site-name]').forEach((el) => (el.textContent = data.site.name));
  renderCategories(); renderManage(false);
}).catch(() => {
  library = { categories: [{ id: 'general', name: 'General Resources', icon: 'folder' }], items: [] };
  renderCategories(); renderManage(false);
}).then(() => connect(false));
