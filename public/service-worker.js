//global constants
const APP_PREFIX = 'Budget-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//files to cache
const FILES_TO_CACHE = [
    "./index.html",
    //the below give me an error or uncaught reference - addAll doesn't work
    "./css/style.css",
    "./js/index.js",
    "./js/idb.js"
  ];

//install service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
        })
      )
})

//activate service-worker and clear out old data from cache
self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        //add the current cache to the keeplist
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });

  //tell service worker to retrieve info from cache
  self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        //source already in cache
          caches.match(e.request).then(function (request) {
            if (request) {
              console.log('responding with cache : ' + e.request.url)
              return request
              //if file is not found in cache, fetch
            } else {
              console.log('file is not cached, fetching : ' + e.request.url)
              return fetch(e.request)
          }
          
          // You can omit if/else for console.log & put one line below like this too.
          // return request || fetch(e.request)
          })
    )
  })