export type Logs = Record<string, unknown>[];

export type Timer = {
  "Start Timestamp": number;
  "End Timestamp": string | number;
  Duration: number | null;
};
export type TimerObj = Record<string, Timer>;
export type TimerStack = Record<string, Timer>;
export type Stack = {
  timers: TimerStack;
  logs: Logs;
};

export type OnError = {
  stack?: Stack;
  // syncError?: ErrorEvent;
  // asyncError?: PromiseRejectionEvent;
};

export type GetTimers = {
  JSON: Timer | TimerStack;
  stringified: string;
};

export type GetLogs = { json: Logs; stringify: string };

export type Sections<SectionNames extends string> =
  | Record<SectionNames, Logs[]>
  | Record<PropertyKey, []>;

export type GetSections<SectionNames extends string> = {
  log: () => void;
  json: () => Sections<SectionNames> | Logs[];
  stringify: () => string;
};
export type EndTimer = {
  timer: Timer;
  log: () => void;
  table: () => void;
};
