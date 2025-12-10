type Logs = Record<string, unknown>[];

export class LoggerClass {
  logs: Logs = [];
  isSection: boolean = false;
  timer: number = 0;

  // Start Timer
  startTimer() {
    this.timer = performance.now();
  }

  // Reset Timer
  resetTimer() {
    this.timer = 0;
  }
  // Add a Log
  addLog<T>(value: T, iName: string): T {
    // Log Object
    const output = {
      [iName]: {
        value: value,
        Duration: this.timer
          ? (performance.now() - this.timer).toPrecision(4) + "ms"
          : "Timer was not Started",
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
}
