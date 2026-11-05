# PAINTFALL Towers route correction — testing only

The owner clarified the intended route: climb one tower, cross to the other tower, then descend that other tower. The previous implementation climbed and descended each tower separately. The older saved notes specified a connected train scaling the twin tilting towers, without a sufficiently explicit crossing plan; that implementation should not have been represented as confirmation of the precise original route.

The corrected continuous route has one ascent along the left tower’s rear facade, a crossing above the rooftops, and one descent along the right tower’s front facade, followed by the ground return. Tower-local anchors preserve the climb/descent as the two buildings tilt in opposite directions. The existing train, renderer, collision barrier and passenger-boarding status are preserved. The initial track frame is upright at the station and shared by rails, ties and coaches. The name sign is offset so it does not cover the rooftop connection.

`public/paintfall-towers-coaster-track.js` generates the route and moving rail geometry. `public/paintfall-arena-nevada-parks.js` supplies the existing train and sign. No separate renderer, imported asset or character change is introduced.

Verification covers 1,600 movement steps, actual train direction beside each facade (left: ascending only; right: descending only), high rooftop anchors, both towers’ opposite tilt, tower-body clearance of sampled coach vertices, finite geometry, the closed track envelope and reused rail buffers. Existing Nevada park movement, entry/bench accessibility and disposal checks also pass. Browser previews verify the corrected route in the shared world renderer, changing rails, two desktop angles, phone-size layout and one canvas. Physical phone play and owner visual approval remain pending.

Review: https://paintfall-testing.onrender.com/arena-world-tour.html?place=state%3ANevada&view=hub

These are still unoccupied track tests. Boarding, passenger physics, tower interiors and paint-bucket effects are not completed by this correction. Only `codex/testing-paintfall` is updated; the main game, `contest-safe`, `post-contest`, Kirin and Racin’ Park vehicle behavior are unchanged.
