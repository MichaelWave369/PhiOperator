export { PILLARS, QUESTIONS, QUESTION_IDS } from './questions.js';
export { createSession, currentQuestion, getQuestion, submitAnswer, summarizeSession } from './engine.js';
export { CRITICAL_ACTIONS, confirmCriticalAction } from './guard.js';
export { RANKS, DECKS, TRIALS_PER_RANK, TOTAL_TRIALS } from './ascension-content.js';
export {
  PASSPORT_FORMAT, PASSPORT_VERSION, MODES, PASS_SCORE, REWARDS,
  createPassport, validatePassport, serializePassport, deserializePassport,
  getDeck, getBestScore, getUnlockedRank, isRankAvailable, listRewards, isRewardUnlocked,
  createTrialSession, currentTrial, submitTrial, summarizeTrial, recordTrial
} from './ascension.js';