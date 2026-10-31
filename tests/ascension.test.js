import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DECKS, RANKS, TOTAL_TRIALS, TRIALS_PER_RANK,
  createPassport, createTrialSession, currentTrial, getDeck, getUnlockedRank,
  submitTrial, summarizeTrial, recordTrial, getBestScore,
  validatePassport, serializePassport, deserializePassport,
  listRewards, isRewardUnlocked, isRankAvailable
} from '../src/index.js';

function complete(rank, mode = 'standard', mistakes = 0) {
  let session = createTrialSession(rank, mode);
  const deck = getDeck(rank);
  for (let i = 0; i < deck.length; i++) {
    const question = currentTrial(session);
    const good = mode === 'chaos' ? question.chaosId : question.correctId;
    const other = question.choices.find(choice => choice.id !== good).id;
    session = submitTrial(session, i < mistakes ? other : good);
  }
  return session;
}

test('six ranks each have 9 unique, 3-per-discipline challenges', () => {
  assert.equal(RANKS.length, 6);
  assert.equal(TRIALS_PER_RANK, 9);
  assert.equal(TOTAL_TRIALS, 54);
  assert.equal(DECKS.length, 6);
  const ids = new Set();
  for (const deck of DECKS) {
    assert.equal(deck.length, 9);
    for (const pillar of ['OBSERVE', 'VERIFY', 'RECOVER']) {
      assert.equal(deck.filter(q => q.pillar === pillar).length, 3);
    }
    for (const q of deck) {
      assert.ok(!ids.has(q.id), 'duplicate id: ' + q.id);
      ids.add(q.id);
      assert.equal(q.choices.length, 3);
      assert.equal(new Set(q.choices.map(c => c.id)).size, 3);
      assert.ok(q.choices.some(c => c.id === q.correctId));
      assert.ok(q.choices.some(c => c.id === q.chaosId));
      assert.notEqual(q.correctId, q.chaosId);
      assert.ok(q.explanation.length > 12);
    }
  }
});

test('initial rank unlocked; completing one rank unlocks next, not beyond', () => {
  let passport = createPassport();
  assert.equal(getUnlockedRank(passport), 1);
  assert.equal(isRankAvailable(passport, 2), false);
  for (let rank = 1; rank <= 6; rank++) {
    const { passport: next, summary } = recordTrial(passport, complete(rank));
    assert.equal(summary.score, 9);
    assert.equal(summary.passed, true);
    passport = next;
    assert.equal(getUnlockedRank(passport), Math.min(rank + 1, 6));
  }
  assert.equal(getBestScore(passport, 6), 9);
  assert.equal(isRewardUnlocked(passport, 'architect-seal'), true);
});

test('passing requires 7 of 9 and failures can be retaken', () => {
  const initial = createPassport();
  const fail = recordTrial(initial, complete(1, 'standard', 3));
  assert.equal(fail.summary.score, 6);
  assert.equal(fail.summary.passed, false);
  assert.equal(fail.unlockedRank, 1);
  const pass = recordTrial(fail.passport, complete(1, 'standard', 2));
  assert.equal(pass.summary.score, 7);
  assert.equal(pass.unlockedRank, 2);
  assert.equal(getBestScore(pass.passport, 1), 7);
  assert.equal(getBestScore(initial, 1), null);
  assert.equal(recordTrial(pass.passport, complete(1, 'standard', 9)).passport.results[0].bestScore, 7);
});

test('chaos mode has separate scores, rewards and does not unlock ranks', () => {
  const trial = complete(1, 'chaos');
  const initial = createPassport();
  const outcome = recordTrial(initial, trial);
  assert.equal(outcome.summary.score, 9);
  assert.equal(outcome.unlockedRank, 1);
  assert.equal(isRewardUnlocked(outcome.passport, 'theme-chaos'), true);
  assert.equal(isRewardUnlocked(outcome.passport, 'theme-amber'), false);
  assert.equal(outcome.newlyUnlocked.filter(r => r.id === 'theme-chaos').length, 1);
  assert.equal(recordTrial(outcome.passport, trial).newlyUnlocked.length, 0);
});

test('unavailable ranks cannot be recorded even using a forged client session', () => {
  assert.throws(() => recordTrial(createPassport(), complete(6)), RangeError);
  assert.throws(() => recordTrial(createPassport(), createTrialSession(1)), RangeError);
  assert.throws(() => createTrialSession(0), TypeError);
  assert.throws(() => createTrialSession(1, 'danger'), TypeError);
  assert.throws(() => getDeck(7), RangeError);
});

test('invalid choices, tampered question IDs and invalid session shapes fail', () => {
  const original = createTrialSession(1);
  assert.throws(() => submitTrial(original, 'made-up'), TypeError);
  const answered = submitTrial(original, currentTrial(original).correctId);
  assert.equal(original.index, 0);
  assert.throws(() => summarizeTrial({...answered, answers:[{questionId:'fake', choiceId:'x'}]}), TypeError);
  assert.throws(() => summarizeTrial({...answered, index:11}), TypeError);
});

test('passport exports and imports without network, duplicates or unknown fields', () => {
  const recorded = recordTrial(createPassport(), complete(1));
  const json = serializePassport(recorded.passport);
  assert.deepEqual(deserializePassport(json), recorded.passport);
  assert.deepEqual(validatePassport({...recorded.passport, evil: 'discard'}), recorded.passport);
  assert.equal(listRewards(recorded.passport).find(x => x.id === 'theme-amber').unlocked, true);
  assert.throws(() => deserializePassport('{not json'), SyntaxError);
  assert.throws(() => deserializePassport('x'.repeat(16385)), TypeError);
  assert.throws(() => validatePassport({format:'phioperator-passport', version:999, results:[]}), TypeError);
  assert.throws(() => validatePassport({format:'phioperator-passport', version:1,
    results:[{rank:1,mode:'standard',bestScore:1},{rank:1,mode:'standard',bestScore:9}]}), TypeError);
  assert.throws(() => validatePassport({format:'phioperator-passport', version:1,
    results:[{rank:1,mode:'standard',bestScore:100}]}), TypeError);
});
