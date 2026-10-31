# PhiOperator Ascension Protocol, v0.2

## Structure

Three learning disciplines (Observe, Verify, Recover), six ranks, and nine scenarios per rank (three per discipline) make **54 distinct trials**. The original nine questions form Rank 1; ranks 2–6 add 45 new ones.

Standard mode: seven of nine sound responses are required to clear a rank. Only a cleared Standard rank makes the next rank accessible. The best score for each rank/mode is stored; replaying a completed challenge does not farm repeated rewards.

Chaos mode: explicitly fictional jokes. For every scenario the designated absurd response is scored, but the UI also shows the responsible advice. Chaos has separate best scores and unlocks fun cosmetics, not Standard ranks.

## Passport

The Operator Passport is an optional, local progress document, not a credential or security boundary.

Example JSON:

    {
      "format": "phioperator-passport",
      "version": 1,
      "results": [
        { "rank": 1, "mode": "standard", "bestScore": 9 }
      ]
    }

The UI uses same-origin localStorage when available, but works without it. Export creates a JSON file. Import requires confirmation before replacing current progress. Imports have a size limit of 16 KiB, schema/version checks, score bounds, unique rank/mode checks, and produce a sanitized object.

**WARNING:** A user can freely edit this file. Do not treat imported achievements as identity, account trust, authorization, or permission to perform a dangerous action. Host applications must enforce their own access rules.

## Reward integration

The engine exposes listRewards(passport), isRewardUnlocked(passport, rewardId), and getUnlockedRank(passport). PhiOperator themes are active in its own UI.

Reserved reward IDs for later adapters:
- phisurf-wheel (Rank 2 Standard)
- genewrist-pulse (Rank 3 Standard)
- domistika-workshop (Rank 4 Standard)
- phiserve-lab (Rank 5 Standard)

These IDs are **contracts**, not shipped changes to those other repositories. Integrating host software later requires a separate explicit adapter and opt-in import/transfer of the Passport. A browser-local event fires after completed trials:

    window.addEventListener('phioperator:progress', event => {
      console.log(event.detail);
    });

The event detail includes version, rank, mode, score, passed, unlockedRank and newRewardIds. This does not cross browser origins or grant privileges. A host may use it for optional cosmetics only.

## Browser testing checklist

1. Start the original assessment; Rank 1 must use the original nine scenarios.
2. Pass Rank 1 in Standard mode; Rank 2 becomes available, Rank 3 stays locked.
3. Fail a rank; replay it. Previously earned best score must not decrease.
4. Pass Rank 1 in Chaos; a Chaos cosmetic unlocks without advancing Standard progress.
5. Apply a theme, refresh, and check persistence on browsers with localStorage.
6. Export/import the Passport; reject invalid JSON, duplicate entries, and oversized files.
7. Use keyboard 1/2/3 and Enter; check mobile layout, focus, reduced-motion settings.
8. All host integration rewards should plainly state that the adapter is pending.

## Nonnegotiable guarantees

- No identity, ideology, intelligence, schooling, disability, reading speed or background tests.
- No denial of core access to anyone who skips, fails, or prefers not to play.
- No real destructive, administrative or security power granted by a Passport.
- No unapproved cloud telemetry or automatic cross-app data collection.