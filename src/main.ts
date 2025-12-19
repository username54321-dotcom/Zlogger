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
  /**Array of all log objects Including logs assigned to sections */
  logs: Logs = [];
  /**Array of Timer Objects */
  timers: TimerStack = {};
  /**Array of section objects containing assigned logs */
  sections: Sections<SectionNames>;
  /**Object holding timers , logs and sections  */
  stack: Stack = { timers: this.timers, logs: this.logs };
  private timerNames: string[];
  private sectionNames: SectionNames[];

  /**
   * Constructor for the Logger class.
   * @param {ClassProps<TimerNames, SectionNames>} props - Options for the logger.
   * @param {TimerNames[]} props.timerNames - Timer names to use.
   * @param {SectionNames[]} props.sectionNames - Section names to use.
   * @param {(stack: Stack) => void} props.onEnd - Callback to run when the application exits.
   * @param {(errorEvent: ErrorEvent | PromiseRejectionEvent, stack: Stack) => void} props.onError - Callback to run when an unhandled error occurs.
   * **/
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

  /** Add log to target section and return the provided value
   * ** Note that this also adds the log to the logs stack
   */
  toSection<T>(value: T, label: string, sectionName: SectionNames): T {
    this.addLog(value, label);
    const output = {
      [label]: {
        value: value,
        TimeStamp: performance.now(),
      },
    };
    const targetSection = this.sections[sectionName] as Logs;
    targetSection.push(output);

    return value;
  }

  // Start Timer

  /** Start target timer */
  startTimer(timerName: TimerNames): this {
    this.timers[timerName] = {
      "Start Timestamp": performance.now(),
      "End Timestamp": "Timer was not Stopped",
      Duration: null,
    };

    return this;
  }

  // End Timer

  /**End target timer */
  endTimer(timerName: TimerNames): this {
    const cTimestamp = performance.now();
    const timerObj = this.timers[timerName];
    if (!timerObj) {
      throw new Error(`Timer [${timerName}] was not started !!!`);
    }
    timerObj["End Timestamp"] = cTimestamp;
    timerObj.Duration = +(cTimestamp - timerObj["Start Timestamp"]).toFixed(5);

    return this;
  }

  // Add a Log
  /** Add log to log stack and return the provided value */
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
}
