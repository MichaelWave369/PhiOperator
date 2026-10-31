# ΦOperator Rung 6 | The Operator's World

## Three sectors × three rooms = nine playable rooms

| Sector | Rooms | Story outcome |
| --- | --- | --- |
| 1 Signal | Operator Atrium, Switch Bay, Signal Relay | Local dashboard, internal LAN and communication route |
| 2 Recovery | Archive Vault, Repair Workshop, Cooling Core | Recovery evidence, power and cooling |
| 3 Evidence | Calibration Chamber, Evidence Ledger, Central Nexus | Reproducible measurements, audit trail and final checks |

The nine primary rooms form a connected route with additional corridors
between sectors. Rooms unlock when preceding rooms have a completed result,
but the final **verified** recovery requires actual evidence-led in-game
repairs rather than simply clicking absurd options.

Three terminal checks in the Central Nexus:
1. Communications: Atrium + Switch Bay + Relay must be sound
2. Recovery: Archive + Workshop + Cooling must be sound
3. Evidence: Calibration + Ledger must be sound

Each sound action requires inspecting the relevant component first. Decoy
actions preserve state and explain the false lead. Chaos options advance the
story but record a **fictional** failure rather than verified repair; they
can be revisited and corrected. Three distinct Chaos actions reveal the
secret Department of Preventable Incidents. The optional annex is not a
tenth primary room and adds no privileged software powers.

The deterministic assistant PATCH-9 reacts locally to events. It is not a
real local/remote inference system, nor does it read hardware.

## Saving and medals

The World uses local storage key phioperator.world.v1 and its own
format phioperator-world, version 1. Saves may be exported and imported as
a bounded (<16 KiB) JSON document. No cloud account exists. The engine
validates rooms, status enums, inspection targets, log sizes, phase count,
mode and Chaos history. Invalid imports cannot overwrite a running session.
Blocked local storage still permits in-memory play and manual export.

World progress is deliberately independent of the original PhiOperator
Passport. Only completed **perfect** endings add a cosmetic medal to the
optional Passport v1 Academy extension:
- World standard: Facility Restorer
- World chaos: Unionized Toaster Negotiator

The validator now permits the known World lab ID in addition to the
original three lab IDs, with at most eight records. Existing exam rank
results and standard/chaos separation remain untouched.

**Compatibility warning:** Older pinned Passport SDK copies in the
Gen.E.Wrist / PhiOS / PhiOS-Mobile hosts may accept the v1 file and retain
ranks, but can discard Academy badge metadata on re-export. Retain the
original full PhiOperator Passport export until those importers are upgraded.

## Browser smoke test

1. Open PhiOperator → Enter Operator Academy → Enter Operator's World.
2. Verify exactly 3 sectors, 3 rooms each, 5 subsystem status indicators,
   nine primary map entries and initial movement gates.
3. In Atrium, inspect the Coffee Machine and attempt Rebuild Status View;
   it should request inspection of the relevant panel.
4. Inspect Status Panel. Apply Rebuild Status View, then move to Switch Bay.
5. Complete the eight prerequisite sound repairs by reading equipment clues
   and selecting matching tools. Indicators change from PENDING to VERIFIED.
6. Enter the Nexus. Attempt sound checks before inspection, then inspect
   each of Comms, Power and Evidence. Confirm verified ending, medal and
   that Ascension exam ranks did NOT change.
7. Export Passport; reload; confirm World medal persists.
8. Export a World save and import it after a reset; confirm position,
   completed rooms and signal indicators are restored.
9. Start a new Chaos World, select three unique fictional absurd actions,
   enter and leave the Complaints Annex, then finish Nexus through Chaos
   options and verify the separate Chaos medal.
10. In a mixed ending, replay only the Nexus; do not erase sector work.
11. Try invalid JSON, duplicated inspections and oversized imports;
    reject them without changing current state.
12. Test keyboard-only interactions, narrow viewport, reduced motion,
    blocked local storage, and refresh. No web API calls, OS commands
    or real device permissions are allowed by the World simulator.

### Safety model

All racks, routes, power, drives, and calibration data are fictional
hard-coded content. This code never connects to a network, runs scripts,
modifies system configuration, uses inference servers, accesses accounts,
or requests elevated privileges. No user can lose access to essential
PhiOS or PhiOperator functions by skipping the game.

Continuous integration runs node syntax validation and deterministic unit
tests. The full end-to-end browser, Quest headset and phone hardware tests
are **not** part of this PR and require a real smoke test before those
environments are declared qualified.
