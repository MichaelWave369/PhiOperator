import {
  RANKS, PASS_SCORE, createPassport, deserializePassport, serializePassport,
  getUnlockedRank, getBestScore, isRankAvailable, listRewards, isRewardUnlocked,
  createTrialSession, currentTrial, submitTrial, summarizeTrial, recordTrial, getDeck
} from './src/index.js';
import { mountAcademyUI } from './src/academy-ui.js';
import { mountLivingLabUI } from "./src/living-labs-ui.js";
import { listLivingBadges } from "./src/academy-passport.js";
import { mountOperatorWorld } from "./src/operator-world-ui.js";
import { listWorldMedals } from "./src/world-passport.js";

const $ = id => document.getElementById(id);
const panels = ['intro', 'quiz', 'result', 'ascension', 'academy', 'living', 'world'];
const choices = $('choices');
const feedback = $('feedback');
const next = $('next');
const STORAGE_KEY = 'phioperator.passport.v1';
const THEME_KEY = 'phioperator.theme.v1';
let passport = loadPassport();
let session = null;
let awaitingNext = false;
let mode = 'standard';
let theme = 'default';

function loadPassport() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? deserializePassport(saved) : createPassport();
  } catch { return createPassport(); }
}
function savePassport() {
  try {
    localStorage.setItem(STORAGE_KEY, serializePassport(passport));
    $('storage-status').textContent = 'PASSPORT SAVED LOCALLY.';
  } catch {
    $('storage-status').textContent = 'STORAGE UNAVAILABLE: EXPORT YOUR PASSPORT TO KEEP PROGRESS.';
  }
}
function useTheme(id) {
  if (id !== 'default' && !isRewardUnlocked(passport, id)) id = 'default';
  theme = id;
  document.documentElement.dataset.operatorTheme = id;
  applyCosmetics();
  try { localStorage.setItem(THEME_KEY, id); } catch { /* optional preference */ }
}
function applyCosmetics() {
  document.documentElement.classList.toggle('operator-grid', isRewardUnlocked(passport, 'screen-grid'));
  const stamp = $('cosmetic-stamp');
  const legend = isRewardUnlocked(passport, 'chaos-legend');
  const architect = isRewardUnlocked(passport, 'architect-seal');
  const menace = isRewardUnlocked(passport, 'menace-stamp');
  stamp.hidden = !legend && !architect && !menace;
  stamp.textContent = architect ? 'Φ369 ARCHITECT VERIFIED • COSMETIC'
    : legend ? 'CHAOS LEGEND • SIMULATION ONLY'
    : menace ? 'CERTIFIED TECHNOLOGICAL MENACE' : '';
}
function showPanel(id) {
  for (const panel of panels) $(panel).hidden = panel !== id;
}
function updateDossier() {
  const summary = session ? summarizeTrial(session) : null;
  $('dossier-answered').textContent = String(summary?.answered ?? 0).padStart(2, '0') + ' / 09';
  $('dossier-status').textContent = !summary ? 'READY TO EXPLORE'
    : !summary.completed ? (summary.mode === 'chaos' ? 'CHAOS SIMULATION' : 'EVALUATING')
    : summary.passed ? 'CERTIFIED' : 'ACADEMY INVITED';
  $('dossier-rank').textContent = String(getUnlockedRank(passport)).padStart(2, '0') + ' / 06';
}
function startQuiz(rank = 1, selectedMode = 'standard') {
  if (!isRankAvailable(passport, rank)) return;
  session = createTrialSession(rank, selectedMode);
  awaitingNext = false;
  updateDossier();
  showPanel('quiz');
  renderQuestion();
  $('quiz').scrollIntoView({ block: 'start' });
}
function renderQuestion() {
  awaitingNext = false;
  const question = currentTrial(session);
  if (!question) return showResults();
  $('question-count').textContent = String(session.index + 1).padStart(2, '0') + ' / 09';
  $('scene').textContent = 'R' + session.rank + '_' + session.mode.toUpperCase() + '.EXE';
  $('pillar').textContent = question.pillar;
  $('location').textContent = question.location + (session.mode === 'chaos' ? ' / SIMULATION' : '');
  $('question-title').textContent = question.prompt;
  $('progress').setAttribute('aria-valuenow', String(session.index));
  $('progress-fill').style.width = (session.index / 9 * 100) + '%';
  feedback.hidden = true;
  feedback.replaceChildren();
  next.hidden = true;
  choices.replaceChildren();
  for (const [index, choice] of question.choices.entries()) {
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
  }
  choices.querySelector('button')?.focus({ preventScroll: true });
}
function choose(choiceId) {
  if (!session || awaitingNext || !currentTrial(session)) return;
  const question = currentTrial(session);
  session = submitTrial(session, choiceId);
  awaitingNext = true;
  const target = session.mode === 'chaos' ? question.chaosId : question.correctId;
  const scored = choiceId === target;
  for (const button of choices.querySelectorAll('button')) {
    button.disabled = true;
    if (button.dataset.id === target) button.classList.add('correct');
    else if (button.dataset.id === choiceId) button.classList.add('incorrect');
  }
  feedback.hidden = false;
  feedback.className = 'feedback ' + (scored ? 'feedback-good' : 'feedback-retry');
  const heading = document.createElement('strong');
  heading.textContent = session.mode === 'chaos'
    ? scored ? '⚠ MAXIMUM SIMULATED NONSENSE' : '✳ CHAOS UNIMPRESSED'
    : scored ? '✓ SOUND OPERATOR RESPONSE' : '✳ TRAINING MOMENT RECORDED';
  const explanation = document.createElement('p');
  explanation.textContent = question.explanation;
  const quip = document.createElement('small');
  quip.textContent = question.quip;
  feedback.append(heading, explanation, quip);
  if (session.mode === 'chaos') {
    const note = document.createElement('p');
    note.className = 'simulation-note';
    note.textContent = 'CHAOS MODE IS FICTIONAL COMEDY. The highlighted answer is a joke, never real technical advice.';
    feedback.append(note);
  }
  next.hidden = false;
  next.textContent = session.index === 9 ? 'REVEAL OPERATOR REPORT →' : 'NEXT SCENARIO →';
  $('progress').setAttribute('aria-valuenow', String(session.index));
  $('progress-fill').style.width = (session.index / 9 * 100) + '%';
  updateDossier();
  next.focus({ preventScroll: true });
}
function showResults() {
  const outcome = recordTrial(passport, session);
  passport = outcome.passport;
  savePassport();
  useTheme(theme);
  const summary = outcome.summary;
  showPanel('result');
  $('result-title').textContent = summary.mode === 'chaos'
    ? summary.passed ? 'CERTIFIED MENACE.' : 'CHAOS ACADEMY.'
    : summary.passed ? 'OPERATOR CERTIFIED.' : 'OPERATOR ACADEMY.';
  $('result-score').textContent = String(summary.score).padStart(2, '0') + ' / 09';
  $('result-copy').textContent = !summary.passed
    ? 'Review the field notes and try again. Essential access has never been restricted.'
    : summary.mode === 'chaos'
      ? 'Your simulated liability is off the charts. Actual safety protocols remain operational.'
      : summary.rank === 6
        ? 'Φ369 Architect achieved. The system has finished testing you. It now requests your assistance.'
        : 'Rank ' + summary.rank + ' complete. The next station awaits in your Operator Passport.';
  $('result-seal').textContent = summary.passed ? '✓' : 'Φ';
  $('field-notes').hidden = true;
  $('field-notes').replaceChildren();
  $('review').textContent = 'VIEW FIELD NOTES';
  const rewards = $('result-unlocks');
  rewards.replaceChildren();
  if (outcome.newlyUnlocked.length) {
    const heading = document.createElement('h3');
    heading.textContent = 'NEW UNLOCKS';
    rewards.append(heading);
    for (const reward of outcome.newlyUnlocked) {
      const paragraph = document.createElement('p');
      paragraph.textContent = '✳ ' + reward.label +
        (reward.app === 'phioperator' ? '' :
          ['phisurf', 'genewrist'].includes(reward.app)
            ? ' [EXPORT PASSPORT TO GEN.E.WRIST]' : ' [HOST ADAPTER PENDING]');
      rewards.append(paragraph);
    }
  }
  updateDossier();
  window.dispatchEvent(new CustomEvent('phioperator:progress', {
    detail: { version: 1, rank: summary.rank, mode: summary.mode, score: summary.score,
      passed: summary.passed, unlockedRank: outcome.unlockedRank,
      newRewardIds: outcome.newlyUnlocked.map(r => r.id) }
  }));
  $('retry').focus({ preventScroll: true });
}
function toggleFieldNotes() {
  const pane = $('field-notes');
  pane.hidden = !pane.hidden;
  $('review').textContent = pane.hidden ? 'VIEW FIELD NOTES' : 'HIDE FIELD NOTES';
  if (pane.hidden || pane.childElementCount) return;
  const title = document.createElement('h3');
  title.textContent = 'FIELD NOTES';
  pane.append(title);
  for (const answer of session.answers) {
    const q = getDeck(session.rank).find(item => item.id === answer.questionId);
    const line = document.createElement('div');
    line.className = 'field-note';
    const heading = document.createElement('strong');
    heading.textContent = q.pillar + ' / ' + q.location;
    const detail = document.createElement('p');
    detail.textContent = q.explanation;
    line.append(heading, detail);
    pane.append(line);
  }
}
function renderPassport() {
  showPanel('ascension');
  $('passport-summary').textContent = 'CURRENT RANK: ' +
    String(getUnlockedRank(passport)).padStart(2, '0') + ' / 06 • 9 TRIALS PER RANK • 3 DISCIPLINES';
  for (const selected of ['standard', 'chaos']) {
    const button = $('mode-' + selected);
    button.setAttribute('aria-pressed', String(mode === selected));
    button.classList.toggle('active', mode === selected);
  }
  $('mode-note').textContent = mode === 'chaos'
    ? 'CHAOS SIMULATION: Choose the deliberately absurd answer. Jokes unlock cosmetics, never administrative powers.'
    : 'STANDARD: Seven sound answers clear a rank. You can replay trials whenever you want.';
  const ranks = $('rank-grid');
  ranks.replaceChildren();
  for (const rank of RANKS) {
    const available = isRankAvailable(passport, rank.id);
    const best = getBestScore(passport, rank.id, mode);
    const item = document.createElement('section');
    item.className = 'rank-card ' + (available ? 'rank-ready' : 'rank-locked');
    const meta = document.createElement('div');
    meta.className = 'rank-top';
    const n = document.createElement('span');
    n.textContent = 'RANK ' + String(rank.id).padStart(2, '0');
    const status = document.createElement('span');
    status.textContent = !available ? 'LOCKED' : best !== null && best >= PASS_SCORE ? 'CLEARED' : 'AVAILABLE';
    meta.append(n, status);
    const title = document.createElement('h3');
    title.textContent = rank.name;
    const sub = document.createElement('p');
    sub.textContent = rank.subtitle;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-outline rank-button';
    button.disabled = !available;
    button.textContent = !available ? 'CLEAR PREVIOUS RANK'
      : best === null ? 'START NINE TRIALS →' : 'REPLAY • BEST ' + best + '/09 →';
    button.addEventListener('click', () => startQuiz(rank.id, mode));
    item.append(meta, title, sub, button);
    ranks.append(item);
  }
  // Academy achievements travel in the optional v1 Passport extension;
  // they are not credentials and never unlock operating-system powers.
  const badges = $("academy-badges");
  badges.replaceChildren();
  for (const badge of listLivingBadges(passport)) {
    const item=document.createElement("div");
    item.className="academy-badge"+(badge.earned?" academy-badge-earned":"");
    const name=document.createElement("strong");
    name.textContent=(badge.earned?"✳ ":"◇ ")+badge.name;
    const progress=document.createElement("span");
    progress.textContent=badge.mode.toUpperCase()+" • "+
      (badge.bestScore===null?"NOT ATTEMPTED":badge.bestScore+"/3 BEST")+
      (badge.earned?" • EARNED":"");
    item.append(name,progress);
    badges.append(item);
  }
  const medals=$("world-medals");
  medals.replaceChildren();
  for(const medal of listWorldMedals(passport)){
    const box=document.createElement("div");
    box.className="academy-badge"+(medal.earned?" academy-badge-earned":"");
    const title=document.createElement("strong");
    title.textContent=(medal.earned?"✳ ":"◇ ")+medal.label;
    const progress=document.createElement("span");
    progress.textContent=medal.mode.toUpperCase()+" • "+(medal.earned?"EARNED":"UNCLAIMED");
    box.append(title,progress);
    medals.append(box);
  }
  const gallery = $('reward-grid');
  gallery.replaceChildren();
  for (const reward of listRewards(passport)) {
    const item = document.createElement('div');
    item.className = 'reward-item ' + (reward.unlocked ? 'reward-owned' : 'reward-pending');
    const name = document.createElement('strong');
    name.textContent = (reward.unlocked ? '✳ ' : '◇ ') + reward.label;
    const detail = document.createElement('p');
    detail.textContent = reward.description;
    const status = document.createElement('small');
    status.textContent = reward.app === 'phioperator'
      ? reward.unlocked ? 'UNLOCKED • PHIOPERATOR' : 'LOCKED'
      : ['phisurf', 'genewrist'].includes(reward.app)
        ? reward.unlocked ? 'GEN.E.WRIST BROWSER BRIDGE • MANUAL IMPORT'
          : 'GEN.E.WRIST BRIDGE • CLEAR REQUIRED RANK'
        : reward.unlocked ? 'HOST INTEGRATION PENDING' : 'LOCKED • HOST INTEGRATION PENDING';
    item.append(name, detail, status);
    if (reward.unlocked && reward.type === 'theme') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-action';
      button.textContent = theme === reward.id ? 'THEME ACTIVE ✓' : 'APPLY THEME';
      button.addEventListener('click', () => { useTheme(reward.id); renderPassport(); });
      item.append(button);
    }
    gallery.append(item);
  }
  $('theme-reset').disabled = theme === 'default';
  $('theme-reset').textContent = theme === 'default' ? 'DEFAULT THEME ACTIVE' : 'RESTORE DEFAULT THEME';
  updateDossier();
}
function exportPassport() {
  const blob = new Blob([serializePassport(passport)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'phioperator-passport-v1.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('storage-status').textContent = 'PASSPORT EXPORT CREATED.';
}
async function importPassport(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (file.size > 16384) {
    $('storage-status').textContent = 'IMPORT REJECTED: FILE TOO LARGE.';
    return;
  }
  try {
    const imported = deserializePassport(await file.text());
    if (!window.confirm('Replace this device’s Operator Passport with the imported one?')) return;
    passport = imported;
    savePassport();
    useTheme(theme);
    renderPassport();
    $('storage-status').textContent = 'PASSPORT IMPORTED AND VALIDATED.';
  } catch {
    $('storage-status').textContent = 'IMPORT REJECTED: INVALID OR UNSUPPORTED PASSPORT.';
  }
}
const livingUI = mountLivingLabUI({
  showPanel,
  onExit: () => academyUI.open(),
  getPassport: () => passport,
  savePassport: updated => {
    passport = updated;
    savePassport();
    updateDossier();
  }
});
const operatorWorldUI = mountOperatorWorld({
  showPanel,
  returnToAcademy: () => academyUI.open(),
  getPassport: () => passport,
  savePassport: updated => {
    passport=updated;
    savePassport();
    updateDossier();
  }
});
const academyUI = mountAcademyUI({
  showPanel, returnToPassport: renderPassport,
  launchLiving: (id,mode) => livingUI.open(id,mode),
  launchWorld: (mode) => operatorWorldUI.open(mode)
});
$('open-academy').addEventListener('click', academyUI.open);
$('open-academy-passport').addEventListener('click', academyUI.open);
$('start').addEventListener('click', () => startQuiz(1, 'standard'));
$('open-ascension').addEventListener('click', renderPassport);
$('open-ascension-from-result').addEventListener('click', renderPassport);
$('return-home').addEventListener('click', () => showPanel('intro'));
$('retry').addEventListener('click', () => startQuiz(session.rank, session.mode));
$('review').addEventListener('click', toggleFieldNotes);
$('mode-standard').addEventListener('click', () => { mode = 'standard'; renderPassport(); });
$('mode-chaos').addEventListener('click', () => { mode = 'chaos'; renderPassport(); });
$('passport-export').addEventListener('click', exportPassport);
$('passport-import').addEventListener('change', importPassport);
$('theme-reset').addEventListener('click', () => { useTheme('default'); renderPassport(); });
next.addEventListener('click', () => {
  if (!awaitingNext) return;
  if (summarizeTrial(session).completed) showResults();
  else renderQuestion();
});
document.addEventListener('keydown', event => {
  if (!$('quiz').hidden && !event.altKey && !event.ctrlKey && !event.metaKey && !event.repeat) {
    if (event.key === 'Enter' && awaitingNext) {
      event.preventDefault();
      next.click();
    } else if (!awaitingNext && ['1', '2', '3'].includes(event.key) &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      const button = choices.querySelectorAll('button')[Number(event.key) - 1];
      if (button) { event.preventDefault(); button.click(); }
    }
  }
});
try { theme = localStorage.getItem(THEME_KEY) || 'default'; } catch { /* default */ }
useTheme(theme);
updateDossier();