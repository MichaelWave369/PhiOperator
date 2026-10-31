import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createPassport, serializePassport, deserializePassport } from "../src/ascension.js";
import { validatePortablePassport } from "../src/portable-passport.js";
import { recordLivingBadge } from "../src/academy-passport.js";
import { createLivingLabSession, currentLivingPhase, inspectLivingNode, useLivingTool } from "../src/living-labs.js";
test("Living Lab document includes all unique user-visible controls",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const source=await readFile(new URL("../src/living-labs-ui.js",import.meta.url),"utf8");
  for(const id of ["living","living-rack","living-tools","living-hint","living-log",
    "living-report","living-restart","living-exit","academy-badges"]) {
    assert.equal([...html.matchAll(/\bid="([^"]+)"/g)].filter(m=>m[1]===id).length,1,id);
  }
  assert.match(source,/textContent/);
  assert.doesNotMatch(source,/innerHTML|eval\(|fetch\(|XMLHttpRequest|navigator\.mediaDevices|exec\(/);
});
test("Portable Passport v1 preserves the Academy namespace and older data",()=>{
  let session=createLivingLabSession("network");
  while(currentLivingPhase(session)) {
    const phase=currentLivingPhase(session);
    session=inspectLivingNode(session,phase.target).session;
    session=useLivingTool(session,phase.tools[0].id).session;
  }
  const updated=recordLivingBadge(createPassport(),session).passport;
  const original=serializePassport(updated);
  const portable=validatePortablePassport(JSON.parse(original));
  assert.deepEqual(portable,updated);
  assert.deepEqual(deserializePassport(original),updated);
  assert.deepEqual(deserializePassport(serializePassport(createPassport())),createPassport());
});
