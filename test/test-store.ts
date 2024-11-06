import { createStore } from 'zustand/vanilla';


export interface TestState {
  count:  number;
  setCount: (value: number) => void;
  reset: () => void;
}

export const testStore = createStore<TestState>(set => ({
  count: 0,
  setCount: count => set({ count }),
  reset: () => set({ count: 0 })
}));
