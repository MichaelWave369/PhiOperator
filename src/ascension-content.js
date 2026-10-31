import { QUESTIONS, PILLARS } from './questions.js';

// Nine original scenarios form rank one. Each later rank contributes nine new
// scenarios: three per discipline, keeping the ladder at 3 × 6 × 3 = 54.
export const RANKS = Object.freeze([
  { id: 1, name: 'Certified Button Presser', subtitle: 'Observe before you press.' },
  { id: 2, name: 'Console Operator', subtitle: 'The terminal has questions.' },
  { id: 3, name: 'Systems Tinkerer', subtitle: 'The error log is your friend.' },
  { id: 4, name: 'Field Engineer', subtitle: 'Prototype, measure, repeat.' },
  { id: 5, name: 'Reality Debugger', subtitle: 'Evidence survives enthusiasm.' },
  { id: 6, name: 'Φ369 Architect', subtitle: 'The machine requests your assistance.' }
].map(item => Object.freeze(item)));

const rankData = [
  [
    ['scope-the-failure','An app fails immediately after an update. Your first move?','Read the error message and check the update notes.','Threaten the power button with demotion.','Delete the entire drive for dramatic effect.','Error details and change history narrow down the cause.','POWER BUTTON HAS RETAINED LEGAL COUNSEL.'],
    ['slow-connection','One device has a slow connection. What should you check?','Compare other devices and local versus internet performance.','Yell "MORE BANDWIDTH" into the router.','Move the router onto a throne.','Comparisons help isolate a device, Wi-Fi, or upstream problem.','THE ROUTER ACCEPTS TRIBUTES, NOT THREATS.'],
    ['mysterious-sync','A sync button does nothing. What is a useful first observation?','Check current status, network reachability, and pending changes.','Press it 369 times in quick succession.','Declare that time itself is no longer synchronized.','State and status reports reveal whether syncing is blocked or finished.','BUTTON MASHING IS NOT A TRANSPORT PROTOCOL.'],
    ['backup-test','A folder is labeled BACKUP. What actually verifies it?','Restore a small sample into a safe location.','Admire the folder name until disaster passes.','Award the folder an honorary doctorate.','A test restore proves the backup is usable.','LABELS HAVE NO RECOVERY POWERS.'],
    ['verify-download','You find a program on a strange mirror. What helps verify it?','Use the publisher source and validate a published checksum or signature.','Ask whether its icon looks trustworthy.','Download twelve copies to average out malware.','Source authenticity and published integrity checks reduce tampering risk.','A VERY SHINY ICON IS NOT A SIGNATURE.'],
    ['share-diagnostics','Support asks for a diagnostic log. Before sending?','Review it and remove secrets or private data.','Include passwords so they feel appreciated.','Broadcast the log over the office speakers.','Diagnostic logs can expose identifiers, credentials, and private content.','SECRETS REMAIN BAD PARTY FAVORS.'],
    ['reset-layout','You accidentally rearrange every panel. The smart recovery?','Use a reset-layout command or saved workspace preset.','Reinstall the electricity.','Rotate your chair to match the interface.','Restore known UI state before treating a layout issue as data loss.','CHAIR ROTATION FAILED TO FIND MISSING PANEL.'],
    ['undo-mistake','An edit breaks a project that worked yesterday. Try what?','Inspect the diff and restore a known good version.','Pretend yesterday was a hoax.','Apply ten random patches and name it innovation.','Version history makes recovery safer and more accountable.','VERSION CONTROL HAS NOTICED YOUR EXISTENCE.'],
    ['help-new-user','A new teammate cannot find a setting. What helps?','Show where it lives and explain what it changes.','Insist the setting exists only for worthy operators.','Send them a picture of a confused toaster.','Clear guidance beats gatekeeping.','THE TOASTER IS ALSO CONFUSED.']
  ],
  [
    ['reproduce-bug','A bug only happens sometimes. What is useful evidence?','Document the exact steps, environment, and observed result.','Describe the error as "haunted" in the issue tracker.','Wait for a full moon to rerun the test.','A reproducible case is easier to isolate and fix.','GHOSTS ARE NOT A SUPPORTED ISSUE LABEL.'],
    ['find-bottleneck','A game stutters. What should you inspect first?','Measure CPU, GPU, memory, and frame times.','Add racing stripes to the computer case.','Turn the FPS counter upside down.','Profiling identifies the actual resource bottleneck.','STRIPES DID NOT CHANGE FRAME TIME.'],
    ['heat-warning','Your workstation runs hot under load. Your first investigation?','Check temperatures, cooling airflow, and fan operation.','Offer the graphics card a cold beverage.','Place a snowflake sticker on the heatsink.','Measured temperatures and cooling checks are safer than guesses.','GPU HAS POLITELY REFUSED THE BEVERAGE.'],
    ['copied-command','A forum suggests a shell command you do not recognize. Before running?','Read and verify each operation in a safe test environment.','Add sudo twice for superior authority.','Run it upside down so the bits fall out.','Shell commands can modify or destroy data. Understand effects first.','THE TERMINAL HAS REQUESTED ADULT SUPERVISION.'],
    ['dependency-audit','A package update changes dozens of dependencies. What next?','Review changes, provenance, and test compatibility.','Assume more dependencies means more power.','Name each dependency after a pet.','Dependency updates can introduce breaking changes or supply-chain risk.','THE PETS DECLINE RESPONSIBILITY.'],
    ['strange-extension','A browser extension asks for access to every page. A good response?','Verify its purpose, publisher, and minimum permissions.','Accept because the install button is green.','Grant access to your thoughts as well.','Extensions can read sensitive content, so minimize permissions.','PERMISSION: READ ALL THOUGHTS DENIED.'],
    ['config-rollback','A network configuration change breaks connectivity. What helps?','Use an out-of-band path or a saved rollback plan.','Change five more settings simultaneously.','Tell the switch the connection is a metaphor.','Known-good configurations and rollback access limit downtime.','METAPHORS DO NOT REPLACE ROUTING TABLES.'],
    ['merge-conflict','Two teammates edit the same configuration. What is sensible?','Review both changes and resolve conflicts intentionally.','Choose whichever file has the cooler name.','Merge the keyboards physically.','Understanding conflicting intent prevents silent regressions.','KEYBOARD MERGE RESULTED IN HARDWARE DAMAGE.'],
    ['restore-config','Your fix introduces a second failure. The reliable response?','Revert to a tested state, then isolate one change at a time.','Declare the second failure a surprise feature.','Keep rebooting until the calendar changes.','Controlled iterations make failures understandable and reversible.','SURPRISE FEATURES REQUIRE CONSENT.']
  ],
  [
    ['vr-hand-offset','In VR, one hand appears offset. What do you measure?','Compare controller pose, calibration offsets, and coordinate spaces.','Ask the virtual hand to try harder.','Move the real room three inches left.','Coordinate-space checks can reveal consistent pose offsets.','ROOM RELOCATION HAS BEEN DENIED.'],
    ['render-budget','A scene becomes slow after adding effects. Where to start?','Profile draw calls, textures, memory, and shaders.','Add a second moon to distract from stutter.','Rename the scene FAST_FINAL_FINAL.','Performance budgets should be driven by measurement.','FILENAME OPTIMIZATION: 0 MILLISECONDS.'],
    ['geometry-bug','Procedural walls occasionally overlap. What should you capture?','The generation seed and the minimum failing layout.','A solemn portrait of the offending wall.','The wall’s astrological sign.','Deterministic seeds make geometry failures reproducible.','WALL IS A SCORPIO. THIS EXPLAINS NOTHING.'],
    ['asset-license','A marketplace asset looks perfect for an open-source game. First check?','Read its license and redistribution restrictions.','Assume the word "free" means public domain.','Credit the asset to a mysterious wizard.','Using an asset does not necessarily grant redistribution rights.','LICENSING WIZARD REMAINS UNAVAILABLE.'],
    ['untrusted-model','A downloaded 3D model includes scripts. How to inspect it?','Open it in a sandbox and review active content first.','Trust it because the thumbnail is adorable.','Give the mesh administrator rights.','Models and scenes may carry executable content or unsafe dependencies.','MESH DOES NOT REQUIRE DOMAIN ADMIN.'],
    ['sensor-reading','A sensor shows an impossible reading. What is the next check?','Calibrate and compare with an independent instrument.','Announce the discovery of a new law of nature.','Buy a trophy for the sensor.','Anomalies need independent measurement before interpretation.','TROPHY COMMITTEE REQUIRES REPLICATION.'],
    ['rebuild-seed','A world generator produces a corrupted room. Recovery plan?','Preserve the seed, roll back, and isolate the broken stage.','Paint a tiny door over the damaged geometry.','Declare the room modern art and move on.','Seeds and checkpoints support controlled recovery and diagnosis.','MODERN ART REVIEW: TECHNICALLY POSSIBLE.'],
    ['design-revision','A layout change breaks navigation. What is safer?','Keep checkpoints and verify paths with automated tests.','Place motivational arrows on every wall.','Increase hallway confidence by 200%.','Navigation validation catches unusable paths early.','HALLWAY CONFIDENCE REMAINS UNMEASURED.'],
    ['vr-comfort','A VR tester reports motion sickness. What do you do?','Offer comfort settings, stable references, and stop the session.','Tell them their stomach needs a firmware update.','Increase turn speed to establish dominance.','Comfort controls and stopping when sick take priority over progression.','STOMACH FIRMWARE UPDATE NOT FOUND.']
  ],
  [
    ['model-conflict','Two local models disagree about a technical claim. Best next move?','Trace each claim back to verifiable evidence or a test.','Ask which model sounds more confident.','Make them duel inside a spreadsheet.','Independent evidence resolves disputes better than style or confidence.','SPREADSHEET DUEL POSTPONED.'],
    ['packet-loss','A mesh node reports intermittent loss. What to gather?','Time-correlated link metrics, routes, and environmental conditions.','Stare aggressively at the antenna.','Rearrange all cables into a spiral of destiny.','Correlated observations help identify where and when loss occurs.','ANTENNA HAS FILED A STARE COMPLAINT.'],
    ['failed-replication','A claimed experimental effect disappears in a retest. What now?','Document conditions and repeat with better controls.','Delete the retest because it was rude.','Rename failure to success in a press release.','Reproducibility and negative results are part of sound science.','NATURE HAS DECLINED THE PRESS RELEASE.'],
    ['data-provenance','A chart claims a remarkable improvement. What must be verified?','The underlying data, definitions, methods, and comparison period.','The chart’s inspirational color palette.','Whether the y-axis is sufficiently enthusiastic.','Without provenance and context, visuals can mislead.','ENCOURAGEMENT IS NOT A UNIT OF MEASURE.'],
    ['independent-test','You think a device produces reactionless thrust. Next step?','Run blinded controls that rule out electrical and measurement artifacts.','Announce interstellar travel on social media.','Replace the scale with a motivational poster.','Extraordinary measurements require careful isolation of ordinary causes.','MOTIVATIONAL POSTER SHOWED ZERO NEWTONS.'],
    ['clock-mismatch','Logs from two machines appear to disagree. What should you verify?','Clock sync, time zones, and monotonic versus wall-clock timestamps.','Ask one computer to remember harder.','Throw away every event before lunch.','Clock differences can make event ordering look impossible.','TIME TRAVEL HYPOTHESIS REMAINS UNFUNDED.'],
    ['failed-experiment','A prototype fails its pre-registered test. The responsible response?','Preserve the observations and publish the negative result accurately.','Rewrite the original prediction afterward.','Quietly relabel all failures as stars.','Transparent reporting prevents false confidence and supports learning.','STARS HAVE NOT ALTERED THE OUTCOME.'],
    ['migration-failure','A schema migration partially completes. What helps recovery?','Use tested migrations, backups, and explicit rollback steps.','Run the same command in a panic loop.','Offer the database emotional validation only.','Transactional plans and reliable backups limit partial changes.','DATABASE APPRECIATES BUT CANNOT USE THE COMPLIMENT.'],
    ['security-rehearsal','A security update disrupts a local service. Safe recovery?','Restore tested service with logs, containment, and a corrected patch plan.','Disable every security check permanently.','Hide the server behind a curtain.','Respond to incidents without sacrificing necessary protection.','CURTAIN DOES NOT BLOCK NETWORK TRAFFIC.']
  ],
  [
    ['partial-failure','A distributed offline-first suite partly fails. What is the first priority?','Identify affected services and preserve safe degraded operation.','Reboot the entire continent.','Issue an executive order to the LEDs.','Graceful degradation helps people work while faults are isolated.','CONTINENT REBOOT REQUIRES PERMISSION.'],
    ['source-disagreement','A model-generated summary contradicts its linked source. What next?','Inspect the primary source, correct the summary, and note uncertainty.','Trust the more poetic sentence.','Accuse the PDF of refusing to cooperate.','Traceability lets users distinguish evidence from a model’s claims.','PDF IS NOT UNDER OATH.'],
    ['power-budget','A lab system suddenly draws more energy. What should you do?','Measure loads and compare against a known-good baseline.','Blame the moon for excessive voltage.','Unplug the power meter to improve the numbers.','Baselines and power measurements help localize anomalous demand.','POWER METER REMAINS UNCONVINCED.'],
    ['policy-audit','A new permission policy may block legitimate offline use. How verify?','Test least privilege, documented exceptions, and critical access paths.','Assume the strictest policy must be the smartest.','Require a wizard hat before opening settings.','Security policy must protect users without breaking essential access.','WIZARD HAT IS NOT AN AUTHENTICATION FACTOR.'],
    ['signed-release','A release binary claims to be official. What supports that claim?','Verify its signature or checksum against a trusted publisher source.','Ask whether the zip file seems polite.','Trust the download count as cryptography.','Release integrity needs verified provenance rather than popularity.','POLITENESS HASH DOES NOT EXIST.'],
    ['misleading-metrics','An optimization report shows huge gains after changing the benchmark. What now?','Restore consistent tests and report conditions openly.','Keep only the fastest screenshot.','Add confetti to the performance dashboard.','Comparisons are meaningful only under comparable methodology.','CONFETTI DOES NOT IMPROVE THROUGHPUT.'],
    ['disaster-restore','A primary system fails with limited connectivity. What ensures recovery?','Follow an offline recovery plan with verified local backups.','Wait for an inspiring cloud formation.','Teach the router positive affirmations.','Offline-first planning needs tested recovery resources and procedures.','CLOUD FORMATION IS NOT OBJECT STORAGE.'],
    ['shared-bug','The same bug appears in three applications. How to respond?','Fix and test the shared component, then validate integrations.','Patch random pixels in all three UIs.','Declare a synchronized software festival.','A single shared fix can reduce duplicated defects when integrations are tested.','SOFTWARE FESTIVAL REGISTRATION CLOSED.'],
    ['accessibility-feedback','An operator reports the interface is inaccessible. Best response?','Listen, reproduce the barrier, and provide accessible alternatives.','Raise the certification score required to complain.','Tell their keyboard to evolve.','Accessible systems serve people with different needs, not only the test author.','KEYBOARD EVOLUTION IS NOT A PRODUCT STRATEGY.']
  ]
];

