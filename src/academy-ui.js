import {
  ACADEMY_LABS, createAcademySession, currentAcademyStage,
  chooseAcademyResponse, summarizeAcademySession
} from "./academy.js";

/** Browser-only simulations. No commands, network, permissions or saved credentials. */
export function mountAcademyUI({ showPanel, returnToPassport, launchLiving } = {}) {
  if (typeof showPanel !== "function" || typeof returnToPassport !== "function")
    throw new TypeError("Academy UI requires navigation callbacks.");
  const $ = id => document.getElementById(id);
  const intro = $("academy-menu"), labPane = $("academy-play");
  let session = null, answered = false;
  function open() {
    showPanel("academy");
    intro.hidden = false;
    labPane.hidden = true;
    $("academy-status").textContent = "Choose one of the three safe, local simulations.";
  }
  function menu() {
    session = null;
    open();
  }
  function start(id, mode) {
    session = createAcademySession(id, mode);
    intro.hidden = true;
    labPane.hidden = false;
    render();
  }
  function render() {
    const lab = ACADEMY_LABS.find(x => x.id === session.labId);
    const stage = currentAcademyStage(session);
    answered = false;
    $("academy-progress").textContent = "SIMULATION " + lab.title + " / " +
      String(session.index + 1).padStart(2, "0") + " OF 03";
    $("academy-question").textContent = stage.text;
    $("academy-feedback").hidden = true;
    $("academy-feedback").replaceChildren();
    $("academy-next").hidden = true;
    const options = $("academy-choices");
    options.replaceChildren();
    stage.choices.forEach((description, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      const prefix = document.createElement("span");
      prefix.className = "choice-key";
      prefix.textContent = "0" + (index + 1);
      const label = document.createElement("span");
      label.textContent = description;
      button.append(prefix, label);
      button.addEventListener("click", () => choose(index));
      options.append(button);
    });
    options.querySelector("button")?.focus({ preventScroll: true });
  }
  function choose(id) {
    if (answered || !session) return;
    const stage = currentAcademyStage(session);
    const expected = session.mode === "chaos" ? stage.chaos : stage.correct;
    const matched = id === expected;
    session = chooseAcademyResponse(session, id);
    answered = true;
    for (const [index, button] of [...$("academy-choices").children].entries()) {
      button.disabled = true;
      if (index === expected) button.classList.add("correct");
      else if (index === id) button.classList.add("incorrect");
    }
    const feedback = $("academy-feedback");
    feedback.hidden = false;
    feedback.className = "feedback " + (matched ? "feedback-good" : "feedback-retry");
    const heading = document.createElement("strong");
    heading.textContent = matched ? session.mode === "chaos"
      ? "SIMULATED CHAOS SUCCESS" : "SOUND DIAGNOSTIC" : "EXPLANATION AVAILABLE";
    const detail = document.createElement("p");
    detail.textContent = stage.lesson;
    const note = document.createElement("small");
    note.textContent = "This is a fictional, consequence-free simulation. No system was changed.";
    feedback.append(heading, detail, note);
    $("academy-next").hidden = false;
    $("academy-next").textContent = session.index === 3 ? "VIEW FIELD REPORT →" : "CONTINUE →";
    $("academy-next").focus({ preventScroll: true });
  }
  function advance() {
    if (!answered) return;
    if (!summarizeAcademySession(session).completed) return render();
    const summary = summarizeAcademySession(session);
    $("academy-play").hidden = true;
    $("academy-menu").hidden = false;
    $("academy-status").textContent = summary.mode.toUpperCase() +
      " SIMULATION COMPLETE: " + summary.score + "/" + summary.total +
      ". Learn, replay or explore another lab. No Operator Passport rank was changed.";
  }
  for (const lab of ACADEMY_LABS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "academy-card";
    const h = document.createElement("strong");
    h.textContent = lab.title;
    const p = document.createElement("span");
    p.textContent = lab.subtitle;
    button.append(h, p);
    button.addEventListener("click", () =>
      start(lab.id, $("academy-chaos").checked ? "chaos" : "standard"));
    const row=document.createElement("div");
    row.className="academy-lab-entry";
    button.setAttribute("aria-label","Play classic three-stage "+lab.title+" simulation");
    row.append(button);
    if(typeof launchLiving==="function") {
      const living=document.createElement("button");
      living.type="button";
      living.className="academy-living-launch";
      living.textContent="ENTER LIVING LAB →";
      living.setAttribute("aria-label","Enter interactive "+lab.title+" environment");
      living.addEventListener("click",()=>{
        launchLiving(lab.id,$("academy-chaos").checked?"chaos":"standard");
      });
      row.append(living);
    }
    $("academy-labs").append(row);
  }
  $("academy-next").addEventListener("click", advance);
  $("academy-exit").addEventListener("click", returnToPassport);
  $("academy-back").addEventListener("click", menu);
  return Object.freeze({ open });
}