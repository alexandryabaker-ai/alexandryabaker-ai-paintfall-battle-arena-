# Procedural character hip connection correction

Owner reported a remaining visible gap between the characters' hips and legs and requested fixing it after the current garden batch.

## Cause and scoped correction

The arena's active procedural factory used an ellipsoidal pelvis above narrow, open upper thigh rings. The pelvis tapered away above the thighs at lateral hip locations, leaving a small visible gap that became more noticeable as legs swung. Kai already had a partial continuous cargo seat, but the articulated thigh openings were still exposed in some poses.

`paintfall-character-hip-joints.js` replaces the existing visible seat's geometry with a closed continuous cargo pelvis and adds a closed, overlapping fabric socket on each existing leg pivot. The waist overlaps the torso and belt; the sockets overlap the upper thigh and pelvis throughout motion. Existing thigh materials are reused. Kai's split trouser colors and reversed companion palette are preserved. Dante's adaptation now includes these fabric sockets along with his other garments.

No new bones, root offsets, limb lengths, movement authority, character heights, faces, hairstyles, approved palettes, imported models or renderer instances were introduced. Nova's procedural fallback remains selected; no Blender assets were edited. The existing character review page accepts `?focus=hips` for close inspection without changing its default full-character view.

## Validation

- `tests/character-hip-joints.cjs`: all eight characters, continuous waist/torso and thigh/socket overlap, front/back/side ray coverage, unchanged pivots/scales/heights, standing/stride/jump/Overload/riding poses and disposal.
- `tests/nova-foot-contacts.cjs`: idle, walk, run, fast run, sideways gallop, Overload and frame-rate contact checks passed.
- `tests/kai-companion.cjs`, `tests/kirin-pickup.cjs`, `tests/core-abilities.cjs`, `tests/character-style.cjs`, `tests/contest-render-alignment.cjs`: passed after the scoped geometry change.
- Browser evidence and actual-arena all-eight check: `art/character-hip-joints-2026-10-30/verification.json`, with front/side/back and Overload close-ups for each character. Refer to the report's `passed` value for the final run outcome.

These checks do not constitute owner artistic approval or a physical iPhone/Safari trial. The protected `contest-safe` and `post-contest` branches remain separate.
