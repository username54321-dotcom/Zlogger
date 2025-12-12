import { Logger } from "./src/main.ts";

const logger = new Logger({ timerNames: ["heavy", "second"] });
logger.startTimer("heavy");
for (let index = 0; index < 1000000; index++) {
  Math.sqrt(index);
}
logger.endTimer("heavy");
const x = logger.getTimers("heavy").JSON;
console.log(x);
