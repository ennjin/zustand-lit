import type { ReactiveElement } from 'lit';
import type { StoreApi } from 'zustand';


type BaseConstructor = new(...args: any[]) => ReactiveElement;
type Subscription = () => void;

const subscriptions = Symbol();

export function observe(storeApi: StoreApi<unknown> | StoreApi<unknown>[]) {
  const apis = Array.isArray(storeApi) ? storeApi : [storeApi];

  return <T extends BaseConstructor>(base: T) => {
    return class extends base {
      [subscriptions]: Subscription[] = [];

      connectedCallback(): void {
        super.connectedCallback();

        const _update = () => this.requestUpdate();
        this[subscriptions] = apis.map(api => api.subscribe(_update));
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();

        this[subscriptions].forEach(unusb => unusb());
        this[subscriptions] = [];
      }
    }
  };
}
