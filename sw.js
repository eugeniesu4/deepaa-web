const UPSTREAM='https://raw.githubusercontent.com/n317/DeepAAonWeb/master/docs/';
const ASSETS=new Set(['app.bundle.js','model/model_v2.bin','model/model.json','model/model_metadata.json','model/model_weights.buf','fonts/Saitamaar.woff2','fonts/Saitamaar.ttf','fonts/Saitamaar.eot','sample-data/test_image.png']);
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  const path=url.pathname.replace(/^\/(?:deepaa-web\/)?/,'');
  if(!ASSETS.has(path)) return;
  event.respondWith(fetch(UPSTREAM+path,{mode:'cors',cache:'no-cache'}));
});
