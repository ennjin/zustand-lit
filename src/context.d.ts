import type { Context } from '@lit/context';
import type { ReactiveElement } from 'lit';


type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;
type Selector<S, R> = (state: S) => R;
type EqualityFn<R> = (left: R, right: R) => boolean;

interface ProviderOptions<S> {
  context: Context<unknown, S>;
  initialState: S;
}

interface ConsumerOptions<S, R> {
  context: Context<unknown, S>;
  selector: Selector<S, R>;
  equalityFn?: EqualityFn<R>;
}

declare function withZustandProvider<S extends object>(
  options: ProviderOptions<S>
): <T extends ReactiveElementCtor>(base: T) => T;

declare function updateState<S extends object>(
  context: Context<unknown, S>,
  nextState?: Partial<S>,
): void;

declare function consumeWithSelector<S extends object, R>(
  options: ConsumerOptions<S, R>
): <T extends ReactiveElement>(target: T, property: string) => void;

export { 
  consumeWithSelector, 
  updateState,
  withZustandProvider, 
 };
