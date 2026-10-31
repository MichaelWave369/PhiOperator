// A UX confirmation helper, not a security boundary. Real permissions belong in the host.
export const CRITICAL_ACTIONS = Object.freeze({
  'delete-workspace': Object.freeze({
    phrase: 'DELETE WORKSPACE',
    prompt: 'This permanently deletes the selected workspace and may not be reversible.'
  }),
  'overwrite-backup': Object.freeze({
    phrase: 'OVERWRITE BACKUP',
    prompt: 'This replaces the existing backup. Verify you have another usable copy.'
  }),
  'reset-credentials': Object.freeze({
    phrase: 'RESET CREDENTIALS',
    prompt: 'This may invalidate active sessions, tokens, or remote access.'
  })
});

export function confirmCriticalAction({ operation, typedPhrase = '', acknowledged = false } = {}) {
  const rule = CRITICAL_ACTIONS[operation];
  if (!rule) {
    return {
      allowed: false,
      reason: 'unsupported-operation',
      prompt: 'The host must define its own policy for this operation.',
      requiredPhrase: null
    };
  }
  if (acknowledged !== true || typedPhrase !== rule.phrase) {
    return {
      allowed: false,
      reason: 'confirmation-required',
      prompt: rule.prompt,
      requiredPhrase: rule.phrase
    };
  }
  return { allowed: true, reason: 'confirmed', prompt: rule.prompt, requiredPhrase: rule.phrase };
}