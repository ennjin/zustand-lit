## zustand-lit

[![npm](https://img.shields.io/npm/v/zustand-lit)](https://www.npmjs.com/package/zustand-lit)
[![Build](https://img.shields.io/github/actions/workflow/status/ennjin/zustand-lit/publish.yml)](https://github.com/ennjin/zustand-lit/actions?query=workflow%3APublish)


A [zustand](https://github.com/pmndrs/zustand) adapter for [lit](https://github.com/lit/lit)

**Zustand** is a lightweight state manager for javascript applications

## Install

```
npm install zustand zustand-lit
```

**Version 2.0.0 breaking changes!**

1. Removed `observe` decorator
2. Removed `connect` mixin function
3. Added `watch` and `watchWithSelector` decorators

**Motivation:**

The `connect` and `observe` adapters update the component whenever the state changes. On top of that unnecessary renders are happened. To avoid this problems the new `watchWithSelector` API was created.

## Usage

You have to use `createStore` factory function from `zustand/vanilla` package.

- Choose `@watch` if you have no many data and/or for static objects (like config, user, etc.)
- Choose `@watchWithSelector` for performance control
- Choose `Context API` to create 3d party library

#### `@watch` and `@watchWithSelector` decorators

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createStore } from 'zustand/vanilla';
import { watch } from 'zustand-lit';


interface BearState {
  bears: number;
  addBear: () => void;
}

const BearStore = createStore<BearState>(set => ({
  bears: 0,
  addBear: () => set(state => ({ bears: state.bears + 1 })),
}));

@customElement('bears')
class BearsElement extends LitElement {
  @watch(BearStore) state?: BearState;

  render() {
    return html`
      <p>${this.state?.bears}</p>
      <button @click=${this.state?.addBear}>
        Add bear
      </button>
    `;
  }
}
```

To control renders you are able to use `watchWithSelector` decorator


```ts
import { watchWithSelector } from 'zustand-lit';


interface ZooState {
  bears: number;
  cows: number;
  monkeys: number;
  snakes: number;
}

const selectBears = (state: ZooState) => state.bears;

@customElement('bears')
class BearsElement extends LitElement {
  @watchWithSelector({ store: ZooStore, selector: selectBears })
  bears?: number;
}
```

#### `watchWithSelector` options

| Parameter  | Mandatory | Default     | Description                               |
|------------|-----------|-------------|-------------------------------------------|
| store      | Yes       | -           | Store object created by `createStore`     |
| selector   | Yes       | -           | A state extractor                         |
| equalityFn | No        | `Object.is` | A function that lets you skip re-renders  |


#### Context API

Before using context api you have to install `@lit/context` package.  
For more information take a look at the [docs](https://lit.dev/docs/data/context/)

**Usage**

- `@withZustandProvider` to create provider component
- `@consume` from `@lit/context` to read store value
- `@consumeWithSelector` for performance control
- `updateState(context, value)` to update state

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume, createContext } from '@lit/context';
import { withZustandProvider, updateState } from 'zustand-lit/context';


interface BearState {
  bears: number;
}

const initialState: BearState = {
  bears: 0
};

const BearContext = createContext<BearState>('bear-context');

@customElement('bears-provider')
@withZustandProvider({ context: BearContext, initialState }) 
class BearsProvider extends LitElement {
  render() {
    return html`<bears-consumer></bears-consumer>`;
  }
}

@customElement('bears-consumer')
class BearsConsumer extends LitElement {
  @consume({ context: BearContext, subscribe: true })
  state?: BearsState;

  addBears() {
    const current = this.state?.bears ?? 0;
    updateState(BearContext, { bears: current + 1 });
  }

  render() {
    return html`
      <p>${this.state?.bears}</p>
      <button @click=${this.addBears}>
        Add bear
      </button>
    `;
  }
}
```

To control renders you are able to use `consumeWithSelector` decorator

```ts
import { consumeWithSelector } from 'zustand-lit/context';


interface ZooState {
  bears: number;
  cows: number;
  monkeys: number;
  snakes: number;
}

const selector = (state: ZooState): number => state.bears;

@customElement('bears-consumer')
class BearsConsumer extends LitElement {
  @consumeWithSelector({ context: BearContext, selector })
  bears?: number;
}
```

**`consumeWithSelector` options**

| Parameter  | Mandatory | Default     | Description                               |
|------------|-----------|-------------|-------------------------------------------|
| context    | Yes       | -           | Context object created by `createContext` |
| selector   | Yes       | -           | A state extractor                         |
| equalityFn | No        | `Object.is` | A function that lets you skip re-renders  |


## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details
