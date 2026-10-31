import { DECKS, RANKS, TRIALS_PER_RANK } from './ascension-content.js';

export const PASSPORT_FORMAT = 'phioperator-passport';
export const PASSPORT_VERSION = 1;
export const MODES = Object.freeze(['standard', 'chaos']);
export const PASS_SCORE = 7;

export const REWARDS = Object.freeze([
  { id: 'theme-amber', rank: 1, mode: 'standard', app: 'phioperator', label: 'Amber Terminal', description: 'An amber CRT console palette.', type: 'theme' },
  { id: 'theme-violet', rank: 2, mode: 'standard', app: 'phioperator', label: 'Violet Protocol', description: 'A violet CRT console palette.', type: 'theme' },
  { id: 'phisurf-wheel', rank: 2, mode: 'standard', app: 'phisurf', label: 'PhiSurf Operator Wheel', description: 'Integration reward contract, pending host adapter.', type: 'host' },
  { id: 'genewrist-pulse', rank: 3, mode: 'standard', app: 'genewrist', label: 'Gen.E.Wrist Pulse Skin', description: 'Integration reward contract, pending host adapter.', type: 'host' },
  { id: 'theme-signal', rank: 3, mode: 'standard', app: 'phioperator', label: 'Signal Green', description: 'A vivid emerald console palette.', type: 'theme' },
  { id: 'domistika-workshop', rank: 4, mode: 'standard', app: 'domistikaxr', label: 'Quantum Workshop Blueprint', description: 'Integration reward contract, pending host adapter.', type: 'host' },
  { id: 'screen-grid', rank: 4, mode: 'standard', app: 'phioperator', label: 'Blueprint Grid', description: 'Decorative field-grid console effect.', type: 'cosmetic' },
  { id: 'theme-midnight', rank: 5, mode: 'standard', app: 'phioperator', label: 'Deep Field', description: 'A cool midnight console palette.', type: 'theme' },
  { id: 'phiserve-lab', rank: 5, mode: 'standard', app: 'phiserve', label: 'PhiServe Sandbox Lab', description: 'Integration reward contract, pending host adapter.', type: 'host' },
  { id: 'architect-seal', rank: 6, mode: 'standard', app: 'phioperator', label: 'Φ369 Architect Seal', description: 'The final decorative passport seal.', type: 'cosmetic' },
  { id: 'theme-chaos', rank: 1, mode: 'chaos', app: 'phioperator', label: 'Chaos Console', description: 'Comically unwise decisions, responsibly simulated.', type: 'theme' },
  { id: 'menace-stamp', rank: 3, mode: 'chaos', app: 'phioperator', label: 'Certified Menace Stamp', description: 'A badge with absolutely no legal standing.', type: 'cosmetic' },
  { id: 'chaos-legend', rank: 6, mode: 'chaos', app: 'phioperator', label: 'Chaos Legend', description: 'The machine requests a second opinion.', type: 'cosmetic' }
].map(reward => Object.freeze(reward)));

const clone = passport => ({
  format: PASSPORT_FORMAT,
  version: PASSPORT_VERSION,
  results: passport.results.map(r => ({ rank: r.rank, mode: r.mode, bestScore: r.bestScore })),
  ...(passport.extensions ? {extensions:passport.extensions} : {})
});
const isObject = item => item !== null && typeof item === 'object' && !Array.isArray(item);
const isRank = rank => Number.isInteger(rank) && rank >= 1 && rank <= RANKS.length;
const isMode = mode => MODES.includes(mode);
const ACADEMY_IDS = new Set(["network", "restore", "evidence"]);
export function validateAcademyExtension(raw) {
  if (!isObject(raw) || raw.version !== 1 ||
      !Array.isArray(raw.badges) || raw.badges.length > 6)
    throw new TypeError("Invalid PhiOperator Academy extension.");
  const seen = new Set();
  const badges = raw.badges.map(badge => {
    if (!isObject(badge) || !ACADEMY_IDS.has(badge.lab) ||
        !["standard","chaos"].includes(badge.mode) ||
        !Number.isInteger(badge.bestScore) || badge.bestScore < 0 || badge.bestScore > 3)
      throw new TypeError("Invalid Academy badge.");
    const key = badge.lab + ":" + badge.mode;
    if (seen.has(key)) throw new TypeError("Duplicate Academy badge.");
    seen.add(key);
    return {lab:badge.lab,mode:badge.mode,bestScore:badge.bestScore};
  });
  return {version:1,badges};
}


export function createPassport() {
  return { format: PASSPORT_FORMAT, version: PASSPORT_VERSION, results: [] };
}

