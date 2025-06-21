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
      <p>${this.state.bears}</p>
      <button @click=${this.state.addBear}>
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
      <p>${ bears }</p>
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
import { withZustandProvider, updateState } from 'zustand-lit';


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
  state!: BearsState;

  addBears() {
    updateState(BearContext, { bears: this.state.bears + 1 });
  }

  render() {
    return html`
      <p>${ state.bears }</p>
      <button @click=${this.addBears}>
        Add bear
      </button>
    `;
  }
}
```

## TODO

- [ ] Implement `consumeWithSelector` decorator
- [ ] Replace `observe` with `observeWithSelector`

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details
