import type { StoreApi } from 'zustand';
import type { 
  ReactiveController,
  ReactiveControllerHost,
  ReactiveElement,
} from 'lit';


type Selector<S, R> = (state: S) => R;
type WatchDecorator = <T extends ReactiveElement>(target: T, property: string) => void;

interface WatchOptions<S, R> {
  store: StoreApi<S>;
  selector: Selector<S, R>;
  equalityFn?: (left: R, right: R) => boolean;
}

class WatchController<S, R> implements ReactiveController {
  value: R;
  protected host: ReactiveControllerHost;

  private _options: WatchOptions<S, R>;
  private _unsubscribe?: () => void;

  constructor(host: ReactiveControllerHost, options: WatchOptions<S, R>) {
    const { store, selector } = options;
    this._options = options;
    this.value = selector(store.getState());

    this.host = host;
    this.host.addController(this);
  }

  hostConnected(): void {
    const { store } = this._options;
    this._unsubscribe = store.subscribe(state => this._watch(state));
  }

  hostDisconnected(): void {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = undefined;
    }
  }

  private _watch(state: S): void {
    const { selector, equalityFn } = this._options;
    const equals = equalityFn ?? Object.is;    
    const nextValue = selector(state);

    if (equals(this.value, nextValue)) {
      return;
    }

    this.value = nextValue;
    this.host.requestUpdate();
  }
}

function watchImpl<S, R>(options: WatchOptions<S, R>): WatchDecorator {
  return <T extends ReactiveElement>(target: T, property: string) => {
    const ctor = target.constructor as typeof ReactiveElement;
    let controller: WatchController<S, R> | undefined;

    ctor.addInitializer(host => {
      controller = new WatchController(host, options);
    });

    Object.defineProperty(target, property, {
      get: () => controller?.value,
      configurable: false,
    });
  }
};

export function watchWithSelector<S extends object, R>(options: WatchOptions<S, R>): WatchDecorator {
  return watchImpl(options);
}

export function watch<S extends object>(api: StoreApi<S>): WatchDecorator {
  const options: WatchOptions<S, S> = {
    store: api,
    selector: state => state,
  };

  return watchImpl(options);
}
