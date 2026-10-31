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
