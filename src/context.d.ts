import type { Context } from '@lit/context';
import type { ReactiveElement } from 'lit';


type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;

interface ProviderOptions<S> {
  context: Context<unknown, S>;
  initialState: S;
}

declare function withZustandProvider<S extends object>(
  options: ProviderOptions<S>
): <T extends ReactiveElementCtor>(base: T) => T;

declare function updateState<S extends object>(
  context: Context<unknown, S>,
  nextState?: Partial<S>,
): void;

export { withZustandProvider, updateState };
