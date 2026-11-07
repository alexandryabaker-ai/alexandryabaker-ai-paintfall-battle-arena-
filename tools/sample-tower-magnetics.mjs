import {readFile} from 'node:fs/promises';
import {text} from 'node:stream/consumers';
import * as THREE from '../public/vendor/three.module.js';
import {createTowerMagnetics} from '../public/paintfall-tower-magnetics.js';

const input = process.argv[2];
if (!input || input === '--help') {
  console.log(`Usage: node tools/sample-tower-magnetics.mjs input.json (or - for stdin)
Input JSON contains config and samples. Config requires metersPerWorldUnit,
minimumSeparationMeters, and a coils and/or magnets array. Each device has
an id and a parent (tower/car with a zero-based index, or track with a
spline parameter in [0,1]). Optional mount fields are offsetMeters,
quaternion [x,y,z,w], and relocations with startSeconds/endSeconds and
target offsetMeters and/or quaternion.

Coils specify verticesMeters (closed polygon without a repeated end vertex),
turns, resistanceOhms, and selfInductanceHenries. Magnets specify
momentAmpereSquareMeters [x,y,z] in their local frame. Each sample specifies
seconds, currents in coil order, and optionally currentRates or voltages.
Positions and wrenches are reported in SI units in the Hub frame.`);
  if (!input) process.exitCode = 1;
} else {
  try {
    const {config, samples} = JSON.parse(input === '-' ? await text(process.stdin) : await readFile(input, 'utf8'));
    if (!Array.isArray(samples) || !samples.length) throw new TypeError('Supply a nonempty samples array');
    const model = createTowerMagnetics(THREE, config);
    console.log(JSON.stringify(samples.map(model.evaluate), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
