import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume, createContext } from '@lit/context';
import { withZustandProvider, updateState } from '../src/context';


interface State {
  count: number;
}

const initialState: State = {
  count: 0,
}

const context = createContext<State>('test-context');

@customElement('test-component-provider')
@withZustandProvider<State>({ context, initialState })
export class TestComponentProvider extends LitElement {
  render() {
    return html`<test-component-consumer></test-component-consumer>`;
  }
}

@customElement('test-component-consumer')
export class TestComponentConsumer extends LitElement {
  @consume({ context, subscribe: true })
  state?: State;

  render() {
    return html`
      <div id="count">${this.state?.count}</div>
      <button id="handler" @click=${() => updateState(context, { count: 1 })}>
        Set count
      </button>  
    `;
  }
}