import { ReactiveElement } from 'lit';


export function getInnerText<T extends ReactiveElement>(
  element: T,
  selector: string
): string {
  const target = element.shadowRoot?.querySelector<HTMLElement>(selector);
  return target ? target.innerText.trim() : '';
}

export function clickTo<T extends ReactiveElement>(
  element: T,
  selector: string
): void {
  const btn = element.shadowRoot?.querySelector(selector);
  if (!btn) return;

  btn.dispatchEvent(new Event('click', { bubbles: true }));
}
