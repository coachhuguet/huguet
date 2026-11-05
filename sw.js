// Service worker de Coach Huguet: fa les pàgines instal·lables com a app (Android/iPhone)
// i, si no hi ha connexió, mostra l'última còpia guardada. Sempre demana primer la versió nova a la xarxa.
const CACHE = 'huguet-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return r;
    }).catch(() => caches.match(req).then(m => m || caches.match(req, { ignoreSearch: true })))
  );
});
