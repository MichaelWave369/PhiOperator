import { createSession, currentQuestion, submitAnswer, summarizeSession } from './src/index.js';

const $ = id => document.getElementById(id);
const intro = $('intro');
const quiz = $('quiz');
const result = $('result');
const start = $('start');
const next = $('next');
const choices = $('choices');
const feedback = $('feedback');
let session = null;
let awaitingNext = false;

function showPanel(panel) {
  for (const node of [intro, quiz, result]) node.hidden = node !== panel;
}

function updateDossier() {
  const summary = session ? summarizeSession(session) : null;
  $('dossier-answered').textContent = String(summary?.answered ?? 0).padStart(2, '0') + ' / 09';
  $('dossier-status').textContent = !summary ? 'AWAITING INPUT' :
    !summary.completed ? 'EVALUATING' : summary.outcome === 'certified' ? 'CERTIFIED' : 'ACADEMY INVITED';
}

function startQuiz() {
  session = createSession();
  awaitingNext = false;
  updateDossier();
  showPanel(quiz);
  renderQuestion();
  $('question-title').focus?.();
}

function renderQuestion() {
  awaitingNext = false;
  const question = currentQuestion(session);
  if (!question) return showResults();
  const number = session.index + 1;
  $('question-count').textContent = String(number).padStart(2, '0') + ' / 09';
  $('scene').textContent = 'SCENARIO_' + String(number).padStart(2, '0') + '.EXE';
  $('pillar').textContent = question.pillar;
  $('location').textContent = question.location;
  $('question-title').textContent = question.prompt;
  $('progress').setAttribute('aria-valuenow', String(session.index));
  $('progress-fill').style.width = (session.index / session.questionIds.length * 100) + '%';
  feedback.hidden = true;
  feedback.replaceChildren();
  next.hidden = true;
  choices.replaceChildren();

  question.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.dataset.id = choice.id;
    const key = document.createElement('span');
    key.className = 'choice-key';
    key.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.textContent = choice.text;
    button.append(key, label);
    button.addEventListener('click', () => choose(choice.id));
    choices.append(button);
  });
  choices.querySelector('button')?.focus({ preventScroll: true });
}

function choose(choiceId) {
  if (awaitingNext || !session || !currentQuestion(session)) return;
  session = submitAnswer(session, choiceId);
  awaitingNext = true;
  const answer = session.answers.at(-1);
  const buttons = [...choices.querySelectorAll('button')];
  buttons.forEach(button => {
    button.disabled = true;
    if (button.dataset.id === answer.correctId) button.classList.add('correct');
    else if (button.dataset.id === answer.choiceId) button.classList.add('incorrect');
  });
  feedback.hidden = false;
  feedback.className = 'feedback ' + (answer.correct ? 'feedback-good' : 'feedback-retry');
  const heading = document.createElement('strong');
  heading.textContent = answer.correct ? '✓ LOGICAL OPERATOR RESPONSE' : '✳ TRAINING MOMENT RECORDED';
  const detail = document.createElement('p');
  detail.textContent = answer.explanation;
  const quip = document.createElement('small');
  quip.textContent = answer.quip;
  feedback.append(heading, detail, quip);
  next.hidden = false;
  next.textContent = session.index === session.questionIds.length ? 'REVEAL OPERATOR REPORT →' : 'NEXT SCENARIO →';
  $('progress').setAttribute('aria-valuenow', String(session.index));
  $('progress-fill').style.width = (session.index / session.questionIds.length * 100) + '%';
  updateDossier();
  next.focus({ preventScroll: true });
}

function showResults() {
  showPanel(result);
  const summary = summarizeSession(session);
  $('result-title').textContent = summary.outcome === 'certified' ? 'OPERATOR CERTIFIED.' : 'OPERATOR ACADEMY.';
  $('result-score').textContent = String(summary.score).padStart(2, '0') + ' / ' + String(summary.total).padStart(2, '0');
  $('result-copy').textContent = summary.outcome === 'certified' ?
    'Curiosity verified. Systems remain operational. Your imaginary clearance has been upgraded.' :
    'Learning mode activated. Every expert once asked a first question. Your access was never on the line.';
  $('result-seal').textContent = summary.outcome === 'certified' ? '✓' : 'Φ';
  $('field-notes').hidden = true;
  $('field-notes').replaceChildren();
  $('review').textContent = 'VIEW FIELD NOTES';
  updateDossier();
  $('retry').focus({ preventScroll: true });
}

function toggleFieldNotes() {
  const pane = $('field-notes');
  pane.hidden = !pane.hidden;
  $('review').textContent = pane.hidden ? 'VIEW FIELD NOTES' : 'HIDE FIELD NOTES';
  if (pane.hidden || pane.childElementCount) return;
  const title = document.createElement('h3');
  title.textContent = 'YOUR FIELD NOTES';
  pane.append(title);
  for (const answer of session.answers) {
    const line = document.createElement('div');
    line.className = 'field-note';
    const heading = document.createElement('strong');
    heading.textContent = (answer.correct ? '✓ ' : '↻ ') + answer.questionId.replaceAll('-', ' ').toUpperCase();
    const text = document.createElement('p');
    text.textContent = answer.explanation;
    line.append(heading, text);
    pane.append(line);
  }
}

start.addEventListener('click', startQuiz);
$('retry').addEventListener('click', startQuiz);
$('review').addEventListener('click', toggleFieldNotes);
next.addEventListener('click', () => {
  if (!awaitingNext) return;
  if (summarizeSession(session).completed) showResults();
  else renderQuestion();
});
document.addEventListener('keydown', event => {
  if (quiz.hidden || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (event.key === 'Enter' && awaitingNext) {
    event.preventDefault();
    next.click();
  } else if (!awaitingNext && ['1','2','3'].includes(event.key)) {
    const button = choices.querySelectorAll('button')[Number(event.key) - 1];
    if (button) { event.preventDefault(); button.click(); }
  }
});
updateDossier();