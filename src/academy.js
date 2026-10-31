/**
 * ΦOperator Academy: 3 local-only scenario simulations × 3 steps × 3 choices.
 * No network commands or OS changes. Incorrect steps are teachable and retryable.
 */
const LABS = [
  {
    id: "network", title: "THE DISAPPEARING INTERNET", subtitle: "Observe the signal before resetting the world.",
    stages: [
      {
        text: "A laptop cannot load a website, but Wi-Fi says connected. What do you inspect first?",
        choices: ["Compare with another device and test a local gateway.", "Unplug every cable in the building.", "Yell at the router until it remembers the internet."],
        correct: 0, chaos: 2,
        lesson: "Compare local and upstream reachability to isolate the actual fault.",
      },
      {
        text: "Other devices work; the laptop can reach the gateway but not external IPs. Your next test?",
        choices: ["Factory-reset the entire network without a backup.", "Inspect the laptop's route, IP settings and VPN/firewall state.", "Paint the antenna blue for better signal."],
        correct: 1, chaos: 2,
        lesson: "A single-device failure points toward local configuration or software.",
      },
      {
        text: "A stale VPN route explains the issue. How do you recover?",
        choices: ["Record the finding, change the VPN route safely, and retest.", "Delete all your routes forever.", "Threaten the DHCP lease with eviction."],
        correct: 0, chaos: 2,
        lesson: "Make one reversible correction, confirm service, and capture what changed.",
      },
    ],
  },
  {
    id: "restore", title: "THE BACKUP GOBLIN", subtitle: "Find a recovery path that actually works.",
    stages: [
      {
        text: "A project update broke a working build. What is useful first evidence?",
        choices: ["Rename the error 'FEATURE-369'.", "Compare the current version to the last known good commit.", "Ask the hard drive to have faith."],
        correct: 1, chaos: 0,
        lesson: "A known-good baseline and change diff identify likely causes.",
      },
      {
        text: "A recent migration altered data. How do you check your backup?",
        choices: ["Trust that a folder named BACKUP is spiritually protected.", "Restore a safe sample into a separate test location.", "Overwrite the only remaining copy and hope."],
        correct: 1, chaos: 0,
        lesson: "Test restores away from the original files; never experiment on your sole copy.",
      },
      {
        text: "The test restore passes and you understand the failure. Your action?",
        choices: ["Apply a documented rollback and verify the project runs.", "Erase the changelog to improve morale.", "Disable every future update."],
        correct: 0, chaos: 1,
        lesson: "Recovery includes validation and an audit trail, not just a hopeful reboot.",
      },
    ],
  },
  {
    id: "evidence", title: "THE CONFIDENT ORACLE", subtitle: "Separate impressive claims from actual evidence.",
    stages: [
      {
        text: "Two models give incompatible technical claims. Choose the first step.",
        choices: ["Trust the one that uses more capital letters.", "Find primary evidence and define a measurable test.", "Announce that both are correct in alternate universes."],
        correct: 1, chaos: 2,
        lesson: "Independent, measurable observations beat confidence and eloquence.",
      },
      {
        text: "A prototype appears to produce anomalous thrust. Which experiment helps?",
        choices: ["Publish a rocket launch schedule.", "Use controls for thermal, electrical and measurement effects.", "Ask Newton to stop being negative."],
        correct: 1, chaos: 2,
        lesson: "Control ordinary sources of spurious signals before proposing new physics.",
      },
      {
        text: "Independent controls do not reproduce the result. What should you report?",
        choices: ["Discard the failed replicates.", "Preserve the negative result, methods and uncertainty.", "Rebrand the failure as 'quantum victory'."],
        correct: 1, chaos: 2,
        lesson: "Negative results are useful evidence, not a personal defeat.",
      },
    ],
  },
];
export const ACADEMY_LABS = Object.freeze(LABS.map(lab => Object.freeze({
  ...lab, stages: Object.freeze(lab.stages.map(stage =>
    Object.freeze({ ...stage, choices: Object.freeze([...stage.choices]) }))),
})));
export const ACADEMY_STAGE_COUNT = 3;
export function createAcademySession(id, mode = "standard") {
  if (!ACADEMY_LABS.some(lab => lab.id === id) || !["standard", "chaos"].includes(mode))
    throw new TypeError("Unknown academy lab or mode.");
  return { labId: id, mode, index: 0, choices: [] };
}
function inspect(session) {
  const lab = ACADEMY_LABS.find(x => x.id === session?.labId);
  if (!lab || !["standard", "chaos"].includes(session.mode) ||
      !Number.isInteger(session.index) || session.index < 0 ||
      session.index > ACADEMY_STAGE_COUNT ||
      !Array.isArray(session.choices) || session.choices.length !== session.index ||
      session.choices.some((answer, i) =>
        !Number.isInteger(answer) || answer < 0 || answer >= lab.stages[i].choices.length))
    throw new TypeError("Invalid academy session.");
  return lab;
}
export function currentAcademyStage(session) {
  return inspect(session).stages[session.index] ?? null;
}
export function chooseAcademyResponse(session, choice) {
  const stage = currentAcademyStage(session);
  if (!stage) throw new RangeError("Academy lab complete.");
  if (!Number.isInteger(choice) || choice < 0 || choice >= stage.choices.length)
    throw new TypeError("Unknown response.");
  return { labId: session.labId, mode: session.mode,
    index: session.index + 1, choices: [...session.choices, choice] };
}
export function summarizeAcademySession(session) {
  const lab = inspect(session);
  const score = session.choices.reduce((total, answer, i) =>
    total + Number(answer === (session.mode === "chaos"
      ? lab.stages[i].chaos : lab.stages[i].correct)), 0);
  return { score, total: ACADEMY_STAGE_COUNT, completed: session.index === ACADEMY_STAGE_COUNT,
    mode: session.mode, lab: lab.id };
}
