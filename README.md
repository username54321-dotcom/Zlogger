# @qamareg/zlogger

A flexible and lightweight TypeScript logger for Deno, Node.js, and browsers.

`@qamareg/zlogger` provides a simple yet powerful way to log events, measure performance, and handle errors in your TypeScript or JavaScript projects. It's designed to be intuitive and easy to use, with a focus on providing valuable debugging information.

## Features

- **Timers**: Easily measure the duration of specific operations.
- **Sections**: Organize your logs into logical groups or sections.
- **Lifecycle Hooks**: Execute custom logic on application exit (`onEnd`) or when an unhandled error occurs (`onError`).
- **Type-Safe**: Uses TypeScript generics to provide type safety for timer and section names.
- **Cross-Platform**: Works in Deno, Node.js, and modern browsers.

## Installation

`@qamareg/zlogger` is published on [JSR](https://jsr.io).

To use `@qamareg/zlogger` in your Deno project, add it to your `deno.json`:

```json
{
  "imports": {
    "@qamareg/zlogger": "jsr:@qamareg/zlogger@^1.5.0"
  }
}
```

Then, you can import it into your project:

```typescript
import { Logger } from "@qamareg/zlogger";
```

For Node.js, you can use `npx`:

```bash
npx jsr add @qamareg/zlogger
```

## Basic Usage

Here's a simple example of how to use `@qamareg/zlogger`:

```typescript
import { Logger } from "@qamareg/zlogger";

const logger = new Logger();

logger.addLog("Initializing application...", "init");
// ... your code ...
logger.addLog("Application finished.", "shutdown");

console.log(logger.logs);
```

## Advanced Usage

### Timers

You can use timers to measure the performance of specific parts of your code.

```typescript
import { Logger } from "@qamareg/zlogger";

const logger = new Logger({
  timerNames: ["fetchData", "processData"],
});

logger.startTimer("fetchData");
const response = await fetch("https://api.example.com/data");
logger.endTimer("fetchData");

logger.startTimer("processData");
const data = await response.json();
// ... process data ...
logger.endTimer("processData");

console.log(logger.timers);
```

### Sections

Sections allow you to group related logs together.

```typescript
import { Logger } from "@qamareg/zlogger";

const logger = new Logger({
  sectionNames: ["userAuth", "dataProcessing"],
});

logger.toSection("User attempting to log in", "login-attempt", "userAuth");
// ... authentication logic ...
logger.toSection("User logged in successfully", "login-success", "userAuth");

logger.toSection("Starting data processing", "start", "dataProcessing");
// ... data processing logic ...
logger.toSection("Data processing complete", "end", "dataProcessing");

console.log(logger.sections);
```

### Lifecycle Hooks

`@qamareg/zlogger` provides `onEnd` and `onError` hooks to handle application exit and unhandled errors.

```typescript
import { Logger } from "@qamareg/zlogger";

const logger = new Logger({
  onEnd: (stack) => {
    console.log("Application is closing. Final logs:", stack.logs);
    // You could send this data to a logging service
  },
  onError: (errorEvent, stack) => {
    console.error("An unhandled error occurred:", errorEvent);
    console.error("State at the time of error:", stack);
    // You could report this error to a monitoring service
  },
});

// ... your application logic ...

// This will trigger the onError hook
// throw new Error("Something went wrong!");
```

## API Reference

### `new Logger<TimerNames, SectionNames>(props)`

Creates a new `Logger` instance.

- `props` (optional): An object with the following properties:
  - `timerNames`: An array of strings representing the names of the timers you want to use.
  - `sectionNames`: An array of strings representing the names of the sections you want to use.
  - `onEnd`: A function that will be called when the application exits. It receives the final `stack` (logs and timers) as an argument.
  - `onError`: A function that will be called when an unhandled error or promise rejection occurs. It receives the `errorEvent` and the current `stack` as arguments.

### `addLog<T>(value: T, label: string): T`

Adds a log entry to the `logs` array.

### `toSection<T>(value: T, label: string, sectionName: SectionNames): T`

Adds a log entry to a specific section.

### `startTimer(timerName: TimerNames): this`

Starts a timer with the specified name.

### `endTimer(timerName: TimerNames): this`

Stops a timer with the specified name and calculates the duration.

### `logger.logs`

An array containing all the log entries.

### `logger.timers`

An object containing all the timer data.

### `logger.sections`

An object containing all the section data.

### `logger.stack`

An object containing both `logs` and `timers`.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
