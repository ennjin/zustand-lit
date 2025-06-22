import type { ReactiveElement } from 'lit';
import {
  type Context, 
  type ContextCallback,
  type ContextType,
  ContextConsumer,
  ContextProvider,
} from '@lit/context';
import { createStore, StoreApi } from 'zustand/vanilla';


type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;
type Selector<S, R> = (state: S) => R;

interface ConsumerOptions<S, R> {
  context: Context<unknown, S>;
  selector: Selector<S, R>;
}

interface ProviderOptions<S> {
  context: Context<unknown, S>;
  initialState: S;
}

const STORES_MAP = new Map<Context<unknown, unknown>, StoreApi<unknown>>();

export function withZustandProvider<S extends object>(options: ProviderOptions<S>) {
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

      private init(): void {
        const { context, initialState } = options;
        const store = createStore<S>(() => initialState);
        STORES_MAP.set(context, store);

        this._provider = new ContextProvider(this, { 
          context,
          initialValue: initialState,
        });

        const updateContext = (state: S) => this._provider.setValue(state);
        this._cleanup = store.subscribe(updateContext);
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

class ConsumerWithSelector<S, R> extends ContextConsumer<Context<unknown, S>, ReactiveElement> {
  selectedValue?: any;

  private _selector: Selector<S, R>;
  private _originalCallback = this['_callback'];

  constructor(host: ReactiveElement,
              options: ConsumerOptions<S, R>) {
    super(host, { context: options.context, subscribe: true });

    this._selector = options.selector;
    /* Monkey patching is bad mkay */
    this['_callback'] = this._patchedCallback;
  }

  private _patchedCallback: ContextCallback<ContextType<Context<unknown, S>>> = (value, unsubscribe) => {
    const nextValue = this._selector(value);
    if (Object.is(this.selectedValue, nextValue)) return;

    this.selectedValue = nextValue;
    this._originalCallback(value, unsubscribe);
  }
}

export function consumeWithSelector<S extends object, R>(options: ConsumerOptions<S, R>) {
  return <T extends ReactiveElement>(target: T, property: string) => {
    const ctor = target.constructor as typeof ReactiveElement;
    let consumer: ConsumerWithSelector<S, R> | undefined;

    ctor.addInitializer(instance => {
      consumer = new ConsumerWithSelector(instance, options);
    });

    Object.defineProperty(target, property, {
      get: () => consumer?.selectedValue,
    })
  };
}
