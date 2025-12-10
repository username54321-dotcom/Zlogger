// Constants
let logs: Record<string, unknown>[] = [];
let isSection = false;
let timer: number = 0;

// Start Time Tracking
export function startTimer(): void {
  timer === 0 && (timer = performance.now());
}

// Reset Timer
export function resetTimer() {
  timer = 0;
}

// Add a Log
export function addLog<T>(value: T, iName: string): T {
  // Log Object
  const output = {
    [iName]: {
      value: value,
      Duration: timer
        ? (performance.now() - timer).toPrecision(4) + "ms"
        : "Timer was not Started",
    },
  };

  // No Active Section -- Just Append
  if (!isSection) {
    logs.push(output);

    // Active Section
  } else if (isSection) {
    const sectionItem = logs.pop() ?? []; // Active Setion Object
    const sectionName = Object.keys(sectionItem)[0];
    const sectionValues = Object.values(sectionItem).flat(); // Previous Logs In Active Section
    sectionValues.push(output); // Push The Log To Previous Logs
    logs.push({ [sectionName]: sectionValues });
  }
  return value;
}

// Start a New Section
export function addSection(sectionName: string) {
  const newSection = { [sectionName]: [] };
  logs.push(newSection);
  isSection = true;
}

// End The Active Section
export function endSection() {
  isSection = false;
}

// Console Logging The Logs
export function log() {
  console.log(logs);
}

// Console.Table
export function table() {
  console.table(logs);
}

// Get Log
export function getLogs(): typeof logs {
  return logs;
}
