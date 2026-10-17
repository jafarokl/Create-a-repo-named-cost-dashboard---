// Shared helpers used by the public site and the admin page.
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

const ICONS = {
  spark: svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>'),
  bolt: svg('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  chat: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  chart: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  flow: svg('<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M9 6h4a3 3 0 0 1 3 3v6"/>'),
  compass: svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
  level: svg('<path d="M4 20V14M10 20V9M16 20V4M22 20H2"/>'),
  download: svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  external: svg('<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  upload: svg('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'),
  slides: svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>'),
  sheet: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),
  doc: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  play: svg('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>'),
  image: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
};

const TYPES = {
  pptx: { label: 'PowerPoint', short: 'PPT', icon: 'slides', color: 'var(--t-pptx)' },
  xlsx: { label: 'Excel', short: 'XLS', icon: 'sheet', color: 'var(--t-xlsx)' },
  docx: { label: 'Word', short: 'DOC', icon: 'doc', color: 'var(--t-docx)' },
  pdf: { label: 'PDF', short: 'PDF', icon: 'file', color: 'var(--t-pdf)' },
  video: { label: 'Video', short: 'VID', icon: 'play', color: 'var(--t-video)' },
  image: { label: 'Image', short: 'IMG', icon: 'image', color: 'var(--t-image)' },
  link: { label: 'Link', short: 'URL', icon: 'link', color: 'var(--t-link)' },
  other: { label: 'File', short: 'FILE', icon: 'file', color: 'var(--t-other)' },
};

// Map a filename extension to one of the TYPES keys.
function typeFromName(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) return 'pptx';
  if (['xls', 'xlsx', 'xlsm', 'csv', 'ods'].includes(ext)) return 'xlsx';
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(ext)) return 'docx';
  if (ext === 'pdf') return 'pdf';
  if (['mp4', 'webm', 'mov', 'm4v'].includes(ext)) return 'video';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  return 'other';
}

function typeOf(item) { return TYPES[item.type] || TYPES.other; }

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item';
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function isNew(iso, days = 14) {
  const d = new Date(iso + 'T00:00:00');
  return !isNaN(d) && (Date.now() - d.getTime()) / 864e5 <= days;
}

async function loadLibrary() {
  const res = await fetch('data/library.json?v=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load data/library.json (' + res.status + ')');
  return res.json();
}

function initNav() {
  const btn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.innerHTML = ICONS.menu;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
}
