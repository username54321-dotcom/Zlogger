import { createStore } from "zustand/vanilla";

type logStore = {
  logs: object;
  addlog: (name: string, value: unknown) => unknown;
};

const store = createStore<logStore>((set) => ({
  logs: {},
  addlog: (name: string, value: unknown) => {
    set((state) => ({
      logs: {
        ...state.logs,
        [name]: value,
      },
    }));
    return value;
  },
}));

export const getLogs = () => store.getState().logs;
export const addLog = (name: string, value: unknown) =>
  store.getState().addlog(name, value);
