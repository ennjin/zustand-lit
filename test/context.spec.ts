import { assert, elementUpdated, expect, fixture } from '@open-wc/testing';
import { LitElement } from 'lit';
import { clickTo, getInnerText } from './utils';

import './context-component';


const tag = `test-component-provider`;

describe(tag, () => {
  it('Should read initial value', async () => {
    const provider = await fixture<LitElement>(`<${ tag }></${ tag }>`);
    const consumer = provider.shadowRoot?.querySelector<LitElement>('test-component-consumer');

    assert(consumer != null, 'test-component-consumer must be defined');

    const value = getInnerText(consumer, '#count');    
    expect(value).to.be.equal('0');
  });
  
  it('Should update value', async () => {
    const provider = await fixture<LitElement>(`<${ tag }></${ tag }>`);
    const consumer = provider.shadowRoot?.querySelector<LitElement>('test-component-consumer');

    assert(consumer != null, 'test-component-consumer must be defined');

    clickTo(consumer, '#handler');  
    await elementUpdated(consumer);

    const value = getInnerText(consumer, '#count');
    expect(value).to.be.equal('1');
  });
});
