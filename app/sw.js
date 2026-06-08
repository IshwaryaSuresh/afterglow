// Afterglow service worker — installability + notifications
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

// Focus/open the app when a notification is tapped
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      for (const c of cs) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// Ready for true server-sent Web Push (when the Edge Function is added).
// Until then, the app shows notifications directly via the realtime channel.
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  const title = d.title || 'Afterglow';
  const body = d.body || 'Your person shared a glow.';
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'afterglow'
  }));
});
