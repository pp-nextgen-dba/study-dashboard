const CACHE = "study-dashboard-v2";

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
    "/subjects/storybooks.html",
    "/daily-progress.html",
    "/js/daily-progress.js",
    "/history/melaka_chapter5.html",
    "/history/chapter7.html",
    "/history/t2_chapter4.html",
    "/history/t2_chapter8.html",
    "/history/t2_chapter9.html",
    "/history/t2_chapter10.html",
    "/rbt/t2_akuaponik.html",
    "/rbt/t2_elektronik.html",
    "/rbt/t2_elektrik.html",
    "/rbt/t4_chapter_mekanikal.html",
    "/english/T4_T5_english_grammar.html",
    "/physics/t4_force_motion.html",
    "/chemistry/t4_chapter1.html",
    "/biology/biology_chapter8.html",
    "/chinese/zh_030.html",
    "/science/form2_science_chapter9_heat.html",
    "/science/t2_Chapter7-Electricity-Magnetism.html",
    "/science/t2_chapter10_sound_waves.html",
    "/moral/t2_moral_unit14.html",
    "/moral/t2_moral_unit13.html",
    "/moral/t2_moral_unit11.html",
    "/moral/t2_moral_unit10.html",
    "/moral/t2_moral_unit9.html",
    "/moral/t2_moral_unit15.html",
    "/moral/t2_Unit15_HakAsasiManusia.html",
    "/moral/t2_moral_unit12.html",
    "/story/inertia-growth-notes.html"
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
