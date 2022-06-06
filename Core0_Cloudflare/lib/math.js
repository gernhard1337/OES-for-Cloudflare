/*******************************************************************************
 * Math/Statistics Library for OESCore
 *
 * @copyright Copyright 2020 Gerd Wagner
 *   Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license The MIT License (MIT)
 * @author Gerd Wagner
 ******************************************************************************/

/****************************************************************
 ****************************************************************/
var math = Object.create( null);
export var math;
/**
 * Compute the Cartesian Product of an array of arrays
 * From https://stackoverflow.com/a/36234242/2795909
 * @param {Array} arr - An array of arrays of values to be combined
 */
export function cartesianProduct(arr) {
  return arr.reduce( function (a,b) {
    return a.map( function (x) {
      return b.map( function (y) {
        return x.concat(y);
      })
    }).reduce( function (a,b) {return a.concat(b)}, [])
  }, [[]])
};
/**
 * Round a decimal number to decimalPlaces
 * @param {number} x - the number to round
 * @param {number} d - decimal places
 */
export function round (x,d) {
  var roundingFactor = Math.pow(10, d);
  return Math.round((x + Number.EPSILON) * roundingFactor) / roundingFactor;
};
/**
 * Compute the sum of an array of numbers
 * @param {Array} data - An array of numbers
 */
export function sum(data) {
  function add( a, b) {return a + b;}
  return data.reduce( add, 0);
};
/**
 * Compute the max/min of an array of numbers
 * @param {Array} data - An array of numbers
 */
export function max(data) {
  return Math.max( ...data);
};
export function min (data) {
  return Math.min( ...data);
};
/**
 * Compute the arithmetic mean of an array of numbers
 * @param {Array} data - An array of numbers
 */
export function mean  (data) {
  return math.sum( data) / data.length;
};
/**
 * Compute the standard deviation of an array of numbers
 * @param {Array} data - An array of numbers
 */
export function stdDev (data) {
  var m = math.mean( data);
  return Math.sqrt( data.reduce( function (acc, x) {
    return acc + Math.pow( x - m, 2);}, 0) / (data.length - 1));
};
// Returns a random number between min (inclusive) and max (exclusive)
export function getUniformRandomNumber (min, max) {
  return Math.random() * (max - min) + min;
}
// Returns a random integer between min (included) and max (included)
export function getUniformRandomInteger (min, max) {
  return Math.floor( Math.random() * (max - min + 1)) + min;
}
/**
 * Compute the confidence interval of an array of numbers. Based on
 *   Efron, B. (1985). Bootstrap confidence intervals for a class of parametric
 *   problems. Biometrika, 72(1), 45-58.
 * @param {Array<number>} data - An array of numbers
 * @param {number} samples - Number of bootstrap samples (default 10000)
 * @param {number} alpha - Confidence interval to estimate [0,1] (default 0.95)
 * @returns {{lowerBound:number, upperBound:number}} Lower and upper bound of confidence interval
 */
export function confInt( data, samples, alpha ) {
  var n = samples || 10000;
  var p = alpha || 0.95;
  var mu = Array( n );
  var m = math.mean( data );
  var len = data.length;
  // Calculate bootstrap samples
  for (let i = 0; i < n; i++) {
    let t = 0;
    for (let j = 0; j < len; j++) {
      t += data[ Math.floor( Math.random() * len ) ];
    }
    mu[ i ] = ( t / len ) - m;
  }
  // Sort in ascending order
  mu.sort((a,b) => a - b);
  // Return the lower and upper confidence interval
  return {
    lowerBound: m - mu[ Math.floor( Math.min( n - 1,
        n * ( 1 - ( ( 1 - p ) / 2 ) ) ) ) ],
    upperBound: m - mu[ Math.floor( Math.max( 0, n * ( ( 1 - p ) / 2 ) ) ) ]
  };
};

/**
 * Define summary statistics record
 */
export function generate_stats(){
  math.stat = Object.create( null);
  math.stat.summary = {
    average: {label:"Average", f: math.mean},
    stdDev: {label:"Std.dev.", f: math.stdDev},
    min: {label:"Minimum", f: math.min},
    max: {label:"Maximum", f: math.max},
    confIntLowerBound: {label: "CI Lower", f: function ( data ) {
        math.stat.CurrentCI = math.confInt( data ); // {lowerBound: x, upperBound: y}
        return math.stat.CurrentCI.lowerBound;
      }},
    confIntUpperBound: {label: "CI Upper", f: function () {
        return math.stat.CurrentCI.upperBound;
      }}
  };
};
