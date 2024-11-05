import type { ReactiveElement } from 'lit';
import type { StoreApi } from 'zustand';


export function subscribe<T extends ReactiveElement>(
  target: T,
  prop: string
): void {
  let unsubscribe: () => void;

  const connectedCallback = target.connectedCallback;
  const disconnectedCallback = target.disconnectedCallback;

  target.connectedCallback = function() {
    const api = (this as any)[prop] as StoreApi<unknown>;

    unsubscribe = api.subscribe(() => this.requestUpdate());
    connectedCallback.apply(this);
  };

  target.disconnectedCallback = function() {
    disconnectedCallback.apply(this);

    if (typeof unsubscribe == 'function') {
      unsubscribe();
    }
  };
}
