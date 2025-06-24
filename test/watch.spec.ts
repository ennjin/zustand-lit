import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TestStore, TestState } from './store';
import { clickTo, getInnerText } from './utils';
import { watch } from '../src';


const tag = '<watch-cmp></watch-cmp>'; 

@customElement('watch-cmp')
class WatchComponent extends LitElement {
  @watch(TestStore)
  state?: TestState;

  render() {
    return html`
      <span id="count">${this.state?.bears}</span>
      <button id="handler" @click=${this.state?.increase}>
        Set count
      </button>
    `;
  }
}

describe('@watch', () => {
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
