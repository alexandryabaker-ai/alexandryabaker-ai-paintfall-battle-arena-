# First playable PAINTFALL Towers Coaster — testing only

The owner approved moving on to boarding after visually accepting the up-one-tower, rooftop-crossing, down-the-other route.

## Player flow

Use guest entry or a testing account, choose **Nevada**, and select **Towers Coaster boarding platform** in the existing arena drop selector. This new seventeenth drop is outside the closed track barrier. Players can also walk there from the World Hub plaza. At the purple marked platform, **Board Towers Coaster** appears when the train is accepting riders. Six seats are assigned by the room server across the existing three passenger cars.

Initial testing timing: ten seconds stopped at the station (boarding closes one second before departure), followed by a thirty-second loop. These are game timing choices, not real-world mph or g-force specifications. The train scales the left tower, crosses the rooftops and descends the right tower while both towers tilt. The existing character is seated in its assigned car with a visible lap belt. Third-person orbit and optional first-person view remain available.

After one loop the server returns riders to clear ground beside the platform. **Return to platform** also provides an immediate safe early exit. The existing world-map travel can cancel a ride. This first version uses a platform return rather than a midair freefall. Players are never forced to board.

## Implementation

- `paintfall-tower-ride.js` supplies shared route anchors, moving curve mathematics, seat placement and cycle timing. The existing browser Three.js instance is passed in; the server reuses the same vendored module for mathematics only. There is no additional client renderer or Three.js copy.
- `paintfall-coaster-ride.cjs` owns distance checks, stopped-train boarding, six-seat exclusivity, position updates and safe unloading. Movement, jumping, landing and Overload activation cannot take control of a seated rider. Active Overload must finish before boarding, preserving Kirin and the established ability state machines.
- `server.js` publishes the shared room ride clock and assigned seats. Disconnect frees a seat, round reset clears rides and map travel cancels boarding/ride state.
- The existing parks builder synchronizes the train and tilt to that clock. The existing actor is attached to the matching car while seated, then detached before a regional scene is disposed. Its appearance, height and fallback model are unchanged. Seat backs sit behind passengers and lap belts remain above the carriage floor.
- The normal movement predictor suppresses walking only while seated and resumes after exit. Touch movement is reset on boarding/exit to avoid retained stick input.

## Verification

Local checks cover six distinct seats, refusal from far away or while the train is moving/full, two guest players sharing ride state, control ownership, disconnect and map-travel cleanup, a complete loop with automatic exit, early exit, resumed walking, first/third-person views, phone-sized touch boarding, one canvas and unchanged health/score without combat. All eight current character bodies and hairstyles clear the towers at 120 sampled positions. Existing Nevada track/entry/disposal, Racin’ Park identity/spacing and Kirin checks are also required before publication.

Automated browser dimensions/touch emulation are not a physical phone playtest. Owner ride feel and visual approval remain pending.

This is only the Towers Coaster on `codex/testing-paintfall`. Racin’ Park boarding, drivable go-karts, monster-truck bumper cars, other sky coasters, world coaster connections, tower interiors and paint-bucket effects remain unfinished. Main hosted game, `contest-safe`, `post-contest`, garden designs and character designs are unchanged.
