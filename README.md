# Zlogger

A simple, lightweight, and zero-dependency logger for Deno/Node.js/Bun environments, written in TypeScript. It provides features for basic logging, performance timing, log sectioning, and global error handling.

## Features

- **Zero Dependencies**: Lightweight and easy to integrate.
- **Typed API**: Full TypeScript support with generics for autocompletion on timer and section names.
- **Performance Timers**: Easily measure the duration of operations.
- **Log Sections**: Organize logs into different sections for better clarity.
- **Error Handling**: Global error listeners to capture unhandled exceptions and promise rejections, providing the log/timer stack at the time of the error.
- **Flexible Output**: Get logs in JSON format, as a string, or log them directly to the console in different formats.

## Usage

### Import

Import the `Logger` class from `mod.ts`.

```typescript
import { Logger } from "./mod.ts";
```

### Initialization

Create a new instance of the `Logger`. You can pre-define `timerNames` and `sectionNames` to get TypeScript autocompletion and type safety.

```typescript
const logger = new Logger({
  timerNames: ["fileRead", "apiCall"],
  sectionNames: ["database", "authentication"],
});
```

If you don't provide any names, you can still use strings for timers and sections, but you won't get autocompletion.

```typescript
const logger = new Logger();
```

---

### Basic Logging

Use `addLog` to add entries. It's designed to be used inline, as it returns the value that was passed to it.

```typescript
import { Logger } from "./mod.ts";

const logger = new Logger();

function double(n: number): number {
  return logger.addLog(n * 2, "Doubled Number");
}

const result = double(5); // result is 10

// Log all entries to the console
logger.log();

// Log all entries as a table
logger.table();

// Get logs as an object
const logs = logger.getLogs();
console.log(logs.json);
console.log(logs.stringify);
```

---

### Timers

Measure the execution time of your code blocks.

```typescript
import { Logger } from "./mod.ts";

const logger = new Logger({ timerNames: ["totalTime", "fileProcessing"] });

logger.startTimer("totalTime");
logger.startTimer("fileProcessing");

// some file processing logic...

const fileTimer = logger.endTimer("fileProcessing");
console.log("File processing took:");
fileTimer.log(); // Logs the timer object to the console

const totalTimer = logger.endTimer("totalTime");
console.log("Total execution time:");
totalTimer.table(); // Logs the timer object as a table

// Get all timers
const allTimers = logger.getTimers();
console.log(allTimers.JSON);

// Get a specific timer
const specificTimer = logger.getTimers("fileProcessing");
console.log(specificTimer.JSON);
```

---

### Sections

Organize logs into named sections. This is useful for separating logs from different parts of your application (e.g., API calls, database queries).

```typescript
import { Logger } from "./mod.ts";

const logger = new Logger({ sectionNames: ["api", "db"] });

function getUser(id: string) {
  // ... some logic
  const user = { id, name: "John Doe" };
  return logger.toSection(user, "User Fetched", "db");
}

function callApi() {
  // ... some logic
  const response = { status: 200 };
  return logger.toSection(response, "API Response", "api");
}

getUser("123");
callApi();

// Get all sections
const allSections = logger.getSections();
console.log(allSections.json());

// Get a specific section
const dbSection = logger.getSections("db");
dbSection.log(); // console.log the db section
```

Note: `toSection` also adds the log to the main log list.

---

### Error Handling

Zlogger can listen for global unhandled errors (sync) and unhandled promise rejections (async). When an error occurs, it calls your callback function with the error and the current `stack` (all logs and active timers).

This allows you to log the state of your application right before it crashed.

```typescript
import { Logger } from "./mod.ts";

const logger = new Logger();

logger.onError(({ stack, syncError, asyncError }) => {
  console.error("An unhandled error occurred!");
  if (syncError) {
    console.error("Type: Synchronous Error", syncError.message);
  }
  if (asyncError) {
    console.error("Type: Asynchronous Error", asyncError.reason);
  }

  console.log("--- Zlogger Stack at time of error ---");
  console.log("Logs:", stack?.logs);
  console.log("Timers:", stack?.timers);

  // You could also send this data to a logging service
});

logger.addLog("Application starting...", "init");

// This will trigger the sync error handler
throw new Error("Something went wrong!");

// This will trigger the async error handler
// Promise.reject("Something went wrong asynchronously!");
```

### Getting the Full Stack

You can get all logs and timers at any time using `getStack()`.

```typescript
const stack = logger.getStack();
console.log(stack.logs);
console.log(stack.timers);
```
