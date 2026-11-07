import {createTowerMagnetics} from './paintfall-tower-magnetics.js';

// Illustrative inputs for the tour. Positions and strengths are demo values.
const metersPerWorldUnit = 0.15;
const demo = {
  metersPerWorldUnit,
  minimumSeparationMeters: 0.025,
  coils: [{
    id: 'Bridge coil',
    parent: {type: 'track', parameter: 9 / 19},
    offsetMeters: [-0.25, 0, 0],
    verticesMeters: [[-.08,-.08,0],[.08,-.08,0],[.08,.08,0],[-.08,.08,0]],
    turns: 10,
    resistanceOhms: 1,
    selfInductanceHenries: 0.001
  }],
  magnets: [{
    id: 'Tower magnet',
    parent: {type: 'tower', index: 1},
    offsetMeters: [0, 4.4, 0.48],
    momentAmpereSquareMeters: [0,0,1.8]
  }, {
    id: 'Car magnet',
    parent: {type: 'car', index: 0},
    offsetMeters: [0.17, 0.17, 0.13],
    momentAmpereSquareMeters: [0,0,0.8]
  }]
};

export function createTowerMagnetPreview(THREE, hub, readout) {
  const model = createTowerMagnetics(THREE, demo);
  const group = new THREE.Group();
  group.name = 'Tower magnet demo';
  hub.add(group);
  const markers = [0xffd773, 0xa9e9ff, 0xff92e3].map((color, index) => {
    const marker = new THREE.Mesh(
      index === 0 ? new THREE.TorusGeometry(.43, .12, 8, 24) : new THREE.BoxGeometry(.54, .54, .54),
      new THREE.MeshBasicMaterial({color})
    );
    marker.name = ['Bridge coil', 'Tower magnet', 'Car magnet'][index];
    const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.6, color, .42, .28);
    group.add(marker, arrow);
    return {marker, arrow};
  });
  let previous = -Infinity;

  function update(seconds) {
    if (Math.abs(seconds - previous) < 0.12) return;
    previous = seconds;
    try {
      const sample = model.evaluate({seconds, currents: [2]});
      sample.devices.forEach((device, index) => {
        const {marker, arrow} = markers[index];
        marker.visible = true;
        marker.position.fromArray(device.positionMeters).divideScalar(metersPerWorldUnit);
        marker.quaternion.fromArray(device.quaternion);
        arrow.position.copy(marker.position);
        const force = new THREE.Vector3().fromArray(device.forceNewtons);
        arrow.visible = force.lengthSq() > 1e-24;
        if (arrow.visible) arrow.setDirection(force.normalize());
      });
      const carForce = Math.hypot(...sample.devices[2].forceNewtons);
      readout.textContent = `Car force ${(carForce * 1e6).toPrecision(3)} µN · Bridge motion voltage ${(sample.motionVoltage[0] * 1e6).toPrecision(3)} µV`;
    } catch (error) {
      for (const {marker, arrow} of markers) marker.visible = arrow.visible = false;
      readout.textContent = 'Magnetic reading paused at this position.';
      console.warn('Tower magnet preview', error);
    }
  }

  function dispose() {
    group.removeFromParent();
    for (const {marker, arrow} of markers) {
      marker.geometry.dispose();
      marker.material.dispose();
      // ArrowHelper shares its geometry across instances.
      arrow.line.material.dispose();
      arrow.cone.material.dispose();
    }
  }

  return {update, dispose};
}
