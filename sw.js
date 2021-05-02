const CACHE_NAME='app',
urlsTocache=[
'./',
'./css/style.css',
'./css/bootstrap.min.css',
'./css/bootstrap.min.js',
'./js/index.js',
]
//durante la instalacion almacena en cahe los archivos estaticos
self.addEventListener('install',e=>{
e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache=>{
        return cache.addAll(urlsTocache)
        .then(()=>self.skipWaiting())
    })
    .catch(err=>console.log('fallo registro de cache',err))
)
})
//activa y busca los recursos para funcionar sin conexion
self.addEventListener('activate',e=>{
const cacheWhitelist= [CACHE_NAME]

e.waitUntil(
    caches.keys()
    .then(cachesNames=>{
        cacheNames.map(cacheName=>{
            //eliminar lo que ya no se necesitga en cahe
            if(cacheWhitelist.indexOf(cacheName) ===-1){
                return caches.delete(cacheName)
            }
        })
    })
    //indica al se activar el cahe actual
    .then(()=>self.clients.claim())
)
})

//recupera la url con conexion
self.addEventListener('fetch',e=>{
 //responde ya sea con el objeto en cache o continua y busca uno real
 e.respondWith(
     caches.match(e.request)
     .then(res=>{
         if(res){
             //recuperar cache
             return res
         }
         //recuperar la peticio a la url
         return fetch(e.request)
     })
 )
})

