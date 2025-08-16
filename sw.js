self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("renuar-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/css/styles.css",
        "/assets/js/app.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetch(e.request);
    })
  );
});
