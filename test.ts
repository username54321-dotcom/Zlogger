import { addLog, getLogs } from "./zustandStore.ts";
import sleep from "atomic-sleep";
const x = addLog("Key x", 12312312);
const y = addLog("key y", [1, 2, 3, 234, 234, 24, 234, 23, 423, 4, 234]);
console.table(getLogs());
