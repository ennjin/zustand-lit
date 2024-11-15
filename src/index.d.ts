import type { ReactiveElement } from 'lit';
import type { StoreApi } from 'zustand';


interface ZustandLitElement<State> extends ReactiveElement {
  $state: State;
}

type ReactiveElementCtor = new(...args: any[]) => ReactiveElement;
type ZustandLitElementCtor<State> = new(...args: any[]) => ZustandLitElement<State>;
type Subscription = () => void;

export declare function subscribe<T extends ReactiveElement>(
  target: T,
  prop: string
): void;

export declare function connect<T extends ReactiveElementCtor, State>(
  target: T,
  storeApi: StoreApi<State>
): ZustandLitElementCtor<State> 

export declare function observe(
  storeApi: StoreApi<unknown> | StoreApi<unknown>[]
): <T extends ReactiveElementCtor>(base: T) => T;
