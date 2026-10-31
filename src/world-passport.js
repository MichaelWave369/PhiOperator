/**
 * Optional World medals share the existing Passport v1 Academy namespace.
 * Medals are cosmetic self-reported progress, not trusted authorization.
 */
import { validatePassport } from "./ascension.js";
import { worldReport } from "./operator-world.js";

export const WORLD_MEDALS = Object.freeze([
  Object.freeze({id:"world-standard",mode:"standard",label:"Facility Restorer"}),
  Object.freeze({id:"world-chaos",mode:"chaos",label:"Unionized Toaster Negotiator"})
]);
export function listWorldMedals(passport){
  const safe=validatePassport(passport);
  const entries=safe.extensions?.phioperatorAcademy?.badges||[];
  return WORLD_MEDALS.map(m=>{
    const row=entries.find(x=>x.lab==="world"&&x.mode===m.mode);
    return Object.freeze({...m,earned:row?.bestScore===3,bestScore:row?.bestScore??null});
  });
}
export function awardWorldMedal(passport,state){
  const before=validatePassport(passport);
  const report=worldReport(state);
  if(!report.completed)throw new RangeError("World campaign unfinished.");
  const mode=report.repaired?"standard":report.chaos?"chaos":null;
  if(!mode)return {passport:before,ending:report.ending,newlyEarned:false};
  const old=before.extensions?.phioperatorAcademy?.badges||[];
  const earned=old.some(x=>x.lab==="world"&&x.mode===mode&&x.bestScore===3);
  const updated=old.filter(x=>!(x.lab==="world"&&x.mode===mode));
  updated.push({lab:"world",mode,bestScore:3});
  const next=validatePassport({
    ...before,extensions:{...(before.extensions||{}),
      phioperatorAcademy:{version:1,badges:updated}}
  });
  return {passport:next,ending:report.ending,newlyEarned:!earned};
}
