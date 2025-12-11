export type Logs = Record<string, unknown>[];

export type TimerContents = {
  "Start Timestamp": number;
  "End Timestamp": string | number;
  Duration: number | null;
};
export type TimerObj = Record<string, TimerContents>;
export type TimerStack = Record<string, TimerObj>;
export interface Stack {
  timers: TimerStack;
  logs: Logs;
}

export interface OnError {
  stack?: Stack;
  syncError?: ErrorEvent;
  asyncError?: PromiseRejectionEvent;
}
