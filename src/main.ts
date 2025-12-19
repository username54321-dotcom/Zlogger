import type {
  Logs,
  TimerStack,
  Stack,
  OnError,
  GetTimers,
  GetLogs,
  Sections,
  GetSections,
  Timer,
  EndTimer,
} from "../types/types.ts";

interface ClassProps<TimerNames, SectionNames> {
  timerNames?: TimerNames[];
  sectionNames?: SectionNames[];
  onEnd?: (stack: Stack) => void;
  onError?: (
    errorEvent: ErrorEvent | PromiseRejectionEvent,
    stack: Stack
  ) => void;
}

export class Logger<TimerNames extends string, SectionNames extends string> {
  logs: Logs = [];
  isSection: boolean = false;
  timers: TimerStack = {};
  timerNames: string[];
  sectionNames: SectionNames[];
  sections: Sections<SectionNames>;
  stack: Stack = { timers: this.timers, logs: this.logs };

  constructor({
    timerNames,
    sectionNames,
    onEnd,
    onError,
  }: ClassProps<TimerNames, SectionNames> = {}) {
    this.timerNames = timerNames ?? [];

    this.sectionNames = sectionNames ?? [];
    this.sections = Object.fromEntries(
      sectionNames?.map((item) => [item, []]) ?? []
    );

    // On Execution End Logic
    if (onEnd) {
      globalThis.addEventListener("unload", () => onEnd(this.stack));
    }

    // On Error Logic
    if (onError) {
      globalThis.addEventListener("error", (e) => {
        onError(e, this.stack);
        return true;
      });
      globalThis.addEventListener("unhandledrejection", (e) => {
        onError(e, this.stack);
      });
    }
  }

  // Add Log To Section
  toSection<T>(value: T, label: string, sectionName: SectionNames): T {
    this.addLog(value, label);
    const output = {
      [`[ ${label} ]`]: {
        value: value,
        TimeStamp: performance.now(),
      },
    };
    const targetSection = this.sections[sectionName] as Logs;
    targetSection.push(output);

    return value;
  }

  // Get Sections
  // getSections(sectionName?: SectionNames): GetSections<SectionNames> {
  //   if (sectionName) {
  //     const targetSection = this.sections[sectionName];
  //     return {
  //       log: (): void => console.log(targetSection),
  //       json: () => targetSection,
  //       stringify: () => JSON.stringify(targetSection),
  //     };
  //   } else {
  //     return {
  //       log: (): void => console.log(this.sections),
  //       json: () => this.sections,
  //       stringify: () => JSON.stringify(this.sections),
  //     };
  //   }
  // }
  // Start Timer
  startTimer(timerName: TimerNames): this {
    this.timers[timerName] = {
      "Start Timestamp": performance.now(),
      "End Timestamp": "Timer was not Stopped",
      Duration: null,
    };

    return this;
  }

  // End Timer
  endTimer(timerName: TimerNames) {
    const cTimestamp = performance.now();
    const timerObj = this.timers[timerName];
    if (!timerObj) {
      throw new Error(`Timer [${timerName}] was not started !!!`);
    }
    timerObj["End Timestamp"] = cTimestamp;
    timerObj.Duration = +(cTimestamp - timerObj["Start Timestamp"]).toFixed(5);
    // const returnTimer = {
    //   timer: timerObj,
    //   log: () => console.log(timerObj),
    //   table: () => console.table(timerObj),
    // };
    // Object.defineProperties(returnTimer, {
    //   log: {
    //     enumerable: false,
    //   },
    //   table: {
    //     enumerable: false,
    //   },
    // });
    return this;
  }

  // Add a Log
  addLog<T>(value: T, label: string): T {
    // Log Object
    const output = {
      [label]: {
        value: value,
        TimeStamp: performance.now(),
      },
    };

    // No Active Section -- Just Append

    this.logs.push(output);

    return value;
  }

  // Console Logging The Logs
  // log(): this {
  //   console.log(this.logs);
  //   return this;
  // }

  // Console.Table
  // table(): this {
  //   console.table(this.logs);
  //   return this;
  // }

  // Get Log
  // getLogs(): GetLogs {
  //   const output = {
  //     json: this.logs,
  //     stringify: JSON.stringify(this.logs),
  //   };
  //   return output;
  // }
  // Get Timers
  // getTimers(timerName?: TimerNames): GetTimers {
  //   // Initialize the Return Object
  //   const returnObj = {
  //     JSON: undefined as unknown as TimerStack | Timer,
  //     stringified: null as unknown as string,
  //   };

  //   // No Timer Name Was Provided -- Return All Timers
  //   if (!timerName) {
  //     // Assign The Values
  //     returnObj.JSON = this.timers;
  //     returnObj.stringified = JSON.stringify(this.timers);

  //     // Hide The Stringified Version
  //     Object.defineProperty(returnObj, "stringified", {
  //       enumerable: false,
  //     });
  //     return returnObj;
  //   } else {
  //     // Timer Name Was Provided
  //     const targetTimer = this.timers[timerName]; // Find The Timer Object

  //     // Assign The Values
  //     returnObj.JSON = targetTimer;
  //     returnObj.stringified = JSON.stringify(targetTimer);
  //     // Hide The Stringified Version
  //     Object.defineProperty(returnObj, "stringified", {
  //       enumerable: false,
  //     });
  //     return returnObj;
  //   }
  // }

  // Get Stack and Logs
  // getStack(): Stack {
  //   return this.stack;
  // }
  // // Callback on Unhandled Exception
  // onError(callbackFn: ({ stack, syncError, asyncError }: OnError) => void) {
  //   // Sync Errors Hnadling
  //   addEventListener("error", (error) =>
  //     callbackFn({ stack: this.stack, syncError: error })
  //   );

  //   // Async Errors Handling
  //   addEventListener("unhandledrejection", (error) =>
  //     callbackFn({ stack: this.stack, asyncError: error })
  //   );
  // }
}
