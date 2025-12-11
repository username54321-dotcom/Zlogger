import type {
  Logs,
  TimerStack,
  Stack,
  OnError,
  GetTimers,
  GetLogs,
} from "../types/types.ts";

interface ClassProps<TimerNames, SectionNames> {
  timerNames?: TimerNames[];
  sectionNames?: SectionNames[];
}

export class Logger<TimerNames extends string, SectionNames extends string> {
  logs: Logs = [];
  isSection: boolean = false;
  timers: TimerStack = {};
  timerNames: string[];
  sectionNames: SectionNames[];
  sections: Record<SectionNames, Logs[]> | Record<PropertyKey, []>;
  stack: Stack = { timers: this.timers, logs: this.logs };

  constructor({
    timerNames,
    sectionNames,
  }: ClassProps<TimerNames, SectionNames> = {}) {
    this.timerNames = timerNames ?? [];
    this.sectionNames = sectionNames ?? [];
    this.sections = Object.fromEntries(
      sectionNames?.map((item) => [item, []]) ?? []
    );
  }

  toSection<T>(value: T, label: string, sectionName: SectionNames) {
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
  // Start Timer
  startTimer(timerName: TimerNames) {
    Object.defineProperty(this.timers, timerName, {
      value: {
        [timerName]: {
          "Start Timestamp": performance.now(),
          "End Timestamp": "Timer was not Stopped",
          Duration: null,
        },
      },
    });
    return this;
  }

  // End Timer
  endTimer(timerName: TimerNames) {
    const cTimestamp = performance.now();
    const timerObj = Object.values(this.timers[timerName])[0];
    Object.defineProperties(timerObj, {
      "End Timestamp": {
        value: cTimestamp,
      },
      Duration: {
        value: +(cTimestamp - timerObj["Start Timestamp"]).toPrecision(3),
      },
    });
    console.log(timerObj);
  }

  // Reset Timer

  // resetTimer() {
  //   this.timer = 0;
  // }

  // Add a Log
  addLog<T>(value: T, label: string): T {
    // Log Object
    const output = {
      [`[ ${label} ]`]: {
        value: value,
        TimeStamp: performance.now(),
      },
    };

    // No Active Section -- Just Append
    if (!this.isSection) {
      this.logs.push(output);

      // Active Section
    } else if (this.isSection) {
      const sectionItem = this.logs[this.logs.length - 1]; // Active Setion Object
      const sectionName = Object.keys(sectionItem)[0];
      const sectionValues = sectionItem[sectionName] as Logs; // Previous Logs In Active Section
      sectionValues.push(output); // Push The Log To Previous Logs
    }
    return value;
  }

  // Start a New Section
  addSection(sectionName: string) {
    const newSection = { [sectionName]: [] };
    this.logs.push(newSection);
    this.isSection = true;
    return this;
  }

  // End The Active Section
  endSection() {
    this.isSection = false;
    return this;
  }

  // Console Logging The Logs
  log() {
    console.log(this.logs);
    return this;
  }

  // Console.Table
  table() {
    console.table(this.logs);
    return this;
  }

  // Get Log
  getLogs(): GetLogs {
    const output = {
      json: this.logs,
      stringify: JSON.stringify(this.logs),
    };
    return output;
  }
  // Get Timers
  getTimers(timerName?: TimerNames): GetTimers {
    if (!timerName) {
      return {
        json: this.timers,
        stringify: JSON.stringify(this.timers),
      };
    } else {
      const timerObj = Object.values(this.timers[timerName])[0];
      return {
        json: timerObj,
        stringify: JSON.stringify(timerObj),
      };
    }
  }

  // Get Stack and Logs
  getStack(): Stack {
    return this.stack;
  }
  // Callback on Unhandled Exception
  onError(callbackFn: ({ stack, syncError, asyncError }: OnError) => void) {
    // Sync Errors Hnadling
    addEventListener("error", (error) =>
      callbackFn({ stack: this.stack, syncError: error })
    );

    // Async Errors Handling
    addEventListener("unhandledrejection", (error) =>
      callbackFn({ stack: this.stack, asyncError: error })
    );
  }
}
