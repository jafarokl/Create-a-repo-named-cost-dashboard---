// Public site: renders featured items, topics and the searchable library from data/library.json.
const state = { data: null, q: '', cat: '', type: '', price: '', sort: 'new' };
const $ = (s) => document.querySelector(s);

document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = ICONS[el.dataset.icon]; });
$('#year').textContent = new Date().getFullYear();
initNav();

const card = (item, featured = false) => renderCard(item, state.data, featured);

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
    if (state.price && (state.price === 'paid') !== isPaid(i)) return false;
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

// ---------- Events ----------
document.addEventListener('click', (e) => {
  const goto = e.target.closest('[data-goto-cat]');
  if (goto) {
    state.cat = state.data.categories.some((c) => c.id === goto.dataset.gotoCat) ? goto.dataset.gotoCat : '';
    renderChips(); renderLibrary();
    return $('#library').scrollIntoView();
  }
  const chip = e.target.closest('[data-cat]');
  if (chip) { state.cat = chip.dataset.cat; renderChips(); renderLibrary(); }
});
$('#q').addEventListener('input', (e) => { state.q = e.target.value; renderLibrary(); });
$('#type-filter').addEventListener('change', (e) => { state.type = e.target.value; renderLibrary(); });
$('#price-filter').addEventListener('change', (e) => { state.price = e.target.value; renderLibrary(); });
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
  // Older links used index.html#item=<id>; send them to the product page.
  const m = location.hash.match(/^#item=(.+)$/);
  if (m) location.replace('item.html#' + m[1]);
}).catch((err) => {
  console.error(err);
  $('#lib-grid').innerHTML = `<div class="empty" style="grid-column:1/-1"><strong>Couldn’t load the library.</strong><br>${esc(err.message)}<br><small>Tip: open the site through a web server (e.g. GitHub Pages or <code>python3 -m http.server</code>), not by double-clicking the file.</small></div>`;
  observe();
});
