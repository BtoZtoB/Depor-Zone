/* PWA con alcance relativo: funciona dentro de /Depor-Zone/DeporZone/. */
const PREFIJO = 'deporzone-pwa-' + self.registration.scope + '-';
const VERSION = PREFIJO + 'v6-rubrica-offline';
const BASE = self.registration.scope;
const SHELL = ['.', 'index.html', 'style.css', 'script.js', 'pwa.js', 'manifest.json',
    'rubrica.css', 'viewport.js', 'data/canchas.json', 'vendor/jquery-3.7.1.min.js', 'icons/icon-192.png', 'icons/icon-512.png'];
SHELL.push(...Array.from({length:15}, (_,i) => 'img/cancha' + (i+1) + '.jpg'));
self.addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('install', event => {
    event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith(PREFIJO) && key !== VERSION).map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});
async function guardar(request, response) {
    // No se guardan errores HTTP; una foto ausente se podrá cargar al añadirla.
    if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(VERSION);
        await cache.put(request, response.clone());
    }
}
self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (url.origin === self.location.origin && !url.href.startsWith(BASE)) return;
    if (request.mode === 'navigate' || url.href === new URL('data/canchas.json', BASE).href) {
        event.respondWith((async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 5000);
            try {
                const response = await fetch(request, { signal: controller.signal });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                await guardar(request, response);
                return response;
            } catch (error) {
                const cache = await caches.open(VERSION);
                const saved = await cache.match(request) || (request.mode === 'navigate' && await cache.match(new URL('index.html', BASE).href));
                return saved || new Response('Recurso no disponible sin conexión.', { status: 503 });
            } finally { clearTimeout(timer); }
        })());
        return;
    }
    // Solo recursos usados por DeporZone; límite para imágenes y fuentes.
    if (url.origin !== self.location.origin && !['images.unsplash.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net','api.qrserver.com'].includes(url.hostname)) return;
    event.respondWith((async () => {
        const cache = await caches.open(VERSION);
        const saved = await cache.match(request);
        if (saved) return saved;
        try {
            const response = await fetch(request);
            await guardar(request, response);
            const keys = await cache.keys();
            const extra = keys.filter(key => !SHELL.some(path => new URL(path, BASE).href === key.url));
            if (extra.length > 80) await cache.delete(extra[0]);
            return response;
        } catch (error) {
            return Response.error();
        }
    })());
});
