const CACHE = "study-dashboard-v1";

const STATIC_ASSETS = [
    "/index.html",
    "/css/style.css",
    "/js/firebase.js",
    "/js/auth.js",
    "/js/dashboard.js",
    "/js/subject-registry.js",
    "/js/subject.js",
    "/manifest.json",
    "/subjects/maths.html",
    "/subjects/addmaths.html",
    "/subjects/science.html",
    "/subjects/physics.html",
    "/subjects/chemistry.html",
    "/subjects/biology.html",
    "/subjects/english.html",
    "/subjects/chinese.html",
    "/subjects/malay.html",
    "/subjects/moral.html",
    "/subjects/history.html",
    "/subjects/geografi.html",
    "/subjects/rekabentuk.html",
    "/subjects/seni.html",
    "/daily-progress.html",
    "/js/daily-progress.js",
    "/history/t2_chapter4.html",
    "/history/t2_chapter8.html",
    "/history/t2_chapter9.html",
    "/rbt/t2_akuaponik.html",
    "/rbt/t2_elektronik.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    // Only handle GET requests for same-origin or static CDN assets
    if (event.request.method !== "GET") return;

    // Network-first for Firestore API calls so data stays fresh
    if (event.request.url.includes("firestore.googleapis.com")) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
