# Password recovery, Kirin pickup and bot movement — October 30

Owner requested these three focused fixes for the current public submission build. No character redesign, other unfinished feature, branch merge, hosting upgrade or paid service is included.

## Password recovery

The existing accounts store player names, hashed passwords and private profiles, but no email addresses or email-delivery service. Added **Forgot password?** using an offline recovery code rather than pretending to send reset emails. Registration shows the code once. Existing signed-in players can use **Account recovery**, confirm their current password, and save a replacement code.

Codes contain 192 random bits; only a domain-separated SHA-256 hash is stored in a separate SQLite table. Reset requires the correct player name and saved code, keeps profile/progress/cohort intact, hashes the replacement password with the existing scrypt policy, atomically consumes/replaces the code, and revokes all account sessions. Concurrent replay cannot claim the same code twice. Failed attempts are throttled and use the same response for unknown accounts and incorrect codes. Same-origin, JSON size limits and no-store responses remain enforced. No reset logs a player in automatically.

No code or email verification can recover an old account without prior proof of ownership. Players who have neither their password nor an earlier saved recovery code can use guest play; there is no name/birth-year bypass. Free-host ephemeral SQLite storage remains unchanged: recovery does not restore an account lost after host sleep/restart/redeployment. Codes are not put in localStorage, URLs, shared room state, screenshots or logs.

## Nova and Kirin

Root cause: the active arena renderer always placed Kirin in an overhead orbit with `riderMounted:false`. Nova's ability progressed through energy depletion/recovery but had no authoritative pickup/mount path.

The existing 22-second spending phase now leads into a four-second descent. Kirin automatically picks Nova up, ascends over four seconds, and restores her energy over the existing depletion-dependent 162-second recovery. The server publishes the same ride state to desktop, mobile and observers. The existing procedural Nova stays active. The renderer places her in a seated pose over Kirin, enables the already-approved rainbow mane transfer, and softens the upper-back energy rays through the existing rider flag.

Keyboard L or the existing airborne touch LAND action uses Splash Landing and opts out of further pickup for that ability. Recovery completion uses that same safe descent. Round reset clears the ride; world-map travel opts out and clears it. Steering remains available in flight; paint remains harmless. Kai's separate consent/energy-sharing gameplay is not implemented by this Nova pickup correction.

## Bots

Root cause: the browser-only bot brain generated detached decisions for a separate local roster; server bots had no locomotion or action loop. Refactored that existing brain to a shared module, preserving its Scout, Guardian, Tactician, Rusher and Trickster profiles. The server now thinks, patrols, investigates, flanks, repositions, retreats and requests paint shots based on those profiles. Browser status observes actual server decisions instead of running competing local bots.

Movement uses human movement/collision/boundary rules, bounded speeds, periodic thinking, short obstacle detours, and an escape direction when a bot and target share a spawn. Lobby and unavailable riders pause. Targets must be alive in the same region; explicit teammates are excluded from attacks. Paint shots are range-limited, obstruction-checked, rate-limited and non-injurious. This is basic reactive navigation, not a finished navigation mesh or complete long-term AI simulation.

## Verification

- 38 existing release checks passed: `art/submission-readiness/2026-10-31T00-54-52-680Z/report.json` (UTC timestamp; local date October 30).
- `tests/account-recovery.cjs`: ownership, replacement and single-use codes, concurrent claims, session revocation, generic failures, password policy, origin checks and throttling.
- `tests/kirin-pickup.cjs`: recovery timing, descent/mount, seat placement, visible energy transfer, dismount/opt-out and safe completion.
- `tests/bot-gameplay.cjs`: role differences, movement, same-region/team targeting, speed/collision rules and pause guards.
- `tests/recovery-kirin-bots-browser.cjs`: actual account recovery screens and new-password sign-in, existing-account code generation, two moving bots in a real shared room, desktop K and touch Ability pickup, seated energy transfer, and safe touch LAND. WebSocket desktop + HTTP compatibility phone emulation. No page errors. Evidence: `art/recovery-kirin-bots-2026-10-30/verification.json`, `kirin-desktop.png`, `kirin-phone.png`.

These are automated browser tests, not a physical iPhone/Safari test or owner visual approval. The owner still reviews the public update and personally submits the contest entry.
