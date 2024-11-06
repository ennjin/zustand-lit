import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { connect, subscribe } from '../src';
import { TestState, testStore } from './test-store';


@customElement('test-component-connect')
export class TestComonent1 extends connect(LitElement, testStore) {
  render() {
    return html`
      <div id="count">${this.$state.count}</div>
      <button id="handler" @click=${() => this.$state.setCount(1)}>
        Set count
      </button>  
    `;
  }
}

@customElement('test-component-subscribe-store')
export class TestComonent2 extends LitElement {
  @subscribe
  readonly store = testStore;

  render() {
    const { count, setCount } = this.store.getState();

    return html`
      <div id="count">${count}</div>
      <button id="handler" @click=${() => setCount(1)}>
        Set count
      </button>  
    `;
  }
}

@customElement('test-component-subscribe-state')
export class TestComonent3 extends LitElement {
  @subscribe(testStore)
  state!: TestState;

  render() {
    const { count, setCount } = this.state;

    return html`
      <div id="count">${count}</div>
      <button id="handler" @click=${() => setCount(1)}>
        Set count
      </button>  
    `;
  }
}
