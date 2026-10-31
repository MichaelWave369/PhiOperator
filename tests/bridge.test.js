import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPassport, createTrialSession, getDeck, submitTrial,
  recordTrial, serializePassport, deserializePassport, isRewardUnlocked
} from '../src/index.js';

test('Rung 3 exports the stable v1 Passport consumed by Gen.E.Wrist', () => {
  let passport = createPassport();
  for (const rank of [1,2,3]) {
    let trial = createTrialSession(rank, 'standard');
    for (const question of getDeck(rank)) trial = submitTrial(trial, question.correctId);
    passport = recordTrial(passport, trial).passport;
  }
  const data = JSON.parse(serializePassport(passport));
  assert.equal(data.format, 'phioperator-passport');
  assert.equal(data.version, 1);
  assert.deepEqual(data.results, [1,2,3].map(rank => ({
    rank, mode:'standard', bestScore:9
  })));
  assert.deepEqual(deserializePassport(JSON.stringify(data)), passport);
  assert.equal(isRewardUnlocked(passport, 'phisurf-wheel'), true);
  assert.equal(isRewardUnlocked(passport, 'genewrist-pulse'), true);
});
