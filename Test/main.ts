import { addSection, log } from "@qamareg/logger";
import { addLog, startTimer } from "../functions/functions.ts";

startTimer();
addSection("section 1");
addLog([1], "key 1");
addLog([2], "key 2");
addSection("section 2");
addLog([1], "key 1");
addLog([2], "key 2");

log();
