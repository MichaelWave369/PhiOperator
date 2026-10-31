import { QUESTIONS, QUESTION_IDS } from './questions.js';

const lookup = new Map(QUESTIONS.map(question => [question.id, question]));

export function getQuestion(id) {
  return lookup.get(id) ?? null;
}

export function createSession(questionIds = QUESTION_IDS) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new TypeError('A session needs at least one question.');
  }
  if (new Set(questionIds).size !== questionIds.length || questionIds.some(id => !lookup.has(id))) {
    throw new TypeError('Question IDs must be unique and known.');
  }
  return {
    version: 1,
    questionIds: [...questionIds],
    answers: [],
    index: 0
  };
}

export function currentQuestion(session) {
  assertSession(session);
  return getQuestion(session.questionIds[session.index] ?? '');
}

export function submitAnswer(session, choiceId) {
  assertSession(session);
  const question = currentQuestion(session);
  if (!question) throw new RangeError('Session is complete.');
  if (!question.choices.some(choice => choice.id === choiceId)) {
    throw new TypeError('Unknown choice for this question.');
  }
  const answer = {
    questionId: question.id,
    choiceId,
    correct: choiceId === question.correctId,
    explanation: question.explanation,
    quip: question.quip,
    correctId: question.correctId
  };
  return {
    version: 1,
    questionIds: [...session.questionIds],
    answers: [...session.answers, answer],
    index: session.index + 1
  };
}

export function summarizeSession(session) {
  assertSession(session);
  const total = session.questionIds.length;
  const score = session.answers.filter(answer => answer.correct).length;
  const completed = session.index === total;
  const threshold = Math.ceil(total * 0.75);
  return {
    score,
    total,
    answered: session.index,
    completed,
    threshold,
    outcome: !completed ? 'in-progress' : score >= threshold ? 'certified' : 'academy'
  };
}

function assertSession(session) {
  if (!session || !Array.isArray(session.questionIds) || !Array.isArray(session.answers) ||
      !Number.isInteger(session.index) || session.index < 0 ||
      session.index > session.questionIds.length || session.answers.length !== session.index ||
      session.questionIds.some(id => !lookup.has(id))) {
    throw new TypeError('Invalid session.');
  }
}