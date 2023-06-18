const CACHE = "app-cache";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

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
    setTimeout(function () {
      enviarNotificacao();
      agendarNotificacaoDiaria();
    }, tempoRestante);
  }
}

agendarNotificacaoDiaria();
