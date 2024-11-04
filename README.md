### zustand-lit

A [zustand](https://github.com/pmndrs/zustand) adapter for [lit.js](https://github.com/lit/lit)

**Zustand** is a lightweight state manager for javascript applications

### Install

```
npm install zustand zustand-lit
```

### Usage

- Create a store object

```ts
// app-store.ts
import { createStore } from 'zustand/vanilla';

interface AppState {
  count: number;
  setCount: (count: number) => void;
}

export const appStore = createStore<AppState>(set => ({
  count: 0,
  setCount: count => set({ count }),
}));
```

- Connect store object to lit element
```ts
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { connect } from 'zustand-lit';
import { appStore } from './app-store.ts'; 

@customElement('app-component')
export class AppComponent extends connect(LitElement, appStore) {
  // ...
}
```

- Get access to store object through `$state` property

```ts
this.$state.count;
this.$state.setCount(1)
```

### License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