export function validatePassport(raw) {
  if (!isObject(raw) || raw.format !== PASSPORT_FORMAT || raw.version !== PASSPORT_VERSION ||
      !Array.isArray(raw.results) || raw.results.length > RANKS.length * MODES.length) {
    throw new TypeError('Invalid or unsupported Operator Passport.');
  }
  const seen = new Set();
  const clean = createPassport();
  for (const result of raw.results) {
    if (!isObject(result) || !isRank(result.rank) || !isMode(result.mode) ||
        !Number.isInteger(result.bestScore) || result.bestScore < 0 || result.bestScore > TRIALS_PER_RANK) {
      throw new TypeError('Invalid passport result.');
    }
    const key = result.mode + ':' + result.rank;
    if (seen.has(key)) throw new TypeError('Duplicate passport result.');
    seen.add(key);
    clean.results.push({ rank: result.rank, mode: result.mode, bestScore: result.bestScore });
  }
  // Academy badges are additive, non-authoritative v1 metadata. Old Passports
  // still have exactly {format,version,results}. Unknown extension names are
  // ignored, not executed or blindly reflected into the exported document.
  if (raw.extensions !== undefined) {
    if (!isObject(raw.extensions)) throw new TypeError("Invalid Passport extensions.");
    if (raw.extensions.phioperatorAcademy !== undefined) {
      clean.extensions = {
        phioperatorAcademy: validateAcademyExtension(raw.extensions.phioperatorAcademy)
      };
    }
  }
  return clean;
}

export function serializePassport(passport) {
  const text = JSON.stringify(validatePassport(passport), null, 2);
  if (text.length > 16384) throw new TypeError("Passport export exceeds 16 KiB.");
  return text;
}

export function deserializePassport(text) {
  if (typeof text !== 'string' || text.length > 16384) throw new TypeError('Invalid passport file size.');
  return validatePassport(JSON.parse(text));
}

export function getDeck(rank) {
  if (!isRank(rank)) throw new RangeError('Unknown operator rank.');
  return DECKS[rank - 1];
}

export function getBestScore(passport, rank, mode = 'standard') {
  const p = validatePassport(passport);
  if (!isRank(rank) || !isMode(mode)) throw new TypeError('Invalid rank or mode.');
  return p.results.find(r => r.rank === rank && r.mode === mode)?.bestScore ?? null;
}

export function getUnlockedRank(passport) {
  const p = validatePassport(passport);
  let rank = 1;
  while (rank < RANKS.length && p.results.some(r => r.rank === rank && r.mode === 'standard' && r.bestScore >= PASS_SCORE)) rank++;
  return rank;
}

export function isRankAvailable(passport, rank) {
  if (!isRank(rank)) return false;
  return rank <= getUnlockedRank(passport);
}

export function listRewards(passport) {
  const p = validatePassport(passport);
  return REWARDS.map(reward => ({
    ...reward,
    unlocked: p.results.some(r => r.rank === reward.rank && r.mode === reward.mode && r.bestScore >= PASS_SCORE)
  }));
}

export function isRewardUnlocked(passport, rewardId) {
  const reward = listRewards(passport).find(r => r.id === rewardId);
  return reward?.unlocked ?? false;
}

export function createTrialSession(rank = 1, mode = 'standard') {
  if (!isRank(rank) || !isMode(mode)) throw new TypeError('Invalid trial setup.');
  return { version: 1, rank, mode, index: 0, answers: [] };
}

function inspectSession(session) {
  if (!isObject(session) || session.version !== 1 || !isRank(session.rank) || !isMode(session.mode) ||
      !Number.isInteger(session.index) || session.index < 0 || session.index > TRIALS_PER_RANK ||
      !Array.isArray(session.answers) || session.answers.length !== session.index) {
    throw new TypeError('Invalid trial session.');
  }
  const deck = getDeck(session.rank);
  session.answers.forEach((answer, i) => {
    if (!isObject(answer) || answer.questionId !== deck[i].id ||
        !deck[i].choices.some(c => c.id === answer.choiceId)) throw new TypeError('Invalid recorded answer.');
  });
  return deck;
}

export function currentTrial(session) {
  const deck = inspectSession(session);
  return deck[session.index] ?? null;
}

export function submitTrial(session, choiceId) {
  const question = currentTrial(session);
  if (!question) throw new RangeError('Trial complete.');
  if (!question.choices.some(choice => choice.id === choiceId)) throw new TypeError('Invalid choice.');
  return {
    version: 1,
    rank: session.rank,
    mode: session.mode,
    index: session.index + 1,
    answers: [...session.answers, { questionId: question.id, choiceId }]
  };
}

export function summarizeTrial(session) {
  const deck = inspectSession(session);
  const score = session.answers.reduce((total, answer, index) => {
    const target = session.mode === 'chaos' ? deck[index].chaosId : deck[index].correctId;
    return total + Number(answer.choiceId === target);
  }, 0);
  return {
    rank: session.rank,
    mode: session.mode,
    answered: session.index,
    total: deck.length,
    score,
    passed: session.index === deck.length && score >= PASS_SCORE,
    completed: session.index === deck.length
  };
}

export function recordTrial(passport, session) {
  const before = validatePassport(passport);
  const summary = summarizeTrial(session);
  if (!summary.completed) throw new RangeError('Cannot record an incomplete trial.');
  if (!isRankAvailable(before, summary.rank)) throw new RangeError('Rank not yet available.');
  const previousRewards = new Set(listRewards(before).filter(r => r.unlocked).map(r => r.id));
  const next = clone(before);
  const row = next.results.find(r => r.rank === summary.rank && r.mode === summary.mode);
  if (row) row.bestScore = Math.max(row.bestScore, summary.score);
  else next.results.push({ rank: summary.rank, mode: summary.mode, bestScore: summary.score });
  const newlyUnlocked = listRewards(next).filter(r => r.unlocked && !previousRewards.has(r.id));
  return { passport: next, summary, newlyUnlocked, unlockedRank: getUnlockedRank(next) };
}
