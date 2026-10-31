import test from "node:test";
import assert from "node:assert/strict";
import {
  PASSPORT_LIMIT, PASSPORT_REWARDS, parsePortablePassport, validatePortablePassport,
  createPortablePassportStore, summarizePortablePassport,
} from "../src/portable-passport.js";
import {
  ACADEMY_LABS, ACADEMY_STAGE_COUNT, createAcademySession, currentAcademyStage,
  chooseAcademyResponse, summarizeAcademySession
} from "../src/academy.js";
const sample = (standard = [], chaos = []) => ({ format: "phioperator-passport", version: 1,
  results: [...standard.map((bestScore, i) => ({ rank: i + 1, mode: "standard", bestScore })),
    ...chaos.map((bestScore, i) => ({ rank: i + 1, mode: "chaos", bestScore }))] });
test("portable SDK mirrors the existing v1 passport and sequential rank semantics", () => {
  const input = sample([9, 7, 9], [9, 9, 9]);
  assert.deepEqual(parsePortablePassport(JSON.stringify(input)), input);
  const s = summarizePortablePassport(input);
  assert.equal(s.clearedRank, 3);
  assert.equal(s.nextRank, 4);
  assert(s.benefits.includes("phios-mobile-halo"));
  assert(s.benefits.includes("phios-site-grid"));
  assert.equal(s.benefits.includes("phios-architect-mark"), false);
  assert.equal(summarizePortablePassport(sample([9, 6, 9])).clearedRank, 1);
  assert.equal(summarizePortablePassport(sample([], [9,9,9])).clearedRank, 0);
  assert.equal(summarizePortablePassport(null).imported, false);
  assert.equal(PASSPORT_REWARDS.length, 5);
});
test("portable SDK rejects forged/oversized/malformed inputs", () => {
  for (const obj of [
    { ...sample(), version: 2 }, sample([10]), sample([-1]),
    { ...sample(), results: [{rank:1,mode:"admin",bestScore:9}] },
    { ...sample(), results: [{rank:1,mode:"standard",bestScore:9}, {rank:1,mode:"standard",bestScore:9}] },
    { ...sample(), results: [{rank:7,mode:"standard",bestScore:9}] }
  ]) assert.throws(() => validatePortablePassport(obj), TypeError);
  assert.throws(() => parsePortablePassport("x".repeat(PASSPORT_LIMIT + 1)), TypeError);
});
test("user-initiated local import, blocked storage, clear, export", () => {
  const map = new Map();
  const storage = { getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k) };
  const bridge = createPortablePassportStore({ storage });
  assert.equal(map.size, 0);
  const result = bridge.importJSON(JSON.stringify(sample([9,9])));
  assert.equal(result.persisted, true);
  assert.equal(bridge.hasBenefit("phios-mobile-halo"), true);
  assert.equal(JSON.parse(bridge.exportJSON()).results.length, 2);
  assert.equal(createPortablePassportStore({storage}).snapshot().clearedRank, 2);
  bridge.clear();
  assert.equal(map.size, 0);
  assert.equal(bridge.snapshot().clearedRank, 0);
  const blocked = createPortablePassportStore({storage:{getItem(){throw Error("blocked")},
    setItem(){throw Error("blocked")},removeItem(){throw Error("blocked")}}});
  assert.equal(blocked.importJSON(JSON.stringify(sample([9]))).persisted, false);
  assert.equal(blocked.snapshot().clearedRank, 1);
});
test("academy has three scenarios, three stages, three options, no side effects", () => {
  assert.equal(ACADEMY_LABS.length, 3);
  for (const lab of ACADEMY_LABS) {
    assert.equal(lab.stages.length, ACADEMY_STAGE_COUNT);
    assert.equal(new Set(lab.stages.map(s=>s.text)).size, 3);
    for (const stage of lab.stages) {
      assert.equal(stage.choices.length,3);
      assert.notEqual(stage.correct,stage.chaos);
    }
    for(const mode of ["standard","chaos"]){
      let s=createAcademySession(lab.id,mode);
      while(currentAcademyStage(s)){
        const stage=currentAcademyStage(s);
        s=chooseAcademyResponse(s,stage[mode==="chaos"?"chaos":"correct"]);
      }
      const result=summarizeAcademySession(s);
      assert.equal(result.completed,true);
      assert.equal(result.score,3);
      assert.throws(()=>chooseAcademyResponse(s,0),RangeError);
    }
  }
  assert.throws(()=>createAcademySession("fake"),TypeError);
});
