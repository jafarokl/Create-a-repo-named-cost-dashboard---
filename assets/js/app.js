// Public site: renders featured items, topics and the searchable library from data/library.json.
const state = { data: null, q: '', cat: '', type: '', sort: 'new' };
const $ = (s) => document.querySelector(s);

document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = ICONS[el.dataset.icon]; });
$('.close-btn').innerHTML = ICONS.close;
$('#year').textContent = new Date().getFullYear();
initNav();

function badge(item) {
  const t = typeOf(item);
  return `<span class="type-badge" style="--tc:${t.color}">${ICONS[t.icon]}${t.label}</span>`;
}

function meta(item) {
  return `<div class="card-meta">
    ${item.minutes ? `<span>${ICONS.clock}${item.minutes} min</span>` : ''}
    ${item.level ? `<span>${ICONS.level}${esc(item.level)}</span>` : ''}
    ${item.date ? `<span>${ICONS.calendar}${fmtDate(item.date)}</span>` : ''}
  </div>`;
}

function card(item, featured = false) {
  const t = typeOf(item);
  const cat = state.data.categories.find((c) => c.id === item.category);
  return `<button class="card ${featured ? 'featured-card' : ''} reveal" style="--tc:${t.color}" data-open="${esc(item.id)}">
    ${featured ? `<div class="thumb">${ICONS[t.icon]}<span class="ext">${t.short}</span></div>` : ''}
    <div class="card-top">${badge(item)}${isNew(item.date) ? '<span class="new-pill">NEW</span>' : ''}</div>
    <h3>${esc(item.title)}</h3>
    <p>${esc(item.description)}</p>
    ${cat ? `<span class="tag" style="align-self:flex-start">${esc(cat.name)}</span>` : ''}
    ${meta(item)}
  </button>`;
}

function renderStats() {
  const { items, categories } = state.data;
  $('#stat-items').textContent = items.length;
  $('#stat-topics').textContent = categories.length;
  $('#stat-minutes').textContent = items.reduce((n, i) => n + (Number(i.minutes) || 0), 0);
  const latest = items.map((i) => i.date).filter(Boolean).sort().pop();
  if (latest) $('#updated-label').textContent = 'Library updated ' + fmtDate(latest);
}

function renderFeatured() {
  const sorted = [...state.data.items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const picks = sorted.filter((i) => i.featured).concat(sorted.filter((i) => !i.featured)).slice(0, 3);
  $('#featured').innerHTML = picks.map((i) => card(i, true)).join('');
}

function renderTopics() {
  const { items, categories } = state.data;
  $('#topics-grid').innerHTML = categories.map((c) => {
    const n = items.filter((i) => i.category === c.id).length;
    return `<button class="topic reveal" data-goto-cat="${esc(c.id)}">
      <span class="ico">${ICONS[c.icon] || ICONS.folder}</span>
      <strong>${esc(c.name)}</strong><span>${esc(c.blurb || '')}</span>
      <span class="count">${n} item${n === 1 ? '' : 's'} →</span>
    </button>`;
  }).join('');
}

function renderChips() {
  const chips = [{ id: '', name: 'All topics' }, ...state.data.categories];
  $('#chips').innerHTML = chips.map((c) =>
    `<button class="chip ${state.cat === c.id ? 'active' : ''}" data-cat="${esc(c.id)}">${esc(c.name)}</button>`).join('');
}

function renderLibrary() {
  const q = state.q.trim().toLowerCase();
  let list = state.data.items.filter((i) => {
    if (state.cat && i.category !== state.cat) return false;
    if (state.type && (i.type || 'other') !== state.type) return false;
    if (!q) return true;
    return [i.title, i.description, ...(i.tags || [])].join(' ').toLowerCase().includes(q);
  });
  const by = {
    new: (a, b) => (b.date || '').localeCompare(a.date || ''),
    old: (a, b) => (a.date || '').localeCompare(b.date || ''),
    az: (a, b) => a.title.localeCompare(b.title),
    short: (a, b) => (a.minutes || 999) - (b.minutes || 999),
  };
  list.sort(by[state.sort]);
  $('#result-count').textContent = `${list.length} of ${state.data.items.length} materials`;
  $('#lib-grid').innerHTML = list.length
    ? list.map((i) => card(i)).join('')
    : `<div class="empty" style="grid-column:1/-1"><strong>Nothing here yet.</strong><br>Try a different search or topic — new material is added regularly.</div>`;
  observe();
}

// ---------- Viewer ----------
function absUrl(path) { return new URL(path, location.href).href; }
function isPublicHost() { return location.protocol.startsWith('http') && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname); }

function youTubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m && m[1];
}

