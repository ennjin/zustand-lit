import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { clickTo, getInnerText } from './utils';
import { LitElement } from 'lit';
import { testStore } from './test-store';

import './test-components';


const TAGS_NAMES = [
  'test-component-connect',
  'test-component-subscribe',
  'test-component-observe',
];


for (const name of TAGS_NAMES) {
  describe(name, () => {
    const tag = `<${ name }></${ name }`;

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
  })
};


afterEach(() => {
  testStore.getState().reset()
});
