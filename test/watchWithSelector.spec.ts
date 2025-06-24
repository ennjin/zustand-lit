import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TestStore, TestState } from './store';
import { clickTo, getInnerText } from './utils';
import { watchWithSelector } from '../src';


const tag = '<watch-with-selector-cmp></watch-with-selector-cmp>'; 
const selector = (state: TestState) => state.bears;

@customElement('watch-with-selector-cmp')
class WatchWithSelectorComponent extends LitElement {
  @watchWithSelector({ store: TestStore, selector })
  bears?: number;

  increase() {
    const current = this.bears ?? 0;
    TestStore.setState({ bears: current + 1 });
  }

  render() {
    return html`
      <span id="count">${this.bears}</span>
      <button id="handler" @click=${this.increase}>
        Set count
      </button>
    `;
  }
}

describe('@watchWithSelector', () => {
  it('Should read initial value', async () => {
    const element = await fixture<LitElement>(tag);
    const value = getInnerText(element, '#count');
  
    expect(value).to.be.equal('0');
  });
  
  it('Should update value', async () => {
    const element = await fixture<LitElement>(tag);
    clickTo(element, '#handler');
  
    await elementUpdated(element);
    const value = getInnerText(element, '#count');
  
    expect(value).to.be.equal('1');
  });
});

afterEach(() => {
  TestStore.setState({ bears: 0 });
});
