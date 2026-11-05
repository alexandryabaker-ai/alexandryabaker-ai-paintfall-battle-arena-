# Nevada World Hub and Racin’ Park — first arena installation

The owner asked to begin adding World Hub and Racin’ Park to PAINTFALL after the garden release. This first installation uses the saved Nevada park studies and approved relative placement: World Hub in the central basin and Racin’ Park to its northwest. This is the first state pair, not worldwide park completion.

## Available now

- Two explorable visitor plazas in the actual Nevada regional arena, with entrance arches, spectator benches and Story Mode seat anchors.
- PAINTFALL Towers, the saved Towers Coaster track study, a Fountain of Art and the rooftop SKYFALL station structure in the Hub.
- Three separately spaced Nevada car-train lift/drop/loop studies in Racin’ Park, with four unoccupied moving test trains across both sites.
- Named World Hub and Racin’ Park visitor-plaza choices in the existing world-map drop selector. These are the Nevada region’s last two safe drop points and use the existing authoritative travel operation; no additional room or networking protocol.
- World Hub and Racin’ Park camera buttons in the world tour, plus arena-site links in the park progress page.

Visitor plazas are open; tracks are visibly fenced for testing. Boarding, sky flight, belt fastening interactions, inter-park/coaster travel and drivable vehicles are not enabled. The established instruction to check local rides before connecting the coaster network is preserved. Ready-Set-Paint-Race, monster-truck Paint Splatter Cars, the second Hub sky station and The Paint Ride....Against Time are labeled future construction, without inventing finalized designs.

## Implementation

`paintfall-arena-nevada-parks.js` takes the existing Three.js object and builds into the existing regional group. It creates no renderer or alternative player factory. It adapts the saved Nevada Towers Coaster and three lift/drop/vertical-loop track studies from `paintfall-nevada-build.js`; the original construction preview is preserved. Racing track widths are compressed into three distinct bays to keep the lanes separated. All moving cars are empty and for visual testing, not an assertion of finished ride physics or mph.

Nevada alone expands its shared movement bound from 70 to 180 world units, reserving space outside the existing scenery. Existing Nevada homes/animals are retained. Terrain, visible boundary, browser surface metadata, server collision catalog and named entry points use the same larger footprint. Other 304 region entries are unchanged, including all 255 country gardens. No server logic, character assets, mobile input or account files change.

## Verification

- Geometry/path tests: finite transforms, fewer than 600 park meshes, two sites, two reachable bench approaches per site, unobstructed named entry points, four moving trains, separated racing bays over 400 frames and resource disposal.
- Full regional suite: 305 destinations, 4,880 safe spawns, 122,000 collision steps and existing two-client destination authority checks passed.
- Garden regression: 255 foundations and 510 garden benches remain intact, with matching scene/server collision geometry.
- Browser checks: both park views, phone-sized view, actual local-room entry and travel to both named park drop points, shared collision metadata, a single arena renderer, room retention and return to Vietnam passed.
- Screenshots and local results: `art/nevada-arena-parks-2026-11-04`.
- This does not claim a new physical-phone playtest, completed ride dispatch, track clearance approval for passengers or owner artistic approval of this installation.

## Saved design basis

See `PAINTFALL-NEVADA-PLACEMENT-DRAFT.md`, `PAINTFALL-WORLD-DESIGN.md` and `PAINTFALL-VEHICLE-ATTRACTION-PLAN-2026-10-09.md`. This first stage adds no new real-world attraction or speed claims and preserves the existing regional research.
