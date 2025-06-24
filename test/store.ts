import { createStore } from 'zustand/vanilla';


export interface TestState {
  bears: number;
  increase: () => void;
}

export const TestStore = createStore<TestState>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}));
