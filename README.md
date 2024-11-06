## zustand-lit

A [zustand](https://github.com/pmndrs/zustand) adapter for [lit](https://github.com/lit/lit)

**Zustand** is a lightweight state manager for javascript applications

## Install

```
npm install zustand zustand-lit
```

## Usage

**There are two ways to use store adapter:**
 - Class mixin
 - Class field decorator

 Note: You have to choose one style you prefer and don't mix them.
 For more details you also can take a loot at [unit tests example](./test/test-components.ts)

1. Create a store object

```ts
// app-store.ts
import { createStore } from 'zustand/vanilla';

export interface AppState {
  count: number;
  setCount: (count: number) => void;
}

export const appStore = createStore<AppState>(set => ({
  count: 0,
  setCount: count => set({ count }),
}));
```

#### Use a class mixin

2.1 Connect store object to lit element
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

2.2 Get access to store object through `$state` property

```ts
this.$state.count;
this.$state.setCount(1);
```

#### Use a class field decorator

2.1 Define a store field

```ts
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { subscribe } from 'zustand-lit';
import { appStore, AppState } from './app-store.ts'; 

@customElement('app-component')
export class AppComponent extends LitElement {
  // subscribe to store object
  @subscribe 
  readonly appStore = appStore;

  // or subscribe to state directly
  @subscribe(appStore)
  appState!: AppState;
}
```

2.2 Get access to store object

```ts
// Store
this.appStore.getState().count;
this.appStore.getState().setCount(1);
// Or state
this.appState.count;
this.appState.setCount(1);
```


## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details
