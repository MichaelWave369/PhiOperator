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
export {
  LIVING_LABS, LIVING_PHASES, LIVING_STEPS, getLivingLab,
  createLivingLabSession, currentLivingPhase, inspectLivingNode,
  useLivingTool, summarizeLivingLab, livingTopology
} from "./living-labs.js";
export {
  ACADEMY_EXTENSION_ID, ACADEMY_EXTENSION_VERSION, ACADEMY_BADGE_NAMES,
  listLivingBadges, recordLivingBadge
} from "./academy-passport.js";
