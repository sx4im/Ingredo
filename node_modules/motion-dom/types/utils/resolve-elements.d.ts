export type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string;
export interface WithQuerySelectorAll {
    querySelectorAll: Element["querySelectorAll"];
}
export interface AnimationScope<T = any> {
    readonly current: T;
    animations: any[];
}
export interface SelectorCache {
    [key: string]: NodeListOf<Element>;
}
export declare function resolveElements(elementOrSelector: ElementOrSelector, scope?: AnimationScope, selectorCache?: SelectorCache): Element[];
