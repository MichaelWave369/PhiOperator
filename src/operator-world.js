/**
 * ΦOperator Rung 6 | The Operator's World
 * An entirely fictional nine-room, three-sector training facility.
 * Pure deterministic state transitions. No network, filesystem, shell,
 * permissions, device APIs, or remote state.
 */
export const WORLD_VERSION = 1;
export const WORLD_FORMAT = "phioperator-world";
export const WORLD_STORAGE_KEY = "phioperator.world.v1";
export const WORLD_SECTORS = Object.freeze([
  { id:"signal", label:"01 / SIGNAL", description:"Reconnect the facility's fictional communications." },
  { id:"recovery", label:"02 / RECOVERY", description:"Restore archives, power and cooling." },
  { id:"evidence", label:"03 / EVIDENCE", description:"Calibrate the instruments and restore accountable records." }
].map(s=>Object.freeze(s)));

const source = [
  {
    id:"atrium",sector:"signal",label:"Operator Atrium",role:"CONTROL ROOM",
    problem:"The station dashboard claims everything is offline. Start with local evidence.",
    components:[
      {id:"panel",label:"STATUS PANEL",note:"The local diagnostic bus is powered; the overview is stale."},
      {id:"coffee",label:"COFFEE MACHINE",note:"Beverage subsystem nominal. It is not a network gateway."}
    ],
    target:"panel",clue:"Display refresh stalled after a training update; local status data is still present.",
    tools:[
      {id:"refresh-panel",label:"REBUILD STATUS VIEW",type:"sound",report:"The station dashboard updates. Navigation to the switching bay is restored."},
      {id:"kick-wall",label:"REPLACE THE BUILDING",type:"decoy",report:"That exceeds the scope of a broken screen. Verify the local status bus first."},
      {id:"yell-monitor",label:"SHOUT AT THE MONITOR",type:"chaos",report:"MONITOR HAS DECLINED YOUR PERFORMANCE REVIEW. The next room is still accessible."}
    ]
  },
  {
    id:"switch",sector:"signal",label:"Switch Bay",role:"LOCAL NETWORK",
    problem:"The internal backbone is divided into mismatched simulated VLANs.",
    components:[
      {id:"patch",label:"PATCH MATRIX",note:"Client ports have link, but two VLAN labels do not match."},
      {id:"leds",label:"BLINKING LEDS",note:"Many lights blink. Blink rate does not prove correct segmentation."}
    ],
    target:"patch",clue:"The uplink expects VLAN 369 but the desk ports are configured for VLAN 963.",
    tools:[
      {id:"align-vlan",label:"ALIGN VLAN MAPPING",type:"sound",report:"Internal LAN frames now reach the relay gateway."},
      {id:"reset-switch",label:"FACTORY RESET EVERYTHING",type:"decoy",report:"A full reset would discard working config. Fix the observed mismatch instead."},
      {id:"unionize-leds",label:"UNIONIZE THE LINK LEDS",type:"chaos",report:"THE LEDS VOTED UNANIMOUSLY FOR A LONGER LUNCH BREAK."}
    ]
  },
  {
    id:"relay",sector:"signal",label:"Signal Relay",role:"COMMS UPLINK",
    problem:"The communication repeater has lost its route to the main corridor.",
    components:[
      {id:"route",label:"ROUTE MONITOR",note:"Uplink frames arrive, but the target path shows an obsolete next hop."},
      {id:"satellite",label:"MINI SATELLITE",note:"Decorative, not launched. Earth has not requested an additional moon."}
    ],
    target:"route",clue:"Simulated route 10.3.6.0/24 points to a decommissioned gateway.",
    tools:[
      {id:"fix-next-hop",label:"RESTORE KNOWN-GOOD ROUTE",type:"sound",report:"Facility communications return. Recovery sector telemetry is now visible."},
      {id:"boost-volume",label:"TURN THE SIGNAL UP TO ELEVEN",type:"decoy",report:"Volume cannot repair a next-hop entry. Transport is not a guitar amplifier."},
      {id:"launch-satellite",label:"LAUNCH THE DESK SATELLITE",type:"chaos",report:"UNLICENSED ORBIT ATTEMPT REJECTED. THE MOON HAS COMPLAINED."}
    ]
  },
  {
    id:"archive",sector:"recovery",label:"Archive Vault",role:"BACKUP STORAGE",
    problem:"A backup exists, but its usefulness has not been verified.",
    components:[
      {id:"snapshot",label:"SNAPSHOT CONSOLE",note:"A recent backup has checksum metadata but no tested restore receipt."},
      {id:"label",label:"BACKUP STICKER",note:"The sticker says TRUST ME. The sticker cannot restore databases."}
    ],
    target:"snapshot",clue:"Archive sample is ready for validation in an isolated simulation, without touching the original.",
    tools:[
      {id:"test-restore",label:"VERIFY A SANDBOX RESTORE",type:"sound",report:"Archive integrity proven in a fictional isolated restore. Recovery evidence is recorded."},
      {id:"delete-original",label:"OVERWRITE THE ONLY COPY",type:"decoy",report:"Not a viable restoration plan. Never test against the only remaining data."},
      {id:"feed-goblin",label:"BRIBE THE BACKUP GOBLIN",type:"chaos",report:"GOBLIN ACCEPTS A DIGITAL COOKIE AND ISSUES A COMPLETELY USELESS RECEIPT."}
    ]
  },
  {
    id:"workshop",sector:"recovery",label:"Repair Workshop",role:"POWER REGULATION",
    problem:"The laboratory power bus drifts whenever a test load is connected.",
    components:[
      {id:"regulator",label:"VOLTAGE REGULATOR",note:"Load readings show a reversible configuration offset."},
      {id:"hammer",label:"GOLDEN HAMMER",note:"Commemorative hammer. It is not an approved electrical diagnostic instrument."}
    ],
    target:"regulator",clue:"The simulated voltage regulator uses an old profile; a known-good profile is available.",
    tools:[
      {id:"restore-profile",label:"RESTORE POWER PROFILE",type:"sound",report:"Power bus stabilizes under a simulated test load."},
      {id:"raise-limits",label:"REMOVE ALL VOLTAGE LIMITS",type:"decoy",report:"Electrical protections exist for a reason. This fake system declines an unsafe shortcut."},
      {id:"pat-hammer",label:"PROMOTE THE GOLDEN HAMMER",type:"chaos",report:"HAMMER PROMOTED TO SENIOR ENGINEER. POWER BUS REMAINS UNIMPRESSED."}
    ]
  },
  {
    id:"cooling",sector:"recovery",label:"Cooling Core",role:"THERMAL PLANT",
    problem:"Cooling loop performance is down because the controller reads the wrong sensor.",
    components:[
      {id:"controller",label:"COOLING CONTROLLER",note:"Telemetry maps a cold reference probe to the hot return loop."},
      {id:"fan",label:"DECORATIVE FAN",note:"Its spinning animation is not a thermal measurement."}
    ],
    target:"controller",clue:"The control loop has a swapped sensor identifier; a calibration table shows the expected mapping.",
    tools:[
      {id:"repair-mapping",label:"RESTORE SENSOR MAPPING",type:"sound",report:"Cooling returns to nominal. The evidence sector can safely simulate calibration."},
      {id:"speed-up",label:"SPIN THE FAN 9000%",type:"decoy",report:"Fan speed without trustworthy sensors is not evidence of restored cooling."},
      {id:"install-snow",label:"INSTALL VIRTUAL SNOW",type:"chaos",report:"THE SERVER IS WEARING A SCARF. TEMPERATURE REMAINS ENTIRELY FICTIONAL."}
    ]
  },
  {
    id:"calibration",sector:"evidence",label:"Calibration Chamber",role:"REFERENCE INSTRUMENT",
    problem:"A sensor's remarkable result may be drift rather than a new discovery.",
    components:[
      {id:"reference",label:"REFERENCE SENSOR",note:"The test fixture can compare raw baseline and null conditions."},
      {id:"trophy",label:"PREMATURE TROPHY",note:"Inscription: MOST INTERESTING GRAPH BEFORE REPLICATION."}
    ],
    target:"reference",clue:"The anomaly tracks warmup time. A reference measurement is required.",
    tools:[
      {id:"calibrate",label:"RUN CONTROLLED CALIBRATION",type:"sound",report:"Baseline and control series are recorded. Sensor drift is identified."},
      {id:"hide-zero",label:"HIDE THE ZERO LINE",type:"decoy",report:"An enthusiastic graph is not evidence. Keep axes and data transparent."},
      {id:"award-trophy",label:"AWARD THE SENSOR A MEDAL",type:"chaos",report:"THE SENSOR WINS FIRST PLACE IN EXISTING LOUDLY."}
    ]
  },
  {
    id:"ledger",sector:"evidence",label:"Evidence Ledger",role:"PROVENANCE RECORD",
    problem:"Two subsystem reports contradict each other. Reconcile the source records.",
    components:[
      {id:"records",label:"EVENT RECORDS",note:"Clock offsets explain the apparent sequence conflict."},
      {id:"oracle",label:"VERY CONFIDENT ORACLE",note:"The oracle has opinions. It has not read the raw records."}
    ],
    target:"records",clue:"Network and power logs differ by nine minutes. Time normalization resolves ordering.",
    tools:[
      {id:"reconcile-clocks",label:"NORMALIZE AND VERIFY LOGS",type:"sound",report:"The incident timeline is reconciled and the audit trail can be trusted for the exercise."},
      {id:"discard-logs",label:"DISCARD THE CONFLICTING ENTRIES",type:"decoy",report:"Deleting inconvenient evidence makes the audit trail less reliable."},
      {id:"promote-oracle",label:"PROMOTE THE ORACLE TO CEO",type:"chaos",report:"THE ORACLE NOW MAKES THREE TIMES AS MANY UNVERIFIED CLAIMS."}
    ]
  },
  {
    id:"nexus",sector:"evidence",label:"Central Nexus",role:"FINAL CONTROL",
    problem:"Three linked checks must agree before the simulated facility can declare recovery.",
    components:[
      {id:"comms",label:"COMMS CHECK",note:"Requires the Atrium, Switch Bay and Signal Relay properly repaired."},
      {id:"power",label:"POWER CHECK",note:"Requires verified Archive, Workshop and Cooling repairs."},
      {id:"proof",label:"EVIDENCE CHECK",note:"Requires calibrated measurement and reconciled logs."}
    ],
    target:"comms",clue:"Confirm upstream subsystem receipts, then perform the three nexus checks.",
    tools:[]
  }
];
export const WORLD_ROOMS = Object.freeze(source.map((room,i)=>Object.freeze({
  ...room, order:i, components:Object.freeze(room.components.map(x=>Object.freeze(x))),
  tools:Object.freeze(room.tools.map(x=>Object.freeze(x)))
})));
export const WORLD_LINKS = Object.freeze([
  ["atrium","switch"],["switch","relay"],["relay","archive"],
  ["archive","workshop"],["workshop","cooling"],["cooling","calibration"],
  ["calibration","ledger"],["ledger","nexus"],
  ["atrium","archive"],["switch","workshop"],["relay","cooling"],
  ["archive","calibration"],["workshop","ledger"],["cooling","nexus"]
].map(pair=>Object.freeze(pair)));

