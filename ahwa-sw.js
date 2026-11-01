const CACHE='ahwa-ui-v1';const ASSETS=['./ahwa-mobile.css','./ahwa-mobile.js','./ahwa-icon-192.png','./ahwa-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin||!ASSETS.some(a=>u.pathname.endsWith(a.slice(1))))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
