const cacheName = 'site-cache';
const urlsToCache = [
  '/',
  'index.html',
  '/src/css/style.css',
  '/src/script.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('Erro ao fazer cache dos arquivos:', error);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

function enviarNotificacao() {
  self.registration.showNotification('Precinho', {
    body: 'Olá, pessoa! Que tal economizar um pouco? Nossos preços foram atualizados!',
    icon: '/public/icon-192x192.png',

  });
}

function agendarNotificacaoDiaria() {
  const agora = new Date();
  let horarioNotificacao = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(), // Dia atual
    18, // Hora
    30, // Minutos
    0 // Segundos
  );

  if (agora.getHours() > 18) {
    horarioNotificacao.setDate(agora.getDate() + 1);
  }

  const tempoRestante = horarioNotificacao.getTime() - agora.getTime();

  if (tempoRestante > 0) {
    setTimeout(function() {
      enviarNotificacao();
      agendarNotificacaoDiaria();
    }, tempoRestante);
  }
}

agendarNotificacaoDiaria();
