# PAINTFALL submission candidate

Internal readiness target: October 29, 2026 (October 30 backup), so the owner can take a break. The supplied screenshots and official PDF specify October 30, 2026 at 11:59 p.m. Pacific. Submit through Handshake's Create a Multiplayer Game mission with title, cover image, description and public URL. See `CONTEST_RULES.md` for the sourced checklist, content review and the differing date on the mission's marketing page. This guide is not the organizer's rules.

## Running the source candidate

Use Node.js 24. Install dependencies with `npm ci`, then run `npm start`. Open the server address in a browser; its default port is 10000. A multiplayer host supporting WebSockets is required. This is not a static-site-only game.

The package intentionally contains no user accounts, passwords, sessions, personal player database, environment secrets, node_modules, Git history, development screenshots or private account backups. Create a disposable account or choose guest play to test a fresh installation. The runtime writes `.paintfall-data/accounts.sqlite` by default. On a published host, point `PAINTFALL_DATA_DIR` to persistent private storage and configure HTTPS; use `PAINTFALL_TRUST_PROXY=1` only behind a trusted HTTPS proxy.

## Current demo path

1. Sign in or create a test account, or choose Play as guest. Birth year selects the self-reported server cohort; it is not age verification.
2. Skip or complete the optional questionnaire.
3. Choose a hero and arena in the Gaming menu. Create a private party room; another browser in the same cohort can join using its room code.
4. The host starts the match. Test movement, camera, jumping, paint play and leaving the match. The match is an early prototype: automatic end-of-round/time-limit behavior and bot intelligence are not complete systems.
   Press K or Ability for the selected hero's current ability. All eight procedural heroes have connected ability paths. These remain prototype mechanics with further owner visual review planned; the selected room cooldown applies.
5. Return to the menu to explore the world or browse Coming soon parks. Construction previews are work in progress, not playable attractions.
6. In an arena with existing wildlife, approach an animal to use Animal friends, including Tell me a joke. Eligible bull characters offer an optional short, harmless ride with Hop off. Other animal mounts and voice acting remain separate work. Signed-in encounters save in the host's database; guest memories last for that page.
7. Use WORLD MAP / TRAVEL during a match to change destination while retaining the room and progress. Friends choose independently and meet by selecting the same destination. Private Family Rooms support mixed-age invited play with adult host approval.

## Verification before publication

Run `node tools/check-submission.cjs` from the development workspace. The latest report is in `art/submission-readiness/latest.json`; it uses disposable accounts and a separate database. The expanded suite covers 38 account, controller, movement, camera, character ability and real WebSocket checks. Separate browser tests cover phone touch/release, reconnecting, Family Rooms, optional bull riding and active-match travel. Physical phone review remains separate.

Before submission, still verify: the organizer's actual rules and eligibility; a fresh browser joining the published game; persistent saves after a hosting restart; physical iPhone Safari/Chrome controls; a second real-device player; final character/rendering review; acceptable performance; organizer-required media/credits; and the final public URL. Do not describe concepts, regional foundations or construction previews as fully finished game areas.

## Work preserved and recovery

The development source remains the editable working project. Candidate folders are copies under `art/submission-candidates/`, with SHA-256 source manifests and automated-check results. Making a candidate does not commit, push, deploy or submit it. Private account backups, when taken, stay inside the ignored `.paintfall-data/backups/` directory and must never be added to a public package.

Recovered `PAINTFALL_RULES.md` came from saved revision `8565b4b` and contains the development Rules Bible, not the contest organizer's official submission terms. User review and approval remain outstanding; no build is locked or approved merely because tests pass.