export const NEXUS_CHECKS = Object.freeze([
  {id:"comms",label:"CHECK 01 / COMMUNICATIONS",clue:"Confirm the three Signal sector repair receipts.",tool:"PROVE COMMS PATH",
   requires:["atrium","switch","relay"],repair:"The simulated communications network responds on all test corridors.",
   chaos:"PATCH-9 HAS ROUTED ALL CALLS THROUGH A RUBBER DUCK."},
  {id:"power",label:"CHECK 02 / RECOVERY",clue:"Confirm archive integrity, regulator profile and cooling sensor mapping.",tool:"PROVE RECOVERY PATH",
   requires:["archive","workshop","cooling"],repair:"Verified recovery, stable power and thermal readings agree.",
   chaos:"THE BACKUP GOBLIN HAS BEEN APPOINTED MINISTER OF ELECTRICITY."},
  {id:"proof",label:"CHECK 03 / EVIDENCE",clue:"Cross-check calibration and evidence provenance.",tool:"PROVE AUDIT TRAIL",
   requires:["calibration","ledger"],repair:"Audit and calibration receipts form a consistent test chain.",
   chaos:"THE ORACLE HAS DECLARED VICTORY WITHOUT READING ANYTHING."}
].map(x=>Object.freeze({...x,requires:Object.freeze(x.requires)})));

