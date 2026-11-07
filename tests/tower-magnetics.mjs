import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import * as T from '../public/vendor/three.module.js';
import {createTowerMagnetics} from '../public/paintfall-tower-magnetics.js';

function near(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);
}

// Analytical fixtures only. The model takes the actual layout from its caller.
const tower = {type: 'tower', index: 0};
const config = {metersPerWorldUnit: 0.5, minimumSeparationMeters: 0.05};
const square = [[-0.5,-0.5,0],[0.5,-0.5,0],[0.5,0.5,0],[-0.5,0.5,0]];
const coil = {id: 'coil-a', parent: tower, verticesMeters: square, turns: 10,
  selfInductanceHenries: 0.001, resistanceOhms: 2};
const magnetA = {id: 'magnet-a', parent: tower, momentAmpereSquareMeters: [0,0,2]};
const magnetB = {id: 'magnet-b', parent: tower, offsetMeters: [0,0,2], momentAmpereSquareMeters: [0,0,3]};

const pair = createTowerMagnetics(T, {...config, magnets: [magnetA, magnetB]}).evaluate({seconds: 0});
near(pair.devices[1].externalFieldTesla[2], 5e-8, 1e-19);
near(pair.devices[1].forceNewtons[2], -2.25e-7, 1e-18);
near(pair.devices[0].forceNewtons[2], 2.25e-7, 1e-18);
near(pair.coenergyJoules, 1.5e-7, 1e-18);
near(pair.storedEnergyJoules, -pair.coenergyJoules, 1e-18);

const squareField = createTowerMagnetics(T, {...config, coils: [{...coil, subdivisionsPerEdge: 128}],
  magnets: [magnetB]}).evaluate({seconds: 0, currents: [2]});
const halfSide = 0.5, height = 2;
const exactTesla = 8e-7 * coil.turns * 2 * halfSide ** 2
  / ((halfSide ** 2 + height ** 2) * Math.sqrt(2 * halfSide ** 2 + height ** 2));
near(squareField.devices[1].externalFieldTesla[2], exactTesla, exactTesla * 1e-5);
near(squareField.permanentFluxWebers[0] * 2, exactTesla * 3, exactTesla * 3e-5);

const movingCoil = {...coil, id: 'coil-b', offsetMeters: [0,0,1.6],
  relocations: [{startSeconds: 2, endSeconds: 4, offsetMeters: [0,0,2.4]}]};
const geometry = {...config, coils: [coil, movingCoil], magnets: [{...magnetB, offsetMeters: [0,0,4]}]};
const model = createTowerMagnetics(T, geometry);
const currents = [2, -1];
const sample = model.evaluate({seconds: 3, currents, currentRates: [0.3, -0.5]});
const L = sample.inductanceHenries;
assert.equal(L[0][1], L[1][0]);
assert.ok(L[0][1] > 0);
assert.ok(sample.inductanceRateHenriesPerSecond[0][1] < 0);
assert.ok(Math.abs(sample.motionVoltage[0]) > 1e-9);
near(sample.devices[1].positionMeters[2], 1);
near(sample.power.balanceResidualWatts, 0, 1e-13);
near(sample.power.mechanicalWatts, sample.devices[1].forceNewtons[2] * 0.75, 1e-11);
for (let axis = 0; axis < 3; axis++) {
  near(sample.devices.reduce((sum, device) => sum + device.forceNewtons[axis], 0), 0, 1e-12);
}
const inverse = model.evaluate({seconds: 3, currents, voltages: sample.voltages, includeWrenches: false});
near(inverse.currentRatesAmpsPerSecond[0], 0.3);
near(inverse.currentRatesAmpsPerSecond[1], -0.5);

const route = globalThis.PaintfallTowerRide.createTrack(T);
const seconds = 23.619;
route.update(seconds);
const routeDevices = [
  {...magnetA, offsetMeters: [0,1,0]},
  {...magnetB, parent: {type: 'car', index: 1}, offsetMeters: [0,0,0]},
  {...magnetA, id: 'rail', parent: {type: 'track', parameter: 9/19}}
];
const live = createTowerMagnetics(T, {...config, magnets: routeDevices}).evaluate({seconds});
const expectedTower = new T.Vector3(0,1,0).applyEuler(route.towerRotations[0]).add(new T.Vector3(-3,0,-1));
const expectedCar = route.carPose(seconds * 1000, 1).position.multiplyScalar(0.5);
const expectedRail = route.curve.getPoint(9/19).multiplyScalar(0.5);
for (const [index, position] of [expectedTower, expectedCar, expectedRail].entries()) {
  near(new T.Vector3(...live.devices[index].positionMeters).distanceTo(position), 0);
}
for (const [seconds, expectedStart] of [[0,0], [10,10], [40,40]]) {
  assert.equal(model.evaluate({seconds, currents, includeWrenches: false}).sampleIntervalSeconds[0], expectedStart);
}

assert.throws(() => createTowerMagnetics(T, {...config, magnets: [magnetA, {...magnetB, offsetMeters: [0,0,0]}]})
  .evaluate({seconds: 0}), /separation range/);
const crossing = {...coil, id: 'crossing', offsetMeters: [0.3,0.45,0], subdivisionsPerEdge: 1};
assert.throws(() => createTowerMagnetics(T, {...config, coils: [coil, crossing]})
  .evaluate({seconds: 0, currents: [0,0]}), /separation range/);
const impossible = [coil, {...movingCoil, relocations: []}].map(entry => ({...entry, selfInductanceHenries: 1e-14}));
assert.throws(() => createTowerMagnetics(T, {...config, coils: impossible})
  .evaluate({seconds: 0, currents: [0,0]}), /positive definite/);
assert.throws(() => model.evaluate({seconds: 3, currents, voltages: [1,2], currentRates: [0,0]}), /or voltages/);

const cli = fileURLToPath(new URL('../tools/sample-tower-magnetics.mjs', import.meta.url));
const cliResult = JSON.parse(execFileSync(process.execPath, [cli, '-'], {
  input: JSON.stringify({config: {...config, magnets: [magnetA, magnetB]}, samples: [{seconds: 0}]}),
  encoding: 'utf8'
}));
near(cliResult[0].devices[1].forceNewtons[2], -2.25e-7, 1e-18);
console.log('PASS: dipole force, analytical coil field, reciprocal inductance, relocation power, voltage solve, route mounts, domain guards and CLI.');
