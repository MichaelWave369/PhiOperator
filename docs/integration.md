# Embedding PhiOperator

PhiOperator is designed to remain lightweight and optional when embedded in PhiOS, PhiOS-Mobile, Gen.E.Wrist, PhiSurf, or other host applications. Use ESM imports; no framework or API keys.

## Training / game adapter

Import from the public entrypoint and keep returned objects local:

    import { createSession, currentQuestion, submitAnswer, summarizeSession } from './src/index.js';
    let state = createSession();
    const first = currentQuestion(state);
    state = submitAnswer(state, first.correctId);
    const report = summarizeSession(state);

For an intentionally shorter quiz, pass a list of known unique question IDs to createSession. Invalid IDs, duplicate IDs, and empty sets throw TypeError. Submit a choice ID from the current question only.

Use the report to offer a certificate-style visual reward or open the learning notes. **Never map it to identity, intelligence, authorization, account standing, or access to essential functions.** It is a playful local learning signal, not a security credential.

## Critical operations

Import confirmCriticalAction and call it before showing a host-defined high-consequence operation:

    import { confirmCriticalAction } from './src/index.js';
    const check = confirmCriticalAction({
      operation: 'delete-workspace',
      typedPhrase: 'DELETE WORKSPACE',
      acknowledged: true
    });

A supported operation returns its prompt, exact phrase, and allowed flag. Unknown operations fail closed so the host has to define a policy explicitly.

IMPORTANT: confirmCriticalAction is a user-interface helper ONLY. A client can bypass it. The host must independently enforce authorization, backups, user identity where relevant, audit trails, and server/kernel-side permission checks. Quiz performance MUST NOT be used as an authorization boundary.

## Host integration contract

Recommended adapter:

- A host can open the quiz as a modal, fullscreen retro terminal, or Gen.E.Wrist panel.
- Host navigation, emergency/safety affordances, accessibility settings, and support remain available without quiz completion.
- Results remain in memory by default. No account association or background collection.
- All host calls are explicit, versioned, and independently authorized.
- A failed attempt opens explanations and replay; it never blocks ordinary functionality.
- Any production data deletion must have a host-controlled confirmation, with accurate previews and undo/backup where possible.

## Accessibility and ethics

Every question includes a plain-language explanation. Do not score time-to-answer, eye movement, disability-related interaction, political opinions, or degree of familiarity. Provide alternate access to the manual and allow skipping the entire optional test. Ensure button focus, contrast, readable text, and reduced-motion UI.