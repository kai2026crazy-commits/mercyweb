const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();

const menuToggle = $('#menuToggle'), nav = $('#nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), {threshold: .12});
$$('.reveal').forEach(el => revealObserver.observe(el));

const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

$$('[data-placeholder]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); showToast('Replace this sample link with your real download URL.');
}));

// Live Java server status via the public mcsrvstat.us API.
$('#statusForm').addEventListener('submit', async e => {
  e.preventDefault();
  const address = $('#serverAddress').value.trim();
  if (!address) return showToast('Enter a Minecraft server address first.');
  const panel = $('#statusResult');
  panel.classList.remove('online', 'offline');
  $('#statusState'); // harmless no-op: state label is selected below
  $('.status-state').textContent = 'CHECKING SERVER…';
  $('#serverName').textContent = address;
  $('#playerCount').textContent = 'Fetching live status';
  $('#statusFoot').textContent = 'Please wait';
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error('Status service returned an error.');
    const data = await response.json();
    if (data.online) {
      panel.classList.add('online');
      $('.status-state').textContent = '● SERVER ONLINE';
      $('#serverName').textContent = data.hostname || address;
      const online = data.players?.online ?? 0, max = data.players?.max ?? '?';
      $('#playerCount').textContent = `${online} / ${max} players online`;
      $('#statusFoot').textContent = data.version ? `Version ${data.version}` : 'Connection is responding';
    } else {
      panel.classList.add('offline');
      $('.status-state').textContent = '● SERVER OFFLINE';
      $('#playerCount').textContent = 'No response from this server';
      $('#statusFoot').textContent = 'Check the address and try again';
    }
  } catch (err) {
    $('.status-state').textContent = 'STATUS UNAVAILABLE';
    $('#playerCount').textContent = 'Could not fetch server status';
    $('#statusFoot').textContent = 'Check your connection or try again later';
  }
});

const authModal = $('#authModal'), adminModal = $('#adminModal');
const openModal = el => { el.hidden = false; document.body.style.overflow = 'hidden'; };
const closeModal = el => { el.hidden = true; if (authModal.hidden && adminModal.hidden) document.body.style.overflow = ''; };
$('#openAuth').addEventListener('click', () => openModal(authModal));
$('#closeAuth').addEventListener('click', () => closeModal(authModal));
$('#closeAdmin').addEventListener('click', () => closeModal(adminModal));
[authModal, adminModal].forEach(modal => modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(authModal); closeModal(adminModal); } });

let authMode = 'login';
$$('.auth-tabs button').forEach(button => button.addEventListener('click', () => {
  authMode = button.dataset.mode;
  $$('.auth-tabs button').forEach(b => b.classList.toggle('active', b === button));
  $('#usernameWrap').hidden = authMode !== 'signup';
  $('#authUsername').required = authMode === 'signup';
  $('#authTitle').innerHTML = authMode === 'login' ? 'Welcome <span class="gradient-text">back.</span>' : 'Create your <span class="gradient-text">account.</span>';
  $('#authSubmit').textContent = authMode === 'login' ? 'Sign in' : 'Create account';
  $('#authPassword').autocomplete = authMode === 'login' ? 'current-password' : 'new-password';
  $('#authMessage').textContent = '';
}));

// Deliberately demo-only: never stores passwords or pretends to authenticate users.
$('#authForm').addEventListener('submit', e => {
  e.preventDefault();
  $('#authMessage').textContent = 'Demo only: connect Supabase Auth or another backend to enable secure sign-in.';
  showToast('Authentication is not configured yet.');
});

$('#openAdmin').addEventListener('click', () => { closeModal(authModal); openModal(adminModal); });
const settingsKey = 'enderverse-preview-settings';
function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
    if (settings.server) $('#adminServer').value = settings.server;
    if (settings.discord) $('#adminDiscord').value = settings.discord;
    if (settings.contact) $('#adminContact').value = settings.contact;
    if (settings.server) $('#serverAddress').value = settings.server;
    if (settings.discord) $('a[href="https://discord.com/"]').href = settings.discord;
    if (settings.contact) $('a[href="mailto:hello@example.com"]').href = `mailto:${settings.contact}`;
  } catch (_) {}
}
loadSettings();
$('#saveSettings').addEventListener('click', () => {
  const settings = {
    server: $('#adminServer').value.trim(),
    discord: $('#adminDiscord').value.trim(),
    contact: $('#adminContact').value.trim()
  };
  localStorage.setItem(settingsKey, JSON.stringify(settings));
  $('#serverAddress').value = settings.server || $('#serverAddress').value;
  $('a[href="https://discord.com/"], a[href^="https://discord.gg/"]').href = settings.discord || 'https://discord.com/';
  $('a[href^="mailto:"]').href = `mailto:${settings.contact || 'hello@example.com'}`;
  $('#adminMessage').textContent = 'Saved in this browser only. This is not a secure server-side admin system.';
  showToast('Preview settings saved locally.');
});

$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#contactName').value.trim(), email = $('#contactEmail').value.trim(), message = $('#contactMessage').value.trim();
  const subject = encodeURIComponent(`Website contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  $('#contactNote').textContent = 'Opening your email app. Configure your real contact email before publishing.';
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
});
