# Living Operator Academy, Rung 5

## Mission

Turn the Rung 4 three-question exercises into a fictional diagnostic workspace:
inspect gear, examine clues, choose tools, see cause-and-effect changes and
earn playful training badges. Learn a real methodology without running
commands against real equipment.

3 × 3 × 3 architecture:
- 3 environments: network rack, recovery bay, evidence lab
- 3 phases: Observe, Verify, Recover
- 3 available tools per phase: evidence-led action, false lead, comedic Chaos

Each environment shows SIX virtual components and an event log. Inspections
expose stage-specific facts, and the evidence-led tool requires inspection of
the relevant target. False leads show educational feedback without advancing.
Evidence-led or Chaos decisions advance to different simulated consequences;
mixing strategies earns a different final report. There is no real IP probing,
network connection, privilege escalation, file deletion, backup restoration,
model execution, or device control.

A complete 3/3 Standard run earns its lab's Standard badge; a complete 3/3
Chaos run earns a separate joke badge. Partial attempts are recoverable, with
replay. These are entertainment/training achievements, never security
credentials or automatically enforced capabilities.

## Passport compatibility

The canonical format remains phioperator-passport, version 1, with
results unchanged. At most one optional extension is retained:

    "extensions": {
      "phioperatorAcademy": {
        "version": 1,
        "badges": [
          {"lab": "network", "mode": "standard", "bestScore": 3}
        ]
      }
    }

- Three known IDs: network, restore, evidence
- Two modes: standard, chaos
- Best score integer from 0 to 3; maximum six records
- Exact duplicate lab/mode entries, unknown lab IDs, wrong versions and
  malformed shapes are rejected
- Extension sanitized and bounded by the existing 16 KiB import limit
- Unknown extensions discarded, never blindly trusted
- Original Passports without extensions roundtrip identically
- The Rung 5 portable SDK preserves this known extension

**Important:** Existing Rung 4 consumer copies of the SDK in other repos
accept a v1 Passport and process rank scores, but may drop optional Academy
extensions if re-exported from those apps. Keep the original exported
PhiOperator file until consumer upgrades land.

## Manual browser acceptance

1. Load the original nine-question test and six-rank Ascension page.
2. Enter Academy. Confirm original three-question simulations still work.
3. Enter Living Lab → Network in Standard mode.
4. Inspect Access Point first. Try the sound action; it must request evidence.
5. Try the false lead. Stage stays put and feedback explains why.
6. Inspect Field Laptop; select Compare Local vs Upstream. Stage 2 appears.
7. Inspect VPN Profile, compare routing table, then inspect Field Laptop
   and remove stale route. Finish with recovery and 3/3 badge.
8. On Passport page confirm Signal Restorer earned, but Ascension ranks did
   not advance. Export JSON, reload/import. Badge survives.
9. Repeat in Chaos mode and earn a separate Chaos badge. Simulation never
   actually affects devices.
10. Complete Backup Goblin and Confident Oracle, keyboard focus, small phone
    viewport, reduced motion, blocked storage and malformed JSON.
11. Import an older v1 Passport without extensions and confirm it still works.
12. Confirm no actual network calls, shell commands, external scripts,
    privileged APIs, microphone/camera or other permissions.

Unit tests cover all three labs, branching, wrong-target evidence, false
leads, both modes, and achievement persistence. This repository does not
currently run a complete automated browser test suite. No headset or
physical phone hardware test is claimed.
