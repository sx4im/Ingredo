import { ElementOrSelector } from "../utils/resolve-elements";
/**
 * Options for the hover gesture.
 *
 * @public
 */
export interface HoverOptions {
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
export type OnHoverStartEvent = (event: PointerEvent) => void | OnHoverEndEvent;
/**
 * A function to be called when a hover gesture ends.
 *
 * @public
 */
export type OnHoverEndEvent = (event: PointerEvent) => void;
/**
 * Create a hover gesture. hover() is different to .addEventListener("pointerenter")
 * in that it has an easier syntax, filters out polyfilled touch events, interoperates
 * with drag gestures, and automatically removes the "pointerennd" event listener when the hover ends.
 *
 * @public
 */
export declare function hover(elementOrSelector: ElementOrSelector, onHoverStart: OnHoverStartEvent, options?: HoverOptions): () => void;
