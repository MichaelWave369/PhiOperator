/**
 * Living Operator Academy, Rung 5.
 * Deterministic in-memory incident theater. NOTHING here operates real devices,
 * executes commands, connects to a network, or modifies the host filesystem.
 * Three scenes, three phases, six inspectable components, three tool cards
 * per phase. Real outcomes branch between evidence-led recovery and slapstick.
 */
const labData = [
  {
    id: "network", name: "THE DISAPPEARING INTERNET", scene: "SIMULATED NETWORK RACK",
    description: "A laptop has Wi-Fi but no internet. Inspect the rack, run checks, and restore the route.",
    nodes: [
      { id: "workstation", label: "FIELD LAPTOP", role: "CLIENT", status: "fault", note: "802.11 link associated. Browser requests are failing." },
      { id: "access-point", label: "ACCESS POINT", role: "RADIO", status: "healthy", note: "Radio is associated and other clients pass traffic." },
      { id: "switch", label: "LAN SWITCH", role: "L2", status: "healthy", note: "Uplinks and client access VLAN show carrier." },
      { id: "gateway", label: "EDGE ROUTER", role: "GATEWAY", status: "healthy", note: "Default gateway responds and WAN is up for other clients." },
      { id: "vpn", label: "VPN PROFILE", role: "ROUTE", status: "fault", note: "A stale tunnel route claims the default path." },
      { id: "uplink", label: "ISP UPLINK", role: "WAN", status: "healthy", note: "External monitor is green; the failure is not site-wide." }
    ],
    stages: [
      {
        id: "observe", discipline: "OBSERVE", target: "workstation",
        goal: "Find the scope of the outage. Inspect the laptop before selecting a diagnostic tool.",
        clue: "Simulated ICMP: gateway 10.0.0.1 responds; internet IP does not. Other clients remain online.",
        sound: { id: "compare-path", label: "COMPARE LOCAL VS UPSTREAM", message: "The client reaches its gateway, but the internet path fails only for this laptop.", effects: { workstation: "suspect" } },
        decoy: { id: "blame-wifi", label: "REPLACE ALL WIFI ANTENNAS", message: "Nothing changed. Healthy neighboring clients make a blanket radio failure unlikely." },
        chaos: { id: "scold-router", label: "THREATEN THE ROUTER", message: "THE ROUTER REQUESTS A UNION REPRESENTATIVE. It continues routing everyone else.", effects: { gateway: "dramatic" } }
      },
      {
        id: "verify", discipline: "VERIFY", target: "vpn",
        goal: "Inspect the suspect route and choose a check that tests the working hypothesis.",
        clue: "Simulated route table: 0.0.0.0/0 points to a disconnected VPN tunnel instead of the LAN gateway.",
        sound: { id: "inspect-routes", label: "COMPARE ROUTING TABLE", message: "Verified: a stale default VPN route overrides the ordinary gateway.", effects: { vpn: "identified" } },
        decoy: { id: "change-dns", label: "CHANGE DNS RANDOMLY", message: "Still broken. DNS changes cannot explain failure to reach an external IP address." },
        chaos: { id: "reboot-city", label: "REBOOT THE WHOLE CITY", message: "CITY REBOOT REQUEST DENIED. The imaginary municipality has filed a complaint.", effects: { uplink: "dramatic" } }
      },
      {
        id: "recover", discipline: "RECOVER", target: "workstation",
        goal: "Inspect the client once more, then apply a reversible, verified correction.",
        clue: "Simulated rollback plan: disable stale VPN route; preserve VPN settings; retest gateway and external IP.",
        sound: { id: "repair-route", label: "REMOVE STALE ROUTE + RETEST", message: "ROUTE RESTORED. Simulated external checks now pass; the laptop is back online.", effects: { workstation: "recovered", vpn: "recovered" } },
        decoy: { id: "wipe-routes", label: "DELETE ALL ROUTES FOREVER", message: "Unsafe recovery path rejected inside the simulation. Keep a rollback plan." },
        chaos: { id: "angry-dhcp", label: "EVICT THE DHCP LEASE", message: "THE DHCP LEASE HAS RETAINED COUNSEL. Your laptop remains theatrically offline.", effects: { workstation: "dramatic" } }
      }
    ]
  },
  {
    id: "restore", name: "THE BACKUP GOBLIN", scene: "SIMULATED RECOVERY BAY",
    description: "A release broke your project. Verify a known-good revision and safely restore it.",
    nodes: [
      { id: "app", label: "PROJECT APP", role: "SERVICE", status: "fault", note: "Release boots to a migration error instead of the expected UI." },
      { id: "deploy", label: "DEPLOY LOG", role: "CHANGE", status: "suspect", note: "The failure began immediately after deployment R42." },
      { id: "migration", label: "SCHEMA DIFF", role: "DATABASE", status: "fault", note: "New code expects a field absent from the retained data snapshot." },
      { id: "backup", label: "LOCAL BACKUP", role: "ARCHIVE", status: "suspect", note: "There is a recent archive. Restore integrity remains untested." },
      { id: "sandbox", label: "TEST SANDBOX", role: "ISOLATED", status: "healthy", note: "A clean, fictional test location exists for a non-destructive restore." },
      { id: "users", label: "USER SESSION", role: "IMPACT", status: "fault", note: "The project is unavailable while the failed release remains active." }
    ],
    stages: [
      {
        id: "observe", discipline: "OBSERVE", target: "deploy",
        goal: "Inspect the deployment record and isolate which change preceded the failure.",
        clue: "R41: green. R42: migration added an unexpected required field. First failures start at R42.",
        sound: { id: "diff-releases", label: "DIFF R41 VS R42", message: "Identified a migration incompatibility, with a known-good R41 revision.", effects: { deploy: "identified" } },
        decoy: { id: "rename-error", label: "RENAME FAILURE TO FEATURE", message: "A new label doesn't restore service. Error messages are not marketing copy." },
        chaos: { id: "bribe-goblin", label: "BRIBE THE BACKUP GOBLIN", message: "THE GOBLIN ACCEPTS A PRETEND COOKIE. THE RELEASE IS STILL BROKEN.", effects: { deploy: "dramatic" } }
      },
      {
        id: "verify", discipline: "VERIFY", target: "backup",
        goal: "Inspect the backup's integrity in isolation, without touching the original.",
        clue: "Archive has a matching checksum but no restore evidence. Test it in a separate sandbox.",
        sound: { id: "test-restore", label: "RESTORE SAMPLE INTO SANDBOX", message: "The safe test restore succeeds. The original files are untouched.", effects: { backup: "recovered", sandbox: "identified" } },
        decoy: { id: "trust-label", label: "TRUST THE FOLDER NAME", message: "A directory named BACKUP is not proof you can actually recover from it." },
        chaos: { id: "bless-zip", label: "BLESS THE ZIP FILE", message: "THE ZIP FILE FEELS SEEN. INTEGRITY IS STILL AN OPEN QUESTION.", effects: { backup: "dramatic" } }
      },
      {
        id: "recover", discipline: "RECOVER", target: "app",
        goal: "Inspect the broken app and perform a documented, reversible rollback.",
        clue: "R41 boots from the test restore. The change plan retains the failed R42 artifact for review.",
        sound: { id: "rollback", label: "ROLL BACK TO R41 + VERIFY", message: "Simulation restored: app starts, users reconnect, and the failed release remains auditable.", effects: { app: "recovered", users: "recovered" } },
        decoy: { id: "erase-history", label: "ERASE THE CHANGELOG", message: "History is evidence. Erasing it makes future recovery harder." },
        chaos: { id: "deploy-confetti", label: "DEPLOY EMERGENCY CONFETTI", message: "CONFETTI PIPELINE PASSED. SERVICE PIPELINE STILL FAILED.", effects: { app: "dramatic" } }
      }
    ]
  },
  {
    id: "evidence", name: "THE CONFIDENT ORACLE", scene: "SIMULATED FIELD LAB",
    description: "A model and sensor claim a remarkable result. Determine what the data supports.",
    nodes: [
      { id: "model", label: "LOCAL MODEL", role: "ADVISOR", status: "suspect", note: "The model describes the result confidently but has no measurements of its own." },
      { id: "claim", label: "PUBLIC CLAIM", role: "SOURCE", status: "suspect", note: "The claim is striking; no independent methods are attached." },
      { id: "sensor", label: "FORCE SENSOR", role: "MEASUREMENT", status: "suspect", note: "A tiny signal coincides with powered equipment; heat drift is possible." },
      { id: "controls", label: "BLIND CONTROLS", role: "METHOD", status: "healthy", note: "Test fixture can run null cases and reverse orientation safely in fiction." },
      { id: "replica", label: "SECOND LAB", role: "REPLICATION", status: "suspect", note: "Independent runs have not matched the headline effect." },
      { id: "ledger", label: "EVIDENCE LOG", role: "RECORD", status: "suspect", note: "Raw runs are available. Claims need calibration and uncertainty reported." }
    ],
    stages: [
      {
        id: "observe", discipline: "OBSERVE", target: "sensor",
        goal: "Inspect raw measurements before accepting a confident interpretation.",
        clue: "The micro-signal appears when electronics heat up; calibration and null-run controls are missing.",
        sound: { id: "examine-raw", label: "CHECK RAW SERIES + BASELINE", message: "A drift-correlated pattern appears. It is not yet evidence of novel physics.", effects: { sensor: "identified" } },
        decoy: { id: "trust-model", label: "ASK WHICH MODEL SOUNDS WISER", message: "Confident wording is not an independent measurement." },
        chaos: { id: "ask-newton", label: "SUMMON NEWTON'S LAWYER", message: "NEWTON HAS DECLINED TO COMMENT. THE SENSOR IS NOT IMPRESSED.", effects: { model: "dramatic" } }
      },
      {
        id: "verify", discipline: "VERIFY", target: "controls",
        goal: "Inspect the control fixture, then perform a test that can falsify the idea.",
        clue: "Null and reversed-orientation runs isolate thermal and electromagnetic measurement effects.",
        sound: { id: "run-blind", label: "RUN BLINDED NULL CONTROLS", message: "Signal follows thermal drift. Independent checks do not establish new thrust.", effects: { controls: "identified", replica: "identified" } },
        decoy: { id: "fix-axis", label: "RESCALE GRAPH UNTIL POSITIVE", message: "Axis choice changes presentation, not physical data." },
        chaos: { id: "motivation-poster", label: "INSTALL MOTIVATIONAL POSTER", message: "POSTER GENERATED 0.000 NEWTONS. THE ROOM REMAINS HOPEFUL.", effects: { controls: "dramatic" } }
      },
      {
        id: "recover", discipline: "RECOVER", target: "ledger",
        goal: "Inspect the audit log and publish an accurate, reproducible conclusion.",
        clue: "Raw null controls and failed replications are preserved; uncertainties have been calculated.",
        sound: { id: "publish-negative", label: "RECORD NEGATIVE RESULT + METHODS", message: "Evidence ledger updated in this simulation. Claim remains unverified, with transparent methods.", effects: { ledger: "recovered" } },
        decoy: { id: "delete-controls", label: "DELETE FAILED REPLICATIONS", message: "Discarding contrary evidence prevents honest evaluation." },
        chaos: { id: "rename-quantum", label: "DECLARE QUANTUM VICTORY", message: "THE PRESS RELEASE HAS WON THE TROPHY. THE PHYSICS HAS NOT CHANGED.", effects: { ledger: "dramatic" } }
      }
    ]
  }
];
function freezeLab(lab) {
  const freezeTool = tool => Object.freeze({ ...tool, effects: Object.freeze({ ...(tool.effects || {}) }) });
  return Object.freeze({ ...lab,
    nodes: Object.freeze(lab.nodes.map(node => Object.freeze({...node}))),
    stages: Object.freeze(lab.stages.map(stage => Object.freeze({
      id: stage.id, discipline: stage.discipline, target: stage.target,
      goal: stage.goal, clue: stage.clue,
      tools: Object.freeze([
        Object.freeze({ ...freezeTool(stage.sound), kind: "sound" }),
        Object.freeze({ ...freezeTool(stage.decoy), kind: "decoy" }),
        Object.freeze({ ...freezeTool(stage.chaos), kind: "chaos" })
      ])
    })))
  });
}
export const LIVING_LABS = Object.freeze(labData.map(freezeLab));
export const LIVING_PHASES = Object.freeze(["OBSERVE", "VERIFY", "RECOVER"]);
export const LIVING_STEPS = 3;
export function getLivingLab(id) {
  const lab = LIVING_LABS.find(item => item.id === id);
  if (!lab) throw new RangeError("Unknown Living Lab.");
  return lab;
}
export function createLivingLabSession(id, mode = "standard") {
  getLivingLab(id);
  if (!["standard", "chaos"].includes(mode)) throw new TypeError("Unknown lab mode.");
  return { version: 1, labId: id, mode, index: 0, inspected: [],
    selected: null, steps: [], missteps: 0, effects: {},
    log: ["TRAINING SANDBOX BOOTED. No hardware is connected."] };
}
function checkSession(s) {
  if (!s || s.version !== 1 || !["standard","chaos"].includes(s.mode) ||
      !Number.isInteger(s.index) || s.index < 0 || s.index > LIVING_STEPS ||
      !Array.isArray(s.inspected) || !Array.isArray(s.steps) || s.steps.length !== s.index ||
      !Array.isArray(s.log) || s.log.length > 36 || !Number.isInteger(s.missteps) || s.missteps < 0 ||
      !s.effects || typeof s.effects !== "object" || Array.isArray(s.effects))
    throw new TypeError("Invalid Living Lab session.");
  const lab = getLivingLab(s.labId);
  const ids = lab.nodes.map(n=>n.id);
  if ((s.selected !== null && !ids.includes(s.selected)) ||
      s.inspected.some(id=>!ids.includes(id)) ||
      s.steps.some((step,i)=> step.phase !== lab.stages[i].id ||
        !["sound","chaos"].includes(step.kind)) ||
      Object.keys(s.effects).some(id=>!ids.includes(id)) ||
      Object.values(s.effects).some(value=>!["healthy","suspect","fault","identified","recovered","dramatic"].includes(value)))
    throw new TypeError("Invalid Living Lab state.");
  return lab;
}
const append = (events, message) => [...events, message].slice(-36);
export function currentLivingPhase(session) {
  const lab = checkSession(session);
  return lab.stages[session.index] ?? null;
}
export function inspectLivingNode(session, nodeId) {
  const lab = checkSession(session);
  const stage = lab.stages[session.index];
  if (!stage) throw new RangeError("Lab already complete.");
  const node = lab.nodes.find(item=>item.id === nodeId);
  if (!node) throw new RangeError("Unknown virtual component.");
  const clue = nodeId === stage.target ? stage.clue : node.note;
  return {
    session: { ...session, selected: nodeId,
      inspected: [...new Set([...session.inspected, nodeId])],
      log: append(session.log, "INSPECT " + node.label + ": " + clue) },
    message: clue,
    relevant: nodeId === stage.target
  };
}
export function useLivingTool(session, toolId) {
  const lab = checkSession(session);
  const stage = lab.stages[session.index];
  if (!stage) throw new RangeError("Lab already complete.");
  const tool = stage.tools.find(item=>item.id === toolId);
  if (!tool) throw new RangeError("Tool unavailable in this phase.");
  if (tool.kind === "sound" && !session.inspected.includes(stage.target)) {
    const message = "Inspect the relevant component before making a repair decision. " +
      "The simulator has not changed anything.";
    return { session: { ...session, log:append(session.log,message), missteps:session.missteps+1 },
      message, advanced: false, kind:"hint" };
  }
  if (tool.kind === "decoy") {
    return { session:{ ...session, log:append(session.log,"FALSE LEAD: "+tool.message),
      missteps:session.missteps+1 }, message:tool.message, advanced:false, kind:"decoy" };
  }
  const next = { ...session, index:session.index + 1, selected:null, inspected:[],
    steps:[...session.steps,{phase:stage.id,kind:tool.kind}],
    effects:{...session.effects,...tool.effects},
    log:append(session.log,stage.discipline+" / "+tool.label+": "+tool.message) };
  return { session:next, message:tool.message, advanced:true, kind:tool.kind,
    completed: next.index === LIVING_STEPS };
}
export function summarizeLivingLab(session) {
  const lab=checkSession(session);
  const score=session.steps.reduce((total,step)=>
    total + Number(step.kind === (session.mode === "chaos" ? "chaos":"sound")),0);
  const done=session.index === LIVING_STEPS;
  return Object.freeze({
    labId:lab.id, title:lab.name, mode:session.mode, completed:done, score, total:3,
    missteps:session.missteps, earned:done && score===3,
    restored:done && session.steps.every(step=>step.kind==="sound"),
    narrative: !done ? "The incident is still being investigated." :
      session.steps.every(step=>step.kind==="sound")
        ? "All simulated systems recovered through evidence-led decisions." :
      session.steps.every(step=>step.kind==="chaos")
        ? "FULL CHAOS. The imaginary server is seeking collective bargaining." :
        "Mixed decisions. The simulation requires another run for a clean recovery."
  });
}
export function livingTopology(session) {
  const lab=checkSession(session);
  return lab.nodes.map(node => ({...node,status:session.effects[node.id]||node.status,
    selected:session.selected===node.id, inspected:session.inspected.includes(node.id)}));
}
