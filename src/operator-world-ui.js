import {
  WORLD_ROOMS, WORLD_SECTORS, WORLD_STORAGE_KEY, newOperatorWorld,
  parseOperatorWorld, serializeOperatorWorld, isWorldRoomUnlocked,
  getWorldNeighbors, enterWorldRoom, inspectWorldComponent,
  actInWorld, getWorldSignals, getNexusStep, worldReport, replayNexus,
  canEnterSecret, enterSecretAnnex, leaveSecretAnnex
} from "./operator-world.js";
import { awardWorldMedal } from "./world-passport.js";

/**
 * Purely local DOM renderer. No actual network calls, shell commands,
 * device access, privileged APIs or external dependencies.
 */
export function mountOperatorWorld({
  showPanel, returnToAcademy, getPassport, savePassport
} = {}){
  if (![showPanel,returnToAcademy,getPassport,savePassport].every(x=>typeof x==="function"))
    throw new TypeError("Operator World requires navigation and local Passport callbacks.");
  const $=id=>document.getElementById(id);
  let state=null, savedLocally=false;
  let lastMessage="PATCH-9: Welcome aboard. Please don't start with the dramatic buttons.";
  const getStorage=()=>{try{return localStorage;}catch{return null;}};
  function load(){
    try{
      const value=getStorage()?.getItem(WORLD_STORAGE_KEY);
      return value?parseOperatorWorld(value):null;
    }catch{return null;}
  }
  function persist(){
    try{
      const storage=getStorage();
      if(!storage)throw new Error("storage disabled");
      storage.setItem(WORLD_STORAGE_KEY,serializeOperatorWorld(state));
      savedLocally=true;
    }catch{savedLocally=false;}
    $("world-storage").textContent=savedLocally
      ?"AUTOSAVED LOCALLY • EXPORT OPTIONAL"
      :"BROWSER STORAGE UNAVAILABLE • EXPORT YOUR WORLD SAVE TO KEEP IT";
  }
  function say(text){lastMessage=text; $("world-companion").textContent=text;}
  function finish(){
    const report=worldReport(state);
    if(!report.completed)return;
    const outcome=awardWorldMedal(getPassport(),state);
    if(outcome.newlyEarned){
      savePassport(outcome.passport);
      say("PATCH-9: New World medal recorded in your existing Passport v1. Please don't frame it as an admin certificate.");
    }
  }
  function commit(next,message){
    state=next;
    persist();
    if(message)say(message);
    finish();
    render();
  }
  function open(mode="standard"){
    if(!["standard","chaos"].includes(mode))throw new TypeError("Unknown mode.");
    if(!state)state=load()||newOperatorWorld(mode);
    showPanel("world");
    if(state.mode!==mode) say("PATCH-9: Your saved "+state.mode.toUpperCase()+
      " campaign is preserved. Export or start a new simulation to change modes.");
    render();
    $("world").scrollIntoView({block:"start"});
  }
  function render(){
    if(!state)return;
    const report=worldReport(state);
    const inAnnex=state.current==="annex";
    const room=inAnnex?null:WORLD_ROOMS.find(x=>x.id===state.current);
    $("world-progress").textContent="ROOMS RESOLVED "+report.roomsResolved+"/8 • NEXUS "+
      state.nexus.length+"/3 • CHAOS INCIDENTS "+report.chaosEvents;
    $("world-mode-label").textContent=state.mode==="chaos"?"CHAOS SIMULATION":"STANDARD SIMULATION";
    $("world-companion").textContent=lastMessage;
    $("world-storage").textContent=savedLocally
      ?"AUTOSAVED LOCALLY • EXPORT OPTIONAL":"EXPORT YOUR WORLD SAVE TO PRESERVE THIS RUN";
    const roomMap=$("world-map");
    roomMap.replaceChildren();
    const neighbors=inAnnex?[]:getWorldNeighbors(state);
    for(const sector of WORLD_SECTORS){
      const section=document.createElement("section");
      section.className="world-sector";
      const heading=document.createElement("h3");
      heading.textContent=sector.label;
      const sub=document.createElement("p");
      sub.textContent=sector.description;
      const row=document.createElement("div");
      row.className="world-sector-rooms";
      for(const item of WORLD_ROOMS.filter(x=>x.sector===sector.id)){
        const accessible=isWorldRoomUnlocked(state,item.id);
        const reachable=!inAnnex&&(state.current===item.id||neighbors.includes(item.id));
        const outcome=state.outcomes[item.id];
        const button=document.createElement("button");
        button.type="button";
        button.className="world-room-tile "+(state.current===item.id?"world-room-current ":"")+
          (outcome==="sound"?"world-room-fixed ":"")+
          (outcome==="chaos"?"world-room-chaos ":"");
        button.disabled=!accessible||!reachable;
        button.setAttribute("aria-current",state.current===item.id?"location":"false");
        const number=document.createElement("small");
        number.textContent="ROOM "+String(item.order+1).padStart(2,"0");
        const label=document.createElement("strong");
        label.textContent=item.label;
        const status=document.createElement("span");
        status.textContent=!accessible?"LOCKED":outcome==="sound"?"REPAIRED":
          outcome==="chaos"?"CHAOS CLEARED":state.current===item.id?"CURRENT":
          reachable?"VISIT":"CONNECTED PATH ONLY";
        button.append(number,label,status);
        button.addEventListener("click",()=>{
          commit(enterWorldRoom(state,item.id),
            "PATCH-9: "+item.label+". Remember, inspecting a panel is cheaper than replacing the universe.");
        });
        row.append(button);
      }
      section.append(heading,sub,row);
      roomMap.append(section);
    }
    const flags=getWorldSignals(state);
    const signals=$("world-signals");
    signals.replaceChildren();
    const signalDefs=[
      ["LOCAL LAN",flags.local],["COMMS",flags.communications],
      ["BACKUP",flags.backups],["RECOVERY",flags.recovery],
      ["EVIDENCE",flags.provenance]
    ];
    for(const [label,active] of signalDefs){
      const item=document.createElement("span");
      item.className="world-signal "+(active?"world-signal-online":"world-signal-offline");
      item.textContent=(active?"● ":"○ ")+label+" "+(active?"VERIFIED":"PENDING");
      signals.append(item);
    }
    $("world-secret").hidden=!canEnterSecret(state)||inAnnex;
    $("world-leave-secret").hidden=!inAnnex;
    $("world-scene").hidden=inAnnex;
    $("world-annex").hidden=!inAnnex;
    $("world-nexus-retry").hidden=!(state.current==="nexus"&&report.completed);
    if(inAnnex){
      $("world-annex-status").textContent="The Department of Preventable Incidents has accepted "+
        report.chaosEvents+" fictional grievance reports. Your employer is a toaster. No real systems are affected.";
    } else {
      $("world-room-name").textContent=room.label.toUpperCase();
      $("world-room-problem").textContent=room.problem;
      $("world-room-state").textContent=room.id==="nexus"
        ?"NEXUS CHECK "+Math.min(3,state.nexus.length+1)+"/3"
        :state.outcomes[room.id]==="sound"?"REPAIRED • CAN REVISIT":
          state.outcomes[room.id]==="chaos"?"CHAOS CLEAR • REPAIR STILL POSSIBLE":"AWAITING INSPECTION";
      const check=room.id==="nexus"?getNexusStep(state):null;
      $("world-briefing").textContent=check
        ?check.label+": "+check.clue
        :room.id==="nexus"
          ?"Final checks complete. Review your field report or replay the Nexus."
          :"Inspect the evidence source, then select a tool. Each tool changes only fictional state.";
      const inspect=$("world-inspect");
      inspect.replaceChildren();
      for(const component of room.components){
        const button=document.createElement("button");
        button.type="button";
        button.className="world-inspect-button";
        button.disabled=room.id==="nexus"&&!check;
        const name=document.createElement("strong");
        name.textContent=component.label;
        const desc=document.createElement("small");
        desc.textContent=(state.inspected[room.id]||[]).includes(component.id)
          ?"INSPECTED • "+component.note:"INSPECT COMPONENT";
        button.append(name,desc);
        button.addEventListener("click",()=>{
          const found=inspectWorldComponent(state,component.id);
          commit(found.state,"PATCH-9: "+(found.relevant?"Useful evidence! ":"Interesting, but not your current fault. ")+found.message);
        });
        inspect.append(button);
      }
      const actions=$("world-actions");
      actions.replaceChildren();
      const tools=room.id==="nexus"
        ?check?[
          {id:"sound",label:check.tool,type:"sound",report:check.repair},
          {id:"decoy",label:"CERTIFY USING VIBES",type:"decoy",report:"The facility's vibes are not a receipt."},
          {id:"chaos",label:"APPOINT CHAOS SUPERVISOR",type:"chaos",report:check.chaos}
        ]:[]
        :room.tools;
      for(const tool of tools){
        const button=document.createElement("button");
        button.type="button";
        button.className="world-tool world-tool-"+tool.type;
        const name=document.createElement("strong");
        name.textContent=tool.label;
        const type=document.createElement("small");
        type.textContent=tool.type==="sound"?"DIAGNOSE / REPAIR":
          tool.type==="chaos"?"ABSURD FICTIONAL OUTCOME":"FALSE LEAD";
        button.append(name,type);
        button.addEventListener("click",()=>{
          const outcome=actInWorld(state,tool.id);
          const lead=outcome.kind==="sound"
            ?"PATCH-9: Shocking. Evidence-based troubleshooting worked. "
            :outcome.kind==="chaos"
              ?"PATCH-9: I am updating our fictional insurance policy. "
              :"PATCH-9: Not quite. Let's avoid prescribing random reboots. ";
          commit(outcome.state,lead+outcome.message);
        });
        actions.append(button);
      }
    }
    const log=$("world-log");
    log.replaceChildren();
    for(const entry of state.log.slice(-8).reverse()){
      const li=document.createElement("li");
      li.textContent=entry;
      log.append(li);
    }
    $("world-report").hidden=!report.completed;
    if(report.completed){
      $("world-ending").textContent=report.ending.toUpperCase()+" ENDING";
      $("world-ending-copy").textContent=report.narrative;
      $("world-ending-medal").textContent=report.repaired
        ?"WORLD MEDAL: FACILITY RESTORER":report.chaos
          ?"WORLD MEDAL: UNIONIZED TOASTER NEGOTIATOR"
          :"REPAIR UNVERIFIED SYSTEMS AND REPLAY THE NEXUS FOR A PERFECT MEDAL";
    }
  }
  function exportFile(){
    const text=serializeOperatorWorld(state);
    const url=URL.createObjectURL(new Blob([text],{type:"application/json"}));
    const a=document.createElement("a");
    a.href=url;
    a.download="phioperator-world-v1.json";
    document.body.append(a);
    a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    say("PATCH-9: World save exported. A tiny universe, now living in a JSON file.");
  }
  async function importFile(event){
    const file=event.currentTarget.files?.[0];
    event.currentTarget.value="";
    if(!file)return;
    try{
      if(file.size>16384)throw new TypeError("World save exceeds 16 KiB.");
      const candidate=parseOperatorWorld(await file.text());
      if(!window.confirm("Replace the current local World simulation with the imported one? The Operator Passport and Academy scores stay intact."))return;
      commit(candidate,"PATCH-9: Imported your fictional facility. The liability waivers are also fictional.");
    }catch(error){say("PATCH-9: Import rejected: "+error.message);}
  }
  function restart(mode){
    if(!window.confirm("Start a new "+mode+" World? Export your current World save first if you want to keep it. Your Operator Passport badges stay intact."))return;
    commit(newOperatorWorld(mode),"PATCH-9: World reset. Nine fresh problems. Same questionable management.");
  }
  $("world-exit").addEventListener("click",returnToAcademy);
  $("world-export").addEventListener("click",exportFile);
  $("world-import").addEventListener("change",importFile);
  $("world-new-standard").addEventListener("click",()=>restart("standard"));
  $("world-new-chaos").addEventListener("click",()=>restart("chaos"));
  $("world-secret").addEventListener("click",()=>{
    commit(enterSecretAnnex(state),"PATCH-9: You found the complaints annex. Please keep your complaints under twelve volumes.");
  });
  $("world-leave-secret").addEventListener("click",()=>{
    commit(leaveSecretAnnex(state),"PATCH-9: Leaving the complaints department. Everyone has been put on probation.");
  });
  $("world-nexus-retry").addEventListener("click",()=>{
    commit(replayNexus(state),"PATCH-9: Nexus restarted. Already completed sector repairs remain recorded.");
  });
  return Object.freeze({open});
}
