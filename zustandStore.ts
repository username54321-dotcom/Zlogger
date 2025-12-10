import { createStore } from "zustand/vanilla";

// Store Types
type LogStore = {
  logs: object;
  addlog: (name: string, value: unknown) => unknown;
};

// Start Time
const startTime = Date.now();
const getTime = () => Date.now() - startTime;

// Actual Store
const store = createStore<LogStore>((set) => ({
  logs: {},
  addlog: (name: string, value: unknown) => {
    set((state) => ({
      logs: {
        ...state.logs,
        [name]: {
          value: value,
          time: getTime(),
        },
      },
    }));
    return value;
  },
}));

export const getLogs = (): unknown => store.getState().logs;
export const addLog = (name: string, value: unknown): unknown =>
  store.getState().addlog(name, value);
