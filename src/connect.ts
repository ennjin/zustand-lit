import type { StoreApi } from 'zustand';
import { PropertyDeclarations, ReactiveElement } from 'lit';


interface ZustandElement<State> extends ReactiveElement {
  $state: State;
}

type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;
type ZustandElementCtor<State> = new(...args: any[]) => ZustandElement<State>;

export function connect<T extends ReactiveElementCtor, State>(
  target: T,
  storeApi: StoreApi<State>,
): ZustandElementCtor<State> {
  return class extends target {
    private _unsubscribe?: () => void;
    declare $state: State;

    static properties: PropertyDeclarations = {
      $state: { state: true }
    };

    constructor(...args: any[]) {
      super(...args);
      this.$state = storeApi.getState();
    }

    connectedCallback(): void {
      super.connectedCallback();

      this._unsubscribe = storeApi.subscribe(state => {
        this.$state = state;
        this.performUpdate();
      });
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();

      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
        this._unsubscribe = undefined;
      }
    }
  }
}
