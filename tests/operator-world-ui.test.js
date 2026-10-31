import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("Operator World UI contains the map, sound status, inspection, tools, import and export", async()=>{
 const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
 const source=await readFile(new URL("../src/operator-world-ui.js",import.meta.url),"utf8");
 for(const id of [
  "world","world-map","world-signals","world-inspect","world-actions",
  "world-log","world-companion","world-report","world-secret","world-leave-secret",
  "world-new-standard","world-new-chaos","world-import","world-export",
  "world-nexus-retry","world-storage","academy-open-world"
 ])assert.equal([...html.matchAll(/\bid="([^"]+)"/g)].filter(x=>x[1]===id).length,1,id);
 assert.match(source,/textContent/);
 assert.doesNotMatch(source,/innerHTML|eval\(|fetch\(|XMLHttpRequest|WebSocket|exec\(|navigator\.mediaDevices/);
});
