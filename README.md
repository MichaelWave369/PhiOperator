# Φ PhiOperator

**The Operator's Test and the Ascension Protocol.**

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