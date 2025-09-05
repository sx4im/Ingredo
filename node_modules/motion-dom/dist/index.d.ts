type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string;
interface WithQuerySelectorAll {
    querySelectorAll: Element["querySelectorAll"];
}
interface AnimationScope<T = any> {
    readonly current: T;
    animations: any[];
}
interface SelectorCache {
    [key: string]: NodeListOf<Element>;
}
declare function resolveElements(elementOrSelector: ElementOrSelector, scope?: AnimationScope, selectorCache?: SelectorCache): Element[];

/**
 * Options for the hover gesture.
 *
 * @public
 */
interface HoverOptions {
    /**
     * Use passive event listeners. Doing so allows the browser to optimize
     * scrolling performance by not allowing the use of `preventDefault()`.
     *
     * @default true
     */
    passive?: boolean;
    /**
     * Remove the event listener after the first event.
     *
     * @default false
     */
    once?: boolean;
}
/**
 * A function to be called when a hover gesture starts.
 *
 * This function can optionally return a function that will be called
 * when the hover gesture ends.
 *
 * @public
 */
type OnHoverStartEvent = (event: PointerEvent) => void | OnHoverEndEvent;
/**
 * A function to be called when a hover gesture ends.
 *
 * @public
 */
type OnHoverEndEvent = (event: PointerEvent) => void;
/**
 * Create a hover gesture. hover() is different to .addEventListener("pointerenter")
 * in that it has an easier syntax, filters out polyfilled touch events, interoperates
 * with drag gestures, and automatically removes the "pointerennd" event listener when the hover ends.
 *
 * @public
 */
declare function hover(elementOrSelector: ElementOrSelector, onHoverStart: OnHoverStartEvent, options?: HoverOptions): () => void;

declare const isDragging: {
    x: boolean;
    y: boolean;
};
declare function isDragActive(): boolean;

declare function setDragLock(axis: boolean | "x" | "y" | "lockDirection"): (() => void) | null;

export { type AnimationScope, type ElementOrSelector, type HoverOptions, type OnHoverEndEvent, type OnHoverStartEvent, type SelectorCache, type WithQuerySelectorAll, hover, isDragActive, isDragging, resolveElements, setDragLock };
