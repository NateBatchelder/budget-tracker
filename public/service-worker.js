// app prefix
const APP_PREFIX = 'bt-';
// version
const VERSION = '1.0.0';
// cache name
const CACHE_NAME = APP_PREFIX + VERSION;

// cache files
const FILES_TO_CACHE = [
    // '/',
    "./",
    // index.html
    "./index.html",
    // css
    "./css/style.css",
    // js
    "./js/index.js",
    "./js/idb.js",
    // manifest
    "./manifest.json",
    // "./js/index.js", // uncomment this line to cache the js file
    // icons
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
];

// event listner intall
self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    // pre cache files
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// activate
self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // remove unwanted caches
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// event listner fetch
self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // respond from cache
    evt.respondWith(
        caches.match(evt.request).then((response) => {
            if (response) {
                console.log('[ServiceWorker] Found in Cache', evt.request.url);
                return response;
            }
            // request from server
            console.log('[ServiceWorker] No response in Cache. Fetching', evt.request.url);
            return fetch(evt.request)
        }
        )
    );
});
