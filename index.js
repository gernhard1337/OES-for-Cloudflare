// Imports for Cloudflare
import { Router } from 'itty-router'
// Imports for Site Managment
import home from './staticSites/home'

const router = Router()

router.get("/",()=>{
  return new Response(home(), {
  headers: {
    'content-type': 'text/html;charset=UTF-8',
  },
})})

// First Option for Simulation
router.get("/staticGeneration",()=>{
  return new Response(home(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })})

// Second Option for Simulation
router.get("/dynamicGeneration",()=>{
  return new Response(home(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })})




// all other routes are 404 cause right now non existent.
router.all('*', () => new Response('Not Found.', { status: 404 }))
// attach router to worker request handler.
addEventListener('fetch', event => {
  return event.respondWith(router.handle(event.request));
});
