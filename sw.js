const nombreCache = 'apv-v1';
const archivos = [
    '/',
    'index.html',
    'error.html',
    '/css/bootstrap.css',
    '/css/styles.css',
    '/js/app.js',
    '/js/apv.js'
];

self.addEventListener('install', e => {
    console.log('Instalado el Service Worker');
    console.log(e);

    e.waitUntil(
        caches.open(nombreCache)
            .then(cache => {
                console.log('Cacheando');
                return cache.addAll(archivos); // addAll para agregar múltiples archivos
            })
    );
});

self.addEventListener('activate', e => {
    console.log('Service Worker Activado');

    // Actualizar la PWA //
    e.waitUntil(
        caches.keys()
            .then(keys => {
                console.log(keys); 

                return Promise.all(
                    keys
                        .filter(key => key !== nombreCache)
                        .map(key => caches.delete(key)) // borrar los demás
                );
            })
    );
});

// Evento fetch para descargar archivos estáticos
self.addEventListener('fetch', e => {
    console.log('Fetch...', e);

    e.respondWith(
        caches.match(e.request)
            .then(respuestaCache => {
                // Si no se encuentra en la caché, devolver error.html
                if (!respuestaCache) {
                    return caches.match('error.html');
                }
                return respuestaCache;
            })
            .catch(() => caches.match('error.html'))
    );
});