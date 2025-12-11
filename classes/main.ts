type Logs = Record<string, unknown>[];

type TimerContents = {
  "Start Timestamp": number;
  "End Timestamp": string | number;
  Duration: number | null;
};
type TimerObj = Record<string, TimerContents>;
type TimerStack = Record<string, TimerObj>;

export class Logger {
  logs: Logs = [];
  isSection: boolean = false;
  timestamp: number = performance.now();
  timers: TimerStack = {};

  // Start Timer
  startTimer(timerName: string) {
    Object.defineProperty(this.timers, timerName, {
      value: {
        [timerName]: {
          "Start Timestamp": performance.now(),
          "End Timestamp": "Timer was not Stopped",
          Duration: "N/A",
        },
      },
    });
  }

  // End Timer
  endTimer(timerName: string) {
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
        TimeStamp: this.timestamp,
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
  }

  // End The Active Section
  endSection() {
    this.isSection = false;
  }

  // Console Logging The Logs
  log() {
    console.log(this.logs);
  }

  // Console.Table
  table() {
    console.table(this.logs);
  }

  // Get Log
  getLogs(): typeof this.logs {
    return this.logs;
  }
  // Get Timers
  getTimers(timerName?: string) {
    if (!timerName) {
      return this.timers;
    } else {
      const timerObj = Object.values(this.timers[timerName])[0];
      return timerObj;
    }
  }
}
