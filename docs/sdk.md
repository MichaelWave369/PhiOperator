# PhiOperator Portable Passport SDK v1

Canonical zero-dependency, single-file ESM distribution: src/portable-passport.js.
Use this source unchanged for offline local web or PWA adapters; pin the exact
reviewed commit in each consumer and run a v1 interoperability test.

Exports: validatePortablePassport, parsePortablePassport,
summarizePortablePassport, createPortablePassportStore, PASSPORT_REWARDS.

1. An operator deliberately exports phioperator-passport-v1.json.
2. A host offers an explicit local file picker and validates the JSON before any change.
3. A host may show decorative themes, optional practice content or nonessential shortcuts.
4. User may export and clear the imported copy. Storage unavailable? Keep progress in the current session.
5. No automatic cross-site reads, network upload, tokens, identities or client-elevated actions.

NOTE: A Passport is plain JSON that users can edit. It is NOT an authentication
or security authorization format. Never use it to unlock actual system
administration, dangerous operations, restricted data, emergency use or
accessibility accommodations. These must remain independent.

Current cosmetic rank-derived IDs: phisurf-wheel (rank 2),
genewrist-pulse (rank 3), phios-mobile-halo (rank 2),
phios-site-grid (rank 3), phios-architect-mark (rank 6).

This version intentionally retains existing Passport schema v1,
with bestScore for a 9-question Standard or Chaos trial. Academy simulations
are optional training and do not mutate certification results.

## Pinned source guidance

The same portable-passport.js module can be vendored into host projects
for guaranteed offline startup. Document its originating PhiOperator commit
and compare the file bytes across consumers in integration review. Do not
fetch executable code at runtime from a different browser origin.


## Rung 5: Academy achievements extension

The canonical PhiOperator export can optionally contain this additive v1 metadata:

    {
      "format": "phioperator-passport",
      "version": 1,
      "results": [],
      "extensions": {
        "phioperatorAcademy": {
          "version": 1,
          "badges": [
            {"lab":"network","mode":"standard","bestScore":3}
          ]
        }
      }
    }

Valid labs: network, restore, evidence. Each has separate Standard and Chaos
records, bestScore 0–3, at most six entries, with no duplicates.
When absent, the original Passport remains exactly the old three-field shape.
Rank-clearing tests remain untouched. Badges are NOT entitlements or proof of
competence; they decorate only the game.

The Rung 5 canonical portable SDK preserves/validates the known extension.
**Older pinned hosts** (including the first versions of Gen.E.Wrist,
PhiOS-Mobile PWA and PhiOS public site) continue accepting the v1 file and
reading rank progress but may discard Academy extension metadata if they
normalize and re-export the document. Until those host adapters are upgraded,
retain your original PhiOperator JSON export as the full local copy of your
self-reported game progress. No automatic cross-origin transfers exist.
