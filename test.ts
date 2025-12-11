import { Logger } from "./classes/main.ts";
import sleep from "atomic-sleep";

const lg = new Logger();
// lg.startTimer("name timer");

// sleep(1000);
lg.startTimer("end");

lg.endTimer("end");
