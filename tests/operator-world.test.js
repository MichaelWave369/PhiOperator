import test from "node:test";
import assert from "node:assert/strict";
import {
 WORLD_ROOMS,WORLD_SECTORS,WORLD_LINKS,NEXUS_CHECKS,WORLD_VERSION,
 newOperatorWorld,validateOperatorWorld,parseOperatorWorld,serializeOperatorWorld,
 getWorldNeighbors,enterWorldRoom,isWorldRoomUnlocked,inspectWorldComponent,
 actInWorld,getWorldSignals,getNexusStep,replayNexus,worldReport,
 canEnterSecret,enterSecretAnnex,leaveSecretAnnex
} from "../src/operator-world.js";

function solveRoom(s,id,kind="sound"){
  // Follow the canonical room chain, navigating from the current room
  // through the neighbor graph without bypassing lock gates.
  const room=WORLD_ROOMS.find(x=>x.id===id);
  if(s.current!==id) s=enterWorldRoom(s,id);
  if(kind==="sound")s=inspectWorldComponent(s,room.target).state;
  const result=actInWorld(s,room.tools.find(t=>t.type===kind).id);
  assert.equal(result.advanced,true,id);
  return result.state;
}
function reachNexus(kind="sound"){
 let s=newOperatorWorld(kind==="chaos"?"chaos":"standard");
 for(const room of WORLD_ROOMS.slice(0,8))s=solveRoom(s,room.id,kind);
 return enterWorldRoom(s,"nexus");
}
function completeNexus(s,kind="sound"){
 while(getNexusStep(s)){
   const check=getNexusStep(s);
   if(kind==="sound")s=inspectWorldComponent(s,check.id).state;
   const outcome=actInWorld(s,kind);
   assert.equal(outcome.advanced,true,check.id);
   s=outcome.state;
 }
 return s;
}
test("nine fixed rooms, three sectors, three distinct final checks, connected playable path",()=>{
 assert.equal(WORLD_SECTORS.length,3);
 assert.equal(WORLD_ROOMS.length,9);
 assert.equal(new Set(WORLD_ROOMS.map(x=>x.id)).size,9);
 assert.deepEqual(WORLD_ROOMS.map(x=>x.sector),
   [...Array(3).fill("signal"),...Array(3).fill("recovery"),...Array(3).fill("evidence")]);
 assert.equal(NEXUS_CHECKS.length,3);
 assert.equal(WORLD_LINKS.length,14);
 assert.equal(WORLD_VERSION,1);
 for(const room of WORLD_ROOMS.slice(0,8)){
   assert.equal(room.components.length,2);
   assert.equal(room.tools.length,3);
   assert.deepEqual(room.tools.map(x=>x.type),["sound","decoy","chaos"]);
   assert(room.components.some(x=>x.id===room.target));
 }
});
test("locked map cannot teleport; solving sectors opens downstream rooms",()=>{
 let s=newOperatorWorld();
 assert.equal(isWorldRoomUnlocked(s,"atrium"),true);
 assert.equal(isWorldRoomUnlocked(s,"archive"),false);
 assert.throws(()=>enterWorldRoom(s,"archive"),RangeError);
 assert.deepEqual(getWorldNeighbors(s),[]);
 s=solveRoom(s,"atrium");
 assert.deepEqual(getWorldNeighbors(s),["switch"]);
 s=enterWorldRoom(s,"switch");
 assert.equal(s.current,"switch");
 assert.throws(()=>enterWorldRoom(s,"cooling"),RangeError);
 s=solveRoom(s,"switch");
 s=enterWorldRoom(s,"relay");
 s=solveRoom(s,"relay");
 assert.equal(getWorldSignals(s).communications,true);
 assert.equal(isWorldRoomUnlocked(s,"archive"),true);
 assert(getWorldNeighbors(s).includes("archive"));
});
test("evidence checks gate sound repairs; decoys do not advance",()=>{
 let s=newOperatorWorld();
 const first=actInWorld(s,"refresh-panel");
 assert.equal(first.advanced,false);
 assert.equal(first.kind,"hint");
 const decoy=actInWorld(s,"kick-wall");
 assert.equal(decoy.advanced,false);
 assert.equal(Object.keys(decoy.state.outcomes).length,0);
 const irrelevant=inspectWorldComponent(s,"coffee");
 assert.equal(irrelevant.relevant,false);
 assert.equal(actInWorld(irrelevant.state,"refresh-panel").advanced,false);
 s=inspectWorldComponent(s,"panel").state;
 const repair=actInWorld(s,"refresh-panel");
 assert.equal(repair.advanced,true);
 assert.equal(repair.state.outcomes.atrium,"sound");
 assert.equal(s.outcomes.atrium,undefined);
});
test("standard full campaign has real consequence flags and a final repaired ending",()=>{
 let s=reachNexus("sound");
 const flags=getWorldSignals(s);
 assert.deepEqual(flags,{local:true,communications:true,backups:true,recovery:true,provenance:true});
 s=completeNexus(s,"sound");
 const r=worldReport(s);
 assert.equal(r.completed,true);
 assert.equal(r.repaired,true);
 assert.equal(r.ending,"restored");
 assert.equal(r.roomsResolved,8);
 assert.equal(r.totalRooms,9);
 assert.equal(r.secretAvailable,false);
 assert.equal(r.chaosEvents,0);
 const text=serializeOperatorWorld(s);
 assert.deepEqual(parseOperatorWorld(text),s);
 assert.throws(()=>actInWorld(s,"sound"),RangeError);
});
test("downstream repair is not falsely credited by chaotic upstream work",()=>{
 let s=reachNexus("chaos");
 assert.equal(getWorldSignals(s).communications,false);
 assert.equal(worldReport(s).secretAvailable,true);
 const inspected=inspectWorldComponent(s,"comms");
 assert.equal(inspected.relevant,true);
 const blocked=actInWorld(inspected.state,"sound");
 assert.equal(blocked.advanced,false);
 assert.equal(blocked.kind,"blocked");
 assert.equal(blocked.state.nexus.length,0);
 s=completeNexus(s,"chaos");
 const r=worldReport(s);
 assert.equal(r.ending,"chaos");
 assert.equal(r.repaired,false);
 assert.equal(r.chaos,true);
 assert.match(r.narrative,/toaster/);
});
test("hidden complaints annex requires three distinct chaotic actions and is reversible",()=>{
 let s=newOperatorWorld("chaos");
 assert.equal(canEnterSecret(s),false);
 assert.throws(()=>enterSecretAnnex(s),RangeError);
 s=solveRoom(s,"atrium","chaos");
 s=solveRoom(s,"switch","chaos");
 assert.equal(canEnterSecret(s),false);
 s=solveRoom(s,"relay","chaos");
 assert.equal(canEnterSecret(s),true);
 const prev=s.current;
 s=enterSecretAnnex(s);
 assert.equal(s.current,"annex");
 assert.equal(s.secretVisited,true);
 assert.throws(()=>enterWorldRoom(s,"archive"),RangeError);
 s=leaveSecretAnnex(s);
 assert.equal(s.current,prev);
 assert.equal(s.secretVisited,true);
 assert.throws(()=>leaveSecretAnnex(s),RangeError);
});
test("world state save import rejects invalid shape, unknown ids and oversized JSON",()=>{
 const s=newOperatorWorld();
 assert.deepEqual(parseOperatorWorld(serializeOperatorWorld(s)),s);
 for(const invalid of [
   {...s,version:2},{...s,mode:"admin"},{...s,current:"root-shell"},
   {...s,outcomes:{atrium:"sudo"}},{...s,inspected:{atrium:["nonexistent"]}},
   {...s,nexus:["sound","sudo"]},{...s,chaosHistory:["atrium","atrium"]},
   {...s,current:"annex",returnTo:"atrium"},{...s,log:["x".repeat(400)]}
 ])assert.throws(()=>validateOperatorWorld(invalid),TypeError);
 assert.throws(()=>parseOperatorWorld("{broken"),SyntaxError);
 assert.throws(()=>parseOperatorWorld("x".repeat(16385)),TypeError);
});
test("Nexus can be replayed after a mixed ending without erasing earned sector repairs",()=>{
 let s=reachNexus("sound");
 s=actInWorld(s,"chaos").state;
 for(const kind of ["sound","sound"]){
   const check=getNexusStep(s);
   s=inspectWorldComponent(s,check.id).state;
   s=actInWorld(s,kind).state;
 }
 assert.equal(worldReport(s).ending,"mixed");
 s=replayNexus(s);
 assert.equal(s.nexus.length,0);
 assert.equal(s.outcomes.relay,"sound");
 s=completeNexus(s,"sound");
 assert.equal(worldReport(s).ending,"restored");
});
