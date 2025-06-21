import { ReactiveElement } from 'lit';
import { type Context, ContextProvider } from '@lit/context';
import { StoreApi } from 'zustand';
import { createStore } from 'zustand/vanilla';


type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;

interface ProviderOptions<S> {
  context: Context<unknown, S>;
  initialState: S;
}

const STORES_MAP = new Map<Context<unknown, unknown>, StoreApi<unknown>>();

export function withZustandProvider<
  S extends object,
>(options: ProviderOptions<S>) {
  return <T extends ReactiveElementCtor>(target: T) => {
    return class extends target {
      private _provider!: ContextProvider<Context<unknown, S>>;
      private _cleanup!: () => void;

      constructor(...args: any[]) {
        super(...args);
        this.init();
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();
        this._cleanup();
      }

      connectedCallback(): void {
        super.connectedCallback();
      }

      private init(): void {
        const { context, initialState } = options;
        const store = createStore<S>(() => initialState);
        STORES_MAP.set(context, store);

        this._provider = new ContextProvider(this, { 
          context,
          initialValue: initialState,
        });

        this._cleanup = store.subscribe(state => {
          this._provider.setValue(state);
        });
      }
    }
  };
}

export function updateState<S extends object>(
  context: Context<unknown, S>,
  nextState?: Partial<S>,
): void {
  const api = STORES_MAP.get(context); 
  api?.setState(nextState);
}
