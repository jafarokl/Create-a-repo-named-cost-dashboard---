// Product page: a sales-style page for one material, chosen by the #id in the URL.
const $ = (s) => document.querySelector(s);
let data = null;
let item = null;
let shot = 0;

document.querySelectorAll('.close-btn').forEach((b) => (b.innerHTML = ICONS.close));
$('.lb-nav.prev').innerHTML = ICONS.left;
$('.lb-nav.next').innerHTML = ICONS.right;
$('#year').textContent = new Date().getFullYear();
initNav();

function currentId() {
  const fromHash = decodeURIComponent(location.hash.slice(1));
  return fromHash || new URLSearchParams(location.search).get('id') || '';
}

function actionButton(a, cls = 'btn btn-primary') {
  const attrs = a.external ? ' target="_blank" rel="noopener"' : a.download ? ' download' : '';
  const icon = a.download ? ICONS.download : a.external && !isPaid(item) ? ICONS.external : '';
  return `<a class="${cls}" href="${esc(a.href)}"${attrs}>${icon}${esc(a.label)}</a>`;
}

function officeViewerUrl(path) {
  return 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(new URL(path, location.href).href);
}

function renderGallery() {
  const shots = item.previews || [];
  const t = typeOf(item);
  if (!shots.length) {
    $('#gallery').innerHTML = `<div class="g-main empty-shot" style="--tc:${t.color}">${ICONS[t.icon]}<span>${esc(t.label)}</span></div>`;
    return;
  }
  $('#gallery').innerHTML = `
    <button class="g-main ${['pdf', 'docx'].includes(item.type) ? 'doc' : ''}" id="g-main" aria-label="Enlarge preview">
      <img id="g-img" src="${esc(shots[shot])}" alt="Preview ${shot + 1} of ${esc(item.title)}">
      <span class="g-zoom">${ICONS.eye} Click to enlarge</span>
    </button>
    <div class="g-bar">
      <span class="g-count">Preview ${shot + 1} of ${shots.length}${item.length ? ` · full file: ${esc(item.length)}` : ''}</span>
      ${shots.length > 1 ? `<span class="g-arrows"><button class="icon-btn" data-step="-1" aria-label="Previous">${ICONS.left}</button><button class="icon-btn" data-step="1" aria-label="Next">${ICONS.right}</button></span>` : ''}
    </div>
    ${shots.length > 1 ? `<div class="g-thumbs">${shots.map((s, i) => `<button class="g-thumb ${i === shot ? 'on' : ''}" data-shot="${i}" aria-label="Show preview ${i + 1}"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}`;
}

function setShot(i) {
  const n = (item.previews || []).length;
  if (!n) return;
  shot = (i + n) % n;
  renderGallery();
  if ($('#lightbox').classList.contains('open')) $('#lb-img').src = item.previews[shot];
}

function render() {
  const site = data.site || {};
  const t = typeOf(item);
  const cat = data.categories.find((c) => c.id === item.category);
  const paid = isPaid(item);
  const action = primaryAction(item, site);
  document.title = `${item.title} · ${site.name || 'Applied AI Academy'}`;

  $('#crumb').textContent = `← ${cat ? cat.name : 'Library'}`;
  $('#crumb').href = './#library';
  $('#p-badges').innerHTML = `<span class="type-badge" style="--tc:${t.color}">${ICONS[t.icon]}${t.label}</span>
    ${isNew(item.date) ? '<span class="new-pill">NEW</span>' : ''}
    ${item.featured ? '<span class="tag on-dark">Editor’s pick</span>' : ''}`;
  $('#p-title').textContent = item.title;
  $('#p-headline').textContent = item.headline || item.description || '';
  $('#p-meta').innerHTML = [
    item.level && `${ICONS.level}${esc(item.level)}`,
    item.minutes && `${ICONS.clock}${item.minutes} min`,
    item.length && `${ICONS[t.icon]}${esc(item.length)}`,
    item.date && `${ICONS.calendar}Updated ${fmtDate(item.date)}`,
  ].filter(Boolean).map((m) => `<span>${m}</span>`).join('');

  const extra = !paid && item.file
    ? (['pptx', 'xlsx', 'docx'].includes(item.type)
      ? `<a class="btn btn-glass" href="${esc(officeViewerUrl(item.file))}" target="_blank" rel="noopener">${ICONS.eye}Read it online</a>`
      : `<a class="btn btn-glass" href="${esc(item.file)}" target="_blank" rel="noopener">${ICONS.eye}Read it now</a>`)
    : '';
  $('#buy-box').innerHTML = `
    <div class="price-row"><span class="price">${priceLabel(item, site.currency)}</span>${paid ? '<span class="price-note">one-time · instant download</span>' : '<span class="price-note">no sign-up needed</span>'}</div>
    <div class="buy-actions">${actionButton(action)}${extra}</div>
    <ul class="trust">
      ${(paid ? site.trust || [] : ['Free forever', 'Share it with your team']).map((t, i) => `<li>${[ICONS.shield, ICONS.edit, ICONS.check][i % 3]}${esc(t)}</li>`).join('')}
    </ul>`;
  $('#buy-bar').innerHTML = `<div><strong>${esc(item.title)}</strong><span>${priceLabel(item, site.currency)}</span></div>${actionButton(action, 'btn btn-primary btn-sm')}`;

  renderGallery();

  const list = (arr, fn) => (arr || []).map(fn).join('');
  $('#p-inside').innerHTML = list(item.inside, (x) => `<li>${ICONS.check}<span>${esc(x)}</span></li>`) || `<li>${ICONS.check}<span>${esc(item.description)}</span></li>`;
  $('#p-audience').innerHTML = list(item.audience, (x) => `<div class="aud">${ICONS.user}<span>${esc(x)}</span></div>`);
  $('#p-desc').textContent = item.description || '';

  $('#usage-wrap').hidden = !(item.useCases || []).length;
  $('#p-uses').innerHTML = list(item.useCases, (u) => `<div class="use"><h3>${esc(u.title)}</h3><p>${esc(u.text)}</p></div>`);

  $('#benefits-wrap').hidden = !(item.benefits || []).length;
  $('#p-benefits').innerHTML = list(item.benefits, (b) => `<li>${ICONS.check}<span>${esc(b)}</span></li>`);
  $('#buy-repeat').innerHTML = actionButton(action, 'btn btn-light');

  $('#faq-wrap').hidden = !paid || !(site.faq || []).length;
  $('#p-faq').innerHTML = list(site.faq, (f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`);

  const related = data.items.filter((i) => i.id !== item.id)
    .sort((a, b) => (b.category === item.category) - (a.category === item.category) || (b.date || '').localeCompare(a.date || ''))
    .slice(0, 3);
  $('#related-wrap').hidden = !related.length;
  $('#p-related').innerHTML = related.map((i) => renderCard(i, data)).join('');
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

function notFound() {
  $('#p-title').textContent = 'We couldn’t find that material';
  $('#p-headline').innerHTML = 'It may have been moved or removed. <a href="./#library" style="color:#fff">Browse the library</a>.';
  ['usage-wrap', 'benefits-wrap', 'faq-wrap', 'related-wrap'].forEach((id) => ($('#' + id).hidden = true));
  document.querySelector('.p-section').hidden = true;
}

// ---------- Events ----------
document.addEventListener('click', (e) => {
  const step = e.target.closest('[data-step]');
  if (step) return setShot(shot + Number(step.dataset.step));
  const th = e.target.closest('[data-shot]');
  if (th) return setShot(Number(th.dataset.shot));
  if (e.target.closest('#g-main')) {
    $('#lb-img').src = item.previews[shot];
    document.querySelectorAll('.lb-nav').forEach((b) => (b.hidden = item.previews.length < 2));
    $('#lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
    return;
  }
  const lb = e.target.closest('[data-lb]');
  if (lb) return setShot(shot + Number(lb.dataset.lb));
  if (e.target.closest('[data-lb-close]') || e.target.id === 'lightbox') closeLightbox();
});
function closeLightbox() { $('#lightbox').classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', (e) => {
  if (!$('#lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') setShot(shot + 1);
  if (e.key === 'ArrowLeft') setShot(shot - 1);
});
window.addEventListener('hashchange', boot);
// Show the mobile buy bar once the main buy box scrolls out of view.
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => $('#buy-bar').classList.toggle('show', !en.isIntersecting && !!item))
    .observe($('#buy-box'));
}

function boot() {
  const go = () => {
    item = data.items.find((i) => i.id === currentId());
    shot = 0;
    if (!item) return notFound();
    render();
    window.scrollTo(0, 0);
  };
  if (data) return go();
  loadLibrary().then((d) => {
    data = d;
    if (d.site?.name) document.querySelectorAll('[data-site-name]').forEach((el) => (el.textContent = d.site.name));
    if (d.site?.contactEmail) $('#contact-link').href = 'mailto:' + d.site.contactEmail;
    go();
  }).catch((err) => {
    $('#p-title').textContent = 'Couldn’t load the library';
    $('#p-headline').textContent = err.message;
  });
}
boot();
