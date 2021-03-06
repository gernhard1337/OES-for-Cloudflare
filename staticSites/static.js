// Run Simulation and build a Table with the results
import {runSimulation} from "../Core0_Cloudflare/Inventory-Managment/simulation-worker";
import {sim} from "../Core0_Cloudflare/OESjs-Core0/OES-Foundation";
function table_html() {

  let answer = runSimulation(sim);
  return `<div>` +  answer + `</div>`;

}

const static_gen = () =>`
<!DOCTYPE html>
<head>
    <meta name="description" content="Static Generation of Inventory Managment"/>
</head>
<body>
  <h1>Running OES Simulations with a Static Cloudflare worker</h1>
  <p>This Site was completly renderd with a Cloudflare Worker</p>
  <p>For this, the Site run the Computation before delivering the HTML-Response</p>
  <p>Due to this, longer loading times for the whole Site are reasonable.</p>
  <p>However this is still way faster than running it locally.</p>
  <p>Output of the Simulation is as followed:</p>`
    + table_html() +
    `</body>`;
export default static_gen