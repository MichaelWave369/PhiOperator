import test from "node:test";
import assert from "node:assert/strict";
import {
 LIVING_LABS, LIVING_PHASES, createLivingLabSession, currentLivingPhase,
 inspectLivingNode, useLivingTool, summarizeLivingLab, livingTopology
} from "../src/living-labs.js";
import { createPassport, validatePassport, serializePassport, deserializePassport,
 recordTrial, createTrialSession, submitTrial, getDeck } from "../src/ascension.js";
import { listLivingBadges, recordLivingBadge } from "../src/academy-passport.js";

function play(labId, mode="standard") {
 let state=createLivingLabSession(labId,mode);
 while(currentLivingPhase(state)){
   const phase=currentLivingPhase(state);
   if(mode==="standard")state=inspectLivingNode(state,phase.target).session;
   const tool=phase.tools.find(x=>x.kind===(mode==="chaos"?"chaos":"sound"));
   const outcome=useLivingTool(state,tool.id);
   assert.equal(outcome.advanced,true);
   state=outcome.session;
 }
 return state;
}
test("three realistic racks each have six inspectable nodes, three phases, three tools",()=>{
 assert.equal(LIVING_LABS.length,3);
 assert.deepEqual(LIVING_PHASES,["OBSERVE","VERIFY","RECOVER"]);
 for(const lab of LIVING_LABS) {
   assert.equal(lab.nodes.length,6);
   assert.equal(lab.stages.length,3);
   assert.equal(new Set(lab.nodes.map(x=>x.id)).size,6);
   for(const [i,phase] of lab.stages.entries()) {
     assert.equal(phase.discipline,LIVING_PHASES[i]);
     assert.equal(phase.tools.length,3);
     assert.deepEqual(phase.tools.map(x=>x.kind),["sound","decoy","chaos"]);
     assert(lab.nodes.some(node=>node.id===phase.target));
     assert(phase.clue.length>20);
   }
 }
});
test("intelligent diagnosis needs investigation, false leads are reversible, outcomes branch",()=>{
 const first=createLivingLabSession("network");
 const sound=currentLivingPhase(first).tools[0];
 const noEvidence=useLivingTool(first,sound.id);
 assert.equal(noEvidence.advanced,false);
 assert.equal(noEvidence.kind,"hint");
 assert.equal(noEvidence.session.index,0);
 const wrong=useLivingTool(first,currentLivingPhase(first).tools[1].id);
 assert.equal(wrong.advanced,false);
 assert.equal(wrong.session.missteps,1);
 const other=inspectLivingNode(first,"access-point");
 assert.equal(other.relevant,false);
 assert.equal(useLivingTool(other.session,sound.id).advanced,false);
 const observation=inspectLivingNode(other.session,"workstation");
 assert.equal(observation.relevant,true);
 assert(observation.message.includes("gateway"));
 const success=useLivingTool(observation.session,sound.id);
 assert.equal(success.advanced,true);
 assert.equal(success.session.index,1);
 assert.notDeepEqual(first,success.session);
 assert.equal(livingTopology(first).find(x=>x.id==="workstation").status,"fault");
 assert.equal(livingTopology(success.session).find(x=>x.id==="workstation").status,"suspect");
});
test("all three rack missions can recover or enter full Chaos without real-world side effects",()=>{
 for(const lab of LIVING_LABS) {
   const repaired=play(lab.id);
   const standard=summarizeLivingLab(repaired);
   assert.equal(standard.completed,true);
   assert.equal(standard.score,3);
   assert.equal(standard.restored,true);
   assert.equal(standard.earned,true);
   assert.equal(currentLivingPhase(repaired),null);
   assert.throws(()=>useLivingTool(repaired,"fake"),RangeError);
   const chaos=summarizeLivingLab(play(lab.id,"chaos"));
   assert.equal(chaos.score,3);
   assert.equal(chaos.restored,false);
   assert.equal(chaos.earned,true);
   assert.match(chaos.narrative,/FULL CHAOS/);
 }
});
test("mixed decision path is distinct from complete repair and does not award perfect badge",()=>{
 let s=createLivingLabSession("network");
 const first=currentLivingPhase(s);
 s=useLivingTool(s,first.tools[2].id).session; // chaos
 while(currentLivingPhase(s)) {
   const phase=currentLivingPhase(s);
   s=inspectLivingNode(s,phase.target).session;
   s=useLivingTool(s,phase.tools[0].id).session;
 }
 const report=summarizeLivingLab(s);
 assert.equal(report.score,2);
 assert.equal(report.restored,false);
 assert.equal(report.earned,false);
});
test("tool IDs and node IDs are bounded and invalid state rejected",()=>{
 const s=createLivingLabSession("network");
 assert.throws(()=>createLivingLabSession("not-a-lab"),RangeError);
 assert.throws(()=>createLivingLabSession("network","admin"),TypeError);
 assert.throws(()=>inspectLivingNode(s,"root-router"),RangeError);
 assert.throws(()=>useLivingTool(s,"sudo-rm"),RangeError);
 assert.throws(()=>summarizeLivingLab({...s,index:3}),TypeError);
});
test("Academy achievements extend Passport v1 without breaking prior rank scores",()=>{
 let passport=createPassport();
 const completed=play("network");
 const award=recordLivingBadge(passport,completed);
 assert.equal(award.newlyEarned,true);
 assert.equal(award.passport.format,"phioperator-passport");
 assert.equal(award.passport.version,1);
 assert.deepEqual(award.passport.results,[]);
 assert.equal(listLivingBadges(award.passport).find(x=>x.id==="network-standard").earned,true);
 const again=recordLivingBadge(award.passport,completed);
 assert.equal(again.newlyEarned,false);
 const serialized=serializePassport(again.passport);
 assert.deepEqual(deserializePassport(serialized),again.passport);
 // A rank exam can still update .results without erasing Academy.
 let exam=createTrialSession(1,"standard");
 for(const question of getDeck(1)) exam=submitTrial(exam,question.correctId);
 const updated=recordTrial(again.passport,exam).passport;
 assert.equal(updated.results[0].bestScore,9);
 assert.equal(listLivingBadges(updated).find(x=>x.id==="network-standard").bestScore,3);
 // Old v1 passports without extensions continue to roundtrip without changes.
 assert.deepEqual(deserializePassport(serializePassport(createPassport())),createPassport());
});
test("chaos achievements stay separate; no cross-mode privilege or rank advancement",()=>{
 let p=createPassport();
 p=recordLivingBadge(p,play("network","chaos")).passport;
 assert.equal(listLivingBadges(p).find(x=>x.id==="network-chaos").earned,true);
 assert.equal(listLivingBadges(p).find(x=>x.id==="network-standard").earned,false);
 assert.equal(p.results.length,0);
 assert.throws(()=>recordLivingBadge(p,createLivingLabSession("network")),RangeError);
});
test("malformed Academy extension cannot be imported or pollute essential profile",()=>{
 const p=createPassport();
 const bad=[
 {version:2,badges:[]},
 {version:1,badges:[{lab:"ghost",mode:"standard",bestScore:3}]},
 {version:1,badges:[{lab:"network",mode:"standard",bestScore:4}]},
 {version:1,badges:[{lab:"network",mode:"standard",bestScore:3},
    {lab:"network",mode:"standard",bestScore:3}]}
 ];
 for(const extension of bad) assert.throws(()=>validatePassport({
   ...p,extensions:{phioperatorAcademy:extension}
 }),TypeError);
});
