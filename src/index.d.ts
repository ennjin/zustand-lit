import type { StoreApi } from 'zustand';
import type { ReactiveElement } from 'lit';


type Selector<S, R> = (state: S) => R;
type WatchDecorator = <T extends ReactiveElement>(target: T, property: string) => void;

interface WatchOptions<S, R> {
  store: StoreApi<S>;
  selector: Selector<S, R>;
  equalityFn?: (left: R, right: R) => boolean;
}

declare function watch<S extends object>(
  api: StoreApi<S>
): WatchDecorator;

declare function watchWithSelector<S extends object, R>(
  options: WatchOptions<S, R>
): WatchDecorator;

export { watch, watchWithSelector };
