import { resolveElements } from "../utils/resolve-elements";
import { isDragActive } from "./drag/state/is-active";
/**
 * Filter out events that are not pointer events, or are triggering
 * while a Motion gesture is active.
 */
function filterEvents(callback) {
    return (event) => {
        if (event.pointerType === "touch" || isDragActive())
            return;
        callback(event);
    };
}
/**
 * Create a hover gesture. hover() is different to .addEventListener("pointerenter")
 * in that it has an easier syntax, filters out polyfilled touch events, interoperates
 * with drag gestures, and automatically removes the "pointerennd" event listener when the hover ends.
 *
 * @public
 */
export function hover(elementOrSelector, onHoverStart, options = {}) {
    const gestureAbortController = new AbortController();
    const eventOptions = {
        passive: true,
        ...options,
        signal: gestureAbortController.signal,
    };
    const onPointerEnter = filterEvents((enterEvent) => {
        const { target } = enterEvent;
        const onHoverEnd = onHoverStart(enterEvent);
        if (!onHoverEnd || !target)
            return;
        const onPointerLeave = filterEvents((leaveEvent) => {
            onHoverEnd(leaveEvent);
            target.removeEventListener("pointerleave", onPointerLeave);
        });
        target.addEventListener("pointerleave", onPointerLeave, eventOptions);
    });
    resolveElements(elementOrSelector).forEach((element) => {
        element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    });
    return () => gestureAbortController.abort();
}
//# sourceMappingURL=hover.js.map