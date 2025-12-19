import { Logger } from "./mod.ts";

const l = new Logger({
  sectionNames: ["first section"],
  onEnd: (stack) => {
    console.log(stack);
  },
  onError: (e, stack) => {
    console.log(stack);
  },
});

console.log("start");
throw new Error();
console.log("aftererror");
