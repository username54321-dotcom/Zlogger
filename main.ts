import { addLog, getLogs } from "./zustandStore.ts";
try {
  const x = addLog("x", "value");
  const y = addLog("userArray", [1, 2, 3, 4, 5, 6, 7]);
  console.log(getLogs());
} catch (error) {
  console.log(getLogs());
}
