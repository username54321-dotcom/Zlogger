// Constants
let logs: Record<string, unknown>[] = [];
let isSection = false;
let timer: number = 0;

// Start Time Tracking
export function startTimer(): void {
  timer === 0 && (timer = Date.now());
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
      Duration: timer ? Date.now() - timer : "Timer was not Started",
    },
  };

  // No Active Section -- Just Append
  if (!isSection) {
    logs.push(output);

    // Active Section
  } else if (isSection) {
    const keptItems = logs.slice(0, logs.length - 1); // Items Before The Active Section
    const sectionItem = logs.slice(-1)[0]; // Active Setion Object
    const sectionName = Object.keys(sectionItem)[0];
    const sectionValues = Object.values(sectionItem).flat(); // Previous Logs In Active Section
    sectionValues.push(output); // Push The Log To Previous Logs
    logs = [...keptItems, { [sectionName]: sectionValues }];
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
