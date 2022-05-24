
// Starting page
const html = `<!DOCTYPE html>
<head>
    <meta name="description" content="Simulation examples for OES Core simulators"/>
</head>
<body>
  <h1>Running OES Simulations with Cloudflare-Workers</h1>
  <p>This whole project is deployed with Cloudflare - Workers ( <a href="https://workers.cloudflare.com"> Workers </a> )</p>
  <p>The Aim of this project is to enable computation of <a href="https://sim4edu.com/oesjs/core0/inventory-management/">Inventory Managment</a> on Cloudflare Workers instead of your local pc</p>
  <p>There are two implementations for this Task:</p>
  <div>
    Compute the results and give HTML-response after computation. 
    <a href="">Start this computation</a>
  </div>
  <div>
    Send HTML-Construct and once simulation is ready subsequent deliver the results. 
    <a href="">Start this computation</a>
  </div>
</body>`;

async function handleRequest(request) {
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request));
});
