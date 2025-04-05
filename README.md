## zustand-lit

[![npm](https://img.shields.io/npm/v/zustand-lit)](https://www.npmjs.com/package/zustand-lit)
[![Build](https://img.shields.io/github/actions/workflow/status/ennjin/zustand-lit/publish.yml)](https://github.com/ennjin/zustand-lit/actions?query=workflow%3APublish)


A [zustand](https://github.com/pmndrs/zustand) adapter for [lit](https://github.com/lit/lit)

**Zustand** is a lightweight state manager for javascript applications

## Install

```
npm install zustand zustand-lit
```

## Usage

**There are two ways to use store adapter:**
 - Class mixin
 - Class decorator
 - Class field decorator [deprecated]

 Note: You have to choose one style you prefer and don't mix them.
 For more details you also can take a look at [unit tests example](./test/test-components.ts)

 
[1] Create a store object

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

[2] Use one of availables bridges

[2.1] `connect` mixin

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

Get access to store object through `$state` property

```ts
this.$state.count;
this.$state.setCount(1);
```

[2.2] `observe` decorator

```ts
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { observe } from 'zustand-lit';
import { appStore } from './app-store.ts'; 

@customElement('app-component')
@observe(appStore)
export class AppComponent extends LitElement { }
```

Read the state

```ts
appStore.getState().count;
appStore.getState().setCount(1);
```

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details