function makeQuestion(row, rank, index) {
  const [id, prompt, correct, chaos, extra, explanation, quip] = row;
  // Rotate answers so the responsible answer is not always position one.
  const options = [
    { id: id + '-sound', text: correct },
    { id: id + '-chaos', text: chaos },
    { id: id + '-extra', text: extra }
  ];
  const offset = (rank + index) % 3;
  const choices = [...options.slice(offset), ...options.slice(0, offset)];
  return Object.freeze({
    id: 'r' + rank + '-' + id,
    rank,
    pillar: PILLARS[Math.floor(index / 3)],
    location: RANKS[rank - 1].name.toUpperCase(),
    prompt,
    choices: Object.freeze(choices.map(c => Object.freeze(c))),
    correctId: id + '-sound',
    chaosId: id + '-chaos',
    explanation,
    quip
  });
}

const rankOneChaos = Object.freeze({
  freeze: 'yell-at-silicon',
  'ai-answer': 'delete-all-tools',
  popup: 'forward-friends',
  storage: 'blame-moon',
  teammate: 'close-issue',
  backup: 'trust-vibes',
  password: 'post-publicly',
  automation: 'rename-magic',
  y2k: 'emergency-boot'
});

export const DECKS = Object.freeze(
  RANKS.map(rank => Object.freeze(
    rank.id === 1
      ? QUESTIONS.map(q => Object.freeze({ ...q, rank: 1, chaosId: rankOneChaos[q.id] }))
      : rankData[rank.id - 2].map((row, index) => makeQuestion(row, rank.id, index))
  ))
);

export const TRIALS_PER_RANK = 9;
export const TOTAL_TRIALS = DECKS.reduce((sum, deck) => sum + deck.length, 0);
