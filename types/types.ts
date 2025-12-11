export type Logs = Record<string, unknown>[];

export type TimerContents = {
  "Start Timestamp": number;
  "End Timestamp": string | number;
  Duration: number | null;
};
export type TimerObj = Record<string, TimerContents>;
export type TimerStack = Record<string, TimerObj>;
export type Stack = {
  timers: TimerStack;
  logs: Logs;
};

export type OnError = {
  stack?: Stack;
  syncError?: ErrorEvent;
  asyncError?: PromiseRejectionEvent;
};

export type GetTimers = {
  json: TimerStack | TimerContents;
  stringify: string;
};

export type GetLogs = { json: Logs; stringify: string };
