import type { ReactiveElement } from 'lit';
import type { StoreApi } from 'zustand';


type Unsubscribe = () => void;

function makeDecorator<T extends ReactiveElement>(
  target: T,
  prop: string,
  subscribeToStore: (self: T, prop: string) => Unsubscribe,
): void {
  let unsubscribe: () => void;

  const connectedCallback = target.connectedCallback;
  const disconnectedCallback = target.disconnectedCallback;

  target.connectedCallback = function() {
    unsubscribe = subscribeToStore(this, prop);
    connectedCallback.apply(this);
  };

  target.disconnectedCallback = function() {
    disconnectedCallback.apply(this);

    if (typeof unsubscribe == 'function') {
      unsubscribe();
    }
  };
}

export function subscribe<T>(storeApi: StoreApi<T>): PropertyDecorator;
export function subscribe<T extends ReactiveElement>(target: T, prop: string): void;
export function subscribe(...args: unknown[]): any {
  if (args.length === 1) {
    const [storeApi] = args as [StoreApi<unknown>];

    return <T extends ReactiveElement>(target: T, prop: string) => {
      (target as any)[prop] = storeApi.getInitialState();

      makeDecorator(
        target,
        prop,
        (instance: T, prop: string | symbol) => storeApi.subscribe(state => {
          (instance as any)[prop] = state;
          instance.requestUpdate();
        })
      );
    };

  } else {
    const [target, prop] = args as [ReactiveElement, string];

    makeDecorator(
      target,
      prop,
      (instance: ReactiveElement, prop: string) => {
        const api = (instance as any)[prop] as StoreApi<unknown>;
        return api.subscribe(() => instance.requestUpdate());
      }
    );
  }
}
