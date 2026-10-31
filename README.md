# Φ PhiOperator

**The Operator's Test, Ascension Protocol and the Operator Academy.**

A playful, offline-first training experience inspired by classic Sierra-era adventure-game puzzles. The machine does not punish ignorance. It rewards curiosity.

## Rung 2: Ascension Protocol

- 3 disciplines: Observe, Verify, Recover
- 6 progressively available ranks
- 9 trials per rank, 3 per discipline: 54 unique scenarios
- 2 modes: Standard practice and a deliberately absurd, clearly fictional Chaos simulation
- Offline Operator Passport: stored locally where possible, exportable/importable as versioned JSON
- Real PhiOperator color-theme unlocks
- Cross-app reward IDs are defined. The ΦSURF/Gen.E.Wrist browser adapter is proposed in a separate PR; DomistikaXR and PhiServe adapters remain future work.
- No telemetry, accounts, third-party JS, network requirement, or runtime dependencies

Open index.html in a browser or host the repository on GitHub Pages. When serving locally, run:

    python -m http.server 8000

Run automated checks with Node 20+:

    npm run check
    npm test

## Rung 3: Universal Operator Passport Bridge

The PhiOperator browser now includes a **manual transfer path to the Gen.E.Wrist browser console**. After clearing Standard Rank 2, export your Passport JSON from the Ascension page, then visit Gen.E.Wrist → Device Settings → Operator Passport Bridge to import it.

- Rank 2: optional ΦSURF Operator Shortcuts wheel and visual dial accent.
- Rank 3: optional Gen.E.Wrist pulse cosmetic.
- The Gen.E.Wrist adapter is implemented separately in its own GitHub PR and must be merged/deployed there before the transfer works.
- No automatic cloud sync, cross-origin storage reads, hidden data transfer or increased permissions. Passport achievements are **not security credentials**.

Follow [docs/bridge.md](docs/bridge.md) for the exact transfer procedure.

## Rung 4: Universal Passport SDK and Operator Academy

- Zero-dependency portable SDK at src/portable-passport.js, usable as an offline, pinned file by any compatible web/PWA host.
- Three interactive, local-only training labs with three stages and three choices per stage: network diagnosis, restore/rollback and evidence verification.
- Separate Chaos simulation scoring, with the correct real-world lesson visible after each answer.
- Academy practice does not modify your rank, Passport format, system permissions, or host capabilities.
- Browser/PWA adapters for PhiOS and PhiOS-Mobile are proposed in separate PRs. Native PhiOS authorization and Android HOME remain untouched.

See [Portable Passport SDK](docs/sdk.md).

## Rung 5: Living Operator Academy

**Three interactive incident theaters** now appear inside the Operator Academy in addition to the classic three-stage exercises. Each has **six clickable virtual components**, three disciplined phases (Observe / Verify / Recover), and three virtual tools per phase.

- **Disappearing Internet:** inspect laptop, access point, gateway and VPN route; diagnose the path and repair it in a fully simulated rack
- **Backup Goblin:** investigate a broken deployment, validate the backup in an isolated fictional sandbox, and roll back safely
- **Confident Oracle:** inspect sensor drift, run null controls and report a reproducible negative result

Inspect the relevant device to reveal an evidence clue before choosing the sound tool. False leads preserve the scene so you can recover. Chaos actions produce silly branching consequences, including a union representative for the router. Nothing operates real equipment, runs shell commands or modifies your files.

A perfect three-phase run earns an Academy badge. Standard and Chaos badges are separate. Academy progress is stored as an **optional sanitized extension** in the same offline **PhiOperator Passport JSON version 1**; the canonical 54-question rank progression and all essential access remain unchanged.

Other apps using earlier pinned SDKs can still read rank results but may strip the new optional badge extension when re-exporting, so keep the PhiOperator export as your full backup until their adapters are updated.

See [Living Academy safety and testing](docs/living-academy.md).

## Rung 6: The Operator's World

A **connected nine-room facility** now lives inside the Operator Academy. Explore three sectors, with three rooms in each: Signal, Recovery and Evidence. Repair the Atrium, Switch Bay, Relay, Archive, Workshop, Cooling Core, Calibration Chamber and Evidence Ledger before proving all systems in the three-step Central Nexus.

- **Physical map logic:** visit adjacent unlocked rooms; fixing or simulating a preceding station opens the next room. No teleporting through locked doors.
- **Persistent consequences:** the map reflects actual training outcomes. Communications, backup, power/recovery and provenance indicators only show verified when the correct upstream fictional repairs have occurred.
- **PATCH-9 companion:** a locally scripted, sarcastic guide reacts to discoveries, recoveries, mistakes and fictional Chaos disasters. No AI service or network connection.
- **Secret Chaos annex:** three different absurd actions reveal the Department of Preventable Incidents, whose human resources officer is apparently a toaster.
- **Final 3-part Nexus:** verify communications, recovery and evidence. Missing upstream proof blocks a sound certification, while Chaos choices generate a separate ending.
- **Save and restore:** auto-save this fictional facility in local browser storage, with manual JSON export/import and a clean reset. World saves are independent of the main Operator Passport.
- **Traveling medals:** perfect standard or Chaos endings add an optional cosmetic World badge to the existing Passport v1 Academy extension. The original 54 exam questions, 6 ranks, and 3 Living Labs remain unchanged.

Start via **Operator Academy → Enter Operator's World**. Choose Standard or Chaos. No actual IP addresses are probed, no commands run, and no real system configuration is touched.

**Compatibility note:** Older host apps can still read the v1 Passport rank results but may strip the expanded Academy extension when re-exporting. Export a full Passport from PhiOperator as your preserved copy until consumer SDKs are upgraded.

See [Operator World guide and acceptance checklist](docs/operator-world.md).

## SDK example

    import {
      createPassport, createTrialSession, currentTrial, submitTrial,
      recordTrial, listRewards, serializePassport
    } from './src/index.js';

    let passport = createPassport();
    let trial = createTrialSession(1, 'standard');
    while (currentTrial(trial)) {
      trial = submitTrial(trial, currentTrial(trial).correctId);
    }
    const outcome = recordTrial(passport, trial);
    passport = outcome.passport;
    console.log(listRewards(passport).filter(x => x.unlocked));
    console.log(serializePassport(passport));

See docs/ascension.md and docs/integration.md for safe integration guidance.

## Operator's Charter

1. Be curious, not cruel.
2. Let people learn and retake without lockouts.
3. Never use quiz results as authorization, intelligence assessment, account standing, identity, or access control.
4. Keep essential navigation, accessibility, support, and emergency functions available to all.
5. Passports are local and user-editable; hosts must independently enforce permissions for real actions.
6. Rewards are optional cosmetics, learning content, and creative extras.

MIT licensed, 2026 Φ369 Labs / MichaelWave369.