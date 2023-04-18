const staticLowPrice = "low-price-site-v1";

const assets = [
  "/",
  "/src",
  "src/index.html",
  "src/css/style.css",
  "src/script.js",
  "src/public/icon-192x192.png",
  "src/public/icon-256x256.png",
  "src/public/icon-364x364.png",
  "src/public/icon-512x512.png",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticLowPrice).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })