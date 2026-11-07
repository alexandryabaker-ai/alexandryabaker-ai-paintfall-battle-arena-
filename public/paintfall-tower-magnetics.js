import './paintfall-tower-ride.js';

const MU0_OVER_4PI = 1e-7;
const ZERO = [0, 0, 0];
const IDENTITY = [0, 0, 0, 1];

function finite(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
}

function positive(value, label) {
  if (finite(value, label) <= 0) throw new RangeError(`${label} must be positive`);
  return value;
}

function numbers(values, length, label) {
  if (!Array.isArray(values) || values.length !== length || !values.every(Number.isFinite)) {
    throw new TypeError(`${label} must contain ${length} finite numbers`);
  }
  return values.slice();
}

function vector(T, values, label) {
  return new T.Vector3(...numbers(values, 3, label));
}

function rotation(T, values, label) {
  const result = new T.Quaternion(...numbers(values, 4, label));
  if (Math.abs(result.lengthSq() - 1) > 1e-6) {
    throw new RangeError(`${label} must be a unit quaternion [x,y,z,w]`);
  }
  return result.normalize();
}

function dot(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function multiply(matrix, values) {
  return matrix.map(row => dot(row, values));
}

// Cholesky also rejects coil layouts whose inductance matrix cannot store
// positive magnetic energy in every independent current direction.
function factorInductance(matrix) {
  const factor = matrix.map(row => row.map(() => 0));
  const scale = Math.max(0, ...matrix.map((row, i) => row[i]));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j <= i; j++) {
      let value = matrix[i][j];
      for (let k = 0; k < j; k++) value -= factor[i][k] * factor[j][k];
      if (i === j) {
        if (!(value > Number.EPSILON * matrix.length * scale) || !Number.isFinite(value)) {
          throw new RangeError('Inductance matrix is not positive definite at this pose');
        }
        factor[i][j] = Math.sqrt(value);
      } else {
        factor[i][j] = value / factor[j][j];
      }
    }
  }
  return factor;
}

function solveInductance(factor, rhs) {
  const result = rhs.slice();
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < i; j++) result[i] -= factor[i][j] * result[j];
    result[i] /= factor[i][i];
  }
  for (let i = result.length - 1; i >= 0; i--) {
    for (let j = i + 1; j < result.length; j++) result[i] -= factor[j][i] * result[j];
    result[i] /= factor[i][i];
  }
  return result;
}

function pointToSegmentSquared(point, segment) {
  const offset = point.clone().sub(segment.start);
  const fraction = Math.min(1, Math.max(0, offset.dot(segment.delta) / segment.delta.lengthSq()));
  return offset.addScaledVector(segment.delta, -fraction).lengthSq();
}

function segmentDistanceSquared(a, b) {
  const endpoints = Math.min(pointToSegmentSquared(a.start, b), pointToSegmentSquared(a.end, b),
    pointToSegmentSquared(b.start, a), pointToSegmentSquared(b.end, a));
  // The minimum is on a boundary, or where the connector is perpendicular
  // to both segments. Cross products avoid cancellation for nearly parallel wires.
  const normal = a.delta.clone().cross(b.delta);
  const denominator = normal.lengthSq();
  if (denominator === 0) return endpoints;
  const offset = b.start.clone().sub(a.start);
  const s = offset.clone().cross(b.delta).dot(normal) / denominator;
  const t = offset.clone().cross(a.delta).dot(normal) / denominator;
  if (s < 0 || s > 1 || t < 0 || t > 1) return endpoints;
  return Math.min(endpoints, offset.dot(normal) ** 2 / denominator);
}

function requireGap(squared, minimum, pair) {
  if (!(squared > 0 && squared >= minimum ** 2) || !Number.isFinite(squared)) {
    throw new RangeError(`${pair} is outside the configured magnetic separation range`);
  }
}

function dipoleField(offset, moment, squaredDistance) {
  const scale = MU0_OVER_4PI * squaredDistance ** -1.5;
  return offset.clone().multiplyScalar(3 * moment.dot(offset) / squaredDistance)
    .sub(moment).multiplyScalar(scale);
}

function dipolePair(a, b, minimum) {
  const r = b.position.clone().sub(a.position);
  const distanceSquared = r.lengthSq();
  requireGap(distanceSquared, minimum, `${a.id} / ${b.id}`);
  const fieldAtB = dipoleField(r, a.moment, distanceSquared);
  const fieldAtA = dipoleField(r.clone().negate(), b.moment, distanceSquared);
  const ar = a.moment.dot(r);
  const br = b.moment.dot(r);
  const forceOnB = b.moment.clone().multiplyScalar(ar)
    .addScaledVector(a.moment, br)
    .addScaledVector(r, a.moment.dot(b.moment))
    .multiplyScalar(3 * MU0_OVER_4PI * distanceSquared ** -2.5)
    .addScaledVector(r, -15 * MU0_OVER_4PI * ar * br * distanceSquared ** -3.5);
  return {fieldAtA, fieldAtB, forceOnB, coenergy: b.moment.dot(fieldAtB)};
}

function mutualInductance(a, b, minimum) {
  let sum = 0;
  for (const first of a.segments) {
    for (const second of b.segments) {
      requireGap(segmentDistanceSquared(first, second), minimum, `${a.id} / ${b.id}`);
      sum += first.delta.dot(second.delta) / first.midpoint.distanceTo(second.midpoint);
    }
  }
  return MU0_OVER_4PI * a.turns * b.turns * sum;
}

function coilFieldPerAmp(coil, magnet, minimum) {
  const field = magnet.position.clone().set(0, 0, 0);
  for (const segment of coil.segments) {
    requireGap(pointToSegmentSquared(magnet.position, segment), minimum, `${coil.id} / ${magnet.id}`);
    const r = magnet.position.clone().sub(segment.midpoint);
    field.addScaledVector(segment.delta.clone().cross(r), r.lengthSq() ** -1.5);
  }
  return field.multiplyScalar(MU0_OVER_4PI * coil.turns);
}

// Midpoint quadrature uses closed polygon windings with subdivisions per edge.
// Supplied self-inductance accounts for finite conductor geometry.
function winding(T, vertices, subdivisions, id) {
  if (!Array.isArray(vertices) || vertices.length < 3) {
    throw new TypeError(`${id} needs at least three winding vertices`);
  }
  const points = vertices.map(point => vector(T, point, `${id} winding vertex`));
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    const from = points[i];
    const to = points[(i + 1) % points.length];
    if (from.distanceToSquared(to) === 0) throw new RangeError(`${id} has a zero-length winding edge`);
    for (let step = 0; step < subdivisions; step++) {
      edges.push([
        from.clone().lerp(to, step / subdivisions),
        from.clone().lerp(to, (step + 1) / subdivisions)
      ]);
    }
  }
  return edges;
}

function prepareMount(T, device) {
  const {id, parent} = device;
  if (typeof id !== 'string' || !id.trim()) throw new TypeError('Each magnetic device needs an id');
  if (parent?.type === 'track') {
    const parameter = finite(parent.parameter, `${id} track parameter`);
    if (parameter < 0 || parameter > 1) throw new RangeError(`${id} track parameter must be in [0,1]`);
  } else {
    const count = parent?.type === 'tower' ? 2 : parent?.type === 'car' ? 3 : 0;
    if (!count || !Number.isInteger(parent.index) || parent.index < 0 || parent.index >= count) {
      throw new RangeError(`${id} needs a valid tower, car, or track parent`);
    }
  }

  let startOffset = vector(T, device.offsetMeters ?? ZERO, `${id} mount offset`);
  let startRotation = rotation(T, device.quaternion ?? IDENTITY, `${id} mount rotation`);
  let previousEnd = 0;
  const relocations = (device.relocations ?? []).map(stage => {
    const start = finite(stage.startSeconds, `${id} relocation start`);
    const end = finite(stage.endSeconds, `${id} relocation end`);
    if (start < previousEnd || end <= start) throw new RangeError(`${id} relocation windows must be ordered and disjoint`);
    const endOffset = stage.offsetMeters === undefined ? startOffset : vector(T, stage.offsetMeters, `${id} relocation offset`);
    const endRotation = stage.quaternion === undefined ? startRotation : rotation(T, stage.quaternion, `${id} relocation rotation`);
    const prepared = {start, end, startOffset, startRotation, endOffset, endRotation};
    startOffset = endOffset;
    startRotation = endRotation;
    previousEnd = end;
    return prepared;
  });
  return {
    id, parent: {...parent}, relocations,
    offset: relocations[0]?.startOffset ?? startOffset,
    quaternion: relocations[0]?.startRotation ?? startRotation
  };
}

function mountAt(device, seconds, smooth5) {
  let {offset, quaternion} = device;
  for (const stage of device.relocations) {
    if (seconds < stage.start) break;
    const fraction = smooth5((seconds - stage.start) / (stage.end - stage.start));
    offset = stage.startOffset.clone().lerp(stage.endOffset, fraction);
    quaternion = stage.startRotation.clone().slerp(stage.endRotation, fraction);
    if (seconds < stage.end) break;
  }
  return {offset, quaternion};
}

function worldDevice(device, position, quaternion) {
  if (device.moment) {
    return {...device, position, quaternion, moment: device.moment.clone().applyQuaternion(quaternion)};
  }
  const segments = device.edges.map(([from, to]) => {
    const start = from.clone().applyQuaternion(quaternion).add(position);
    const delta = to.clone().sub(from).applyQuaternion(quaternion);
    return {start, delta, end: start.clone().add(delta), midpoint: start.clone().addScaledVector(delta, 0.5)};
  });
  return {...device, position, quaternion, segments};
}

function electricalGeometry(coils, magnets, minimum) {
  const L = coils.map(() => coils.map(() => 0));
  for (let i = 0; i < coils.length; i++) {
    L[i][i] = coils[i].selfInductance;
    for (let j = 0; j < i; j++) L[i][j] = L[j][i] = mutualInductance(coils[i], coils[j], minimum);
  }
  const fields = coils.map(coil => magnets.map(magnet => coilFieldPerAmp(coil, magnet, minimum)));
  const psi = fields.map(row => row.reduce((sum, field, j) => sum + field.dot(magnets[j].moment), 0));
  return {L, psi, fields};
}

function permanentGeometry(magnets, minimum) {
  const pairs = [];
  for (let i = 0; i < magnets.length; i++) {
    for (let j = i + 1; j < magnets.length; j++) {
      pairs.push({i, j, ...dipolePair(magnets[i], magnets[j], minimum)});
    }
  }
  return {pairs, W0: pairs.reduce((sum, pair) => sum + pair.coenergy, 0)};
}

function electricalCoenergy(geometry, currents) {
  return 0.5 * dot(currents, multiply(geometry.L, currents)) + dot(currents, geometry.psi);
}

