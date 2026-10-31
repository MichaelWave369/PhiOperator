import test from 'node:test';
import assert from 'node:assert/strict';
import { PILLARS, QUESTIONS, QUESTION_IDS, createSession, getQuestion, currentQuestion, submitAnswer, summarizeSession } from '../src/index.js';

test('nine unique questions, three learning pillars, complete options', () => {
  assert.equal(QUESTIONS.length, 9);
  assert.equal(new Set(QUESTION_IDS).size, 9);
  assert.deepEqual(new Set(QUESTIONS.map(q => q.pillar)), new Set(PILLARS));
  for (const question of QUESTIONS) {
    assert.equal(question.choices.length, 3);
    assert.ok(question.choices.some(c => c.id === question.correctId));
    assert.equal(new Set(question.choices.map(c => c.id)).size, 3);
    assert.ok(question.explanation.length > 15);
  }
});

test('sessions start at first question without side effects', () => {
  const state = createSession();
  assert.equal(state.index, 0);
  assert.equal(state.answers.length, 0);
  assert.equal(currentQuestion(state).id, QUESTION_IDS[0]);
  assert.equal(summarizeSession(state).outcome, 'in-progress');
});

test('correct answers certify a full session without mutating the old one', () => {
  const initial = createSession();
  let session = initial;
  for (const id of QUESTION_IDS) {
    session = submitAnswer(session, getQuestion(id).correctId);
  }
  assert.equal(initial.index, 0);
  assert.equal(currentQuestion(session), null);
  assert.deepEqual(summarizeSession(session), {
    score: 9, total: 9, answered: 9, completed: true, threshold: 7, outcome: 'certified'
  });
});

test('wrong choices direct to academy rather than lockout', () => {
  let session = createSession();
  for (const id of QUESTION_IDS) {
    const question = getQuestion(id);
    session = submitAnswer(session, question.choices.find(c => c.id !== question.correctId).id);
  }
  assert.equal(summarizeSession(session).outcome, 'academy');
  assert.equal(summarizeSession(session).score, 0);
  assert.equal(session.answers[0].explanation, QUESTIONS[0].explanation);
});

test('certification threshold is 75% rounded up', () => {
  let session = createSession();
  for (let i = 0; i < 9; i++) {
    const question = QUESTIONS[i];
    const answer = i < 7 ? question.correctId : question.choices.find(c => c.id !== question.correctId).id;
    session = submitAnswer(session, answer);
  }
  assert.equal(summarizeSession(session).outcome, 'certified');
  assert.equal(summarizeSession(session).score, 7);
});

test('subset sessions are allowed and do not expose global state', () => {
  const session = createSession(['freeze', 'backup']);
  assert.equal(summarizeSession(session).total, 2);
  session.questionIds.push('y2k');
  assert.equal(QUESTION_IDS.length, 9);
});

test('unknown/duplicate/empty question IDs are rejected', () => {
  for (const ids of [[], ['nothing'], ['freeze', 'freeze']]) {
    assert.throws(() => createSession(ids), TypeError);
  }
});

test('invalid or out-of-order answers are rejected', () => {
  const session = createSession(['freeze']);
  assert.throws(() => submitAnswer(session, 'not-a-choice'), TypeError);
  const complete = submitAnswer(session, 'observe-before-force');
  assert.throws(() => submitAnswer(complete, 'observe-before-force'), RangeError);
});

test('malformed session payloads are rejected', () => {
  assert.throws(() => summarizeSession({ index: -1, answers: [], questionIds: [] }), TypeError);
  assert.throws(() => currentQuestion(null), TypeError);
});