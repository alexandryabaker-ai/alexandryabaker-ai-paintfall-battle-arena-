# Nevada Racin’ Park coach refinement — testing only

This step follows the owner’s saved appearance/performance pairings in the world design notes:

| Original PAINTFALL coach family | Appearance inspiration | Saved performance inspiration |
| --- | --- | --- |
| Angular wedge | Lamborghini | Ford Mustang |
| Wide muscle | SRT Hellcat | Chevrolet Corvette |
| Long bonnet | Rolls-Royce Wraith | Toyota GR86 |

These are original, open, two-seat car-train bodies with different noses, bonnets, grilles and trim, padded seats, lap/shoulder belts, painted accents, wheel silhouettes, train couplers and coaster running gear. They use the existing Three.js instance and character/world renderer. Static coach details are merged by material to keep the park within its existing mesh-count budget.

Specific model years/trims and final ride names are still unconfirmed. No real horsepower, mph, vehicle dynamics or physical g-force values are assigned by this change. The paired performance names are recorded as design intent, not implemented vehicle simulation.

The three empty trains use separated lift/drop/loop routes, gradually increase their visual pace and trade the lead. Their orientation and track banking share an upright-at-station transported frame. Gentler bends and raised running gear prevent the rails cutting through the bodies. Ground columns are omitted from inverted sections so they do not run through the coaches. This remains a visual track study, not a passenger ride or a structural engineering approval.

## Review

The world tour adds **Car-trains close-up (paused)** with a selector for all three bodies. Inspection pauses only the tour’s scene. Leaving it resumes the moving preview; actual arena trains keep running. The same park builder supplies both the tour and actual game.

`https://paintfall-testing.onrender.com/arena-world-tour.html?place=state%3ANevada&view=racers`

Local checks cover the approved pairings, different body geometry, belts, upright station pose, pause/resume, rail/body clearance sampled around the full loop, finite geometry, 850 motion steps, separate racing bays, progressive pacing, all three taking the lead, reachable park entries/benches, disposal, one canvas and phone-size layout. Hosted checks follow deployment. Physical phone play and artistic approval remain with the owner.

## Deliberately unfinished

Boarding, passenger restraints/controls, race scoring, sky travel and cross-world coaster travel are not enabled. **Ready-Set-Paint-Race** go-karts and **Paint Splatter Cars** monster-truck bumper cars still have reserved, named spaces only; neither is drivable yet. Do not report those vehicles as finished.

This update belongs only to `codex/testing-paintfall`. The protected `contest-safe` and `post-contest` branches, main hosted game, characters, gardens, multiplayer and Kirin ability code are not changed.
