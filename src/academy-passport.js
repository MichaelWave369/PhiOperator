/**
 * Optional Academy achievement extension on the existing Passport v1 JSON.
 * Old consumers continue reading .results; newer consumers can preserve .extensions.
 * This is explicitly player-editable game progress, never a trusted credential.
 */
import { validatePassport } from "./ascension.js";
import { LIVING_LABS, summarizeLivingLab } from "./living-labs.js";
export const ACADEMY_EXTENSION_ID = "phioperatorAcademy";
export const ACADEMY_EXTENSION_VERSION = 1;
export const ACADEMY_BADGE_NAMES = Object.freeze({
  network:"Signal Restorer",restore:"Backup Goblin Negotiator",evidence:"Evidence Keeper"
});
export function listLivingBadges(passport) {
  const valid=validatePassport(passport);
  const records=valid.extensions?.[ACADEMY_EXTENSION_ID]?.badges||[];
  return LIVING_LABS.flatMap(lab=>["standard","chaos"].map(mode=>{
    const row=records.find(item=>item.lab===lab.id&&item.mode===mode);
    return Object.freeze({id:lab.id+"-"+mode,lab:lab.id,mode,
      name:mode==="chaos"?"Certified "+lab.name+" Menace":ACADEMY_BADGE_NAMES[lab.id],
      bestScore:row?.bestScore??null,earned:(row?.bestScore??0)===3});
  }));
}
export function recordLivingBadge(passport,session) {
  const before=validatePassport(passport);
  const summary=summarizeLivingLab(session);
  if(!summary.completed)throw new RangeError("Cannot record an incomplete lab.");
  const raw=before.extensions?.[ACADEMY_EXTENSION_ID]?.badges||[];
  const records=raw.map(item=>({...item}));
  let row=records.find(x=>x.lab===summary.labId&&x.mode===summary.mode);
  if(row)row.bestScore=Math.max(row.bestScore,summary.score);
  else records.push({lab:summary.labId,mode:summary.mode,bestScore:summary.score});
  const extension={version:ACADEMY_EXTENSION_VERSION,badges:records};
  const next={...before,extensions:{...(before.extensions||{}),[ACADEMY_EXTENSION_ID]:extension}};
  const safe=validatePassport(next);
  const wasEarned=raw.some(x=>x.lab===summary.labId&&x.mode===summary.mode&&x.bestScore===3);
  return Object.freeze({passport:safe,summary,
    newlyEarned:summary.earned&&!wasEarned});
}
