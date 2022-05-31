// Imports for Cloudflare

// Imports for Site Managment
import home from './staticSites/home'

// Starting page
async function handleRequest(request) {
  return new Response(home(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request));
});
