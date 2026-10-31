# Φ PhiOperator

## The Operator's Test

**A retro adventure-game tribute with useful lessons hiding behind the punchlines.**

PhiOperator is a zero-dependency, offline-capable-in-browser operator quiz and an embeddable JavaScript module for the Phi ecosystem. It takes inspiration from the delightful absurdity of classic Sierra-era copy-protection questions.

**Core rule: The machine doesn't punish ignorance. It rewards curiosity.**

- Nine scenario questions spanning **Observe / Verify / Recover**.
- Contextual explanations, absurd system messages, and a fake Y2K-era operating system gag.
- A training outcome instead of a lockout. Optional playful quiz is not an identity, intelligence, or political-opinion test.
- A tiny, side-effect-free API for other software.
- Separate, explicit confirmation helpers for consequential actions.
- No accounts, telemetry, advertising, external fonts, or third-party JavaScript.
- Keyboard-friendly interface and reduced-motion support.

## Try it

Open index.html in a browser, or serve the repo folder with any static file server. For the cleanest experience, use:

    python -m http.server 8000

Then visit http://localhost:8000. To publish to GitHub Pages after merge, go to Settings → Pages and serve the root of the main branch. No build step is required.

## For developers

    npm test
    npm run check

The package is native ECMAScript modules on Node 20+ or modern browsers. No npm install is required.

    import { createSession, submitAnswer, summarizeSession } from './src/index.js';
    let game = createSession();
    game = submitAnswer(game, 'observe-before-force');
    console.log(summarizeSession(game));

Read docs/integration.md for the API and the distinction between comedy onboarding and actual permission checks.

## Operator's Charter

1. Be curious, not cruel.
2. Offer explanations and another attempt.
3. Always allow essential navigation, support, safety, and accessibility functions.
4. Never grade people's beliefs, identity, education level, disabilities, accent, or reading speed.
5. Keep scores ephemeral and local; do not turn them into personal rankings.
6. Confirm dangerous *actions* by their consequences, never gate ordinary use by a quiz result.

## Next rungs

- Rung 2: signed, versioned PhiOperator challenge packs and localization.
- Rung 3: integration adapters for PhiOS, PhiOS-Mobile, Gen.E.Wrist, and PhiSurf.
- Rung 4: scenario-specific confirmation dialogs and auditable policy hooks.

Licensed under MIT. This project is an entertainment and training interface, not a security boundary.