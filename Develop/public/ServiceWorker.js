const PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE = PREFIX + VERSION;

const FILES_FOR_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

self.addEventListener('install', function(kt) {
    kt.waitUntil(
        caches.open(CACHE).then(function(cache) {
            console.log('installing cache : ' + CACHE)
            return cache.addAll(FILES_FOR_CACHE)
        })
    )
})

self.addEventListener('activate', function(kt) {
    kt.waitUntil(
        caches.keys().then(function (list) {
            let cacheList = list.filter(function(key) {
                return key.indexOf(PREFIX);
            });
            cacheList.push(CACHE);
            return Promise.all(list.map(function (key, x) {
                if(cacheList.indexOf(key) === -1) {
                    console.log('deleting the cache :' + list[x] );
                    return caches.delete(list[x]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(i) {
    console.log('fetch request : ' + i.request.url)
    i.respondWith(
        caches.match(i.request).then(function(request) {
            if(request) {
                console.log('responding with cache : ' + i.request.url)
                return request
            }
            else {
                console.log('file is not cached, fetching :' + i.request.url)
                return fetch(i.request)
            }
        })
    )
})