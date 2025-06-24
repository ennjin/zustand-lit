import { assert, elementUpdated, expect, fixture } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume, createContext } from '@lit/context';
import { TestState } from './store';
import { clickTo, getInnerText } from './utils';
import { updateState, withZustandProvider } from '../src/context';


const context = createContext<TestState>('bears-context');
const tag = `bears-provider`;

const initialState: TestState = {
  bears: 0,
  increase: () => {},
}

@customElement('bears-provider')
@withZustandProvider<TestState>({ context, initialState })
class BearsProvider extends LitElement {
  render() {
    return html`<bears-consumer></bears-consumer>`;
  }
}

@customElement('bears-consumer')
class BearsConsumer extends LitElement {
  @consume({ context, subscribe: true })
  state?: TestState;

  increase() {
    const current = this.state?.bears ?? 0;
    updateState(context, { bears: current + 1 });
  }

  render() {
    return html`
      <div id="count">${this.state?.bears}</div>
      <button id="handler" @click=${this.increase}>
        Set count
      </button>  
    `;
  }
}

describe('@consume', () => {
  it('Should read initial value', async () => {
    const provider = await fixture<LitElement>(`<${ tag }></${ tag }>`);
    const consumer = provider.shadowRoot?.querySelector<LitElement>('bears-consumer');

    assert(consumer != null, 'bears-consumer must be defined');

    const value = getInnerText(consumer, '#count');    
    expect(value).to.be.equal('0');
  });
  
  it('Should update value', async () => {
    const provider = await fixture<LitElement>(`<${ tag }></${ tag }>`);
    const consumer = provider.shadowRoot?.querySelector<LitElement>('bears-consumer');

    assert(consumer != null, 'bears-consumer must be defined');

    clickTo(consumer, '#handler');  
    await elementUpdated(consumer);

    const value = getInnerText(consumer, '#count');
    expect(value).to.be.equal('1');
  });
});
