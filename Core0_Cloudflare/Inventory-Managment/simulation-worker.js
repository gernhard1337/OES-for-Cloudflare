// loading framework in Cloudflare-Workers way
import {EventList} from "../lib/EventList";
import {oes, sim} from "../OESjs-Core0/OES-Foundation";
import {math, min, confInt, max, sum, mean, cartesianProduct, getUniformRandomInteger, getUniformRandomNumber, round, stdDev, generate_stats} from "../lib/math";
import {advanceSimulationTime, initializeScenarioRun, initializeSimulator, runScenario, runSimpleExperiment, runStandaloneScenario} from "../OESjs-Core0/simulator";


// start simulation
export function runSimulation(){
    sim.model.time = "discrete";
    sim.model.timeUnit = "days";
    sim.model.objectTypes = ["SingleProductShop"];
    sim.model.eventTypes = ["DailyDemand", "Delivery"];
    /*******************************************************
     Simulation Scenario Settings
     ********************************************************/
    sim.scenario.durationInSimTime = 1000;
    runScenario(sim);




    return sim.model.time;
}