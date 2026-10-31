import test from 'node:test';
import assert from 'node:assert/strict';
import { CRITICAL_ACTIONS, confirmCriticalAction } from '../src/index.js';

test('known operations demand acknowledgement and exact phrase', () => {
  for (const [operation, rule] of Object.entries(CRITICAL_ACTIONS)) {
    assert.equal(confirmCriticalAction({ operation }).allowed, false);
    assert.equal(confirmCriticalAction({ operation, typedPhrase: rule.phrase }).allowed, false);
    assert.equal(confirmCriticalAction({ operation, typedPhrase: rule.phrase.toLowerCase(), acknowledged: true }).allowed, false);
    assert.equal(confirmCriticalAction({ operation, typedPhrase: rule.phrase, acknowledged: true }).allowed, true);
  }
});

test('unknown actions fail closed', () => {
  const result = confirmCriticalAction({ operation: 'launch-missiles', typedPhrase: 'YES', acknowledged: true });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'unsupported-operation');
});

test('missing input fails closed', () => {
  assert.equal(confirmCriticalAction().allowed, false);
  assert.equal(confirmCriticalAction({}).allowed, false);
});