function stageFor(item) {
  const src = item.file ? absUrl(item.file) : item.url;
  const t = item.type;
  const placeholder = (msg) => `<div class="placeholder"><div>${ICONS[typeOf(item).icon]}<p>${msg}</p></div></div>`;
  if (t === 'pdf') return `<iframe src="${esc(src)}#view=FitH" title="${esc(item.title)}"></iframe>`;
  if (t === 'image') return `<img src="${esc(src)}" alt="${esc(item.title)}">`;
  if (t === 'video') {
    const yt = youTubeId(src);
    return yt
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(item.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<video src="${esc(src)}" controls playsinline></video>`;
  }
  if (['pptx', 'xlsx', 'docx'].includes(t) && item.file) {
    if (!isPublicHost()) return placeholder('Live previews of Office files appear once the site is published online.<br>Use “Download” to open it now.');
    return `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}" title="${esc(item.title)}"></iframe>`;
  }
  if (t === 'link') return placeholder('This resource lives on another website.<br>Use “Open resource” to view it in a new tab.');
  return placeholder('Preview isn’t available for this format.<br>Use “Download” to open it.');
}

function openItem(id) {
  const item = state.data.items.find((i) => i.id === id);
  if (!item) return;
  const cat = state.data.categories.find((c) => c.id === item.category);
  const href = item.file || item.url;
  $('#v-stage').innerHTML = stageFor(item);
  $('#v-badge').innerHTML = badge(item);
  $('#v-badge').firstElementChild.style.alignSelf = 'flex-start';
  $('#v-title').textContent = item.title;
  $('#v-desc').textContent = item.description || '';
  $('#v-meta').innerHTML = [
    ['Topic', cat && cat.name], ['Level', item.level], ['Time', item.minutes && item.minutes + ' min'], ['Added', fmtDate(item.date)],
  ].filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
  $('#v-tags').innerHTML = (item.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join('');
  $('#v-note').textContent = ['pptx', 'xlsx', 'docx'].includes(item.type) && isPublicHost()
    ? 'Preview powered by Microsoft Office Online. If it doesn’t load, download the file instead.' : '';
  $('#v-actions').innerHTML = item.type === 'link'
    ? `<a class="btn btn-primary" href="${esc(href)}" target="_blank" rel="noopener">${ICONS.external}Open resource</a>`
    : `<a class="btn btn-primary" href="${esc(href)}" download>${ICONS.download}Download</a>
       <a class="btn btn-ghost" href="${esc(href)}" target="_blank" rel="noopener">${ICONS.external}Open in new tab</a>`;
  $('#viewer').classList.add('open');
  document.body.style.overflow = 'hidden';
  history.replaceState(null, '', '#item=' + encodeURIComponent(id));
}

function closeViewer() {
  $('#viewer').classList.remove('open');
  $('#v-stage').innerHTML = '';
  document.body.style.overflow = '';
  if (location.hash.startsWith('#item=')) history.replaceState(null, '', location.pathname + location.search);
}

// ---------- Events ----------
document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]');
  if (open) return openItem(open.dataset.open);
  const goto = e.target.closest('[data-goto-cat]');
  if (goto) {
    state.cat = state.data.categories.some((c) => c.id === goto.dataset.gotoCat) ? goto.dataset.gotoCat : '';
    renderChips(); renderLibrary();
    return $('#library').scrollIntoView();
  }
  const chip = e.target.closest('[data-cat]');
  if (chip) { state.cat = chip.dataset.cat; renderChips(); renderLibrary(); }
  if (e.target.closest('[data-close]')) closeViewer();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
$('#q').addEventListener('input', (e) => { state.q = e.target.value; renderLibrary(); });
$('#type-filter').addEventListener('change', (e) => { state.type = e.target.value; renderLibrary(); });
$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderLibrary(); });
$('#hero-search').addEventListener('submit', (e) => {
  e.preventDefault();
  state.q = $('#hero-q').value; $('#q').value = state.q; state.cat = '';
  renderChips(); renderLibrary(); $('#library').scrollIntoView();
});
$('#subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = state.data?.site?.contactEmail || '';
  location.href = `mailto:${email}?subject=${encodeURIComponent('Subscribe me to updates')}&body=${encodeURIComponent('Please add ' + $('#email').value + ' to the update list.')}`;
});

// Fade-in on scroll
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.08 })
  : null;
function observe() { document.querySelectorAll('.reveal:not(.in)').forEach((el) => (io ? io.observe(el) : el.classList.add('in'))); }

// ---------- Boot ----------
loadLibrary().then((data) => {
  state.data = data;
  if (data.site?.name) {
    document.querySelectorAll('[data-site-name]').forEach((el) => (el.textContent = data.site.name));
    document.title = data.site.name;
  }
  if (data.site?.contactEmail) $('#contact-link').href = 'mailto:' + data.site.contactEmail;
  renderStats(); renderFeatured(); renderTopics(); renderChips(); renderLibrary();
  const m = location.hash.match(/^#item=(.+)$/);
  if (m) openItem(decodeURIComponent(m[1]));
}).catch((err) => {
  console.error(err);
  $('#lib-grid').innerHTML = `<div class="empty" style="grid-column:1/-1"><strong>Couldn’t load the library.</strong><br>${esc(err.message)}<br><small>Tip: open the site through a web server (e.g. GitHub Pages or <code>python3 -m http.server</code>), not by double-clicking the file.</small></div>`;
  observe();
});
