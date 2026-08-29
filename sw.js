const CACHE='qs-v9';
const CORE=['./','./index.html','./catalog.html','./product.html','./cart.html','./contacts.html','./info.html','./dgu.html','./discounts.html','./responsibility.html','./terms.html','./privacy.html','./return.html','./delivery.html','./payment.html','./faq.html','./offline.html','./app.css','./tools-data.js','./cat-icons.js','./app-cart.js','./app-search.js','./catalog-app.js','./product-app.js','./cart-app.js','./callback-widget.js','./manifest.webmanifest','./sitemap.xml','./assets/favicon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const url=new URL(r.url);
  if(url.origin!==location.origin){e.respondWith(fetch(r).catch(()=>caches.match(r)));return}
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./offline.html'))));
    return;
  }
  /* stale-while-revalidate: отдаём из кэша, но всегда обновляем в фоне */
  e.respondWith(caches.match(r).then(m=>{
    const net=fetch(r).then(res=>{if(res&&res.ok)caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>m);
    return m||net;
  }));
});
