const CACHE_NAME = "bar-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./bar.js",
  "./bar.css",
  "./manifest.json",
  "./images/FPO.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
