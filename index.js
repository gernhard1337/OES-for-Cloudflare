// Imports for Cloudflare
import { Router } from 'itty-router'
// Imports for Site Managment
import home from './staticSites/home'
import static_gen from "./staticSites/static";
import dynamic_gen from "./staticSites/dynamic";
// create Router
const router = Router()

// Homepath Routing
router.get("/",()=>{
  return new Response(home(), {
  headers: {
    'content-type': 'text/html;charset=UTF-8',
  },
})});

// static Generation Routing
router.get("/staticGeneration",()=>{
  return new Response(static_gen(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })});

// dynamic Generation Routing
router.get("/dynamicGeneration",()=>{
  return new Response(dynamic_gen(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })});

// all other routes are 404 cause right now non existent.
router.all('*', () => new Response('Not Found.', { status: 404 }))
// attach router to worker request handler.
addEventListener('fetch', event => {
  return event.respondWith(router.handle(event.request));
});
