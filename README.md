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

**There are three ways to use store adapter:**
 - Class mixin
 - Class decorator
 - Context API (new)

 Note: You have to choose one style you prefer and don't mix them.
 For more details you also can take a look at [unit tests example](./test/test-components.ts)

 
1. Use `connect` mixin

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createStore } from 'zustand/vanilla';
import { connect } from 'zustand-lit';


interface BearState {
  bears: number;
  addBear: () => void;
}

const BearStore = createStore<BearState>(set => ({
  bears: 0,
  addBear: () => set(state => ({ bears: state.bears + 1 })),
}));

@customElement('bears')
class BearsElement extends connect(LitElement, BearStore) {
  render() {
    return html`
      <p>${this.$state.bears}</p>
      <button @click=${this.$state.addBear}>
        Add bear
      </button>
    `;
  }
}
```

2. Use `observe` decorator


```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createStore } from 'zustand/vanilla';
import { observe } from 'zustand-lit';


interface BearState {
  bears: number;
}

const BearStore = createStore<BearState>(() => ({
  bears: 0,
}));

@customElement('bears')
@observe(BearStore) 
class BearsElement extends LitElement {
  addBear(bears: number) {
    BearStore.setState({ bears });
  }

  render() {
    const { bears } = BearStore.getState();

    return html`
      <p>${bears}</p>
      <button @click=${() => this.addBear(bears + 1)}>
        Add bear
      </button>
    `;
  }
}
```

3. Context API (new)

Before using context api you have to install `@lit/context` package.  
For more information take a look at the [docs](https://lit.dev/docs/data/context/)

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
    updateState(BearContext, { bears: this.state.bears + 1 });
  }

  render() {
    return html`
      <p>${state.bears}</p>
      <button @click=${this.addBears}>
        Add bear
      </button>
    `;
  }
}
```

To get rid of unnecessary renders you can use `consumeWithSelector` decorator

**Options** 

| Parameter  | Mandatory | Default     | Description                               |
|------------|-----------|-------------|-------------------------------------------|
| context    | Yes       | -           | Context object created by `createContext` |
| selector   | Yes       | -           | A function that extarct data from state   |
| equalityFn | No        | `Object.is` | A function that lets you skip re-renders  |

```ts
import { consumeWithSelector } from 'zustand-lit/context';


interface State {
  bears: number;
  cows: number;
  monkeys: number;
}

const selector = (state: State): number => state.bears;

@customElement('bears-consumer')
class BearsConsumer extends LitElement {
  @consumeWithSelector({ context: BearContext, selector })
  bears?: number;
}
```

Also it's recommended using one selector for slice of state.
To control re-renders you can use `equalityFn` option.

**Note:** `equalityFn` is no needed if primitive types are selected

```ts
import { consumeWithSelector } from 'zustand-lit/context';


interface State {
  bears: number;
  cows: number;
  monkeys: number;
}

type Slice = Pick<State, 'bears' | 'cows'>;

const selectSlice = (state: State): Slice => ({
  bears: state.bears,
  cows: state.cows,
});

const skipRender = (left: State, right: State) => {
  return left.bears === right.bears && left.cows === right.cows;
}

@customElement('bears-consumer')
class BearsConsumer extends LitElement {
  @consumeWithSelector({ 
    context: BearContext,
    selector: selectSlice,
    equalityFn: skipRender
  })
  slice?: Slice;
}
```

## TODO

- [x] Implement `consumeWithSelector` decorator
- [ ] Add possibility using multile stores with `connect`. Add `watch` decorator to improve renders
- [ ] Remove `observe` decorator

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details
