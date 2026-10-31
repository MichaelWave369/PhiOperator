# Rung 3: PhiOperator → Gen.E.Wrist / ΦSURF handoff

**User-controlled offline transfer.** The PhiOperator Passport is saved to the PhiOperator browser origin only. Gen.E.Wrist does NOT and CANNOT read it directly. No server, account, sync, token in a URL or privileged API is necessary.

## How to use

1. In PhiOperator, clear Standard Rank 1 and Rank 2 (at least seven answers correct in each). Rank 3 Standard gives the additional optional wrist visual.
2. Open ASCENSION PASSPORT and click EXPORT PASSPORT. The browser downloads phioperator-passport-v1.json.
3. Open the Gen.E.Wrist browser console at https://michaelwave369.github.io/GenEWrist/.
4. Go to Device Settings → Operator Passport Bridge → IMPORT OPERATOR PASSPORT.
5. Select that JSON file and accept the explicit confirmation. Gen.E.Wrist shows your cleared rank.
6. Open ΦSURF (Shift+Space or the floating dial), then 3·6·9 MODULES → OPERATOR SHORTCUTS. The submenu offers SIGL Designer, S.N.A.K.E.'s Toolkit and JourneyLog, using existing safe local app launchers.
7. To reverse the transfer, Device Settings → REMOVE IMPORT; this removes only Gen.E.Wrist's local copy.

Note: step 4 requires the corresponding Gen.E.Wrist adapter PR to be merged and deployed. If the import section is missing, the host has not been updated yet.

## Technical interop

Passport schema version 1:

    {
      "format": "phioperator-passport",
      "version": 1,
      "results": [
        {"rank": 1, "mode": "standard", "bestScore": 9},
        {"rank": 2, "mode": "standard", "bestScore": 9}
      ]
    }

Gen.E.Wrist validates file size (16 KiB), version, rank IDs, known modes, score range and uniqueness before import. It derives only the two known cosmetic flags. Chaos scores do not unlock Standard integrations. Invalid files fail without replacing current data, and blocked local storage falls back to an in-memory session.

In PhiOperator the downloadable document is generated from serializePassport(passport). A Passport is untrusted, user-editable progress, **not** proof of identity, competence, possession of the account or a security permission. Neither ΦSURF nor WorldAdapter may use it to grant host capabilities, permissions or access to essential features.

The ΦSURF quick navigation engine lives in the Gen.E.Wrist repository and preserves the original six top-level choices and the canonical 3/6/9 modules. No original software engine is forked. Other host adapters (DomistikaXR, PhiServe, PhiOS, etc.) are still future work.

## Verification

- PhiOperator unit tests ensure stable version 1 JSON roundtrips and both Rank 2/3 reward identifiers.
- Gen.E.Wrist companion tests verify schema compatibility, sequential Standard achievements, favorites routing, no added root destinations, no host-grant changes and revocation.
- Both projects need CI, a human PR review, and browser retesting after their merges. Physical Quest hardware verification remains pending.