const IDs = new Set(WORLD_ROOMS.map(x=>x.id));
const OUTCOME = new Set(["sound","chaos"]);
const MODE = new Set(["standard","chaos"]);
const isObj = x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const makeLog=(log,message)=>[...log,message].slice(-36);
const clone=s=>({
  format:WORLD_FORMAT,version:WORLD_VERSION,mode:s.mode,current:s.current,
  returnTo:s.returnTo,outcomes:{...s.outcomes},
  inspected:Object.fromEntries(Object.entries(s.inspected).map(([k,v])=>[k,[...v]])),
  nexus:[...s.nexus],chaosHistory:[...s.chaosHistory],
  secretVisited:s.secretVisited,log:[...s.log]
});
export function newOperatorWorld(mode="standard"){
  if(!MODE.has(mode))throw new TypeError("Unknown facility mode.");
  return {format:WORLD_FORMAT,version:WORLD_VERSION,mode,current:"atrium",
    returnTo:null,outcomes:{},inspected:{},nexus:[],chaosHistory:[],
    secretVisited:false,log:["PATCH-9 ONLINE. Nine rooms, three sectors. Inspect first. Panic later."]};
}
export function validateOperatorWorld(raw){
  if(!isObj(raw)||raw.format!==WORLD_FORMAT||raw.version!==WORLD_VERSION||!MODE.has(raw.mode)||
    !(IDs.has(raw.current)||raw.current==="annex")||
    !(raw.returnTo===null||IDs.has(raw.returnTo))||
    !isObj(raw.outcomes)||!isObj(raw.inspected)||!Array.isArray(raw.nexus)||
    raw.nexus.length>3||!Array.isArray(raw.chaosHistory)||raw.chaosHistory.length>9||
    typeof raw.secretVisited!=="boolean"||!Array.isArray(raw.log)||
    raw.log.length>36||raw.log.some(x=>typeof x!=="string"||x.length>350))
    throw new TypeError("Invalid Operator's World save.");
  const clean=newOperatorWorld(raw.mode);
  clean.current=raw.current;clean.returnTo=raw.returnTo;
  clean.secretVisited=raw.secretVisited;clean.log=[...raw.log];
  for(const [id,outcome] of Object.entries(raw.outcomes)){
    if(!IDs.has(id)||id==="nexus"||!OUTCOME.has(outcome))
      throw new TypeError("Invalid room result.");
    clean.outcomes[id]=outcome;
  }
  for(const [id,inspections] of Object.entries(raw.inspected)){
    if(!IDs.has(id)||!Array.isArray(inspections)||inspections.length>3||
      new Set(inspections).size!==inspections.length)
      throw new TypeError("Invalid room inspections.");
    const allowed=WORLD_ROOMS.find(x=>x.id===id).components.map(c=>c.id);
    if(inspections.some(x=>!allowed.includes(x)))
      throw new TypeError("Invalid component inspection.");
    clean.inspected[id]=[...inspections];
  }
  if(raw.nexus.some(x=>!OUTCOME.has(x)))throw new TypeError("Invalid Nexus step.");
  clean.nexus=[...raw.nexus];
  if(new Set(raw.chaosHistory).size!==raw.chaosHistory.length||
    raw.chaosHistory.some(x=>!IDs.has(x)))
    throw new TypeError("Invalid Chaos history.");
  clean.chaosHistory=[...raw.chaosHistory];
  if(clean.current==="annex"&&(!clean.returnTo||clean.chaosHistory.length<3))
    throw new TypeError("Hidden annex cannot be entered without the Chaos trail.");
  // Saves are game data, not tamperproof credentials. These guards stop
  // malformed files from causing inconsistent UI state, not user cheating.
  return clean;
}
export function parseOperatorWorld(text){
  if(typeof text!=="string"||text.length>16384)
    throw new TypeError("World save must be valid JSON under 16 KiB.");
  return validateOperatorWorld(JSON.parse(text));
}
export function serializeOperatorWorld(state){
  const text=JSON.stringify(validateOperatorWorld(state),null,2);
  if(text.length>16384)throw new TypeError("World save exceeds 16 KiB.");
  return text;
}
export function getWorldRoom(id){
  const room=WORLD_ROOMS.find(x=>x.id===id);
  if(!room)throw new RangeError("Unknown world room.");
  return room;
}
export function isWorldRoomUnlocked(state,id) {
  const s=validateOperatorWorld(state);
  const room=getWorldRoom(id);
  return room.order===0||Boolean(s.outcomes[WORLD_ROOMS[room.order-1].id]);
}
export function getWorldNeighbors(state){
  const s=validateOperatorWorld(state);
  const from=s.current==="annex"?s.returnTo:s.current;
  return WORLD_LINKS.flatMap(([a,b])=>a===from?[b]:b===from?[a]:[])
    .filter(id=>isWorldRoomUnlocked(s,id));
}
export function enterWorldRoom(state,id){
  const s=validateOperatorWorld(state);
  if(s.current==="annex")throw new RangeError("Leave the annex first.");
  if(!isWorldRoomUnlocked(s,id))throw new RangeError("Repair or simulate the preceding room first.");
  if(id!==s.current&&!getWorldNeighbors(s).includes(id))
    throw new RangeError("Room is not connected to the current position.");
  const next=clone(s);
  next.current=id;
  next.log=makeLog(next.log,"ENTER "+getWorldRoom(id).label.toUpperCase()+".");
  return next;
}
export function getWorldSignals(state){
  const s=validateOperatorWorld(state);
  const all=ids=>ids.every(id=>s.outcomes[id]==="sound");
  return Object.freeze({
    local:all(["atrium","switch"]),
    communications:all(["atrium","switch","relay"]),
    backups:all(["archive"]),
    recovery:all(["archive","workshop","cooling"]),
    provenance:all(["calibration","ledger"])
  });
}
export function getNexusStep(state) {
  const s=validateOperatorWorld(state);
  return NEXUS_CHECKS[s.nexus.length]||null;
}
export function inspectWorldComponent(state,target){
  const s=validateOperatorWorld(state);
  if(s.current==="annex")throw new RangeError("No hardware in the fictional annex.");
  const room=getWorldRoom(s.current);
  const component=room.components.find(c=>c.id===target);
  if(!component)throw new RangeError("Unknown virtual device.");
  const next=clone(s);
  const inspected=new Set(next.inspected[room.id]||[]);
  inspected.add(target);
  next.inspected[room.id]=[...inspected];
  const check=room.id==="nexus"?NEXUS_CHECKS[next.nexus.length]:null;
  const relevant=check?target===check.id:target===room.target;
  const message=relevant?(check?check.clue:room.clue):component.note;
  next.log=makeLog(next.log,"INSPECT "+component.label+": "+message);
  return {state:next,message,relevant};
}
function nextChaos(s,roomId){
  if(!s.chaosHistory.includes(roomId))s.chaosHistory.push(roomId);
}
export function actInWorld(state,actionId){
  const s=validateOperatorWorld(state);
  if(s.current==="annex")throw new RangeError("Annex is a narrative easter egg.");
  const room=getWorldRoom(s.current);
  if(room.id==="nexus")return actInNexus(s,actionId);
  const action=room.tools.find(x=>x.id===actionId);
  if(!action)throw new RangeError("Unknown room tool.");
  const next=clone(s);
  if(action.type==="decoy"){
    next.log=makeLog(next.log,"FALSE LEAD: "+action.report);
    return {state:next,advanced:false,kind:"decoy",message:action.report};
  }
  if(action.type==="sound"&&!(s.inspected[room.id]||[]).includes(room.target)){
    const message="PATCH-9: Inspect the relevant device before applying a repair. I refuse to guess on principle.";
    next.log=makeLog(next.log,message);
    return {state:next,advanced:false,kind:"hint",message};
  }
  next.outcomes[room.id]=action.type;
  if(action.type==="chaos")nextChaos(next,room.id);
  next.log=makeLog(next.log,action.label+": "+action.report);
  const message=action.report+" "+(action.type==="sound"
    ?"PATCH-9: An actual diagnosis. I'll notify the department of miracles."
    :"PATCH-9: This is why our insurance only covers imaginary buildings.");
  return {state:next,advanced:true,kind:action.type,message};
}
function actInNexus(s,actionId){
  const check=NEXUS_CHECKS[s.nexus.length];
  if(!check)throw new RangeError("The final report is already recorded. Replay the Nexus to retry.");
  if(!["sound","chaos","decoy"].includes(actionId))throw new RangeError("Unknown Nexus action.");
  const next=clone(s);
  if(actionId==="decoy"){
    const message="PATCH-9: You cannot certify a facility by looking at its wallpaper.";
    next.log=makeLog(next.log,message);
    return {state:next,advanced:false,kind:"decoy",message};
  }
  if(actionId==="sound") {
    if(!(s.inspected.nexus||[]).includes(check.id)){
      const message="Inspect the "+check.label+" terminal before running a real verification.";
      next.log=makeLog(next.log,message);
      return {state:next,advanced:false,kind:"hint",message};
    }
    const missing=check.requires.filter(id=>s.outcomes[id]!=="sound");
    if(missing.length){
      const message="Upstream verification missing: "+missing.map(id=>getWorldRoom(id).label).join(", ")+
        ". Go repair those rooms and return.";
      next.log=makeLog(next.log,message);
      return {state:next,advanced:false,kind:"blocked",message};
    }
  }
  next.nexus.push(actionId);
  next.inspected.nexus=[];
  if(actionId==="chaos")nextChaos(next,"nexus");
  const message=actionId==="sound"?check.repair:check.chaos;
  next.log=makeLog(next.log,check.label+": "+message);
  return {state:next,advanced:true,kind:actionId,message,completed:next.nexus.length===3};
}
export function replayNexus(state){
  const next=clone(validateOperatorWorld(state));
  next.nexus=[];next.inspected.nexus=[];
  next.log=makeLog(next.log,"NEXUS SIMULATION RESET. Prior sector receipts are preserved.");
  return next;
}
export function canEnterSecret(state){
  return validateOperatorWorld(state).chaosHistory.length>=3;
}
export function enterSecretAnnex(state){
  const s=validateOperatorWorld(state);
  if(s.current==="annex"||!canEnterSecret(s))throw new RangeError("The fictional complaints annex remains hidden.");
  const next=clone(s);
  next.returnTo=next.current;next.current="annex";next.secretVisited=true;
  next.log=makeLog(next.log,"PATCH-9: Welcome to the Department of Preventable Incidents. HR is a toaster.");
  return next;
}
export function leaveSecretAnnex(state){
  const s=validateOperatorWorld(state);
  if(s.current!=="annex")throw new RangeError("Not in secret annex.");
  const next=clone(s);
  next.current=s.returnTo;next.returnTo=null;
  next.log=makeLog(next.log,"LEFT COMPLAINTS ANNEX. The toaster has retained legal counsel.");
  return next;
}
export function worldReport(state){
  const s=validateOperatorWorld(state);
  const flags=getWorldSignals(s);
  const completed=s.nexus.length===3;
  const repaired=completed&&s.nexus.every(x=>x==="sound")&&
    WORLD_ROOMS.slice(0,8).every(room=>s.outcomes[room.id]==="sound");
  const chaos=completed&&s.nexus.every(x=>x==="chaos")&&s.chaosHistory.length>=3;
  const visited=Object.keys(s.outcomes).length;
  return Object.freeze({
    completed,repaired,chaos,roomsResolved:visited,totalRooms:9,
    chaosEvents:s.chaosHistory.length,secretAvailable:s.chaosHistory.length>=3,
    secretVisited:s.secretVisited,sectorSignals:flags,
    ending:!completed?"in-progress":repaired?"restored":chaos?"chaos":"mixed",
    narrative:!completed?"The facility awaits your next investigation.":
      repaired?"ALL NINE ROOMS VERIFIED. The fictional station is back online.":
      chaos?"CHAOS ENDING: The facility is under management by a unionized toaster.":
      "MIXED ENDING: The final report is incomplete. Revisit unverified rooms and retry the Nexus."
  });
}
