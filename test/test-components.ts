import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { testStore } from './test-store';
import { connect, observe } from '../src';


@customElement('test-component-connect')
export class TestComponentConnect extends connect(LitElement, testStore) {
  render() {
    return html`
      <div id="count">${this.$state.count}</div>
      <button id="handler" @click=${() => this.$state.setCount(1)}>
        Set count
      </button>  
    `;
  }
}

@customElement('test-component-observe')
@observe(testStore)
export class TestComponentObserve extends LitElement {
  render() {
    const { count, setCount } = testStore.getState();

    return html`
      <div id="count">${count}</div>
      <button id="handler" @click=${() => setCount(1)}>
        Set count
      </button>  
    `;
  }
}
