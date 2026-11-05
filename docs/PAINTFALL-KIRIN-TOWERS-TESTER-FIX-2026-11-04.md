# Tester fixes: Kirin pickup and Towers Coaster motion

## Kirin pickup failure

Reproduced on the hosted tester using a touch-enabled, phone-sized browser. Ordinary stationary Overload reached Kirin flight, but jumping and using LAND before recovery left Nova grounded with no pickup. The server called `novaAbility.stopRide` for normal splash landings and world-map drops; that function marked the entire activation as `kirinDeclined` even when no Kirin ride existed.

The fix only opts out when Nova leaves an existing Kirin flight. A normal jump landing or pre-pickup map drop no longer declines her future ride. If an approaching pickup is interrupted, the next attempt gets a fresh four-second approach. The renderer follows that attempt’s server start time so Kirin visibly descends again instead of instantly appearing at ground level. Intentional dismount from an active flight still prevents repeated remounting. Existing energy-recovery timing, safe descent, colors, character model and abilities remain unchanged.

## Towers Coaster correction

The initial Nevada arena installation had static towers and a separate freestanding track. That omitted the approved twin-tower motion and the train scaling the tower surfaces. A new geometry helper builds oppositely tilting tower pivots and a continuous route with climbs and descents anchored to the front/back facades. Rails, ties and the empty train follow the same changing curve, including the tower tilt. Geometry buffers are reused instead of allocating and disposing rails every frame.

This is still the unoccupied track-testing phase. Boarding, passenger physics, playable tower interiors, paint-bucket timing and coaster-network links are not implemented by this correction. The existing visitor barriers/collision footprint are unchanged, and the complete moving track remains inside the reserved area. This does not claim finished passenger clearance approval.

## Validation

- Hosted pre-fix reproduction: normal pickup passed; early jump landing failed.
- Fixed local phone-sized browser: normal, early landing and early world-map travel all reached server-authoritative Kirin flight, seated rendering and rainbow transfer.
- Unit checks: pre-pickup LAND/travel, interrupted/restarted approach, actual render descent, intentional no-remount, energy recovery and safe landing.
- Tower checks: 1,600 animation steps, opposite tilt, tower-local anchors, track envelope, train climb/descent beside the facade, no sampled test-car vertices inside either tower body, and no per-frame rail geometry replacement.
- Actual arena renderer: visible changing tower rotations and rail vertices, one renderer, desktop and phone-size views.
- Existing Nevada site and 255-garden regression checks passed. No collision catalog change is needed because the same closed test areas contain the complete motion envelope.
- Physical phone playtest and final artistic review remain with the owner.

Only `codex/testing-paintfall` and its separate hosted tester are targeted. The main release and protected `contest-safe` branch remain unchanged.