// Each evaluation samples a private copy of the existing route. The returned
// forces are virtual-work wrenches at device centers, expressed in Hub axes.
export function createTowerMagnetics(T, config) {
  const scale = positive(config.metersPerWorldUnit, 'metersPerWorldUnit');
  const minimum = positive(config.minimumSeparationMeters, 'minimumSeparationMeters');
  const timeStep = positive(config.timeStepSeconds ?? 0.001, 'timeStepSeconds');
  const positionStep = positive(config.positionStepMeters ?? minimum * 0.001, 'positionStepMeters');
  const angleStep = positive(config.angleStepRadians ?? 0.0001, 'angleStepRadians');
  const routeApi = globalThis.PaintfallTowerRide;
  const track = routeApi.createTrack(T);
  // In the upright reference, the difference between an anchor's Hub and
  // tower-local coordinates is the tower's fixed pivot translation.
  const towerBases = track.towerRotations.map((_, tower) => {
    const index = track.anchors.findIndex(anchor => anchor.tower === tower);
    return track.reference.points[index].clone().sub(track.anchors[index].point);
  });

  const coils = (config.coils ?? []).map(device => {
    const mount = prepareMount(T, device);
    const subdivisions = device.subdivisionsPerEdge ?? 8;
    if (!Number.isInteger(subdivisions) || subdivisions < 1) {
      throw new RangeError(`${mount.id} subdivisionsPerEdge must be a positive integer`);
    }
    const resistance = finite(device.resistanceOhms, `${mount.id} resistance`);
    if (resistance < 0) throw new RangeError(`${mount.id} resistance cannot be negative`);
    const turns = positive(device.turns, `${mount.id} turns`);
    if (!Number.isSafeInteger(turns)) throw new RangeError(`${mount.id} turns must be an integer`);
    return {
      ...mount, resistance,
      turns,
      selfInductance: positive(device.selfInductanceHenries, `${mount.id} self inductance`),
      edges: winding(T, device.verticesMeters, subdivisions, mount.id)
    };
  });
  const magnets = (config.magnets ?? []).map(device => ({
    ...prepareMount(T, device),
    moment: vector(T, device.momentAmpereSquareMeters, `${device.id} magnetic moment`)
  }));
  const devices = [...coils, ...magnets];
  if (!devices.length || new Set(devices.map(device => device.id)).size !== devices.length) {
    throw new RangeError('Supply at least one device and give each device a unique id');
  }

  function placeAll(seconds) {
    track.update(seconds);
    return devices.map(device => {
      const {parent} = device;
      let pose;
      if (parent.type === 'tower') {
        pose = {
          position: towerBases[parent.index].clone(),
          quaternion: new T.Quaternion().setFromEuler(track.towerRotations[parent.index])
        };
      } else if (parent.type === 'car') {
        pose = track.carPose(seconds * 1000, parent.index);
      } else {
        const u = routeApi.arcFraction(track.curve, parent.parameter);
        pose = {position: track.curve.getPoint(parent.parameter), quaternion: track.orientation(u, new T.Quaternion())};
      }
      const mount = mountAt(device, seconds, routeApi.smooth5);
      const position = pose.position.multiplyScalar(scale).add(mount.offset.clone().applyQuaternion(pose.quaternion));
      return worldDevice(device, position, pose.quaternion.multiply(mount.quaternion));
    });
  }

  const coilCount = coils.length;
  const axes = [new T.Vector3(1, 0, 0), new T.Vector3(0, 1, 0), new T.Vector3(0, 0, 1)];

  function geometry(placed) {
    return {
      ...electricalGeometry(placed.slice(0, coilCount), placed.slice(coilCount), minimum),
      ...permanentGeometry(placed.slice(coilCount), minimum)
    };
  }

  function electricalWrench(placed, index, currents) {
    const device = placed[index];
    function workAt(axis, delta, angular) {
      const position = device.position.clone();
      const quaternion = device.quaternion.clone();
      if (angular) quaternion.premultiply(new T.Quaternion().setFromAxisAngle(axis, delta));
      else position.addScaledVector(axis, delta);
      const moved = worldDevice(devices[index], position, quaternion);
      // Only terms involving this device vary. Omitting the constant
      // self-energy also improves the conditioning of the difference.
      if (index < coilCount) {
        if (currents[index] === 0) return 0;
        let linkage = 0;
        for (let j = 0; j < coilCount; j++) {
          if (j !== index && currents[j] !== 0) linkage += currents[j] * mutualInductance(moved, placed[j], minimum);
        }
        for (const magnet of placed.slice(coilCount)) {
          linkage += coilFieldPerAmp(moved, magnet, minimum).dot(magnet.moment);
        }
        return currents[index] * linkage;
      }
      return currents.reduce((sum, current, j) => current === 0
        ? sum
        : sum + current * coilFieldPerAmp(placed[j], moved, minimum).dot(moved.moment), 0);
    }
    const gradient = (step, angular) => axes.map(axis => (workAt(axis, step, angular) - workAt(axis, -step, angular)) / (2 * step));
    return {forceNewtons: gradient(positionStep, false), torqueNewtonMeters: gradient(angleStep, true)};
  }

  function evaluate({seconds, currents = [], currentRates, voltages, includeWrenches = true}) {
    if (finite(seconds, 'seconds') < 0) throw new RangeError('seconds cannot be negative');
    const i = numbers(currents, coilCount, 'currents');
    if (currentRates !== undefined && voltages !== undefined) {
      throw new TypeError('Specify currentRates or voltages');
    }
    const placed = placeAll(seconds);
    const current = geometry(placed);
    const factor = factorInductance(current.L);

    // Stay within a travel/wait window at departure and cycle boundaries.
    const cycleStart = Math.floor(seconds * 1000 / routeApi.CYCLE_MS) * routeApi.CYCLE_MS / 1000;
    const departure = cycleStart + routeApi.DWELL_MS / 1000;
    const boundary = seconds < departure ? departure : cycleStart + routeApi.CYCLE_MS / 1000;
    const start = Math.max(seconds - timeStep, seconds < departure ? cycleStart : departure);
    const end = Math.min(seconds + timeStep, boundary);
    positive(end - start, 'time derivative sample span');
    const before = start === seconds ? current : geometry(placeAll(start));
    const after = geometry(placeAll(end));
    const derivative = (a, b) => (b - a) / (end - start);
    const Ldot = current.L.map((row, j) => row.map((_, k) => derivative(before.L[j][k], after.L[j][k])));
    const psiDot = current.psi.map((_, j) => derivative(before.psi[j], after.psi[j]));
    const W0dot = derivative(before.W0, after.W0);
    const Li = multiply(current.L, i);
    const motionVoltage = multiply(Ldot, i).map((value, j) => value + psiDot[j]);
    const resistiveVoltage = i.map((value, j) => value * coils[j].resistance);
    const drive = voltages === undefined ? undefined : numbers(voltages, coilCount, 'voltages');
    const idot = drive
      ? solveInductance(factor, drive.map((value, j) => value - resistiveVoltage[j] - motionVoltage[j]))
      : numbers(currentRates ?? i.map(() => 0), coilCount, 'currentRates');
    const voltage = drive ?? multiply(current.L, idot).map((value, j) => value + resistiveVoltage[j] + motionVoltage[j]);
    const halfMovingPower = 0.5 * dot(i, multiply(Ldot, i));
    const power = {
      electricalWatts: dot(i, voltage),
      resistiveWatts: dot(i, resistiveVoltage),
      storedEnergyRateWatts: dot(idot, Li) + halfMovingPower - W0dot,
      mechanicalWatts: halfMovingPower + dot(i, psiDot) + W0dot
    };
    power.balanceResidualWatts = power.electricalWatts - power.resistiveWatts
      - power.storedEnergyRateWatts - power.mechanicalWatts;

    const fieldAtMagnets = placed.slice(coilCount).map(magnet => magnet.position.clone().set(0, 0, 0));
    current.fields.forEach((row, j) => row.forEach((field, k) => fieldAtMagnets[k].addScaledVector(field, i[j])));
    const wrenches = includeWrenches ? placed.map((_, j) => i.some(value => value !== 0)
      ? electricalWrench(placed, j, i)
      : {forceNewtons: ZERO.slice(), torqueNewtonMeters: ZERO.slice()}) : null;
    for (const pair of current.pairs) {
      fieldAtMagnets[pair.i].add(pair.fieldAtA);
      fieldAtMagnets[pair.j].add(pair.fieldAtB);
      if (!wrenches) continue;
      for (const [index, sign, field] of [[pair.i, -1, pair.fieldAtA], [pair.j, 1, pair.fieldAtB]]) {
        const j = coilCount + index;
        const torque = placed[j].moment.clone().cross(field);
        wrenches[j].forceNewtons = wrenches[j].forceNewtons.map((value, axis) => value + sign * pair.forceOnB.getComponent(axis));
        wrenches[j].torqueNewtonMeters = wrenches[j].torqueNewtonMeters.map((value, axis) => value + torque.getComponent(axis));
      }
    }

    return {
      seconds, coilIds: coils.map(coil => coil.id), sampleIntervalSeconds: [start, end],
      devices: placed.map((device, j) => ({
        id: device.id, positionMeters: device.position.toArray(), quaternion: device.quaternion.toArray(),
        ...(j >= coilCount ? {externalFieldTesla: fieldAtMagnets[j - coilCount].toArray()} : {}),
        ...(wrenches ? wrenches[j] : {})
      })),
      inductanceHenries: current.L, inductanceRateHenriesPerSecond: Ldot,
      permanentFluxWebers: current.psi, fluxLinkageWebers: Li.map((value, j) => value + current.psi[j]),
      currentsAmps: i, currentRatesAmpsPerSecond: idot, voltages: voltage, motionVoltage,
      coenergyJoules: electricalCoenergy(current, i) + current.W0,
      storedEnergyJoules: 0.5 * dot(i, Li) - current.W0,
      power
    };
  }

  return {evaluate};
}
