import { Logger } from "./src/main.ts";

const logger = new Logger({
  sectionNames: ["mysection"],
  timerNames: ["timer"],
});
logger.toSection("value", "name", "mysection");
logger.toSection("value", "asas", "mysection");
const x = logger.toSection("value", "name", "mysection");
console.log(x);
