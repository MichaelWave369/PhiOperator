import test from "node:test";
import assert from "node:assert/strict";
import { createPassport, serializePassport, deserializePassport } from "../src/ascension.js";
import { validatePortablePassport } from "../src/portable-passport.js";
import { listWorldMedals, awardWorldMedal } from "../src/world-passport.js";
import {
  newOperatorWorld, WORLD_ROOMS, getNexusStep,
  inspectWorldComponent, actInWorld, enterWorldRoom
} from "../src/operator-world.js";
function clearWorld(kind="sound"){
 let world=newOperatorWorld(kind==="chaos"?"chaos":"standard");
 for(const room of WORLD_ROOMS.slice(0,8)){
   if(world.current!==room.id)world=enterWorldRoom(world,room.id);
   if(kind==="sound")world=inspectWorldComponent(world,room.target).state;
   world=actInWorld(world,room.tools.find(t=>t.type===kind).id).state;
 }
 world=enterWorldRoom(world,"nexus");
 while(getNexusStep(world)){
   const step=getNexusStep(world);
   if(kind==="sound")world=inspectWorldComponent(world,step.id).state;
   world=actInWorld(world,kind).state;
 }
 return world;
}
test("standard completion earns a new non-authoritative World medal without rank changes",()=>{
 const original=createPassport();
 const outcome=awardWorldMedal(original,clearWorld());
 assert.equal(outcome.ending,"restored");
 assert.equal(outcome.newlyEarned,true);
 assert.deepEqual(outcome.passport.results,[]);
 assert.equal(listWorldMedals(outcome.passport)[0].earned,true);
 assert.equal(listWorldMedals(outcome.passport)[1].earned,false);
 assert.deepEqual(deserializePassport(serializePassport(outcome.passport)),outcome.passport);
 assert.deepEqual(validatePortablePassport(outcome.passport),outcome.passport);
 assert.equal(awardWorldMedal(outcome.passport,clearWorld()).newlyEarned,false);
});
test("Chaos ending has separate badge and never sets a Standard certificate",()=>{
 const original=createPassport();
 const chaos=awardWorldMedal(original,clearWorld("chaos"));
 assert.equal(chaos.ending,"chaos");
 assert.equal(listWorldMedals(chaos.passport)[1].earned,true);
 assert.equal(listWorldMedals(chaos.passport)[0].earned,false);
 assert.deepEqual(chaos.passport.results,[]);
 assert.throws(()=>awardWorldMedal(original,newOperatorWorld()),RangeError);
});
test("passport rejects unknown and duplicate World entries",()=>{
 const base=createPassport();
 const item={lab:"world",mode:"standard",bestScore:3};
 const invalid=[
  [item,item],[{...item,mode:"root"}],[{...item,bestScore:4}],
  [{...item,lab:"elevator"}]
 ];
 for(const badges of invalid)assert.throws(()=>deserializePassport(JSON.stringify({
   ...base,extensions:{phioperatorAcademy:{version:1,badges}}
 })),TypeError);
});
