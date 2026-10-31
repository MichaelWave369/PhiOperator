import {
  getLivingLab, createLivingLabSession, currentLivingPhase,
  inspectLivingNode, useLivingTool, livingTopology, summarizeLivingLab
} from "./living-labs.js";
import { recordLivingBadge } from "./academy-passport.js";

/**
 * Browser-only terminal theater. Never inserts arbitrary HTML, runs commands,
 * fetches remote data, or asks the host for any operating-system permissions.
 */
export function mountLivingLabUI({ showPanel, onExit, getPassport, savePassport } = {}) {
  if (![showPanel, onExit, getPassport, savePassport].every(fn=>typeof fn==="function"))
    throw new TypeError("Living Lab UI requires explicit navigation and Passport callbacks.");
  const $ = id => document.getElementById(id);
  let session = null;
  let finishedRecorded = false;
  function open(id, mode="standard") {
    session = createLivingLabSession(id, mode);
    finishedRecorded = false;
    showPanel("living");
    $("living-scene").textContent = getLivingLab(id).scene;
    $("living-title").textContent = getLivingLab(id).name;
    $("living-subtitle").textContent = getLivingLab(id).description;
    $("living-report").hidden = true;
    $("living-hint").textContent = "INSPECT THE RACK. Select a component to reveal its simulated state.";
    render();
    $("living").scrollIntoView({block:"start"});
  }
  function render() {
    if (!session) return;
    const lab = getLivingLab(session.labId);
    const phase = currentLivingPhase(session);
    const complete = summarizeLivingLab(session);
    $("living-mode").textContent = session.mode === "chaos" ? "CHAOS / FICTION" : "STANDARD / PRACTICE";
    $("living-mode").classList.toggle("living-chaos",session.mode==="chaos");
    $("living-phase").textContent = phase
      ? "PHASE " + (session.index+1) + "/3 • " + phase.discipline
      : "INCIDENT COMPLETE • FIELD REPORT";
    $("living-goal").textContent = phase ? phase.goal : complete.narrative;
    $("living-score").textContent = "SCORE: " + complete.score + "/3 • FALSE LEADS: " + session.missteps;
    const topology = $("living-rack");
    topology.replaceChildren();
    for (const node of livingTopology(session)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "living-node living-state-" + node.status +
        (node.selected ? " living-selected" : "");
      button.disabled = !phase;
      button.setAttribute("aria-pressed",String(node.selected));
      const role = document.createElement("small");
      role.textContent = node.role;
      const label = document.createElement("strong");
      label.textContent = node.label;
      const status = document.createElement("span");
      status.textContent = node.status.toUpperCase();
      status.className = "living-node-status";
      button.append(role,label,status);
      button.addEventListener("click",()=>{
        const result=inspectLivingNode(session,node.id);
        session=result.session;
        $("living-hint").textContent=(result.relevant?"RELEVANT CLUE: ":"INSPECTION: ")+result.message;
        render();
      });
      topology.append(button);
    }
    const tools = $("living-tools");
    tools.replaceChildren();
    if(phase) for(const tool of phase.tools) {
      const button = document.createElement("button");
      button.type="button";
      button.className="living-tool" + (tool.kind==="chaos"?" living-tool-chaos":"");
      const name=document.createElement("strong");
      name.textContent=tool.label;
      const meta=document.createElement("small");
      meta.textContent=tool.kind==="chaos"
        ? "FICTIONAL CHAOS TOOL"
        : tool.kind==="decoy"?"CHECK THIS HYPOTHESIS":"DIAGNOSTIC / RECOVERY TOOL";
      button.append(name,meta);
      button.addEventListener("click",()=>{
        const outcome=useLivingTool(session,tool.id);
        session=outcome.session;
        $("living-hint").textContent=(outcome.advanced
          ? "CONSEQUENCE: " : "FIELD NOTE: ")+outcome.message;
        render();
      });
      tools.append(button);
    }
    const events=$("living-log");
    events.replaceChildren();
    for(const message of session.log.slice(-7).reverse()) {
      const entry=document.createElement("li");
      entry.textContent=message;
      events.append(entry);
    }
    if(!phase) finishOnce();
  }
  function finishOnce() {
    const report=summarizeLivingLab(session);
    $("living-report").hidden=false;
    $("living-receipt-title").textContent=report.mode==="chaos"
      ? "CHAOS INCIDENT FILED"
      : report.restored?"INCIDENT RESOLVED":"INCIDENT NEEDS REVISIT";
    $("living-receipt-score").textContent=report.score+"/3 • "+
      (report.earned?"BADGE EARNED":"TRY AGAIN FOR A PERFECT BADGE");
    $("living-receipt-copy").textContent=report.narrative;
    if(!finishedRecorded) {
      const awarded=recordLivingBadge(getPassport(),session);
      savePassport(awarded.passport);
      $("living-receipt-unlock").textContent=awarded.newlyEarned
        ? "NEW LOCAL ACADEMY BADGE ADDED TO PASSPORT V1!"
        : "BEST SCORE SAVED IN THE SAME PORTABLE PASSPORT.";
      finishedRecorded=true;
    }
  }
  $("living-exit").addEventListener("click",onExit);
  $("living-restart").addEventListener("click",()=>{
    if(session)open(session.labId,session.mode);
  });
  $("living-report-restart").addEventListener("click",()=>{
    if(session)open(session.labId,session.mode);
  });
  return Object.freeze({open});
}
