/* Changes from OESjs
- sim.objects is a JS Map
 */
import {oes} from "./OES-Foundation";
import {math} from "../lib/math";
import {EventList} from "../lib/EventList";
/*******************************************************************
 * Initialize Simulator ********************************************
 *******************************************************************/
export function initializeSimulator(sim) {
  if (sim.model.nextMomentDeltaT) sim.nextMomentDeltaT = sim.model.nextMomentDeltaT;
  else {  // assign defaults
    if (sim.model.time === "discrete") sim.nextMomentDeltaT = 1;
    else sim.nextMomentDeltaT = oes.defaults.nextMomentDeltaT;
  }
  // A Map of all objects (accessible by ID)
  sim.objects = new Map();
  // The Future Events List
  sim.FEL = new EventList();
  // Create map for statistics variables
  sim.stat = Object.create(null);
}

/*******************************************************************
 * Initialize a (standalone or experiment scenario) simulation.js run *
 *******************************************************************/
export function initializeScenarioRun(sim) {
  // clear initial state data structures
  sim.objects.clear();
  sim.FEL.clear();
  sim.step = 0;  // simulation.js loop step counter
  sim.time = 0;  // simulation.js time
  // set default endTime
  sim.endTime = sim.scenario.durationInSimTime || Infinity;
  // get ID counter from simulation.js scenario, or set to default value
  sim.idCounter = sim.scenario.idCounter || 1000;
  // set up initial state
  if (sim.scenario.setupInitialState) sim.scenario.setupInitialState();
  if (sim.model.setupStatistics) sim.model.setupStatistics();
};
/*******************************************************
 Advance Simulation Time
 ********************************************************/
export function advanceSimulationTime(sim) {
  sim.nextEvtTime = sim.FEL.getNextOccurrenceTime();  // 0 if there is no next event
  // increment the step counter
  sim.step += 1;
  // advance simulation.js time
  if (sim.nextEvtTime > 0) sim.time = sim.nextEvtTime;
}

/*******************************************************
 Run a simulation.js scenario
 ********************************************************/
export function runScenario(sim) {
  // Simulation Loop
  while (sim.time < sim.endTime && !sim.FEL.isEmpty()) {
    // if not executed in a JS worker, create simulation.js log
    advanceSimulationTime(sim);
    // extract and process next events
    const nextEvents = sim.FEL.removeNextEvents();
    for (const e of nextEvents) {
      // apply event rule
      const followUpEvents = e.onEvent();
      // schedule follow-up events
      for (const f of followUpEvents) {
        sim.FEL.add( f);
      }
      const EventClass = e.constructor;
      // test if e is an exogenous event
      if (EventClass.recurrence) {
        // create and schedule next exogenous events
        sim.FEL.add( e.createNextEvent());
      }
    }
  }
  if (sim.model.computeFinalStatistics) sim.model.computeFinalStatistics();
}

/*******************************************************
 Run a Standalone Simulation Scenario (in a JS worker)
 ********************************************************/
export function runStandaloneScenario(sim) {
  initializeSimulator(sim);
  initializeScenarioRun(sim);
  runScenario(sim);
}

/*******************************************************
 Run a Simple Experiment (in a JS worker)
 ********************************************************/
export function runSimpleExperiment(sim, exp) {
  initializeSimulator(sim);
  // initialize replication statistics record
  if (sim.model.setupStatistics) sim.model.setupStatistics();
  exp.replicStat = Object.create(null);  // empty map
  for (let varName of Object.keys( sim.stat)) {
    exp.replicStat[varName] = [];  // an array per statistics variable
  }
  // run experiment scenario replications
  for (let k=0; k < exp.nmrOfReplications; k++) {
    initializeScenarioRun(sim);
    runScenario(sim);
    // store replication statistics
    Object.keys( exp.replicStat).forEach( function (varName) {
      exp.replicStat[varName][k] = sim.stat[varName];
    });
  }
  // define exp.summaryStat to be a map for the summary statistics
  exp.summaryStat = Object.create(null);
  // aggregate replication statistics in exp.summaryStat
  Object.keys( exp.replicStat).forEach( function (varName) {
    exp.summaryStat[varName] = Object.create(null);  // empty map
    Object.keys( math.stat.summary).forEach( function (aggr) {
      var aggrF = math.stat.summary[aggr].f;
      exp.summaryStat[varName][aggr] = aggrF( exp.replicStat[varName]);
    });
  });
  // send experiment statistics to main thread
  self.postMessage({experiment: exp});
};


